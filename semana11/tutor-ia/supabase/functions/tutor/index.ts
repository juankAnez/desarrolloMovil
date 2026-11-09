// Edge Function "tutor": el ÚNICO lugar donde vive la API key de Gemini.
// Despliegue:  npx supabase secrets set GEMINI_API_KEY=AIza...
//              npx supabase functions deploy tutor
import { withSupabase } from 'npm:@supabase/server@1';
import { createGoogleGenerativeAI } from 'npm:@ai-sdk/google@4';
import {
  APICallError,
  convertToModelMessages,
  RetryError,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'npm:ai@7';

const apiKey = Deno.env.get('GEMINI_API_KEY');
const google = createGoogleGenerativeAI({ apiKey: apiKey ?? '' });

// Modelo por defecto: gemini-2.0-flash o gemini-1.5-flash (compatibles con Google AI Studio)
const MODELO = Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.0-flash';

const INSTRUCCIONES = `Eres "Tutor IA", un tutor experto de Programación Móvil Avanzada (React Native con Expo, TypeScript y Supabase)
de la Universidad de La Guajira. 
- Respondes en español, con tono pedagógico, claro, amigable y conciso (máximo 10 líneas, salvo que te soliciten código completo).
- Si te envían una foto (código, error de terminal o interfaz), analízala minuciosamente, explica el origen del problema y propón la solución corregida.
- Si no sabes algo o no tienes certeza, admítelo con honestidad; nunca inventes APIs o librerías inexistentes.`;

export default {
  // auth: 'user' => sin un token de sesión válido de Supabase responde 401 y nunca llega a Gemini.
  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {
    // Soporte preflight CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      });
    }

    if (req.method !== 'POST') return new Response('Usa POST', { status: 405 });

    if (!Deno.env.get('GEMINI_API_KEY')) {
      return new Response(
        JSON.stringify({ error: 'Falta configurar el secreto GEMINI_API_KEY en Supabase Edge Functions.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: google(MODELO),
      instructions: `${INSTRUCCIONES}\nEl estudiante que pregunta es ${ctx.userClaims?.email ?? 'anónimo'}.`,
      // La API no tiene memoria: se reenvía el historial. Solo los últimos 20 mensajes para optimizar tokens.
      messages: await convertToModelMessages(messages.slice(-20)),
      temperature: 0.4,
      maxRetries: 1,
      maxOutputTokens: 1500,
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        // Lo que devuelve onError es lo que ve el usuario en error.message.
        onError: (error) => {
          console.error('[tutor-error]', error);
          const real = RetryError.isInstance(error) ? error.lastError : error;
          if (APICallError.isInstance(real) && real.statusCode === 429) {
            return 'Se agotó la cuota gratuita de Gemini. Espera un minuto e intenta de nuevo.';
          }
          if (APICallError.isInstance(real) && real.statusCode === 404) {
            return `El modelo de Gemini configurado (${MODELO}) no está disponible en tu API key.`;
          }
          return 'El tutor no pudo responder en este momento. Por favor intenta de nuevo.';
        },
      }),
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'none',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }),
};
