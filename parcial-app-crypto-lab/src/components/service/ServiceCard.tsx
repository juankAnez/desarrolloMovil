import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServiceItem } from '../../types/service';
import { UserAvatar } from '../ui/UserAvatar';

interface ServiceCardProps {
  service: ServiceItem;
  onPress: () => void;
}

// Configuración de colores e iconos según categoría
const getCategoryTheme = (category: string) => {
  switch (category) {
    case 'Tecnología':
      return {
        bgLight: '#EFF6FF',
        border: '#DBEAFE',
        text: '#1D4ED8',
        icon: 'laptop-outline' as const,
      };
    case 'Hogar':
      return {
        bgLight: '#EEF2FF',
        border: '#E0E7FF',
        text: '#4338CA',
        icon: 'sparkles-outline' as const,
      };
    case 'Electricidad':
      return {
        bgLight: '#FFFBEB',
        border: '#FEF3C7',
        text: '#B45309',
        icon: 'flash-outline' as const,
      };
    case 'Plomería':
      return {
        bgLight: '#ECFEFF',
        border: '#CFFAFE',
        text: '#0E7490',
        icon: 'water-outline' as const,
      };
    case 'Educación':
      return {
        bgLight: '#FDF4FF',
        border: '#F5D0FE',
        text: '#86198F',
        icon: 'school-outline' as const,
      };
    case 'Diseño':
      return {
        bgLight: '#FDF2F8',
        border: '#FCE7F3',
        text: '#BE185D',
        icon: 'color-palette-outline' as const,
      };
    default:
      return {
        bgLight: '#EFF6FF',
        border: '#DBEAFE',
        text: '#2563EB',
        icon: 'construct-outline' as const,
      };
  }
};

export function ServiceCard({ service, onPress }: ServiceCardProps) {
  const theme = getCategoryTheme(service.category);

  return (
    <View style={styles.card}>
      {/* Top Badges Row: Category & Distance */}
      <View style={styles.topBadgesRow}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: theme.bgLight, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.categoryBadgeText, { color: theme.text }]}>
            {service.category}
          </Text>
        </View>

        <View style={styles.distanceBadge}>
          <Ionicons name="location-outline" size={13} color="#64748B" />
          <Text style={styles.distanceText}>{service.distanceKm} km</Text>
        </View>
      </View>

      {/* Service Header & Icon */}
      <View style={styles.headerRow}>
        {/* Icon Box */}
        <View
          style={[
            styles.iconBox,
            { backgroundColor: theme.bgLight, borderColor: theme.border },
          ]}
        >
          <Ionicons
            name={service.imageUrl as keyof typeof Ionicons.glyphMap || theme.icon}
            size={22}
            color={theme.text}
          />
        </View>

        <View style={styles.titleDetailsCol}>
          <Text style={styles.serviceTitle} numberOfLines={2}>
            {service.title}
          </Text>

          {/* Provider Info Row */}
          <View style={styles.providerInfoRow}>
            <UserAvatar
              avatar={service.provider.avatar}
              name={service.provider.name}
              size={22}
              borderRadius={11}
              role="PROVIDER"
            />
            <Text style={styles.providerName} numberOfLines={1}>
              {service.provider.name}
            </Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-sharp" size={10} color="#059669" />
              <Text style={styles.verifiedText}>Verificado</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {service.description}
      </Text>

      {/* Rating, Price and Action Footer */}
      <View style={styles.metaFooterRow}>
        <View style={styles.ratingGroup}>
          <Text style={styles.ratingStar}>★</Text>
          <Text style={styles.ratingScore}>{service.rating.toFixed(1)}</Text>
          <Text style={styles.reviewsCount}>({service.reviewCount} reseñas)</Text>
        </View>

        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>DESDE</Text>
          <Text style={styles.priceValue}>{service.priceFormatted}</Text>
        </View>
      </View>

      {/* Full-width CTA Button */}
      <Pressable
        style={({ pressed }) => [
          styles.ctaButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={onPress}
      >
        <Text style={styles.ctaButtonText}>Solicitar Servicio</Text>
        <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  topBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleDetailsCol: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
  },
  providerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  providerAvatarMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerAvatarText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  providerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    gap: 2,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  description: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 10,
  },
  metaFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  ratingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingStar: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '900',
  },
  ratingScore: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  reviewsCount: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: -0.3,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    height: 42,
    borderRadius: 12,
    marginTop: 12,
    gap: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  ctaButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
