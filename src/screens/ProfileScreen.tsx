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
import {Colors} from '../theme/colors';
import {Typography} from '../theme/typography';
import {LevelBadge} from '../components/common/LevelBadge';
import {BadgeIcon} from '../components/common/BadgeIcon';

const {width} = Dimensions.get('window');

export default function ProfileScreen() {
  const {user, logout} = useAuthStore();

  if (!user) return null;

  const earnedBadges = user.badges.filter(b => b.earned);
  const lockedBadges = user.badges.filter(b => !b.earned);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>{user.fullName.charAt(0)}</Text>
        </View>
        <Text style={styles.fullName}>{user.fullName}</Text>
        <Text style={styles.role}>{user.role.replace('_', ' ')}</Text>
        {user.branchName && <Text style={styles.branch}>🏢 {user.branchName}</Text>}
        <View style={styles.levelContainer}>
          <LevelBadge level={user.level} size="large" />
          <View style={styles.levelInfo}>
            <Text style={styles.levelLabel}>Level {user.level}</Text>
            <Text style={styles.levelXp}>{user.xp.toLocaleString()} XP</Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statBoxValue}>{user.missionsCompleted}</Text>
          <Text style={styles.statBoxLabel}>Missions Done</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statBoxValue}>🔥 {user.streak}</Text>
          <Text style={styles.statBoxLabel}>Day Streak</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statBoxValue}>{earnedBadges.length}</Text>
          <Text style={styles.statBoxLabel}>Badges Earned</Text>
        </View>
      </View>

      {/* Badges Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏅 Badges</Text>
        <View style={styles.badgeGrid}>
          {user.badges.map((badge, idx) => (
            <BadgeIcon key={idx} name={badge.name} icon={badge.icon} earned={badge.earned} size={72} />
          ))}
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>🚪 Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>ZamXperience v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarLargeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  role: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  branch: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
  },
  levelInfo: {
    marginLeft: 12,
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  levelXp: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginTop: -20,
    backgroundColor: Colors.card,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  statBox: {
    alignItems: 'center',
  },
  statBoxValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statBoxLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: 12,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 30,
    backgroundColor: Colors.danger,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    color: Colors.textLight,
    fontSize: 12,
    marginTop: 20,
    marginBottom: 40,
  },
});