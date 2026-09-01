// App.js - Navegación PRO con transiciones suaves
import React, { useState, useRef } from 'react';
import { View, SafeAreaView, Animated, StatusBar, Platform } from 'react-native';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreateHabitScreen from './src/screens/CreateHabitScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import BottomNavigation from './src/components/BottomNavigation';
import { colors } from './src/styles/theme';

export default function App() {
  const [appState, setAppState] = useState('welcome'); // welcome | login | app
  const [activeScreen, setActiveScreen] = useState('home');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateTransition = (callback) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNavigate = (nextState, nextTab = null) => {
    animateTransition(() => {
      if (nextState) setAppState(nextState);
      if (nextTab) setActiveScreen(nextTab);
    });
  };

  const renderScreen = () => {
    if (appState === 'welcome') {
      return <WelcomeScreen onGetStarted={() => handleNavigate('login')} />;
    }
    if (appState === 'login') {
      return <LoginScreen onLoginPress={() => handleNavigate('app')} />;
    }
    switch (activeScreen) {
      case 'home':
        return <HomeScreen onCreateHabitPress={() => animateTransition(() => setActiveScreen('create'))} />;
      case 'create':
        return <CreateHabitScreen />;
      case 'progress':
        return <ProgressScreen />;
      default:
        return <HomeScreen onCreateHabitPress={() => animateTransition(() => setActiveScreen('create'))} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appState === 'welcome' || appState === 'login' ? colors.background : colors.background }}>
      <StatusBar barStyle={appState === 'welcome' ? 'light-content' : 'dark-content'} backgroundColor={appState === 'welcome' ? '#6366f1' : colors.background} />
      <View style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          {renderScreen()}
        </Animated.View>

        {appState === 'app' && (
          <BottomNavigation
            activeTab={activeScreen}
            onTabChange={(tab) => animateTransition(() => setActiveScreen(tab))}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
