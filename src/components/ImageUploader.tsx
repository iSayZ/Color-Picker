import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void;
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          onImageUpload(result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full max-w-xl p-12 mx-auto mt-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 
        ${isDragging 
          ? 'border-blue-500 bg-blue-50 scale-105 shadow-2xl' 
          : 'border-gray-300 hover:border-blue-400 hover:scale-102 hover:shadow-lg bg-white'
        }`}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 animate-pulse ${isDragging ? 'scale-110' : ''}`} />
          <svg
            className="w-20 h-20 text-gray-400 relative z-10"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-all duration-300 ${isDragging ? 'stroke-blue-500' : 'stroke-current'}`}
            />
          </svg>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          Glissez et déposez une image ici
        </p>
        <p className="mt-2 text-sm text-gray-500">
          ou <span className="text-blue-500 hover:text-blue-600">parcourez vos fichiers</span>
        </p>
        <p className="mt-2 text-xs text-gray-400">
          PNG, JPG, GIF jusqu'à 10MB
        </p>
      </div>
    </div>
  );
}
