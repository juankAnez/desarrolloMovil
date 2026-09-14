import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404 - Ruta no encontrada</Text>
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Volver al Inicio</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  link: { marginTop: 15, paddingVertical: 15 },
  linkText: { fontSize: 14, color: '#2e78b7' },
});
