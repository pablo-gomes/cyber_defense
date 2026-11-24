import { Eye, EyeOff, Home, Layers, Map as MapIcon, Network, RotateCcw } from 'lucide-react';
import { ROOMS } from '../data/smartHomeData';
import { useGameStore } from '../store/useGameStore';
import { ArchitecturalViewMode, RoomId } from '../types/game';

const QUICK_ROOM_IDS: RoomId[] = ['living_room', 'office', 'garage', 'pool', 'street'];

const VIEW_MODES: Array<{ id: ArchitecturalViewMode; label: string; title: string }> = [
  { id: 'full', label: 'Casa completa', title: 'Exibir cobertura, forro e arquitetura completa' },
  { id: 'no_roof', label: 'Sem cobertura', title: 'Corte arquitetônico sem telhado para visualizar cômodos' },
  { id: 'interior', label: 'Interna', title: 'Visualização aproximada dos ambientes internos' },
  { id: 'overview', label: 'Visão geral', title: 'Visão aérea completa da propriedade' },
];

export function BottomCameraDock() {
  const cameraFocusRoom = useGameStore((s) => s.cameraFocusRoom);
  const showNetworkLinks = useGameStore((s) => s.showNetworkLinks);
  const showVulnerabilityOverlay = useGameStore((s) => s.showVulnerabilityOverlay);
  const zenMode = useGameStore((s) => s.zenMode);
  const architecturalViewMode = useGameStore((s) => s.architecturalViewMode);
  const focusCameraRoom = useGameStore((s) => s.focusCameraRoom);
  const triggerCameraReset = useGameStore((s) => s.triggerCameraReset);
  const toggleNetworkLinks = useGameStore((s) => s.toggleNetworkLinks);
  const toggleVulnerabilityOverlay = useGameStore((s) => s.toggleVulnerabilityOverlay);
  const toggleZenMode = useGameStore((s) => s.toggleZenMode);
  const setArchitecturalViewMode = useGameStore((s) => s.setArchitecturalViewMode);
  const setActiveModal = useGameStore((s) => s.setActiveModal);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center px-3">
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 rounded-xl border border-[#E9EDF2] bg-white/95 px-2.5 py-1.5 shadow-md">
        <div className="flex items-center gap-1 rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] p-0.5">
          <Home className="ml-1.5 h-3.5 w-3.5 text-[#315EAA]" aria-hidden="true" />
          <label className="sr-only" htmlFor="arch-view-mode-select">
            Modo de visualização arquitetônica
          </label>
          <select
            id="arch-view-mode-select"
            value={architecturalViewMode}
            onChange={(e) => setArchitecturalViewMode(e.target.value as ArchitecturalViewMode)}
            title="Alternar modo arquitetônico (Casa completa, Sem cobertura, Interna, Visão geral)"
            className="h-7 rounded-md bg-transparent px-1.5 text-xs font-semibold text-[#18212F] outline-none"
          >
            {VIEW_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => focusCameraRoom('overview')}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
            cameraFocusRoom === 'overview'
              ? 'bg-[#315EAA] text-white font-semibold'
              : 'text-[#475569] hover:bg-[#F5F6F8] hover:text-[#18212F]'
          }`}
        >
          Visão Geral
        </button>

        {/* Compact Full-Property Room Selector for all 15 Zones */}
        <label className="sr-only" htmlFor="camera-room-select">
          Selecionar ambiente para focar câmera 3D
        </label>
        <select
          id="camera-room-select"
          value={cameraFocusRoom}
          onChange={(e) => focusCameraRoom(e.target.value as RoomId | 'overview')}
          className="h-8 rounded-lg border border-[#E9EDF2] bg-[#F8FAFC] px-2.5 text-xs font-medium text-[#18212F] outline-none transition-colors hover:border-[#315EAA]/40 focus:border-[#315EAA]"
        >
          <option value="overview">Todos os ambientes (15)</option>
          <optgroup label="Interiores">
            {ROOMS.filter((r) => r.zone === 'interior').map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Serviços & Garagem">
            {ROOMS.filter((r) => r.zone === 'service').map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Área Externa & Rua">
            {ROOMS.filter((r) => r.zone === 'outdoor').map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </optgroup>
        </select>

        {/* Key Highlight Quick Buttons */}
        <div className="hidden items-center gap-1 xl:flex">
          {QUICK_ROOM_IDS.map((rid) => {
            const room = ROOMS.find((r) => r.id === rid);
            if (!room) return null;
            return (
              <button
                key={rid}
                type="button"
                onClick={() => focusCameraRoom(rid)}
                className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  cameraFocusRoom === rid
                    ? 'bg-[#315EAA] text-white font-semibold'
                    : 'text-[#475569] hover:bg-[#F5F6F8] hover:text-[#18212F]'
                }`}
              >
                {room.name.replace(' & Deck', '').replace(' Pública', '')}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setActiveModal('property_map')}
          title="Abrir mapa arquitetônico interativo da casa (Tecla M)"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-1.5 text-xs font-semibold text-[#315EAA] transition-colors hover:bg-[#DBEAFE] whitespace-nowrap"
        >
          <MapIcon className="h-3.5 w-3.5" />
          <span>Mapa</span>
        </button>

        <div className="mx-0.5 h-5 w-px bg-[#E9EDF2]" aria-hidden="true" />

        <button
          type="button"
          onClick={toggleVulnerabilityOverlay}
          title={
            showVulnerabilityOverlay
              ? 'Ocultar indicadores visuais sobre dispositivos 3D'
              : 'Mostrar indicadores visuais sobre dispositivos 3D'
          }
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
            showVulnerabilityOverlay
              ? 'bg-[#EFF6FF] text-[#315EAA] ring-1 ring-[#315EAA]/25'
              : 'text-[#475569] hover:bg-[#F5F6F8] hover:text-[#18212F]'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Indicadores</span>
        </button>

        <button
          type="button"
          onClick={toggleNetworkLinks}
          title="Mostrar ou ocultar conexões de rede Wi-Fi/IoT"
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
            showNetworkLinks
              ? 'bg-[#EFF6FF] text-[#315EAA] ring-1 ring-[#315EAA]/25'
              : 'text-[#475569] hover:bg-[#F5F6F8] hover:text-[#18212F]'
          }`}
        >
          <Network className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Rede IoT</span>
        </button>

        <button
          type="button"
          onClick={triggerCameraReset}
          title="Ajustar câmera para visão geral (Tecla R)"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#475569] transition-colors hover:bg-[#F5F6F8] hover:text-[#18212F] whitespace-nowrap"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Ajustar</span>
        </button>

        <button
          type="button"
          onClick={toggleZenMode}
          title={zenMode ? 'Mostrar painéis laterais' : 'Ocultar painéis laterais'}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#475569] transition-colors hover:bg-[#F5F6F8] hover:text-[#18212F] whitespace-nowrap"
        >
          {zenMode ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          <span className="hidden md:inline">{zenMode ? 'Painéis' : 'Foco 3D'}</span>
        </button>
      </div>
    </div>
  );
}
