import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function RootIndex() {
  const { isAuthenticated, isRestoring } = useAuth();

  if (isRestoring) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
