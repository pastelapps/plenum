import type { InstagramPost } from "@/types/instagram";

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username&access_token=${token}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}
