import { LoadingSpinnerProps } from '@/types/components';

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-apple-border rounded-full"></div>
        <div className="absolute inset-0 border-4 border-apple-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
      {message && (
        <p className="text-body text-apple-text-secondary animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
