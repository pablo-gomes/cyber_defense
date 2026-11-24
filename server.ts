import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Complementary Cyber Assistant API (gracefully reports availability if key is absent)
  app.post('/api/assistant', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(200).json({ available: false, reason: 'NO_API_KEY' });
      return;
    }

    const { question, context } = req.body as {
      question?: string;
      context?: {
        selectedDeviceName?: string | null;
        selectedDeviceProtocol?: string | null;
        selectedDeviceStage?: string | null;
        selectedDeviceClues?: string[];
        score?: number;
        securityPercent?: number;
        protectedCount?: number;
        vulnerableRemaining?: number;
      };
    };

    if (!question || typeof question !== 'string') {
      res.status(400).json({ available: false, reason: 'INVALID_QUESTION' });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction =
        'Você é o CYBER ASSISTANT, um tutor didático de cibersegurança em Smart Homes (IoT) em português do Brasil. ' +
        'Explique conceitos de forma clara, simples e objetiva (máximo 4 frases). ' +
        'REGRA CRÍTICA: Nunca entregue diretamente a resposta exata da alternativa correta de um desafio antes do jogador tentar; ofereça apenas pistas progressivas e explicações conceituais.';

      const contextSummary = context
        ? `Contexto atual do jogador: Pontuação ${context.score ?? 0}/1000, Segurança ${context.securityPercent ?? 0}%, Dispositivos protegidos: ${context.protectedCount ?? 0}, Vulnerabilidades restantes: ${context.vulnerableRemaining ?? 0}. Dispositivo selecionado: ${context.selectedDeviceName ?? 'Nenhum'} (etapa: ${context.selectedDeviceStage ?? 'nenhuma'}). Registros já revelados: ${(context.selectedDeviceClues ?? []).join(' | ') || 'nenhum'}.`
        : '';

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `${contextSummary}\n\nPergunta do jogador: ${question}`,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(200).json({ available: false, reason: 'EMPTY_RESPONSE' });
        return;
      }

      res.json({ available: true, reply });
    } catch (error) {
      console.error('Assistant endpoint fallback:', error instanceof Error ? error.message : error);
      res.status(200).json({ available: false, reason: 'UPSTREAM_ERROR' });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CYBER DEFENSE server listening on http://localhost:${PORT}`);
  });
}

void startServer();
