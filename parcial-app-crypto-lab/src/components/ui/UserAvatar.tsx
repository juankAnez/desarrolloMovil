import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface UserAvatarProps {
  avatar?: string;
  name?: string;
  size?: number;
  borderRadius?: number;
  role?: 'CLIENT' | 'PROVIDER';
  showOnlineDot?: boolean;
  showEditBadge?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function UserAvatar({
  avatar,
  name,
  size = 44,
  borderRadius,
  role = 'CLIENT',
  showOnlineDot = false,
  showEditBadge = false,
  onPress,
  style,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const radius = borderRadius !== undefined ? borderRadius : size / 2.5;

  // Determinar si es una URL o URI de imagen válida
  const isImageUri =
    !imageError &&
    Boolean(
      avatar &&
        (avatar.startsWith('http://') ||
          avatar.startsWith('https://') ||
          avatar.startsWith('file://') ||
          avatar.startsWith('data:image'))
    );

  // Iniciales de respaldo si no hay imagen o falla
  const initials = avatar && !isImageUri && avatar.length <= 4
    ? avatar
    : name
    ? name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : role === 'CLIENT'
    ? 'LG'
    : 'CM';

  const gradientColors =
    role === 'CLIENT'
      ? (['#2563EB', '#6366F1'] as const)
      : (['#0F172A', '#334155'] as const);

  const content = (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: radius },
        style,
      ]}
    >
      {isImageUri ? (
        <Image
          source={{ uri: avatar }}
          style={[styles.image, { width: size, height: size, borderRadius: radius }]}
          onError={() => setImageError(true)}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={gradientColors}
          style={[styles.gradient, { width: size, height: size, borderRadius: radius }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text
            style={[
              styles.initialsText,
              { fontSize: Math.max(10, Math.floor(size * 0.38)) },
            ]}
          >
            {initials}
          </Text>
        </LinearGradient>
      )}

      {/* Punto de estado online si se activa */}
      {showOnlineDot && (
        <View style={styles.onlineDotRing}>
          <View style={styles.onlineDot} />
        </View>
      )}

      {/* Botón / Insignia de edición con icono de cámara */}
      {showEditBadge && (
        <View style={styles.editBadge}>
          <Ionicons name="camera" size={Math.max(11, Math.floor(size * 0.22))} color="#FFFFFF" />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'visible',
  },
  image: {
    backgroundColor: '#E2E8F0',
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  onlineDotRing: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#2563EB',
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});
