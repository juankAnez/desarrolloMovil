import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'information-circle';
        let bg = '#1E293B';
        let border = '#334155';
        let iconColor = '#38BDF8';

        if (toast.type === 'success') {
          bg = '#064E3B';
          border = '#059669';
          iconColor = '#34D399';
          iconName = 'checkmark-circle';
        } else if (toast.type === 'warning') {
          bg = '#78350F';
          border = '#D97706';
          iconColor = '#FBBF24';
          iconName = 'warning';
        } else if (toast.type === 'error') {
          bg = '#7F1D1D';
          border = '#DC2626';
          iconColor = '#F87171';
          iconName = 'alert-circle';
        }

        return (
          <View key={toast.id} style={[styles.toast, { backgroundColor: bg, borderColor: border }]}>
            <Ionicons name={iconName} size={20} color={iconColor} style={styles.icon} />
            <Text style={styles.message} numberOfLines={2}>
              {toast.message}
            </Text>
            <TouchableOpacity
              onPress={() => removeToast(toast.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  icon: {
    marginRight: 10,
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  closeBtn: {
    marginLeft: 8,
    padding: 2,
  },
});
