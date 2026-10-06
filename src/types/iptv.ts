export interface UserInfo {
  username: string;
  password?: string;
  message?: string;
  auth: number;
  status: string;
  exp_date: string | number | null;
  is_trial: string | number;
  active_cons: string | number;
  created_at?: string;
  max_connections: string | number;
  allowed_output_formats?: string[];
}

export interface ServerInfo {
  url?: string;
  port?: string;
  https_port?: string;
  server_protocol?: string;
  rtmp_port?: string;
  timezone?: string;
  time_now?: string;
}

export interface XtreamLoginResponse {
  user_info: UserInfo;
  server_info: ServerInfo;
}

export interface Category {
  category_id: string;
  category_name: string;
  parent_id?: number | string;
  count?: number;
}

export interface LiveStream {
  num?: number;
  name: string;
  stream_type?: string;
  stream_id: number | string;
  stream_icon?: string;
  epg_channel_id?: string;
  added?: string;
  category_id: string;
  custom_sid?: string;
  tv_archive?: number;
  direct_source?: string;
  tv_archive_duration?: number;
  is_adult?: boolean;
}

export interface VodStream {
  num?: number;
  name: string;
  stream_type?: string;
  stream_id: number | string;
  stream_icon?: string;
  rating?: string | number;
  rating_5based?: number;
  added?: string;
  category_id: string;
  container_extension?: string;
  custom_sid?: string;
  direct_source?: string;
  year?: string;
  is_adult?: boolean;
}

export interface SeriesItem {
  num?: number;
  name: string;
  series_id: number | string;
  cover?: string;
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
  releaseDate?: string;
  last_modified?: string;
  rating?: string | number;
  rating_5based?: number;
  category_id: string;
  is_adult?: boolean;
}

export interface Episode {
  id: string | number;
  episode_num: number | string;
  title: string;
  container_extension?: string;
  info?: {
    plot?: string;
    duration_secs?: number;
    duration?: string;
    movie_image?: string;
  };
  custom_sid?: string;
  added?: string;
  season?: number | string;
}

export interface SeriesDetail {
  seasons: { [key: string]: any };
  info: {
    name?: string;
    cover?: string;
    plot?: string;
    cast?: string;
    director?: string;
    genre?: string;
    releaseDate?: string;
    rating?: string;
  };
  episodes: {
    [seasonNum: string]: Episode[];
  };
}

export interface VodDetail {
  info: {
    movie_image?: string;
    plot?: string;
    rating?: string;
    year?: string;
    genre?: string;
    duration_secs?: number;
    duration?: string;
    releasedate?: string;
    director?: string;
    cast?: string;
  };
  movie_data?: {
    stream_id: string | number;
    name: string;
    container_extension: string;
  };
}

export interface EpgProgram {
  id: string;
  epg_id: string;
  title: string;
  lang?: string;
  start: string;
  end: string;
  description: string;
  channel_id: string;
  start_timestamp: number;
  stop_timestamp: number;
}

export interface PlayHistoryItem {
  kind: 'live' | 'vod' | 'series';
  id: string | number;
  name: string;
  cover?: string;
  streamUrl: string;
  ext?: string;
  pos?: number;
  duration?: number;
  timestamp: number;
  epIndex?: number;
  epTitle?: string;
  seriesId?: string | number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
  bestValue?: boolean;
  tag?: string;
  icon?: string;
  devices?: string;
  subRate?: string;
  buttonText?: string;
}
