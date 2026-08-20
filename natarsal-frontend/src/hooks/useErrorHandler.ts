import { useState, useCallback } from "react";

interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: "",
  });

  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error handled:", message);
    setError({
      hasError: true,
      message,
    });
  }, []);

  const clearError = useCallback(() => {
    setError({
      hasError: false,
      message: "",
    });
  }, []);

  return {
    error,
    handleError,
    clearError,
    hasError: error.hasError,
  };
}

export default useErrorHandler;
