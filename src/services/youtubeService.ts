import axios from 'axios';

interface YouTubeShort {
  title: string;
  link: string;
  thumbnail: string;
  channel: {
    name: string;
    link: string;
  };
  views: string;
  duration: string;
}

export const getYouTubeShortEmbedUrl = (videoUrl: string): string => {
  const videoId = videoUrl.split('v=')[1];
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
};

export const fetchYouTubeShorts = async (query: string): Promise<YouTubeShort[]> => {
  const serpapiUrl = 'https://serpapi.com/search.json';
  const params = {
    engine: 'youtube',
    search_query: query,
    api_key: process.env.EXPO_PUBLIC_SERPAPI_API_KEY,
  };

  try {
    const response = await axios.get(serpapiUrl, { params });
    const shorts: YouTubeShort[] = response.data.video_results
      .filter((result: any) => result.duration && parseInt(result.duration.split(':')[0]) < 60)
      .map((result: any) => ({
        title: result.title,
        link: result.link,
        thumbnail: result.thumbnail,
        channel: {
          name: result.channel.name,
          link: result.channel.link
        },
        views: result.views,
        duration: result.duration
      }));

    return shorts;
  } catch (error: any) {
    console.error('Error fetching YouTube Shorts:', error.message || error);
    console.error('Response data:', error.response?.data);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers
    });
    return [];
  }
};


