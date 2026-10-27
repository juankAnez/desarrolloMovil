import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { UserAvatar } from '../ui/UserAvatar';

interface AvatarPickerModalProps {
  visible: boolean;
  onClose: () => void;
  currentAvatar: string;
  role: 'CLIENT' | 'PROVIDER';
  onSelectAvatar: (newAvatar: string) => void;
}

// Avatares predeterminados de alta resolución
export const PRESET_AVATARS = {
  CLIENT: [
    {
      id: 'c1',
      name: 'Laura (Foto 1)',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'c2',
      name: 'Valentina (Foto 2)',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'c3',
      name: 'Ana María (Foto 3)',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'c4',
      name: 'David (Foto 4)',
      url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'c5',
      name: 'Camilo (Foto 5)',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'c6',
      name: 'Iniciales LG',
      url: 'LG',
    },
  ],
  PROVIDER: [
    {
      id: 'p1',
      name: 'Carlos (Técnico 1)',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'p2',
      name: 'Javier (Electricista)',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'p3',
      name: 'Andrés (Soporte)',
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'p4',
      name: 'María (Limpieza)',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'p5',
      name: 'Daniela (Diseño)',
      url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80',
    },
    {
      id: 'p6',
      name: 'Iniciales CM',
      url: 'CM',
    },
  ],
};

export function AvatarPickerModal({
  visible,
  onClose,
  currentAvatar,
  role,
  onSelectAvatar,
}: AvatarPickerModalProps) {
  const [customUrl, setCustomUrl] = useState('');

  // Tomar foto con la cámara del dispositivo
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso de Cámara Requerido',
          'Para tomar una foto de perfil, permite el acceso a la cámara en los ajustes de tu dispositivo.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onSelectAvatar(result.assets[0].uri);
        onClose();
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir la cámara en este entorno.');
    }
  };

  // Elegir foto de la galería del teléfono
  const handlePickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso de Galería Requerido',
          'Permite el acceso a tus fotos para elegir una imagen de perfil.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onSelectAvatar(result.assets[0].uri);
        onClose();
      }
    } catch {
      Alert.alert('Error', 'No se pudo acceder a la galería en este entorno.');
    }
  };

  // Aplicar URL personalizada
  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) {
      Alert.alert('URL requerida', 'Ingresa un enlace de imagen válido.');
      return;
    }
    onSelectAvatar(customUrl.trim());
    setCustomUrl('');
    onClose();
  };

  const presets = role === 'CLIENT' ? PRESET_AVATARS.CLIENT : PRESET_AVATARS.PROVIDER;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Foto de Perfil</Text>
              <Text style={styles.modalSub}>
                Personaliza tu foto o avatar en ServiGo
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <Ionicons name="close" size={20} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Foto actual vista previa */}
            <View style={styles.currentPreviewRow}>
              <UserAvatar
                avatar={currentAvatar}
                role={role}
                size={70}
                borderRadius={24}
              />
              <View style={styles.previewTexts}>
                <Text style={styles.previewLabel}>Foto actual</Text>
                <Text style={styles.previewRole}>
                  {role === 'CLIENT' ? 'Cuenta de Cliente' : 'Cuenta de Prestador'}
                </Text>
              </View>
            </View>

            {/* Opciones de Cámara y Galería */}
            <View style={styles.actionsGrid}>
              <Pressable
                style={({ pressed }) => [styles.actionButton, pressed && styles.btnPressed]}
                onPress={handleTakePhoto}
              >
                <View style={styles.actionIconBoxBlue}>
                  <Ionicons name="camera" size={20} color="#2563EB" />
                </View>
                <Text style={styles.actionBtnTitle}>Tomar Foto</Text>
                <Text style={styles.actionBtnSub}>Cámara directa</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.actionButton, pressed && styles.btnPressed]}
                onPress={handlePickFromGallery}
              >
                <View style={styles.actionIconBoxIndigo}>
                  <Ionicons name="images" size={20} color="#4F46E5" />
                </View>
                <Text style={styles.actionBtnTitle}>Elegir de Galería</Text>
                <Text style={styles.actionBtnSub}>Tus fotos guardadas</Text>
              </Pressable>
            </View>

            {/* Galería de Avatares Predeterminados */}
            <View style={styles.presetsSection}>
              <Text style={styles.sectionSubtitle}>
                O elige un avatar profesional sugerido:
              </Text>
              <View style={styles.presetsGrid}>
                {presets.map((preset) => {
                  const isSelected = currentAvatar === preset.url;
                  return (
                    <Pressable
                      key={preset.id}
                      style={[
                        styles.presetItem,
                        isSelected && styles.presetItemSelected,
                      ]}
                      onPress={() => {
                        onSelectAvatar(preset.url);
                        onClose();
                      }}
                    >
                      <UserAvatar
                        avatar={preset.url}
                        role={role}
                        size={52}
                        borderRadius={16}
                      />
                      {isSelected && (
                        <View style={styles.presetSelectedBadge}>
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        </View>
                      )}
                      <Text style={styles.presetName} numberOfLines={1}>
                        {preset.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Ingresar URL Externa */}
            <View style={styles.urlSection}>
              <Text style={styles.sectionSubtitle}>O pega un enlace de imagen:</Text>
              <View style={styles.urlInputRow}>
                <TextInput
                  style={styles.urlInput}
                  placeholder="https://ejemplo.com/mifoto.jpg"
                  placeholderTextColor="#94A3B8"
                  value={customUrl}
                  onChangeText={setCustomUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  style={styles.applyUrlBtn}
                  onPress={handleApplyCustomUrl}
                >
                  <Text style={styles.applyUrlBtnText}>Aplicar</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 440,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    padding: 20,
    gap: 16,
  },
  currentPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  previewTexts: {
    flex: 1,
  },
  previewLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  previewRole: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 4,
  },
  actionIconBoxBlue: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionIconBoxIndigo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionBtnTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionBtnSub: {
    fontSize: 10,
    color: '#64748B',
  },
  presetsSection: {
    gap: 10,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  presetItem: {
    width: '30%',
    alignItems: 'center',
    padding: 8,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    position: 'relative',
    gap: 6,
  },
  presetItemSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  presetSelectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  urlSection: {
    gap: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  urlInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  urlInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 42,
    fontSize: 12,
    color: '#0F172A',
  },
  applyUrlBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyUrlBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
