import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
  ViewToken,
  StatusBar,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { fetchReelsByHashtag, type InstagramReel } from '../../services/instagramService';

const { width, height } = Dimensions.get('window');

interface Reel {
  id: string;
  title?: string;
  username: string;
  avatar: string;
  video: string;
  caption: string;
  likes: number;
  comments: number;
  views?: number;
  location: string;
  music: string;
  isInstagram?: boolean;
}

const ReelItem = ({ item, isActive, isScreenFocused }: { item: Reel; isActive: boolean; isScreenFocused: boolean }) => {
  const videoRef = useRef<Video>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (isActive && isScreenFocused) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
      if (!isScreenFocused) {
        videoRef.current?.setPositionAsync(0);
      }
    }
  }, [isActive, isScreenFocused]);

  // Check if text needs "more" button
  useEffect(() => {
    if (item.caption && item.caption.length > 100) {
      setShowMore(true);
    }
  }, [item.caption]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.videoContainer}>
      <Video
        ref={videoRef}
        source={{ uri: item.video }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={isActive}
        useNativeControls={false}
      />
      <View style={styles.overlay} />
      
      {/* Right Side - Action Buttons */}
      <View style={styles.rightActions}>
        <View style={styles.actionButton}>
          <Ionicons name="heart" size={32} color="white" />
          <Text style={styles.actionText}>{item.likes?.toLocaleString() || '0'}</Text>
        </View>
        
        <View style={styles.actionButton}>
          <Ionicons name="chatbubble-ellipses" size={28} color="white" />
          <Text style={styles.actionText}>{item.comments?.toLocaleString() || '0'}</Text>
        </View>
        
        <View style={styles.actionButton}>
          <Ionicons name="send" size={28} color="white" />
        </View>
        
        <View style={styles.actionButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </View>
      </View>
      
      {/* Bottom Left - Profile and Caption */}
      <View style={styles.bottomLeftContainer}>
        {isExpanded && (
          <View style={styles.gradientBackground}>
            <View style={StyleSheet.absoluteFill} />
          </View>
        )}
        
        <View style={styles.profileSection}>
          <View style={styles.profileColumn}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <TouchableOpacity onPress={toggleExpand} style={styles.seeMoreButton}>
              <Text style={styles.seeMoreText}>
                {isExpanded ? 'See less' : 'See more'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.username}>@{item.username}</Text>
        </View>
        
        {/* Expanded Content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.caption}>{item.caption}</Text>
            {item.location && (
              <View style={styles.infoRow}>
                <Ionicons name="location" size={14} color="white" />
                <Text style={styles.infoText}>{item.location}</Text>
              </View>
            )}
            {item.music && item.music !== 'Original Audio' && (
              <View style={styles.infoRow}>
                <Ionicons name="musical-note" size={14} color="white" />
                <Text style={styles.infoText}>{item.music}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const ReelsScreen = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const loadVideos = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    try {
      const instagramReels = await fetchReelsByHashtag('wanderlust');
      
      if (instagramReels && instagramReels.length > 0) {
        const newReels: Reel[] = instagramReels.map((reel: InstagramReel) => ({
          id: reel.id,
          title: reel.caption?.split('\n')[0] || 'Instagram Reel',
          username: reel.username,
          avatar: reel.user_profile_pic || `https://i.pravatar.cc/150?u=${reel.username}`,
          video: reel.video_url,
          caption: reel.caption || 'Check out this reel!',
          likes: reel.like_count || 0,
          comments: reel.comment_count || 0,
          views: reel.play_count,
          location: reel.location || 'Instagram',
          music: reel.music || 'Original Audio',
          isInstagram: true,
        }));
        
        setReels(prev => [...prev, ...newReels]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading reels:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    loadVideos();
  }, []);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const isFocused = useIsFocused();

  const renderItem = useCallback(({ item, index }: { item: Reel; index: number }) => (
    <ReelItem 
      item={item} 
      isActive={index === activeIndex} 
      isScreenFocused={isFocused}
    />
  ), [activeIndex, isFocused]);

  const keyExtractor = useCallback((item: Reel) => item.id, []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: height,
    offset: height * index,
    index,
  }), []);

  if (loading && reels.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={reels}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onEndReached={loadVideos}
        onEndReachedThreshold={0.5}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  videoContainer: {
    width,
    height,
    backgroundColor: '#000',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },

  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 12,
    paddingBottom: 8,
  },
  bottomLeftContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    zIndex: 1,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 'auto',
    paddingTop: 40,
    paddingBottom: 16,
    marginTop: -40,
    marginLeft: -16,
    marginRight: -16,
    overflow: 'hidden',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 8,
  },
  profileColumn: {
    alignItems: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  username: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 8,
  },
  expandedContent: {
    marginTop: 8,
    width: '100%',
  },
  caption: {
    color: 'white',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  infoText: {
    color: 'white',
    fontSize: 13,
  },
  seeMoreButton: {
    marginTop: 4,
  },
  seeMoreText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    opacity: 0.9,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
    width: 40,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  followButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#0095F6',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
});

export default ReelsScreen;
