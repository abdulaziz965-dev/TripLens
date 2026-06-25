export interface ImageProvider {
  getImageUrl(
    place: string,
    city: string
  ): Promise<string | null>;
}