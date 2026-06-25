export function getCityKey(destination: string): string {
  return destination
    .split(",")[0]
    .trim()
    .toLowerCase();
}