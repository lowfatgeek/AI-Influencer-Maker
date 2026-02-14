import { HairModelOption, SelectOption } from './types';

// Retrieve Pollinations API key from environment variables.
// If not configured, it defaults to an empty string (allowing free tier usage).
export const POLLINATIONS_KEY = process.env.POLLINATIONS_KEY || '';

export const SHOT_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Half-Body', value: 'Half-body' },
  { label: 'Full-Body', value: 'Full-body' },
];

export const ETHNICITY_OPTIONS: SelectOption[] = [
  { label: 'Javanese', value: 'Javanese' },
  { label: 'Sundanese', value: 'Sundanese' },
  { label: 'Dayak', value: 'Dayak' },
  { label: 'Malay', value: 'Malay' },
  { label: 'Bugis', value: 'Bugis' },
  { label: 'Papuan', value: 'Papuan' },
  { label: 'Chinese', value: 'Chinese' },
  { label: 'Korean', value: 'Korean' },
  { label: 'Arab', value: 'Arab' },
  { label: 'Bengali', value: 'Bengali' },
  { label: 'Japanese', value: 'Japanese' },
  { label: 'White American', value: 'White American' },
  { label: 'Hispanic', value: 'Hispanic' },
  { label: 'African', value: 'African' },
  { label: 'Irish', value: 'Irish' },
  { label: 'German', value: 'German' },
  { label: 'Italian', value: 'Italian' },
];

export const AGE_RANGE_OPTIONS: SelectOption[] = [
  { label: '20s', value: 'early-to-late 20s' },
  { label: 'Mid 20s', value: 'mid 20s' },
  { label: '30s', value: 'early-to-late 30s' },
  { label: 'Mid 30s', value: 'mid 30s' },
  { label: '40s', value: 'early-to-late 40s' },
  { label: 'Mid 40s', value: 'mid-to-late 40s' },
  { label: '50s', value: '50s' },
];

export const HAIR_COLOR_OPTIONS: SelectOption[] = [
  { label: 'Natural Black', value: 'natural black' },
  { label: 'Dark Brown', value: 'dark brown' },
  { label: 'Light Brown (Blonde)', value: 'light brown (dirty blonde)' },
  { label: 'Wine Red', value: 'wine red' },
  { label: 'Black with Gray Highlights', value: 'black hair with gray highlights' },
  { label: 'Platinum Blonde', value: 'platinum blonde' },
  { label: 'Bright Red', value: 'bright red' },
  { label: 'Dark Blue', value: 'dark blue' },
  { label: 'Pastel Pink', value: 'pastel pink' },
  { label: 'Green', value: 'green' },
  { label: 'Purple', value: 'purple' },
  { label: 'Silver/Gray', value: 'silver/gray' },
  { label: 'Ombre', value: 'ombre brown-to-blonde' },
];

export const HAIR_MODEL_OPTIONS: HairModelOption[] = [
  { label: 'High Ponytail', value: 'high ponytail', type: 'f' },
  { label: 'Pixie Cut', value: 'pixie cut', type: 'f' },
  { label: 'Classic Bob', value: 'classic bob cut', type: 'f' },
  { label: 'French Bob', value: 'french bob', type: 'f' },
  { label: 'Long Bob (Lob)', value: 'long bob (lob)', type: 'f' },
  { label: 'Shaggy Layered', value: 'shaggy layered cut', type: 'f' },
  { label: 'Sleek Bob', value: 'sleek straight bob', type: 'f' },
  { label: 'Butterfly Cut', value: 'butterfly haircut', type: 'f' },
  { label: 'Korean Layer Cut', value: 'Korean layer cut', type: 'f' },
  { label: 'Buzz Cut', value: 'buzz cut', type: 'm' },
  { label: 'French Crop', value: 'French crop', type: 'm' },
  { label: 'Two Block', value: 'two block haircut', type: 'm' },
  { label: 'Comma Hair', value: 'comma hairstyle', type: 'm' },
  { label: 'Modern Mohawk', value: 'modern mohawk', type: 'm' },
  { label: 'Man Bun', value: 'man bun', type: 'm' },
  { label: 'Long Wavy', value: 'long wavy hair', type: 'unisex' },
  { label: 'Short Wavy', value: 'short wavy hair', type: 'unisex' },
  { label: 'Long Straight', value: 'long straight hair', type: 'unisex' },
  { label: 'Short Straight', value: 'short straight hair', type: 'unisex' },
];

export const OUTFIT_OPTIONS: SelectOption[] = [
  { label: 'Casual Chic', value: 'Casual Chic (t-shirt, jeans, blazer)' },
  { label: 'Elegant', value: 'Elegant (modern dress)' },
  { label: 'Streetwear', value: 'Streetwear (hoodie, sneakers)' },
  { label: 'Boho', value: 'Boho (flowy dress, accessories)' },
  { label: 'Sporty', value: 'Sporty (activewear)' },
  { label: 'Professional', value: 'Professional (shirt, tailored trousers)' },
];

export const BACKGROUND_OPTIONS: SelectOption[] = [
  { label: 'Plain White', value: 'plain white' },
  { label: 'Plain Light Gray', value: 'plain light gray' },
  { label: 'Plain Cream', value: 'plain cream' },
  { label: 'Plain Pastel Blue', value: 'plain pastel blue' },
];

export const MODEL_OPTIONS: SelectOption[] = [
  { label: 'Z-Image Turbo', value: 'zimage' },
  { label: 'Google Imagen 4', value: 'imagen-4' },
];