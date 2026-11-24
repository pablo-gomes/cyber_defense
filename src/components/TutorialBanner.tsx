import { ArrowRight, Compass, X } from 'lucide-react';
import { TUTORIAL_STEPS } from '../data/tutorialData';
import { useGameStore } from '../store/useGameStore';

export function TutorialBanner() {
  const tutorialActive = useGameStore((s) => s.tutorialActive);
  const tutorialStep = useGameStore((s) => s.tutorialStep);
  const advanceTutorial = useGameStore((s) => s.advanceTutorial);
  const skipTutorial = useGameStore((s) => s.skipTutorial);

  if (!tutorialActive) return null;

  const current = TUTORIAL_STEPS[tutorialStep] ?? TUTORIAL_STEPS[0];
  const isLast = tutorialStep >= TUTORIAL_STEPS.length - 1;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-lg rounded-xl border border-[#E9EDF2] bg-white/95 p-4 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-[#315EAA]">
            <Compass className="h-4 w-4 shrink-0" />
            <span className="font-mono text-[11px] font-semibold">
              Tutorial guiado · Passo {tutorialStep + 1}/{TUTORIAL_STEPS.length}
            </span>
          </div>
          <button
            type="button"
            onClick={skipTutorial}
            aria-label="Fechar tutorial"
            className="text-[#64748B] transition-colors hover:text-[#18212F]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h3 className="font-display mt-1.5 text-sm font-bold text-[#18212F]">{current.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-[#475569]">{current.description}</p>
        <p className="mt-1.5 text-[11px] font-semibold text-[#315EAA]">{current.targetHint}</p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={skipTutorial}
            className="text-xs font-medium text-[#64748B] hover:text-[#18212F]"
          >
            Pular tutorial
          </button>
          <button
            type="button"
            onClick={advanceTutorial}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#315EAA] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#274D8C]"
          >
            <span>{isLast ? 'Concluir tutorial' : 'Próximo passo'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
