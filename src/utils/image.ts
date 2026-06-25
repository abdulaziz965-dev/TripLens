export function getPlaceImagePath(
  city: string,
  slug: string
) {
  return `/places/${city}/${slug}.jpg`;
}