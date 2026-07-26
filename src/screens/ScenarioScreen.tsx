import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useTodaysMission, useProcessDecision} from '../hooks/useMissions';
import {useAuthStore} from '../store/authStore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/stack';

const {width} = Dimensions.get('window');

type ScenarioScreenNavigationProp = NativeStackNavigationProp<
  any,
  'ScenarioScreen'
>;

// Helper to get random greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return '🌅 Good Morning!';
  if (hour < 18) return '☀️ Good Afternoon!';
  return '🌙 Good Evening!';
};

export default function ScenarioScreen() {
  const navigation = useNavigation<ScenarioScreenNavigationProp>();
  const {data: mission, isLoading, error} = useTodaysMission();
  const {mutate: processDecision, isPending: isProcessing} =
    useProcessDecision();
  const user = useAuthStore((state) => state.user);

  // Local state for the current scenario index
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [totalXp, setTotalXp] = useState(user?.xp || 0);

  // Animation values
  const moodDelta = useSharedValue(0);
  const xpPopupScale = useSharedValue(0);
  const xpPopupOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  // Ref to track if we're on the last scenario
  const isFinishing = useRef(false);

  // Reset state when mission changes
  useEffect(() => {
    if (mission) {
      setCurrentScenarioIndex(0);
      setXpEarned(0);
      isFinishing.current = false;
      progressWidth.value = withTiming(0, {duration: 300});
    }
  }, [mission, progressWidth]);

  // Get current scenario
  const scenarios = mission?.scenarios || [];
  const currentScenario = scenarios[currentScenarioIndex];
  const totalScenarios = scenarios.length;

  // Update progress bar
  useEffect(() => {
    if (totalScenarios > 0) {
      const progress = (currentScenarioIndex + 1) / totalScenarios;
      progressWidth.value = withTiming(progress * width * 0.8, {duration: 400});
    }
  }, [currentScenarioIndex, totalScenarios, progressWidth]);

  // Handlers for choices
  const handleChoice = (choiceIndex: number) => {
    if (!currentScenario) return;

    processDecision(
      {
        scenarioId: currentScenario.id,
        choiceIndex,
      },
      {
        onSuccess: (data) => {
          // Update XP earned
          if (data.xpEarned) {
            setXpEarned(data.xpEarned);
            setTotalXp((prev) => prev + data.xpEarned);
            // Animate XP popup
            xpPopupScale.value = withSpring(1.2, {}, () => {
              xpPopupScale.value = withSpring(1);
            });
            xpPopupOpacity.value = withTiming(1, {duration: 300}, () => {
              setTimeout(() => {
                xpPopupOpacity.value = withTiming(0, {duration: 500});
              }, 1500);
            });
          }

          // Animate mood impact (if any)
          const choice = currentScenario.choices[choiceIndex];
          if (choice.impact?.mood) {
            moodDelta.value = withTiming(choice.impact.mood, {duration: 600});
            setTimeout(() => {
              moodDelta.value = withTiming(0, {duration: 400});
            }, 800);
          }

          // If finished, show completion
          if (data.finished) {
            isFinishing.current = true;
            Alert.alert(
              '🎉 Mission Complete!',
              data.message || 'Excellent work!',
              [
                {
                  text: 'Return Home',
                  onPress: () => navigation.goBack(),
                },
              ]
            );
            return;
          }

          // Move to next scenario
          if (data.nextScenario) {
            // Find index of next scenario in our list
            const nextIndex = scenarios.findIndex(
              (s) => s.id === data.nextScenario.id
            );
            if (nextIndex !== -1) {
              setCurrentScenarioIndex(nextIndex);
            } else {
              // If not found (shouldn't happen), just increment
              setCurrentScenarioIndex((prev) => Math.min(prev + 1, totalScenarios - 1));
            }
          } else {
            // Fallback: increment
            setCurrentScenarioIndex((prev) => Math.min(prev + 1, totalScenarios - 1));
          }
        },
        onError: (err) => {
          Alert.alert('Error', 'Failed to process your choice. Please try again.');
          console.error(err);
        },
      }
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a237e" />
        <Text style={styles.loadingText}>Loading your mission...</Text>
      </View>
    );
  }

  // Error state
  if (error || !mission || !currentScenario) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {error ? 'Failed to load mission. Please try again.' : 'No mission available today.'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Animations ---

  // Mood delta animation
  const moodAnimatedStyle = useAnimatedStyle(() => {
    const opacity = Math.abs(moodDelta.value) > 0 ? 1 : 0;
    const color = moodDelta.value >= 0 ? '#4caf50' : '#d32f2f';
    const sign = moodDelta.value >= 0 ? '+' : '';
    return {
      opacity,
      transform: [
        {
          translateY: withSpring(moodDelta.value * -10),
        },
      ],
      color,
    };
  });

  // XP popup animation
  const xpPopupStyle = useAnimatedStyle(() => ({
    opacity: xpPopupOpacity.value,
    transform: [{scale: xpPopupScale.value}],
  }));

  // Progress bar style
  const progressStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.missionTitle}>{mission.title}</Text>
        <View style={styles.xpHeader}>
          <Text style={styles.xpHeaderText}>XP: {totalXp}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
        <Text style={styles.progressText}>
          {currentScenarioIndex + 1} of {totalScenarios}
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Prompt */}
        <Text style={styles.prompt}>{currentScenario.prompt}</Text>

        {/* Mood / Time Delta Indicator */}
        <Animated.Text style={[styles.moodText, moodAnimatedStyle]}>
          {moodDelta.value >= 0 ? '😊 ' : '😟 '}
          {moodDelta.value > 0 ? '+' : ''}
          {Math.round(moodDelta.value)}% Customer Mood
        </Animated.Text>

        {/* Choices */}
        <View style={styles.choicesContainer}>
          {currentScenario.choices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.choiceButton,
                isProcessing && styles.choiceButtonDisabled,
              ]}
              onPress={() => handleChoice(index)}
              disabled={isProcessing || isFinishing.current}
            >
              <Text style={styles.choiceText}>{choice.text}</Text>
              {choice.impact?.time && (
                <Text style={styles.choiceSubtext}>
                  {choice.impact.time < 0 ? '⏱️ ' : '⏱️+'}
                  {Math.abs(choice.impact.time)}min
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* XP Popup Animation */}
        {xpEarned > 0 && (
          <Animated.View style={[styles.xpPopup, xpPopupStyle]}>
            <Text style={styles.xpPopupText}>+{xpEarned} XP</Text>
          </Animated.View>
        )}

        {/* Ending message if any */}
        {currentScenario.isEnding && currentScenario.endingMessage && (
          <View style={styles.endingContainer}>
            <Text style={styles.endingMessage}>{currentScenario.endingMessage}</Text>
          </View>
        )}

        {/* Completion helper text */}
        {isFinishing.current && (
          <Text style={styles.helperText}>Tap "Return Home" to continue.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fe',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#1a237e',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  missionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  xpHeader: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  xpHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  prompt: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a237e',
    lineHeight: 32,
    marginBottom: 8,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  moodText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
    height: 30,
  },
  choicesContainer: {
    marginTop: 8,
    gap: 12,
  },
  choiceButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e8ecf4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  choiceButtonDisabled: {
    opacity: 0.6,
  },
  choiceText: {
    fontSize: 17,
    color: '#1a237e',
    fontWeight: '500',
    flex: 1,
    flexWrap: 'wrap',
  },
  choiceSubtext: {
    fontSize: 13,
    color: '#888',
    marginLeft: 12,
  },
  xpPopup: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: '#4caf50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xpPopupText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  endingContainer: {
    marginTop: 24,
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  endingMessage: {
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'center',
    fontWeight: '500',
  },
  helperText: {
    marginTop: 16,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});