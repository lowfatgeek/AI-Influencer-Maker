import React, { useState, useEffect } from 'react';
import { GenerationResult } from '../types';

interface OutputDisplayProps {
  result: GenerationResult | null;
  isLoading: boolean;
  aspectRatio: string;
}

type CopyType = 'en' | 'id' | 'long';

const OutputDisplay: React.FC<OutputDisplayProps> = ({ result, isLoading, aspectRatio }) => {
  const [copiedPromptEn, setCopiedPromptEn] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState(false);
  const [copiedPromptLong, setCopiedPromptLong] = useState(false);
  const [showLongPrompt, setShowLongPrompt] = useState(false);

  const [loadedImages, setLoadedImages] = useState<[boolean, boolean]>([false, false]);
  const [errorImages, setErrorImages] = useState<[boolean, boolean]>([false, false]);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  
  // Debug State
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Reset states when result changes
  useEffect(() => {
    if (result) {
      setLoadedImages([false, false]);
      setErrorImages([false, false]);
      setLogs([]); // Clear logs on new generation
      setShowLongPrompt(false); // Close accordion on new gen
    }
  }, [result]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const handleCopy = (text: string, type: CopyType) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedPromptId(true);
      setTimeout(() => setCopiedPromptId(false), 2000);
    } else if (type === 'long') {
      setCopiedPromptLong(true);
      setTimeout(() => setCopiedPromptLong(false), 2000);
    } else {
      setCopiedPromptEn(true);
      setTimeout(() => setCopiedPromptEn(false), 2000);
    }
  };

  const handleImageLoad = (index: 0 | 1) => {
      addLog(`Image ${index === 0 ? 'A' : 'B'} loaded successfully.`);
      setLoadedImages(prev => {
          const newLoaded = [...prev] as [boolean, boolean];
          newLoaded[index] = true;
          return newLoaded;
      });
  }

  const handleImageError = async (index: 0 | 1) => {
    const label = index === 0 ? 'A' : 'B';
    const url = result?.images[index].url;
    
    addLog(`ERROR: Image ${label} failed to trigger onLoad.`);
    if (url) {
        addLog(`URL Length: ${url.length} chars`);
        addLog(`URL: ${url}`);
        
        // Diagnostic Fetch
        try {
            addLog(`Starting diagnostic fetch for Image ${label}...`);
            const res = await fetch(url);
            addLog(`Fetch Status: ${res.status} ${res.statusText}`);
            const contentType = res.headers.get('content-type');
            addLog(`Content-Type: ${contentType}`);
            
            if (!res.ok) {
                const text = await res.text();
                addLog(`Response Body: ${text.slice(0, 300)}`);
            } else {
                addLog(`Fetch success (200 OK). Browser img tag failed. Possible CORS or decoding issue.`);
            }
        } catch (err: any) {
            addLog(`Diagnostic Fetch Exception: ${err.message}`);
        }
    }

    setErrorImages(prev => {
        const newError = [...prev] as [boolean, boolean];
        newError[index] = true;
        return newError;
    });
    // Also mark as loaded to remove spinner
    setLoadedImages(prev => {
        const newLoaded = [...prev] as [boolean, boolean];
        newLoaded[index] = true;
        return newLoaded;
    });
    
    // Auto-open logs on error
    setShowLogs(true);
  }

  const handleDownload = async (url: string, filename: string) => {
    try {
      setIsDownloading(true);
      addLog(`Starting download for ${filename}`);
      
      if (url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Download fetch failed: ${response.status}`);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(blobUrl);
      }
      addLog(`Download successful.`);
    } catch (error: any) {
      addLog(`Download failed: ${error.message}`);
      console.error('Download failed:', error);
      window.open(url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  // Calculate container aspect ratio class
  const aspectRatioClass = aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-[16/9]';

  // Placeholder/Skeleton component
  const Skeleton = () => (
    <div className={`w-full ${aspectRatioClass} bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center`}>
      <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-sm font-medium">Generating AI Influencer...</span>
      </div>
    </div>
  );

  const renderImageSlot = (index: 0 | 1) => {
    const imgData = result!.images[index];
    const isLoaded = loadedImages[index];
    const isError = errorImages[index];

    return (
      <div className="relative group">
        <div className="absolute top-2 left-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none">Image {index === 0 ? 'A' : 'B'}</div>
        
        {!isError && isLoaded && (
          <button 
            onClick={() => handleDownload(imgData.url, `influencer-${imgData.seed}-${index === 0 ? 'A' : 'B'}.jpg`)}
            disabled={isDownloading}
            className="absolute top-2 right-2 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-110"
            title="Download Image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m3 3l3-3m-3 3V3" />
            </svg>
          </button>
        )}

        <div className={`w-full ${aspectRatioClass} bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md relative`}>
            {/* Loading Overlay */}
            {!isLoaded && !isError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse z-10">
                    <span className="text-xs text-gray-500">Loading bytes...</span>
                </div>
            )}
            
            {/* Error Overlay */}
            {isError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-red-500 z-20 p-4 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <span className="text-sm font-bold">Failed to load</span>
                    <button 
                      onClick={() => setShowLogs(true)}
                      className="mt-2 text-xs bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-red-600 dark:text-red-400 hover:underline"
                    >
                      View Logs
                    </button>
                    <a href={imgData.url} target="_blank" rel="noopener noreferrer" className="mt-1 text-xs text-blue-500 hover:underline block">
                        Direct Link
                    </a>
                </div>
            )}

            <img
              src={imgData.url}
              alt={`Generated Result ${index === 0 ? 'A' : 'B'}`}
              className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${isError ? 'hidden' : 'block'}`}
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
            />
            
            {!isError && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <p className="text-xs text-gray-300 font-mono">Seed: {imgData.seed}</p>
                <p className="text-xs text-gray-300 font-mono">Model: {imgData.model}</p>
              </div>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Image A */}
        {isLoading ? <Skeleton /> : result ? renderImageSlot(0) : (
             <div className={`w-full ${aspectRatioClass} bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600`}>
              <span className="text-gray-400 text-sm">Preview Area A</span>
            </div>
        )}

        {/* Image B */}
        {isLoading ? <Skeleton /> : result ? renderImageSlot(1) : (
             <div className={`w-full ${aspectRatioClass} bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600`}>
              <span className="text-gray-400 text-sm">Preview Area B</span>
            </div>
        )}
      </div>

      {result && !isLoading && (
        <>
            <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                {/* EN Prompt */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prompt (English)</span>
                    <button
                        onClick={() => handleCopy(result.promptEn, 'en')}
                        className={`text-xs px-2 py-1 rounded border transition-all ${
                        copiedPromptEn
                            ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                        }`}
                    >
                        {copiedPromptEn ? 'Copied!' : 'Copy EN'}
                    </button>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed break-words whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {result.promptEn}
                    </div>
                </div>

                {/* ID Prompt */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prompt (Indonesian)</span>
                    <button
                        onClick={() => handleCopy(result.promptId, 'id')}
                        className={`text-xs px-2 py-1 rounded border transition-all ${
                        copiedPromptId
                            ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                        }`}
                    >
                        {copiedPromptId ? 'Copied!' : 'Copy ID'}
                    </button>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed break-words whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {result.promptId}
                    </div>
                </div>
            </div>

            {/* Long Version Prompt Accordion */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                <button 
                    onClick={() => setShowLongPrompt(!showLongPrompt)}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <span>Long Version Prompt (Detailed)</span>
                    <div className="flex items-center gap-2">
                        <span>{showLongPrompt ? 'Hide' : 'Show'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform ${showLongPrompt ? 'rotate-180' : ''}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </button>
                
                {showLongPrompt && (
                    <div className="p-3 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={() => handleCopy(result.promptLong, 'long')}
                                className={`text-xs px-2 py-1 rounded border transition-all ${
                                copiedPromptLong
                                    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                                }`}
                            >
                                {copiedPromptLong ? 'Copied!' : 'Copy Long Prompt'}
                            </button>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed break-words whitespace-pre-wrap max-h-60 overflow-y-auto">
                            {result.promptLong}
                        </div>
                    </div>
                )}
            </div>

            {/* Debug Logs Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                <button 
                    onClick={() => setShowLogs(!showLogs)}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <span>System Logs / Debug</span>
                    <span>{showLogs ? 'Hide' : 'Show'}</span>
                </button>
                
                {showLogs && (
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-black text-green-400 font-mono text-xs h-48 overflow-y-auto whitespace-pre-wrap break-all">
                        {logs.length === 0 ? (
                            <span className="text-gray-500">No logs available.</span>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} className="mb-1 border-b border-gray-800 pb-1 last:border-0">{log}</div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
      )}
    </div>
  );
};

export default OutputDisplay;