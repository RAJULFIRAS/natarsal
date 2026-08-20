type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMeta {
  [key: string]: unknown;
}

class Logger {
  private level: LogLevel =
    (import.meta.env.VITE_LOG_LEVEL as LogLevel) || "info";
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.level];
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    meta?: LogMeta,
  ): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] ${level.toUpperCase()}`;
    if (meta) {
      return `${prefix}: ${message} ${JSON.stringify(meta)}`;
    }
    return `${prefix}: ${message}`;
  }

  debug(message: string, meta?: LogMeta): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, meta));
    }
  }

  info(message: string, meta?: LogMeta): void {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage("info", message, meta));
    }
  }

  warn(message: string, meta?: LogMeta): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, meta));
    }
  }

  error(message: string, meta?: LogMeta): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, meta));
    }
  }
}

export const logger = new Logger();
export function createLogger(_context: string): Logger {
  return logger;
}
