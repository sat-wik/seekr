import axios from 'axios';

const PEXELS_API_KEY = 'c674dCWag2k05EqtVbLUHB6WCYHsrLvllYwyU2MOyiR0cOcf97MEm1G6'; // You'll need to get this from https://www.pexels.com/api/
const PEXELS_API_URL = 'https://api.pexels.com/videos';

export type Video = {
  id: string;
  url: string;
  image: string;
  duration: number;
  user: {
    name: string;
    url: string;
  };
  video_files: {
    link: string;
    quality: string;
    width: number;
    height: number;
  }[];
};

export const fetchTravelVideos = async (page: number = 1, perPage: number = 10): Promise<Video[]> => {
  try {
    const response = await axios.get(`${PEXELS_API_URL}/search`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      params: {
        query: 'travel',
        orientation: 'portrait',
        size: 'medium',
        page,
        per_page: perPage,
      },
    });

    return response.data.videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

export const getVideoUrl = (video: Video): string => {
  // Get the highest quality portrait video
  const portraitVideos = video.video_files.filter(
    (file) => file.height > file.width
  );
  
  if (portraitVideos.length > 0) {
    // Sort by quality (height) and get the best one
    return portraitVideos.sort((a, b) => b.height - a.height)[0].link;
  }
  
  // Fallback to the first video file if no portrait videos found
  return video.video_files[0].link;
}; 
