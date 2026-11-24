import { CheckCircle2, Compass, Map as MapIcon, ShieldAlert, X } from 'lucide-react';
import { ROOMS, SMART_DEVICES } from '../data/smartHomeData';
import { useGameStore } from '../store/useGameStore';
import { RoomConfig } from '../types/game';

function getRoomMapStyle(
  room: RoomConfig,
  roomSafe: number,
  roomTotal: number,
  hasRisk: boolean,
  isFocused: boolean,
): { bg: string; border: string; badgeText: string; badgeClass: string } {
  if (roomTotal > 0 && roomSafe === roomTotal) {
    return {
      bg: isFocused ? 'bg-[#ECFDF5] ring-2 ring-[#239B69]' : 'bg-[#ECFDF5]/90 hover:bg-[#ECFDF5]',
      border: 'border-[#A7F3D0]',
      badgeText: 'Investigado',
      badgeClass: 'text-[#197A52]',
    };
  }
  if (hasRisk) {
    return {
      bg: isFocused ? 'bg-[#FEF2F2] ring-2 ring-[#D94A4A]' : 'bg-[#FEF2F2]/90 hover:bg-[#FEF2F2]',
      border: 'border-[#FECACA]',
      badgeText: 'Risco',
      badgeClass: 'text-[#B91C1C]',
    };
  }
  if (roomSafe > 0) {
    return {
      bg: isFocused ? 'bg-[#FFFBEB] ring-2 ring-[#D99B27]' : 'bg-[#FFFBEB]/90 hover:bg-[#FFFBEB]',
      border: 'border-[#FDE68A]',
      badgeText: 'Parcial',
      badgeClass: 'text-[#B45309]',
    };
  }
  return {
    bg: isFocused ? 'bg-[#EFF6FF] ring-2 ring-[#315EAA]' : 'bg-white/95 hover:bg-[#F8FAFC]',
    border: isFocused ? 'border-[#315EAA]' : 'border-[#CBD5E1]',
    badgeText: 'Pendente',
    badgeClass: 'text-[#64748B]',
  };
}

export function PropertyMapModal() {
  const activeModal = useGameStore((s) => s.activeModal);
  const setActiveModal = useGameStore((s) => s.setActiveModal);
  const deviceStates = useGameStore((s) => s.deviceStates);
  const cameraFocusRoom = useGameStore((s) => s.cameraFocusRoom);
  const selectRoom = useGameStore((s) => s.selectRoom);
  const selectDevice = useGameStore((s) => s.selectDevice);

  if (activeModal !== 'property_map') return null;

  const handleSelectRoom = (roomId: RoomConfig['id']) => {
    selectRoom(roomId, true);
    setActiveModal('none');
  };

  const handleSelectDevice = (deviceId: string) => {
    selectDevice(deviceId);
    setActiveModal('none');
  };

  // Render backyard & street behind interior/pool cards so Z-order is crystal clear
  const orderedRooms = [
    ...ROOMS.filter((r) => r.id === 'backyard' || r.id === 'street'),
    ...ROOMS.filter((r) => r.id !== 'backyard' && r.id !== 'street'),
  ];

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#18212F]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-map-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#E9EDF2] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E9EDF2] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#315EAA]/20 bg-[#EFF6FF] text-[#315EAA]">
              <MapIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 id="property-map-title" className="font-display text-lg font-bold text-[#18212F]">
                Mapa Arquitetônico da Propriedade
              </h2>
              <p className="text-xs text-[#64748B]">
                Clique em qualquer cômodo, área externa ou dispositivo para posicionar a câmera 3D
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                selectRoom('all', true);
                setActiveModal('none');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#18212F] hover:bg-white"
            >
              <Compass className="h-3.5 w-3.5 text-[#315EAA]" />
              <span>Visão Geral</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              aria-label="Fechar mapa da residência"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#18212F]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#F5F6F8] p-5">
          {/* Interactive Architectural Blueprint Canvas */}
          <div className="relative mx-auto aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-xl border border-[#CBD5E1] bg-[#E8EFE4] shadow-inner">
            {/* Subtle Architectural Grid */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-35"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(49,94,170,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(49,94,170,0.12) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            {orderedRooms.map((room) => {
              const roomDevs = SMART_DEVICES.filter((d) => d.roomId === room.id);
              const roomSafe = roomDevs.filter(
                (d) => deviceStates[d.id]?.status === 'protected',
              ).length;
              const hasRisk = roomDevs.some((d) => {
                const st = deviceStates[d.id]?.status;
                return st === 'vulnerable' || st === 'partial';
              });
              const style = getRoomMapStyle(
                room,
                roomSafe,
                roomDevs.length,
                hasRisk,
                cameraFocusRoom === room.id,
              );
              const isBackyardOrStreet = room.id === 'backyard' || room.id === 'street';

              return (
                <div
                  key={room.id}
                  style={{
                    left: `${room.mapRect.x}%`,
                    top: `${room.mapRect.y}%`,
                    width: `${room.mapRect.w}%`,
                    height: `${room.mapRect.h}%`,
                  }}
                  onClick={() => handleSelectRoom(room.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectRoom(room.id);
                    }
                  }}
                  className={`absolute cursor-pointer rounded-lg border p-2 text-left transition-all ${
                    isBackyardOrStreet ? 'z-0' : 'z-10 shadow-xs'
                  } ${
                    room.id === 'street'
                      ? 'border-[#64748B] bg-[#334155]/90 text-white hover:bg-[#334155]'
                      : room.id === 'pool'
                        ? 'border-[#38BDF8] bg-[#E0F2FE]/95 hover:bg-[#E0F2FE]'
                        : `${style.border} ${style.bg}`
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span
                      className={`truncate text-[11px] font-bold leading-tight ${
                        room.id === 'street' ? 'text-white' : 'text-[#18212F]'
                      }`}
                    >
                      {room.name}
                    </span>
                    <span
                      className={`shrink-0 font-mono text-[10px] font-semibold tabular-nums ${
                        room.id === 'street' ? 'text-[#E2E8F0]' : style.badgeClass
                      }`}
                    >
                      {roomSafe}/{roomDevs.length}
                    </span>
                  </div>

                  {/* Interactive Device Badges Inside Room */}
                  <div
                    className={`mt-1 flex flex-wrap gap-1 ${
                      room.id === 'backyard' ? 'max-w-[28%]' : ''
                    }`}
                  >
                    {roomDevs.map((dev) => {
                      const st = deviceStates[dev.id]?.status ?? 'uninspected';
                      const dotColor =
                        st === 'protected'
                          ? 'bg-[#239B69]'
                          : st === 'vulnerable'
                            ? 'bg-[#D94A4A]'
                            : st === 'partial'
                              ? 'bg-[#D99B27]'
                              : 'bg-[#315EAA]';

                      return (
                        <button
                          key={dev.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectDevice(dev.id);
                          }}
                          title={`${dev.name} (${st})`}
                          className="inline-flex items-center gap-1 rounded border border-[#CBD5E1]/80 bg-white/95 px-1.5 py-0.5 text-[9px] font-medium text-[#18212F] shadow-2xs transition-colors hover:border-[#315EAA] hover:text-[#315EAA]"
                        >
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} />
                          <span className="max-w-[78px] truncate">{dev.shortName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="mx-auto mt-4 flex max-w-4xl flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E9EDF2] bg-white px-4 py-2.5 text-xs text-[#475569]">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#315EAA]" />
                <span>Não auditado</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#D94A4A]" />
                <span>Vulnerável</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#D99B27]" />
                <span>Risco parcial</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#239B69]" />
                <span>Protegido / Investigado</span>
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
              <ShieldAlert className="h-3.5 w-3.5 text-[#315EAA]" />
              <span>Atalho: tecla M</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
