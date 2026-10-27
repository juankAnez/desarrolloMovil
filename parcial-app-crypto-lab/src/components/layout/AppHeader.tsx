import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { UserAvatar } from '../ui/UserAvatar';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showGreeting?: boolean;
  isOnline?: boolean;
  onToggleOnline?: () => void;
}

export function AppHeader({
  title,
  subtitle,
  showGreeting = true,
  isOnline = true,
  onToggleOnline,
}: AppHeaderProps) {
  const { user, role, switchRole } = useAuth();

  // Animación de pulso para el badge de "Disponible"
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.5,
            duration: 1100,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1100,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0.2,
            duration: 1100,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.75,
            duration: 1100,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim, pulseOpacity]);

  const firstName = user?.name ? user.name.split(' ')[0] : role === 'CLIENT' ? 'Laura' : 'Carlos';

  return (
    <View style={styles.headerContainer}>
      {/* Top Row: Logo, Location Chip & Role Switcher */}
      <View style={styles.topRow}>
        {/* Brand Logo & Location */}
        <View style={styles.brandRow}>
          <LinearGradient
            colors={
              role === 'CLIENT'
                ? ['#1D4ED8', '#2563EB', '#60A5FA']
                : ['#2563EB', '#4F46E5']
            }
            style={styles.logoBox}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="construct" size={17} color="#FFFFFF" style={{ transform: [{ rotate: '-45deg' }] }} />
          </LinearGradient>

          <View style={styles.brandTextCol}>
            <Text style={styles.brandTitle}>
              Servi<Text style={styles.brandTitleAccent}>Go</Text>
            </Text>
            {/* Location Badge */}
            <View style={styles.locationPill}>
              <Ionicons
                name="location-sharp"
                size={11}
                color={role === 'CLIENT' ? '#EF4444' : '#64748B'}
              />
              <Text style={styles.locationText}>Riohacha</Text>
              <Ionicons name="chevron-down" size={10} color="#94A3B8" />
            </View>
          </View>
        </View>

        {/* Role Badge Switcher Button */}
        <Pressable
          style={({ pressed }) => [
            styles.roleButton,
            role === 'CLIENT' ? styles.roleButtonClient : styles.roleButtonProvider,
            pressed && styles.buttonPressed,
          ]}
          onPress={switchRole}
          hitSlop={8}
        >
          <Ionicons
            name={role === 'CLIENT' ? 'person' : 'briefcase'}
            size={13}
            color={role === 'CLIENT' ? '#FFFFFF' : '#FBBF24'}
          />
          <Text style={styles.roleButtonText}>
            {role === 'CLIENT' ? 'CLIENTE' : 'PRESTADOR'}
          </Text>
          <Ionicons
            name="swap-horizontal"
            size={12}
            color={role === 'CLIENT' ? '#BFDBFE' : '#94A3B8'}
          />
        </Pressable>
      </View>

      {/* Welcome Greeting / Sub-row */}
      {showGreeting && (
        <View style={styles.greetingRow}>
          <View style={styles.greetingLeftGroup}>
            <UserAvatar
              avatar={user?.avatar}
              name={user?.name}
              role={role}
              size={40}
              borderRadius={14}
            />
            <View style={styles.greetingTextCol}>
              {role === 'CLIENT' ? (
                <>
                  <Text style={styles.greetingHeading}>
                    {title || `Hola, ${firstName}`} <Text style={styles.waveEmoji}>👋</Text>
                  </Text>
                  <Text style={styles.greetingSubtitle}>
                    {subtitle || '¿Qué servicio calificado necesitas hoy?'}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.greetingSubSmall}>
                    {subtitle || 'Bienvenido de nuevo'}
                  </Text>
                  <Text style={styles.greetingHeading}>
                    {title || `Hola, ${firstName}`} <Text style={styles.waveEmoji}>👋</Text>
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Provider Online Status Switcher */}
          {role === 'PROVIDER' && onToggleOnline && (
            <Pressable
              style={[
                styles.onlinePill,
                !isOnline && styles.offlinePill,
              ]}
              onPress={onToggleOnline}
              hitSlop={6}
            >
              <View style={styles.dotWrapper}>
                {isOnline && (
                  <Animated.View
                    style={[
                      styles.pingDot,
                      {
                        transform: [{ scale: pulseAnim }],
                        opacity: pulseOpacity,
                      },
                    ]}
                  />
                )}
                <View
                  style={[
                    styles.solidDot,
                    !isOnline && { backgroundColor: '#94A3B8' },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.onlineText,
                  !isOnline && { color: '#64748B' },
                ]}
              >
                {isOnline ? 'Disponible' : 'Pausado'}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 44,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  brandTextCol: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    lineHeight: 20,
  },
  brandTitleAccent: {
    color: '#2563EB',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 1,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  roleButtonClient: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
  },
  roleButtonProvider: {
    backgroundColor: '#0F172A',
  },
  roleButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  greetingLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  greetingTextCol: {
    flex: 1,
  },
  greetingHeading: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  waveEmoji: {
    fontSize: 18,
  },
  greetingSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  greetingSubSmall: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 6,
  },
  offlinePill: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  dotWrapper: {
    position: 'relative',
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pingDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34D399',
  },
  solidDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
});
