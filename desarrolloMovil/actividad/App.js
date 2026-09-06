// App.js - Navegación PRO con NativeWind y transiciones
import React, { useState, useRef } from 'react';
import { View, SafeAreaView, Animated, StatusBar } from 'react-native';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreateHabitScreen from './src/screens/CreateHabitScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import BottomNavigation from './src/components/BottomNavigation';

export default function App() {
  const [appState, setAppState] = useState('welcome'); // welcome | login | app
  const [activeScreen, setActiveScreen] = useState('home');
  const [userName, setUserName] = useState('Juan');
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

  const handleLogout = () => {
    animateTransition(() => {
      setAppState('login');
      setActiveScreen('home');
    });
  };

  const renderScreen = () => {
    if (appState === 'welcome') {
      return <WelcomeScreen onGetStarted={() => handleNavigate('login')} />;
    }
    if (appState === 'login') {
      return (
        <LoginScreen
          onLoginPress={(enteredName) => {
            if (enteredName) setUserName(enteredName);
            handleNavigate('app');
          }}
          onBackPress={() => handleNavigate('welcome')}
        />
      );
    }
    switch (activeScreen) {
      case 'home':
        return <HomeScreen userName={userName} onLogout={handleLogout} onCreateHabitPress={() => animateTransition(() => setActiveScreen('create'))} />;
      case 'create':
        return <CreateHabitScreen onBackPress={() => animateTransition(() => setActiveScreen('home'))} />;
      case 'progress':
        return <ProgressScreen userName={userName} onLogout={handleLogout} />;
      default:
        return <HomeScreen userName={userName} onLogout={handleLogout} onCreateHabitPress={() => animateTransition(() => setActiveScreen('create'))} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle={appState === 'welcome' ? 'light-content' : 'dark-content'} />
      <View className="flex-1">
        <Animated.View className="flex-1" style={{ opacity: fadeAnim }}>
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
