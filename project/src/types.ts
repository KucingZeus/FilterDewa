export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  sepia: number;
  blur: number;
}

export interface ImageState {
  originalImage: string | null;
  processedImage: string | null;
  filterSettings: FilterSettings;
}