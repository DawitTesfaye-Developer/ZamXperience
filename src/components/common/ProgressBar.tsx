import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = Colors.border,
  fillColor = Colors.secondary,
}) => {
  return (
    <View style={[styles.container, {height, backgroundColor}]}>
      <View style={[styles.fill, {width: `${Math.min(progress * 100, 100)}%`, backgroundColor: fillColor}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});