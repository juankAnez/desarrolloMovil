import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../../constants/colors';
import { UserAvatar } from '../ui/UserAvatar';

export interface ChatMessage {
  id: string;
  sender: 'CLIENT' | 'PROVIDER';
  text: string;
  time: string;
  read?: boolean;
}

interface ServiceChatModalProps {
  visible: boolean;
  onClose: () => void;
  counterpartName: string;
  counterpartRole: string;
  counterpartAvatar: string;
  currentRole: 'CLIENT' | 'PROVIDER';
  serviceTitle: string;
}

export function ServiceChatModal({
  visible,
  onClose,
  counterpartName,
  counterpartRole,
  counterpartAvatar,
  currentRole,
  serviceTitle,
}: ServiceChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'PROVIDER',
      text: '¡Hola! He confirmado tu solicitud para este servicio. ¿Te encuentras en la dirección indicada?',
      time: '02:30 PM',
      read: true,
    },
    {
      id: 'm2',
      sender: 'CLIENT',
      text: '¡Hola! Sí, aquí estoy. La casa es de rejas blancas, justo al lado de la tienda.',
      time: '02:32 PM',
      read: true,
    },
    {
      id: 'm3',
      sender: 'PROVIDER',
      text: 'Entendido. Ya voy saliendo por la Calle 7 hacia tu ubicación en Riohacha.',
      time: '02:35 PM',
      read: true,
    },
    {
      id: 'm4',
      sender: 'CLIENT',
      text: 'Perfecto, quedo muy atento al mapa en vivo.',
      time: '02:36 PM',
      read: true,
    },
  ]);

  const [inputText, setInputText] = useState('');

  const quickReplies = [
    'Estoy en la puerta',
    '¿Cuánto tiempo tardas?',
    'Ya voy saliendo',
    'Todo listo por acá 👍',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const messageContent = textToSend || inputText;
    if (!messageContent.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: currentRole,
      text: messageContent.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Chat Top Header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={onClose} hitSlop={10}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </Pressable>

          <UserAvatar
            avatar={counterpartAvatar}
            name={counterpartName}
            size={42}
            borderRadius={14}
            showOnlineDot={true}
            role={currentRole === 'CLIENT' ? 'PROVIDER' : 'CLIENT'}
          />

          <View style={styles.headerInfoCol}>
            <Text style={styles.counterpartName} numberOfLines={1}>
              {counterpartName}
            </Text>
            <Text style={styles.counterpartRole}>
              {counterpartRole} • <Text style={styles.onlineText}>En línea</Text>
            </Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerIconBtn}
              onPress={() => alert(`Llamada simulada a ${counterpartName}`)}
              hitSlop={8}
            >
              <Ionicons name="call" size={18} color={Colors.primary} />
            </Pressable>
          </View>
        </View>

        {/* Service Context Mini Bar */}
        <View style={styles.serviceContextBar}>
          <Ionicons name="construct-outline" size={14} color={Colors.primary} />
          <Text style={styles.serviceContextText} numberOfLines={1}>
            Servicio: {serviceTitle}
          </Text>
        </View>

        {/* Messages List */}
        <ScrollView
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const isMe = msg.sender === currentRole;
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageBubbleWrapper,
                  isMe ? styles.bubbleWrapperMe : styles.bubbleWrapperOther,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isMe ? styles.bubbleMe : styles.bubbleOther,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isMe ? styles.messageTextMe : styles.messageTextOther,
                    ]}
                  >
                    {msg.text}
                  </Text>

                  <View style={styles.messageMetaRow}>
                    <Text
                      style={[
                        styles.messageTime,
                        isMe ? styles.messageTimeMe : styles.messageTimeOther,
                      ]}
                    >
                      {msg.time}
                    </Text>
                    {isMe && (
                      <Ionicons name="checkmark-done" size={14} color="#93C5FD" />
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Quick Reply Chips */}
        <View style={styles.quickRepliesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRepliesScroll}
          >
            {quickReplies.map((reply, i) => (
              <Pressable
                key={i}
                style={styles.quickReplyChip}
                onPress={() => handleSendMessage(reply)}
              >
                <Text style={styles.quickReplyText}>{reply}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Input Field */}
        <View style={styles.inputBar}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe un mensaje al prestador..."
              placeholderTextColor={Colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={200}
            />
          </View>

          <Pressable
            style={[
              styles.sendBtn,
              inputText.trim().length > 0 ? styles.sendBtnActive : styles.sendBtnDisabled,
            ]}
            onPress={() => handleSendMessage()}
            disabled={inputText.trim().length === 0}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
    ...Shadows.sm,
  },
  backBtn: {
    padding: 4,
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerInfoCol: {
    flex: 1,
  },
  counterpartName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  counterpartRole: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  onlineText: {
    color: Colors.accent,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceContextBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
  },
  serviceContextText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    flex: 1,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    gap: 10,
  },
  messageBubbleWrapper: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  bubbleWrapperMe: {
    justifyContent: 'flex-end',
  },
  bubbleWrapperOther: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    ...Shadows.sm,
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  messageTextMe: {
    color: '#FFFFFF',
  },
  messageTextOther: {
    color: Colors.text,
  },
  messageMetaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 10,
  },
  messageTimeMe: {
    color: '#BFDBFE',
  },
  messageTimeOther: {
    color: Colors.textMuted,
  },
  quickRepliesContainer: {
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  quickRepliesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickReplyChip: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickReplyText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: Colors.surface,
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    height: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textInput: {
    fontSize: 13,
    color: Colors.text,
    paddingVertical: 0,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
    backgroundColor: Colors.primary,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.textMuted,
  },
});
