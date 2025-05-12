import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
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
import { fetchTravelVideos, getVideoUrl, Video as PexelsVideo } from '../../services/videoService';
import { ReelProvider, useReelContext } from '../../contexts/ReelContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const { width, height } = Dimensions.get('window');

type Reel = {
  id: string;
  username: string;
  avatar: string;
  video: string;
  caption: string;
  likes: number;
  comments: number;
  location?: string;
  music?: string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  reelContainer: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  video: {
    flex: 1,
    width: width,
    height: height,
    resizeMode: ResizeMode.COVER,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Lighter overlay
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
    width: 36,
    height: 36,
    borderRadius: 18,
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
  loadingContainer: {
    padding: spacing[4],
  },
  flatList: {
    flex: 1,
  },
});

interface ReelProps {
  item: Reel;
  index: number;
}

const Reel: React.FC<ReelProps> = memo(({ item, index }) => {
  const videoRef = useRef<Video>(null);
  const { activeIndex } = useReelContext();

  useEffect(() => {
    if (videoRef.current && activeIndex === index) {
      videoRef.current.playAsync();
    } else if (videoRef.current) {
      videoRef.current.pauseAsync();
    }
  }, [activeIndex, index]);

  // Memoize expensive computations
  const memoizedCaption = useMemo(() => item.caption, [item.caption]);
  const memoizedLocation = useMemo(() => item.location, [item.location]);
  const memoizedMusic = useMemo(() => item.music, [item.music]);
  const memoizedLikes = useMemo(() => item.likes, [item.likes]);
  const memoizedComments = useMemo(() => item.comments, [item.comments]);

  // Memoize the header content
  const HeaderContent = useMemo(() => (
    <View style={styles.reelHeader}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: item.avatar }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <View style={styles.followButtonContainer}>
        <TouchableOpacity style={{
          borderWidth: 1,
          borderColor: colors.text.inverse,
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[1],
          borderRadius: borderRadius.sm,
          backgroundColor: 'transparent',
        }}>
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [item.avatar, item.username]);

  // Memoize the info content
  const InfoContent = useMemo(() => (
    <View style={styles.reelInfo}>
      <Text style={styles.caption}>{memoizedCaption}</Text>
      {memoizedLocation && (
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color={colors.text.inverse} />
          <Text style={styles.location}>{memoizedLocation}</Text>
        </View>
      )}
      {memoizedMusic && (
        <View style={styles.musicContainer}>
          <Ionicons name="musical-notes" size={16} color={colors.text.inverse} />
          <Text style={styles.music}>{memoizedMusic}</Text>
        </View>
      )}
    </View>
  ), [memoizedCaption, memoizedLocation, memoizedMusic]);

  // Memoize the action buttons
  const ActionButtons = useMemo(() => (
    <View style={styles.reelActions}>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="heart-outline" size={32} color={colors.text.inverse} />
        <Text style={styles.actionText}>{memoizedLikes}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="chatbubble-outline" size={28} color={colors.text.inverse} />
        <Text style={styles.actionText}>{memoizedComments}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="paper-plane-outline" size={28} color={colors.text.inverse} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="bookmark-outline" size={28} color={colors.text.inverse} />
      </TouchableOpacity>
    </View>
  ), [memoizedLikes, memoizedComments]);

  return (
    <View style={styles.reelContainer}>
      <Video
        ref={videoRef}
        source={{ uri: item.video }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        useNativeControls={false}
      />
      <View style={styles.overlay}>
        <View style={styles.reelContent}>
          {HeaderContent}
          <View style={styles.reelFooter}>
            <View style={styles.reelContentRow}>
              {InfoContent}
              {ActionButtons}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef<FlatList<Reel>>(null);
  const { setActiveIndex } = useReelContext();

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }, [setActiveIndex]);

  useEffect(() => {
    if (reels.length === 0) {
      setLoading(true);
      loadVideos();
    }
  }, [reels]);

  const loadVideos = async () => {
    try {
      const videos = await fetchTravelVideos(page);
      
      if (videos.length === 0) {
        // No more videos to load
        setHasMore(false);
        setLoading(false);
        return;
      }

      const newReels = videos.map((video: PexelsVideo) => ({
        id: video.id.toString(),
        username: video.user.name,
        avatar: `https://i.pravatar.cc/150?u=${video.user.name}`,
        video: getVideoUrl(video),
        caption: `Exploring the world 🌍 #travel #adventure #${video.user.name.toLowerCase().replace(/\s+/g, '')}`,
        likes: Math.floor(Math.random() * 10000),
        comments: Math.floor(Math.random() * 1000),
        location: 'Travel Destination',
        music: 'Travel Vibes - Ambient Mix',
      }));

      setReels(prevReels => [...prevReels, ...newReels]);
      setPage(prevPage => prevPage + 1);
      setHasMore(true);
      setLoading(false);
    } catch (error) {
      console.error('Error loading videos:', error);
      setLoading(false);
    }
  };

  const onEndReached = useCallback(() => {
    if (!loading && hasMore) {
      loadVideos();
    }
  }, [loading, hasMore]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={reels}
        renderItem={({ item, index }) => <Reel item={item} index={index} />}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View style={styles.loadingContainer}>
            {loading && reels.length > 0 ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary.main} />
                <Text style={{ color: colors.text.inverse, marginTop: spacing[2] }}>
                  Loading more videos...
                </Text>
              </View>
            ) : !hasMore ? (
              <Text style={{ color: colors.text.inverse, textAlign: 'center' }}>
                No more videos to load
              </Text>
            ) : null}
          </View>
        }
        style={styles.flatList}
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={height}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          alignItems: 'stretch'
        }}
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
