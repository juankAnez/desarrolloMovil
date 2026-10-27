/**
 * ServiGo — Backend de autenticación (LABORATORIO)
 * ⚠ Servidor vulnerable a propósito:
 *   - V4 (CWE-319): escucha solo HTTP plano en 0.0.0.0:5000
 *   - Recibe payload cifrado con AES-128-ECB + clave compartida hardcodeada (V1/V2)
 *   - V3 (CWE-328): valida MD5(salt+password) sin work factor
 *   - V6 (CWE-330): token base64 sin firma ni expiración (forjeable y reutilizable)
 *   - No valida integridad del perfil: acepta el JSON que llegue (tampering)
 *
 * Uso:  node server/server.js
 */
const http = require('http');
const crypto = require('crypto');

const PORT = 5000;
const SECRET_KEY = 'Serv1Go#2026Key!'; // clave AES-128 compartida con la app (V1)
const MD5_SALT = 'SG-Parcial-2026:'; // salt fija compartida con la app (V3)

function md5(s) {
  return crypto.createHash('md5').update(s).digest('hex');
}

// "Base de datos" de usuarios
const USERS = {
  'cliente@test.com': { role: 'CLIENT', passwordHash: md5(MD5_SALT + '123456') },
  'prestador@test.com': { role: 'PROVIDER', passwordHash: md5(MD5_SALT + '123456') },
};

// Perfiles: se sobrescriben con lo que llega en cada login (sin validación de integridad)
const profiles = {};

function decryptPayload(b64) {
  const buf = Buffer.from(b64, 'base64');
  const d = crypto.createDecipheriv('aes-128-ecb', Buffer.from(SECRET_KEY, 'utf8'), null);
  d.setAutoPadding(true);
  return Buffer.concat([d.update(buf), d.final()]).toString('utf8');
}

function makeToken(payload) {
  // V6: solo base64, SIN firma ni expiración
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function decodeToken(token) {
  try {
    return JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

function log(...args) {
  console.log(`[${new Date().toISOString()}]`, ...args);
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
}

function sendJSON(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json', ...corsHeaders() });
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => resolve(data));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const path = url.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders());
    res.end();
    return;
  }

  // ---- Salud ----
  if (req.method === 'GET' && path === '/health') {
    sendJSON(res, 200, { ok: true, service: 'servigo-auth', ts: Date.now() });
    return;
  }

  // ---- Login ----
  if (req.method === 'POST' && path === '/api/login') {
    const body = await readBody(req);
    let payloadB64;
    try {
      payloadB64 = JSON.parse(body).payload;
      if (!payloadB64) throw new Error('sin payload');
    } catch {
      sendJSON(res, 400, { message: 'Body inválido: se espera {payload: base64}' });
      return;
    }

    let data;
    try {
      data = JSON.parse(decryptPayload(payloadB64));
    } catch (e) {
      log('[LOGIN] payload ilegible:', e.message);
      sendJSON(res, 400, { message: 'Payload no descifra con la clave del servidor.' });
      return;
    }

    const { email, passwordHash, user } = data;
    const record = USERS[email];
    if (!record) {
      log('[LOGIN] usuario desconocido:', email);
      sendJSON(res, 401, { message: 'Usuario no registrado.' });
      return;
    }
    if (passwordHash !== record.passwordHash) {
      log('[LOGIN] hash inválido para', email, '(esperado', record.passwordHash, ')');
      sendJSON(res, 401, { message: 'Hash de contraseña inválido.' });
      return;
    }

    // Acepta el perfil tal cual llega (sin verificar integridad -> tampering)
    profiles[email] = { ...(user || {}), email, role: record.role };

    const token = makeToken({ email, role: record.role, iat: Date.now() });
    log('[LOGIN] OK para', email, '-> token emitido (base64, sin firma)');
    sendJSON(res, 200, {
      token,
      profile: profiles[email],
      message: 'Autenticación exitosa',
    });
    return;
  }

  // ---- Perfil (protegido solo por el token) ----
  if (req.method === 'GET' && path === '/api/profile') {
    const auth = req.headers.authorization || '';
    const token = auth.replace(/^Bearer\s+/i, '');
    const claims = decodeToken(token);
    if (!claims || !claims.email) {
      log('[PROFILE] token inválido o ausente');
      sendJSON(res, 401, { message: 'Token inválido (se espera Authorization: Bearer <token>).' });
      return;
    }
    const profile = profiles[claims.email] || { email: claims.email, role: claims.role };
    log('[PROFILE] entrega de perfil para', claims.email, '(token NO verificado criptográficamente)');
    sendJSON(res, 200, { profile, claims });
    return;
  }

  // ---- Re-sincronización de sesión (al abrir la app) ----
  if (req.method === 'POST' && path === '/api/session/refresh') {
    const body = await readBody(req);
    try {
      const payloadB64 = JSON.parse(body).payload;
      const data = JSON.parse(decryptPayload(payloadB64));
      log('[REFRESH] sesión re-sincronizada para', data.email || '?', '- PII recibida en claro tras descifrar');
      sendJSON(res, 200, { ok: true });
    } catch (e) {
      log('[REFRESH] payload ilegible:', e.message);
      sendJSON(res, 400, { message: 'Payload inválido.' });
    }
    return;
  }

  sendJSON(res, 404, { message: 'Ruta no encontrada' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('========================================================');
  console.log(' ServiGo Auth (LAB) escuchando en http://0.0.0.0:' + PORT);
  console.log('  - POST /api/login           {payload}');
  console.log('  - GET  /api/profile         Authorization: Bearer <token>');
  console.log('  - POST /api/session/refresh {payload}');
  console.log('  - GET  /health');
  console.log('========================================================');
});
