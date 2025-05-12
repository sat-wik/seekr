import React, { memo, useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { WebView } from 'react-native-webview';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  ViewToken,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { fetchYouTubeShorts, getYouTubeShortEmbedUrl } from '../../services/youtubeService';
import { ReelProvider, useReelContext } from '../../contexts/ReelContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const { width, height } = Dimensions.get('window');

type Reel = {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  channel: {
    name: string;
    link: string;
  };
  views: string;
  duration: string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  reelContainer: {
    flex: 1,
    backgroundColor: colors.background.default,
    width: width,
    height: height * 0.9,
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.background.default
  },
  reelContent: {
    flex: 1,
    padding: spacing[4],
  },
  reelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing[16],
    paddingHorizontal: spacing[4],
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing[2],
  },
  username: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  followButton: {
    alignItems: 'center',
  },
  followButtonText: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.sm,
  },
  followButtonContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing[1],
  },
  reelFooter: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing[4],
  },
  reelContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing[24],
    paddingLeft: spacing[4],
  },
  reelActions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '30%',
    marginBottom: spacing[24],
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  reelInfo: {
    flex: 1,
  },
  caption: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing[2],
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.sm,
    marginLeft: spacing[2],
  },
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  music: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.sm,
    marginLeft: spacing[2],
  },
  actionText: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.sm,
    marginTop: spacing[1],
  },
  actionCount: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.sm,
    marginTop: spacing[1],
  },
  loadingContainer: {
    padding: spacing[4],
  },
  flatList: {
    flex: 1,
  },

  controls: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: spacing[4],
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  likeCount: {
    marginLeft: spacing[2],
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    marginLeft: spacing[2],
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareCount: {
    marginLeft: spacing[2],
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
  },
});

interface ReelProps {
  item: Reel;
  index: number;
}

const ReelItem: React.FC<ReelProps> = ({ item, index }: ReelProps) => {
  const videoRef = useRef<WebView>(null);
  const { activeIndex } = useReelContext();

  useEffect(() => {
    if (videoRef.current && activeIndex === index) {
      // videoRef.current.playAsync();
    } else if (videoRef.current) {
      // videoRef.current.pauseAsync();
    }
  }, [activeIndex, index]);

  // Memoize expensive computations
  const memoizedCaption = useMemo(() => item.title, [item.title]);
  const memoizedLocation = useMemo(() => item.channel.name, [item.channel.name]);

  return (
    <View style={styles.reelContainer}>
      <WebView
        ref={videoRef}
        source={{
          uri: item.videoUrl,
          html: `
            <style>
              body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              iframe {
                width: 100%;
                height: 100%;
                border: none;
              }
            </style>
            <iframe src="${item.videoUrl}" allow="autoplay; encrypted-media" allowFullScreen></iframe>
          `
        }}
        style={styles.video}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
      <View style={styles.overlay} />
      <View style={styles.reelContent}>
        <View style={styles.reelHeader}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: item.channel.link }}
              style={styles.avatar}
            />
            <Text style={styles.username}>{item.channel.name}</Text>
          </View>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reelFooter}>
          <View style={styles.reelContentRow}>
            <View style={styles.reelInfo}>
              <Text style={styles.caption}>{memoizedCaption}</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={16} color={colors.text.inverse} />
                <Text style={styles.location}>{memoizedLocation}</Text>
              </View>
              <View style={styles.musicContainer}>
                <Ionicons name="musical-note" size={16} color={colors.text.inverse} />
                <Text style={styles.music}>Music</Text>
              </View>
            </View>
            <View style={styles.reelActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart" size={24} color={colors.text.inverse} />
                <Text style={styles.actionCount}>1.2K</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble" size={24} color={colors.text.inverse} />
                <Text style={styles.actionCount}>500</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-social" size={24} color={colors.text.inverse} />
                <Text style={styles.actionCount}>100</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const MemoizedReelItem = memo(ReelItem);

export { MemoizedReelItem };

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList<Reel>>(null);
  const { setActiveIndex } = useReelContext();

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const shorts = await fetchYouTubeShorts('travel shorts');
        console.log(shorts);
        const reels = shorts.map((short) => ({
          id: short.link.split('v=')[1],
          title: short.title,
          thumbnail: short.thumbnail,
          videoUrl: getYouTubeShortEmbedUrl(short.link),
          channel: short.channel,
          views: short.views,
          duration: short.duration
        }));
        setReels(reels);
      } catch (error) {
        console.error('Error fetching reels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }, [setActiveIndex]);

  const onEndReached = useCallback(() => {
    // Load more videos
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={reels}
        renderItem={({ item, index }: { item: Reel; index: number }) => (
          <MemoizedReelItem item={item} index={index} />
        )}
        keyExtractor={(item: Reel) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
};

const HomeScreenWrapper = () => (
  <ReelProvider>
    <HomeScreen />
  </ReelProvider>
);

export default HomeScreenWrapper;
