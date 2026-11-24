import * as THREE from 'three';
import { ProceduralTextureSet } from './proceduralTextures';

export interface HouseBuildResult {
  group: THREE.Group;
  fireplaceGlowMat: THREE.MeshStandardMaterial;
  roomSpotMat: THREE.MeshStandardMaterial;
}

export function createRoundedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  radius = 0.04,
): THREE.ExtrudeGeometry {
  const w = Math.max(0.02, width - radius * 2);
  const h = Math.max(0.02, height - radius * 2);
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, -h / 2 - radius);
  shape.lineTo(w / 2, -h / 2 - radius);
  shape.quadraticCurveTo(w / 2 + radius, -h / 2 - radius, w / 2 + radius, -h / 2);
  shape.lineTo(w / 2 + radius, h / 2);
  shape.quadraticCurveTo(w / 2 + radius, h / 2 + radius, w / 2, h / 2 + radius);
  shape.lineTo(-w / 2, h / 2 + radius);
  shape.quadraticCurveTo(-w / 2 - radius, h / 2 + radius, -w / 2 - radius, h / 2);
  shape.lineTo(-w / 2 - radius, -h / 2);
  shape.quadraticCurveTo(-w / 2 - radius, -h / 2 - radius, -w / 2, -h / 2 - radius);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.01, depth - radius * 2),
    bevelEnabled: true,
    bevelThickness: radius,
    bevelSize: radius,
    bevelSegments: 2,
    curveSegments: 6,
  });
  geom.center();
  return geom;
}

export function createCeramicVase(
  height: number,
  maxRadius: number,
  color: number,
): THREE.Mesh {
  const pts = [
    new THREE.Vector2(0.0, 0),
    new THREE.Vector2(maxRadius * 0.65, 0),
    new THREE.Vector2(maxRadius, height * 0.38),
    new THREE.Vector2(maxRadius * 0.72, height * 0.78),
    new THREE.Vector2(maxRadius * 0.45, height),
    new THREE.Vector2(maxRadius * 0.36, height),
  ];
  const geom = new THREE.LatheGeometry(pts, 20);
  return new THREE.Mesh(
    geom,
    new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.05 }),
  );
}

export function createOrganicPlant(
  x: number,
  y: number,
  z: number,
  scale = 1,
  potColor = 0xd6cfc2,
  castShadow = true,
): THREE.Group {
  const plant = new THREE.Group();
  plant.position.set(x, y, z);

  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22 * scale, 0.17 * scale, 0.34 * scale, 16),
    new THREE.MeshStandardMaterial({ color: potColor, roughness: 0.68, metalness: 0.04 }),
  );
  pot.position.y = 0.17 * scale;
  pot.castShadow = castShadow;
  pot.receiveShadow = true;

  const soil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.195 * scale, 0.195 * scale, 0.04 * scale, 14),
    new THREE.MeshStandardMaterial({ color: 0x4b3b2c, roughness: 0.95 }),
  );
  soil.position.y = 0.32 * scale;

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022 * scale, 0.036 * scale, 0.56 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x6b4f3a, roughness: 0.88 }),
  );
  stem.position.y = 0.56 * scale;

  const leafShades = [0x4c7c59, 0x5c8f68, 0x3f6b4b, 0x679c73];
  const clusters: Array<[number, number, number, number]> = [
    [0, 0.88, 0, 0.23],
    [0.14, 0.78, 0.09, 0.17],
    [-0.14, 0.8, -0.08, 0.18],
    [0.05, 1.04, -0.06, 0.15],
    [-0.06, 0.96, 0.12, 0.14],
  ];
  clusters.forEach(([cx, cy, cz, r], i) => {
    const leaf = new THREE.Mesh(
      new THREE.DodecahedronGeometry(r * scale, 1),
      new THREE.MeshStandardMaterial({
        color: leafShades[i % leafShades.length],
        roughness: 0.78,
        metalness: 0.02,
      }),
    );
    leaf.position.set(cx * scale, cy * scale, cz * scale);
    leaf.scale.y = 0.82;
    leaf.castShadow = castShadow;
    plant.add(leaf);
  });

  plant.add(pot, soil, stem);
  return plant;
}

function createCurtainSet(
  width: number,
  height: number,
  mat: THREE.Material,
  rodMat: THREE.Material,
): THREE.Group {
  const g = new THREE.Group();
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, width + 0.35, 10), rodMat);
  rod.rotation.z = Math.PI / 2;
  rod.position.y = height / 2 + 0.06;
  g.add(rod);

  const panelWidth = width * 0.24;
  [-width / 2 + panelWidth * 0.35, width / 2 - panelWidth * 0.35].forEach((px) => {
    for (let p = -1; p <= 1; p++) {
      const fold = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.055, height, 10),
        mat,
      );
      fold.scale.z = 0.55;
      fold.position.set(px + p * 0.06, 0, 0);
      g.add(fold);
    }
  });
  return g;
}

export function buildSmartHomeArchitecture(
  textures: ProceduralTextureSet,
  castShadows: boolean,
): HouseBuildResult {
  const group = new THREE.Group();
  group.name = 'smart-home-architecture-expanded';

  // Architectural PBR Palette (Warm Scandinavian Contemporary)
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf4f1eb,
    roughness: 0.82,
    metalness: 0.02,
  });
  const accentWallMat = new THREE.MeshStandardMaterial({
    color: 0xe6e1d8,
    roughness: 0.84,
    metalness: 0.02,
  });
  const baseboardMat = new THREE.MeshStandardMaterial({
    color: 0xe8e4dc,
    roughness: 0.55,
    metalness: 0.04,
  });
  const wallCapMat = new THREE.MeshStandardMaterial({
    color: 0x3b4252,
    roughness: 0.55,
    metalness: 0.22,
  });
  const oakMat = new THREE.MeshStandardMaterial({
    color: 0xc49f77,
    map: textures.woodFloor,
    roughness: 0.52,
    metalness: 0.04,
  });
  const walnutMat = new THREE.MeshStandardMaterial({
    color: 0x8f6b4b,
    roughness: 0.48,
    metalness: 0.06,
  });
  const brushedBrassMat = new THREE.MeshStandardMaterial({
    color: 0xc9a96e,
    roughness: 0.26,
    metalness: 0.88,
  });
  const brushedSteelMat = new THREE.MeshStandardMaterial({
    color: 0xb0b8c4,
    roughness: 0.24,
    metalness: 0.88,
  });
  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x262f3d,
    roughness: 0.36,
    metalness: 0.72,
  });
  const ceramicWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf8f8f6,
    roughness: 0.28,
    metalness: 0.04,
  });
  const linenLightMat = new THREE.MeshStandardMaterial({
    color: 0xede9e1,
    map: textures.fabric,
    normalMap: textures.fabricNormal,
    normalScale: new THREE.Vector2(0.35, 0.35),
    roughness: 0.92,
    metalness: 0.0,
  });
  const linenTaupeMat = new THREE.MeshStandardMaterial({
    color: 0xc2b8aa,
    map: textures.fabric,
    normalMap: textures.fabricNormal,
    normalScale: new THREE.Vector2(0.35, 0.35),
    roughness: 0.9,
    metalness: 0.0,
  });
  const sageCabinetMat = new THREE.MeshStandardMaterial({
    color: 0xa7afa3,
    roughness: 0.48,
    metalness: 0.06,
  });
  const navyAccentMat = new THREE.MeshStandardMaterial({
    color: 0x475c7a,
    roughness: 0.82,
  });
  const terracottaMat = new THREE.MeshStandardMaterial({
    color: 0xb97a5b,
    roughness: 0.85,
  });
  const marbleCounterMat = new THREE.MeshStandardMaterial({
    map: textures.marble,
    roughness: 0.22,
    metalness: 0.05,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    roughness: 0.06,
    metalness: 0.04,
    transparent: true,
    opacity: castShadows ? 0.26 : 0.32,
    transmission: castShadows ? 0.65 : 0,
    ior: 1.5,
    depthWrite: false,
  });
  const fireplaceGlowMat = new THREE.MeshStandardMaterial({
    color: 0xffedd5,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.35,
    roughness: 0.3,
  });
  const roomSpotMat = new THREE.MeshStandardMaterial({
    color: 0xfff8eb,
    emissive: 0xfde68a,
    emissiveIntensity: 0.95,
    roughness: 0.3,
  });

  // =========================================================================
  // 0. EXPANDED ARCHITECTURAL FOUNDATION PLINTH
  // =========================================================================
  const foundationMain = new THREE.Mesh(
    new THREE.BoxGeometry(23.0, 0.22, 16.8),
    new THREE.MeshStandardMaterial({ color: 0xd6d3cd, roughness: 0.85 }),
  );
  foundationMain.position.set(0.0, -0.11, -1.3);
  foundationMain.receiveShadow = true;
  group.add(foundationMain);

  const contactShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(26.5, 20.5),
    new THREE.MeshBasicMaterial({
      map: textures.contactShadow,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    }),
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.set(0.0, -0.2, -1.3);
  group.add(contactShadow);

  // =========================================================================
  // 1. ALL ROOM FLOORS (EXISTING 4 + 7 NEW EXPANDED ROOMS)
  // =========================================================================
  const woodFloorMat = new THREE.MeshStandardMaterial({
    map: textures.woodFloor,
    normalMap: textures.woodNormal,
    normalScale: new THREE.Vector2(0.45, 0.45),
    roughnessMap: textures.woodRoughness,
    roughness: 0.72,
    metalness: 0.04,
  });
  const bedroomWoodMat = new THREE.MeshStandardMaterial({
    map: textures.bedroomWood,
    normalMap: textures.woodNormal,
    normalScale: new THREE.Vector2(0.35, 0.35),
    roughness: 0.58,
    metalness: 0.04,
  });
  const tileMat = new THREE.MeshStandardMaterial({
    map: textures.tileFloor,
    normalMap: textures.tileNormal,
    normalScale: new THREE.Vector2(0.35, 0.35),
    roughness: 0.42,
    metalness: 0.06,
  });
  const bathFloorMat = new THREE.MeshStandardMaterial({
    map: textures.bathroomTile,
    roughness: 0.36,
    metalness: 0.06,
  });
  const garageFloorMat = new THREE.MeshStandardMaterial({
    map: textures.garageEpoxy,
    roughness: 0.44,
    metalness: 0.08,
  });

  const addFloorSlab = (
    w: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material,
  ) => {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, d), mat);
    slab.position.set(x, y, z);
    slab.receiveShadow = true;
    group.add(slab);
    return slab;
  };

  // Existing 4 zones
  addFloorSlab(6.05, 5.0, -2.525, 0.02, 2.0, woodFloorMat); // Sala de Estar
  addFloorSlab(6.05, 4.35, -2.525, 0.02, -2.675, bedroomWoodMat); // Quarto Principal
  addFloorSlab(5.3, 5.05, 3.15, 0.02, -2.325, tileMat); // Cozinha
  const deckFloor = new THREE.Mesh(
    new THREE.BoxGeometry(5.3, 0.06, 4.5),
    new THREE.MeshStandardMaterial({ map: textures.deckWood, roughness: 0.7, metalness: 0.04 }),
  );
  deckFloor.position.set(3.15, 0.03, 2.45);
  deckFloor.receiveShadow = true;
  group.add(deckFloor);

  // New 7 expanded rooms
  addFloorSlab(6.05, 2.3, -2.525, 0.02, 5.65, tileMat); // Hall de Entrada & Corredor
  addFloorSlab(5.65, 5.3, -8.375, 0.02, 1.85, woodFloorMat); // Escritório
  addFloorSlab(5.65, 4.05, -8.375, 0.02, -2.825, bathFloorMat); // Banheiro
  addFloorSlab(5.65, 4.55, -8.375, 0.02, -7.125, bedroomWoodMat); // Quarto Adicional
  addFloorSlab(5.4, 5.05, 8.5, 0.02, -2.325, woodFloorMat); // Sala de Jantar
  addFloorSlab(5.4, 4.55, 8.5, 0.02, -7.125, tileMat); // Lavanderia
  addFloorSlab(5.4, 6.2, 8.5, 0.02, 3.3, garageFloorMat); // Garagem Integrada

  // Front Steps & Foyer Walkway connecting Hallway + Exterior Terrace to Street
  const frontStonePatio = new THREE.Mesh(
    new THREE.BoxGeometry(6.6, 0.08, 2.2),
    new THREE.MeshStandardMaterial({ map: textures.stonePaver, roughness: 0.78, metalness: 0.04 }),
  );
  frontStonePatio.position.set(2.4, -0.14, 5.8);
  frontStonePatio.receiveShadow = true;
  group.add(frontStonePatio);

  [0, 1].forEach((idx) => {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.1, 0.46),
      new THREE.MeshStandardMaterial({ color: 0xddd9d0, roughness: 0.75 }),
    );
    step.position.set(-2.5, -0.02 - idx * 0.08, 6.95 + idx * 0.44);
    step.receiveShadow = true;
    step.castShadow = castShadows;
    group.add(step);
  });

  // =========================================================================
  // 2. WALL BUILDER HELPER & ARCHITECTURAL SHELL
  // =========================================================================
  const addWall = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat = wallMat,
    withBaseboard = true,
  ) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    wall.position.set(x, y, z);
    wall.castShadow = castShadows;
    wall.receiveShadow = true;
    group.add(wall);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.01, 0.035, d + 0.01), wallCapMat);
    cap.position.set(x, y + h / 2 + 0.018, z);
    group.add(cap);

    if (withBaseboard) {
      const bb = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.025, 0.09, d + 0.025),
        baseboardMat,
      );
      bb.position.set(x, 0.085, z);
      group.add(bb);
    }
    return wall;
  };

  // --- EXISTING CORE WALLS (Preserved + Doorway Openings to New Wings) ---
  // North wall of Bedroom & Kitchen (z = -4.85)
  addWall(2.6, 2.85, 0.22, -4.35, 1.425, -4.85);
  addWall(1.4, 2.85, 0.22, 1.2, 1.425, -4.85); // Kitchen N-left
  addWall(2.2, 2.85, 0.22, 4.7, 1.425, -4.85); // Kitchen N-right
  // Kitchen -> Gourmet sliding glass patio door at x: 1.9..3.6, z: -4.85
  const kitchenPatioGlass = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.25, 0.04), glassMat);
  kitchenPatioGlass.position.set(2.75, 1.15, -4.85);
  const kitchenPatioTop = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.45, 0.22), wallMat);
  kitchenPatioTop.position.set(2.75, 2.62, -4.85);
  group.add(kitchenPatioGlass, kitchenPatioTop);

  // Bedroom Window Opening (x: -3.05 to 0.0, z: -4.85)
  addWall(3.05, 0.65, 0.22, -1.525, 0.325, -4.85);
  addWall(3.05, 0.42, 0.22, -1.525, 2.64, -4.85);
  const bedWindowGlass = new THREE.Mesh(new THREE.BoxGeometry(2.96, 1.74, 0.04), glassMat);
  bedWindowGlass.position.set(-1.525, 1.54, -4.85);
  const bedWindowFrame = new THREE.Mesh(new THREE.BoxGeometry(3.02, 0.06, 0.25), darkMetalMat);
  bedWindowFrame.position.set(-1.525, 0.67, -4.85);
  const bedMullion = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.76, 0.08), darkMetalMat);
  bedMullion.position.set(-1.525, 1.54, -4.85);
  group.add(bedWindowGlass, bedWindowFrame, bedMullion);

  const bedCurtains = createCurtainSet(2.9, 2.15, linenLightMat, darkMetalMat);
  bedCurtains.position.set(-1.525, 1.55, -4.64);
  group.add(bedCurtains);

  // Spine at x = -5.55 (Divides Core from West Wing: Guest Bed / Bathroom / Office)
  // Doorway from Bedroom -> Bathroom at z: -2.0 .. -0.9
  addWall(0.22, 2.85, 2.85, -5.55, 1.425, -3.45);
  // Bathroom -> Office dividing stub & corridor link
  addWall(0.22, 2.85, 1.2, -5.55, 1.425, 0.3);
  addWall(0.22, 2.85, 1.35, -5.55, 1.425, 3.85);
  // Interior glass partition Living <-> Office
  addWall(0.22, 0.55, 1.9, -5.55, 0.275, 2.25);
  addWall(0.22, 0.42, 1.9, -5.55, 2.64, 2.25);
  const livWindowGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.88, 1.85), glassMat);
  livWindowGlass.position.set(-5.55, 1.49, 2.25);
  const livMullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.88, 0.05), darkMetalMat);
  livMullion.position.set(-5.55, 1.49, 2.25);
  group.add(livWindowGlass, livMullion);
  const livCurtains = createCurtainSet(1.9, 2.2, linenLightMat, darkMetalMat);
  livCurtains.rotation.y = Math.PI / 2;
  livCurtains.position.set(-5.34, 1.52, 2.25);
  group.add(livCurtains);

  // Spine at x = 5.80 (Divides Kitchen/Exterior from East Wing: Dining/Laundry/Garage)
  // Wide open archway Kitchen <-> Dining Room (z: -3.2 .. -1.1)
  addWall(0.22, 2.85, 1.65, 5.8, 1.425, -4.02, accentWallMat);
  addWall(0.22, 2.85, 1.35, 5.8, 1.425, -0.45, accentWallMat);
  addWall(0.22, 0.48, 2.1, 5.8, 2.61, -2.18, accentWallMat, false);
  // Garage West Wall (x = 5.80, z: 0.20 .. 6.40) with side service door at z = 1.4
  addWall(0.22, 2.85, 1.0, 5.8, 1.425, 0.7);
  addWall(0.22, 2.85, 4.1, 5.8, 1.425, 4.35);
  const garageSideDoor = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.15, 0.9), oakMat);
  garageSideDoor.position.set(5.8, 1.1, 1.65);
  group.add(garageSideDoor);

  // Interior Dividing Wall: Living <-> Bedroom (with oak door)
  addWall(3.85, 2.7, 0.18, -3.58, 1.35, -0.5);
  const intDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.25, 0.22), oakMat);
  intDoorFrame.position.set(-1.12, 1.15, -0.5);
  const intDoorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.96, 2.15, 0.06), oakMat);
  intDoorPanel.position.set(-0.78, 1.12, -0.92);
  intDoorPanel.rotation.y = Math.PI * 0.35;
  const intHandle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.09), brushedBrassMat);
  intHandle.position.set(-1.02, 1.05, -0.75);
  group.add(intDoorFrame, intDoorPanel, intHandle);

  const glassDivider = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.45, 0.05), glassMat);
  glassDivider.position.set(-0.08, 1.25, -0.5);
  const glassFrameTop = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.05, 0.08), darkMetalMat);
  glassFrameTop.position.set(-0.08, 2.48, -0.5);
  group.add(glassDivider, glassFrameTop);

  // Central Spine Wall (x = 0.50: Living/Bedroom <-> Kitchen/Exterior)
  addWall(0.2, 2.8, 4.3, 0.5, 1.4, -2.65);
  addWall(0.2, 2.8, 1.35, 0.5, 1.4, 0.88);
  addWall(0.2, 2.8, 1.35, 0.5, 1.4, 3.85);
  addWall(0.2, 0.45, 1.65, 0.5, 2.58, 2.36, wallMat, false);

  const frontFrame = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.38, 1.6), darkMetalMat);
  frontFrame.position.set(0.5, 1.19, 2.36);
  const frontDoorWood = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.28, 1.08), walnutMat);
  frontDoorWood.position.set(0.5, 1.16, 2.2);
  const frontSidelight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.24, 0.38), glassMat);
  frontSidelight.position.set(0.5, 1.16, 2.94);
  const doorPullBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.016, 0.016, 0.85, 12),
    brushedSteelMat,
  );
  doorPullBar.position.set(0.58, 1.18, 2.52);
  group.add(frontFrame, frontDoorWood, frontSidelight, doorPullBar);

  const doorSensor = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.13, 0.045), wallMat);
  doorSensor.position.set(0.61, 2.08, 1.72);
  group.add(doorSensor);

  // Subtle Ceiling Soffits + Downlights
  const kitchenSoffit = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.14, 1.6), wallMat);
  kitchenSoffit.position.set(3.15, 2.74, -2.5);
  const livingSoffit = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.12, 0.55), wallMat);
  livingSoffit.position.set(-2.6, 2.74, -0.25);
  group.add(kitchenSoffit, livingSoffit);

  [
    [-3.6, 2.66, -0.25],
    [-1.6, 2.66, -0.25],
    [2.1, 2.66, -2.5],
    [4.1, 2.66, -2.5],
    [8.5, 2.66, -2.3],
    [-8.4, 2.66, 1.8],
  ].forEach(([sx, sy, sz]) => {
    const spot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 14), roomSpotMat);
    spot.position.set(sx, sy, sz);
    group.add(spot);
  });

  // Glass Terrace Balustrade (Exterior)
  const glassRailFront = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.9, 0.05), glassMat);
  glassRailFront.position.set(4.45, 0.49, 4.65);
  const railTopFront = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.04, 0.08), darkMetalMat);
  railTopFront.position.set(4.45, 0.95, 4.65);
  group.add(glassRailFront, railTopFront);

  // --- WEST WING OUTER & DIVIDING WALLS ---
  // Far West Wall (x = -11.20) with Office Window & Guest Bed Window
  addWall(0.22, 2.85, 4.6, -11.2, 1.425, -7.1); // Guest bedroom W wall
  addWall(0.22, 2.85, 4.05, -11.2, 1.425, -2.82); // Bathroom W wall
  addWall(0.22, 2.85, 1.8, -11.2, 1.425, 0.1);
  addWall(0.22, 2.85, 1.5, -11.2, 1.425, 3.75);
  // Office West Window (z: 1.0 .. 3.0)
  addWall(0.22, 0.72, 2.0, -11.2, 0.36, 2.0);
  addWall(0.22, 0.42, 2.0, -11.2, 2.64, 2.0);
  const officeWinGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.7, 1.95), glassMat);
  officeWinGlass.position.set(-11.2, 1.57, 2.0);
  group.add(officeWinGlass);

  // West Wing Interior Partitions
  addWall(4.3, 2.75, 0.18, -9.05, 1.375, -0.8); // Bathroom <-> Office (door gap at x=-6.2)
  addWall(4.3, 2.75, 0.18, -9.05, 1.375, -4.85); // Bathroom <-> Guest Bed (door gap at x=-6.2)
  // Guest Bedroom North Backyard Window Wall (z = -9.40)
  addWall(1.7, 2.85, 0.22, -10.35, 1.425, -9.4);
  addWall(1.6, 2.85, 0.22, -6.35, 1.425, -9.4);
  addWall(2.35, 0.65, 0.22, -8.32, 0.325, -9.4);
  addWall(2.35, 0.42, 0.22, -8.32, 2.64, -9.4);
  const guestWinGlass = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.75, 0.04), glassMat);
  guestWinGlass.position.set(-8.32, 1.54, -9.4);
  group.add(guestWinGlass);
  // Guest Bedroom East Wall (x = -5.55, z: -9.40 .. -4.85)
  addWall(0.22, 2.85, 4.55, -5.55, 1.425, -7.125);
  // Office South Front Wall (z = 4.50, x: -11.20 .. -5.55)
  addWall(5.65, 2.85, 0.22, -8.375, 1.425, 4.5);

  // --- HALLWAY & FRONT ENTRY FOYER (z = 4.50..6.80, x = -5.55..0.50) ---
  // Partition between Living Room & Hallway (open wide portal at x = -1.2)
  addWall(3.3, 2.75, 0.18, -3.9, 1.375, 4.5);
  const foyerArchGlass = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.45, 0.04), glassMat);
  foyerArchGlass.position.set(-1.8, 1.25, 4.5);
  group.add(foyerArchGlass);
  // Hallway West Wall & East Wall
  addWall(0.22, 2.85, 2.3, -5.55, 1.425, 5.65);
  addWall(0.22, 2.85, 2.3, 0.5, 1.425, 5.65);
  // Hallway South Front Entrance Wall (z = 6.80) with Grand Main Entrance Door
  addWall(2.2, 2.85, 0.22, -4.45, 1.425, 6.8);
  addWall(2.1, 2.85, 0.22, -0.55, 1.425, 6.8);
  addWall(1.75, 0.45, 0.22, -2.5, 2.62, 6.8, wallMat, false);
  const mainEntryFrame = new THREE.Mesh(new THREE.BoxGeometry(1.75, 2.38, 0.24), darkMetalMat);
  mainEntryFrame.position.set(-2.5, 1.19, 6.8);
  const mainEntryDoor = new THREE.Mesh(new THREE.BoxGeometry(1.12, 2.28, 0.08), walnutMat);
  mainEntryDoor.position.set(-2.72, 1.16, 6.8);
  const mainEntryGlass = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.24, 0.04), glassMat);
  mainEntryGlass.position.set(-1.92, 1.16, 6.8);
  const mainPullBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.016, 0.016, 0.9, 10),
    brushedSteelMat,
  );
  mainPullBar.position.set(-2.3, 1.18, 6.87);
  group.add(mainEntryFrame, mainEntryDoor, mainEntryGlass, mainPullBar);

  // --- EAST WING WALLS (Dining Room, Laundry, Garage) ---
  // Dining Room East Wall (x = 11.20, z: -4.85 .. 0.20) with wide window
  addWall(0.22, 2.85, 1.6, 11.2, 1.425, -4.05, accentWallMat);
  addWall(0.22, 2.85, 1.5, 11.2, 1.425, -0.55, accentWallMat);
  addWall(0.22, 0.65, 2.0, 11.2, 0.325, -2.3);
  addWall(0.22, 0.42, 2.0, 11.2, 2.64, -2.3);
  const diningWinGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.75, 1.95), glassMat);
  diningWinGlass.position.set(11.2, 1.54, -2.3);
  group.add(diningWinGlass);

  // Dining <-> Laundry Wall (z = -4.85, doorway at x = 6.6)
  addWall(3.8, 2.75, 0.18, 9.3, 1.375, -4.85);
  // Laundry East Wall & North Wall (z = -9.40, back door to backyard at x = 7.2)
  addWall(0.22, 2.85, 4.55, 11.2, 1.425, -7.125);
  addWall(0.22, 2.85, 4.55, 5.8, 1.425, -7.125);
  addWall(3.4, 2.85, 0.22, 9.5, 1.425, -9.4);
  addWall(0.8, 2.85, 0.22, 6.2, 1.425, -9.4);
  const laundryBackDoor = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.18, 0.06), ceramicWhiteMat);
  laundryBackDoor.position.set(7.1, 1.12, -9.4);
  group.add(laundryBackDoor);

  // Dining <-> Garage Wall (z = 0.20)
  addWall(5.4, 2.85, 0.2, 8.5, 1.425, 0.2);
  // Garage East Wall (x = 11.20, z: 0.20 .. 6.40)
  addWall(0.22, 2.85, 6.2, 11.2, 1.425, 3.3);
  // Garage South Front Wall pillars around wide sectional garage door (z = 6.40)
  addWall(0.85, 2.85, 0.26, 6.22, 1.425, 6.4);
  addWall(0.85, 2.85, 0.26, 10.78, 1.425, 6.4);
  addWall(3.75, 0.45, 0.26, 8.5, 2.62, 6.4, wallMat, false);

  // =========================================================================
  // 3. EXISTING SALA DE ESTAR, QUARTO PRINCIPAL, COZINHA, TERRAÇO
  // =========================================================================
  const livingRug = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.02, 2.8),
    new THREE.MeshStandardMaterial({ map: textures.rugLiving, roughness: 0.95 }),
  );
  livingRug.position.set(-2.6, 0.05, 2.25);
  livingRug.receiveShadow = true;
  group.add(livingRug);

  const sofaGroup = new THREE.Group();
  sofaGroup.position.set(-2.65, 0.06, 3.45);
  const sofaPlinth = new THREE.Mesh(new THREE.BoxGeometry(2.75, 0.14, 0.95), oakMat);
  sofaPlinth.position.y = 0.09;
  const seatGeom = createRoundedBoxGeometry(0.84, 0.22, 0.82, 0.05);
  [-0.86, 0, 0.86].forEach((sx) => {
    const cushion = new THREE.Mesh(seatGeom, linenLightMat);
    cushion.position.set(sx, 0.27, -0.02);
    sofaGroup.add(cushion);
  });
  const sofaBack = new THREE.Mesh(
    createRoundedBoxGeometry(2.68, 0.46, 0.2, 0.05),
    linenLightMat,
  );
  sofaBack.position.set(0, 0.48, 0.36);
  const armGeom = createRoundedBoxGeometry(0.18, 0.38, 0.92, 0.04);
  const armL = new THREE.Mesh(armGeom, linenLightMat);
  armL.position.set(-1.32, 0.35, 0);
  const armR = new THREE.Mesh(armGeom, linenLightMat);
  armR.position.set(1.32, 0.35, 0);
  const throwBlanket = new THREE.Mesh(
    createRoundedBoxGeometry(0.24, 0.32, 0.52, 0.04),
    terracottaMat,
  );
  throwBlanket.position.set(1.31, 0.38, 0.05);
  const pillow1 = new THREE.Mesh(createRoundedBoxGeometry(0.36, 0.32, 0.14, 0.04), terracottaMat);
  pillow1.position.set(-0.98, 0.48, 0.16);
  pillow1.rotation.set(-0.22, 0.2, 0);
  const pillow2 = new THREE.Mesh(createRoundedBoxGeometry(0.36, 0.32, 0.14, 0.04), sageCabinetMat);
  pillow2.position.set(-0.55, 0.46, 0.18);
  pillow2.rotation.set(-0.18, -0.1, 0);
  const pillow3 = new THREE.Mesh(createRoundedBoxGeometry(0.36, 0.32, 0.14, 0.04), linenTaupeMat);
  pillow3.position.set(0.95, 0.48, 0.16);
  pillow3.rotation.set(-0.2, -0.22, 0);
  sofaGroup.add(sofaPlinth, sofaBack, armL, armR, throwBlanket, pillow1, pillow2, pillow3);
  sofaGroup.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) {
      c.castShadow = castShadows;
      c.receiveShadow = true;
    }
  });
  group.add(sofaGroup);

  const chairGroup = new THREE.Group();
  chairGroup.position.set(-0.85, 0.06, 2.35);
  chairGroup.rotation.y = -Math.PI * 0.32;
  const chairFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.32, 0.1, 20), oakMat);
  chairFrame.position.y = 0.14;
  const chairSeat = new THREE.Mesh(createRoundedBoxGeometry(0.66, 0.16, 0.64, 0.05), linenTaupeMat);
  chairSeat.position.y = 0.27;
  const chairBack = new THREE.Mesh(createRoundedBoxGeometry(0.64, 0.44, 0.16, 0.05), linenTaupeMat);
  chairBack.position.set(0, 0.48, 0.24);
  chairBack.rotation.x = -0.15;
  chairGroup.add(chairFrame, chairSeat, chairBack);
  group.add(chairGroup);

  const coffeeTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.58, 0.045, 28),
    marbleCounterMat,
  );
  coffeeTop.position.set(-2.75, 0.37, 1.9);
  coffeeTop.castShadow = castShadows;
  coffeeTop.receiveShadow = true;
  const coffeeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 0.31, 20), oakMat);
  coffeeBase.position.set(-2.75, 0.19, 1.9);
  const tableVase = createCeramicVase(0.22, 0.075, 0xd8d2c7);
  tableVase.position.set(-2.9, 0.39, 1.85);
  const book1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.035, 0.18), terracottaMat);
  book1.position.set(-2.55, 0.41, 1.98);
  const book2 = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.03, 0.16), wallMat);
  book2.position.set(-2.54, 0.44, 1.97);
  book2.rotation.y = 0.12;
  group.add(coffeeTop, coffeeBase, tableVase, book1, book2);

  const tvRack = new THREE.Mesh(createRoundedBoxGeometry(2.65, 0.26, 0.5, 0.025), oakMat);
  tvRack.position.set(-2.6, 0.34, -0.15);
  tvRack.castShadow = castShadows;
  const fireplaceRecess = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.24, 0.1), darkMetalMat);
  fireplaceRecess.position.set(-2.6, 0.62, -0.37);
  const emberStrip = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.07, 0.06), fireplaceGlowMat);
  emberStrip.position.set(-2.6, 0.55, -0.34);
  const rackVase = createCeramicVase(0.18, 0.06, 0x7c8b82);
  rackVase.position.set(-1.55, 0.47, -0.12);
  group.add(tvRack, fireplaceRecess, emberStrip, rackVase);

  const artFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.95, 0.04), oakMat);
  artFrameL.position.set(-0.7, 1.65, -0.4);
  const artCanvasL = new THREE.Mesh(
    new THREE.PlaneGeometry(0.75, 0.85),
    new THREE.MeshStandardMaterial({ map: textures.artLiving, roughness: 0.75 }),
  );
  artCanvasL.position.set(-0.7, 1.65, -0.375);
  group.add(artFrameL, artCanvasL);

  const shelfGroup = new THREE.Group();
  shelfGroup.position.set(-5.2, 0.04, 1.0);
  [-0.45, 0.45].forEach((sz) => {
    const upright = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.85, 0.035), darkMetalMat);
    upright.position.set(0, 0.925, sz);
    shelfGroup.add(upright);
  });
  [0.25, 0.72, 1.2, 1.68].forEach((sy) => {
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 0.94), oakMat);
    board.position.set(0, sy, 0);
    shelfGroup.add(board);
  });
  [0x315eaa, 0xb97a5b, 0x64748b, 0xd8d2c7].forEach((col, bi) => {
    const bk = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.22 + (bi % 2) * 0.04, 0.05),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.75 }),
    );
    bk.position.set(0.02, 0.85, -0.25 + bi * 0.06);
    shelfGroup.add(bk);
  });
  const shelfPot = createCeramicVase(0.16, 0.06, 0xede9e1);
  shelfPot.position.set(0.02, 1.22, 0.15);
  shelfGroup.add(shelfPot);
  group.add(shelfGroup);

  const speakerTable = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.56, 20), oakMat);
  speakerTable.position.set(-4.6, 0.32, 3.3);
  const routerConsole = new THREE.Mesh(createRoundedBoxGeometry(0.95, 0.74, 0.48, 0.025), oakMat);
  routerConsole.position.set(-0.35, 0.41, 0.25);
  group.add(speakerTable, routerConsole);

  const fLampBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.04, 20),
    marbleCounterMat,
  );
  fLampBase.position.set(-5.05, 0.06, 4.05);
  const fLampPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.022, 1.65, 10),
    brushedBrassMat,
  );
  fLampPole.position.set(-5.05, 0.9, 4.05);
  const fLampShade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.22, 0.22, 20),
    roomSpotMat,
  );
  fLampShade.position.set(-4.95, 1.72, 3.98);
  const presenceSensor = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.045), wallMat);
  presenceSensor.position.set(-5.42, 2.05, 2.0);
  group.add(fLampBase, fLampPole, fLampShade, presenceSensor);
  group.add(createOrganicPlant(-4.95, 0.04, 0.18, 1.15, 0xddd7cc, castShadows));

  // --- QUARTO PRINCIPAL ---
  const bedroomRug = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.02, 2.5),
    new THREE.MeshStandardMaterial({ map: textures.rugBedroom, roughness: 0.95 }),
  );
  bedroomRug.position.set(-3.05, 0.05, -3.25);
  bedroomRug.receiveShadow = true;
  group.add(bedroomRug);

  const bedGroup = new THREE.Group();
  bedGroup.position.set(-3.05, 0.06, -3.35);
  const bedBase = new THREE.Mesh(createRoundedBoxGeometry(2.22, 0.22, 2.34, 0.03), oakMat);
  bedBase.position.y = 0.12;
  const headBoard = new THREE.Mesh(
    createRoundedBoxGeometry(2.42, 1.05, 0.14, 0.04),
    linenTaupeMat,
  );
  headBoard.position.set(0, 0.56, -1.14);
  const mattress = new THREE.Mesh(
    createRoundedBoxGeometry(2.04, 0.24, 2.12, 0.05),
    ceramicWhiteMat,
  );
  mattress.position.set(0, 0.34, 0.02);
  const duvet = new THREE.Mesh(
    createRoundedBoxGeometry(2.1, 0.14, 1.38, 0.05),
    linenLightMat,
  );
  duvet.position.set(0, 0.45, 0.4);
  const bedThrow = new THREE.Mesh(
    createRoundedBoxGeometry(2.12, 0.08, 0.44, 0.03),
    terracottaMat,
  );
  bedThrow.position.set(0, 0.5, 0.82);
  [-0.48, 0.48].forEach((px) => {
    const pBack = new THREE.Mesh(
      createRoundedBoxGeometry(0.76, 0.14, 0.42, 0.04),
      linenTaupeMat,
    );
    pBack.position.set(px, 0.52, -0.82);
    pBack.rotation.x = 0.24;
    const pFront = new THREE.Mesh(
      createRoundedBoxGeometry(0.68, 0.13, 0.36, 0.04),
      linenLightMat,
    );
    pFront.position.set(px, 0.5, -0.62);
    pFront.rotation.x = 0.15;
    bedGroup.add(pBack, pFront);
  });
  bedGroup.add(bedBase, headBoard, mattress, duvet, bedThrow);
  bedGroup.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) {
      c.castShadow = castShadows;
      c.receiveShadow = true;
    }
  });
  group.add(bedGroup);

  const nsLeft = new THREE.Mesh(createRoundedBoxGeometry(0.58, 0.58, 0.52, 0.03), oakMat);
  nsLeft.position.set(-4.6, 0.35, -4.0);
  const nsRight = new THREE.Mesh(createRoundedBoxGeometry(0.58, 0.58, 0.52, 0.03), oakMat);
  nsRight.position.set(-1.45, 0.35, -4.15);
  const bedBook = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.035, 0.16), wallMat);
  bedBook.position.set(-4.65, 0.66, -3.9);
  const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(0.66, 2.35, 2.2), oakMat);
  wardrobe.position.set(-5.08, 1.21, -1.85);
  group.add(nsLeft, nsRight, bedBook, wardrobe);
  [-2.3, -1.4].forEach((hz) => {
    const wHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.55, 8),
      brushedBrassMat,
    );
    wHandle.position.set(-4.73, 1.2, hz);
    group.add(wHandle);
  });

  const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.75, 0.66), brushedBrassMat);
  mirrorFrame.position.set(-0.2, 0.92, -3.7);
  mirrorFrame.rotation.y = -0.35;
  const mirrorGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.6, 1.68),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.06, metalness: 0.94 }),
  );
  mirrorGlass.position.set(-0.22, 0.92, -3.7);
  mirrorGlass.rotation.y = -Math.PI / 2 - 0.35;
  const bedArtFrame = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.88, 0.04), oakMat);
  bedArtFrame.position.set(-4.5, 1.65, -4.72);
  const bedArt = new THREE.Mesh(
    new THREE.PlaneGeometry(0.68, 0.8),
    new THREE.MeshStandardMaterial({ map: textures.artBedroom, roughness: 0.75 }),
  );
  bedArt.position.set(-4.5, 1.65, -4.695);
  group.add(mirrorFrame, mirrorGlass, bedArtFrame, bedArt);
  group.add(createOrganicPlant(-0.85, 0.04, -4.2, 0.65, 0xd6cfc2, castShadows));

  // --- COZINHA ---
  const lowerCab = new THREE.Mesh(new THREE.BoxGeometry(3.45, 0.88, 0.78), sageCabinetMat);
  lowerCab.position.set(2.45, 0.48, -4.34);
  const counterTop = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.06, 0.84), marbleCounterMat);
  counterTop.position.set(2.45, 0.95, -4.34);
  const upperCab = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.74, 0.44), oakMat);
  upperCab.position.set(2.45, 2.15, -4.51);
  const underCabLed = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.02, 0.04), roomSpotMat);
  underCabLed.position.set(2.45, 1.77, -4.45);
  const ovenTower = new THREE.Mesh(new THREE.BoxGeometry(0.72, 2.15, 0.78), sageCabinetMat);
  ovenTower.position.set(4.12, 1.11, -4.34);
  const sinkBasin = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.04, 0.44), brushedSteelMat);
  sinkBasin.position.set(1.45, 0.97, -4.32);
  const cooktop = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.025, 0.54), darkMetalMat);
  cooktop.position.set(2.55, 0.99, -4.32);
  const potBody = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.1, 16), brushedSteelMat);
  potBody.position.set(2.42, 1.05, -4.28);
  const rangeHood = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.24, 0.54), brushedSteelMat);
  rangeHood.position.set(2.55, 2.14, -4.32);
  const coffeeBody = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.34, 0.28), darkMetalMat);
  coffeeBody.position.set(3.45, 1.15, -4.35);

  const islandBase = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.88, 1.08), oakMat);
  islandBase.position.set(2.75, 0.48, -1.85);
  const islandTop = new THREE.Mesh(new THREE.BoxGeometry(2.78, 0.07, 1.24), marbleCounterMat);
  islandTop.position.set(2.75, 0.95, -1.85);
  const pendantBar = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.045, 0.07), roomSpotMat);
  pendantBar.position.set(2.75, 2.38, -1.85);
  const bowl = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 18, 12, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5),
    linenLightMat,
  );
  bowl.position.set(2.25, 1.06, -1.85);
  [1.85, 2.75, 3.65].forEach((sx) => {
    const stoolSeat = new THREE.Mesh(
      createRoundedBoxGeometry(0.4, 0.08, 0.36, 0.03),
      linenLightMat,
    );
    stoolSeat.position.set(sx, 0.68, -0.96);
    const stoolLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.14, 0.64, 14),
      darkMetalMat,
    );
    stoolLeg.position.set(sx, 0.34, -0.96);
    group.add(stoolSeat, stoolLeg);
  });
  group.add(
    lowerCab,
    counterTop,
    upperCab,
    underCabLed,
    ovenTower,
    sinkBasin,
    cooktop,
    potBody,
    rangeHood,
    coffeeBody,
    islandBase,
    islandTop,
    pendantBar,
    bowl,
  );

  // --- TERRAÇO FRONTAL ---
  const loungeBase = new THREE.Mesh(createRoundedBoxGeometry(0.9, 0.18, 1.75, 0.03), oakMat);
  loungeBase.position.set(3.2, 0.21, 2.85);
  const loungeMat = new THREE.Mesh(
    createRoundedBoxGeometry(0.82, 0.1, 1.22, 0.04),
    linenLightMat,
  );
  loungeMat.position.set(3.2, 0.33, 3.06);
  const loungeBack = new THREE.Mesh(
    createRoundedBoxGeometry(0.82, 0.1, 0.66, 0.04),
    linenLightMat,
  );
  loungeBack.position.set(3.2, 0.52, 2.2);
  loungeBack.rotation.x = 0.52;
  group.add(loungeBase, loungeMat, loungeBack);
  group.add(createOrganicPlant(5.15, 0.06, 1.0, 1.05, 0xb97a5b, castShadows));

  // =========================================================================
  // 4. NOVOS CÔMODOS INTERNOS DETALHADOS
  // =========================================================================

  // --- A. BANHEIRO (x: -11.20 .. -5.55, z: -4.85 .. -0.80) ---
  // Walk-in Glass Shower + Rain Showerhead + Illuminated Niches
  const showerTray = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.08, 1.55), marbleCounterMat);
  showerTray.position.set(-10.15, 0.06, -3.95);
  const showerGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.1, 1.55), glassMat);
  showerGlass.position.set(-9.22, 1.12, -3.95);
  const rainHead = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.03, 18),
    brushedSteelMat,
  );
  rainHead.position.set(-10.25, 2.28, -4.15);
  const showerArm = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.45), brushedSteelMat);
  showerArm.position.set(-10.25, 2.32, -4.4);
  // Illuminated Recessed Shower Niche
  const nicheFrame = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.32, 0.08), darkMetalMat);
  nicheFrame.position.set(-10.25, 1.35, -4.72);
  const nicheGlow = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.03, 0.06), roomSpotMat);
  nicheGlow.position.set(-10.25, 1.48, -4.7);
  group.add(showerTray, showerGlass, rainHead, showerArm, nicheFrame, nicheGlow);

  // Floating Vanity + Vessel Sink + Backlit Round Mirror + Cabinet + Towels
  const vanityCab = new THREE.Mesh(createRoundedBoxGeometry(1.55, 0.52, 0.56, 0.025), oakMat);
  vanityCab.position.set(-7.6, 0.58, -4.45);
  const vanityTop = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.6), marbleCounterMat);
  vanityTop.position.set(-7.6, 0.86, -4.45);
  const vesselSink = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.2, 0.14, 20),
    ceramicWhiteMat,
  );
  vesselSink.position.set(-7.6, 0.95, -4.44);
  const bathMirror = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.46, 0.03, 28),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.05, metalness: 0.95 }),
  );
  bathMirror.rotation.x = Math.PI / 2;
  bathMirror.position.set(-7.6, 1.66, -4.72);
  const mirrorHalo = new THREE.Mesh(
    new THREE.TorusGeometry(0.47, 0.015, 8, 28),
    roomSpotMat,
  );
  mirrorHalo.position.set(-7.6, 1.66, -4.73);

  // Wall-hung Toilet
  const toiletBase = new THREE.Mesh(
    createRoundedBoxGeometry(0.42, 0.38, 0.58, 0.08),
    ceramicWhiteMat,
  );
  toiletBase.position.set(-10.35, 0.36, -1.75);
  const toiletTank = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.48, 0.16), ceramicWhiteMat);
  toiletTank.position.set(-10.35, 0.68, -1.48);

  // Linen Cabinet + Rolled Towels
  const bathCab = new THREE.Mesh(createRoundedBoxGeometry(0.68, 1.75, 0.45, 0.02), oakMat);
  bathCab.position.set(-6.15, 0.92, -4.45);
  [0, 1, 2].forEach((ti) => {
    const towel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.28, 12),
      ti % 2 === 0 ? linenLightMat : sageCabinetMat,
    );
    towel.rotation.z = Math.PI / 2;
    towel.position.set(-7.05, 0.94 + (ti === 2 ? 0.08 : 0), -4.4 + (ti % 2) * 0.12);
    group.add(towel);
  });
  group.add(vanityCab, vanityTop, vesselSink, bathMirror, mirrorHalo, toiletBase, toiletTank, bathCab);

  // --- B. ESCRITÓRIO MODERNO (x: -11.20 .. -5.55, z: -0.80 .. 4.50) ---
  // Executive Walnut Desk + Ergonomic Chair + Bookcase + Books + Lamp + Printer
  const officeDeskTop = new THREE.Mesh(
    createRoundedBoxGeometry(2.4, 0.06, 0.92, 0.025),
    walnutMat,
  );
  officeDeskTop.position.set(-9.1, 0.76, 1.95);
  officeDeskTop.castShadow = castShadows;
  [-10.15, -8.05].forEach((lx) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.74, 0.8), darkMetalMat);
    leg.position.set(lx, 0.38, 1.95);
    group.add(leg);
  });
  // Side return credenza
  const deskCredenza = new THREE.Mesh(
    createRoundedBoxGeometry(0.64, 0.72, 1.65, 0.025),
    walnutMat,
  );
  deskCredenza.position.set(-10.65, 0.38, 3.25);

  // Ergonomic Office Chair
  const offChairGroup = new THREE.Group();
  offChairGroup.position.set(-9.1, 0.04, 2.85);
  const offStarBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.06, 5), darkMetalMat);
  offStarBase.position.y = 0.08;
  const offStem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.36, 10), darkMetalMat);
  offStem.position.y = 0.28;
  const offSeat = new THREE.Mesh(createRoundedBoxGeometry(0.56, 0.1, 0.52, 0.04), darkMetalMat);
  offSeat.position.y = 0.48;
  const offBack = new THREE.Mesh(createRoundedBoxGeometry(0.5, 0.68, 0.08, 0.04), navyAccentMat);
  offBack.position.set(0, 0.86, 0.22);
  offChairGroup.add(offStarBase, offStem, offSeat, offBack);

  // Tall Office Bookcase + Books + Architect Desk Lamp
  const officeBookcase = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.95, 0.42), oakMat);
  officeBookcase.position.set(-8.6, 1.0, -0.45);
  [0x315eaa, 0xb97a5b, 0x475569, 0x64748b, 0xa7afa3].forEach((bc, bi) => {
    const bk = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.28, 0.24),
      new THREE.MeshStandardMaterial({ color: bc, roughness: 0.72 }),
    );
    bk.position.set(-9.35 + bi * 0.11, 1.48, -0.42);
    group.add(bk);
  });
  const deskLampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.03, 16), darkMetalMat);
  deskLampBase.position.set(-8.15, 0.8, 1.72);
  const deskLampNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.42, 8), brushedBrassMat);
  deskLampNeck.position.set(-8.15, 1.02, 1.72);
  const deskLampHead = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.12, 16), darkMetalMat);
  deskLampHead.position.set(-8.22, 1.22, 1.78);
  deskLampHead.rotation.z = 0.4;
  group.add(officeDeskTop, deskCredenza, offChairGroup, officeBookcase, deskLampBase, deskLampNeck, deskLampHead);
  group.add(createOrganicPlant(-6.3, 0.04, 3.85, 0.95, 0xd6cfc2, castShadows));

  // --- C. CORREDOR & HALL DE ENTRADA (x: -5.55 .. 0.50, z: 4.50 .. 6.80) ---
  const foyerRug = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.015, 1.4),
    new THREE.MeshStandardMaterial({ map: textures.rugLiving, roughness: 0.95 }),
  );
  foyerRug.position.set(-2.5, 0.045, 5.7);
  const foyerConsole = new THREE.Mesh(createRoundedBoxGeometry(1.65, 0.78, 0.4, 0.025), oakMat);
  foyerConsole.position.set(-4.35, 0.42, 4.82);
  const foyerMirror = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 0.03, 24),
    brushedBrassMat,
  );
  foyerMirror.rotation.x = Math.PI / 2;
  foyerMirror.position.set(-4.35, 1.5, 4.62);
  const foyerVase = createCeramicVase(0.26, 0.08, 0xd8d2c7);
  foyerVase.position.set(-4.65, 0.82, 4.82);
  const foyerArt = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.85, 0.04), oakMat);
  foyerArt.position.set(0.36, 1.55, 5.65);
  group.add(foyerRug, foyerConsole, foyerMirror, foyerVase, foyerArt);
  group.add(createOrganicPlant(-0.2, 0.04, 6.2, 0.9, 0xddd7cc, castShadows));

  // --- D. QUARTO ADICIONAL (x: -11.20 .. -5.55, z: -9.40 .. -4.85) ---
  const guestRug = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.018, 2.0),
    new THREE.MeshStandardMaterial({ map: textures.rugBedroom, roughness: 0.95 }),
  );
  guestRug.position.set(-8.6, 0.048, -7.25);
  const guestBed = new THREE.Group();
  guestBed.position.set(-8.85, 0.06, -7.25);
  const gBase = new THREE.Mesh(createRoundedBoxGeometry(1.65, 0.2, 2.05, 0.03), oakMat);
  gBase.position.y = 0.11;
  const gHead = new THREE.Mesh(createRoundedBoxGeometry(1.75, 0.95, 0.12, 0.04), navyAccentMat);
  gHead.position.set(0, 0.52, -0.98);
  const gMattress = new THREE.Mesh(createRoundedBoxGeometry(1.52, 0.22, 1.9, 0.04), ceramicWhiteMat);
  gMattress.position.set(0, 0.31, 0.02);
  const gDuvet = new THREE.Mesh(createRoundedBoxGeometry(1.56, 0.12, 1.22, 0.04), linenLightMat);
  gDuvet.position.set(0, 0.41, 0.36);
  const gPillow = new THREE.Mesh(createRoundedBoxGeometry(1.15, 0.12, 0.38, 0.04), linenTaupeMat);
  gPillow.position.set(0, 0.46, -0.72);
  guestBed.add(gBase, gHead, gMattress, gDuvet, gPillow);

  const gNightstand = new THREE.Mesh(createRoundedBoxGeometry(0.5, 0.54, 0.45, 0.03), oakMat);
  gNightstand.position.set(-10.1, 0.31, -8.0);
  const gWardrobe = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.25, 1.85), oakMat);
  gWardrobe.position.set(-10.75, 1.15, -5.95);
  const gDesk = new THREE.Mesh(createRoundedBoxGeometry(1.35, 0.05, 0.62, 0.02), oakMat);
  gDesk.position.set(-6.6, 0.74, -8.85);
  const gDeskLeg = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.72, 0.52), darkMetalMat);
  gDeskLeg.position.set(-6.6, 0.37, -8.85);
  gDeskLeg.scale.x = 0.08;
  const gCurtains = createCurtainSet(2.2, 2.1, linenLightMat, darkMetalMat);
  gCurtains.position.set(-8.32, 1.54, -9.2);
  group.add(guestRug, guestBed, gNightstand, gWardrobe, gDesk, gDeskLeg, gCurtains);

  // --- E. SALA DE JANTAR (x: 5.80 .. 11.20, z: -4.85 .. 0.20) ---
  const diningTableTop = new THREE.Mesh(
    createRoundedBoxGeometry(2.45, 0.06, 1.15, 0.03),
    oakMat,
  );
  diningTableTop.position.set(8.45, 0.78, -2.3);
  diningTableTop.castShadow = castShadows;
  [-0.9, 0.9].forEach((dx) => {
    const tLeg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.74, 0.85), darkMetalMat);
    tLeg.position.set(8.45 + dx, 0.39, -2.3);
    group.add(tLeg);
  });
  // 6 Dining Chairs
  [-0.75, 0, 0.75].forEach((cx) => {
    [-0.72, 0.72].forEach((cz) => {
      const ch = new THREE.Group();
      ch.position.set(8.45 + cx, 0.04, -2.3 + cz);
      ch.rotation.y = cz > 0 ? 0 : Math.PI;
      const cSeat = new THREE.Mesh(createRoundedBoxGeometry(0.44, 0.08, 0.44, 0.03), linenTaupeMat);
      cSeat.position.y = 0.44;
      const cBack = new THREE.Mesh(createRoundedBoxGeometry(0.42, 0.4, 0.07, 0.03), linenTaupeMat);
      cBack.position.set(0, 0.66, 0.19);
      const cLegs = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.38), darkMetalMat);
      cLegs.position.y = 0.21;
      cLegs.scale.set(0.14, 1, 0.14);
      ch.add(cSeat, cBack, cLegs);
      group.add(ch);
    });
  });
  // Pendant Chandelier + Aparador (Sideboard) + Art + Plant
  const diningPendant = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.3, 0.18, 20),
    brushedBrassMat,
  );
  diningPendant.position.set(8.45, 2.15, -2.3);
  const diningBulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), roomSpotMat);
  diningBulb.position.set(8.45, 2.04, -2.3);
  const sideboard = new THREE.Mesh(createRoundedBoxGeometry(2.1, 0.82, 0.48, 0.025), walnutMat);
  sideboard.position.set(8.5, 0.44, -4.45);
  const sideVase = createCeramicVase(0.25, 0.08, 0xede9e1);
  sideVase.position.set(7.85, 0.85, -4.45);
  const diningArt = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.04), oakMat);
  diningArt.position.set(8.5, 1.65, -4.72);
  const diningArtCanvas = new THREE.Mesh(
    new THREE.PlaneGeometry(1.1, 0.8),
    new THREE.MeshStandardMaterial({ map: textures.artLiving, roughness: 0.7 }),
  );
  diningArtCanvas.position.set(8.5, 1.65, -4.695);
  group.add(diningTableTop, diningPendant, diningBulb, sideboard, sideVase, diningArt, diningArtCanvas);
  group.add(createOrganicPlant(10.55, 0.04, -4.2, 0.95, 0xd6cfc2, castShadows));

  // --- F. LAVANDERIA (x: 5.80 .. 11.20, z: -9.40 .. -4.85) ---
  const laundryCounter = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.88, 0.72), ceramicWhiteMat);
  laundryCounter.position.set(9.45, 0.48, -5.35);
  const laundryTop = new THREE.Mesh(new THREE.BoxGeometry(3.26, 0.05, 0.76), oakMat);
  laundryTop.position.set(9.45, 0.94, -5.35);
  // Utility Sink (Tanque)
  const utilitySink = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.24, 0.5), brushedSteelMat);
  utilitySink.position.set(10.45, 0.86, -5.35);
  // Upper Shelves & Detergent Bottles
  const laundryShelf = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.04, 0.34), oakMat);
  laundryShelf.position.set(9.5, 1.85, -5.12);
  [0x315eaa, 0x239b69, 0xd99b27].forEach((col, bi) => {
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.065, 0.22, 12),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.45 }),
    );
    bottle.position.set(8.8 + bi * 0.24, 1.98, -5.12);
    group.add(bottle);
  });
  // Woven Laundry Basket
  const basket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.19, 0.48, 16),
    linenTaupeMat,
  );
  basket.position.set(6.55, 0.28, -5.6);
  group.add(laundryCounter, laundryTop, utilitySink, laundryShelf, basket);

  // --- G. GARAGEM INTEGRADA (x: 5.80 .. 11.20, z: 0.20 .. 6.40) ---
  // Parked Contemporary EV Sedan inside Garage
  const parkedCar = new THREE.Group();
  parkedCar.position.set(8.45, 0.04, 3.35);
  const carPaintMat = new THREE.MeshPhysicalMaterial({
    color: 0x64748b,
    metalness: 0.72,
    roughness: 0.22,
    clearcoat: 0.9,
  });
  const carBody = new THREE.Mesh(createRoundedBoxGeometry(1.92, 0.62, 4.15, 0.12), carPaintMat);
  carBody.position.y = 0.56;
  const carCabin = new THREE.Mesh(createRoundedBoxGeometry(1.56, 0.54, 2.15, 0.12), glassMat);
  carCabin.position.set(0, 1.05, -0.15);
  const carRoof = new THREE.Mesh(createRoundedBoxGeometry(1.48, 0.06, 1.85, 0.02), carPaintMat);
  carRoof.position.set(0, 1.32, -0.15);
  [
    [-0.94, 0.34, 1.25],
    [0.94, 0.34, 1.25],
    [-0.94, 0.34, -1.25],
    [0.94, 0.34, -1.25],
  ].forEach(([wx, wy, wz]) => {
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.22, 18), darkMetalMat);
    tire.rotation.z = Math.PI / 2;
    tire.position.set(wx, wy, wz);
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.23, 14),
      brushedSteelMat,
    );
    rim.rotation.z = Math.PI / 2;
    rim.position.set(wx, wy, wz);
    parkedCar.add(tire, rim);
  });
  parkedCar.add(carBody, carCabin, carRoof);
  parkedCar.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) c.castShadow = castShadows;
  });

  // Garage Storage Shelves + Cabinets + Workbench + Tools + Mounted Bicycle
  const garageRack = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.85, 0.52), darkMetalMat);
  garageRack.position.set(8.4, 0.96, 0.58);
  const workbench = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.9, 2.2), oakMat);
  workbench.position.set(10.72, 0.49, 2.4);
  const toolBoard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.85, 1.8), darkMetalMat);
  toolBoard.position.set(11.05, 1.48, 2.4);
  // Road Bicycle leaning against West Garage Wall
  const bikeGroup = new THREE.Group();
  bikeGroup.position.set(6.15, 0.04, 4.4);
  [-0.52, 0.52].forEach((bz) => {
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.028, 8, 20), darkMetalMat);
    wheel.rotation.y = Math.PI / 2;
    wheel.position.set(0, 0.34, bz);
    bikeGroup.add(wheel);
  });
  const bikeFrame = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.96), terracottaMat);
  bikeFrame.position.set(0, 0.62, 0);
  bikeGroup.add(bikeFrame);
  group.add(parkedCar, garageRack, workbench, toolBoard, bikeGroup);

  return {
    group,
    fireplaceGlowMat,
    roomSpotMat,
  };
}
