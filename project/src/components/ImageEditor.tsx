import React, { useState, useRef } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { FilterSettings, ImageState } from '../types';
import FilterControls from './FilterControls';
import { toast } from 'react-toastify';
import { FiUpload, FiDownload, FiRefreshCw } from 'react-icons/fi';

const defaultFilterSettings: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  blur: 0,
};

const ImageEditor: React.FC = () => {
  const [imageState, setImageState] = useState<ImageState>({
    originalImage: null,
    processedImage: null,
    filterSettings: defaultFilterSettings,
  });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImageState({
          originalImage: e.target?.result as string,
          processedImage: e.target?.result as string,
          filterSettings: defaultFilterSettings,
        });
      };
      reader.onerror = () => {
        toast.error('Error reading the image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilters = (settings: FilterSettings) => {
    setImageState(prev => ({
      ...prev,
      filterSettings: settings,
    }));
  };

  const resetFilters = () => {
    setImageState(prev => ({
      ...prev,
      filterSettings: defaultFilterSettings,
    }));
    toast.success('Filters reset successfully!');
  };

  const downloadImage = () => {
    if (!imageRef.current) {
      toast.error('No image to download');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast.error('Unable to process image');
        return;
      }

      canvas.width = imageRef.current.naturalWidth;
      canvas.height = imageRef.current.naturalHeight;

      // Apply filters
      const { brightness, contrast, saturation, grayscale, sepia, blur } = imageState.filterSettings;
      ctx.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
        grayscale(${grayscale}%)
        sepia(${sepia}%)
        blur(${blur}px)
      `;

      ctx.drawImage(imageRef.current, 0, 0);

      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Error downloading the image');
      console.error('Download error:', error);
    }
  };

  const getFilterStyle = () => {
    const { brightness, contrast, saturation, grayscale, sepia, blur } = imageState.filterSettings;
    return {
      filter: `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
        grayscale(${grayscale}%)
        sepia(${sepia}%)
        blur(${blur}px)
      `,
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center">
            Image Processing App
          </h1>

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Image Upload and Preview Section */}
            <div className="flex-1">
              <div className="mb-4">
                <label className="inline-block px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                  <FiUpload className="inline-block mr-2" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="relative min-h-[300px] md:min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                {imageState.originalImage ? (
                  <img
                    ref={imageRef}
                    src={imageState.originalImage}
                    alt="Preview"
                    className="max-w-full h-auto"
                    style={getFilterStyle()}
                    onError={() => {
                      toast.error('Error loading image');
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center px-4">
                    Upload an image to start editing
                  </div>
                )}
              </div>

              {imageState.originalImage && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={downloadImage}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FiDownload className="inline-block mr-2" />
                    Download
                  </button>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FiRefreshCw className="inline-block mr-2" />
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Filter Controls Section */}
            <div className="w-full lg:w-72">
              <FilterControls
                settings={imageState.filterSettings}
                onChange={applyFilters}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;