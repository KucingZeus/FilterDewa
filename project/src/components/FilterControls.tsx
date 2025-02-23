import React from 'react';
import { FilterSettings } from '../types';

interface FilterControlsProps {
  settings: FilterSettings;
  onChange: (settings: FilterSettings) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ settings, onChange }) => {
  const handleChange = (key: keyof FilterSettings, value: number) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  const controls = [
    {
      key: 'brightness' as keyof FilterSettings,
      label: 'Brightness',
      min: 0,
      max: 200,
      step: 1,
      unit: '%'
    },
    {
      key: 'contrast' as keyof FilterSettings,
      label: 'Contrast',
      min: 0,
      max: 200,
      step: 1,
      unit: '%'
    },
    {
      key: 'saturation' as keyof FilterSettings,
      label: 'Saturation',
      min: 0,
      max: 200,
      step: 1,
      unit: '%'
    },
    {
      key: 'grayscale' as keyof FilterSettings,
      label: 'Grayscale',
      min: 0,
      max: 100,
      step: 1,
      unit: '%'
    },
    {
      key: 'sepia' as keyof FilterSettings,
      label: 'Sepia',
      min: 0,
      max: 100,
      step: 1,
      unit: '%'
    },
    {
      key: 'blur' as keyof FilterSettings,
      label: 'Blur',
      min: 0,
      max: 10,
      step: 0.1,
      unit: 'px'
    }
  ];

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      <div className="space-y-4">
        {controls.map((control) => (
          <div key={control.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {control.label} ({settings[control.key]}{control.unit})
            </label>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={settings[control.key]}
              onChange={(e) => handleChange(control.key, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterControls;