import { useState, useEffect } from 'react';
import { ColorFormat, convertColor, hexToHsl, hslToHex, HSLColor } from '../utils/colorConverter';

interface ColorCardProps {
  color: string;
}

export default function ColorCard({ color }: ColorCardProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ColorFormat>('HEX');
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [hslValues, setHslValues] = useState<HSLColor>({ h: 0, s: 0, l: 0 });
  const [adjustedColor, setAdjustedColor] = useState(color);

  useEffect(() => {
    const hsl = hexToHsl(color);
    setHslValues(hsl);
    setAdjustedColor(color);
  }, [color]);

  const colorValue = convertColor(adjustedColor, selectedFormat);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(colorValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy color code:', err);
    }
  };

  const handleHslChange = (type: keyof HSLColor, value: number) => {
    const newHsl = { ...hslValues, [type]: value };
    setHslValues(newHsl);
    const newColor = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setAdjustedColor(newColor);
  };

  return (
    <div
      className={`group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
        showAdjustments ? 'w-[280px]' : 'w-[220px]'
      }`}
    >
      <div
        className="h-40 w-full cursor-pointer transition-transform duration-300 relative"
        style={{ backgroundColor: adjustedColor }}
        onClick={copyToClipboard}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-300">
            <span className="text-white text-sm font-medium">Cliquez pour copier</span>
          </div>
        )}
      </div>
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as ColorFormat)}
            className="text-sm font-medium bg-gray-100 border-0 rounded-md px-2 py-1 cursor-pointer hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="HEX">HEX</option>
            <option value="RGB">RGB</option>
            <option value="HSL">HSL</option>
          </select>
          <button
            onClick={() => setShowAdjustments(!showAdjustments)}
            className="text-sm font-medium bg-gray-100 border-0 rounded-md px-2 py-1 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showAdjustments ? 'Masquer' : 'Ajuster'}
          </button>
        </div>
        
        <div className="mb-3">
          <p className="text-sm font-mono font-medium break-all">{colorValue}</p>
        </div>

        {showAdjustments && (
          <div className="space-y-3 mb-4 bg-gray-50 p-3 rounded-lg">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Teinte</span>
                <span>{hslValues.h}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={hslValues.h}
                onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Saturation</span>
                <span>{hslValues.s}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hslValues.s}
                onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-gray-300 to-blue-500 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Luminosité</span>
                <span>{hslValues.l}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hslValues.l}
                onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-black via-gray-500 to-white rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        <button
          onClick={copyToClipboard}
          className={`w-full py-2 px-4 rounded-lg transition-all duration-300 transform 
            ${copied 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 ${copied ? 'focus:ring-green-500' : 'focus:ring-gray-500'}`}
        >
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>
    </div>
  );
}
