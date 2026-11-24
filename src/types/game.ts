export type RoomId =
  | 'living_room'
  | 'bedroom'
  | 'kitchen'
  | 'exterior'
  | 'hallway'
  | 'bathroom'
  | 'office'
  | 'laundry'
  | 'dining_room'
  | 'guest_bedroom'
  | 'garage'
  | 'backyard'
  | 'gourmet'
  | 'pool'
  | 'street';

export type SeverityLevel = 'BAIXO' | 'MÉDIO' | 'ALTO';

export type DeviceKind =
  | 'camera'
  | 'router'
  | 'speaker'
  | 'tv'
  | 'sensor_presence'
  | 'lighting'
  | 'thermostat'
  | 'assistant'
  | 'sensor_temp'
  | 'fridge'
  | 'smoke_sensor'
  | 'smart_lock'
  | 'motion_sensor'
  | 'door_sensor'
  | 'doorbell'
  | 'alarm_hub'
  | 'ac_unit'
  | 'smart_outlet'
  | 'oven'
  | 'pc_workstation'
  | 'printer'
  | 'washer'
  | 'garage_gate'
  | 'ev_charger'
  | 'irrigation'
  | 'weather_station'
  | 'robot_mower'
  | 'pool_controller'
  | 'water_leak'
  | 'humidity_sensor'
  | 'co_sensor';

export type DeviceSecurityStatus =
  | 'uninspected'
  | 'investigating'
  | 'vulnerable'
  | 'partial'
  | 'protected';

export type InvestigationStage =
  | 'locked'
  | 'clues_revealed'
  | 'vulnerability_identified'
  | 'threat_recognized'
  | 'resolved';

export type OptionQuality = 'correct' | 'partial' | 'incorrect';

export interface ForensicClue {
  id: string;
  label: string;
  value: string;
  suspicious: boolean;
}

export interface DiagnosticOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface ProtectionOption {
  id: string;
  label: string;
  text: string;
  quality: OptionQuality;
  feedback: string;
  residualRisk?: string;
}

export interface ThreatInfo {
  id: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  consequences: string;
  recommendation: string;
  recognitionQuestion: string;
  recognitionOptions: DiagnosticOption[];
}

export interface DeviceChallenge {
  vulnerabilityTitle: string;
  vulnerabilityCategory: string;
  vulnerabilityQuestion: string;
  vulnerabilityOptions: DiagnosticOption[];
  threat: ThreatInfo;
  protectionQuestion: string;
  protectionOptions: ProtectionOption[];
}

export interface SmartDeviceConfig {
  id: string;
  name: string;
  shortName: string;
  roomId: RoomId;
  kind: DeviceKind;
  position: [number, number, number];
  rotationY?: number;
  connectionType: string;
  ipAddress: string;
  firmwareVersion: string;
  protocol: string;
  summary: string;
  isInitiallyVulnerable: boolean;
  maxPoints: number;
  securityWeight: number;
  clues: ForensicClue[];
  secureConfirmationText?: string;
  challenge?: DeviceChallenge;
  hintProgressive: [string, string];
}

export interface RoomConfig {
  id: RoomId;
  name: string;
  zone: 'interior' | 'service' | 'outdoor';
  description: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  floorBounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  mapRect: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface DecisionLogEntry {
  id: string;
  timestamp: number;
  deviceId: string;
  deviceName: string;
  roomId: RoomId;
  step: 'vulnerability' | 'threat' | 'protection' | 'validation';
  chosenText: string;
  quality: OptionQuality;
  pointsDelta: number;
  explanation: string;
}

export interface DeviceRuntimeState {
  status: DeviceSecurityStatus;
  stage: InvestigationStage;
  revealedClueCount: number;
  vulnerabilityAttempts: number;
  threatAttempts: number;
  protectionAttempts: number;
  earnedPoints: number;
  selectedProtectionQuality: OptionQuality | null;
  lastFeedback: string | null;
  lastFeedbackQuality: OptionQuality | null;
}

export interface GameSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
  graphicsQuality: 'low' | 'medium' | 'high';
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  mode: 'gemini' | 'local';
  timestamp: number;
}

export type AppScreen = 'start' | 'playing' | 'report';

export type ArchitecturalViewMode = 'full' | 'no_roof' | 'interior' | 'overview';
