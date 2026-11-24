import { FormEvent, useRef, useState } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { getLocalAssistantReply } from '../data/assistantKnowledge';
import { SMART_DEVICES } from '../data/smartHomeData';
import { computeSecurityPercent, useGameStore } from '../store/useGameStore';

export function CyberAssistantModal() {
  const activeModal = useGameStore((s) => s.activeModal);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const selectedDeviceId = useGameStore((s) => s.selectedDeviceId);
  const deviceStates = useGameStore((s) => s.deviceStates);
  const score = useGameStore((s) => s.score);
  const assistantMessages = useGameStore((s) => s.assistantMessages);
  const assistantMode = useGameStore((s) => s.assistantMode);
  const addAssistantMessage = useGameStore((s) => s.addAssistantMessage);
  const setAssistantMode = useGameStore((s) => s.setAssistantMode);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  if (activeModal !== 'assistant') return null;

  const selectedDevice = SMART_DEVICES.find((d) => d.id === selectedDeviceId) ?? null;
  const deviceState = selectedDevice ? deviceStates[selectedDevice.id] : null;
  const securityPercent = computeSecurityPercent(deviceStates);
  const protectedCount = SMART_DEVICES.filter(
    (d) => deviceStates[d.id]?.status === 'protected',
  ).length;
  const vulnerableRemaining = SMART_DEVICES.filter(
    (d) => d.isInitiallyVulnerable && deviceStates[d.id]?.status !== 'protected',
  ).length;

  const askQuestion = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    addAssistantMessage({
      sender: 'user',
      text: trimmed,
      mode: assistantMode,
    });
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          context: {
            selectedDeviceName: selectedDevice?.name ?? null,
            selectedDeviceProtocol: selectedDevice?.protocol ?? null,
            selectedDeviceStage: deviceState?.stage ?? null,
            selectedDeviceClues:
              selectedDevice && deviceState
                ? selectedDevice.clues
                    .slice(0, deviceState.revealedClueCount)
                    .map((c) => `${c.label}: ${c.value}`)
                : [],
            score,
            securityPercent,
            protectedCount,
            vulnerableRemaining,
          },
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          available?: boolean;
          reply?: string;
        };
        if (data.available && data.reply) {
          setAssistantMode('gemini');
          addAssistantMessage({
            sender: 'assistant',
            text: data.reply,
            mode: 'gemini',
          });
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback cleanly to local educational knowledge base
    }

    const localReply = getLocalAssistantReply(trimmed, {
      selectedDevice,
      deviceState,
      score,
      securityPercent,
      protectedCount,
      vulnerableRemaining,
    });
    setAssistantMode('local');
    addAssistantMessage({
      sender: 'assistant',
      text: localReply,
      mode: 'local',
    });
    setLoading(false);
    setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void askQuestion(input);
  };

  const quickPrompts = [
    selectedDevice ? `Pedir pista sobre ${selectedDevice.shortName}` : 'Por onde devo começar?',
    'Por que senha padrão é perigosa?',
    'O que é WPA3 e segmentação IoT?',
    'Como funciona minha pontuação?',
  ];

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-end bg-[#18212F]/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistant-title"
    >
      <div className="flex h-full w-full max-w-md flex-col border-l border-[#E9EDF2] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E9EDF2] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#315EAA]/20 bg-[#EFF6FF] text-[#315EAA]">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 id="assistant-title" className="font-display text-base font-bold text-[#18212F]">
                CYBER ASSISTANT
              </h2>
              <p className="text-[11px] text-[#64748B]">
                {assistantMode === 'gemini'
                  ? 'Assistente IA Conectado · Pistas educativas'
                  : 'Guia Educativo · Pistas sem resposta pronta'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal('none')}
            aria-label="Fechar assistente"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] text-[#475569] transition-colors hover:bg-[#F1F5F9] hover:text-[#18212F]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Context Banner */}
        {selectedDevice && (
          <div className="border-b border-[#E9EDF2] bg-[#F8FAFC] px-5 py-2.5 text-xs text-[#475569]">
            Dispositivo em foco: <strong className="text-[#315EAA]">{selectedDevice.name}</strong>
          </div>
        )}

        {/* Messages */}
        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-[#F5F6F8] p-5">
          {assistantMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#315EAA] font-medium text-white'
                    : 'border border-[#E9EDF2] bg-white text-[#18212F] shadow-xs'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-[#315EAA]">
                    <Sparkles className="h-3 w-3" />
                    <span>
                      CYBER ASSISTANT · {msg.mode === 'gemini' ? 'IA' : 'Guia Local'}
                    </span>
                  </div>
                )}
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-xs text-[#64748B]">Analisando contexto da auditoria...</div>
          )}
        </div>

        {/* Quick Questions */}
        <div className="border-t border-[#E9EDF2] bg-white px-4 pt-3 pb-2">
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp) => (
              <button
                key={qp}
                type="button"
                onClick={() => void askQuestion(qp)}
                disabled={loading}
                className="rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] px-2.5 py-1.5 text-[11px] font-medium text-[#475569] transition-colors hover:border-[#315EAA]/40 hover:bg-white hover:text-[#18212F]"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="border-t border-[#E9EDF2] bg-white p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre IoT, alertas ou peça uma pista..."
              className="flex-1 rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] px-3 py-2 text-xs text-[#18212F] placeholder:text-[#94A3B8] focus:border-[#315EAA] focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Enviar pergunta"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#315EAA] text-white transition-colors hover:bg-[#274D8C] disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
