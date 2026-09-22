import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import Svg, {
  Rect,
  Path,
  Circle,
  Line,
  G,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Polyline,
  Pattern,
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { LocationPoint, RequestStatus } from '../../types/request';
import { Colors, Radius, Shadows } from '../../constants/colors';

interface RiohachaMapProps {
  clientLocation: LocationPoint;
  providerLocation: LocationPoint;
  status: RequestStatus;
  distanceKm: number;
  etaMinutes: number;
  onSimulateStep?: () => void;
  onOpenChat?: () => void;
  style?: ViewStyle;
}

export function RiohachaMap({
  clientLocation,
  providerLocation,
  status,
  distanceKm,
  etaMinutes,
  onSimulateStep,
  onOpenChat,
  style,
}: RiohachaMapProps) {
  const [mapMode, setMapMode] = useState<'streets' | 'satellite'>('streets');
  const [zoomLevel, setZoomLevel] = useState(1);

  // Geographic bounds of Riohacha urban center
  const minLat = 11.532;
  const maxLat = 11.554;
  const minLng = -72.922;
  const maxLng = -72.898;

  const mapWidth = 380;
  const mapHeight = 280;

  // Convert GPS coordinates to projected map coordinates
  const projectGeo = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth;
    const y = mapHeight - ((lat - minLat) / (maxLat - minLat)) * mapHeight;
    return {
      x: Math.max(35, Math.min(mapWidth - 35, x)),
      y: Math.max(50, Math.min(mapHeight - 35, y)),
    };
  };

  const clientPos = projectGeo(clientLocation.latitude, clientLocation.longitude);
  const providerPos = projectGeo(providerLocation.latitude, providerLocation.longitude);

  const isEnCamino = status === 'ON_THE_WAY';

  // Realistic Turn-by-Turn Route Points following Riohacha's street grid
  // Route goes: Provider -> Calle 10 -> Carrera 12 -> Calle 7 (Calle Ancha) -> Client
  const waypointTurn1 = { x: providerPos.x, y: 155 };
  const waypointTurn2 = { x: 210, y: 155 };
  const waypointTurn3 = { x: 210, y: 110 };

  const routePolylinePoints = `${providerPos.x},${providerPos.y} ${waypointTurn1.x},${waypointTurn1.y} ${waypointTurn2.x},${waypointTurn2.y} ${waypointTurn3.x},${waypointTurn3.y} ${clientPos.x},${clientPos.y}`;

  const isSat = mapMode === 'satellite';

  return (
    <View style={[styles.container, style]}>
      {/* Top Turn-by-Turn Navigation Header (Uber/Google Maps style) */}
      <View style={[styles.turnByTurnBanner, isEnCamino ? styles.bannerEnCamino : styles.bannerStandard]}>
        <View style={styles.turnIconBox}>
          <Ionicons
            name={isEnCamino ? 'arrow-redo' : 'navigate'}
            size={22}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.turnTextsCol}>
          <Text style={styles.turnMainText} numberOfLines={1}>
            {isEnCamino
              ? 'En 150 m gira a la derecha por Calle Ancha (Calle 7)'
              : 'Ruta fijada hacia el domicilio en Riohacha'}
          </Text>
          <Text style={styles.turnSubText} numberOfLines={1}>
            Destino: {clientLocation.label}
          </Text>
        </View>

        <View style={styles.etaHeaderPill}>
          <Text style={styles.etaHeaderMinutes}>{etaMinutes} min</Text>
          <Text style={styles.etaHeaderDist}>{distanceKm} km</Text>
        </View>
      </View>

      {/* SVG Map Canvas */}
      <View style={styles.mapCanvasWrapper}>
        <Svg width="100%" height={mapHeight} viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
          <Defs>
            {/* Ocean Gradients */}
            <LinearGradient id="caribbeanSea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={isSat ? '#082f49' : '#0284c7'} stopOpacity="1" />
              <Stop offset="0.8" stopColor={isSat ? '#0c4a6e' : '#38bdf8'} stopOpacity="0.9" />
              <Stop offset="1" stopColor={isSat ? '#164e63' : '#7dd3fc'} stopOpacity="0.75" />
            </LinearGradient>

            {/* Land Gradients */}
            <LinearGradient id="landBackground" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={isSat ? '#1e293b' : '#f8fafc'} stopOpacity="1" />
              <Stop offset="1" stopColor={isSat ? '#0f172a' : '#f1f5f9'} stopOpacity="1" />
            </LinearGradient>

            {/* Urban Block Pattern */}
            <Pattern id="urbanGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <Rect width="36" height="36" rx="4" fill={isSat ? '#334155' : '#e2e8f0'} opacity={isSat ? 0.35 : 0.6} />
            </Pattern>

            {/* Route Glow */}
            <LinearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#7C3AED" stopOpacity="1" />
              <Stop offset="1" stopColor="#2563EB" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* 1. Base Landmass */}
          <Rect x="0" y="0" width={mapWidth} height={mapHeight} fill="url(#landBackground)" />

          {/* 2. Urban Blocks Grid (Simulates buildings & neighborhoods) */}
          <Rect x="10" y="70" width="360" height="200" fill="url(#urbanGrid)" />

          {/* 3. Caribbean Sea (Playa de Riohacha) */}
          <Path
            d="M 0 0 L 380 0 L 380 56 Q 280 48 190 58 T 0 52 Z"
            fill="url(#caribbeanSea)"
          />

          {/* Wave ripple lines in sea */}
          <Path d="M 20 22 Q 60 18 100 22" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
          <Path d="M 140 16 Q 190 12 240 16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
          <Path d="M 270 28 Q 320 24 370 28" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />

          {/* 4. Golden Sand Beach (Playas de Riohacha) */}
          <Path
            d="M 0 52 Q 100 54 190 58 T 380 56"
            stroke={isSat ? '#d97706' : '#fde047'}
            strokeWidth="5"
            fill="none"
          />

          {/* 5. Iconic "Muelle Turístico de Riohacha" (extends into the sea) */}
          <G id="muelleRiohacha">
            <Line x1="190" y1="58" x2="190" y2="14" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
            <Line x1="184" y1="14" x2="196" y2="14" stroke="#B45309" strokeWidth="4" strokeLinecap="round" />
            <Circle cx="190" cy="14" r="3" fill="#F59E0B" />
          </G>

          {/* 6. Parks (Parque Almirante Padilla & Parque Nicolás de Federmán) */}
          <Rect
            x="200"
            y="98"
            width="34"
            height="26"
            rx="4"
            fill={isSat ? '#064e3b' : '#dcfce7'}
            stroke={isSat ? '#047857' : '#86efac'}
            strokeWidth="1.5"
          />
          <Rect
            x="90"
            y="64"
            width="28"
            height="20"
            rx="4"
            fill={isSat ? '#064e3b' : '#dcfce7'}
            stroke={isSat ? '#047857' : '#86efac'}
            strokeWidth="1.5"
          />

          {/* 7. Riohacha Street Network (Arterial Avenues & Streets) */}
          {/* Av. 1ra / Malecón de la Marina */}
          <Path d="M 0 62 Q 100 64 190 68 T 380 66" stroke={isSat ? '#475569' : '#FFFFFF'} strokeWidth="7" fill="none" />
          <Path d="M 0 62 Q 100 64 190 68 T 380 66" stroke="#94A3B8" strokeWidth="1" strokeDasharray="6, 6" fill="none" />

          {/* Calle 7 (Calle Ancha - Principal) */}
          <Line x1="0" y1="110" x2="380" y2="110" stroke={isSat ? '#475569' : '#FFFFFF'} strokeWidth="8" />
          <Line x1="0" y1="110" x2="380" y2="110" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="8, 6" />

          {/* Calle 10 */}
          <Line x1="0" y1="155" x2="380" y2="155" stroke={isSat ? '#334155' : '#FFFFFF'} strokeWidth="6" />

          {/* Calle 15 */}
          <Line x1="0" y1="205" x2="380" y2="205" stroke={isSat ? '#334155' : '#FFFFFF'} strokeWidth="6" />

          {/* Av. Circunvalar */}
          <Line x1="0" y1="250" x2="380" y2="250" stroke={isSat ? '#475569' : '#FFFFFF'} strokeWidth="7" />

          {/* Carreras Transversales */}
          <Line x1="60" y1="62" x2="60" y2="275" stroke={isSat ? '#334155' : '#FFFFFF'} strokeWidth="5" />
          <Line x1="125" y1="64" x2="125" y2="275" stroke={isSat ? '#475569' : '#FFFFFF'} strokeWidth="6.5" />
          <Line x1="210" y1="66" x2="210" y2="275" stroke={isSat ? '#475569' : '#FFFFFF'} strokeWidth="7" />
          <Line x1="290" y1="68" x2="290" y2="275" stroke={isSat ? '#334155' : '#FFFFFF'} strokeWidth="5.5" />

          {/* 8. Text Labels on Map */}
          <SvgText x="12" y="22" fill="#FFFFFF" fontSize="10" fontWeight="900" letterSpacing="1">
            MAR CARIBE
          </SvgText>
          <SvgText x="195" y="32" fill="#FEF08A" fontSize="8" fontWeight="700">
            Muelle
          </SvgText>
          <SvgText x="285" y="58" fill={isSat ? '#cbd5e1' : '#64748B'} fontSize="8" fontWeight="700">
            Av. La Marina
          </SvgText>
          <SvgText x="18" y="104" fill={isSat ? '#fbbf24' : '#B45309'} fontSize="8" fontWeight="800">
            Calle Ancha (Calle 7)
          </SvgText>
          <SvgText x="202" y="114" fill="#065F46" fontSize="7" fontWeight="bold">
            P. Padilla
          </SvgText>
          <SvgText x="18" y="244" fill={isSat ? '#94a3b8' : '#64748B'} fontSize="8" fontWeight="600">
            Av. Circunvalar
          </SvgText>
          <SvgText x="296" y="260" fill={isSat ? '#64748b' : '#94A3B8'} fontSize="8" fontWeight="600">
            Los Olivos
          </SvgText>

          {/* 9. High-Fidelity Turn-by-Turn Route Line */}
          {/* Outer Route Glow */}
          <Polyline
            points={routePolylinePoints}
            fill="none"
            stroke={isEnCamino ? 'rgba(37, 99, 235, 0.4)' : 'rgba(100, 116, 139, 0.25)'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Core Route Path */}
          <Polyline
            points={routePolylinePoints}
            fill="none"
            stroke={isEnCamino ? 'url(#routeGrad)' : '#3B82F6'}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Route Chevron Direction Marks */}
          <Circle cx={waypointTurn2.x} cy={waypointTurn2.y} r="3" fill="#FFFFFF" />
          <Circle cx={waypointTurn3.x} cy={waypointTurn3.y} r="3" fill="#FFFFFF" />

          {/* 10. Client Marker (Home with Pulsing Ring) */}
          <G x={clientPos.x} y={clientPos.y}>
            <Circle r="20" fill="rgba(37, 99, 235, 0.2)" />
            <Circle r="13" fill={Colors.primary} stroke="#FFFFFF" strokeWidth="2.5" />
            <SvgText x="0" y="3" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
              H
            </SvgText>
            {/* Client Callout Label */}
            <Rect x="-45" y="16" width="90" height="18" rx="4" fill={Colors.secondary} />
            <SvgText x="0" y="28" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
              Tú (Cliente)
            </SvgText>
          </G>

          {/* 11. Provider Marker (Vehicle / Technician with Directional Heading) */}
          <G x={providerPos.x} y={providerPos.y}>
            <Circle
              r="22"
              fill={isEnCamino ? 'rgba(124, 58, 237, 0.3)' : 'rgba(15, 23, 42, 0.2)'}
            />
            <Circle
              r="14"
              fill={isEnCamino ? '#7C3AED' : '#0F172A'}
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
            {/* Heading arrow / vehicle center */}
            <Path d="M -3 3 L 0 -5 L 3 3 Z" fill="#FFFFFF" />

            {/* Provider Callout Label */}
            <Rect
              x="-55"
              y="-28"
              width="110"
              height="18"
              rx="4"
              fill={isEnCamino ? '#6D28D9' : Colors.secondary}
            />
            <SvgText
              x="0"
              y="-16"
              fill="#FFFFFF"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
            >
              {isEnCamino ? 'Prestador • En camino' : 'Taller / Prestador'}
            </SvgText>
          </G>
        </Svg>

        {/* Floating Map HUD Controls (Top Right) */}
        <View style={styles.floatingControls}>
          <Pressable
            style={styles.controlBtn}
            onPress={() => setMapMode(isSat ? 'streets' : 'satellite')}
            hitSlop={6}
          >
            <Ionicons
              name={isSat ? 'map-outline' : 'earth-outline'}
              size={18}
              color={Colors.text}
            />
          </Pressable>

          <Pressable
            style={styles.controlBtn}
            onPress={() => setZoomLevel((prev) => (prev === 1 ? 1.2 : 1))}
            hitSlop={6}
          >
            <Ionicons name="locate" size={18} color={Colors.primary} />
          </Pressable>

          {onOpenChat && (
            <Pressable
              style={[styles.controlBtn, styles.chatFloatBtn]}
              onPress={onOpenChat}
              hitSlop={6}
            >
              <Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" />
              <View style={styles.unreadBadge} />
            </Pressable>
          )}
        </View>

        {/* Live GPS Telemetry Badge (Bottom Left) */}
        <View style={styles.telemetryBadge}>
          <View style={styles.telemetryDot} />
          <Text style={styles.telemetrySpeed}>28 km/h</Text>
          <View style={styles.telemetryDivider} />
          <Text style={styles.telemetryStatus}>Riohacha Centro</Text>
        </View>
      </View>

      {/* Map Bottom Metadata & Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.destInfoCol}>
          <Text style={styles.destLabel}>DIRECCIÓN DE DESTINO</Text>
          <Text style={styles.destAddress} numberOfLines={1}>
            {clientLocation.label}
          </Text>
        </View>

        <View style={styles.metricPair}>
          <Text style={styles.metricVal}>{distanceKm} km</Text>
          <Text style={styles.metricLbl}>Distancia</Text>
        </View>
      </View>

      {/* Interactive Step Simulator Button for Academic Demonstration */}
      {isEnCamino && onSimulateStep && (
        <Pressable
          style={({ pressed }) => [
            styles.simulateBtn,
            pressed && styles.simulateBtnPressed,
          ]}
          onPress={onSimulateStep}
        >
          <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
          <Text style={styles.simulateBtnText}>Simular Avance GPS hacia Cliente</Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.7)" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  turnByTurnBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  bannerStandard: {
    backgroundColor: Colors.secondary,
  },
  bannerEnCamino: {
    backgroundColor: '#047857', // Navigation Green (Google Maps/Waze style)
  },
  turnIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  turnTextsCol: {
    flex: 1,
  },
  turnMainText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  turnSubText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  etaHeaderPill: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  etaHeaderMinutes: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  etaHeaderDist: {
    color: '#A7F3D0',
    fontSize: 10,
    fontWeight: '700',
  },
  mapCanvasWrapper: {
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  floatingControls: {
    position: 'absolute',
    top: 10,
    right: 10,
    gap: 8,
  },
  controlBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  chatFloatBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  telemetryBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    gap: 6,
  },
  telemetryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  telemetrySpeed: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  telemetryDivider: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  telemetryStatus: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  destInfoCol: {
    flex: 1,
    marginRight: 10,
  },
  destLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  destAddress: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  metricPair: {
    alignItems: 'flex-end',
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.primary,
  },
  metricLbl: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  simulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: Radius.md,
    gap: 8,
    ...Shadows.sm,
  },
  simulateBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  simulateBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
