import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Text, Button, Card, Title, Paragraph, FAB } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, setDoc, doc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(firestore, 'events'));
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsData);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    fetchEvents();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate('SignIn');
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  const handleAddToFavorites = async (event) => {
    if (user) {
      try {
        await setDoc(doc(collection(firestore, 'users', user.uid, 'favorites'), event.id), {
          eventId: event.id,
          title: event.title,
          description: event.description,
        });
        Alert.alert('Success', 'Event added to favorites');
      } catch (err) {
        Alert.alert('Error', err.message);
      }
    } else {
      Alert.alert('Error', 'User not authenticated');
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}>{item.title}</Title>
        <Paragraph style={styles.cardDescription}>{item.description}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate('EventDetail', { eventId: item.id })} style={styles.cardButton}>
          View Details
        </Button>
        <Button onPress={() => handleAddToFavorites(item)} style={styles.cardButton}>
          Add to Favorites
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Button mode="contained" onPress={() => navigation.navigate('Favorites')} style={styles.showFavoritesButton}>
        Show Favorites
      </Button>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('EditEvent')}
      />
      <Button mode="contained" onPress={handleSignOut} style={styles.signOutButton}>
        Sign Out
      </Button>
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
  cardDescription: {
    fontSize: 14,
    color: '#555',
  },
  cardButton: {
    fontSize: 12,
    paddingVertical: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: '#6200ee',
  },
  signOutButton: {
    marginTop: 16,
    paddingVertical: 6,
    fontSize: 14,
    alignSelf: 'center',
    width: '50%',
  },
  showFavoritesButton: {
    marginBottom: 16,
    backgroundColor: '#6200ee',
  },
});