import {
  AirVent,
  Bell,
  Bot,
  Camera,
  CloudSun,
  Cpu,
  DoorClosed,
  Droplets,
  Flame,
  Gauge,
  Lightbulb,
  Lock,
  Monitor,
  PlugZap,
  Printer,
  Radio,
  Refrigerator,
  Router,
  ShieldAlert,
  Speaker,
  Thermometer,
  Trees,
  Tv,
  Volume2,
  Warehouse,
  WashingMachine,
  Waves,
  Zap,
} from 'lucide-react';
import { DeviceKind } from '../types/game';

interface DeviceIconProps {
  kind: DeviceKind;
  className?: string;
}

export function DeviceIcon({ kind, className = 'h-4 w-4' }: DeviceIconProps) {
  switch (kind) {
    case 'camera':
      return <Camera className={className} />;
    case 'router':
      return <Router className={className} />;
    case 'speaker':
      return <Speaker className={className} />;
    case 'tv':
      return <Tv className={className} />;
    case 'lighting':
      return <Lightbulb className={className} />;
    case 'thermostat':
      return <Thermometer className={className} />;
    case 'assistant':
      return <Volume2 className={className} />;
    case 'fridge':
      return <Refrigerator className={className} />;
    case 'smoke_sensor':
    case 'co_sensor':
      return <Flame className={className} />;
    case 'smart_lock':
      return <Lock className={className} />;
    case 'motion_sensor':
    case 'sensor_presence':
      return <Radio className={className} />;
    case 'sensor_temp':
      return <Gauge className={className} />;
    case 'door_sensor':
      return <DoorClosed className={className} />;
    case 'doorbell':
      return <Bell className={className} />;
    case 'alarm_hub':
      return <ShieldAlert className={className} />;
    case 'ac_unit':
      return <AirVent className={className} />;
    case 'smart_outlet':
      return <PlugZap className={className} />;
    case 'oven':
      return <Flame className={className} />;
    case 'pc_workstation':
      return <Monitor className={className} />;
    case 'printer':
      return <Printer className={className} />;
    case 'washer':
      return <WashingMachine className={className} />;
    case 'garage_gate':
      return <Warehouse className={className} />;
    case 'ev_charger':
      return <Zap className={className} />;
    case 'irrigation':
      return <Trees className={className} />;
    case 'weather_station':
      return <CloudSun className={className} />;
    case 'robot_mower':
      return <Bot className={className} />;
    case 'pool_controller':
      return <Waves className={className} />;
    case 'water_leak':
    case 'humidity_sensor':
      return <Droplets className={className} />;
    default:
      return <Cpu className={className} />;
  }
}
