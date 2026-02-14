import React, { useMemo } from 'react';
import { FormData, Gender, Mode, AspectRatio, ModelAI, ShotType } from '../types';
import {
  ETHNICITY_OPTIONS,
  AGE_RANGE_OPTIONS,
  HAIR_COLOR_OPTIONS,
  HAIR_MODEL_OPTIONS,
  OUTFIT_OPTIONS,
  BACKGROUND_OPTIONS,
  MODEL_OPTIONS,
  SHOT_TYPE_OPTIONS,
} from '../constants';

interface InputFormProps {
  formData: FormData;
  onChange: (data: FormData) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

// Reusable Select Component with custom arrow
const SelectField = ({ 
  label, 
  value, 
  onChange, 
  options, 
  disabled = false 
}: { 
  label: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
  options: { label: string; value: string }[];
  disabled?: boolean;
}) => (
  <div className="flex flex-col group">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full appearance-none bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3.5 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-white dark:hover:bg-gray-800 shadow-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-2">
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom Chevron Icon */}
      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
);

const InputForm: React.FC<InputFormProps> = ({ formData, onChange, onGenerate, isLoading }) => {
  const handleChange = (field: keyof FormData, value: any) => {
    const newData = { ...formData, [field]: value };
    
    // Auto-correction/Validation logic
    if (field === 'gender') {
       // Check if current hair model is valid for new gender
       const validHairModels = HAIR_MODEL_OPTIONS.filter(opt => opt.type === 'unisex' || (value === 'Female' ? opt.type === 'f' : opt.type === 'm'));
       const currentModelValid = validHairModels.some(opt => opt.value === newData.hairModel);
       if (!currentModelValid) {
           newData.hairModel = validHairModels[0]?.value || '';
       }
    }
    
    onChange(newData);
  };

  const filteredHairModels = useMemo(() => {
    return HAIR_MODEL_OPTIONS.filter((option) => {
      if (option.type === 'unisex') return true;
      if (formData.gender === 'Female') return option.type === 'f';
      if (formData.gender === 'Male') return option.type === 'm';
      return true;
    });
  }, [formData.gender]);

  const isHairSectionVisible = formData.mode === 'No Hijab';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/40 border border-gray-100 dark:border-gray-700 flex flex-col gap-6 h-full relative overflow-hidden">
      
      {/* Header */}
      <div className="relative z-10">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Configuration
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Customize your influencer's look</p>
      </div>

      {/* Scrollable Content Area */}
      <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar -mr-2 pb-28">
        
        {/* Basic Info Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SelectField 
                label="Gender" 
                value={formData.gender} 
                onChange={(e) => handleChange('gender', e.target.value as Gender)}
                options={[{label: 'Female', value: 'Female'}, {label: 'Male', value: 'Male'}]}
            />
             <SelectField 
                label="Mode" 
                value={formData.mode} 
                onChange={(e) => handleChange('mode', e.target.value as Mode)}
                options={[{label: 'No Hijab', value: 'No Hijab'}, {label: 'Hijab', value: 'Hijab'}]}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <SelectField 
                label="Shot Type" 
                value={formData.shotType} 
                onChange={(e) => handleChange('shotType', e.target.value as ShotType)}
                options={SHOT_TYPE_OPTIONS}
            />
             <SelectField 
                label="Age Range" 
                value={formData.ageRange} 
                onChange={(e) => handleChange('ageRange', e.target.value)}
                options={AGE_RANGE_OPTIONS}
            />
        </div>

        <SelectField 
            label="Ethnicity" 
            value={formData.ethnicity} 
            onChange={(e) => handleChange('ethnicity', e.target.value)}
            options={ETHNICITY_OPTIONS}
        />

        {/* Hair Section (Conditional) */}
        {isHairSectionVisible && (
            <div className="p-5 bg-gray-50/80 dark:bg-gray-700/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-600 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Hair Style</span>
                </div>
                <div className="grid grid-cols-1 gap-5">
                    <SelectField 
                        label="Hair Color" 
                        value={formData.hairColor} 
                        onChange={(e) => handleChange('hairColor', e.target.value)}
                        options={HAIR_COLOR_OPTIONS}
                    />
                    <SelectField 
                        label="Hair Model" 
                        value={formData.hairModel} 
                        onChange={(e) => handleChange('hairModel', e.target.value)}
                        options={filteredHairModels}
                    />
                </div>
            </div>
        )}

        {/* Style Section */}
        <div className="space-y-5">
             <SelectField 
                label="Outfit" 
                value={formData.outfit} 
                onChange={(e) => handleChange('outfit', e.target.value)}
                options={OUTFIT_OPTIONS}
            />
             <SelectField 
                label="Background" 
                value={formData.background} 
                onChange={(e) => handleChange('background', e.target.value)}
                options={BACKGROUND_OPTIONS}
            />
        </div>

        {/* Technical Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-100 dark:border-gray-700">
             <SelectField 
                label="Aspect Ratio" 
                value={formData.aspectRatio} 
                onChange={(e) => handleChange('aspectRatio', e.target.value)}
                options={[{label: '9:16 (Portrait)', value: '9:16'}, {label: '16:9 (Landscape)', value: '16:9'}]}
            />
             <SelectField 
                label="Model AI" 
                value={formData.modelAI} 
                onChange={(e) => handleChange('modelAI', e.target.value)}
                options={MODEL_OPTIONS}
            />
        </div>

        {/* Details Section */}
        <div className="flex flex-col group">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Additional Details (Optional)</label>
             <textarea
                value={formData.details}
                onChange={(e) => handleChange('details', e.target.value)}
                placeholder="E.g., wearing sunglasses, gold earrings..."
                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium text-sm min-h-[100px] resize-y placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
            />
        </div>
      </div>

      {/* Floating Action Button with Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-gray-800 dark:via-gray-800/90 dark:to-transparent z-20 pt-12">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all transform duration-200 shadow-lg shadow-primary/30 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed scale-[0.98]' 
              : 'bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate AI Influencer'
          )}
        </button>
      </div>
      
      <style>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.2);
        }
      `}</style>
    </div>
  );
};

export default InputForm;