import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useAcademies} from '../hooks/useAcademy';
import {Colors} from '../theme/colors';
import {Typography} from '../theme/typography';
import {useNavigation} from '@react-navigation/native';
import {ProgressBar} from '../components/common/ProgressBar';

const {width} = Dimensions.get('window');

export default function AcademyScreen() {
  const navigation = useNavigation<any>();
  const {data: academies, isLoading} = useAcademies();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading academies...</Text>
      </View>
    );
  }

  const renderItem = ({item}: {item: any}) => {
    const progress = item.lessonCount > 0 ? item.completedCount / item.lessonCount : 0;
    return (
      <TouchableOpacity
        style={[styles.card, {borderLeftColor: item.color}]}
        onPress={() => navigation.navigate('AcademyDetail', {academyId: item.id, academyName: item.name})}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>{item.icon}</Text>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardCount}>
            {item.completedCount}/{item.lessonCount}
          </Text>
        </View>
        <Text style={styles.cardDesc}>{item.description}</Text>
        <ProgressBar progress={progress} height={6} fillColor={item.color} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>📚 Academy</Text>
      <Text style={styles.subtitle}>Expand your skills, one module at a time</Text>
      <FlatList
        data={academies}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.primary,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cardTitle: {
    ...Typography.h3,
    flex: 1,
    color: Colors.text,
  },
  cardCount: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  cardDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
});