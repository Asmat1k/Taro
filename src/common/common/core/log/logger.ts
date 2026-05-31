import { LogLevel } from "./LogLevel"

interface Logger {
  trace(message: string, ...args: Array<unknown>): void
  debug(message: string, ...args: Array<unknown>): void
  info(message: string, ...args: Array<unknown>): void
  warn(message: string, ...args: Array<unknown>): void
  error(message: string, ...args: Array<unknown>): void
}

const isDev = import.meta.env.DEV

function print(level: LogLevel, scope: string, template: string, ...args: Array<unknown>): void {
  const time = getTime()
  const prefix = `[${time}] ${level} [${scope}]`

  const message = formatMessage(template, ...args)

  switch (level) {
    case LogLevel.TRACE:
      console.trace(`${prefix} ${message}`)
      break
    case LogLevel.DEBUG:
      if (!isDev) return
      console.debug(`${prefix} ${message}`)
      break

    case LogLevel.INFO:
      console.info(`${prefix} ${message}`)
      break

    case LogLevel.WARN:
      console.warn(`${prefix} ${message}`)
      break

    case LogLevel.ERROR:
      console.error(`${prefix} ${message}`)
      break
  }
}

export function makeLogger(scope: string): Logger {
  return {
    trace: (message, ...args) =>
      print(LogLevel.TRACE, scope, message, ...args),

    debug: (message, ...args) =>
      print(LogLevel.DEBUG, scope, message, ...args),

    info: (message, ...args) =>
      print(LogLevel.INFO, scope, message, ...args),

    warn: (message, ...args) =>
      print(LogLevel.WARN, scope, message, ...args),

    error: (message, ...args) =>
      print(LogLevel.ERROR, scope, message, ...args),
  }
}

function getTime(): string {
  const now = new Date()

  return now.toLocaleTimeString("ru-RU", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }) + `.${now.getMilliseconds().toString().padStart(3, "0")}`
}

function serialize(value: unknown): string {
  if (value instanceof Headers) {
    return JSON.stringify(Object.fromEntries(value))
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value)
  }
  return String(value)
}

function formatMessage(template: string, ...args: Array<unknown>): string {
  let result = template
  for (const arg of args) {
    result = result.replace("{}", serialize(arg))
  }
  return result
}
