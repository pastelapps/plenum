export interface InstagramPost {
  id: string;
  permalink: string;
  timestamp: string;
  username: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
}
