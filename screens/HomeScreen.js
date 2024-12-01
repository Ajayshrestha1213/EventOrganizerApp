import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, FlatList } from 'react-native';
import { auth, firestore } from '../firebase';
import EventItem from '../components/EventItem';

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore.collection('events').onSnapshot(snapshot => {
      const eventsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Button title="Log Out" onPress={handleLogout} color="#d9534f" style={styles.logoutButton} />
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <EventItem event={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  logoutButton: {
    marginBottom: 16,
    borderRadius: 8,
    paddingVertical: 12,
  },
  list: {
    paddingBottom: 16,
  },
});
