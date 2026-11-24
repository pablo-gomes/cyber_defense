import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { BottomCameraDock } from './components/BottomCameraDock';
import { CyberAssistantModal } from './components/CyberAssistantModal';
import { DeviceInvestigationPanel } from './components/DeviceInvestigationPanel';
import { FinalReportView } from './components/FinalReportView';
import { InfoModals } from './components/InfoModals';
import { LeftNavigator } from './components/LeftNavigator';
import { PropertyMapModal } from './components/PropertyMapModal';
import { SecurityCenterModal } from './components/SecurityCenterModal';
import { SmartHomeCanvas } from './components/SmartHomeCanvas';
import { StartScreen } from './components/StartScreen';
import { TopHudBar } from './components/TopHudBar';
import { TutorialBanner } from './components/TutorialBanner';
import { useGameStore } from './store/useGameStore';
import { soundEngine } from './utils/sound';

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const zenMode = useGameStore((s) => s.zenMode);
  const settings = useGameStore((s) => s.settings);
  const tickTimer = useGameStore((s) => s.tickTimer);

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Sync audio & reduced motion preference
  useEffect(() => {
    soundEngine.setEnabled(settings.soundEnabled);
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [settings.soundEnabled, settings.reducedMotion]);

  // Reset scene loading flag when leaving playing view
  useEffect(() => {
    if (screen !== 'playing') {
      setSceneReady(false);
      setLoadProgress(0);
    }
  }, [screen]);

  // Audit timer
  useEffect(() => {
    if (screen !== 'playing') return;
    const id = window.setInterval(() => {
      tickTimer();
    }, 1000);
    return () => window.clearInterval(id);
  }, [screen, tickTimer]);

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] text-[#18212F]">
      {screen === 'start' && <StartScreen />}

      {screen === 'playing' && (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-[#F5F6F8]">
          <TopHudBar />

          <div className="relative flex min-h-0 flex-1 overflow-hidden">
            {!zenMode && (
              <LeftNavigator
                collapsed={leftCollapsed}
                onToggleCollapse={() => setLeftCollapsed((v) => !v)}
              />
            )}

            {/* 3D Interactive Smart Home Viewport */}
            <main className="relative min-w-0 flex-1 overflow-hidden bg-[#eef2f6]">
              <SmartHomeCanvas
                onLoadProgress={(pct) => setLoadProgress(pct)}
                onLoaded={() => setSceneReady(true)}
              />

              {/* Loading Overlay with Real Progress */}
              {!sceneReady && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#F5F6F8] p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E9EDF2] bg-white text-[#315EAA] shadow-sm">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h2 className="font-display mt-4 text-lg font-bold text-[#18212F]">
                    Carregando Smart Home 3D...
                  </h2>
                  <p className="mt-1 text-xs text-[#64748B]">
                    Preparando arquitetura contemporânea, materiais PBR e dispositivos IoT
                  </p>
                  <div className="mt-5 h-1.5 w-64 overflow-hidden rounded-full bg-[#E9EDF2]">
                    <div
                      className="h-full bg-[#315EAA] transition-all duration-200"
                      style={{ width: `${loadProgress}%` }}
                    />
                  </div>
                  <span className="mt-2 font-mono text-xs text-[#315EAA] tabular-nums">
                    {loadProgress}%
                  </span>
                </div>
              )}

              <TutorialBanner />
              <BottomCameraDock />
            </main>

            {!zenMode && <DeviceInvestigationPanel />}
          </div>
        </div>
      )}

      {screen === 'report' && <FinalReportView />}

      {/* Application Modals */}
      <SecurityCenterModal />
      <PropertyMapModal />
      <CyberAssistantModal />
      <InfoModals />
    </div>
  );
}
