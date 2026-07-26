import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';

interface BadgeIconProps {
  name: string;
  icon: string; // emoji or icon name
  earned: boolean;
  size?: number;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({icon, earned, size = 64}) => {
  return (
    <View style={[styles.container, {width: size, height: size}, !earned && styles.locked]}>
      <Text style={[styles.icon, {fontSize: size * 0.5}]}>{icon}</Text>
      {!earned && <View style={styles.lockOverlay}><Text style={styles.lockText}>🔒</Text></View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locked: {
    opacity: 0.6,
  },
  icon: {
    textAlign: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 2,
  },
  lockText: {
    fontSize: 12,
  },
});