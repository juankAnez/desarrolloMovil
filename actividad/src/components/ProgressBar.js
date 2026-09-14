// ProgressBar PRO - con gradiente y animación suave
import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius } from '../styles/theme';

const ProgressBar = ({
  progress,
  height = 8,
  backgroundColor = colors.border,
  progressColor = colors.primary,
  useGradient = true,
  showDot = false,
  animated = true,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const clamped = Math.min(Math.max(progress, 0), 1);

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clamped,
        duration: 900,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clamped);
    }
  }, [clamped]);

  const gradientColors =
    progressColor === colors.success
      ? ['#10b981', '#06b6d4']
      : progressColor === colors.warning
      ? ['#f59e0b', '#f97316']
      : ['#6366f1', '#8b5cf6'];

  return (
    <View
      style={{
        width: '100%',
        height,
        backgroundColor,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Animated.View
        style={{
          width: animatedWidth.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
          height: '100%',
          borderRadius: borderRadius.full,
          overflow: 'hidden',
        }}
      >
        {useGradient ? (
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderRadius: borderRadius.full }}
          />
        ) : (
          <View style={{ flex: 1, backgroundColor: progressColor, borderRadius: borderRadius.full }} />
        )}
      </Animated.View>

      {showDot && clamped > 0.05 && (
        <View
          style={{
            width: height + 2,
            height: height + 2,
            borderRadius: (height + 2) / 2,
            backgroundColor: '#fff',
            borderWidth: 2,
            borderColor: progressColor,
            marginLeft: - (height + 2) / 2,
            shadowColor: progressColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 3,
          }}
        />
      )}
    </View>
  );
};

export default ProgressBar;
