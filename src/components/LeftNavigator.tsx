import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Cpu,
  Home,
  Map as MapIcon,
  Search,
  ShieldAlert,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { ROOMS, SMART_DEVICES } from '../data/smartHomeData';
import { LeftNavTab, StatusFilter, useGameStore } from '../store/useGameStore';
import { DeviceSecurityStatus, SeverityLevel } from '../types/game';
import { DeviceIcon } from './DeviceIcon';

interface LeftNavigatorProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const SEVERITY_ORDER: Record<SeverityLevel, number> = {
  ALTO: 0,
  MÉDIO: 1,
  BAIXO: 2,
};

function getStatusMeta(status: DeviceSecurityStatus): {
  label: string;
  textClass: string;
} {
  switch (status) {
    case 'protected':
      return { label: 'Protegido', textClass: 'text-[#197A52]' };
    case 'partial':
      return { label: 'Parcial', textClass: 'text-[#B45309]' };
    case 'vulnerable':
      return { label: 'Vulnerável', textClass: 'text-[#B91C1C]' };
    case 'investigating':
      return { label: 'Investigando', textClass: 'text-[#315EAA]' };
    default:
      return { label: 'Não auditado', textClass: 'text-[#64748B]' };
  }
}

export function LeftNavigator({ collapsed, onToggleCollapse }: LeftNavigatorProps) {
  const leftTab = useGameStore((s) => s.leftTab);
  const setLeftTab = useGameStore((s) => s.setLeftTab);
  const selectedRoomFilter = useGameStore((s) => s.selectedRoomFilter);
  const statusFilter = useGameStore((s) => s.statusFilter);
  const selectedDeviceId = useGameStore((s) => s.selectedDeviceId);
  const deviceStates = useGameStore((s) => s.deviceStates);
  const selectRoom = useGameStore((s) => s.selectRoom);
  const setStatusFilter = useGameStore((s) => s.setStatusFilter);
  const selectDevice = useGameStore((s) => s.selectDevice);
  const setActiveModal = useGameStore((s) => s.setActiveModal);

  const filteredDevices = SMART_DEVICES.filter((device) => {
    if (selectedRoomFilter !== 'all' && device.roomId !== selectedRoomFilter) {
      return false;
    }
    const status = deviceStates[device.id]?.status ?? 'uninspected';
    if (statusFilter === 'vulnerable') {
      return status === 'vulnerable' || status === 'partial';
    }
    if (statusFilter === 'uninspected') {
      return status === 'uninspected' || status === 'investigating';
    }
    if (statusFilter === 'protected') {
      return status === 'protected';
    }
    return true;
  });

  const sortedAlerts = [...SMART_DEVICES]
    .filter((d) => d.isInitiallyVulnerable && d.challenge)
    .sort((a, b) => {
      const aDone = deviceStates[a.id]?.status === 'protected' ? 1 : 0;
      const bDone = deviceStates[b.id]?.status === 'protected' ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      return (
        SEVERITY_ORDER[a.challenge!.threat.severity] -
        SEVERITY_ORDER[b.challenge!.threat.severity]
      );
    });

  const pendingAlertsCount = sortedAlerts.filter(
    (d) => deviceStates[d.id]?.status !== 'protected',
  ).length;

  const inspectedCount = SMART_DEVICES.filter(
    (d) => deviceStates[d.id]?.stage !== 'locked',
  ).length;
  const fixedVulnerableCount = SMART_DEVICES.filter(
    (d) => d.isInitiallyVulnerable && deviceStates[d.id]?.status === 'protected',
  ).length;
  const totalVulnerableCount = SMART_DEVICES.filter((d) => d.isInitiallyVulnerable).length;
  const validatedSafeCount = SMART_DEVICES.filter(
    (d) => !d.isInitiallyVulnerable && deviceStates[d.id]?.status === 'protected',
  ).length;
  const totalSafeCount = SMART_DEVICES.filter((d) => !d.isInitiallyVulnerable).length;
  const recognizedThreatCount = SMART_DEVICES.filter((d) => {
    const stage = deviceStates[d.id]?.stage;
    return d.isInitiallyVulnerable && (stage === 'threat_recognized' || stage === 'resolved');
  }).length;

  const missionsList = [
    {
      id: 'm1',
      title: 'Inspecionar todos os dispositivos',
      progress: `${inspectedCount}/${SMART_DEVICES.length}`,
      done: inspectedCount === SMART_DEVICES.length,
    },
    {
      id: 'm2',
      title: 'Reconhecer ameaças nos itens críticos',
      progress: `${recognizedThreatCount}/${totalVulnerableCount}`,
      done: recognizedThreatCount === totalVulnerableCount,
    },
    {
      id: 'm3',
      title: 'Corrigir dispositivos vulneráveis',
      progress: `${fixedVulnerableCount}/${totalVulnerableCount}`,
      done: fixedVulnerableCount === totalVulnerableCount,
    },
    {
      id: 'm4',
      title: 'Confirmar dispositivos já seguros',
      progress: `${validatedSafeCount}/${totalSafeCount}`,
      done: validatedSafeCount === totalSafeCount,
    },
  ];

  if (collapsed) {
    return (
      <div className="z-10 flex flex-col items-center border-r border-[#E9EDF2] bg-white px-2 py-3">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Expandir painel de navegação"
          title="Expandir navegação"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] text-[#475569] transition-colors hover:bg-[#F1F5F9] hover:text-[#18212F]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const navTabs: Array<{
    id: LeftNavTab;
    label: string;
    icon: typeof Compass;
    badge?: number;
  }> = [
    { id: 'rooms', label: 'Cômodos', icon: Compass },
    { id: 'devices', label: 'Aparelhos', icon: Cpu },
    { id: 'alerts', label: 'Alertas', icon: AlertTriangle, badge: pendingAlertsCount },
    { id: 'missions', label: 'Missões', icon: Target },
  ];

  return (
    <aside className="z-10 flex h-full w-76 shrink-0 flex-col border-r border-[#E9EDF2] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E9EDF2] px-4 py-3">
        <div>
          <h2 className="font-display text-sm font-bold text-[#18212F]">
            Navegação da Casa
          </h2>
          <p className="text-[11px] text-[#64748B]">
            Ambientes, inventário e auditoria
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Recolher navegação"
          title="Recolher painel"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#18212F]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Clean Minimalist Tabs */}
      <div className="border-b border-[#E9EDF2] px-2.5 py-2">
        <div className="grid grid-cols-4 gap-1 rounded-lg bg-[#F5F6F8] p-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const active = leftTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLeftTab(tab.id)}
                className={`relative flex flex-col items-center justify-center gap-1 rounded-md py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-white text-[#315EAA] shadow-xs font-semibold'
                    : 'text-[#64748B] hover:text-[#18212F]'
                }`}
              >
                <div className="relative">
                  <Icon className="h-3.5 w-3.5" />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 rounded-full bg-[#D94A4A] px-1 font-mono text-[9px] font-bold leading-tight text-white tabular-nums">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {/* TAB 1: CÔMODOS */}
        {leftTab === 'rooms' && (
          <div className="space-y-3 p-3.5">
            <button
              type="button"
              onClick={() => selectRoom('all', true)}
              className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition-colors ${
                selectedRoomFilter === 'all'
                  ? 'border-[#315EAA]/30 bg-[#EFF6FF] text-[#315EAA]'
                  : 'border-[#E9EDF2] bg-white text-[#18212F] hover:bg-[#F8FAFC]'
              }`}
            >
              <span className="flex items-center gap-2 font-semibold">
                <Home className="h-4 w-4 shrink-0" />
                <span>Visão Geral da Propriedade</span>
              </span>
              <span className="font-mono text-[11px] tabular-nums text-[#64748B]">
                {SMART_DEVICES.length} itens
              </span>
            </button>

            {(
              [
                { zone: 'interior', label: 'Interiores da Casa' },
                { zone: 'service', label: 'Serviços & Garagem' },
                { zone: 'outdoor', label: 'Área Externa, Jardim & Rua' },
              ] as const
            ).map((group) => {
              const zoneRooms = ROOMS.filter((r) => r.zone === group.zone);
              return (
                <div key={group.zone} className="space-y-2 pt-1">
                  <div className="px-1 text-[10px] font-bold tracking-wider text-[#64748B] uppercase">
                    {group.label} ({zoneRooms.length})
                  </div>

                  {zoneRooms.map((room) => {
                    const roomDevices = SMART_DEVICES.filter((d) => d.roomId === room.id);
                    const roomSafe = roomDevices.filter(
                      (d) => deviceStates[d.id]?.status === 'protected',
                    ).length;
                    const hasRisk = roomDevices.some((d) => {
                      const st = deviceStates[d.id]?.status;
                      return st === 'vulnerable' || st === 'partial';
                    });
                    const pct =
                      roomDevices.length > 0
                        ? Math.round((roomSafe / roomDevices.length) * 100)
                        : 100;
                    const active = selectedRoomFilter === room.id;

                    const roomStatusLabel =
                      roomSafe === roomDevices.length
                        ? 'Investigado'
                        : hasRisk
                          ? 'Risco'
                          : roomSafe > 0
                            ? 'Parcial'
                            : 'Pendente';
                    const roomStatusClass =
                      roomSafe === roomDevices.length
                        ? 'bg-[#ECFDF5] text-[#197A52]'
                        : hasRisk
                          ? 'bg-[#FEF2F2] text-[#B91C1C]'
                          : roomSafe > 0
                            ? 'bg-[#FFFBEB] text-[#B45309]'
                            : 'bg-[#F1F5F9] text-[#64748B]';

                    return (
                      <div
                        key={room.id}
                        className={`rounded-xl border transition-colors ${
                          active
                            ? 'border-[#315EAA]/35 bg-[#F8FAFC]'
                            : 'border-[#E9EDF2] bg-white'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => selectRoom(room.id, true)}
                          className="w-full p-3 text-left"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`truncate text-xs font-semibold ${
                                active ? 'text-[#315EAA]' : 'text-[#18212F]'
                              }`}
                            >
                              {room.name}
                            </span>
                            <div className="flex shrink-0 items-center gap-1.5">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${roomStatusClass}`}
                              >
                                {roomStatusLabel}
                              </span>
                              <span className="font-mono text-[11px] font-medium text-[#64748B] tabular-nums">
                                {roomSafe}/{roomDevices.length}
                              </span>
                            </div>
                          </div>
                          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#64748B]">
                            {room.description}
                          </p>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E9EDF2]">
                            <div
                              className="h-full bg-[#239B69] transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </button>

                        <div className="border-t border-[#E9EDF2] px-2 py-1.5">
                          {roomDevices.map((dev) => {
                            const st = deviceStates[dev.id]?.status ?? 'uninspected';
                            const meta = getStatusMeta(st);
                            const isSel = selectedDeviceId === dev.id;
                            return (
                              <button
                                key={dev.id}
                                type="button"
                                onClick={() => selectDevice(dev.id)}
                                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] transition-colors ${
                                  isSel
                                    ? 'bg-[#315EAA]/10 text-[#315EAA] font-semibold'
                                    : 'text-[#475569] hover:bg-[#F5F6F8] hover:text-[#18212F]'
                                }`}
                              >
                                <span className="flex min-w-0 items-center gap-2">
                                  <DeviceIcon kind={dev.kind} className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate">{dev.shortName}</span>
                                </span>
                                <span className={`shrink-0 font-medium ${meta.textClass}`}>
                                  {meta.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: DISPOSITIVOS */}
        {leftTab === 'devices' && (
          <div className="flex flex-col">
            <div className="border-b border-[#E9EDF2] p-3">
              <div className="grid grid-cols-4 gap-1 rounded-lg bg-[#F5F6F8] p-1">
                {(
                  [
                    { id: 'all', label: 'Todos' },
                    { id: 'uninspected', label: 'Pendentes' },
                    { id: 'vulnerable', label: 'Riscos' },
                    { id: 'protected', label: 'Seguros' },
                  ] as Array<{ id: StatusFilter; label: string }>
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id)}
                    className={`rounded-md py-1 text-[11px] font-medium transition-colors whitespace-nowrap ${
                      statusFilter === tab.id
                        ? 'bg-white text-[#18212F] shadow-xs font-semibold'
                        : 'text-[#64748B] hover:text-[#18212F]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-[#E9EDF2]">
              {filteredDevices.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#64748B]">
                  Nenhum dispositivo corresponde a este filtro.
                </div>
              ) : (
                filteredDevices.map((device) => {
                  const status = deviceStates[device.id]?.status ?? 'uninspected';
                  const meta = getStatusMeta(status);
                  const isSelected = selectedDeviceId === device.id;
                  const roomName = ROOMS.find((r) => r.id === device.roomId)?.name ?? '';

                  return (
                    <button
                      key={device.id}
                      type="button"
                      onClick={() => selectDevice(device.id)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                        isSelected ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                          status === 'protected'
                            ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#197A52]'
                            : status === 'vulnerable'
                              ? 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'
                              : status === 'partial'
                                ? 'border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]'
                                : isSelected
                                  ? 'border-[#BFDBFE] bg-white text-[#315EAA]'
                                  : 'border-[#E9EDF2] bg-[#F8FAFC] text-[#475569]'
                        }`}
                      >
                        <DeviceIcon kind={device.kind} className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-xs font-semibold text-[#18212F]">
                            {device.shortName}
                          </span>
                          {status === 'protected' ? (
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#239B69]" />
                          ) : status === 'vulnerable' || status === 'partial' ? (
                            <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-[#D99B27]" />
                          ) : (
                            <Search className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#64748B]">
                          <span className="truncate">{roomName}</span>
                          <span aria-hidden="true">·</span>
                          <span className={`font-medium ${meta.textClass}`}>{meta.label}</span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ALERTAS */}
        {leftTab === 'alerts' && (
          <div className="space-y-2.5 p-3.5">
            {sortedAlerts.map((dev) => {
              const threat = dev.challenge!.threat;
              const isResolved = deviceStates[dev.id]?.status === 'protected';
              const roomName = ROOMS.find((r) => r.id === dev.roomId)?.name ?? '';

              return (
                <button
                  key={dev.id}
                  type="button"
                  onClick={() => selectDevice(dev.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    isResolved
                      ? 'border-[#E9EDF2] bg-[#F8FAFC] opacity-80 hover:opacity-100'
                      : 'border-[#E9EDF2] bg-white hover:border-[#315EAA]/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-semibold text-[#18212F]">
                      {dev.shortName}
                    </span>
                    {isResolved ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#197A52]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Resolvido</span>
                      </span>
                    ) : (
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                          threat.severity === 'ALTO'
                            ? 'bg-[#FEF2F2] text-[#B91C1C]'
                            : threat.severity === 'MÉDIO'
                              ? 'bg-[#FFFBEB] text-[#B45309]'
                              : 'bg-[#EFF6FF] text-[#315EAA]'
                        }`}
                      >
                        {threat.severity}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-[#475569]">{threat.title}</p>
                  <div className="mt-1 text-[10px] text-[#64748B]">{roomName}</div>
                </button>
              );
            })}
          </div>
        )}

        {/* TAB 4: MISSÕES */}
        {leftTab === 'missions' && (
          <div className="space-y-3 p-3.5">
            <div className="rounded-xl border border-[#E9EDF2] bg-[#F8FAFC] p-3.5">
              <div className="text-xs font-semibold text-[#18212F]">
                Objetivos da Auditoria
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-[#64748B]">
                Complete as etapas em cada ambiente para elevar o índice de segurança da
                Smart Home até 100%.
              </p>
            </div>

            <div className="space-y-2">
              {missionsList.map((m) => (
                <div
                  key={m.id}
                  className="flex items-start justify-between gap-2 rounded-xl border border-[#E9EDF2] bg-white p-3 text-xs"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        m.done ? 'text-[#239B69]' : 'text-[#CBD5E1]'
                      }`}
                    />
                    <span className={m.done ? 'font-medium text-[#18212F]' : 'text-[#475569]'}>
                      {m.title}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] font-semibold text-[#315EAA] tabular-nums">
                    {m.progress}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Shortcuts */}
      <div className="grid grid-cols-2 gap-2 border-t border-[#E9EDF2] p-3">
        <button
          type="button"
          onClick={() => setActiveModal('property_map')}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] py-2 text-xs font-semibold text-[#315EAA] transition-colors hover:bg-[#DBEAFE]"
        >
          <MapIcon className="h-3.5 w-3.5" />
          <span>Mapa</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveModal('security_center')}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] py-2 text-xs font-semibold text-[#18212F] transition-colors hover:border-[#315EAA]/35 hover:bg-white"
        >
          <Activity className="h-3.5 w-3.5 text-[#315EAA]" />
          <span>Central</span>
        </button>
      </div>
    </aside>
  );
}
