'use client';

import { useState, useEffect } from 'react';
import ImageUploader from '../components/ImageUploader';
import ColorCard from '../components/ColorCard';
import Navbar from '../components/Navbar';
import ShareModal from '../components/ShareModal';
import Spinner from '../components/Spinner';
import { extractColors } from '../utils/colorExtractor';
import { saveToHistory } from '../utils/cookieManager';

export default function Home() {
  const [colors, setColors] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [paletteName, setPaletteName] = useState('');

  useEffect(() => {
    // Charger la palette depuis l'URL si elle existe
    const params = new URLSearchParams(window.location.search);
    const paletteParam = params.get('palette');
    if (paletteParam) {
      const paletteColors = paletteParam.split(',');
      setColors(paletteColors);
    }
  }, []);

  const handleImageUpload = async (imageData: string) => {
    try {
      setIsExtracting(true);
      setSelectedImage(imageData);
      const extractedColors = await extractColors(imageData);
      setColors(extractedColors);
      // Sauvegarder dans l'historique avec le nom
      saveToHistory(extractedColors, paletteName);
    } catch (error) {
      console.error('Error extracting colors:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Extrayez les couleurs de vos images
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Glissez et déposez une image pour découvrir sa palette de couleurs. 
            Chaque couleur peut être copiée en un clic pour une utilisation facile dans vos projets.
          </p>
        </div>
        
        <ImageUploader onImageUpload={handleImageUpload} />
        
        {selectedImage && (
          <div className="mt-12 flex justify-center">
            <div className="inline-block bg-white rounded-xl shadow-lg overflow-hidden relative">
              <img
                src={selectedImage}
                alt="Selected"
                className={`max-w-full h-auto max-h-[500px] object-contain transition-opacity duration-300 ${
                  isExtracting ? 'opacity-40' : 'opacity-100'
                }`}
              />
              {isExtracting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl">
                    <Spinner message="Extraction des couleurs..." />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {colors.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Palette de Couleurs
              </h2>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={paletteName}
                  onChange={(e) => setPaletteName(e.target.value)}
                  placeholder="Nom de la palette"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Partager
                </button>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto px-4">
              {colors.map((color, index) => (
                <ColorCard key={index} color={color} />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-16 bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>Créé avec ❤️ en utilisant Next.js et TailwindCSS</p>
        </div>
      </footer>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        colors={colors}
      />
    </div>
  );
}
