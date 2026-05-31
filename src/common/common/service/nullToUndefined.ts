export function nullToUndefined(value: unknown): unknown {
  if (value === null) return undefined
  if (Array.isArray(value)) return value.map(nullToUndefined)
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([ k, v ]) => [ k, nullToUndefined(v) ])
    )
  }
  return value
}
