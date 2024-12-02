interface SpinnerProps {
  message?: string;
}

export default function Spinner({ message = "Chargement..." }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
      {message && (
        <p className="text-gray-600 text-lg font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
