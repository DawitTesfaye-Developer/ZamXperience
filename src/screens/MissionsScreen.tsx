// src/screens/MissionsScreen.tsx
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTodaysMission} from '../hooks/useMissions';

export default function MissionsScreen() {
  const navigation = useNavigation<any>();
  const {data: mission, isLoading} = useTodaysMission();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading missions...</Text>
      </View>
    );
  }

  if (!mission) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No active missions today.</Text>
        <Text style={styles.subText}>Check back tomorrow!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Today's Mission</Text>
      <View style={styles.card}>
        <Text style={styles.missionTitle}>{mission.title}</Text>
        <Text style={styles.missionDesc}>{mission.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>⏱️ {mission.estimatedMinutes} min</Text>
          <Text style={styles.metaText}>⭐ +{mission.xpReward} XP</Text>
          <Text style={styles.metaText}>📚 {mission.academyCategory}</Text>
        </View>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('ScenarioScreen')}
        >
          <Text style={styles.startButtonText}>Start Mission →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fe',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
  },
  missionDesc: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#888',
    backgroundColor: '#f0f2f8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  startButton: {
    backgroundColor: '#1a237e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  subText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});