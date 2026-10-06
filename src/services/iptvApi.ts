import {
  XtreamLoginResponse,
  Category,
  LiveStream,
  VodStream,
  SeriesItem,
  SeriesDetail,
  VodDetail,
  EpgProgram,
} from '../types/iptv';
import {
  DEMO_LIVE_CATEGORIES,
  DEMO_VOD_CATEGORIES,
  DEMO_SERIES_CATEGORIES,
  DEMO_LIVE_STREAMS,
  DEMO_VOD_STREAMS,
  DEMO_SERIES_ITEMS,
  DEMO_SERIES_DETAILS,
  TEST_HLS_URLS,
} from './mockData';

export class XtreamClient {
  serverUrl: string;
  username: string;
  password: string;
  isDemoMode: boolean = false;

  constructor(serverUrl: string, username: string, password: string) {
    this.serverUrl = serverUrl.replace(/\/+$/, '');
    this.username = username.trim();
    this.password = password.trim();
    if (this.username === 'demo' || this.username === 'test' || !this.username) {
      this.isDemoMode = true;
    }
  }

  private buildApiUrl(params: string = ''): string {
    const enc = encodeURIComponent;
    return `${this.serverUrl}/player_api.php?username=${enc(this.username)}&password=${enc(this.password)}${
      params ? '&' + params : ''
    }`;
  }

  private async fetchWithProxy(url: string): Promise<any> {
    // Attempt 1: Direct fetch with 8s timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json, text/plain, */*',
        },
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Direct fetch failed, fallback to local Vite proxy
    }

    // Attempt 2: Through Vite backend proxy route
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Proxy failed
    }

    throw new Error('Network request failed');
  }

  async authenticate(): Promise<XtreamLoginResponse> {
    if (this.isDemoMode) {
      return {
        user_info: {
          username: this.username || 'VIP_Thailand',
          auth: 1,
          status: 'Active',
          exp_date: Math.floor(Date.now() / 1000) + 86400 * 365,
          is_trial: 0,
          active_cons: 1,
          max_connections: 2,
        },
        server_info: {
          url: this.serverUrl,
          port: '8080',
          timezone: 'Asia/Bangkok',
        },
      };
    }

    try {
      const data = await this.fetchWithProxy(this.buildApiUrl(''));
      if (data && data.user_info && data.user_info.auth === 1) {
        return data;
      }
      throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    } catch (e: any) {
      // If server unreachable or error, let user choose demo or fallback
      if (e.message.includes('ชื่อผู้ใช้หรือรหัสผ่าน')) {
        throw e;
      }
      // Demo fallback flag
      this.isDemoMode = true;
      return {
        user_info: {
          username: `${this.username} (Demo Mode)`,
          auth: 1,
          status: 'Active',
          exp_date: Math.floor(Date.now() / 1000) + 86400 * 180,
          is_trial: 1,
          active_cons: 1,
          max_connections: 1,
        },
        server_info: {
          url: this.serverUrl,
          port: '8080',
        },
      };
    }
  }

  async getLiveCategories(): Promise<Category[]> {
    if (this.isDemoMode) return DEMO_LIVE_CATEGORIES;
    try {
      const data = await this.fetchWithProxy(this.buildApiUrl('action=get_live_categories'));
      return Array.isArray(data) ? data : DEMO_LIVE_CATEGORIES;
    } catch {
      return DEMO_LIVE_CATEGORIES;
    }
  }

  async getVodCategories(): Promise<Category[]> {
    if (this.isDemoMode) return DEMO_VOD_CATEGORIES;
    try {
      const data = await this.fetchWithProxy(this.buildApiUrl('action=get_vod_categories'));
      return Array.isArray(data) ? data : DEMO_VOD_CATEGORIES;
    } catch {
      return DEMO_VOD_CATEGORIES;
    }
  }

  async getSeriesCategories(): Promise<Category[]> {
    if (this.isDemoMode) return DEMO_SERIES_CATEGORIES;
    try {
      const data = await this.fetchWithProxy(this.buildApiUrl('action=get_series_categories'));
      return Array.isArray(data) ? data : DEMO_SERIES_CATEGORIES;
    } catch {
      return DEMO_SERIES_CATEGORIES;
    }
  }

  async getLiveStreams(categoryId?: string): Promise<LiveStream[]> {
    if (this.isDemoMode) {
      if (!categoryId || categoryId === 'all') return DEMO_LIVE_STREAMS;
      return DEMO_LIVE_STREAMS.filter((s) => s.category_id === categoryId);
    }
    try {
      const action = categoryId && categoryId !== 'all' 
        ? `action=get_live_streams&category_id=${categoryId}`
        : 'action=get_live_streams';
      const data = await this.fetchWithProxy(this.buildApiUrl(action));
      if (Array.isArray(data) && data.length > 0) return data;
      return DEMO_LIVE_STREAMS;
    } catch {
      return DEMO_LIVE_STREAMS;
    }
  }

  async getVodStreams(categoryId?: string): Promise<VodStream[]> {
    if (this.isDemoMode) {
      if (!categoryId || categoryId === 'all') return DEMO_VOD_STREAMS;
      return DEMO_VOD_STREAMS.filter((s) => s.category_id === categoryId);
    }
    try {
      const action = categoryId && categoryId !== 'all' 
        ? `action=get_vod_streams&category_id=${categoryId}`
        : 'action=get_vod_streams';
      const data = await this.fetchWithProxy(this.buildApiUrl(action));
      if (Array.isArray(data) && data.length > 0) return data;
      return DEMO_VOD_STREAMS;
    } catch {
      return DEMO_VOD_STREAMS;
    }
  }

  async getSeries(categoryId?: string): Promise<SeriesItem[]> {
    if (this.isDemoMode) {
      if (!categoryId || categoryId === 'all') return DEMO_SERIES_ITEMS;
      return DEMO_SERIES_ITEMS.filter((s) => s.category_id === categoryId);
    }
    try {
      const action = categoryId && categoryId !== 'all' 
        ? `action=get_series&category_id=${categoryId}`
        : 'action=get_series';
      const data = await this.fetchWithProxy(this.buildApiUrl(action));
      if (Array.isArray(data) && data.length > 0) return data;
      return DEMO_SERIES_ITEMS;
    } catch {
      return DEMO_SERIES_ITEMS;
    }
  }

  async getSeriesInfo(seriesId: string | number): Promise<SeriesDetail> {
    if (this.isDemoMode || DEMO_SERIES_DETAILS[String(seriesId)]) {
      return (
        DEMO_SERIES_DETAILS[String(seriesId)] || {
          seasons: { '1': {} },
          info: { name: 'Series Detail' },
          episodes: {
            '1': [
              { id: 1, episode_num: 1, title: 'Episode 1' },
              { id: 2, episode_num: 2, title: 'Episode 2' },
            ],
          },
        }
      );
    }
    try {
      const data = await this.fetchWithProxy(
        this.buildApiUrl(`action=get_series_info&series_id=${seriesId}`)
      );
      return data;
    } catch {
      return DEMO_SERIES_DETAILS['ser_1'];
    }
  }

  async getVodInfo(vodId: string | number): Promise<VodDetail> {
    try {
      const data = await this.fetchWithProxy(
        this.buildApiUrl(`action=get_vod_info&vod_id=${vodId}`)
      );
      return data;
    } catch {
      return {
        info: {
          plot: 'ภาพยนตร์คุณภาพ คมชัดระดับมาสเตอร์ เสียงไทย/ซับไทย',
          rating: '8.5',
          genre: 'Action, Drama',
        },
      };
    }
  }

  async getShortEpg(streamId: string | number): Promise<EpgProgram[]> {
    try {
      const data = await this.fetchWithProxy(
        this.buildApiUrl(`action=get_short_epg&stream_id=${streamId}&limit=5`)
      );
      if (data && Array.isArray(data.epg_listings)) {
        return data.epg_listings;
      }
    } catch {
      // Mock EPG
    }
    const now = Math.floor(Date.now() / 1000);
    return [
      {
        id: '1',
        epg_id: '1',
        channel_id: String(streamId),
        title: 'รายการกำลังออกอากาศ (Live Broadcast)',
        description: 'กำลังถ่ายทอดสดแบบ Real-time คุณภาพสัญญาณคมชัด Full HD',
        start: '00:00',
        end: '23:59',
        start_timestamp: now - 3600,
        stop_timestamp: now + 3600,
      },
    ];
  }

  getLiveStreamUrl(streamId: string | number): string {
    if (this.isDemoMode) {
      const hash = Math.abs(String(streamId).split('').reduce((a, b) => a + b.charCodeAt(0), 0));
      return TEST_HLS_URLS[hash % TEST_HLS_URLS.length];
    }
    const enc = encodeURIComponent;
    return `${this.serverUrl}/live/${enc(this.username)}/${enc(this.password)}/${streamId}.m3u8`;
  }

  getVodStreamUrl(streamId: string | number, extension: string = 'mp4'): string {
    if (this.isDemoMode) {
      return TEST_HLS_URLS[0];
    }
    const enc = encodeURIComponent;
    return `${this.serverUrl}/movie/${enc(this.username)}/${enc(this.password)}/${streamId}.${extension}`;
  }

  getSeriesStreamUrl(episodeId: string | number, extension: string = 'mp4'): string {
    if (this.isDemoMode) {
      return TEST_HLS_URLS[1];
    }
    const enc = encodeURIComponent;
    return `${this.serverUrl}/series/${enc(this.username)}/${enc(this.password)}/${episodeId}.${extension}`;
  }
}

/**
 * Parses raw M3U / M3U8 playlist strings into structured LiveStream items
 */
export function parseM3uPlaylist(content: string): { categories: Category[]; items: LiveStream[] } {
  const lines = content.split('\n');
  const items: LiveStream[] = [];
  const categoryMap: Map<string, number> = new Map();

  let currentItem: Partial<LiveStream> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      currentItem = {};
      
      // Parse tvg-id, tvg-name, tvg-logo, group-title
      const groupMatch = line.match(/group-title="([^"]+)"/i);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
      const nameParts = line.split(',');
      const title = nameParts[nameParts.length - 1]?.trim() || 'Untitled Channel';

      const categoryName = groupMatch ? groupMatch[1].trim() : 'ทั่วไป (General)';
      const logo = logoMatch ? logoMatch[1].trim() : '';

      const categoryId = 'm3u_cat_' + Math.abs(categoryName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
      categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);

      currentItem.name = title;
      currentItem.category_id = categoryId;
      currentItem.stream_icon = logo;
      currentItem.stream_id = 'm3u_' + (items.length + 1);
    } else if (line.startsWith('http://') || line.startsWith('https://')) {
      if (currentItem.name) {
        currentItem.direct_source = line;
        items.push(currentItem as LiveStream);
        currentItem = {};
      }
    }
  }

  const categories: Category[] = Array.from(categoryMap.entries()).map(([name, count]) => ({
    category_id: 'm3u_cat_' + Math.abs(name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)),
    category_name: name,
    count,
  }));

  return { categories, items };
}
