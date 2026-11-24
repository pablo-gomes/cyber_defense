import * as THREE from 'three';
import { DeviceSecurityStatus, SeverityLevel, SmartDeviceConfig } from '../types/game';
import { ProceduralTextureSet } from './proceduralTextures';

export interface DeviceVisualHandle {
  deviceId: string;
  kind: SmartDeviceConfig['kind'];
  root: THREE.Group;
  hitbox: THREE.Mesh;
  ledMat: THREE.MeshStandardMaterial;
  ringMesh: THREE.Mesh;
  ringMat: THREE.MeshBasicMaterial;
  beaconMesh: THREE.Mesh;
  beaconMat: THREE.MeshStandardMaterial;
  selectReticle: THREE.Mesh;
  anchorWorldPos: THREE.Vector3;
}

const COLOR_UNINSPECTED = new THREE.Color(0x315eaa);
const COLOR_INVESTIGATING = new THREE.Color(0x315eaa);
const COLOR_ATTENTION = new THREE.Color(0xd99b27);
const COLOR_VULNERABLE = new THREE.Color(0xd94a4a);
const COLOR_PROTECTED = new THREE.Color(0x239b69);

export function createIoTDeviceMesh(
  config: SmartDeviceConfig,
  textures: ProceduralTextureSet,
  castShadows: boolean,
): DeviceVisualHandle {
  const root = new THREE.Group();
  root.name = `device-${config.id}`;
  root.position.set(...config.position);
  if (config.rotationY) {
    root.rotation.y = config.rotationY;
  }

  const matteAnthracite = new THREE.MeshStandardMaterial({
    color: 0x262f3d,
    roughness: 0.65,
    metalness: 0.18,
  });
  const matteCeramic = new THREE.MeshStandardMaterial({
    color: 0xf4f3ef,
    roughness: 0.42,
    metalness: 0.04,
  });
  const brushedAluminum = new THREE.MeshStandardMaterial({
    color: 0xb6bec9,
    roughness: 0.24,
    metalness: 0.88,
  });
  const walnutMat = new THREE.MeshStandardMaterial({
    color: 0x8f6b4b,
    roughness: 0.48,
    metalness: 0.06,
  });
  const lensGlass = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    roughness: 0.06,
    metalness: 0.12,
    clearcoat: 1.0,
    transmission: castShadows ? 0.22 : 0,
  });
  const ledMat = new THREE.MeshStandardMaterial({
    color: 0x315eaa,
    emissive: 0x315eaa,
    emissiveIntensity: 1.2,
    roughness: 0.2,
  });

  const modelGroup = new THREE.Group();
  let beaconY = 0.58;
  let ringY = -0.35;
  let ringScale = 0.72;
  let hitboxSize: [number, number, number] = [0.85, 0.85, 0.85];

  switch (config.kind) {
    case 'camera': {
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.12, 0.05, 18),
        brushedAluminum,
      );
      base.rotation.x = Math.PI / 2;
      base.position.set(0, 0, -0.14);

      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.2, 12),
        matteAnthracite,
      );
      arm.rotation.x = Math.PI / 2;
      arm.position.set(0, 0, -0.04);

      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.12, 0.28, 20),
        matteCeramic,
      );
      body.rotation.x = Math.PI / 2;
      body.position.set(0, 0, 0.11);

      const hood = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.05, 0.12),
        matteAnthracite,
      );
      hood.position.set(0, 0.11, 0.2);

      const lensRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.08, 0.015, 10, 22),
        brushedAluminum,
      );
      lensRing.position.set(0, 0, 0.255);

      const lens = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), lensGlass);
      lens.scale.z = 0.45;
      lens.position.set(0, 0, 0.235);

      const led = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 10), ledMat);
      led.position.set(0.06, 0.055, 0.245);

      modelGroup.add(base, arm, body, hood, lensRing, lens, led);
      beaconY = 0.38;
      ringY = -0.24;
      ringScale = 0.62;
      hitboxSize = [0.75, 0.75, 0.85];
      break;
    }

    case 'router': {
      const chassis = new THREE.Mesh(
        new THREE.BoxGeometry(0.56, 0.09, 0.32),
        matteAnthracite,
      );
      const topPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.02, 0.26),
        brushedAluminum,
      );
      topPlate.position.y = 0.055;
      const ledBar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.016, 0.025), ledMat);
      ledBar.position.set(0, 0.015, 0.165);
      modelGroup.add(chassis, topPlate, ledBar);

      [-0.2, -0.07, 0.07, 0.2].forEach((ax, idx) => {
        const ant = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.016, 0.32, 10),
          matteAnthracite,
        );
        ant.position.set(ax, 0.18, -0.12);
        ant.rotation.z = (idx - 1.5) * 0.07;
        ant.rotation.x = -0.12;
        modelGroup.add(ant);
      });
      beaconY = 0.56;
      ringY = -0.04;
      ringScale = 0.82;
      hitboxSize = [0.9, 0.75, 0.75];
      break;
    }

    case 'speaker': {
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.17, 0.04, 24),
        matteAnthracite,
      );
      base.position.y = -0.13;
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.155, 0.17, 0.26, 24),
        new THREE.MeshStandardMaterial({
          map: textures.fabric,
          normalMap: textures.fabricNormal,
          color: 0xd9d5cd,
          roughness: 0.9,
        }),
      );
      const topCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.145, 0.155, 0.03, 24),
        brushedAluminum,
      );
      topCap.position.y = 0.145;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 10, 24), ledMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.162;

      modelGroup.add(base, body, topCap, ring);
      beaconY = 0.44;
      ringY = -0.15;
      ringScale = 0.62;
      hitboxSize = [0.7, 0.75, 0.7];
      break;
    }

    case 'tv': {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(2.12, 1.18, 0.055), matteAnthracite);
      const screenMat = new THREE.MeshStandardMaterial({
        map: textures.tvScreen,
        emissiveMap: textures.tvScreen,
        emissive: 0xffffff,
        emissiveIntensity: 0.32,
        roughness: 0.12,
        metalness: 0.06,
      });
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.02, 1.08), screenMat);
      screen.position.z = 0.03;
      const soundbar = new THREE.Mesh(
        new THREE.BoxGeometry(1.25, 0.075, 0.09),
        matteAnthracite,
      );
      soundbar.position.set(0, -0.68, 0.035);
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.015), ledMat);
      led.position.set(0, -0.575, 0.035);

      modelGroup.add(frame, screen, soundbar, led);
      beaconY = 0.82;
      ringY = -0.78;
      ringScale = 1.1;
      hitboxSize = [2.2, 1.4, 0.65];
      break;
    }

    case 'lighting': {
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.16, 0.035, 22),
        brushedAluminum,
      );
      base.position.y = -0.22;
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.022, 0.28, 12),
        brushedAluminum,
      );
      stem.position.y = -0.06;
      const shade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.19, 0.22, 22),
        new THREE.MeshStandardMaterial({
          color: 0xfef7ec,
          emissive: 0xfde68a,
          emissiveIntensity: 0.55,
          roughness: 0.5,
        }),
      );
      shade.position.y = 0.13;
      const smartRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.055, 0.011, 10, 20),
        ledMat,
      );
      smartRing.rotation.x = Math.PI / 2;
      smartRing.position.y = -0.19;

      modelGroup.add(base, stem, shade, smartRing);
      beaconY = 0.5;
      ringY = -0.24;
      ringScale = 0.64;
      hitboxSize = [0.7, 0.85, 0.7];
      break;
    }

    case 'thermostat': {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.035), matteCeramic);
      const bezel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.115, 0.115, 0.05, 24),
        brushedAluminum,
      );
      bezel.rotation.x = Math.PI / 2;
      bezel.position.z = 0.035;
      const face = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.055, 24), lensGlass);
      face.rotation.x = Math.PI / 2;
      face.position.z = 0.038;
      const glowRing = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.01, 10, 24), ledMat);
      glowRing.position.z = 0.068;

      modelGroup.add(plate, bezel, face, glowRing);
      beaconY = 0.36;
      ringY = -0.24;
      ringScale = 0.58;
      hitboxSize = [0.65, 0.65, 0.55];
      break;
    }

    case 'assistant': {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.05, 0.16), matteAnthracite);
      base.position.y = -0.075;
      const display = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.035), matteCeramic);
      display.rotation.x = -0.28;
      display.position.y = 0.03;
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.23, 0.14), lensGlass);
      screen.rotation.x = -0.28;
      screen.position.set(0, 0.034, 0.022);
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.012, 0.012), ledMat);
      led.position.set(0, -0.052, 0.082);

      modelGroup.add(base, display, screen, led);
      beaconY = 0.38;
      ringY = -0.1;
      ringScale = 0.58;
      hitboxSize = [0.65, 0.65, 0.65];
      break;
    }

    case 'fridge': {
      const cabinet = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, 2.08, 0.78),
        brushedAluminum,
      );
      const leftDoor = new THREE.Mesh(
        new THREE.BoxGeometry(0.455, 2.0, 0.05),
        brushedAluminum,
      );
      leftDoor.position.set(-0.235, 0, 0.41);
      const rightDoor = new THREE.Mesh(
        new THREE.BoxGeometry(0.455, 2.0, 0.05),
        brushedAluminum,
      );
      rightDoor.position.set(0.235, 0, 0.41);

      const handleL = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.85, 10),
        matteAnthracite,
      );
      handleL.position.set(-0.055, 0.1, 0.455);
      const handleR = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.85, 10),
        matteAnthracite,
      );
      handleR.position.set(0.055, 0.1, 0.455);

      const screenMat = new THREE.MeshStandardMaterial({
        map: textures.fridgeScreen,
        emissiveMap: textures.fridgeScreen,
        emissive: 0xffffff,
        emissiveIntensity: 0.35,
        roughness: 0.18,
      });
      const touchScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.34), screenMat);
      touchScreen.position.set(0.24, 0.25, 0.44);

      const led = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.018, 0.015), ledMat);
      led.position.set(0.24, 0.48, 0.44);

      modelGroup.add(cabinet, leftDoor, rightDoor, handleL, handleR, touchScreen, led);
      beaconY = 1.28;
      ringY = -1.02;
      ringScale = 1.2;
      hitboxSize = [1.15, 2.15, 1.0];
      break;
    }

    case 'smoke_sensor':
    case 'co_sensor': {
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.22, 0.05, 24),
        matteCeramic,
      );
      const inner = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.065, 20),
        config.kind === 'co_sensor' ? matteAnthracite : brushedAluminum,
      );
      const grille = new THREE.Mesh(
        new THREE.TorusGeometry(0.155, 0.01, 8, 22),
        brushedAluminum,
      );
      grille.rotation.x = Math.PI / 2;
      grille.position.y = -0.02;
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), ledMat);
      led.position.set(0.09, -0.032, 0.05);

      modelGroup.add(base, inner, grille, led);
      beaconY = -0.32;
      ringY = -0.06;
      ringScale = 0.62;
      hitboxSize = [0.75, 0.55, 0.75];
      break;
    }

    case 'smart_lock': {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.4, 0.045), matteAnthracite);
      const keypad = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.15, 0.05), lensGlass);
      keypad.position.y = 0.08;
      const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.032, 0.038),
        brushedAluminum,
      );
      handle.position.set(0.065, -0.085, 0.045);
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.016, 0.012), ledMat);
      led.position.set(0, 0.17, 0.028);

      modelGroup.add(plate, keypad, handle, led);
      beaconY = 0.42;
      ringY = -0.55;
      ringScale = 0.72;
      hitboxSize = [0.65, 0.85, 0.55];
      break;
    }

    case 'motion_sensor': {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.05, 0.84, 14),
        matteAnthracite,
      );
      post.position.y = -0.45;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.16), matteCeramic);
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.078, 16, 12),
        new THREE.MeshStandardMaterial({ color: 0xede9e1, roughness: 0.35 }),
      );
      dome.position.z = 0.072;
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 10), ledMat);
      led.position.set(0, 0.085, 0.082);

      modelGroup.add(post, head, dome, led);
      beaconY = 0.38;
      ringY = -0.88;
      ringScale = 0.72;
      hitboxSize = [0.75, 1.1, 0.75];
      break;
    }

    case 'doorbell': {
      const backplate = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.32, 0.04), matteAnthracite);
      const trim = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.29, 0.045), brushedAluminum);
      const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.03, 16), lensGlass);
      camLens.rotation.x = Math.PI / 2;
      camLens.position.set(0, 0.07, 0.024);
      const buttonRing = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.008, 8, 20), ledMat);
      buttonRing.position.set(0, -0.06, 0.028);
      const buttonCenter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.024, 0.02, 16),
        matteCeramic,
      );
      buttonCenter.rotation.x = Math.PI / 2;
      buttonCenter.position.set(0, -0.06, 0.022);
      modelGroup.add(backplate, trim, camLens, buttonRing, buttonCenter);
      beaconY = 0.34;
      ringY = -0.45;
      ringScale = 0.58;
      hitboxSize = [0.55, 0.7, 0.55];
      break;
    }

    case 'alarm_hub': {
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.26, 0.05), matteCeramic);
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.17), lensGlass);
      screen.position.set(0, 0.015, 0.027);
      const keypadStrip = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.035, 0.01),
        brushedAluminum,
      );
      keypadStrip.position.set(0, -0.095, 0.026);
      const statusBar = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.016, 0.012), ledMat);
      statusBar.position.set(0, 0.112, 0.027);
      modelGroup.add(chassis, screen, keypadStrip, statusBar);
      beaconY = 0.34;
      ringY = -0.35;
      ringScale = 0.64;
      hitboxSize = [0.7, 0.65, 0.55];
      break;
    }

    case 'ac_unit': {
      const unitBody = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.34, 0.26), matteCeramic);
      const frontAccent = new THREE.Mesh(
        new THREE.BoxGeometry(1.14, 0.06, 0.02),
        brushedAluminum,
      );
      frontAccent.position.set(0, -0.08, 0.13);
      const louver = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.03, 0.04), matteAnthracite);
      louver.position.set(0, -0.14, 0.11);
      louver.rotation.x = 0.35;
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.016, 0.015), ledMat);
      led.position.set(0.42, 0.08, 0.135);
      modelGroup.add(unitBody, frontAccent, louver, led);
      beaconY = 0.36;
      ringY = -0.38;
      ringScale = 0.85;
      hitboxSize = [1.3, 0.6, 0.55];
      break;
    }

    case 'smart_outlet': {
      const wallPlate = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.24, 0.03), matteCeramic);
      const plugBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.062, 0.062, 0.075, 20),
        matteCeramic,
      );
      plugBody.rotation.x = Math.PI / 2;
      plugBody.position.z = 0.04;
      const socketFace = new THREE.Mesh(
        new THREE.CylinderGeometry(0.048, 0.048, 0.02, 18),
        matteAnthracite,
      );
      socketFace.rotation.x = Math.PI / 2;
      socketFace.position.z = 0.072;
      const ledRing = new THREE.Mesh(new THREE.TorusGeometry(0.056, 0.008, 8, 20), ledMat);
      ledRing.position.z = 0.08;
      modelGroup.add(wallPlate, plugBody, socketFace, ledRing);
      beaconY = 0.3;
      ringY = -0.3;
      ringScale = 0.52;
      hitboxSize = [0.55, 0.6, 0.55];
      break;
    }

    case 'pc_workstation': {
      const screenMat = new THREE.MeshStandardMaterial({
        map: textures.monitorScreen,
        emissiveMap: textures.monitorScreen,
        emissive: 0xffffff,
        emissiveIntensity: 0.38,
        roughness: 0.14,
      });
      // Dual curved-feel monitors + stands + desktop tower + keyboard + mouse
      [-0.36, 0.36].forEach((mx, idx) => {
        const monGroup = new THREE.Group();
        monGroup.position.set(mx, 0.28, -0.14);
        monGroup.rotation.y = idx === 0 ? 0.16 : -0.16;
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.4, 0.03), matteAnthracite);
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.61, 0.35), screenMat);
        scr.position.z = 0.017;
        const neck = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.04), brushedAluminum);
        neck.position.set(0, -0.22, -0.02);
        const stand = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.16), brushedAluminum);
        stand.position.set(0, -0.32, 0.01);
        monGroup.add(frame, scr, neck, stand);
        modelGroup.add(monGroup);
      });
      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.46, 0.44), matteAnthracite);
      tower.position.set(0.86, 0.19, -0.05);
      const towerLed = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.34, 0.02), ledMat);
      towerLed.position.set(0.76, 0.19, 0.175);
      const kbd = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.02, 0.15), matteAnthracite);
      kbd.position.set(-0.05, -0.03, 0.18);
      const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.025, 0.11), brushedAluminum);
      mouse.position.set(0.28, -0.03, 0.18);
      modelGroup.add(tower, towerLed, kbd, mouse);
      beaconY = 0.72;
      ringY = -0.05;
      ringScale = 1.15;
      hitboxSize = [1.85, 0.85, 0.85];
      break;
    }

    case 'printer': {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.24, 0.42), matteCeramic);
      const topScanner = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.38), matteAnthracite);
      topScanner.position.y = 0.14;
      const tray = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 0.18), brushedAluminum);
      tray.position.set(0, -0.07, 0.24);
      const paper = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.01, 0.14), matteCeramic);
      paper.position.set(0, -0.055, 0.25);
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.016, 0.015), ledMat);
      led.position.set(0.16, 0.08, 0.215);
      modelGroup.add(body, topScanner, tray, paper, led);
      beaconY = 0.42;
      ringY = -0.14;
      ringScale = 0.72;
      hitboxSize = [0.75, 0.65, 0.75];
      break;
    }

    case 'washer': {
      // Side-by-side smart washer & dryer stack/pair
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.92, 0.66), matteCeramic);
      const topPanel = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 0.66), matteAnthracite);
      topPanel.position.y = 0.39;
      const drumRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.028, 12, 24),
        brushedAluminum,
      );
      drumRing.position.set(0, -0.04, 0.335);
      const drumGlass = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.04, 22),
        lensGlass,
      );
      drumGlass.rotation.x = Math.PI / 2;
      drumGlass.position.set(0, -0.04, 0.325);
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.025, 0.02), ledMat);
      led.position.set(0.12, 0.4, 0.335);
      modelGroup.add(body, topPanel, drumRing, drumGlass, led);
      beaconY = 0.76;
      ringY = -0.46;
      ringScale = 0.95;
      hitboxSize = [0.95, 1.1, 0.9];
      break;
    }

    case 'garage_gate': {
      // Overhead sectional motorized garage door + motor controller box
      const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.25, 0.1), matteAnthracite);
      for (let p = 0; p < 4; p++) {
        const panel = new THREE.Mesh(
          new THREE.BoxGeometry(3.42, 0.48, 0.12),
          walnutMat,
        );
        panel.position.set(0, -0.8 + p * 0.54, 0.01);
        modelGroup.add(panel);
      }
      const ctrlBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.1), brushedAluminum);
      ctrlBox.position.set(-1.95, -0.1, 0.08);
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.025, 0.02), ledMat);
      led.position.set(-1.95, 0.0, 0.14);
      modelGroup.add(doorFrame, ctrlBox, led);
      beaconY = 1.45;
      ringY = -1.12;
      ringScale = 1.6;
      hitboxSize = [3.8, 2.35, 0.75];
      break;
    }

    case 'ev_charger': {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.48, 0.14), matteCeramic);
      const accent = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.38, 0.03), matteAnthracite);
      accent.position.z = 0.07;
      const led = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 20), ledMat);
      led.position.set(0, 0.06, 0.09);
      const cableLoop = new THREE.Mesh(
        new THREE.TorusGeometry(0.14, 0.018, 8, 20),
        matteAnthracite,
      );
      cableLoop.position.set(0, -0.32, 0.04);
      modelGroup.add(box, accent, led, cableLoop);
      beaconY = 0.46;
      ringY = -0.65;
      ringScale = 0.7;
      hitboxSize = [0.7, 0.9, 0.6];
      break;
    }

    case 'irrigation': {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.38, 0.14), matteCeramic);
      const lid = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.3, 0.02), brushedAluminum);
      lid.position.z = 0.072;
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.024, 0.55, 10),
        matteAnthracite,
      );
      pipe.position.set(0, -0.4, 0);
      const valve = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.08, 12),
        brushedAluminum,
      );
      valve.position.set(0.08, -0.45, 0);
      valve.rotation.z = Math.PI / 2;
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 10), ledMat);
      led.position.set(0.08, 0.09, 0.088);
      modelGroup.add(box, lid, pipe, valve, led);
      beaconY = 0.42;
      ringY = -0.65;
      ringScale = 0.68;
      hitboxSize = [0.7, 0.95, 0.6];
      break;
    }

    case 'weather_station': {
      const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.036, 1.35, 12),
        brushedAluminum,
      );
      mast.position.y = -0.35;
      const sensorPod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.2, 16),
        matteCeramic,
      );
      sensorPod.position.y = 0.18;
      const crossArm = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.025, 0.025), brushedAluminum);
      crossArm.position.y = 0.36;
      const anemometer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12),
        matteAnthracite,
      );
      anemometer.position.set(-0.2, 0.4, 0);
      const rainCup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.05, 0.1, 14),
        matteCeramic,
      );
      rainCup.position.set(0.2, 0.41, 0);
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 10), ledMat);
      led.position.set(0, 0.2, 0.115);
      modelGroup.add(mast, sensorPod, crossArm, anemometer, rainCup, led);
      beaconY = 0.68;
      ringY = -1.0;
      ringScale = 0.72;
      hitboxSize = [0.8, 1.5, 0.8];
      break;
    }

    case 'robot_mower': {
      const shell = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.36, 0.16, 20),
        matteAnthracite,
      );
      shell.scale.z = 1.25;
      const topHood = new THREE.Mesh(
        new THREE.CylinderGeometry(0.26, 0.3, 0.06, 20),
        new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.35, metalness: 0.2 }),
      );
      topHood.scale.z = 1.2;
      topHood.position.y = 0.08;
      const bumper = new THREE.Mesh(
        new THREE.TorusGeometry(0.34, 0.024, 8, 22),
        brushedAluminum,
      );
      bumper.rotation.x = Math.PI / 2;
      bumper.scale.y = 1.25;
      bumper.position.y = -0.02;
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.03), ledMat);
      led.position.set(0, 0.115, 0.14);
      modelGroup.add(shell, topHood, bumper, led);
      beaconY = 0.42;
      ringY = -0.08;
      ringScale = 0.85;
      hitboxSize = [0.9, 0.55, 1.0];
      break;
    }

    case 'pool_controller': {
      const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.56, 0.2), matteCeramic);
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.03), lensGlass);
      panel.position.set(0, 0.08, 0.1);
      const dial = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.03, 18),
        brushedAluminum,
      );
      dial.rotation.x = Math.PI / 2;
      dial.position.set(0, -0.1, 0.105);
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.015), ledMat);
      led.position.set(0, 0.22, 0.105);
      modelGroup.add(cabinet, panel, dial, led);
      beaconY = 0.52;
      ringY = -0.35;
      ringScale = 0.72;
      hitboxSize = [0.75, 0.85, 0.6];
      break;
    }

    case 'water_leak':
    case 'humidity_sensor': {
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.13, 0.05, 20),
        matteCeramic,
      );
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.09, 0.02, 18),
        config.kind === 'water_leak' ? brushedAluminum : matteAnthracite,
      );
      cap.position.y = 0.03;
      const led = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.008, 8, 20), ledMat);
      led.rotation.x = Math.PI / 2;
      led.position.y = 0.042;
      modelGroup.add(disc, cap, led);
      beaconY = 0.34;
      ringY = -0.04;
      ringScale = 0.52;
      hitboxSize = [0.55, 0.55, 0.55];
      break;
    }

    case 'sensor_presence':
    case 'sensor_temp':
    case 'door_sensor': {
      const pod = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.07), matteCeramic);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), lensGlass);
      eye.position.set(0, 0.02, 0.032);
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.014, 0.012), ledMat);
      led.position.set(0, -0.06, 0.038);
      modelGroup.add(pod, eye, led);
      beaconY = 0.32;
      ringY = -0.25;
      ringScale = 0.52;
      hitboxSize = [0.55, 0.6, 0.55];
      break;
    }

    default: {
      modelGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), matteCeramic));
    }
  }

  modelGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = castShadows;
      child.receiveShadow = true;
    }
  });
  root.add(modelGroup);

  const ringMat = new THREE.MeshBasicMaterial({
    map: textures.holoRing,
    color: COLOR_UNINSPECTED.clone(),
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const ringMesh = new THREE.Mesh(new THREE.PlaneGeometry(ringScale, ringScale), ringMat);
  ringMesh.rotation.x = -Math.PI / 2;
  ringMesh.position.y = ringY;
  root.add(ringMesh);

  const beaconMat = new THREE.MeshStandardMaterial({
    color: COLOR_UNINSPECTED.clone(),
    emissive: COLOR_UNINSPECTED.clone(),
    emissiveIntensity: 0.65,
    roughness: 0.25,
    metalness: 0.2,
  });
  const beaconMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.085, 0), beaconMat);
  beaconMesh.position.y = beaconY;
  beaconMesh.userData.baseY = beaconY;
  root.add(beaconMesh);

  const selectReticle = new THREE.Mesh(
    new THREE.RingGeometry(ringScale * 0.56, ringScale * 0.64, 32),
    new THREE.MeshBasicMaterial({
      color: 0x315eaa,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  selectReticle.rotation.x = -Math.PI / 2;
  selectReticle.position.y = ringY + 0.012;
  selectReticle.visible = false;
  root.add(selectReticle);

  const hitbox = new THREE.Mesh(
    new THREE.BoxGeometry(...hitboxSize),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  hitbox.layers.set(1);
  hitbox.userData.deviceId = config.id;
  root.add(hitbox);

  return {
    deviceId: config.id,
    kind: config.kind,
    root,
    hitbox,
    ledMat,
    ringMesh,
    ringMat,
    beaconMesh,
    beaconMat,
    selectReticle,
    anchorWorldPos: new THREE.Vector3(...config.position),
  };
}

export function updateDeviceVisualState(
  handle: DeviceVisualHandle,
  status: DeviceSecurityStatus,
  severity: SeverityLevel | undefined,
  isSelected: boolean,
  isHovered: boolean,
  showOverlay: boolean,
  elapsedTime: number,
  reducedMotion: boolean,
) {
  let targetColor = COLOR_UNINSPECTED;
  if (status === 'protected') {
    targetColor = COLOR_PROTECTED;
  } else if (status === 'partial' || status === 'investigating') {
    targetColor = status === 'partial' ? COLOR_ATTENTION : COLOR_INVESTIGATING;
  } else if (status === 'vulnerable') {
    if (severity === 'ALTO' || severity === 'MÉDIO') {
      targetColor = COLOR_VULNERABLE;
    } else {
      targetColor = COLOR_ATTENTION;
    }
  } else {
    targetColor = COLOR_UNINSPECTED;
  }

  handle.ledMat.color.copy(targetColor);
  handle.ledMat.emissive.copy(targetColor);
  handle.ringMat.color.copy(targetColor);
  handle.beaconMat.color.copy(targetColor);
  handle.beaconMat.emissive.copy(targetColor);

  const showIndicators = showOverlay || isSelected || isHovered;
  handle.ringMesh.visible = showIndicators;
  handle.beaconMesh.visible = showIndicators;

  handle.selectReticle.visible = isSelected || isHovered;
  const reticleMat = handle.selectReticle.material as THREE.MeshBasicMaterial;
  reticleMat.color.setHex(isSelected ? 0x315eaa : 0x64748b);
  reticleMat.opacity = isSelected ? 0.92 : 0.5;

  // Subtle autonomous lawn patrol animation for the robot mower when not selected
  if (handle.kind === 'robot_mower' && !reducedMotion && !isSelected) {
    const t = elapsedTime * 0.28;
    const nextX = handle.anchorWorldPos.x + Math.sin(t) * 1.45;
    const nextZ = handle.anchorWorldPos.z + Math.cos(t * 0.85) * 1.1;
    const dx = Math.cos(t) * 1.45 * 0.28;
    const dz = -Math.sin(t * 0.85) * 1.1 * 0.28 * 0.85;
    handle.root.position.set(nextX, handle.anchorWorldPos.y, nextZ);
    handle.root.rotation.y = Math.atan2(dx, dz);
  }

  const baseY = (handle.beaconMesh.userData.baseY as number) ?? 0.55;
  if (!reducedMotion && showIndicators) {
    const bob = Math.sin(elapsedTime * 2.0 + handle.anchorWorldPos.x) * 0.03;
    handle.beaconMesh.position.y = baseY + bob;
    handle.beaconMesh.rotation.y = elapsedTime * 1.1;
    handle.ringMat.opacity = isSelected ? 0.9 : status === 'protected' ? 0.48 : 0.72;
  } else {
    handle.beaconMesh.position.y = baseY;
    handle.ringMat.opacity = isSelected ? 0.9 : 0.6;
  }
}
