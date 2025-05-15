import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { X } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
  presetColors?: string[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  color, 
  onChange, 
  onClose,
  presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080',
    '#800000', '#808000', '#008000', '#800080', '#008080',
    '#000080', '#FFA500', '#A52A2A', '#F5F5DC', '#FFC0CB'
  ]
}) => {
  const [currentColor, setCurrentColor] = useState(color);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Mettre à jour la couleur lorsque le composant parent change la couleur
  useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  // Gérer les clics en dehors du sélecteur de couleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Appliquer la couleur et fermer le sélecteur
  const handleColorSelect = (color: string) => {
    setCurrentColor(color);
    onChange(color);
  };

  return (
    <div 
      ref={pickerRef}
      className="absolute z-50 bg-white p-4 rounded-md shadow-lg border border-gray-200"
      style={{ width: '240px' }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Sélecteur de couleurs</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>
      
      <HexColorPicker 
        color={currentColor} 
        onChange={setCurrentColor} 
        className="w-full mb-3"
      />
      
      <div className="flex items-center mb-3">
        <div 
          className="w-8 h-8 rounded border border-gray-300 mr-2"
          style={{ backgroundColor: currentColor }}
        />
        <input
          type="text"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
          onBlur={() => onChange(currentColor)}
          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
        />
      </div>
      
      <div className="flex flex-wrap gap-1">
        {presetColors.map((presetColor) => (
          <button
            key={presetColor}
            onClick={() => handleColorSelect(presetColor)}
            className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
            style={{ backgroundColor: presetColor }}
            title={presetColor}
          />
        ))}
      </div>
      
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => onChange(currentColor)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Appliquer
        </button>
      </div>
    </div>
  );
};

export default ColorPicker;
