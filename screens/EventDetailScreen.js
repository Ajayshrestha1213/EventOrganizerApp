import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, onSnapshot, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import { Button, Card, Title, Paragraph, Appbar } from 'react-native-paper';

export default function EventDetailScreen({ route }) {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'events', eventId), (doc) => {
      if (doc.exists()) {
        setEvent({ id: doc.id, ...doc.data() });
      } else {
        setError('Event not found');
      }
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return unsubscribe;
  }, [eventId]);

  const handleAddToFavorites = async () => {
    if (user) {
      try {
        await setDoc(doc(collection(firestore, 'users', user.uid, 'favorites'), event.id), {
          eventId: event.id,
          title: event.title,
        });
        Alert.alert('Success', 'Event added to favorites');
      } catch (err) {
        Alert.alert('Error', err.message);
      }
    } else {
      Alert.alert('Error', 'User not authenticated');
    }
  };

  const handleEditEvent = () => {
    navigation.navigate('EditEvent', { eventId: event.id });
  };

  const handleDeleteEvent = async () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, 'events', event.id));
              Alert.alert('Success', 'Event deleted');
              navigation.navigate('EventList');
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>{event.title}</Title>
          <Paragraph style={styles.cardDescription}>{event.description}</Paragraph>
          <Paragraph style={styles.cardDate}>{new Date(event.date.seconds * 1000).toLocaleDateString()}</Paragraph>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button mode="contained" onPress={handleAddToFavorites} style={styles.favoriteButton}>
            Add to Favorites
          </Button>
          {user && event.creatorId === user.uid && (
            <>
              <Button mode="outlined" onPress={handleEditEvent} style={styles.editButton}>
                Edit
              </Button>
              <Button mode="contained" onPress={handleDeleteEvent} style={styles.deleteButton}>
                Delete
              </Button>
            </>
          )}
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
    borderRadius: 12,
    elevation: 5,
    backgroundColor: '#ffffff',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    marginVertical: 8,
  },
  cardDate: {
    fontSize: 14,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  favoriteButton: {
    backgroundColor: '#6200ee',
    color: '#ffffff',
  },
  editButton: {
    borderColor: '#6200ee',
    borderWidth: 1,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    color: '#ffffff',
  },
  errorText: {
    fontSize: 18,
    color: '#f44336',
    textAlign: 'center',
    marginTop: 20,
  },
});