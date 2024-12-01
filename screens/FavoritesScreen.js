import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'users', user.uid, 'favorites'));
        const favoritesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(favoritesData);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    fetchFavorites();
  }, [user.uid]);

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      await deleteDoc(doc(firestore, 'users', user.uid, 'favorites', favoriteId));
      setFavorites(favorites.filter(favorite => favorite.id !== favoriteId));
      Alert.alert('Success', 'Event removed from favorites');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}>{item.title}</Title>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate('EventDetail', { eventId: item.eventId })} style={styles.cardButton}>
          View Details
        </Button>
        <Button onPress={() => handleDeleteFavorite(item.id)} style={styles.cardButton}>
          Remove
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardButton: {
    fontSize: 12,
    paddingVertical: 8,
  },
});