import React from 'react';
import type { UIMessage } from 'ai';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/** Renderiza bloques de texto formateando bloques de código ``` de manera estética */
function RenderContenidoTexto({ texto, esUsuario }: { texto: string; esUsuario: boolean }) {
  if (esUsuario) {
    return <Text style={s.textoUsuario}>{texto}</Text>;
  }

  // Si contiene bloques de código tipo ```lenguaje ... ```
  if (texto.includes('```')) {
    const segmentos = texto.split(/(```[\s\S]*?```)/g);
    return (
      <View style={s.contenedorTexto}>
        {segmentos.map((segmento, idx) => {
          if (segmento.startsWith('```') && segmento.endsWith('```')) {
            const lineas = segmento.slice(3, -3).trim().split('\n');
            const posibleLenguaje = lineas[0].trim();
            const esLenguaje = /^[a-zA-Z0-9_-]+$/.test(posibleLenguaje);
            const lenguaje = esLenguaje ? posibleLenguaje : 'CÓDIGO';
            const codigo = esLenguaje ? lineas.slice(1).join('\n') : lineas.join('\n');

            return (
              <View key={idx} style={s.bloqueCodigo}>
                <View style={s.cabeceraCodigo}>
                  <Text style={s.lenguajeCodigo}>{lenguaje.toUpperCase()}</Text>
                  <Ionicons name="code-slash" size={13} color="#94a3b8" />
                </View>
                <Text style={s.textoCodigo} selectable>
                  {codigo}
                </Text>
              </View>
            );
          }

          if (!segmento.trim()) return null;

          return (
            <Text key={idx} style={s.textoIA}>
              {segmento}
            </Text>
          );
        })}
      </View>
    );
  }

  return <Text style={s.textoIA}>{texto}</Text>;
}

/** Componente moderno para renderizar cada mensaje del chat */
export function Burbuja({ mensaje }: { mensaje: UIMessage }) {
  const esUsuario = mensaje.role === 'user';

  return (
    <View style={[s.fila, esUsuario ? s.filaUsuario : s.filaIA]}>
      {/* Avatar / Icono */}
      {!esUsuario && (
        <View style={s.avatarIA}>
          <Ionicons name="sparkles" size={16} color="#059669" />
        </View>
      )}

      <View style={[s.burbuja, esUsuario ? s.burbujaUsuario : s.burbujaIA]}>
        {/* Cabecera de la burbuja */}
        <View style={s.cabeceraBurbuja}>
          <Text style={[s.autor, esUsuario ? s.autorUsuario : s.autorIA]}>
            {esUsuario ? 'Tú' : 'Tutor IA · Uniguajira'}
          </Text>
        </View>

        {/* Partes del mensaje */}
        {mensaje.parts.map((part, i) => {
          switch (part.type) {
            case 'text':
              return (
                <RenderContenidoTexto
                  key={i}
                  texto={part.text}
                  esUsuario={esUsuario}
                />
              );

            case 'file':
              return part.mediaType.startsWith('image') ? (
                <View key={i} style={s.contenedorFoto}>
                  <Image source={{ uri: part.url }} style={s.foto} resizeMode="cover" />
                  <View style={s.badgeFoto}>
                    <Ionicons name="image" size={12} color="#fff" />
                    <Text style={s.badgeFotoTexto}>Foto analizada</Text>
                  </View>
                </View>
              ) : null;

            default:
              return null;
          }
        })}
      </View>

      {esUsuario && (
        <View style={s.avatarUsuario}>
          <Ionicons name="person" size={15} color="#ffffff" />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'flex-end',
    gap: 8,
  },
  filaUsuario: {
    justifyContent: 'flex-end',
  },
  filaIA: {
    justifyContent: 'flex-start',
  },
  avatarIA: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarUsuario: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  burbuja: {
    maxWidth: '82%',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  burbujaUsuario: {
    backgroundColor: '#059669',
    borderBottomRightRadius: 4,
  },
  burbujaIA: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderBottomLeftRadius: 4,
  },
  cabeceraBurbuja: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  autor: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  autorUsuario: {
    color: '#d1fae5',
  },
  autorIA: {
    color: '#059669',
  },
  contenedorTexto: {
    gap: 8,
  },
  textoUsuario: {
    fontSize: 15,
    color: '#ffffff',
    lineHeight: 22,
  },
  textoIA: {
    fontSize: 15,
    color: '#1e293b',
    lineHeight: 23,
  },
  bloqueCodigo: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 4,
    overflow: 'hidden',
  },
  cabeceraCodigo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  lenguajeCodigo: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  textoCodigo: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#38bdf8',
    padding: 12,
    lineHeight: 19,
  },
  contenedorFoto: {
    position: 'relative',
    marginTop: 4,
    borderRadius: 14,
    overflow: 'hidden',
  },
  foto: {
    width: 230,
    height: 180,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
  },
  badgeFoto: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeFotoTexto: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
});
