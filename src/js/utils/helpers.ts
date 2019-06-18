export function toMin(ms: number) {
  if (!ms) {
    return undefined
  }
  return ms / 60000
}

export function toSec(ms: number) {
  if (!ms) {
    return undefined
  }
  return ms / 1000
}