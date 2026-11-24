import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SMART_DEVICES } from '../data/smartHomeData';
import {
  AppScreen,
  AssistantMessage,
  DecisionLogEntry,
  DeviceRuntimeState,
  GameSettings,
  OptionQuality,
  RoomId,
} from '../types/game';
import { soundEngine } from '../utils/sound';

export type StatusFilter = 'all' | 'vulnerable' | 'uninspected' | 'protected';
export type LeftNavTab = 'rooms' | 'devices' | 'alerts' | 'missions';

interface GameStoreState {
  screen: AppScreen;
  leftTab: LeftNavTab;
  selectedRoomFilter: RoomId | 'all';
  cameraFocusRoom: RoomId | 'overview';
  cameraResetNonce: number;
  statusFilter: StatusFilter;
  selectedDeviceId: string | null;
  showNetworkLinks: boolean;
  showVulnerabilityOverlay: boolean;
  zenMode: boolean;

  deviceStates: Record<string, DeviceRuntimeState>;
  decisionLog: DecisionLogEntry[];
  score: number;
  elapsedSeconds: number;
  isTimerRunning: boolean;

  tutorialActive: boolean;
  tutorialStep: number;
  tutorialCompleted: boolean;

  activeModal:
    | 'none'
    | 'howto'
    | 'settings'
    | 'security_center'
    | 'property_map'
    | 'assistant'
    | 'confirm_finish';
  settings: GameSettings;
  assistantMessages: AssistantMessage[];
  assistantMode: 'gemini' | 'local';

  // Actions
  startMission: (withTutorial?: boolean) => void;
  goToScreen: (screen: AppScreen) => void;
  setActiveModal: (
    modal:
      | 'none'
      | 'howto'
      | 'settings'
      | 'security_center'
      | 'property_map'
      | 'assistant'
      | 'confirm_finish',
  ) => void;
  selectRoom: (room: RoomId | 'all', moveCamera?: boolean) => void;
  setLeftTab: (tab: LeftNavTab) => void;
  focusCameraRoom: (room: RoomId | 'overview') => void;
  triggerCameraReset: () => void;
  setStatusFilter: (filter: StatusFilter) => void;
  selectDevice: (deviceId: string | null) => void;
  toggleNetworkLinks: () => void;
  toggleVulnerabilityOverlay: () => void;
  toggleZenMode: () => void;

  startInvestigation: (deviceId: string) => void;
  revealNextClue: (deviceId: string) => void;
  validateSecureDevice: (deviceId: string, claimedSecure: boolean) => void;
  submitVulnerabilityAnswer: (deviceId: string, optionId: string) => void;
  submitThreatAnswer: (deviceId: string, optionId: string) => void;
  submitProtectionAnswer: (deviceId: string, optionId: string) => void;

  advanceTutorial: () => void;
  skipTutorial: () => void;
  restartTutorial: () => void;

  tickTimer: () => void;
  finishAudit: () => void;
  resetMission: () => void;

  updateSettings: (partial: Partial<GameSettings>) => void;
  addAssistantMessage: (msg: Omit<AssistantMessage, 'id' | 'timestamp'>) => void;
  setAssistantMode: (mode: 'gemini' | 'local') => void;
}

function createInitialDeviceStates(): Record<string, DeviceRuntimeState> {
  const states: Record<string, DeviceRuntimeState> = {};
  for (const device of SMART_DEVICES) {
    states[device.id] = {
      status: 'uninspected',
      stage: 'locked',
      revealedClueCount: 0,
      vulnerabilityAttempts: 0,
      threatAttempts: 0,
      protectionAttempts: 0,
      earnedPoints: 0,
      selectedProtectionQuality: null,
      lastFeedback: null,
      lastFeedbackQuality: null,
    };
  }
  return states;
}

export function computeSecurityPercent(
  deviceStates: Record<string, DeviceRuntimeState>,
): number {
  let totalWeight = 0;
  let securedWeight = 0;

  for (const device of SMART_DEVICES) {
    totalWeight += device.securityWeight;
    const state = deviceStates[device.id];

    if (!device.isInitiallyVulnerable) {
      // Baseline secured devices contribute 60% initially and 100% once verified
      securedWeight +=
        state?.status === 'protected'
          ? device.securityWeight
          : device.securityWeight * 0.65;
    } else {
      if (state?.status === 'protected') {
        securedWeight += device.securityWeight;
      } else if (state?.status === 'partial') {
        securedWeight += device.securityWeight * 0.5;
      }
    }
  }

  if (totalWeight === 0) return 0;
  return Math.max(0, Math.min(100, Math.round((securedWeight / totalWeight) * 100)));
}

const INITIAL_ASSISTANT_MESSAGE: AssistantMessage = {
  id: 'welcome-msg',
  sender: 'assistant',
  text: 'Olá! Sou o CYBER ASSISTANT. Estou aqui para explicar conceitos de cibersegurança e oferecer pistas progressivas durante sua auditoria na Smart Home.',
  mode: 'local',
  timestamp: Date.now(),
};

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      screen: 'start',
      leftTab: 'rooms',
      selectedRoomFilter: 'all',
      cameraFocusRoom: 'overview',
      cameraResetNonce: 0,
      statusFilter: 'all',
      selectedDeviceId: null,
      showNetworkLinks: false,
      showVulnerabilityOverlay: true,
      zenMode: false,

      deviceStates: createInitialDeviceStates(),
      decisionLog: [],
      score: 0,
      elapsedSeconds: 0,
      isTimerRunning: false,

      tutorialActive: true,
      tutorialStep: 0,
      tutorialCompleted: false,

      activeModal: 'none',
      settings: {
        soundEnabled: true,
        reducedMotion: false,
        graphicsQuality: 'high',
      },
      assistantMessages: [INITIAL_ASSISTANT_MESSAGE],
      assistantMode: 'local',

      startMission: (withTutorial) => {
        const state = get();
        const shouldShowTutorial =
          withTutorial !== undefined ? withTutorial : !state.tutorialCompleted;
        soundEngine.setEnabled(state.settings.soundEnabled);
        soundEngine.playSelect();
        set({
          screen: 'playing',
          isTimerRunning: true,
          activeModal: 'none',
          tutorialActive: shouldShowTutorial,
          tutorialStep: 0,
          cameraFocusRoom: 'overview',
        });
      },

      goToScreen: (screen) => {
        set({
          screen,
          isTimerRunning: screen === 'playing',
          activeModal: 'none',
        });
      },

      setActiveModal: (modal) => {
        soundEngine.playSelect();
        set({ activeModal: modal });
      },

      selectRoom: (room, moveCamera = true) => {
        soundEngine.playSelect();
        set((state) => {
          const nextTutorial =
            state.tutorialActive && state.tutorialStep === 1 && room !== 'all'
              ? 2
              : state.tutorialStep;
          return {
            selectedRoomFilter: room,
            cameraFocusRoom: moveCamera ? (room === 'all' ? 'overview' : room) : state.cameraFocusRoom,
            tutorialStep: nextTutorial,
          };
        });
      },

      focusCameraRoom: (room) => {
        soundEngine.playSelect();
        set((state) => ({
          cameraFocusRoom: room,
          tutorialStep:
            state.tutorialActive && state.tutorialStep === 1 && room !== 'overview'
              ? 2
              : state.tutorialStep,
        }));
      },

      triggerCameraReset: () => {
        soundEngine.playSelect();
        set((state) => ({
          cameraFocusRoom: 'overview',
          cameraResetNonce: state.cameraResetNonce + 1,
        }));
      },

      setStatusFilter: (filter) => set({ statusFilter: filter }),

      selectDevice: (deviceId) => {
        if (deviceId) {
          soundEngine.playSelect();
        }
        set((state) => {
          const device = SMART_DEVICES.find((d) => d.id === deviceId);
          return {
            selectedDeviceId: deviceId,
            cameraFocusRoom: device ? device.roomId : state.cameraFocusRoom,
            tutorialStep:
              state.tutorialActive && state.tutorialStep === 2 && deviceId
                ? 3
                : state.tutorialStep,
          };
        });
      },

      setLeftTab: (tab) => {
        soundEngine.playSelect();
        set({ leftTab: tab });
      },

      toggleNetworkLinks: () => {
        soundEngine.playSelect();
        set((state) => ({ showNetworkLinks: !state.showNetworkLinks }));
      },

      toggleVulnerabilityOverlay: () => {
        soundEngine.playSelect();
        set((state) => ({ showVulnerabilityOverlay: !state.showVulnerabilityOverlay }));
      },

      toggleZenMode: () => {
        soundEngine.playSelect();
        set((state) => ({ zenMode: !state.zenMode }));
      },

      startInvestigation: (deviceId) => {
        const device = SMART_DEVICES.find((d) => d.id === deviceId);
        if (!device) return;
        soundEngine.playScan();
        set((state) => {
          const current = state.deviceStates[deviceId];
          if (!current || current.stage !== 'locked') return state;
          return {
            deviceStates: {
              ...state.deviceStates,
              [deviceId]: {
                ...current,
                status: 'investigating',
                stage: 'clues_revealed',
                revealedClueCount: 1,
                lastFeedback: null,
                lastFeedbackQuality: null,
              },
            },
            tutorialStep:
              state.tutorialActive && state.tutorialStep === 3 ? 4 : state.tutorialStep,
          };
        });
      },

      revealNextClue: (deviceId) => {
        const device = SMART_DEVICES.find((d) => d.id === deviceId);
        if (!device) return;
        soundEngine.playScan();
        set((state) => {
          const current = state.deviceStates[deviceId];
          if (!current) return state;
          const nextCount = Math.min(device.clues.length, current.revealedClueCount + 1);
          return {
            deviceStates: {
              ...state.deviceStates,
              [deviceId]: {
                ...current,
                revealedClueCount: nextCount,
              },
            },
          };
        });
      },

      validateSecureDevice: (deviceId, claimedSecure) => {
        const device = SMART_DEVICES.find((d) => d.id === deviceId);
        if (!device || device.isInitiallyVulnerable) return;

        set((state) => {
          const current = state.deviceStates[deviceId];
          if (!current || current.stage === 'resolved') return state;

          if (claimedSecure) {
            const penalty = current.vulnerabilityAttempts * 5;
            const gained = Math.max(5, device.maxPoints - penalty);
            const nextScore = Math.max(0, Math.min(1000, state.score + gained));
            soundEngine.playSuccess();
            return {
              score: nextScore,
              deviceStates: {
                ...state.deviceStates,
                [deviceId]: {
                  ...current,
                  status: 'protected',
                  stage: 'resolved',
                  revealedClueCount: device.clues.length,
                  earnedPoints: gained,
                  selectedProtectionQuality: 'correct',
                  lastFeedback:
                    device.secureConfirmationText ??
                    'Dispositivo validado como devidamente protegido.',
                  lastFeedbackQuality: 'correct',
                },
              },
              decisionLog: [
                ...state.decisionLog,
                {
                  id: `${deviceId}-val-${Date.now()}`,
                  timestamp: Date.now(),
                  deviceId,
                  deviceName: device.name,
                  roomId: device.roomId,
                  step: 'validation',
                  chosenText: 'Confirmar que o dispositivo está protegido e conforme.',
                  quality: 'correct',
                  pointsDelta: gained,
                  explanation:
                    device.secureConfirmationText ??
                    'Os registros confirmam boas práticas de segurança aplicadas.',
                },
              ],
            };
          } else {
            const nextScore = Math.max(0, state.score - 10);
            soundEngine.playError();
            return {
              score: nextScore,
              deviceStates: {
                ...state.deviceStates,
                [deviceId]: {
                  ...current,
                  vulnerabilityAttempts: current.vulnerabilityAttempts + 1,
                  lastFeedback:
                    'Atenção: revise os registros deste dispositivo! Ele possui firmware assinado, criptografia ativa e não apresenta sinais suspeitos.',
                  lastFeedbackQuality: 'incorrect',
                },
              },
              decisionLog: [
                ...state.decisionLog,
                {
                  id: `${deviceId}-val-err-${Date.now()}`,
                  timestamp: Date.now(),
                  deviceId,
                  deviceName: device.name,
                  roomId: device.roomId,
                  step: 'validation',
                  chosenText: 'Sinalizar dispositivo seguro como vulnerável (falso positivo).',
                  quality: 'incorrect',
                  pointsDelta: -10,
                  explanation:
                    'Nem todo aparelho IoT está comprometido. Identificar falsos positivos evita retrabalho na auditoria.',
                },
              ],
            };
          }
        });
      },

      submitVulnerabilityAnswer: (deviceId, optionId) => {
        const device = SMART_DEVICES.find((d) => d.id === deviceId);
        if (!device || !device.challenge) return;
        const option = device.challenge.vulnerabilityOptions.find((o) => o.id === optionId);
        if (!option) return;

        set((state) => {
          const current = state.deviceStates[deviceId];
          if (!current || current.stage !== 'clues_revealed') return state;

          if (option.isCorrect) {
            const baseStepPts = Math.round(device.maxPoints * 0.2);
            const gained = Math.max(2, baseStepPts - current.vulnerabilityAttempts * 3);
            const nextScore = Math.max(0, Math.min(1000, state.score + gained));
            soundEngine.playSuccess();
            return {
              score: nextScore,
              deviceStates: {
                ...state.deviceStates,
                [deviceId]: {
                  ...current,
                  status: 'vulnerable',
                  stage: 'vulnerability_identified',
                  revealedClueCount: device.clues.length,
                  earnedPoints: current.earnedPoints + gained,
                  lastFeedback: option.feedback,
                  lastFeedbackQuality: 'correct',
                },
              },
              decisionLog: [
                ...state.decisionLog,
                {
                  id: `${deviceId}-vuln-${Date.now()}`,
                  timestamp: Date.now(),
                  deviceId,
                  deviceName: device.name,
                  roomId: device.roomId,
                  step: 'vulnerability',
                  chosenText: option.text,
                  quality: 'correct',
                  pointsDelta: gained,
                  explanation: option.feedback,
                },
              ],
            };
          } else {
            const nextScore = Math.max(0, state.score - 10);
            soundEngine.playError();
            return {
              score: nextScore,
              deviceStates: {
                ...state.deviceStates,
                [deviceId]: {
                  ...current,
                  vulnerabilityAttempts: current.vulnerabilityAttempts + 1,
                  lastFeedback: option.feedback,
                  lastFeedbackQuality: 'incorrect',
                },
              },
              decisionLog: [
                ...state.decisionLog,
                {
                  id: `${deviceId}-vuln-err-${Date.now()}`,
                  timestamp: Date.now(),
                  deviceId,
                  deviceName: device.name,
                  roomId: device.roomId,
                  step: 'vulnerability',
                  chosenText: option.text,
                  quality: 'incorrect',
                  pointsDelta: -10,
                  explanation: option.feedback,
                },
              ],
            };
          }
        });
      },

      submitThreatAnswer: (deviceId, optionId) => {
        const device = SMART_DEVICES.find((d) => d.id === deviceId);
        if (!device || !device.challenge) return;
        const option = device.challenge.threat.recognitionOptions.find((o) => o.id === optionId);
        if (!option) return;

        set((state) => {
          const current = state.deviceStates[deviceId];
          if (!current || current.stage !== 'vulnerability_identified') return state;

          if (option.isCorrect) {
            const baseStepPts = Math.round(device.maxPoints * 0.2);
            const gained = Math.max(2, baseStepPts - current.threatAttempts * 3);
            const nextScore = Math.max(0, Math.min(1000, state.score + gained));
            soundEngine.playSuccess();
            return {
              score: nextScore,
              tutorialStep:
                state.tutorialActive && state.tutorialStep === 4 ? 5 : state.tutorialStep,
              deviceStates: {
                ...state.deviceStates,
                [deviceId]: {
                  ...current,
                  stage: 'threat_recognized',
                  earnedPoints: current.earnedPoints + gained,
                  lastFeedback: option.feedback,
                  lastFeedbackQuality: 'correct',
                },
              },
              decisionLog: [
                ...state.decisionLog,
                {
                  id: `${deviceId}-thr-${Date.now()}`,
                  timestamp: Date.now(),
                  deviceId,
                  deviceName: device.name,
                  roomId: device.roomId,
                  step: 'threat',
                  chosenText: option.text,
                  quality: 'correct',
                  pointsDelta: gained,
                  explanation: option.feedback,
                },
              ],
            };
          } else {
            const nextScore = Math.max(0, state.score - 10);
            soundEngine.playError();
            return {
              score: nextScore,
              deviceStates: {
                ...state.deviceStates,
                [deviceId]: {
                  ...current,
                  threatAttempts: current.threatAttempts + 1,
                  lastFeedback: option.feedback,
                  lastFeedbackQuality: 'incorrect',
                },
              },
              decisionLog: [
                ...state.decisionLog,
                {
                  id: `${deviceId}-thr-err-${Date.now()}`,
                  timestamp: Date.now(),
                  deviceId,
                  deviceName: device.name,
                  roomId: device.roomId,
                  step: 'threat',
                  chosenText: option.text,
                  quality: 'incorrect',
                  pointsDelta: -10,
                  explanation: option.feedback,
                },
              ],
            };
          }
        });
      },

      submitProtectionAnswer: (deviceId, optionId) => {
        const device = SMART_DEVICES.find((d) => d.id === deviceId);
        if (!device || !device.challenge) return;
        const option = device.challenge.protectionOptions.find((o) => o.id === optionId);
        if (!option) return;

        set((state) => {
          const current = state.deviceStates[deviceId];
          if (!current || (current.stage !== 'threat_recognized' && current.status !== 'partial')) {
            return state;
          }

          const step1Max = Math.round(device.maxPoints * 0.2);
          const step2Max = Math.round(device.maxPoints * 0.2);
          const protectionFullPts = device.maxPoints - step1Max - step2Max;

          if (option.quality === 'correct') {
            const alreadyHadPartial = current.status === 'partial';
            const rawAward = alreadyHadPartial
              ? Math.round(protectionFullPts * 0.45)
              : Math.max(5, protectionFullPts - current.protectionAttempts * 6);
            const nextScore = Math.max(0, Math.min(1000, state.score + rawAward));
            soundEngine.playSuccess();

            return {
              score: nextScore,
              tutorialStep:
                state.tutorialActive && state.tutorialStep === 5 ? 6 : state.tutorialStep,
              deviceStates: {
                ...state.deviceStates,
                [deviceId]: {
                  ...current,
                  status: 'protected',
                  stage: 'resolved',
                  earnedPoints: current.earnedPoints + rawAward,
                  selectedProtectionQuality: 'correct',
                  lastFeedback: option.feedback,
                  lastFeedbackQuality: 'correct',
                },
              },
              decisionLog: [
                ...state.decisionLog,
                {
                  id: `${deviceId}-prot-${Date.now()}`,
                  timestamp: Date.now(),
                  deviceId,
                  deviceName: device.name,
                  roomId: device.roomId,
                  step: 'protection',
                  chosenText: `${option.label}) ${option.text}`,
                  quality: 'correct',
                  pointsDelta: rawAward,
                  explanation: option.feedback,
                },
              ],
            };
          }

          if (option.quality === 'partial') {
            if (current.status === 'partial') {
              return state;
            }
            const partialAward = Math.max(10, Math.round(protectionFullPts * 0.45) - current.protectionAttempts * 8);
            const nextScore = Math.max(0, Math.min(1000, state.score + partialAward));
            soundEngine.playPartial();

            return {
              score: nextScore,
              deviceStates: {
                ...state.deviceStates,
                [deviceId]: {
                  ...current,
                  status: 'partial',
                  stage: 'threat_recognized',
                  protectionAttempts: current.protectionAttempts + 1,
                  earnedPoints: current.earnedPoints + partialAward,
                  selectedProtectionQuality: 'partial',
                  lastFeedback: `${option.feedback}${option.residualRisk ? ` Risco residual: ${option.residualRisk}` : ''}`,
                  lastFeedbackQuality: 'partial',
                },
              },
              decisionLog: [
                ...state.decisionLog,
                {
                  id: `${deviceId}-prot-part-${Date.now()}`,
                  timestamp: Date.now(),
                  deviceId,
                  deviceName: device.name,
                  roomId: device.roomId,
                  step: 'protection',
                  chosenText: `${option.label}) ${option.text}`,
                  quality: 'partial',
                  pointsDelta: partialAward,
                  explanation: option.feedback,
                },
              ],
            };
          }

          // incorrect
          const nextScore = Math.max(0, state.score - 15);
          soundEngine.playError();
          return {
            score: nextScore,
            deviceStates: {
              ...state.deviceStates,
              [deviceId]: {
                ...current,
                protectionAttempts: current.protectionAttempts + 1,
                lastFeedback: option.feedback,
                lastFeedbackQuality: 'incorrect',
              },
            },
            decisionLog: [
              ...state.decisionLog,
              {
                id: `${deviceId}-prot-err-${Date.now()}`,
                timestamp: Date.now(),
                deviceId,
                deviceName: device.name,
                roomId: device.roomId,
                step: 'protection',
                chosenText: `${option.label}) ${option.text}`,
                quality: 'incorrect',
                pointsDelta: -15,
                explanation: option.feedback,
              },
            ],
          };
        });
      },

      advanceTutorial: () => {
        soundEngine.playSelect();
        set((state) => {
          if (state.tutorialStep >= 6) {
            return { tutorialActive: false, tutorialCompleted: true };
          }
          return { tutorialStep: state.tutorialStep + 1 };
        });
      },

      skipTutorial: () => {
        soundEngine.playSelect();
        set({ tutorialActive: false, tutorialCompleted: true });
      },

      restartTutorial: () => {
        soundEngine.playSelect();
        set({
          screen: 'playing',
          tutorialActive: true,
          tutorialStep: 0,
          activeModal: 'none',
        });
      },

      tickTimer: () => {
        set((state) =>
          state.isTimerRunning && state.screen === 'playing'
            ? { elapsedSeconds: state.elapsedSeconds + 1 }
            : state,
        );
      },

      finishAudit: () => {
        soundEngine.playComplete();
        set({
          screen: 'report',
          isTimerRunning: false,
          activeModal: 'none',
          tutorialActive: false,
          tutorialCompleted: true,
        });
      },

      resetMission: () => {
        soundEngine.playSelect();
        set((state) => ({
          screen: 'playing',
          selectedRoomFilter: 'all',
          cameraFocusRoom: 'overview',
          cameraResetNonce: state.cameraResetNonce + 1,
          statusFilter: 'all',
          selectedDeviceId: null,
          zenMode: false,
          deviceStates: createInitialDeviceStates(),
          decisionLog: [],
          score: 0,
          elapsedSeconds: 0,
          isTimerRunning: true,
          activeModal: 'none',
          assistantMessages: [INITIAL_ASSISTANT_MESSAGE],
        }));
      },

      updateSettings: (partial) => {
        set((state) => {
          const next = { ...state.settings, ...partial };
          soundEngine.setEnabled(next.soundEnabled);
          return { settings: next };
        });
      },

      addAssistantMessage: (msg) => {
        set((state) => ({
          assistantMessages: [
            ...state.assistantMessages,
            {
              ...msg,
              id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              timestamp: Date.now(),
            },
          ],
        }));
      },

      setAssistantMode: (mode) => set({ assistantMode: mode }),
    }),
    {
      name: 'cyber_defense_smarthome_v1',
      partialize: (state) => ({
        screen: state.screen,
        deviceStates: state.deviceStates,
        decisionLog: state.decisionLog,
        score: state.score,
        elapsedSeconds: state.elapsedSeconds,
        tutorialCompleted: state.tutorialCompleted,
        settings: state.settings,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<GameStoreState>;
        return {
          ...currentState,
          ...persisted,
          deviceStates: {
            ...createInitialDeviceStates(),
            ...(persisted.deviceStates ?? {}),
          },
          settings: {
            ...currentState.settings,
            ...(persisted.settings ?? {}),
          },
        };
      },
    },
  ),
);
