import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {Colors} from '../theme/colors';
import {Typography} from '../theme/typography';
import {ProgressBar} from '../components/common/ProgressBar';

// Mock lessons for each academy
const mockLessons: Record<string, any[]> = {
  '1': [
    {id: 'l1', title: 'Active Listening 101', completed: true, xp: 50},
    {id: 'l2', title: 'De-escalation Techniques', completed: true, xp: 75},
    {id: 'l3', title: 'Empathy in Practice', completed: false, xp: 100},
    {id: 'l4', title: 'Handling Repeated Complaints', completed: false, xp: 80},
  ],
  '2': [
    {id: 'l5', title: 'Leading Teams', completed: true, xp: 60},
    {id: 'l6', title: 'Coaching & Mentoring', completed: false, xp: 90},
    {id: 'l7', title: 'Conflict Resolution', completed: false, xp: 110},
  ],
};

export default function AcademyDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const {academyId, academyName} = route.params || {academyId: '1', academyName: 'Customer Care'};
  const lessons = mockLessons[academyId] || mockLessons['1'];

  const completedCount = lessons.filter(l => l.completed).length;
  const progress = lessons.length > 0 ? completedCount / lessons.length : 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{academyName}</Text>
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {completedCount} of {lessons.length} completed
        </Text>
        <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
      </View>
      <ProgressBar progress={progress} height={8} fillColor={Colors.primary} />

      <FlatList
        data={lessons}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <View style={[styles.lessonCard, item.completed && styles.lessonCompleted]}>
            <View style={styles.lessonLeft}>
              <Text style={styles.lessonStatus}>{item.completed ? '✅' : '⏳'}</Text>
              <Text style={[styles.lessonTitle, item.completed && styles.lessonTitleCompleted]}>
                {item.title}
              </Text>
            </View>
            <Text style={styles.lessonXp}>+{item.xp} XP</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  title: {
    ...Typography.h2,
    color: Colors.primary,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  progressPercent: {
    ...Typography.bodySmall,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  list: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  lessonCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lessonCompleted: {
    borderColor: Colors.secondary,
    backgroundColor: '#f0faf0',
  },
  lessonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonStatus: {
    fontSize: 20,
    marginRight: 12,
  },
  lessonTitle: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  lessonTitleCompleted: {
    color: Colors.secondary,
    textDecorationLine: 'line-through',
  },
  lessonXp: {
    ...Typography.bodySmall,
    color: Colors.secondary,
    fontWeight: 'bold',
  },
});