import axios from 'axios';

interface VideoVersion {
  url: string;
}

interface MediaItem {
  id?: string;
  media?: {
    video_versions?: VideoVersion[];
    user?: {
      username: string;
      profile_pic_url: string;
    };
    clips_metadata?: {
      music_info?: {
        music_asset_info?: {
          title: string;
        };
      };
    };
    caption?: {
      text: string;
    };
    like_count?: number;
    comment_count?: number;
    play_count?: number;
    location?: {
      name: string;
    };
  };
}

interface LayoutContent {
  layout_content?: {
    medias?: MediaItem[];
  };  // Some APIs might have media at the root
  layout_type?: string;
  feed_type?: string;
  explore_item_info?: any;
  [key: string]: any;  // Allow any other properties
}

export interface InstagramReel {
  id: string;
  video_url: string;
  username: string;
  caption: string;
  like_count: number;
  comment_count: number;
  play_count: number;
  location?: string;
  music?: string;
  user_profile_pic: string;
}

export const fetchReelsByHashtag = async (hashtag: string): Promise<InstagramReel[]> => {
  const options = {
    method: 'GET',
    url: 'https://instagram-best-experience.p.rapidapi.com/hashtag_section',
    params: {
      tag: hashtag,
      section: 'clips',
      count: 20
    },
    headers: {
      'x-rapidapi-key': process.env.EXPO_PUBLIC_RAPIDAPI_KEY,
      'x-rapidapi-host': 'instagram-best-experience.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    
    if (!response.data?.data?.sections) {
      console.warn('No sections found in API response');
      return [];
    }
    
    const sections: LayoutContent[] = response.data.data.sections;
    const reels: InstagramReel[] = [];
    
    for (const section of sections) {
      const mediaItems = section.layout_content?.medias || []; 
      for (const mediaItem of mediaItems) {
        try {
          const media = mediaItem;
          const videoUrl = media.media?.video_versions?.[0]?.url!;
          const username = media.media?.user?.username;
          const caption = media.media?.caption?.text;
          const like_count = media.media?.like_count;
          const comment_count = media.media?.comment_count;
          const play_count = media.media?.play_count;
          const location = media.media?.location?.name;
          const user_profile_pic = media.media?.user?.profile_pic_url;
          const music = media.media?.clips_metadata?.music_info?.music_asset_info?.title;
        
          // Generate a unique ID if not provided
          const mediaId = ('id' in media && typeof media.id === 'string') 
            ? media.id 
            : `reel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          reels.push({
            id: mediaId,
            video_url: videoUrl,
            username: username || 'unknown',
            caption:caption || '',
            like_count: like_count || 0,
            comment_count: comment_count || 0,
            play_count: play_count || 0,
            location: location || '',
            user_profile_pic: user_profile_pic || '',
            music: music || ''
          });
        } catch (error) {
          console.error('Error processing media item:', error);
          continue;
        }
      }
    }

    return reels;
  } catch (error) {
    console.error('Error fetching Instagram reels:', error);
    throw error;
  }
};
