import { useCallback } from "react";

export function useLogger(context: string) {
  const logInfo = useCallback(
    (message: string, meta?: Record<string, unknown>) => {
      console.info(`[${context}] ${message}`, meta || "");
    },
    [context],
  );

  const logError = useCallback(
    (message: string, meta?: Record<string, unknown>) => {
      console.error(`[${context}] ${message}`, meta || "");
    },
    [context],
  );

  const logWarn = useCallback(
    (message: string, meta?: Record<string, unknown>) => {
      console.warn(`[${context}] ${message}`, meta || "");
    },
    [context],
  );

  const logDebug = useCallback(
    (message: string, meta?: Record<string, unknown>) => {
      console.debug(`[${context}] ${message}`, meta || "");
    },
    [context],
  );

  return {
    logInfo,
    logError,
    logWarn,
    logDebug,
  };
}

export default useLogger;
