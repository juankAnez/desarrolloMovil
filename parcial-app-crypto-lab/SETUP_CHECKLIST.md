# SETUP_CHECKLIST — Preparación del lab "Criptografía Insuficiente"

App vulnerable: `C:\Proyectos\desarrolloMovil\parcial-app-crypto-lab` (copia de trabajo; tu parcial original **no** se modificó).
Backend: `server\server.js` (Node, cero dependencias).

---

## Fase 0 — Windows (antes de cada sesión del lab)

### 1. Anotar la IP del PC
```powershell
ipconfig | findstr /i "IPv4"
# hoy: 192.168.100.11 (WiFi Loreley_5G). Si cambia, actualizar <PC> en KALI_GUIA.md
```

### 2. Reglas de firewall (PowerShell **como Administrador**)
```powershell
netsh advfirewall firewall add rule name="Taller Crypto - Metro 8081" dir=in action=allow protocol=TCP localport=8081
netsh advfirewall firewall add rule name="Taller Crypto - API 5000" dir=in action=allow protocol=TCP localport=5000
```
> Sin estas reglas, el iPhone y Kali no alcanzan los puertos (perfil de red = Público).

### 3. (Recomendado) Un solo Metro activo
```powershell
Get-NetTCPConnection -LocalPort 8081 -State Listen | Select OwningProcess
# Si el proceso es un "expo start" de tu parcial original, ciérralo (Ctrl+C en esa terminal)
# o míralo con: Get-CimInstance Win32_Process -Filter "ProcessId=<PID>" | Select CommandLine
```

### 4. Arrancar el backend (terminal dedicada — dejar abierta)
```powershell
node C:\Proyectos\desarrolloMovil\parcial-app-crypto-lab\server\server.js
```
Verificar: `Invoke-WebRequest http://127.0.0.1:5000/health` → `{"ok":true,...}`

### 5. Arrancar Metro (otra terminal — dejar abierta)
```powershell
cd C:\Proyectos\desarrolloMovil\parcial-app-crypto-lab
npm start
```
- Espera el **QR** y la línea `exp://<IP>:8081`.
- Si el puerto 8081 está ocupado y arranca en 8082, usa ese número en la guía (o cierra el Metro anterior).

### 6. Probar la app
- iPhone: misma WiFi, **Expo Go actualizado** (requiere SDK 57).
- Escanear el QR → login Demo 1-Tap `cliente@test.com` / `123456` → debe entrar sin errores.
- Cerrar y reabrir Expo Go → debe restaurar la sesión ("Recordar este dispositivo" marcado).
- En la terminal del backend deberías ver `[LOGIN] OK...` y `[REFRESH] sesión re-sincronizada...`.

### 7. Si algo falla
| Síntoma | Causa probable |
|---|---|
| "No se pudo contactar el servidor de autenticación" | Backend apagado / firewall / IP cambió (`FALLBACK_HOST` en `src\config.ts`) |
| App no carga en Expo Go | Versión de Expo Go ≠ SDK 57 → actualizar desde la App Store |
| IP del PC cambió tras reinicio | Actualizar `FALLBACK_HOST` en `src\config.ts` (o confiar en la auto-detección) y `<PC>` en la guía |

---

## Fase 0 — Kali (VirtualBox)

1. Arrancar la VM `kali-linux-2026.1-virtualbox-amd64` (red **Ya está en Puente** al WiFi Intel — no cambiar).
2. IP de Kali: `ip a | grep inet` → anotar (`<KALI>`).
3. Herramientas (instalar solo las que falten):
```bash
for t in nmap curl python3 mitmdump hashcat john openssl xxd base64 bettercap tcpdump; do
  command -v $t >/dev/null || echo "FALTA: $t"
done
sudo apt update && sudo apt install -y nmap mitmproxy hashcat john bettercap curl python3 tcpdump
```
4. Conectividad con el PC:
```bash
curl -s http://<PC>:5000/health     # backend
curl -sI http://<PC>:8081/ | head -3   # Metro
```

---

## Fase 0 — iPhone

1. Misma WiFi que el PC (Loreley_5G), sin VPN.
2. Expo Go actualizado (SDK 57).
3. **Proxy (solo para las escenas 3–4 de KALI_GUIA):**
   Ajustes → Wi-Fi → (red) → Configurar proxy → **Manual** → Servidor `<KALI>`, Puerto `8080`.
4. **Al terminar de grabar:** mismo camino → **Desactivar**.

---

## Verificación completa (smoke test 2 minutos)

```powershell
# Windows
Invoke-WebRequest http://127.0.0.1:5000/health   # ok:true
Get-NetTCPConnection -LocalPort 8081 -State Listen  # Metro
```
```bash
# Kali
curl -s http://<PC>:5000/health
curl -s http://<PC>:8081/ -H 'expo-platform: ios' -H 'Accept: application/expo+json' | head -c 200
```
```text
iPhone: app carga, login OK, sesión se restaura al reabrir.
```

Si los tres pasan → listo para grabar siguiendo `KALI_GUIA.md`.

---

## Utilidades incluidas (opcional)

- `node server/test-attack.js` — reproduce la cadena completa de ataque en local (login → replay → token forjado → tampering) sin necesidad de Kali. Útil para verificar que todo funciona antes de grabar.
- `server/last_payload.b64` — último payload de prueba (se regenera cada ejecución del test).
