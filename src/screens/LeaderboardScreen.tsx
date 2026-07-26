import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useLeaderboard} from '../hooks/useLeaderboard';
import {Colors} from '../theme/colors';
import {Typography} from '../theme/typography';
import {useAuthStore} from '../store/authStore';

const {width} = Dimensions.get('window');

export default function LeaderboardScreen() {
  const user = useAuthStore(state => state.user);
  const {data: entries, isLoading} = useLeaderboard();

  const userRank = entries?.findIndex(e => e.userId === user?.id) ?? -1;

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const isUser = item.userId === user?.id;
    const rankColor = index === 0 ? Colors.gold : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : Colors.textSecondary;

    return (
      <View style={[styles.row, isUser && styles.userRow]}>
        <Text style={[styles.rank, {color: rankColor}]}>#{item.rank}</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.fullName.charAt(0)}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.name, isUser && styles.userName]}>{item.fullName}</Text>
          <Text style={styles.level}>Level {item.level}</Text>
        </View>
        <View style={styles.right}>
          {item.badge && <Text style={styles.badge}>{item.badge}</Text>}
          <Text style={styles.xp}>{item.xp.toLocaleString()} XP</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard</Text>
      <Text style={styles.subtitle}>Top performers in your branch</Text>

      {userRank >= 0 && (
        <View style={styles.yourRankCard}>
          <Text style={styles.yourRankLabel}>Your Rank</Text>
          <Text style={styles.yourRankNumber}>#{userRank + 1}</Text>
          <Text style={styles.yourRankXp}>{user?.xp.toLocaleString()} XP</Text>
        </View>
      )}

      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={item => item.userId}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
  title: {
    ...Typography.h1,
    color: Colors.primary,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  yourRankCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  yourRankLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  yourRankNumber: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  yourRankXp: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
  },
  list: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userRow: {
    backgroundColor: '#e8eaf6',
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 40,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    ...Typography.body,
    fontWeight: '500',
    color: Colors.text,
  },
  userName: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  level: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
  },
  badge: {
    fontSize: 20,
  },
  xp: {
    ...Typography.bodySmall,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
});