import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OVERVIEW_CAMERA, ROOMS, SMART_DEVICES } from '../data/smartHomeData';
import { useGameStore } from '../store/useGameStore';
import { buildExteriorAndStreet } from '../three/exteriorAndStreet';
import { buildSmartHomeArchitecture } from '../three/houseArchitecture';
import {
  createIoTDeviceMesh,
  DeviceVisualHandle,
  updateDeviceVisualState,
} from '../three/iotDeviceModels';
import { createProceduralTextures } from '../three/proceduralTextures';
import { DeviceSecurityStatus, RoomId } from '../types/game';
import { soundEngine } from '../utils/sound';

interface SmartHomeCanvasProps {
  onLoaded?: () => void;
  onLoadProgress?: (progress: number) => void;
}

interface NetworkArcHandle {
  deviceId: string;
  line: THREE.Line;
  material: THREE.LineBasicMaterial;
}

const _camTargetPos = new THREE.Vector3();
const _camTargetLook = new THREE.Vector3();
const _pointer = new THREE.Vector2();

function detectSoftwareWebGL(): boolean {
  try {
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

function getTargetCameraForSelection(
  room: RoomId | 'overview',
  selectedDeviceId: string | null,
): { pos: [number, number, number]; look: [number, number, number] } {
  if (selectedDeviceId) {
    const dev = SMART_DEVICES.find((d) => d.id === selectedDeviceId);
    if (dev) {
      const [dx, dy, dz] = dev.position;
      const offsetX = dx < 0 ? -3.4 : 3.4;
      const offsetZ = dz < -9 ? -3.8 : 4.2;
      return {
        pos: [
          THREE.MathUtils.clamp(dx + offsetX, -18, 18),
          Math.max(3.6, dy + 2.7),
          THREE.MathUtils.clamp(dz + offsetZ, -22, 22),
        ],
        look: [dx, Math.max(0.45, dy * 0.65), dz],
      };
    }
  }
  if (room !== 'overview') {
    const found = ROOMS.find((r) => r.id === room);
    if (found) {
      return { pos: found.cameraPosition, look: found.cameraTarget };
    }
  }
  return { pos: OVERVIEW_CAMERA.position, look: OVERVIEW_CAMERA.target };
}

function getArcColor(status: DeviceSecurityStatus): number {
  if (status === 'protected') return 0x239b69;
  if (status === 'partial') return 0xd99b27;
  if (status === 'vulnerable') return 0xd94a4a;
  return 0x315eaa;
}

export function SmartHomeCanvas({ onLoaded, onLoadProgress }: SmartHomeCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [contextLost, setContextLost] = useState(false);

  const selectedDeviceId = useGameStore((s) => s.selectedDeviceId);
  const cameraFocusRoom = useGameStore((s) => s.cameraFocusRoom);
  const cameraResetNonce = useGameStore((s) => s.cameraResetNonce);
  const deviceStates = useGameStore((s) => s.deviceStates);
  const showNetworkLinks = useGameStore((s) => s.showNetworkLinks);
  const showVulnerabilityOverlay = useGameStore((s) => s.showVulnerabilityOverlay);
  const settings = useGameStore((s) => s.settings);

  const stateRef = useRef({
    selectedDeviceId,
    cameraFocusRoom,
    deviceStates,
    showNetworkLinks,
    showVulnerabilityOverlay,
    reducedMotion: settings.reducedMotion,
    graphicsQuality: settings.graphicsQuality,
    soundEnabled: settings.soundEnabled,
  });
  stateRef.current = {
    selectedDeviceId,
    cameraFocusRoom,
    deviceStates,
    showNetworkLinks,
    showVulnerabilityOverlay,
    reducedMotion: settings.reducedMotion,
    graphicsQuality: settings.graphicsQuality,
    soundEnabled: settings.soundEnabled,
  };

  const transitionRef = useRef({
    active: false,
    pos: new THREE.Vector3(...OVERVIEW_CAMERA.position),
    look: new THREE.Vector3(...OVERVIEW_CAMERA.target),
  });

  useEffect(() => {
    const { pos, look } = getTargetCameraForSelection(cameraFocusRoom, selectedDeviceId);
    transitionRef.current.pos.set(...pos);
    transitionRef.current.look.set(...look);
    transitionRef.current.active = true;
  }, [cameraFocusRoom, selectedDeviceId, cameraResetNonce]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    onLoadProgress?.(12);
    const isSoftwareGl = detectSoftwareWebGL();
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.04;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth || 1280, container.clientHeight || 720);

    container.appendChild(renderer.domElement);
    onLoadProgress?.(30);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeef2f6);
    scene.fog = new THREE.FogExp2(0xeef2f6, 0.0085);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.72;
    pmremGenerator.dispose();
    onLoadProgress?.(48);

    const camera = new THREE.PerspectiveCamera(
      42,
      (container.clientWidth || 1280) / (container.clientHeight || 720),
      0.2,
      145,
    );
    camera.position.set(...OVERVIEW_CAMERA.position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...OVERVIEW_CAMERA.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 4.2;
    controls.maxDistance = 44;
    controls.maxPolarAngle = Math.PI * 0.45;
    controls.minPolarAngle = 0.22;
    controls.panSpeed = 0.85;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 0.95;
    controls.update();

    const onControlsStart = () => {
      transitionRef.current.active = false;
    };
    controls.addEventListener('start', onControlsStart);

    // Architectural Daylight + Balanced Interior Pools
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcbd5e1, 0.94);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff6e8, 1.45);
    sunLight.position.set(16, 22, 14);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 65;
    sunLight.shadow.camera.left = -16;
    sunLight.shadow.camera.right = 16;
    sunLight.shadow.camera.top = 18;
    sunLight.shadow.camera.bottom = -18;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    const coolBounce = new THREE.DirectionalLight(0xdbeafe, 0.48);
    coolBounce.position.set(-15, 10, -14);
    scene.add(coolBounce);

    const livingWarmLight = new THREE.PointLight(0xffedd5, 1.3, 8.5, 1.6);
    livingWarmLight.position.set(-2.6, 2.35, 2.1);
    const bedroomWarmLight = new THREE.PointLight(0xfef3c7, 1.1, 7.5, 1.6);
    bedroomWarmLight.position.set(-3.0, 2.35, -3.1);
    const kitchenWarmLight = new THREE.PointLight(0xfff7ed, 1.2, 8.0, 1.6);
    kitchenWarmLight.position.set(2.7, 2.35, -2.5);
    const officeWarmLight = new THREE.PointLight(0xfef3c7, 1.1, 8.0, 1.6);
    officeWarmLight.position.set(-8.6, 2.35, 2.0);
    const diningWarmLight = new THREE.PointLight(0xffedd5, 1.15, 8.0, 1.6);
    diningWarmLight.position.set(8.45, 2.35, -2.3);
    const garageWarmLight = new THREE.PointLight(0xf8fafc, 1.1, 8.5, 1.6);
    garageWarmLight.position.set(8.5, 2.4, 3.3);
    scene.add(
      livingWarmLight,
      bedroomWarmLight,
      kitchenWarmLight,
      officeWarmLight,
      diningWarmLight,
      garageWarmLight,
    );

    const textures = createProceduralTextures(renderer.capabilities.getMaxAnisotropy());
    const architecture = buildSmartHomeArchitecture(textures, !isSoftwareGl);
    scene.add(architecture.group);
    onLoadProgress?.(68);

    const exterior = buildExteriorAndStreet(textures, !isSoftwareGl);
    scene.add(exterior.group);
    onLoadProgress?.(82);

    // Clickable Invisible Room Floor Targets (Layer 2)
    // Order specific/smaller zones before larger backyard so raycaster picks the exact room
    const roomFloorMeshes: THREE.Mesh[] = [];
    const orderedRoomsForPick = [...ROOMS].sort((a, b) => {
      const areaA =
        (a.floorBounds.maxX - a.floorBounds.minX) * (a.floorBounds.maxZ - a.floorBounds.minZ);
      const areaB =
        (b.floorBounds.maxX - b.floorBounds.minX) * (b.floorBounds.maxZ - b.floorBounds.minZ);
      return areaA - areaB;
    });
    for (const room of orderedRoomsForPick) {
      const w = room.floorBounds.maxX - room.floorBounds.minX;
      const d = room.floorBounds.maxZ - room.floorBounds.minZ;
      const cx = (room.floorBounds.minX + room.floorBounds.maxX) / 2;
      const cz = (room.floorBounds.minZ + room.floorBounds.maxZ) / 2;
      const floorPick = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.MeshBasicMaterial({ visible: false }),
      );
      floorPick.rotation.x = -Math.PI / 2;
      floorPick.position.set(cx, room.zone === 'outdoor' ? -0.02 : 0.08, cz);
      floorPick.layers.set(2);
      floorPick.userData.roomId = room.id;
      roomFloorMeshes.push(floorPick);
      scene.add(floorPick);
    }

    const deviceHandles: DeviceVisualHandle[] = [];
    const hitboxes: THREE.Mesh[] = [];
    for (const dev of SMART_DEVICES) {
      const handle = createIoTDeviceMesh(dev, textures, !isSoftwareGl);
      deviceHandles.push(handle);
      hitboxes.push(handle.hitbox);
      scene.add(handle.root);
    }

    const routerConfig = SMART_DEVICES.find((d) => d.id === 'router_main');
    const networkGroup = new THREE.Group();
    const networkArcs: NetworkArcHandle[] = [];
    if (routerConfig) {
      const routerPos = new THREE.Vector3(...routerConfig.position);
      for (const dev of SMART_DEVICES) {
        if (dev.id === 'router_main') continue;
        const devPos = new THREE.Vector3(...dev.position);
        const mid = routerPos.clone().lerp(devPos, 0.5);
        mid.y = Math.max(routerPos.y, devPos.y) + 1.15;
        const curve = new THREE.QuadraticBezierCurve3(routerPos, mid, devPos);
        const geom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(22));
        const mat = new THREE.LineBasicMaterial({
          color: 0x315eaa,
          transparent: true,
          opacity: 0.55,
        });
        const line = new THREE.Line(geom, mat);
        networkArcs.push({ deviceId: dev.id, line, material: mat });
        networkGroup.add(line);
      }
    }
    scene.add(networkGroup);
    onLoadProgress?.(94);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const raycaster = new THREE.Raycaster();
    let hoveredDeviceId: string | null = null;
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverCheck = 0;

    const updatePointerFromEvent = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      _pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 50) return;
      lastHoverCheck = now;

      updatePointerFromEvent(e.clientX, e.clientY);
      raycaster.layers.set(1);
      raycaster.setFromCamera(_pointer, camera);
      const hits = raycaster.intersectObjects(hitboxes, false);
      const hitId = hits.length > 0 ? (hits[0].object.userData.deviceId as string) : null;
      hoveredDeviceId = hitId;
      renderer.domElement.style.cursor = hitId ? 'pointer' : 'grab';
    };

    const onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (dx * dx + dy * dy > 36) return;

      updatePointerFromEvent(e.clientX, e.clientY);
      // 1. Check IoT devices first (Layer 1)
      raycaster.layers.set(1);
      raycaster.setFromCamera(_pointer, camera);
      const devHits = raycaster.intersectObjects(hitboxes, false);
      if (devHits.length > 0) {
        const devId = devHits[0].object.userData.deviceId as string;
        useGameStore.getState().selectDevice(devId);
        return;
      }

      // 2. Fallback to clickable 3D room floor bounds (Layer 2)
      raycaster.layers.set(2);
      raycaster.setFromCamera(_pointer, camera);
      const roomHits = raycaster.intersectObjects(roomFloorMeshes, false);
      if (roomHits.length > 0) {
        const roomId = roomHits[0].object.userData.roomId as RoomId;
        useGameStore.getState().selectRoom(roomId, true);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const store = useGameStore.getState();
      if (e.key === '0' || e.key.toLowerCase() === 'r') {
        store.triggerCameraReset();
      } else if (e.key.toLowerCase() === 'm') {
        store.setActiveModal(store.activeModal === 'property_map' ? 'none' : 'property_map');
      } else if (e.key === '1') {
        store.selectRoom('living_room', true);
      } else if (e.key === '2') {
        store.selectRoom('bedroom', true);
      } else if (e.key === '3') {
        store.selectRoom('kitchen', true);
      } else if (e.key === '4') {
        store.selectRoom('exterior', true);
      } else if (e.key === '5') {
        store.selectRoom('office', true);
      } else if (e.key === '6') {
        store.selectRoom('garage', true);
      } else if (e.key === '7') {
        store.selectRoom('pool', true);
      } else if (e.key === '8') {
        store.selectRoom('street', true);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    let frameId = 0;
    let disposed = false;
    let lastQuality = '';
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const current = stateRef.current;

      // Apply 3-tier Graphics Quality (low / medium / high)
      if (!isSoftwareGl && current.graphicsQuality !== lastQuality) {
        lastQuality = current.graphicsQuality;
        if (current.graphicsQuality === 'low') {
          renderer.setPixelRatio(1);
          renderer.shadowMap.enabled = false;
          sunLight.castShadow = false;
          livingWarmLight.visible = false;
          bedroomWarmLight.visible = false;
          kitchenWarmLight.visible = false;
          officeWarmLight.visible = false;
          diningWarmLight.visible = false;
          garageWarmLight.visible = false;
        } else if (current.graphicsQuality === 'medium') {
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          renderer.shadowMap.enabled = true;
          sunLight.castShadow = true;
          livingWarmLight.visible = true;
          bedroomWarmLight.visible = false;
          kitchenWarmLight.visible = true;
          officeWarmLight.visible = false;
          diningWarmLight.visible = false;
          garageWarmLight.visible = false;
        } else {
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          renderer.shadowMap.enabled = true;
          sunLight.castShadow = true;
          livingWarmLight.visible = true;
          bedroomWarmLight.visible = true;
          kitchenWarmLight.visible = true;
          officeWarmLight.visible = true;
          diningWarmLight.visible = true;
          garageWarmLight.visible = true;
        }
      }

      if (transitionRef.current.active) {
        if (current.reducedMotion || isSoftwareGl) {
          camera.position.copy(transitionRef.current.pos);
          controls.target.copy(transitionRef.current.look);
          transitionRef.current.active = false;
        } else {
          const lambda = 5.5;
          _camTargetPos.copy(transitionRef.current.pos);
          _camTargetLook.copy(transitionRef.current.look);
          camera.position.x = THREE.MathUtils.damp(camera.position.x, _camTargetPos.x, lambda, delta);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, _camTargetPos.y, lambda, delta);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, _camTargetPos.z, lambda, delta);
          controls.target.x = THREE.MathUtils.damp(controls.target.x, _camTargetLook.x, lambda, delta);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, _camTargetLook.y, lambda, delta);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, _camTargetLook.z, lambda, delta);

          if (
            camera.position.distanceTo(_camTargetPos) < 0.06 &&
            controls.target.distanceTo(_camTargetLook) < 0.04
          ) {
            transitionRef.current.active = false;
          }
        }
      }

      // Expanded property orbit bounds (interior + backyard + pool + public street)
      controls.target.x = THREE.MathUtils.clamp(controls.target.x, -16.0, 16.0);
      controls.target.y = THREE.MathUtils.clamp(controls.target.y, 0.25, 3.4);
      controls.target.z = THREE.MathUtils.clamp(controls.target.z, -18.5, 15.5);
      controls.update();

      // Update traffic vehicles & water ripples
      exterior.updateTraffic(delta, elapsed, current.reducedMotion);
      if (
        current.soundEnabled &&
        !current.reducedMotion &&
        current.cameraFocusRoom === 'street'
      ) {
        for (let vi = 0; vi < exterior.vehicles.length; vi++) {
          if (Math.abs(exterior.vehicles[vi].x) < 1.1) {
            soundEngine.playPassingCar();
            break;
          }
        }
      }

      // Update all 33 IoT device visuals
      for (let i = 0; i < deviceHandles.length; i++) {
        const handle = deviceHandles[i];
        const cfg = SMART_DEVICES[i];
        const runtime = current.deviceStates[handle.deviceId];
        const status: DeviceSecurityStatus = runtime?.status ?? 'uninspected';
        updateDeviceVisualState(
          handle,
          status,
          cfg.challenge?.threat.severity,
          current.selectedDeviceId === handle.deviceId,
          hoveredDeviceId === handle.deviceId,
          current.showVulnerabilityOverlay,
          elapsed,
          current.reducedMotion,
        );
      }

      networkGroup.visible = current.showNetworkLinks;
      if (current.showNetworkLinks) {
        const routerStatus = current.deviceStates['router_main']?.status ?? 'uninspected';
        for (const arc of networkArcs) {
          const devStatus = current.deviceStates[arc.deviceId]?.status ?? 'uninspected';
          const effectiveStatus =
            routerStatus === 'vulnerable' && devStatus !== 'protected'
              ? 'vulnerable'
              : devStatus;
          arc.material.color.setHex(getArcColor(effectiveStatus));
          arc.material.opacity =
            current.selectedDeviceId === arc.deviceId || current.selectedDeviceId === 'router_main'
              ? 0.92
              : 0.45;
        }
      }

      if (!current.reducedMotion) {
        architecture.fireplaceGlowMat.emissiveIntensity = 1.2 + Math.sin(elapsed * 5.0) * 0.18;
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    onLoadProgress?.(100);
    onLoaded?.();
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      controls.removeEventListener('start', onControlsStart);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
      textures.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#eef2f6]">
      <div
        ref={mountRef}
        className="h-full w-full"
        aria-label="Cenário tridimensional arquitetônico expandido da Smart Home"
      />
      {contextLost && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#F5F6F8]/95 p-6 text-center">
          <div className="max-w-md rounded-xl border border-[#E9EDF2] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#18212F]">Contexto WebGL pausado</h3>
            <p className="mt-2 text-sm text-[#64748B]">
              O navegador suspendeu a renderização 3D temporariamente. Aguarde a restauração
              automática ou recarregue a visualização.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
