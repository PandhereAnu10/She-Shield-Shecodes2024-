import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { TextInput, Button, Card, Paragraph, useTheme, FAB, Portal, Dialog } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const CommunityScreen = () => {
  const [posts, setPosts] = useState([]);
  const [newPostVisible, setNewPostVisible] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const theme = useTheme();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const savedPosts = await AsyncStorage.getItem('community_posts');
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts));
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const savePosts = async (newPosts) => {
    try {
      await AsyncStorage.setItem('community_posts', JSON.stringify(newPosts));
      setPosts(newPosts);
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  };

  const handleAddPost = () => {
    if (!newPostText.trim()) return;

    const newPost = {
      id: uuidv4(),
      text: newPostText,
      timestamp: new Date().toISOString(),
      likes: 0,
      anonymous: true,
    };

    savePosts([newPost, ...posts]);
    setNewPostText('');
    setNewPostVisible(false);
  };

  const handleLike = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    savePosts(updatedPosts);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Paragraph style={styles.postText}>{item.text}</Paragraph>
              <Paragraph style={styles.timestamp}>
                Posted on {formatTimestamp(item.timestamp)}
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button
                icon="thumb-up"
                onPress={() => handleLike(item.id)}
              >
                {item.likes}
              </Button>
            </Card.Actions>
          </Card>
        )}
      />

      <Portal>
        <Dialog visible={newPostVisible} onDismiss={() => setNewPostVisible(false)}>
          <Dialog.Title>New Post</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Share your thoughts anonymously"
              value={newPostText}
              onChangeText={setNewPostText}
              multiline
              numberOfLines={4}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setNewPostVisible(false)}>Cancel</Button>
            <Button onPress={handleAddPost}>Post</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => setNewPostVisible(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 8,
  },
  postText: {
    fontSize: 16,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CommunityScreen; 