import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useAuthStore} from '../store/authStore';

// Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MissionsScreen from '../screens/MissionsScreen';
import AcademyScreen from '../screens/AcademyScreen';
import AcademyDetailScreen from '../screens/AcademyDetailScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ScenarioScreen from '../screens/ScenarioScreen';

// Icons (using emoji for simplicity)
const tabIcons: Record<string, string> = {
  Home: '🏠',
  Missions: '🎯',
  Academy: '📚',
  Leaderboard: '🏆',
  Profile: '👤',
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused}) => (
          <Text style={{fontSize: 24, opacity: focused ? 1 : 0.5}}>
            {tabIcons[route.name] || '📌'}
          </Text>
        ),
        tabBarActiveTintColor: '#1a237e',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {fontSize: 11, fontWeight: '500'},
        tabBarStyle: {height: 60, paddingBottom: 8},
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Missions" component={MissionsScreen} />
      <Tab.Screen name="Academy" component={AcademyScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, presentation: 'card'}}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="ScenarioScreen" component={ScenarioScreen} />
      <Stack.Screen name="AcademyDetail" component={AcademyDetailScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const {token, isLoading, isHydrated, hydrate} = useAuthStore();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    if (!isHydrated) {
      hydrate().then(() => setIsReady(true));
    } else {
      setIsReady(true);
    }
  }, [hydrate, isHydrated]);

  if (isLoading || !isReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}