/**
 * Normalizes video URLs for iframe embedding.
 * Converts common share URLs (YouTube, Vimeo, etc.) to embed-friendly formats.
 * Leaves direct video file URLs (.mp4, .webm, etc.) unchanged.
 */
export function normalizeIntroEmbedUrl(url: string): string {
  // Direct video files don't need normalization
  if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
    return url;
  }

  // YouTube watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
  // YouTube share URLs: https://youtu.be/VIDEO_ID
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo URLs: https://vimeo.com/VIDEO_ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // If no pattern matches, return the original URL
  return url;
}
