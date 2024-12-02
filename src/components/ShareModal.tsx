import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: string[];
}

export default function ShareModal({ isOpen, onClose, colors }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const baseUrl = window.location.origin;
      const colorParams = colors.join(',');
      const url = `${baseUrl}?palette=${encodeURIComponent(colorParams)}`;
      setShareUrl(url);
    }
  }, [isOpen, colors]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-bold mb-4">Partager la Palette</h3>

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <QRCodeSVG value={shareUrl} size={200} />
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-6">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 p-2 border rounded-lg bg-gray-50 text-sm"
          />
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {copied ? 'Copié !' : 'Copier'}
          </button>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Aperçu de la palette</h4>
          <div className="flex rounded-lg overflow-hidden h-8">
            {colors.map((color, index) => (
              <div
                key={index}
                className="flex-1"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
