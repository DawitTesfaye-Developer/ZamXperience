import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useAuthStore} from '../store/authStore';
import {useTodaysMission} from '../hooks/useMissions';
import {ProgressBar} from '../components/common/ProgressBar';
import {LevelBadge} from '../components/common/LevelBadge';
import {Colors} from '../theme/colors';
import {Typography} from '../theme/typography';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore(state => state.user);
  const {data: mission} = useTodaysMission();

  if (!user) return null;

  const xpProgress = (user.xp % 100) / 100; // 0 to 1
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 🌅';
    if (hour < 18) return 'Good Afternoon ☀️';
    return 'Good Evening 🌙';
  })();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{user.fullName}</Text>
        </View>
        <LevelBadge level={user.level} size="large" />
      </View>

      {/* XP Card */}
      <View style={styles.xpCard}>
        <View style={styles.xpRow}>
          <View>
            <Text style={styles.xpLabel}>Total XP</Text>
            <Text style={styles.xpValue}>{user.xp.toLocaleString()}</Text>
          </View>
          <View>
            <Text style={styles.xpLabel}>Level {user.level}</Text>
            <Text style={styles.xpSubtext}>Next level: +{100 - (user.xp % 100)} XP</Text>
          </View>
        </View>
        <ProgressBar progress={xpProgress} height={10} fillColor={Colors.secondary} />
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🔥 {user.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>📚 {user.missionsCompleted}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🏅 {user.badges.filter(b => b.earned).length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>
      </View>

      {/* Today's Mission */}
      {mission && (
        <View style={styles.missionCard}>
          <Text style={styles.sectionTitle}>🎯 Today's Mission</Text>
          <Text style={styles.missionTitle}>{mission.title}</Text>
          <Text style={styles.missionDesc}>{mission.description}</Text>
          <View style={styles.missionMeta}>
            <Text style={styles.missionMetaText}>⏱️ {mission.estimatedMinutes} min</Text>
            <Text style={styles.missionMetaText}>⭐ +{mission.xpReward} XP</Text>
          </View>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('ScenarioScreen')}
          >
            <Text style={styles.startButtonText}>Start →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.badgePreview}>
          {user.badges.slice(0, 4).map((badge, idx) => (
            <View key={idx} style={[styles.badgePill, !badge.earned && styles.badgeLocked]}>
              <Text style={styles.badgeEmoji}>{badge.icon}</Text>
              <Text style={styles.badgeName}>{badge.name}</Text>
            </View>
          ))}
          {user.badges.length > 4 && (
            <View style={styles.badgePill}>
              <Text style={styles.badgeEmoji}>+{user.badges.length - 4}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
  },
  xpCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: -16,
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  xpLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  xpValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  xpSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  missionCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: 12,
  },
  missionTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: 4,
  },
  missionDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  missionMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  missionMetaText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  startButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quickStats: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 30,
  },
  badgePreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  badgeName: {
    fontSize: 12,
    color: Colors.text,
  },
});