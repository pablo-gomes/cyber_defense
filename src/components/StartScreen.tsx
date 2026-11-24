import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Lock,
  RotateCcw,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export function StartScreen() {
  const [imageError, setImageError] = useState(false);
  const startMission = useGameStore((s) => s.startMission);
  const resetMission = useGameStore((s) => s.resetMission);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const score = useGameStore((s) => s.score);
  const decisionLog = useGameStore((s) => s.decisionLog);
  const hasSavedProgress = score > 0 || decisionLog.length > 0;

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-[#F5F6F8] text-[#18212F]">
      {/* Subtle architectural line grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(49, 94, 170, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(49, 94, 170, 0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top Navigation */}
      <header className="relative z-10 border-b border-[#E9EDF2] bg-white/95">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-8 px-6 py-4">
          <div className="flex shrink-0 items-center gap-3 whitespace-nowrap">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#315EAA]/20 bg-[#315EAA]/10 text-[#315EAA]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display block text-base font-bold tracking-tight text-[#18212F]">
                CYBER DEFENSE
              </span>
              <span className="block text-[11px] font-medium text-[#64748B]">
                Auditoria Smart Home 3D
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#475569] md:flex">
            <button
              type="button"
              onClick={() => setActiveModal('howto')}
              className="shrink-0 whitespace-nowrap transition-colors hover:text-[#18212F]"
            >
              Como jogar
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('settings')}
              className="shrink-0 whitespace-nowrap transition-colors hover:text-[#18212F]"
            >
              Configurações
            </button>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => startMission()}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#315EAA] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#274D8C] whitespace-nowrap"
            >
              <span>{hasSavedProgress ? 'Continuar missão' : 'Iniciar missão'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Two-Column Hero */}
      <main className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-12 px-6 py-10 lg:grid-cols-12 lg:py-14">
        <div className="flex flex-col justify-center lg:col-span-6">
          <p className="text-xs font-semibold tracking-wider text-[#315EAA] uppercase">
            Simulador Profissional de Segurança IoT
          </p>

          <h1 className="font-display mt-3 text-balance text-4xl font-bold tracking-tight text-[#18212F] sm:text-5xl">
            CYBER DEFENSE
          </h1>
          <p className="font-display mt-1.5 text-xl font-medium text-[#475569] sm:text-2xl">
            Proteja sua Smart Home
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#475569]">
            Explore uma residência contemporânea tridimensional completa — com interiores, garagem,
            piscina, quintal e rua movimentada — audite 33 dispositivos conectados em 15 ambientes e
            aplique medidas práticas de cibersegurança.
          </p>

          {/* 3 Mandatory Pedagogical Pillars */}
          <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div className="rounded-xl border border-[#E9EDF2] bg-white p-4 shadow-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#315EAA]/10 text-[#315EAA]">
                <Search className="h-4 w-4" />
              </div>
              <h2 className="mt-3 text-sm font-semibold text-[#18212F]">1. Identificar</h2>
              <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                Inspecione registros técnicos para localizar senhas padrão e falhas de rede.
              </p>
            </div>
            <div className="rounded-xl border border-[#E9EDF2] bg-white p-4 shadow-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFFBEB] text-[#B45309]">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <h2 className="mt-3 text-sm font-semibold text-[#18212F]">2. Reconhecer</h2>
              <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                Classifique a gravidade das ameaças e compreenda seus impactos reais na casa.
              </p>
            </div>
            <div className="rounded-xl border border-[#E9EDF2] bg-white p-4 shadow-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#197A52]">
                <Lock className="h-4 w-4" />
              </div>
              <h2 className="mt-3 text-sm font-semibold text-[#18212F]">3. Proteger</h2>
              <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                Implemente criptografia, MFA e menor privilégio para blindar cada aparelho.
              </p>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => startMission()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#315EAA] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#274D8C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315EAA] whitespace-nowrap"
            >
              <span>{hasSavedProgress ? 'Continuar auditoria' : 'Iniciar missão'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {hasSavedProgress && (
              <button
                type="button"
                onClick={() => resetMission()}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#E9EDF2] bg-white px-4 py-2.5 text-sm font-medium text-[#18212F] transition-colors hover:bg-[#F8FAFC] whitespace-nowrap"
              >
                <RotateCcw className="h-4 w-4 text-[#64748B]" />
                <span>Nova missão</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveModal('howto')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#E9EDF2] bg-white px-4 py-2.5 text-sm font-medium text-[#18212F] transition-colors hover:bg-[#F8FAFC] whitespace-nowrap"
            >
              <BookOpen className="h-4 w-4 text-[#315EAA]" />
              <span>Como jogar</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('settings')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#E9EDF2] bg-white px-4 py-2.5 text-sm font-medium text-[#18212F] transition-colors hover:bg-[#F8FAFC] whitespace-nowrap"
            >
              <Settings className="h-4 w-4 text-[#64748B]" />
              <span>Configurações</span>
            </button>
          </div>
        </div>

        {/* Architectural Preview Frame */}
        <div className="lg:col-span-6">
          <div className="overflow-hidden rounded-2xl border border-[#E9EDF2] bg-white shadow-lg">
            {!imageError ? (
              <img
                src="/assets/aistudio/image_6d2b46a0.png"
                alt="Maquete arquitetônica contemporânea da Smart Home com dispositivos IoT"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full flex-col items-center justify-center bg-gradient-to-br from-[#F5F6F8] via-white to-[#EEF2F6] p-8 text-center">
                <ShieldCheck className="h-14 w-14 text-[#315EAA]" />
                <p className="font-display mt-3 text-lg font-semibold text-[#18212F]">
                  Residência Inteligente 3D
                </p>
                <p className="mt-1 text-sm text-[#64748B]">
                  Interiores · Garagem · Piscina · Quintal · Rua Pública
                </p>
              </div>
            )}
            <div className="border-t border-[#E9EDF2] bg-white px-5 py-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#64748B]">
                <span>15 ambientes 3D exploráveis</span>
                <span aria-hidden="true" className="text-[#CBD5E1]">
                  ·
                </span>
                <span>33 dispositivos IoT auditáveis</span>
                <span aria-hidden="true" className="text-[#CBD5E1]">
                  ·
                </span>
                <span>Relatório executivo final</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-[#E9EDF2] bg-white px-6 py-3 text-center text-xs text-[#64748B]">
        Simulação educativa em WebGL · Nenhuma rede externa real é acessada
      </footer>
    </div>
  );
}
