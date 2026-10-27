import Constants from 'expo-constants';

/**
 * URL del backend de autenticación.
 * Se deriva del host de Metro (mismo PC que corre `npm start` y `node server/server.js`).
 * Si algún día no se puede derivar, edita FALLBACK_HOST con la IP de tu PC.
 */
const FALLBACK_HOST = '192.168.100.11';
const API_PORT = 5000;

function detectHost(): string {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as unknown as { manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } } })?.manifest2
      ?.extra?.expoGo?.debuggerHost ||
    '';
  const match = String(hostUri).match(/^([\d]{1,3}(?:\.[\d]{1,3}){3}):/);
  if (match) return match[1];
  return FALLBACK_HOST;
}

export const API_HOST = detectHost();
export const API_URL = `http://${API_HOST}:${API_PORT}`;
