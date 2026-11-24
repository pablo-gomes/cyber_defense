import {
  Activity,
  Bot,
  CheckSquare,
  HelpCircle,
  Map as MapIcon,
  Settings,
  Shield,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { getClassification, SMART_DEVICES } from '../data/smartHomeData';
import { computeSecurityPercent, useGameStore } from '../store/useGameStore';

function formatTime(totalSec: number): string {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function TopHudBar() {
  const score = useGameStore((s) => s.score);
  const elapsedSeconds = useGameStore((s) => s.elapsedSeconds);
  const deviceStates = useGameStore((s) => s.deviceStates);
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const restartTutorial = useGameStore((s) => s.restartTutorial);
  const finishAudit = useGameStore((s) => s.finishAudit);
  const goToScreen = useGameStore((s) => s.goToScreen);

  const securityPercent = computeSecurityPercent(deviceStates);
  const classification = getClassification(score);

  const resolvedCount = SMART_DEVICES.filter(
    (d) => deviceStates[d.id]?.status === 'protected',
  ).length;
  const pendingVulnerableCount = SMART_DEVICES.filter(
    (d) => d.isInitiallyVulnerable && deviceStates[d.id]?.status !== 'protected',
  ).length;

  const handleFinishClick = () => {
    if (resolvedCount < SMART_DEVICES.length) {
      setActiveModal('confirm_finish');
    } else {
      finishAudit();
    }
  };

  const securityBarColor =
    securityPercent >= 85
      ? 'bg-[#239B69]'
      : securityPercent >= 60
        ? 'bg-[#315EAA]'
        : securityPercent >= 40
          ? 'bg-[#D99B27]'
          : 'bg-[#D94A4A]';

  return (
    <header className="z-20 flex flex-wrap items-center justify-between gap-4 border-b border-[#E9EDF2] bg-white px-4 py-2.5">
      {/* Zone 1: Brand & Mission Timer */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => goToScreen('start')}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-80"
          title="Voltar à tela inicial"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#315EAA]/20 bg-[#315EAA]/10 text-[#315EAA]">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <div className="font-display text-sm font-bold tracking-tight text-[#18212F] whitespace-nowrap">
              CYBER DEFENSE
            </div>
            <div className="font-mono text-[11px] text-[#64748B] tabular-nums whitespace-nowrap">
              Auditoria Residencial · {formatTime(elapsedSeconds)}
            </div>
          </div>
        </button>
      </div>

      {/* Zone 2: Progress, Security Indicator & Score */}
      <div className="flex flex-1 flex-wrap items-center justify-center gap-6 px-2">
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-[#64748B]">Progresso</span>
          <span className="font-mono text-sm font-semibold text-[#18212F] tabular-nums whitespace-nowrap">
            {resolvedCount}/{SMART_DEVICES.length} auditados
          </span>
        </div>

        <div className="min-w-[190px] max-w-[260px] flex-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-[#475569]">Segurança da residência</span>
            <span className={`font-mono font-semibold tabular-nums ${classification.tierColor}`}>
              {securityPercent}%
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E9EDF2]">
            <div
              className={`h-full transition-all duration-300 ${securityBarColor}`}
              style={{ width: `${securityPercent}%` }}
            />
          </div>
          <div className="mt-0.5 truncate text-[10px] font-medium text-[#64748B]">
            {classification.label}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-[#64748B]">Pontuação</span>
          <span className="font-mono text-sm font-semibold text-[#315EAA] tabular-nums whitespace-nowrap">
            {score} / 1000 pts
          </span>
        </div>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveModal('property_map')}
          title="Abrir Mapa da Propriedade (Tecla M)"
          className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#18212F] transition-colors hover:border-[#315EAA]/35 hover:bg-white whitespace-nowrap"
        >
          <MapIcon className="h-3.5 w-3.5 text-[#315EAA]" />
          <span className="hidden md:inline">Mapa</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('security_center')}
          className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#18212F] transition-colors hover:border-[#315EAA]/35 hover:bg-white whitespace-nowrap"
        >
          <Activity className="h-3.5 w-3.5 text-[#315EAA]" />
          <span>Central</span>
          {pendingVulnerableCount > 0 && (
            <span className="font-mono text-[11px] font-semibold text-[#B45309] tabular-nums">
              ({pendingVulnerableCount})
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('assistant')}
          className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#18212F] transition-colors hover:border-[#315EAA]/35 hover:bg-white whitespace-nowrap"
        >
          <Bot className="h-3.5 w-3.5 text-[#315EAA]" />
          <span className="hidden sm:inline">Assistente</span>
        </button>

        <button
          type="button"
          onClick={handleFinishClick}
          className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-lg bg-[#315EAA] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#274D8C] whitespace-nowrap"
        >
          <CheckSquare className="h-3.5 w-3.5" />
          <span>Concluir</span>
        </button>

        <div className="mx-0.5 hidden h-5 w-px bg-[#E9EDF2] sm:block" aria-hidden="true" />

        <button
          type="button"
          onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          aria-label={settings.soundEnabled ? 'Desativar som' : 'Ativar som'}
          title={settings.soundEnabled ? 'Desativar som' : 'Ativar som'}
          className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-lg border border-[#E9EDF2] bg-white text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:text-[#18212F]"
        >
          {settings.soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4 text-[#94A3B8]" />
          )}
        </button>

        <button
          type="button"
          onClick={restartTutorial}
          aria-label="Abrir tutorial guiado"
          title="Rever tutorial guiado"
          className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-lg border border-[#E9EDF2] bg-white text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:text-[#18212F]"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('settings')}
          aria-label="Configurações"
          title="Configurações"
          className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-lg border border-[#E9EDF2] bg-white text-[#475569] transition-colors hover:bg-[#F8FAFC] hover:text-[#18212F]"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
