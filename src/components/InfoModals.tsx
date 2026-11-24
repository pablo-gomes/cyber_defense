import { BookOpen, CheckSquare, RotateCcw, Settings, ShieldAlert, X } from 'lucide-react';
import { SMART_DEVICES } from '../data/smartHomeData';
import { useGameStore } from '../store/useGameStore';

export function InfoModals() {
  const activeModal = useGameStore((s) => s.activeModal);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const resetMission = useGameStore((s) => s.resetMission);
  const finishAudit = useGameStore((s) => s.finishAudit);
  const deviceStates = useGameStore((s) => s.deviceStates);

  if (
    activeModal !== 'howto' &&
    activeModal !== 'settings' &&
    activeModal !== 'confirm_finish'
  ) {
    return null;
  }

  const resolvedCount = SMART_DEVICES.filter(
    (d) => deviceStates[d.id]?.status === 'protected',
  ).length;

  const activeQuality =
    (settings.graphicsQuality as string) === 'balanced' ? 'medium' : settings.graphicsQuality;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#18212F]/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      {activeModal === 'howto' && (
        <div className="w-full max-w-xl rounded-2xl border border-[#E9EDF2] bg-white p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#E9EDF2] pb-4">
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-[#315EAA]" />
              <h2 className="font-display text-lg font-bold text-[#18212F]">Como Jogar</h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              aria-label="Fechar instruções"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] text-[#64748B] hover:text-[#18212F]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3 text-xs leading-relaxed text-[#475569]">
            <p>
              <strong className="text-[#18212F]">1. Explore a Smart Home 3D:</strong> Gire a
              propriedade arrastando com o mouse, aproxime com o scroll, clique diretamente sobre o
              piso de qualquer cômodo ou abra o Mapa da Propriedade (tecla M; atalhos 1 a 8 e R).
            </p>
            <p>
              <strong className="text-[#18212F]">2. Investigue cada dispositivo:</strong> Selecione
              os aparelhos conectados nos ambientes para coletar pistas técnicas progressivamente.
            </p>
            <p>
              <strong className="text-[#18212F]">3. Diferencie seguros de vulneráveis:</strong>{' '}
              Nem todos os equipamentos possuem falhas. Valide os que já seguem boas práticas e
              corrija os que apresentam vulnerabilidades.
            </p>
            <p>
              <strong className="text-[#18212F]">4. Identifique, reconheça e proteja:</strong> Em
              cada desafio, diagnostique a falha, reconheça a gravidade da ameaça e selecione a
              medida de proteção adequada (pontuação de 0 a 1000).
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="rounded-lg bg-[#315EAA] px-5 py-2 text-xs font-semibold text-white hover:bg-[#274D8C]"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {activeModal === 'settings' && (
        <div className="w-full max-w-md rounded-2xl border border-[#E9EDF2] bg-white p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#E9EDF2] pb-4">
            <div className="flex items-center gap-2.5">
              <Settings className="h-5 w-5 text-[#315EAA]" />
              <h2 className="font-display text-lg font-bold text-[#18212F]">Configurações</h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              aria-label="Fechar configurações"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] text-[#64748B] hover:text-[#18212F]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4 text-xs">
            <label className="flex items-center justify-between gap-4 rounded-xl border border-[#E9EDF2] bg-[#F8FAFC] p-3.5">
              <div>
                <div className="font-semibold text-[#18212F]">Efeitos sonoros</div>
                <div className="text-[11px] text-[#64748B]">
                  Feedback discreto de varredura e decisões
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                className="h-4 w-4 accent-[#315EAA]"
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-xl border border-[#E9EDF2] bg-[#F8FAFC] p-3.5">
              <div>
                <div className="font-semibold text-[#18212F]">Reduzir animações</div>
                <div className="text-[11px] text-[#64748B]">
                  Suaviza transições de câmera e marcadores 3D
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                className="h-4 w-4 accent-[#315EAA]"
              />
            </label>

            <div className="rounded-xl border border-[#E9EDF2] bg-[#F8FAFC] p-3.5">
              <div className="font-semibold text-[#18212F]">Qualidade gráfica 3D</div>
              <p className="mt-0.5 text-[11px] text-[#64748B]">
                Ajuste sombras e nitidez de renderização
              </p>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'low', label: 'BAIXA' },
                    { id: 'medium', label: 'MÉDIA' },
                    { id: 'high', label: 'ALTA' },
                  ] as const
                ).map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => updateSettings({ graphicsQuality: tier.id })}
                    className={`rounded-lg py-2 font-mono text-[11px] font-semibold transition-colors ${
                      activeQuality === tier.id
                        ? 'bg-[#315EAA] text-white'
                        : 'border border-[#E9EDF2] bg-white text-[#475569] hover:text-[#18212F]'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#E9EDF2] pt-4">
              <button
                type="button"
                onClick={resetMission}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] py-2.5 font-semibold text-[#B91C1C] transition-colors hover:bg-[#FEE2E2]"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reiniciar auditoria completa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'confirm_finish' && (
        <div className="w-full max-w-md rounded-2xl border border-[#E9EDF2] bg-white p-6 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-[#18212F]">
                Concluir auditoria agora?
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                Você auditou ou protegeu{' '}
                <strong className="text-[#18212F]">
                  {resolvedCount} de {SMART_DEVICES.length}
                </strong>{' '}
                dispositivos. Os itens restantes serão listados como pendentes no relatório final.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="rounded-lg border border-[#E9EDF2] bg-white px-4 py-2 text-xs font-medium text-[#18212F] hover:bg-[#F8FAFC]"
            >
              Continuar investigando
            </button>
            <button
              type="button"
              onClick={finishAudit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#315EAA] px-4 py-2 text-xs font-semibold text-white hover:bg-[#274D8C]"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span>Gerar relatório</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
