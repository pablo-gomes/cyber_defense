import { useState } from 'react';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Lock,
  Search,
  ShieldAlert,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';
import { ROOMS, SMART_DEVICES } from '../data/smartHomeData';
import { useGameStore } from '../store/useGameStore';
import { SeverityLevel } from '../types/game';
import { DeviceIcon } from './DeviceIcon';

function SeverityTag({ level }: { level: SeverityLevel }) {
  const styles =
    level === 'ALTO'
      ? 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'
      : level === 'MÉDIO'
        ? 'border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]'
        : 'border-[#BFDBFE] bg-[#EFF6FF] text-[#315EAA]';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[11px] font-semibold ${styles}`}
    >
      <AlertTriangle className="h-3 w-3" />
      <span>Risco {level}</span>
    </span>
  );
}

export function DeviceInvestigationPanel() {
  const selectedDeviceId = useGameStore((s) => s.selectedDeviceId);
  const deviceStates = useGameStore((s) => s.deviceStates);
  const selectDevice = useGameStore((s) => s.selectDevice);
  const startInvestigation = useGameStore((s) => s.startInvestigation);
  const revealNextClue = useGameStore((s) => s.revealNextClue);
  const validateSecureDevice = useGameStore((s) => s.validateSecureDevice);
  const submitVulnerabilityAnswer = useGameStore((s) => s.submitVulnerabilityAnswer);
  const submitThreatAnswer = useGameStore((s) => s.submitThreatAnswer);
  const submitProtectionAnswer = useGameStore((s) => s.submitProtectionAnswer);
  const setActiveModal = useGameStore((s) => s.setActiveModal);

  const [specsOpen, setSpecsOpen] = useState(false);

  if (!selectedDeviceId) {
    return null;
  }

  const device = SMART_DEVICES.find((d) => d.id === selectedDeviceId);
  const state = deviceStates[selectedDeviceId];
  if (!device || !state) return null;

  const roomName = ROOMS.find((r) => r.id === device.roomId)?.name ?? '';
  const visibleClues = device.clues.slice(0, state.revealedClueCount);
  const allCluesRevealed = state.revealedClueCount >= device.clues.length;

  const statusText =
    state.status === 'protected'
      ? 'Protegido'
      : state.status === 'partial'
        ? 'Parcialmente protegido'
        : state.status === 'vulnerable'
          ? 'Vulnerável'
          : state.status === 'investigating'
            ? 'Em investigação'
            : 'Não auditado';

  const statusBadgeClass =
    state.status === 'protected'
      ? 'bg-[#ECFDF5] text-[#197A52] border-[#A7F3D0]'
      : state.status === 'partial'
        ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
        : state.status === 'vulnerable'
          ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]'
          : state.status === 'investigating'
            ? 'bg-[#EFF6FF] text-[#315EAA] border-[#BFDBFE]'
            : 'bg-[#F8FAFC] text-[#64748B] border-[#E9EDF2]';

  return (
    <aside className="z-10 flex h-full w-full max-w-[400px] shrink-0 flex-col border-l border-[#E9EDF2] bg-white">
      {/* Identificação */}
      <div className="flex items-start justify-between gap-3 border-b border-[#E9EDF2] px-5 py-4">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              state.status === 'protected'
                ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#197A52]'
                : state.status === 'vulnerable'
                  ? 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'
                  : 'border-[#BFDBFE] bg-[#EFF6FF] text-[#315EAA]'
            }`}
          >
            <DeviceIcon kind={device.kind} className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold text-[#18212F]">{device.name}</h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
              <span>{roomName}</span>
              <span
                className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${statusBadgeClass}`}
              >
                {statusText}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => selectDevice(null)}
          aria-label="Fechar painel do dispositivo"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#18212F]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable Contextual Sections */}
      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {/* Identificação & Ficha Técnica (expansível) */}
        <section className="space-y-2.5">
          <p className="text-xs leading-relaxed text-[#475569]">{device.summary}</p>
          <div className="overflow-hidden rounded-xl border border-[#E9EDF2] bg-[#F8FAFC]">
            <button
              type="button"
              onClick={() => setSpecsOpen((v) => !v)}
              className="flex w-full items-center justify-between px-3.5 py-2 text-xs font-semibold text-[#18212F] hover:bg-[#F1F5F9]"
            >
              <span>Especificações de rede</span>
              {specsOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-[#64748B]" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-[#64748B]" />
              )}
            </button>
            {specsOpen && (
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-[#E9EDF2] bg-white p-3.5 text-xs">
                <div>
                  <dt className="text-[11px] text-[#64748B]">Conexão</dt>
                  <dd className="mt-0.5 font-medium text-[#18212F]">{device.connectionType}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-[#64748B]">Endereço</dt>
                  <dd className="mt-0.5 font-mono text-[#18212F]">{device.ipAddress}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-[#64748B]">Firmware</dt>
                  <dd className="mt-0.5 font-mono text-[#18212F]">{device.firmwareVersion}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-[#64748B]">Protocolo</dt>
                  <dd className="mt-0.5 font-mono text-[#18212F]">{device.protocol}</dd>
                </div>
              </dl>
            )}
          </div>
        </section>

        {/* Ação de investigação inicial */}
        {state.stage === 'locked' && (
          <section className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-4">
            <h3 className="text-xs font-semibold text-[#18212F]">Auditoria pendente</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#475569]">
              Inicie a varredura para coletar registros de acesso, firmware e permissões deste
              equipamento.
            </p>
            <button
              type="button"
              onClick={() => startInvestigation(device.id)}
              className="mt-3 inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg bg-[#315EAA] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#274D8C]"
            >
              <Search className="h-4 w-4" />
              <span>Iniciar investigação</span>
            </button>
          </section>
        )}

        {/* Registros coletados */}
        {state.stage !== 'locked' && (
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[#18212F]">
                Registros coletados ({visibleClues.length}/{device.clues.length})
              </h3>
              {!allCluesRevealed && (
                <button
                  type="button"
                  onClick={() => revealNextClue(device.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#315EAA] hover:text-[#274D8C]"
                >
                  <span>Coletar próximo sinal</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              {visibleClues.map((clue) => (
                <div
                  key={clue.id}
                  className={`rounded-xl border p-3 text-xs ${
                    clue.suspicious
                      ? 'border-[#FDE68A] bg-[#FFFBEB]'
                      : 'border-[#E9EDF2] bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#18212F]">{clue.label}</span>
                    <span
                      className={`font-mono text-[10px] font-semibold ${
                        clue.suspicious ? 'text-[#B45309]' : 'text-[#197A52]'
                      }`}
                    >
                      {clue.suspicious ? 'Sinal suspeito' : 'Normal'}
                    </span>
                  </div>
                  <p className="mt-1 leading-relaxed text-[#475569]">{clue.value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Feedback da decisão */}
        {state.lastFeedback && (
          <div
            role="status"
            className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
              state.lastFeedbackQuality === 'correct'
                ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#18212F]'
                : state.lastFeedbackQuality === 'partial'
                  ? 'border-[#FDE68A] bg-[#FFFBEB] text-[#18212F]'
                  : 'border-[#FECACA] bg-[#FEF2F2] text-[#18212F]'
            }`}
          >
            <div className="mb-1 flex items-center gap-1.5 font-semibold">
              {state.lastFeedbackQuality === 'correct' ? (
                <CheckCircle2 className="h-4 w-4 text-[#197A52]" />
              ) : state.lastFeedbackQuality === 'partial' ? (
                <ShieldAlert className="h-4 w-4 text-[#B45309]" />
              ) : (
                <XCircle className="h-4 w-4 text-[#B91C1C]" />
              )}
              <span>
                {state.lastFeedbackQuality === 'correct'
                  ? 'Avaliação correta'
                  : state.lastFeedbackQuality === 'partial'
                    ? 'Proteção parcial'
                    : 'Decisão inadequada'}
              </span>
            </div>
            <p className="text-[#475569]">{state.lastFeedback}</p>
          </div>
        )}

        {/* Dispositivo seguro: validação */}
        {state.stage === 'clues_revealed' && !device.isInitiallyVulnerable && (
          <section className="space-y-2.5 border-t border-[#E9EDF2] pt-4">
            <h3 className="text-xs font-semibold text-[#18212F]">
              Conclusão da auditoria
            </h3>
            <p className="text-xs text-[#64748B]">
              {allCluesRevealed
                ? 'Com base nos sinais analisados, qual é o estado deste equipamento?'
                : 'Colete todos os registros acima antes de finalizar seu diagnóstico.'}
            </p>

            {allCluesRevealed ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => validateSecureDevice(device.id, true)}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] px-3.5 py-2.5 text-left text-xs font-semibold text-[#197A52] transition-colors hover:bg-[#D1FAE5]"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Confirmar que o dispositivo está protegido</span>
                </button>
                <button
                  type="button"
                  onClick={() => validateSecureDevice(device.id, false)}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-[#E9EDF2] bg-white px-3.5 py-2.5 text-left text-xs font-medium text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:text-[#18212F]"
                >
                  <ShieldAlert className="h-4 w-4 shrink-0 text-[#B45309]" />
                  <span>Sinalizar como vulnerável e exigir bloqueio</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => revealNextClue(device.id)}
                className="w-full rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] py-2.5 text-xs font-semibold text-[#315EAA] hover:bg-[#DBEAFE]"
              >
                Avançar coleta de registros
              </button>
            )}
          </section>
        )}

        {/* Etapa 1: Identificar Vulnerabilidade */}
        {state.stage === 'clues_revealed' &&
          device.isInitiallyVulnerable &&
          device.challenge && (
            <section className="space-y-2.5 border-t border-[#E9EDF2] pt-4">
              <div className="text-[11px] font-semibold text-[#315EAA]">
                Etapa 1 de 3 · Vulnerabilidades
              </div>
              {!allCluesRevealed ? (
                <div className="space-y-2">
                  <p className="text-xs text-[#64748B]">
                    Colete todos os registros técnicos para liberar o diagnóstico.
                  </p>
                  <button
                    type="button"
                    onClick={() => revealNextClue(device.id)}
                    className="w-full rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] py-2.5 text-xs font-semibold text-[#315EAA] hover:bg-[#DBEAFE]"
                  >
                    Coletar próximo registro ({state.revealedClueCount}/{device.clues.length})
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold text-[#18212F]">
                    {device.challenge.vulnerabilityQuestion}
                  </p>
                  <div className="space-y-2">
                    {device.challenge.vulnerabilityOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => submitVulnerabilityAnswer(device.id, opt.id)}
                        className="w-full rounded-xl border border-[#E9EDF2] bg-white p-3 text-left text-xs leading-relaxed text-[#18212F] transition-colors hover:border-[#315EAA] hover:bg-[#F8FAFC]"
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

        {/* Etapa 2: Reconhecer Ameaça */}
        {state.stage === 'vulnerability_identified' && device.challenge && (
          <section className="space-y-3 border-t border-[#E9EDF2] pt-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-[#B45309]">
                Etapa 2 de 3 · Ameaças
              </span>
              <SeverityTag level={device.challenge.threat.severity} />
            </div>

            <div className="rounded-xl border border-[#E9EDF2] bg-[#F8FAFC] p-3.5 text-xs">
              <div className="font-semibold text-[#18212F]">
                {device.challenge.threat.title}
              </div>
              <p className="mt-1 text-[#475569]">{device.challenge.threat.description}</p>
            </div>

            <p className="text-xs font-semibold text-[#18212F]">
              {device.challenge.threat.recognitionQuestion}
            </p>

            <div className="space-y-2">
              {device.challenge.threat.recognitionOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => submitThreatAnswer(device.id, opt.id)}
                  className="w-full rounded-xl border border-[#E9EDF2] bg-white p-3 text-left text-xs leading-relaxed text-[#18212F] transition-colors hover:border-[#D99B27] hover:bg-[#FFFBEB]"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Etapa 3: Recomendações e Proteção */}
        {(state.stage === 'threat_recognized' || state.status === 'partial') &&
          state.stage !== 'resolved' &&
          device.challenge && (
            <section className="space-y-3 border-t border-[#E9EDF2] pt-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-[#197A52]">
                  Etapa 3 de 3 · Recomendações de proteção
                </span>
                <SeverityTag level={device.challenge.threat.severity} />
              </div>

              <div className="rounded-xl border border-[#E9EDF2] bg-[#F8FAFC] p-3.5 text-xs">
                <div className="font-semibold text-[#18212F]">Impacto potencial</div>
                <p className="mt-1 text-[#475569]">{device.challenge.threat.consequences}</p>
              </div>

              <p className="text-xs font-semibold text-[#18212F]">
                {device.challenge.protectionQuestion}
              </p>

              <div className="space-y-2">
                {device.challenge.protectionOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => submitProtectionAnswer(device.id, opt.id)}
                    className="flex w-full items-start gap-2.5 rounded-xl border border-[#E9EDF2] bg-white p-3 text-left text-xs leading-relaxed text-[#18212F] transition-colors hover:border-[#239B69] hover:bg-[#ECFDF5]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#F5F6F8] font-mono text-[11px] font-bold text-[#315EAA]">
                      {opt.label}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

        {/* Recomendações concluídas */}
        {state.stage === 'resolved' && (
          <section className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-semibold text-[#197A52]">
                <Lock className="h-4 w-4" />
                <span>Proteção confirmada</span>
              </div>
              <span className="font-mono font-semibold text-[#197A52] tabular-nums">
                +{state.earnedPoints} pts
              </span>
            </div>
            <p className="mt-2 leading-relaxed text-[#18212F]">
              {device.challenge
                ? device.challenge.threat.recommendation
                : device.secureConfirmationText}
            </p>
          </section>
        )}
      </div>

      {/* Footer Assistant Trigger */}
      <div className="border-t border-[#E9EDF2] p-3.5">
        <button
          type="button"
          onClick={() => setActiveModal('assistant')}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] py-2 text-xs font-semibold text-[#18212F] transition-colors hover:border-[#315EAA]/35 hover:bg-white"
        >
          <Bot className="h-4 w-4 text-[#315EAA]" />
          <span>Consultar Cyber Assistant</span>
        </button>
      </div>
    </aside>
  );
}
