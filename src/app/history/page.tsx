'use client';

import { useState, useEffect } from 'react';
import { getHistory, clearHistory, renamePalette } from '../../utils/cookieManager';
import Navbar from '../../components/Navbar';
import ShareModal from '../../components/ShareModal';

type PaletteHistoryItem = {
  timestamp: number;
  colors: string[];
  name?: string;
};

export default function History() {
  const [history, setHistory] = useState<PaletteHistoryItem[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<string[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingName, setEditingName] = useState<number | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleShare = (colors: string[]) => {
    setSelectedPalette(colors);
    setIsShareModalOpen(true);
  };

  const startEditing = (timestamp: number, currentName: string = '') => {
    setEditingName(timestamp);
    setNewName(currentName);
  };

  const handleRename = (timestamp: number) => {
    renamePalette(timestamp, newName);
    setHistory(getHistory());
    setEditingName(null);
    setNewName('');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Historique des Palettes</h1>
          <button
            onClick={handleClearHistory}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 rounded-md transition-colors duration-200"
          >
            Effacer l'historique
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune palette dans l'historique</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            {history.map((item) => (
              <div key={item.timestamp} className="bg-white rounded-xl shadow-md overflow-hidden w-fit mx-auto">
                <div className="h-24 flex">
                  {item.colors.map((color: string, index: number) => (
                    <div
                      key={index}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                <div className="p-4">
                  {editingName === item.timestamp ? (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded-md"
                        placeholder="Nom de la palette"
                        autoFocus
                      />
                      <button
                        onClick={() => handleRename(item.timestamp)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {item.name || 'Palette sans nom'}
                      </span>
                      <button
                        onClick={() => startEditing(item.timestamp, item.name)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-500 mb-4">
                    {formatDate(item.timestamp)}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {item.colors.map((color: string, index: number) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-md border border-gray-200"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => handleShare(item.colors)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        colors={selectedPalette}
      />
    </div>
  );
}
