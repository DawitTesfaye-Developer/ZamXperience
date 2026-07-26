import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';

interface LevelBadgeProps {
  level: number;
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: {container: 28, text: 12},
  medium: {container: 40, text: 16},
  large: {container: 56, text: 24},
};

export const LevelBadge: React.FC<LevelBadgeProps> = ({level, size = 'medium'}) => {
  const dims = sizeMap[size];
  return (
    <View style={[styles.container, {width: dims.container, height: dims.container, borderRadius: dims.container / 2}]}>
      <Text style={[styles.text, {fontSize: dims.text}]}>{level}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
});