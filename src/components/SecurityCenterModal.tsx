import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import { getClassification, ROOMS, SMART_DEVICES } from '../data/smartHomeData';
import { computeSecurityPercent, useGameStore } from '../store/useGameStore';
import { SeverityLevel } from '../types/game';
import { DeviceIcon } from './DeviceIcon';

const SEVERITY_ORDER: Record<SeverityLevel, number> = {
  ALTO: 0,
  MÉDIO: 1,
  BAIXO: 2,
};

export function SecurityCenterModal() {
  const activeModal = useGameStore((s) => s.activeModal);
  const deviceStates = useGameStore((s) => s.deviceStates);
  const score = useGameStore((s) => s.score);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const selectDevice = useGameStore((s) => s.selectDevice);

  if (activeModal !== 'security_center') return null;

  const totalDevices = SMART_DEVICES.length;
  const protectedDevices = SMART_DEVICES.filter(
    (d) => deviceStates[d.id]?.status === 'protected',
  ).length;
  const vulnerableDevicesList = SMART_DEVICES.filter((d) => {
    const st = deviceStates[d.id]?.status;
    return d.isInitiallyVulnerable && st !== 'protected';
  });
  const identifiedVulns = SMART_DEVICES.filter((d) => {
    const stage = deviceStates[d.id]?.stage;
    return (
      d.isInitiallyVulnerable &&
      (stage === 'vulnerability_identified' ||
        stage === 'threat_recognized' ||
        stage === 'resolved')
    );
  }).length;
  const fixedVulns = SMART_DEVICES.filter(
    (d) => d.isInitiallyVulnerable && deviceStates[d.id]?.status === 'protected',
  ).length;
  const totalVulnerableDevices = SMART_DEVICES.filter((d) => d.isInitiallyVulnerable).length;
  const securityPercent = computeSecurityPercent(deviceStates);
  const classification = getClassification(score);

  const sortedAlerts = [...SMART_DEVICES]
    .filter((d) => d.isInitiallyVulnerable && d.challenge)
    .sort((a, b) => {
      const aResolved = deviceStates[a.id]?.status === 'protected' ? 1 : 0;
      const bResolved = deviceStates[b.id]?.status === 'protected' ? 1 : 0;
      if (aResolved !== bResolved) return aResolved - bResolved;
      return (
        SEVERITY_ORDER[a.challenge!.threat.severity] -
        SEVERITY_ORDER[b.challenge!.threat.severity]
      );
    });

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (securityPercent / 100) * circumference;

  const handleJumpToDevice = (deviceId: string) => {
    setActiveModal('none');
    selectDevice(deviceId);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#18212F]/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="security-center-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#E9EDF2] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E9EDF2] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#315EAA]/20 bg-[#EFF6FF] text-[#315EAA]">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 id="security-center-title" className="font-display text-lg font-bold text-[#18212F]">
                Central de Monitoramento de Segurança
              </h2>
              <p className="text-xs text-[#64748B]">
                Visão em tempo real da postura cibernética da Smart Home
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal('none')}
            aria-label="Fechar central de segurança"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] text-[#475569] transition-colors hover:bg-[#F1F5F9] hover:text-[#18212F]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-6 overflow-y-auto bg-[#F5F6F8] p-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-xl border border-[#E9EDF2] bg-white p-3.5">
              <div className="text-[11px] font-medium text-[#64748B]">Dispositivos</div>
              <div className="mt-1 font-mono text-2xl font-bold text-[#18212F] tabular-nums">
                {totalDevices}
              </div>
            </div>
            <div className="rounded-xl border border-[#E9EDF2] bg-white p-3.5">
              <div className="text-[11px] font-medium text-[#64748B]">Protegidos</div>
              <div className="mt-1 font-mono text-2xl font-bold text-[#197A52] tabular-nums">
                {protectedDevices}
              </div>
            </div>
            <div className="rounded-xl border border-[#E9EDF2] bg-white p-3.5">
              <div className="text-[11px] font-medium text-[#64748B]">Vulneráveis</div>
              <div className="mt-1 font-mono text-2xl font-bold text-[#B91C1C] tabular-nums">
                {vulnerableDevicesList.length}
              </div>
            </div>
            <div className="rounded-xl border border-[#E9EDF2] bg-white p-3.5">
              <div className="text-[11px] font-medium text-[#64748B]">Identificadas</div>
              <div className="mt-1 font-mono text-2xl font-bold text-[#315EAA] tabular-nums">
                {identifiedVulns}/{totalVulnerableDevices}
              </div>
            </div>
            <div className="rounded-xl border border-[#E9EDF2] bg-white p-3.5">
              <div className="text-[11px] font-medium text-[#64748B]">Corrigidas</div>
              <div className="mt-1 font-mono text-2xl font-bold text-[#197A52] tabular-nums">
                {fixedVulns}/{totalVulnerableDevices}
              </div>
            </div>
            <div className="rounded-xl border border-[#E9EDF2] bg-white p-3.5">
              <div className="text-[11px] font-medium text-[#64748B]">Alertas abertos</div>
              <div className="mt-1 font-mono text-2xl font-bold text-[#B45309] tabular-nums">
                {vulnerableDevicesList.length}
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Security Gauge */}
            <div className="flex items-center gap-5 rounded-xl border border-[#E9EDF2] bg-white p-5 lg:col-span-5">
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#E9EDF2"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={
                      securityPercent >= 85
                        ? '#239B69'
                        : securityPercent >= 60
                          ? '#315EAA'
                          : securityPercent >= 40
                            ? '#D99B27'
                            : '#D94A4A'
                    }
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-xl font-bold text-[#18212F] tabular-nums">
                    {securityPercent}%
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-[#64748B]">Nível geral de proteção</div>
                <div className={`font-display mt-1 text-base font-bold ${classification.tierColor}`}>
                  {classification.label}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                  {classification.summary}
                </p>
              </div>
            </div>

            {/* Room Breakdown Bar Chart */}
            <div className="rounded-xl border border-[#E9EDF2] bg-white p-5 lg:col-span-7">
              <h3 className="text-xs font-semibold text-[#18212F]">
                Segurança por ambiente ({ROOMS.length})
              </h3>
              <div className="mt-3.5 grid grid-cols-1 gap-x-5 gap-y-2.5 sm:grid-cols-2">
                {ROOMS.map((room) => {
                  const roomDevs = SMART_DEVICES.filter((d) => d.roomId === room.id);
                  const roomSafe = roomDevs.filter(
                    (d) => deviceStates[d.id]?.status === 'protected',
                  ).length;
                  const pct =
                    roomDevs.length > 0 ? Math.round((roomSafe / roomDevs.length) * 100) : 100;
                  return (
                    <div key={room.id}>
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="truncate font-medium text-[#18212F]">{room.name}</span>
                        <span className="shrink-0 font-mono text-[#64748B] tabular-nums">
                          {roomSafe}/{roomDevs.length} ({pct}%)
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E9EDF2]">
                        <div
                          className="h-full bg-[#315EAA] transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Threat & Alert Feed */}
          <section className="rounded-xl border border-[#E9EDF2] bg-white">
            <div className="flex items-center justify-between border-b border-[#E9EDF2] px-5 py-3.5">
              <h3 className="text-sm font-semibold text-[#18212F]">
                Central de Ameaças e Alertas ({sortedAlerts.length})
              </h3>
              <span className="text-xs text-[#64748B]">
                Ordenado por prioridade e gravidade
              </span>
            </div>

            <div className="divide-y divide-[#E9EDF2]">
              {sortedAlerts.map((device) => {
                const threat = device.challenge!.threat;
                const runtime = deviceStates[device.id];
                const isProtected = runtime?.status === 'protected';
                const isPartial = runtime?.status === 'partial';
                const roomName = ROOMS.find((r) => r.id === device.roomId)?.name ?? '';

                const sevStyles =
                  threat.severity === 'ALTO'
                    ? 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'
                    : threat.severity === 'MÉDIO'
                      ? 'border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]'
                      : 'border-[#BFDBFE] bg-[#EFF6FF] text-[#315EAA]';

                return (
                  <div
                    key={device.id}
                    className="flex flex-col justify-between gap-3 px-5 py-3.5 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                          isProtected
                            ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#197A52]'
                            : 'border-[#E9EDF2] bg-[#F8FAFC] text-[#475569]'
                        }`}
                      >
                        <DeviceIcon kind={device.kind} className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-[#18212F]">
                            {device.name}
                          </span>
                          <span className="text-xs text-[#64748B]">· {roomName}</span>
                          {isProtected ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#197A52]">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Resolvido</span>
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${sevStyles}`}
                            >
                              <AlertTriangle className="h-3 w-3" />
                              <span>{threat.severity}</span>
                            </span>
                          )}
                          {isPartial && (
                            <span className="text-xs font-medium text-[#B45309]">
                              · Risco parcial
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs font-medium text-[#18212F]">{threat.title}</p>
                        <p className="mt-0.5 text-[11px] text-[#64748B]">
                          {isProtected ? threat.recommendation : threat.consequences}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleJumpToDevice(device.id)}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                        isProtected
                          ? 'border border-[#E9EDF2] bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#18212F]'
                          : 'bg-[#315EAA] text-white hover:bg-[#274D8C]'
                      }`}
                    >
                      {isProtected ? (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Revisar</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="h-3.5 w-3.5" />
                          <span>Investigar</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
