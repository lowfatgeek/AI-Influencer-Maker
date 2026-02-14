import { GoogleGenAI } from "@google/genai";

export const generateImagesWithGemini = async (prompt: string, aspectRatio: string): Promise<string[]> => {
  // STRICTLY use the environment variable provided by AI Studio.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API_KEY is missing. Please select an API Key via the AI Studio interface or set the environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // 1. Helper to call Imagen models (generateImages)
  const generateImagen = async (model: string) => {
    console.log(`Attempting generation with ${model}...`);
    // Cast to any to bypass potential strict type mismatches during build with wildcard SDK version
    const response = await ai.models.generateImages({
      model,
      prompt,
      config: {
        numberOfImages: 2,
        aspectRatio: aspectRatio, // "9:16" or "16:9"
        outputMimeType: 'image/jpeg',
      },
    }) as any;

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error(`No images returned by ${model}`);
    }
    
    // Map response structure based on SDK documentation
    return response.generatedImages.map((img: any) => `data:image/jpeg;base64,${img.image.imageBytes}`);
  };

  // 2. Helper to call Gemini Flash Image (generateContent)
  const generateGeminiFlash = async () => {
    console.log("Attempting generation with gemini-2.5-flash-image...");
    const callSingle = async () => {
      // Note: Passing the string directly to contents is supported by the SDK helper
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt,
        config: {
          // @ts-ignore
          imageConfig: {
            aspectRatio: aspectRatio
          }
        }
      });
      
      // Iterate parts to find image
      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part && part.inlineData) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
      throw new Error("No image data found in Gemini Flash response");
    };

    // Run parallel requests to get 2 images
    return Promise.all([callSingle(), callSingle()]);
  };

  // --- Generation Strategy ---
  // We prioritize Flash Image as it is generally more accessible/faster, then upgrade to Imagen if needed/available.
  
  try {
    // Attempt 1: Gemini 2.5 Flash Image (Nano Banana)
    // This model is often more permissive on quotas than the dedicated Imagen 3/4 models
    return await generateGeminiFlash();
  } catch (errFlash: any) {
    console.warn("Gemini Flash Image failed:", errFlash.message);

    try {
        // Attempt 2: Imagen 3 (Often more widely available than 4)
        return await generateImagen('imagen-3.0-generate-001');
    } catch (err3: any) {
        console.warn("Imagen 3.0 failed:", err3.message);
        
        try {
            // Attempt 3: Imagen 4 (High tier)
            return await generateImagen('imagen-4.0-generate-001');
        } catch (err4: any) {
            console.error("All models failed.");
            // Throw the error from the first attempt (Flash) as it's the most likely intended target
            // or concatenate messages for debugging
            throw new Error(`Failed to generate images. Flash Error: ${errFlash.message}. Imagen Error: ${err4.message}`);
        }
    }
  }
};