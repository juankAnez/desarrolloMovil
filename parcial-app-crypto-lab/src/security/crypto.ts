import CryptoJS from 'crypto-js';

/**
 * ⚠ LABORATORIO — Criptografía insuficiente (a propósito)
 *
 * V1 (CWE-321 / CWE-798): clave AES-128 hardcodeada en el código fuente.
 * V2 (CWE-327 / CWE-329): modo AES-ECB sin IV ni aleatoriedad.
 * V3 (CWE-328): MD5 con salt fija como "autenticación" de contraseña.
 */

export const SECRET_KEY = 'Serv1Go#2026Key!'; // exactamente 16 bytes -> AES-128
export const MD5_SALT = 'SG-Parcial-2026:'; // salt fija hardcodeada

/** V3: MD5(salt + password) en hex. */
export function hashPassword(password: string): string {
  return CryptoJS.MD5(MD5_SALT + password).toString(CryptoJS.enc.Hex);
}

/** V2: AES-128-ECB + PKCS7 -> base64. Sin IV: mensajes iguales producen bytes iguales. */
export function encryptPayload(obj: unknown): string {
  const json = JSON.stringify(obj);
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const encrypted = CryptoJS.AES.encrypt(json, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString(); // base64 del ciphertext (compatible con openssl -aes-128-ecb -K)
}

/** Inverso de encryptPayload (usado para restaurar sesión). */
export function decryptPayload(b64: string): string {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const decrypted = CryptoJS.AES.decrypt(b64, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
