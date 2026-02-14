export type Gender = 'Female' | 'Male';
export type Mode = 'Hijab' | 'No Hijab';
export type AspectRatio = '9:16' | '16:9';
export type ModelAI = 'zimage' | 'imagen-4';
export type ShotType = 'Half-body' | 'Full-body';

export interface HairModelOption {
  label: string;
  value: string; // English token
  type: 'f' | 'm' | 'unisex';
}

export interface FormData {
  gender: Gender;
  mode: Mode;
  ethnicity: string;
  ageRange: string;
  hairColor: string;
  hairModel: string;
  outfit: string;
  background: string;
  aspectRatio: AspectRatio;
  modelAI: ModelAI;
  shotType: ShotType;
  details: string;
}

export interface GeneratedImage {
  url: string;
  seed: number;
  model: string;
}

export interface GenerationResult {
  images: [GeneratedImage, GeneratedImage];
  promptEn: string;
  promptId: string;
  promptLong: string;
}

export interface SelectOption {
  label: string;
  value: string; // English token or ID key
}