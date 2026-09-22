import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../constants/colors';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: ViewStyle;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Buscar servicios, técnicos o tareas...',
  onClear,
  style,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View style={[styles.container, isFocused && styles.containerFocused, style]}>
      <Ionicons
        name="search-outline"
        size={18}
        color={isFocused ? Colors.primary : Colors.textMuted}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable onPress={handleClear} hitSlop={8} style={styles.clearBtn}>
          <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  containerFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    paddingVertical: 0,
    height: '100%',
  },
  clearBtn: {
    marginLeft: 6,
    padding: 2,
  },
});
