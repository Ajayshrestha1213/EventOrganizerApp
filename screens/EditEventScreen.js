import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { doc, setDoc, getDoc, updateDoc, collection } from 'firebase/firestore';
import { auth, firestore } from '../firebase';

export default function EditEventScreen({ route, navigation }) {
  const { eventId } = route.params || {};
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        const docRef = doc(firestore, 'events', eventId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const event = docSnap.data();
          setTitle(event.title);
          setDescription(event.description);
          setDate(event.date);
        }
      };
      fetchEvent();
    }
  }, [eventId]);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!title || !description || !date) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      if (eventId) {
        await updateDoc(doc(firestore, 'events', eventId), {
          title,
          description,
          date,
        });
      } else {
        const newEventRef = doc(collection(firestore, 'events'));
        await setDoc(newEventRef, {
          title,
          description,
          date,
          creatorId: user.uid,
        });
      }
      navigation.navigate('EventList');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{eventId ? 'Edit Event' : 'Add Event'}</Title>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Date"
        value={date}
        onChangeText={setDate}
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#6200ee',
  },
});
