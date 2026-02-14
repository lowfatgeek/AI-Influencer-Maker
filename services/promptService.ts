import { POLLINATIONS_KEY } from '../constants';
import { FormData } from '../types';

export const buildPrompts = (formData: FormData): { promptEn: string, promptId: string, promptLong: string } => {
  const {
    gender,
    mode,
    ethnicity,
    ageRange, // Already English value from select
    hairColor, // English value
    hairModel, // English value
    outfit, // English value
    background, // English value
    shotType,
    details,
  } = formData;

  const genderEn = gender === 'Female' ? 'woman' : 'man';
  const genderId = gender === 'Female' ? 'Wanita' : 'Pria';

  // Determine Shot Type string
  const shotTypeEn = shotType === 'Full-body' 
    ? 'Full-body shot, wide angle, showing shoes and entire outfit' 
    : 'Half-body portrait';
  
  const shotTypeId = shotType === 'Full-body' 
    ? 'Foto seluruh badan, terlihat sepatu' 
    : 'Potret setengah badan';

  const shotTypeLong = shotType === 'Full-body'
    ? 'Full-body shot showing the entire physique from head to toe'
    : 'Half-body portrait capturing head to waist';

  // --- ENGLISH PROMPT CONSTRUCTION (Optimized for URL Length) ---
  // We use a comma-separated keyword style to keep the URL length under 2000 chars (preventing 530 errors).
  
  let hairStringEn = '';
  if (mode === 'No Hijab') {
    hairStringEn = `${hairColor} hair, ${hairModel}`;
  } else {
    hairStringEn = `wearing modest hijab, realistic fabric texture`;
  }

  let detailStringEn = '';
  if (details && details.trim().length > 0) {
    detailStringEn = details.trim();
  }

  // Keywords-based prompt (approx 400-600 chars, well within safety limits)
  const enParts = [
    shotTypeEn,
    `photorealistic fashion model ${genderEn}`,
    `${ethnicity} ethnicity`,
    `${ageRange}`,
    `distinct facial features`,
    `realistic skin texture`,
    `natural pores`,
    hairStringEn,
    `expressive eyes`,
    `standing pose`,
    `facing camera`,
    `outfit ${outfit}`,
    `studio lighting`,
    `soft shadows`,
    `${background} background`,
    `85mm lens`,
    `f/1.8`,
    `sharp focus`,
    `editorial photography`,
    `raw style`,
    detailStringEn
  ];

  const promptEn = enParts.filter(Boolean).join(', ');

  // --- INDONESIAN PROMPT CONSTRUCTION (Display Only) ---
  // Simple mapping for display purposes - assumes English values are passed but we structure them in Indonesian context
  
  let hairStringId = '';
  if (mode === 'No Hijab') {
    hairStringId = `Rambut ${hairColor}, gaya ${hairModel}`;
  } else {
    hairStringId = `Berhijab sopan, tekstur kain realistis`;
  }

  const idParts = [
    shotTypeId,
    `model fesyen fotorealistik ${genderId}`,
    `etnis ${ethnicity}`,
    `usia ${ageRange}`,
    `fitur wajah khas`,
    `tekstur kulit realistis`,
    hairStringId,
    `pose berdiri menghadap kamera`,
    `pakaian ${outfit}`,
    `pencahayaan studio`,
    `latar belakang ${background}`,
    `lensa 85mm`,
    `fokus tajam`,
    `fotografi editorial`,
    details.trim()
  ];

  const promptId = idParts.filter(Boolean).join(', ');

  // --- LONG PROMPT CONSTRUCTION (Detailed Template) ---
  
  // Helper for natural language sentences in long prompt
  const hairDescLong = mode === 'No Hijab' 
    ? `${hairColor} hair styled in a ${hairModel}` 
    : 'wearing a modest hijab with high-quality realistic fabric texture';
    
  const accessoriesLong = details && details.trim().length > 0 ? details.trim() : 'minimal accessories';
  const poseDesc = shotType === 'Full-body' 
    ? 'standing facing forward toward the camera in a relaxed symmetrical stance, full figure visible including shoes' 
    : 'standing facing forward toward the camera in a relaxed symmetrical stance';

  const longTemplate = `${shotTypeLong} of a photorealistic AI influencer ${genderEn}, ${ethnicity} ethnicity, approximately ${ageRange}. Identity: distinct and naturally structured facial anatomy with realistic proportions, subtle asymmetry, and authentic ethnic characteristics. Pose: ${poseDesc}, weight evenly distributed, shoulders relaxed, posture confident. Arms positioned naturally with relaxed hands. Skin: natural skin texture with visible pores, micro-details, and realistic imperfections. Avoid over-smoothing. Hair: ${hairDescLong}. Face: natural facial features appropriate to ethnicity, expressive eyes, authentic emotion, wearing ${accessoriesLong}. Outfit: ${outfit}. Lighting: soft professional studio lighting with realistic falloff and gentle shadows. Background: clean ${background} backdrop with minimal distractions. Camera: captured as real-world photography using a full-frame camera, 85mm lens, shallow depth of field, ultra-sharp focus, realistic color science. Style: hyper-realistic, editorial photography, premium influencer aesthetic, extremely detailed, natural body proportions. ${promptEn}`;

  const promptLong = longTemplate;

  return { promptEn, promptId, promptLong };
};

export const generateImageUrl = (prompt: string, model: string, aspectRatio: string, seed: number): string => {
  const encodedPrompt = encodeURIComponent(prompt);
  
  // Resolution logic
  const width = aspectRatio === '9:16' ? 720 : 1280;
  const height = aspectRatio === '9:16' ? 1280 : 720;
  
  const keyParam = POLLINATIONS_KEY ? `&key=${POLLINATIONS_KEY}` : '';
  
  // UPDATED URL Structure as requested: https://gen.pollinations.ai/image/
  // We still include the parameters for width, height, model, seed, etc.
  return `https://gen.pollinations.ai/image/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true&enhance=false${keyParam}`;
};