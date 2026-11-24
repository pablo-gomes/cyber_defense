import * as THREE from 'three';
import {
  ARCH,
  CORNER_POSTS,
  GRID_X,
  GRID_Z,
  ROOM_RECTS,
  WALL_SEGMENTS,
  WallOpeningSpec,
  WallSegmentSpec,
} from './architectureSpec';
import { ProceduralTextureSet } from './proceduralTextures';

export interface HouseBuildResult {
  group: THREE.Group;
  structureGroup: THREE.Group;
  wallCapGroup: THREE.Group;
  ceilingGroup: THREE.Group;
  roofGroup: THREE.Group;
  furnitureGroup: THREE.Group;
  fireplaceGlowMat: THREE.MeshStandardMaterial;
  roomSpotMat: THREE.MeshStandardMaterial;
}

export function createRoundedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  radius = 0.04,
): THREE.ExtrudeGeometry {
  const r = Math.min(radius, width * 0.24, height * 0.24, depth * 0.24);
  const innerW = Math.max(0.01, width - r * 2);
  const innerH = Math.max(0.01, height - r * 2);
  const shape = new THREE.Shape();
  shape.moveTo(-innerW / 2, -innerH / 2);
  shape.lineTo(innerW / 2, -innerH / 2);
  shape.lineTo(innerW / 2, innerH / 2);
  shape.lineTo(-innerW / 2, innerH / 2);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.01, depth - r * 2),
    bevelEnabled: true,
    bevelThickness: r,
    bevelSize: r,
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
  const mesh = new THREE.Mesh(
    geom,
    new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.05 }),
  );
  mesh.userData.archCategory = 'decor';
  return mesh;
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
  plant.userData.archCategory = 'furniture';

  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2 * scale, 0.16 * scale, 0.32 * scale, 16),
    new THREE.MeshStandardMaterial({ color: potColor, roughness: 0.68, metalness: 0.04 }),
  );
  pot.position.y = 0.16 * scale;
  pot.castShadow = castShadow;
  pot.receiveShadow = true;

  const soil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18 * scale, 0.18 * scale, 0.04 * scale, 14),
    new THREE.MeshStandardMaterial({ color: 0x4b3b2c, roughness: 0.95 }),
  );
  soil.position.y = 0.3 * scale;

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02 * scale, 0.032 * scale, 0.54 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x6b4f3a, roughness: 0.88 }),
  );
  stem.position.y = 0.54 * scale;

  const leafShades = [0x4c7c59, 0x5c8f68, 0x3f6b4b, 0x679c73];
  const clusters: Array<[number, number, number, number]> = [
    [0, 0.86, 0, 0.21],
    [0.13, 0.76, 0.08, 0.16],
    [-0.13, 0.78, -0.08, 0.17],
    [0.05, 1.01, -0.05, 0.14],
    [-0.06, 0.94, 0.11, 0.13],
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
  g.userData.archCategory = 'decor';
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, width + 0.32, 10), rodMat);
  rod.rotation.z = Math.PI / 2;
  rod.position.y = height / 2 + 0.06;
  g.add(rod);

  const panelOffset = width * 0.42;
  [-panelOffset, panelOffset].forEach((px) => {
    for (let p = -1; p <= 1; p++) {
      const fold = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.05, height, 10),
        mat,
      );
      fold.scale.z = 0.55;
      fold.position.set(px + p * 0.055, 0, 0);
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
  group.name = 'smart-home-architecture-reconstructed';

  const structureGroup = new THREE.Group();
  structureGroup.name = 'arch-structure';
  const wallCapGroup = new THREE.Group();
  wallCapGroup.name = 'arch-wall-caps';
  const ceilingGroup = new THREE.Group();
  ceilingGroup.name = 'arch-ceilings';
  const roofGroup = new THREE.Group();
  roofGroup.name = 'arch-roof';
  const furnitureGroup = new THREE.Group();
  furnitureGroup.name = 'arch-furniture';

  group.add(structureGroup, wallCapGroup, ceilingGroup, roofGroup, furnitureGroup);

  const FY = ARCH.FLOOR_Y; // 0.04m finished interior floor top

  // =========================================================================
  // ARCHITECTURAL PBR PALETTE
  // =========================================================================
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf4f1eb,
    roughness: 0.84,
    metalness: 0.02,
  });
  const accentWallMat = new THREE.MeshStandardMaterial({
    color: 0xe6e1d7,
    roughness: 0.85,
    metalness: 0.02,
  });
  const baseboardMat = new THREE.MeshStandardMaterial({
    color: 0xe8e4dc,
    roughness: 0.54,
    metalness: 0.04,
  });
  const wallCapMat = new THREE.MeshStandardMaterial({
    color: 0x3b4252,
    roughness: 0.55,
    metalness: 0.22,
  });
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0xf9f8f5,
    roughness: 0.9,
    metalness: 0.01,
  });
  const roofSlabMat = new THREE.MeshStandardMaterial({
    color: 0xdfe4ea,
    roughness: 0.72,
    metalness: 0.08,
  });
  const roofFasciaMat = new THREE.MeshStandardMaterial({
    color: 0x2a3342,
    roughness: 0.42,
    metalness: 0.48,
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
  const stoneThresholdMat = new THREE.MeshStandardMaterial({
    map: textures.stonePaver,
    roughness: 0.62,
    metalness: 0.05,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xdbeafe,
    roughness: 0.05,
    metalness: 0.04,
    transparent: true,
    opacity: castShadows ? 0.25 : 0.32,
    transmission: castShadows ? 0.65 : 0,
    ior: 1.5,
    depthWrite: false,
  });
  const frostedGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    roughness: 0.42,
    metalness: 0.04,
    transparent: true,
    opacity: 0.65,
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

  // Floor materials
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
  const deckFloorMat = new THREE.MeshStandardMaterial({
    map: textures.deckWood,
    roughness: 0.7,
    metalness: 0.04,
  });

  const FLOOR_MAT_MAP: Record<string, THREE.Material> = {
    wood_oak: woodFloorMat,
    wood_walnut: bedroomWoodMat,
    porcelain: tileMat,
    terrazzo: bathFloorMat,
    epoxy: garageFloorMat,
    deck: deckFloorMat,
  };

  // =========================================================================
  // 0. NON-OVERLAPPING ARCHITECTURAL FOUNDATION PLINTHS (Y = -0.24 .. 0.00)
  // =========================================================================
  // Split cleanly into rectangular structural sub-slabs matching the exact
  // building footprint wings (with slight 0.08m exterior plinth reveal).
  const foundationMat = new THREE.MeshStandardMaterial({
    color: 0xd4d0c8,
    roughness: 0.86,
    metalness: 0.02,
  });

  const addFoundationSlab = (minX: number, maxX: number, minZ: number, maxZ: number) => {
    const w = maxX - minX;
    const d = maxZ - minZ;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, ARCH.FOUNDATION_H, d),
      foundationMat,
    );
    mesh.position.set((minX + maxX) / 2, -ARCH.FOUNDATION_H / 2, (minZ + maxZ) / 2);
    mesh.receiveShadow = true;
    mesh.userData.archCategory = 'foundation';
    structureGroup.add(mesh);
  };

  // West wing (-11.34 .. -5.60, -9.54 .. 4.64)
  addFoundationSlab(GRID_X.WEST_EXT - 0.14, GRID_X.WEST_SPINE, GRID_Z.NORTH_EXT - 0.14, GRID_Z.SOUTH_LIVING + 0.14);
  // Central wing (-5.60 .. 0.50, -5.04 .. 6.94)
  addFoundationSlab(GRID_X.WEST_SPINE, GRID_X.CENTER_SPINE, GRID_Z.NORTH_SPINE - 0.14, GRID_Z.SOUTH_HALL + 0.14);
  // Mid-East wing (0.50 .. 5.80, -9.54 .. 4.86)
  addFoundationSlab(GRID_X.CENTER_SPINE, GRID_X.EAST_SPINE, GRID_Z.NORTH_EXT - 0.14, 4.86);
  // East wing (5.80 .. 11.34, -9.54 .. 6.54)
  addFoundationSlab(GRID_X.EAST_SPINE, GRID_X.EAST_EXT + 0.14, GRID_Z.NORTH_EXT - 0.14, GRID_Z.SOUTH_GARAGE + 0.14);

  const contactShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(26.5, 20.5),
    new THREE.MeshBasicMaterial({
      map: textures.contactShadow,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    }),
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.set(0.0, -0.235, -1.3);
  contactShadow.userData.archCategory = 'decor';
  structureGroup.add(contactShadow);

  // =========================================================================
  // 1. EXACT NON-OVERLAPPING ROOM FLOORS (Y = 0.00 .. 0.04)
  // =========================================================================
  const halfT = ARCH.WALL_T / 2;
  const houseFloorRoomIds = [
    'guest_bedroom',
    'bathroom',
    'office',
    'bedroom',
    'living_room',
    'hallway',
    'kitchen',
    'exterior',
    'gourmet',
    'laundry',
    'dining_room',
    'garage',
  ] as const;

  for (const rId of houseFloorRoomIds) {
    const spec = ROOM_RECTS[rId];
    const mat = FLOOR_MAT_MAP[spec.floorType] ?? tileMat;
    // Trim interior floors cleanly up to inner wall faces so floor slabs never bleed through walls
    const inMinX = spec.minX + halfT;
    const inMaxX = spec.maxX - halfT;
    // Outdoor decks extend slightly to open outer edge where there is no perimeter wall
    const inMinZ =
      rId === 'gourmet' ? spec.minZ : spec.minZ + halfT;
    const inMaxZ =
      rId === 'exterior' ? spec.maxZ : spec.maxZ - halfT;

    const w = inMaxX - inMinX;
    const d = inMaxZ - inMinZ;
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w, ARCH.FLOOR_THICK, d), mat);
    slab.position.set((inMinX + inMaxX) / 2, ARCH.FLOOR_THICK / 2, (inMinZ + inMaxZ) / 2);
    slab.receiveShadow = true;
    slab.userData.archCategory = 'floor';
    slab.userData.roomId = rId;
    structureGroup.add(slab);
  }

  // Front Porch Terrace Steps & Entry Stone Landing (non-overlapping with Hallway/Garage)
  const frontPorchLanding = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.14, 1.35),
    stoneThresholdMat,
  );
  frontPorchLanding.position.set(-2.55, -0.05, 7.56);
  frontPorchLanding.receiveShadow = true;
  frontPorchLanding.userData.archCategory = 'foundation';
  structureGroup.add(frontPorchLanding);

  // Connecting step between Front Terrace Deck (x: 0.59..2.0, z=4.80) and Front Walkway
  const terraceStep = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.14, 0.65),
    stoneThresholdMat,
  );
  terraceStep.position.set(1.34, -0.05, 5.15);
  terraceStep.receiveShadow = true;
  terraceStep.userData.archCategory = 'foundation';
  structureGroup.add(terraceStep);

  // =========================================================================
  // 2. PARAMETRIC CORNER POSTS & WALL-WITH-OPENINGS BUILDER
  // =========================================================================
  for (const post of CORNER_POSTS) {
    const pMat = post.materialVariant === 'accent' ? accentWallMat : wallMat;
    const col = new THREE.Mesh(
      new THREE.BoxGeometry(ARCH.WALL_T, ARCH.WALL_H, ARCH.WALL_T),
      pMat,
    );
    col.position.set(post.x, ARCH.WALL_H / 2, post.z);
    col.castShadow = castShadows;
    col.receiveShadow = true;
    col.userData.archCategory = 'post';
    col.userData.archId = post.id;
    structureGroup.add(col);

    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(ARCH.WALL_T, ARCH.CAP_H, ARCH.WALL_T),
      wallCapMat,
    );
    cap.position.set(post.x, ARCH.WALL_H + ARCH.CAP_H / 2, post.z);
    cap.userData.archCategory = 'wallcap';
    wallCapGroup.add(cap);
  }

  const addWallBox = (
    axis: 'x' | 'z',
    fixedCoord: number,
    spanStart: number,
    spanEnd: number,
    bottomY: number,
    topY: number,
    mat: THREE.Material,
    wallId: string,
    includeCap: boolean,
    includeBaseboard: boolean,
  ) => {
    const len = spanEnd - spanStart;
    const h = topY - bottomY;
    if (len <= 0.005 || h <= 0.005) return;

    const mid = (spanStart + spanEnd) / 2;
    const cy = (bottomY + topY) / 2;
    const w = axis === 'x' ? len : ARCH.WALL_T;
    const d = axis === 'x' ? ARCH.WALL_T : len;

    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(axis === 'x' ? mid : fixedCoord, cy, axis === 'x' ? fixedCoord : mid);
    mesh.castShadow = castShadows;
    mesh.receiveShadow = true;
    mesh.userData.archCategory = 'wall';
    mesh.userData.archId = wallId;
    structureGroup.add(mesh);

    if (includeCap && Math.abs(topY - ARCH.WALL_H) < 0.01) {
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(w, ARCH.CAP_H, d),
        wallCapMat,
      );
      cap.position.set(
        axis === 'x' ? mid : fixedCoord,
        ARCH.WALL_H + ARCH.CAP_H / 2,
        axis === 'x' ? fixedCoord : mid,
      );
      cap.userData.archCategory = 'wallcap';
      wallCapGroup.add(cap);
    }

    if (includeBaseboard && bottomY < 0.05) {
      // Split baseboards strictly on the two sides of the wall, sitting flush on FLOOR_Y
      const bbThick = ARCH.BASEBOARD_PROTRUSION;
      const bbW = axis === 'x' ? len : bbThick;
      const bbD = axis === 'x' ? bbThick : len;
      const offset = ARCH.WALL_T / 2 + bbThick / 2;
      [-offset, offset].forEach((sideOffset) => {
        const bb = new THREE.Mesh(
          new THREE.BoxGeometry(bbW, ARCH.BASEBOARD_H, bbD),
          baseboardMat,
        );
        bb.position.set(
          axis === 'x' ? mid : fixedCoord + sideOffset,
          FY + ARCH.BASEBOARD_H / 2,
          axis === 'x' ? fixedCoord + sideOffset : mid,
        );
        bb.receiveShadow = true;
        bb.userData.archCategory = 'baseboard';
        structureGroup.add(bb);
      });
    }
  };

  const buildOpeningAssembly = (wall: WallSegmentSpec, op: WallOpeningSpec) => {
    const axis = wall.axis;
    const fixed = wall.fixedCoord;
    const grp = new THREE.Group();
    grp.userData.archCategory = 'opening';
    grp.userData.openingId = op.id;

    // Position local frame at opening center, Y = 0, and rotate if N-S wall
    grp.position.set(axis === 'x' ? op.centerCoord : fixed, 0, axis === 'x' ? fixed : op.centerCoord);
    if (axis === 'z') {
      grp.rotation.y = Math.PI / 2;
    }

    const ow = op.width;
    const oh = op.height;
    const sy = op.sillY;
    const wt = ARCH.WALL_T;

    // Threshold / Soleira at floor level for doorways
    if (op.threshold && op.threshold !== 'none' && sy === 0) {
      const thMat = op.threshold === 'stone' ? stoneThresholdMat : oakMat;
      const th = new THREE.Mesh(new THREE.BoxGeometry(ow, ARCH.FLOOR_THICK, wt), thMat);
      th.position.set(0, ARCH.FLOOR_THICK / 2, 0);
      th.receiveShadow = true;
      th.userData.archCategory = 'threshold';
      grp.add(th);
    }

    if (op.type === 'portal_arch') {
      // Clean cased architectural passage (wood/metal jambs + header trim, no door leaf)
      const jambT = 0.04;
      const trimW = wt + 0.03;
      const topY = sy + oh;
      const leftJ = new THREE.Mesh(new THREE.BoxGeometry(jambT, oh - FY, trimW), oakMat);
      leftJ.position.set(-ow / 2 + jambT / 2, FY + (oh - FY) / 2, 0);
      const rightJ = new THREE.Mesh(new THREE.BoxGeometry(jambT, oh - FY, trimW), oakMat);
      rightJ.position.set(ow / 2 - jambT / 2, FY + (oh - FY) / 2, 0);
      const headJ = new THREE.Mesh(new THREE.BoxGeometry(ow, jambT, trimW), oakMat);
      headJ.position.set(0, topY - jambT / 2, 0);
      grp.add(leftJ, rightJ, headJ);
    } else if (op.type === 'door_hinged') {
      // Complete door assembly: frame jambs, casing, partially open hinged wood door leaf + brass handle
      const jambT = 0.045;
      const frameD = wt + 0.025;
      const doorBaseY = FY;
      const clearH = oh - doorBaseY;

      const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(jambT, clearH, frameD), oakMat);
      leftJamb.position.set(-ow / 2 + jambT / 2, doorBaseY + clearH / 2, 0);
      const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(jambT, clearH, frameD), oakMat);
      rightJamb.position.set(ow / 2 - jambT / 2, doorBaseY + clearH / 2, 0);
      const headJamb = new THREE.Mesh(new THREE.BoxGeometry(ow, jambT, frameD), oakMat);
      headJamb.position.set(0, oh - jambT / 2, 0);
      grp.add(leftJamb, rightJamb, headJamb);

      // Door Leaf pivoted cleanly from hinge side
      const leafW = ow - jambT * 2 - 0.02;
      const leafH = clearH - jambT - 0.015;
      const leafMat = wall.isExterior ? walnutMat : oakMat;
      const hingeSign = op.hingeSide ?? 1;
      const swingSign = op.swingDir ?? 1;

      const hingePivot = new THREE.Group();
      hingePivot.position.set(hingeSign * (ow / 2 - jambT - 0.01), doorBaseY, 0);
      // Open cleanly at ~38 degrees so passages are visibly inviting & readable
      hingePivot.rotation.y = hingeSign * swingSign * 0.62;

      const leafMesh = new THREE.Mesh(new THREE.BoxGeometry(leafW, leafH, 0.045), leafMat);
      leafMesh.position.set(-hingeSign * (leafW / 2), leafH / 2, 0);
      leafMesh.castShadow = castShadows;
      leafMesh.receiveShadow = true;

      // Brushed brass lever handles on both sides
      const handleGeo = new THREE.BoxGeometry(0.13, 0.024, 0.11);
      const handle = new THREE.Mesh(handleGeo, brushedBrassMat);
      handle.position.set(-hingeSign * (leafW - 0.09), 0.98, 0);

      hingePivot.add(leafMesh, handle);
      grp.add(hingePivot);
    } else if (op.type === 'door_double_entry') {
      // Architectural pivot entry door + glazed sidelight inside matte dark-metal frame
      const frameT = 0.055;
      const frameD = wt + 0.03;
      const doorBaseY = FY;
      const clearH = oh - doorBaseY;

      const leftJ = new THREE.Mesh(new THREE.BoxGeometry(frameT, clearH, frameD), darkMetalMat);
      leftJ.position.set(-ow / 2 + frameT / 2, doorBaseY + clearH / 2, 0);
      const rightJ = new THREE.Mesh(new THREE.BoxGeometry(frameT, clearH, frameD), darkMetalMat);
      rightJ.position.set(ow / 2 - frameT / 2, doorBaseY + clearH / 2, 0);
      const headJ = new THREE.Mesh(new THREE.BoxGeometry(ow, frameT, frameD), darkMetalMat);
      headJ.position.set(0, oh - frameT / 2, 0);

      const innerW = ow - frameT * 2;
      const doorW = innerW * 0.68;
      const sideW = innerW - doorW - 0.04;
      const mullionX = -ow / 2 + frameT + doorW + 0.02;

      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.04, clearH - frameT, wt), darkMetalMat);
      mullion.position.set(mullionX, doorBaseY + (clearH - frameT) / 2, 0);

      const leaf = new THREE.Mesh(
        new THREE.BoxGeometry(doorW - 0.01, clearH - frameT - 0.01, 0.06),
        walnutMat,
      );
      leaf.position.set(-ow / 2 + frameT + doorW / 2, doorBaseY + (clearH - frameT) / 2, 0);
      leaf.castShadow = castShadows;

      const pullBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.85, 10),
        brushedSteelMat,
      );
      pullBar.position.set(mullionX - 0.16, doorBaseY + 1.08, 0.06);

      const sidelight = new THREE.Mesh(
        new THREE.BoxGeometry(sideW, clearH - frameT - 0.02, 0.03),
        glassMat,
      );
      sidelight.position.set(ow / 2 - frameT - sideW / 2, doorBaseY + (clearH - frameT) / 2, 0);

      grp.add(leftJ, rightJ, headJ, mullion, leaf, pullBar, sidelight);
    } else if (op.type === 'door_sliding_glass') {
      // Patio sliding glass door (2 overlapping glazed panels + aluminum frame + track)
      const frameT = 0.05;
      const doorBaseY = FY;
      const clearH = oh - doorBaseY;
      const frameD = wt + 0.02;

      const leftJ = new THREE.Mesh(new THREE.BoxGeometry(frameT, clearH, frameD), darkMetalMat);
      leftJ.position.set(-ow / 2 + frameT / 2, doorBaseY + clearH / 2, 0);
      const rightJ = new THREE.Mesh(new THREE.BoxGeometry(frameT, clearH, frameD), darkMetalMat);
      rightJ.position.set(ow / 2 - frameT / 2, doorBaseY + clearH / 2, 0);
      const headJ = new THREE.Mesh(new THREE.BoxGeometry(ow, frameT, frameD), darkMetalMat);
      headJ.position.set(0, oh - frameT / 2, 0);
      const track = new THREE.Mesh(new THREE.BoxGeometry(ow, 0.025, frameD), darkMetalMat);
      track.position.set(0, doorBaseY + 0.012, 0);

      const panelW = (ow - frameT * 2) * 0.52;
      const panelH = clearH - frameT - 0.03;
      [-1, 1].forEach((side, idx) => {
        const px = side * (ow / 2 - frameT - panelW / 2);
        const pz = idx === 0 ? -0.025 : 0.025;
        const pane = new THREE.Mesh(new THREE.BoxGeometry(panelW - 0.04, panelH - 0.04, 0.025), glassMat);
        pane.position.set(px, doorBaseY + 0.025 + panelH / 2, pz);
        const stileL = new THREE.Mesh(new THREE.BoxGeometry(0.035, panelH, 0.04), darkMetalMat);
        stileL.position.set(px - panelW / 2 + 0.018, doorBaseY + 0.025 + panelH / 2, pz);
        const stileR = new THREE.Mesh(new THREE.BoxGeometry(0.035, panelH, 0.04), darkMetalMat);
        stileR.position.set(px + panelW / 2 - 0.018, doorBaseY + 0.025 + panelH / 2, pz);
        grp.add(pane, stileL, stileR);
      });
      grp.add(leftJ, rightJ, headJ, track);
    } else if (op.type === 'door_garage') {
      // Garage door jambs & lintel trim (actual motorized garage door is interactive IoT device 'garage_gate')
      const frameT = 0.06;
      const frameD = wt + 0.03;
      const clearH = oh - FY;
      const leftJ = new THREE.Mesh(new THREE.BoxGeometry(frameT, clearH, frameD), darkMetalMat);
      leftJ.position.set(-ow / 2 + frameT / 2, FY + clearH / 2, 0);
      const rightJ = new THREE.Mesh(new THREE.BoxGeometry(frameT, clearH, frameD), darkMetalMat);
      rightJ.position.set(ow / 2 - frameT / 2, FY + clearH / 2, 0);
      const headJ = new THREE.Mesh(new THREE.BoxGeometry(ow, frameT, frameD), darkMetalMat);
      headJ.position.set(0, oh - frameT / 2, 0);
      grp.add(leftJ, rightJ, headJ);
    } else {
      // Window ('window' | 'interior_glass_window' | 'window_clerestory')
      const frameT = 0.045;
      const frameD = wt + 0.02;
      const winGlass = op.type === 'window_clerestory' ? frostedGlassMat : glassMat;
      const midY = sy + oh / 2;

      // Exterior/Interior Stone Sill (Peitoril)
      const sill = new THREE.Mesh(
        new THREE.BoxGeometry(ow + 0.06, 0.045, wt + 0.06),
        op.type === 'interior_glass_window' ? oakMat : darkMetalMat,
      );
      sill.position.set(0, sy + 0.02, 0);
      sill.castShadow = castShadows;
      sill.receiveShadow = true;

      const head = new THREE.Mesh(new THREE.BoxGeometry(ow, frameT, frameD), darkMetalMat);
      head.position.set(0, sy + oh - frameT / 2, 0);
      const leftStile = new THREE.Mesh(new THREE.BoxGeometry(frameT, oh - frameT, frameD), darkMetalMat);
      leftStile.position.set(-ow / 2 + frameT / 2, midY, 0);
      const rightStile = new THREE.Mesh(new THREE.BoxGeometry(frameT, oh - frameT, frameD), darkMetalMat);
      rightStile.position.set(ow / 2 - frameT / 2, midY, 0);

      const pane = new THREE.Mesh(
        new THREE.BoxGeometry(ow - frameT * 2, oh - frameT * 1.6, 0.028),
        winGlass,
      );
      pane.position.set(0, midY, 0);

      // Center vertical mullion on wide windows
      if (ow >= 1.4) {
        const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.04, oh - frameT * 1.5, 0.06), darkMetalMat);
        mullion.position.set(0, midY, 0);
        grp.add(mullion);
      }

      grp.add(sill, head, leftStile, rightStile, pane);

      if (op.curtainSide) {
        const curtains = createCurtainSet(ow - 0.06, oh + 0.45, linenLightMat, darkMetalMat);
        curtains.position.set(0, midY + 0.05, op.curtainSide * (wt / 2 + 0.1));
        grp.add(curtains);
      }
    }

    structureGroup.add(grp);
  };

  for (const wall of WALL_SEGMENTS) {
    const wMat = wall.materialVariant === 'accent' ? accentWallMat : wallMat;
    const segStart = wall.start + halfT;
    const segEnd = wall.end - halfT;
    const sortedOpenings = [...wall.openings].sort((a, b) => a.centerCoord - b.centerCoord);

    let cursor = segStart;
    for (const op of sortedOpenings) {
      const opMin = op.centerCoord - op.width / 2;
      const opMax = op.centerCoord + op.width / 2;

      // Solid full-height pier before opening
      if (opMin - cursor > 0.005) {
        addWallBox(wall.axis, wall.fixedCoord, cursor, opMin, 0, ARCH.WALL_H, wMat, wall.id, true, true);
      }

      // Sill wall below window (if sillY > 0)
      if (op.sillY > 0.01) {
        addWallBox(
          wall.axis,
          wall.fixedCoord,
          opMin,
          opMax,
          0,
          op.sillY,
          wMat,
          `${wall.id}_sill`,
          false,
          true,
        );
      }

      // Lintel header above opening (from op.sillY + op.height up to ARCH.WALL_H)
      const opTop = op.sillY + op.height;
      if (ARCH.WALL_H - opTop > 0.01) {
        addWallBox(
          wall.axis,
          wall.fixedCoord,
          opMin,
          opMax,
          opTop,
          ARCH.WALL_H,
          wMat,
          `${wall.id}_lintel`,
          true,
          false,
        );
      }

      buildOpeningAssembly(wall, op);
      cursor = opMax;
    }

    // Remaining solid wall after last opening
    if (segEnd - cursor > 0.005) {
      addWallBox(wall.axis, wall.fixedCoord, cursor, segEnd, 0, ARCH.WALL_H, wMat, wall.id, true, true);
    }
  }

  // Front Terrace Architectural Glass Balustrade (South & East open edges of Terrace)
  const terraceRailGlass = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.92, 0.04), glassMat);
  terraceRailGlass.position.set(3.88, FY + 0.46, 4.72);
  const terraceRailTop = new THREE.Mesh(new THREE.BoxGeometry(3.78, 0.045, 0.08), darkMetalMat);
  terraceRailTop.position.set(3.88, FY + 0.94, 4.72);
  [2.05, 3.9, 5.68].forEach((px) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.94, 0.055), darkMetalMat);
    post.position.set(px, FY + 0.47, 4.72);
    structureGroup.add(post);
  });
  structureGroup.add(terraceRailGlass, terraceRailTop);

  // =========================================================================
  // 3. CEILINGS, RECESSED DOWNLIGHTS & ARCHITECTURAL ROOF (COBERTURA)
  // =========================================================================
  for (const rId of houseFloorRoomIds) {
    const spec = ROOM_RECTS[rId];
    if (!spec.hasCeiling) continue;
    const w = spec.maxX - spec.minX;
    const d = spec.maxZ - spec.minZ;
    const cx = (spec.minX + spec.maxX) / 2;
    const cz = (spec.minZ + spec.maxZ) / 2;

    const ceilSlab = new THREE.Mesh(
      new THREE.BoxGeometry(w, ARCH.CEILING_THICK, d),
      ceilingMat,
    );
    ceilSlab.position.set(cx, ARCH.CEILING_Y + ARCH.CEILING_THICK / 2, cz);
    ceilSlab.receiveShadow = true;
    ceilSlab.userData.archCategory = 'ceiling';
    ceilingGroup.add(ceilSlab);
  }

  // Recessed Architectural Ceiling Downlights (visible in Full & Interior modes)
  [
    [-3.1, -0.35],
    [-1.9, 2.2],
    [-3.2, -2.8],
    [2.7, -2.35],
    [4.2, -2.35],
    [8.65, -2.3],
    [-8.6, 1.85],
    [-8.4, -2.85],
    [-8.4, -7.1],
    [8.5, -7.1],
    [8.5, 3.3],
    [-2.55, 5.65],
  ].forEach(([sx, sz]) => {
    const bezel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.095, 0.018, 16),
      darkMetalMat,
    );
    bezel.position.set(sx, ARCH.CEILING_Y - 0.005, sz);
    const bulb = new THREE.Mesh(
      new THREE.CylinderGeometry(0.072, 0.072, 0.022, 16),
      roomSpotMat,
    );
    bulb.position.set(sx, ARCH.CEILING_Y - 0.008, sz);
    ceilingGroup.add(bezel, bulb);
  });

  // --- CONTEMPORARY CANTILEVERED ROOF SYSTEM (roofGroup) ---
  const ROOF_BASE_Y = ARCH.CEILING_Y + ARCH.CEILING_THICK; // 2.90m

  const addRoofVolume = (
    minX: number,
    maxX: number,
    minZ: number,
    maxZ: number,
    baseY: number,
    thick: number,
    withParapet = true,
  ) => {
    const w = maxX - minX;
    const d = maxZ - minZ;
    const cx = (minX + maxX) / 2;
    const cz = (minZ + maxZ) / 2;

    const slab = new THREE.Mesh(new THREE.BoxGeometry(w, thick, d), roofSlabMat);
    slab.position.set(cx, baseY + thick / 2, cz);
    slab.castShadow = castShadows;
    slab.receiveShadow = true;
    slab.userData.archCategory = 'roof';
    roofGroup.add(slab);

    // Sleek dark anodized fascia rim around cantilevered eaves
    if (withParapet) {
      const pH = ARCH.ROOF_PARAPET_H;
      const pT = 0.14;
      const pY = baseY + thick + pH / 2;
      const northP = new THREE.Mesh(new THREE.BoxGeometry(w, pH, pT), roofFasciaMat);
      northP.position.set(cx, pY, minZ + pT / 2);
      const southP = new THREE.Mesh(new THREE.BoxGeometry(w, pH, pT), roofFasciaMat);
      southP.position.set(cx, pY, maxZ - pT / 2);
      const westP = new THREE.Mesh(new THREE.BoxGeometry(pT, pH, d - pT * 2), roofFasciaMat);
      westP.position.set(minX + pT / 2, pY, cz);
      const eastP = new THREE.Mesh(new THREE.BoxGeometry(pT, pH, d - pT * 2), roofFasciaMat);
      eastP.position.set(maxX - pT / 2, pY, cz);
      roofGroup.add(northP, southP, westP, eastP);
    }
  };

  // West Wing Roof (-11.65 .. -5.60, -9.85 .. 4.95) with deep 0.45m eaves
  addRoofVolume(GRID_X.WEST_EXT - 0.45, GRID_X.WEST_SPINE, GRID_Z.NORTH_EXT - 0.45, GRID_Z.SOUTH_LIVING + 0.45, ROOF_BASE_Y, ARCH.ROOF_THICK);
  // Central Spine High Clerestory Volume (-5.60 .. 0.50, -5.35 .. 7.35) slightly elevated (+0.18m) for architectural hierarchy
  addRoofVolume(GRID_X.WEST_SPINE, GRID_X.CENTER_SPINE, GRID_Z.NORTH_SPINE - 0.45, GRID_Z.SOUTH_HALL + 0.55, ROOF_BASE_Y + 0.14, ARCH.ROOF_THICK);
  // Kitchen & Dining Roof (0.50 .. 11.65, -5.35 .. 0.30)
  addRoofVolume(GRID_X.CENTER_SPINE, GRID_X.EAST_EXT + 0.45, GRID_Z.NORTH_SPINE - 0.45, GRID_Z.EAST_MID_SPINE, ROOF_BASE_Y, ARCH.ROOF_THICK);
  // Laundry Wing Roof (5.80 .. 11.65, -9.85 .. -5.35)
  addRoofVolume(GRID_X.EAST_SPINE, GRID_X.EAST_EXT + 0.45, GRID_Z.NORTH_EXT - 0.45, GRID_Z.NORTH_SPINE - 0.45, ROOF_BASE_Y, ARCH.ROOF_THICK);
  // Garage & Front Terrace Shared Canopy (0.50 .. 11.65, 0.30 .. 6.95)
  addRoofVolume(GRID_X.CENTER_SPINE, GRID_X.EAST_EXT + 0.45, GRID_Z.EAST_MID_SPINE, GRID_Z.SOUTH_GARAGE + 0.55, ROOF_BASE_Y, ARCH.ROOF_THICK);

  // Subtle Photovoltaic Solar Panels on Central Roof Spine (modern smart home touch!)
  const solarMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.18,
    metalness: 0.78,
  });
  [-3.8, -2.55, -1.3].forEach((sx) => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.04, 1.75), solarMat);
    panel.position.set(sx, ROOF_BASE_Y + 0.38, -2.2);
    panel.rotation.x = 0.14;
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.03, 1.8), brushedSteelMat);
    frame.position.set(sx, ROOF_BASE_Y + 0.37, -2.2);
    frame.rotation.x = 0.14;
    roofGroup.add(frame, panel);
  });

  // Fireplace Architectural Chimney Stack rising cleanly from Living Room fireplace
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.95, 0.42), roofFasciaMat);
  chimney.position.set(-3.35, ROOF_BASE_Y + 0.62, -0.58);
  roofGroup.add(chimney);

  // =========================================================================
  // 4. INTERIOR FURNITURE (100% GROUNDED AT FLOOR_Y = 0.04, CLEAR OF DOORS)
  // =========================================================================
  const addFurn = (obj: THREE.Object3D, name: string, mount?: 'wall' | 'ceiling' | 'rug') => {
    obj.name = name;
    obj.userData.archCategory = mount === 'rug' ? 'rug' : 'furniture';
    if (mount === 'wall' || mount === 'ceiling') {
      obj.userData.archMount = mount;
    }
    furnitureGroup.add(obj);
  };

  // --- A. SALA DE ESTAR (x: -5.51..0.41, z: -0.71..4.41) ---
  const livingRug = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 0.016, 2.4),
    new THREE.MeshStandardMaterial({ map: textures.rugLiving, roughness: 0.95 }),
  );
  livingRug.position.set(-3.2, FY + 0.008, 2.15);
  livingRug.receiveShadow = true;
  addFurn(livingRug, 'living_rug', 'rug');

  const sofaGroup = new THREE.Group();
  sofaGroup.position.set(-3.35, FY, 3.6);
  const sofaPlinth = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.14, 0.88), oakMat);
  sofaPlinth.position.y = 0.07;
  const seatGeom = createRoundedBoxGeometry(0.74, 0.2, 0.76, 0.045);
  [-0.76, 0, 0.76].forEach((sx) => {
    const cushion = new THREE.Mesh(seatGeom, linenLightMat);
    cushion.position.set(sx, 0.24, -0.02);
    sofaGroup.add(cushion);
  });
  const sofaBack = new THREE.Mesh(createRoundedBoxGeometry(2.3, 0.44, 0.18, 0.045), linenLightMat);
  sofaBack.position.set(0, 0.45, 0.34);
  const armGeom = createRoundedBoxGeometry(0.16, 0.36, 0.86, 0.04);
  const armL = new THREE.Mesh(armGeom, linenLightMat);
  armL.position.set(-1.14, 0.32, 0);
  const armR = new THREE.Mesh(armGeom, linenLightMat);
  armR.position.set(1.14, 0.32, 0);
  const throwBlanket = new THREE.Mesh(createRoundedBoxGeometry(0.22, 0.3, 0.5, 0.04), terracottaMat);
  throwBlanket.position.set(1.13, 0.36, 0.04);
  const pillow1 = new THREE.Mesh(createRoundedBoxGeometry(0.34, 0.3, 0.13, 0.04), terracottaMat);
  pillow1.position.set(-0.84, 0.46, 0.16);
  pillow1.rotation.set(-0.22, 0.2, 0);
  const pillow2 = new THREE.Mesh(createRoundedBoxGeometry(0.34, 0.3, 0.13, 0.04), sageCabinetMat);
  pillow2.position.set(-0.46, 0.44, 0.17);
  pillow2.rotation.set(-0.18, -0.1, 0);
  sofaGroup.add(sofaPlinth, sofaBack, armL, armR, throwBlanket, pillow1, pillow2);
  sofaGroup.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) {
      c.castShadow = castShadows;
      c.receiveShadow = true;
    }
  });
  addFurn(sofaGroup, 'living_sofa');

  // Accent Armchair (clear of terrace door & portals)
  const chairGroup = new THREE.Group();
  chairGroup.position.set(-1.35, FY, 1.95);
  chairGroup.rotation.y = -Math.PI * 0.32;
  const chairFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.3, 0.1, 20), oakMat);
  chairFrame.position.y = 0.05;
  const chairSeat = new THREE.Mesh(createRoundedBoxGeometry(0.62, 0.15, 0.6, 0.045), linenTaupeMat);
  chairSeat.position.y = 0.22;
  const chairBack = new THREE.Mesh(createRoundedBoxGeometry(0.6, 0.42, 0.15, 0.045), linenTaupeMat);
  chairBack.position.set(0, 0.43, 0.23);
  chairBack.rotation.x = -0.15;
  chairGroup.add(chairFrame, chairSeat, chairBack);
  addFurn(chairGroup, 'living_armchair');

  // Coffee Table & Decor (grouped)
  const coffeeTableGroup = new THREE.Group();
  coffeeTableGroup.position.set(-3.2, FY, 1.95);
  const coffeeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.32, 20), oakMat);
  coffeeBase.position.y = 0.16;
  const coffeeTop = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.54, 0.045, 28), marbleCounterMat);
  coffeeTop.position.y = 0.34;
  coffeeTop.castShadow = castShadows;
  coffeeTop.receiveShadow = true;
  const tableVase = createCeramicVase(0.2, 0.07, 0xd8d2c7);
  tableVase.position.set(-0.16, 0.36, -0.05);
  const book1 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.032, 0.17), terracottaMat);
  book1.position.set(0.18, 0.38, 0.07);
  coffeeTableGroup.add(coffeeBase, coffeeTop, tableVase, book1);
  addFurn(coffeeTableGroup, 'living_coffee_table');

  // TV Console & Fireplace along Bedroom dividing wall (z = -0.71, x = -3.35)
  const tvConsoleGroup = new THREE.Group();
  tvConsoleGroup.position.set(-3.35, FY, -0.45);
  const tvRack = new THREE.Mesh(createRoundedBoxGeometry(2.45, 0.3, 0.48, 0.025), oakMat);
  tvRack.position.y = 0.15;
  tvRack.castShadow = castShadows;
  const fireplaceRecess = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.24, 0.08), darkMetalMat);
  fireplaceRecess.position.set(0, 0.45, -0.21);
  const emberStrip = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.065, 0.05), fireplaceGlowMat);
  emberStrip.position.set(0, 0.39, -0.18);
  const rackVase = createCeramicVase(0.18, 0.055, 0x7c8b82);
  rackVase.position.set(1.0, 0.3, 0.01);
  tvConsoleGroup.add(tvRack, fireplaceRecess, emberStrip, rackVase);
  addFurn(tvConsoleGroup, 'living_tv_console');

  // Living Room Art on South-West wall (z = 4.38, wall-mounted)
  const livingArtGroup = new THREE.Group();
  livingArtGroup.position.set(-3.35, 1.65, 4.38);
  const artFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.95, 0.04), oakMat);
  const artCanvasL = new THREE.Mesh(
    new THREE.PlaneGeometry(0.75, 0.85),
    new THREE.MeshStandardMaterial({ map: textures.artLiving, roughness: 0.75 }),
  );
  artCanvasL.rotation.y = Math.PI;
  artCanvasL.position.z = -0.025;
  livingArtGroup.add(artFrameL, artCanvasL);
  addFurn(livingArtGroup, 'living_wall_art', 'wall');

  // Open Shelving Unit against West Solid Pier (x = -5.32, z = 0.25)
  const shelfGroup = new THREE.Group();
  shelfGroup.position.set(-5.32, FY, 0.25);
  [-0.42, 0.42].forEach((sz) => {
    const upright = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.85, 0.035), darkMetalMat);
    upright.position.set(0, 0.925, sz);
    shelfGroup.add(upright);
  });
  [0.25, 0.72, 1.2, 1.68].forEach((sy) => {
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 0.88), oakMat);
    board.position.set(0, sy, 0);
    shelfGroup.add(board);
  });
  [0x315eaa, 0xb97a5b, 0x64748b, 0xd8d2c7].forEach((col, bi) => {
    const bk = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.22 + (bi % 2) * 0.04, 0.05),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.75 }),
    );
    bk.position.set(0.02, 0.85, -0.22 + bi * 0.06);
    shelfGroup.add(bk);
  });
  addFurn(shelfGroup, 'living_shelf');

  // Speaker Side Table + Router Console
  const speakerTable = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.56, 20), oakMat);
  speakerTable.position.set(-4.72, FY + 0.28, 2.55);
  const routerConsole = new THREE.Mesh(createRoundedBoxGeometry(0.46, 0.74, 0.92, 0.025), oakMat);
  routerConsole.position.set(0.16, FY + 0.37, 0.95);
  addFurn(speakerTable, 'living_speaker_table');
  addFurn(routerConsole, 'living_router_console');

  // Floor Lamp (placed cleanly at x=-4.95, z=1.35 clear of door_living_office) & Corner Plant
  const floorLampGroup = new THREE.Group();
  floorLampGroup.position.set(-4.95, FY, 1.35);
  const fLampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.04, 20), marbleCounterMat);
  fLampBase.position.y = 0.02;
  const fLampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 1.65, 10), brushedBrassMat);
  fLampPole.position.y = 0.84;
  const fLampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.21, 0.22, 20), roomSpotMat);
  fLampShade.position.y = 1.66;
  floorLampGroup.add(fLampBase, fLampPole, fLampShade);
  addFurn(floorLampGroup, 'living_floor_lamp');
  addFurn(createOrganicPlant(-4.85, FY, -0.4, 0.95, 0xddd7cc, castShadows), 'living_plant');

  // --- B. QUARTO PRINCIPAL (x: -5.51..0.41, z: -4.81..-0.89) ---
  const bedroomRug = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 0.016, 2.3),
    new THREE.MeshStandardMaterial({ map: textures.rugBedroom, roughness: 0.95 }),
  );
  bedroomRug.position.set(-3.55, FY + 0.008, -3.45);
  bedroomRug.receiveShadow = true;
  addFurn(bedroomRug, 'bedroom_rug', 'rug');

  const bedGroup = new THREE.Group();
  bedGroup.position.set(-3.55, FY, -3.55);
  const bedBase = new THREE.Mesh(createRoundedBoxGeometry(2.14, 0.22, 2.24, 0.03), oakMat);
  bedBase.position.y = 0.11;
  const headBoard = new THREE.Mesh(createRoundedBoxGeometry(2.3, 1.02, 0.14, 0.04), linenTaupeMat);
  headBoard.position.set(0, 0.54, -1.08);
  const mattress = new THREE.Mesh(createRoundedBoxGeometry(1.98, 0.22, 2.04, 0.05), ceramicWhiteMat);
  mattress.position.set(0, 0.32, 0.02);
  const duvet = new THREE.Mesh(createRoundedBoxGeometry(2.04, 0.13, 1.32, 0.05), linenLightMat);
  duvet.position.set(0, 0.43, 0.38);
  const bedThrow = new THREE.Mesh(createRoundedBoxGeometry(2.06, 0.075, 0.42, 0.03), terracottaMat);
  bedThrow.position.set(0, 0.48, 0.78);
  [-0.46, 0.46].forEach((px) => {
    const pBack = new THREE.Mesh(createRoundedBoxGeometry(0.72, 0.14, 0.4, 0.04), linenTaupeMat);
    pBack.position.set(px, 0.5, -0.78);
    pBack.rotation.x = 0.24;
    const pFront = new THREE.Mesh(createRoundedBoxGeometry(0.64, 0.12, 0.34, 0.04), linenLightMat);
    pFront.position.set(px, 0.48, -0.58);
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
  addFurn(bedGroup, 'bedroom_bed');

  const nsLeftGroup = new THREE.Group();
  nsLeftGroup.position.set(-5.0, FY, -4.45);
  const nsLeft = new THREE.Mesh(createRoundedBoxGeometry(0.54, 0.56, 0.48, 0.03), oakMat);
  nsLeft.position.y = 0.28;
  const bedBook = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.032, 0.16), wallMat);
  bedBook.position.set(-0.05, 0.576, 0.05);
  nsLeftGroup.add(nsLeft, bedBook);
  const nsRight = new THREE.Mesh(createRoundedBoxGeometry(0.54, 0.56, 0.48, 0.03), oakMat);
  nsRight.position.set(-2.1, FY + 0.28, -4.45);
  addFurn(nsLeftGroup, 'bedroom_nightstand_left');
  addFurn(nsRight, 'bedroom_nightstand_right');

  // Wardrobe flush against East Wall (x = 0.41)
  const wardrobeGroup = new THREE.Group();
  wardrobeGroup.position.set(0.09, FY, -3.65);
  const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(0.62, 2.25, 2.05), oakMat);
  wardrobe.position.y = 1.125;
  wardrobeGroup.add(wardrobe);
  [-0.45, 0.45].forEach((hz) => {
    const wHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.55, 8), brushedBrassMat);
    wHandle.position.set(-0.32, 1.15, hz);
    wardrobeGroup.add(wHandle);
  });
  addFurn(wardrobeGroup, 'bedroom_wardrobe');

  // Floor Mirror & Bedroom Art
  const mirrorGroup = new THREE.Group();
  mirrorGroup.position.set(-4.6, FY, -1.02);
  const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.64, 1.72, 0.04), brushedBrassMat);
  mirrorFrame.position.y = 0.86;
  const mirrorGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.58, 1.65),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.06, metalness: 0.94 }),
  );
  mirrorGlass.rotation.y = Math.PI;
  mirrorGlass.position.set(0, 0.86, -0.022);
  mirrorGroup.add(mirrorFrame, mirrorGlass);
  addFurn(mirrorGroup, 'bedroom_floor_mirror');

  const bedArtGroup = new THREE.Group();
  bedArtGroup.position.set(-4.6, 1.65, -4.78);
  const bedArtFrame = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.88, 0.04), oakMat);
  const bedArt = new THREE.Mesh(
    new THREE.PlaneGeometry(0.68, 0.8),
    new THREE.MeshStandardMaterial({ map: textures.artBedroom, roughness: 0.75 }),
  );
  bedArt.position.z = 0.025;
  bedArtGroup.add(bedArtFrame, bedArt);
  addFurn(bedArtGroup, 'bedroom_wall_art', 'wall');
  addFurn(createOrganicPlant(-0.2, FY, -4.45, 0.65, 0xd6cfc2, castShadows), 'bedroom_plant');

  // --- C. COZINHA (x: 0.59..5.71, z: -4.81..0.21) ---
  const kitchenLowerGroup = new THREE.Group();
  kitchenLowerGroup.position.set(0.98, FY, -2.42);
  const lowerCab = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.88, 2.85), sageCabinetMat);
  lowerCab.position.y = 0.44;
  const counterTop = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.055, 2.9), marbleCounterMat);
  counterTop.position.y = 0.905;
  const sinkBasin = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.035, 0.68), brushedSteelMat);
  sinkBasin.position.set(0, 0.94, 0.82);
  const cooktop = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.022, 0.82), darkMetalMat);
  cooktop.position.set(0, 0.945, -0.23);
  const potBody = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.095, 0.1, 16), brushedSteelMat);
  potBody.position.set(-0.02, 1.0, -0.13);
  const coffeeBody = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.34, 0.28), darkMetalMat);
  coffeeBody.position.set(-0.04, 1.1, -1.08);
  kitchenLowerGroup.add(lowerCab, counterTop, sinkBasin, cooktop, potBody, coffeeBody);
  addFurn(kitchenLowerGroup, 'kitchen_counter');

  const kitchenUpperGroup = new THREE.Group();
  kitchenUpperGroup.position.set(0.81, FY + 2.08, -2.42);
  const upperCab = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.72, 2.8), oakMat);
  const underCabLed = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 2.6), roomSpotMat);
  underCabLed.position.set(0.05, -0.37, 0);
  const rangeHood = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.24, 0.9), brushedSteelMat);
  rangeHood.position.set(0.11, 0, -0.23);
  kitchenUpperGroup.add(upperCab, underCabLed, rangeHood);
  addFurn(kitchenUpperGroup, 'kitchen_upper_cabinets', 'wall');

  // Kitchen Island centered in open space (x = 3.25, z = -2.30)
  const kitchenIslandGroup = new THREE.Group();
  kitchenIslandGroup.position.set(3.25, FY, -2.3);
  const islandBase = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.86, 1.02), oakMat);
  islandBase.position.y = 0.43;
  const islandTop = new THREE.Mesh(new THREE.BoxGeometry(2.28, 0.065, 1.16), marbleCounterMat);
  islandTop.position.y = 0.89;
  const bowl = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 18, 12, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5),
    linenLightMat,
  );
  bowl.position.set(-0.5, 1.0, 0);
  kitchenIslandGroup.add(islandBase, islandTop, bowl);
  addFurn(kitchenIslandGroup, 'kitchen_island');

  const pendantBar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.045, 0.07), roomSpotMat);
  pendantBar.position.set(3.25, 2.38, -2.3);
  addFurn(pendantBar, 'kitchen_pendant_light', 'ceiling');

  [2.55, 3.25, 3.95].forEach((sx, idx) => {
    const stoolGroup = new THREE.Group();
    stoolGroup.position.set(sx, FY, -1.48);
    const stoolLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.13, 0.6, 14), darkMetalMat);
    stoolLeg.position.y = 0.3;
    const stoolSeat = new THREE.Mesh(createRoundedBoxGeometry(0.38, 0.08, 0.34, 0.03), linenLightMat);
    stoolSeat.position.y = 0.64;
    stoolGroup.add(stoolLeg, stoolSeat);
    addFurn(stoolGroup, `kitchen_stool_${idx}`);
  });

  // --- D. TERRAÇO FRONTAL (x: 0.59..5.71, z: 0.39..4.80) ---
  const terraceLoungeGroup = new THREE.Group();
  terraceLoungeGroup.position.set(3.35, FY, 2.85);
  const loungeBase = new THREE.Mesh(createRoundedBoxGeometry(0.88, 0.16, 1.7, 0.03), oakMat);
  loungeBase.position.y = 0.08;
  const loungeMat = new THREE.Mesh(createRoundedBoxGeometry(0.8, 0.1, 1.18, 0.04), linenLightMat);
  loungeMat.position.set(0, 0.21, 0.2);
  const loungeBack = new THREE.Mesh(createRoundedBoxGeometry(0.8, 0.1, 0.64, 0.04), linenLightMat);
  loungeBack.position.set(0, 0.39, -0.63);
  loungeBack.rotation.x = 0.52;
  terraceLoungeGroup.add(loungeBase, loungeMat, loungeBack);
  addFurn(terraceLoungeGroup, 'terrace_lounger');
  addFurn(createOrganicPlant(5.2, FY, 0.8, 1.0, 0xb97a5b, castShadows), 'terrace_plant');

  // --- E. BANHEIRO (x: -11.11..-5.69, z: -4.81..-0.89) ---
  const showerGroup = new THREE.Group();
  showerGroup.position.set(-10.18, FY, -4.02);
  const showerTray = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 1.5), marbleCounterMat);
  showerTray.position.y = 0.04;
  const showerGlass = new THREE.Mesh(new THREE.BoxGeometry(0.035, 2.1, 1.5), glassMat);
  showerGlass.position.set(0.9, 1.08, 0);
  const rainHead = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.03, 18), brushedSteelMat);
  rainHead.position.set(-0.07, 2.24, -0.16);
  const showerArm = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.45), brushedSteelMat);
  showerArm.position.set(-0.07, 2.28, -0.4);
  const nicheFrame = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.3, 0.06), darkMetalMat);
  nicheFrame.position.set(-0.07, 1.31, -0.75);
  const nicheGlow = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.03, 0.05), roomSpotMat);
  nicheGlow.position.set(-0.07, 1.43, -0.73);
  showerGroup.add(showerTray, showerGlass, rainHead, showerArm, nicheFrame, nicheGlow);
  addFurn(showerGroup, 'bathroom_shower');

  // Floating Wall-Mounted Vanity + Vessel Sink + Backlit Mirror (clear of North door at x=-6.40)
  const vanityGroup = new THREE.Group();
  vanityGroup.position.set(-8.05, FY, -4.5);
  const vanityCab = new THREE.Mesh(createRoundedBoxGeometry(1.45, 0.5, 0.54, 0.025), oakMat);
  vanityCab.position.y = 0.52;
  const vanityTop = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.58), marbleCounterMat);
  vanityTop.position.y = 0.79;
  const vesselSink = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.14, 20), ceramicWhiteMat);
  vesselSink.position.set(0, 0.88, 0.02);
  vanityGroup.add(vanityCab, vanityTop, vesselSink);
  addFurn(vanityGroup, 'bathroom_floating_vanity', 'wall');

  const bathMirrorGroup = new THREE.Group();
  bathMirrorGroup.position.set(-8.05, 1.62, -4.78);
  const bathMirror = new THREE.Mesh(
    new THREE.CylinderGeometry(0.44, 0.44, 0.03, 28),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.05, metalness: 0.95 }),
  );
  bathMirror.rotation.x = Math.PI / 2;
  const mirrorHalo = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.014, 8, 28), roomSpotMat);
  mirrorHalo.position.z = -0.01;
  bathMirrorGroup.add(bathMirror, mirrorHalo);
  addFurn(bathMirrorGroup, 'bathroom_mirror', 'wall');

  // Wall-hung Toilet (West wall, SW corner)
  const toiletGroup = new THREE.Group();
  toiletGroup.position.set(-10.55, FY, -1.65);
  const toiletBase = new THREE.Mesh(createRoundedBoxGeometry(0.56, 0.36, 0.4, 0.08), ceramicWhiteMat);
  toiletBase.position.y = 0.3;
  const toiletTank = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.48, 0.44), ceramicWhiteMat);
  toiletTank.position.set(-0.43, 0.62, 0);
  toiletGroup.add(toiletBase, toiletTank);
  addFurn(toiletGroup, 'bathroom_wall_toilet', 'wall');

  // Bathroom Linen Cabinet against South Wall (clear of South door x=-6.40)
  const bathCab = new THREE.Mesh(createRoundedBoxGeometry(0.75, 1.72, 0.44, 0.02), oakMat);
  bathCab.position.set(-8.45, FY + 0.86, -1.14);
  addFurn(bathCab, 'bathroom_cabinet');

  // --- F. ESCRITÓRIO (x: -11.11..-5.69, z: -0.71..4.41) ---
  const officeDeskGroup = new THREE.Group();
  officeDeskGroup.position.set(-9.05, FY, 1.95);
  [-0.95, 0.95].forEach((lx) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 0.78), darkMetalMat);
    leg.position.set(lx, 0.35, 0);
    officeDeskGroup.add(leg);
  });
  const officeDeskTop = new THREE.Mesh(createRoundedBoxGeometry(2.2, 0.055, 0.88, 0.025), walnutMat);
  officeDeskTop.position.y = 0.72;
  officeDeskTop.castShadow = castShadows;
  const deskLampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.03, 16), darkMetalMat);
  deskLampBase.position.set(0.85, 0.76, -0.23);
  const deskLampNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.4, 8), brushedBrassMat);
  deskLampNeck.position.set(0.85, 0.97, -0.23);
  const deskLampHead = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.11, 16), darkMetalMat);
  deskLampHead.position.set(0.78, 1.16, -0.18);
  deskLampHead.rotation.z = 0.4;
  officeDeskGroup.add(officeDeskTop, deskLampBase, deskLampNeck, deskLampHead);
  addFurn(officeDeskGroup, 'office_desk');

  // Side Printer Credenza flush against West Wall (z = 3.55, clear of West window)
  const deskCredenza = new THREE.Mesh(createRoundedBoxGeometry(0.6, 0.7, 1.45, 0.025), walnutMat);
  deskCredenza.position.set(-10.76, FY + 0.35, 3.55);
  addFurn(deskCredenza, 'office_credenza');

  const offChairGroup = new THREE.Group();
  offChairGroup.position.set(-9.05, FY, 2.75);
  const offStarBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.06, 5), darkMetalMat);
  offStarBase.position.y = 0.03;
  const offStem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.36, 10), darkMetalMat);
  offStem.position.y = 0.24;
  const offSeat = new THREE.Mesh(createRoundedBoxGeometry(0.54, 0.1, 0.5, 0.04), darkMetalMat);
  offSeat.position.y = 0.44;
  const offBack = new THREE.Mesh(createRoundedBoxGeometry(0.48, 0.64, 0.08, 0.04), navyAccentMat);
  offBack.position.set(0, 0.82, 0.21);
  offChairGroup.add(offStarBase, offStem, offSeat, offBack);
  addFurn(offChairGroup, 'office_chair');

  const officeBookcaseGroup = new THREE.Group();
  officeBookcaseGroup.position.set(-9.05, FY, -0.48);
  const officeBookcase = new THREE.Mesh(new THREE.BoxGeometry(2.05, 1.92, 0.4), oakMat);
  officeBookcase.position.y = 0.96;
  officeBookcaseGroup.add(officeBookcase);
  [0x315eaa, 0xb97a5b, 0x475569, 0x64748b, 0xa7afa3].forEach((bc, bi) => {
    const bk = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.26, 0.22),
      new THREE.MeshStandardMaterial({ color: bc, roughness: 0.72 }),
    );
    bk.position.set(-0.65 + bi * 0.11, 1.42, 0.03);
    officeBookcaseGroup.add(bk);
  });
  addFurn(officeBookcaseGroup, 'office_bookcase');
  addFurn(createOrganicPlant(-6.2, FY, 0.35, 0.9, 0xd6cfc2, castShadows), 'office_plant');

  // --- G. HALL DE ENTRADA (x: -5.51..0.41, z: 4.59..6.71) ---
  const foyerRug = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.014, 0.96),
    new THREE.MeshStandardMaterial({ map: textures.rugLiving, roughness: 0.95 }),
  );
  foyerRug.position.set(-2.55, FY + 0.007, 5.65);
  addFurn(foyerRug, 'hallway_rug', 'rug');

  const foyerConsoleGroup = new THREE.Group();
  foyerConsoleGroup.position.set(-4.15, FY, 4.82);
  const foyerConsole = new THREE.Mesh(createRoundedBoxGeometry(1.55, 0.76, 0.38, 0.025), oakMat);
  foyerConsole.position.y = 0.38;
  const foyerVase = createCeramicVase(0.24, 0.075, 0xd8d2c7);
  foyerVase.position.set(-0.35, 0.76, 0);
  foyerConsoleGroup.add(foyerConsole, foyerVase);
  addFurn(foyerConsoleGroup, 'hallway_console');

  const foyerMirror = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.03, 24), brushedBrassMat);
  foyerMirror.rotation.x = Math.PI / 2;
  foyerMirror.position.set(-4.15, 1.5, 4.62);
  const foyerArt = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.82, 0.72), oakMat);
  foyerArt.position.set(-5.48, 1.55, 5.65);
  addFurn(foyerMirror, 'hallway_mirror', 'wall');
  addFurn(foyerArt, 'hallway_art', 'wall');
  addFurn(createOrganicPlant(-0.2, FY, 6.25, 0.85, 0xddd7cc, castShadows), 'hallway_plant');

  // --- H. QUARTO ADICIONAL (x: -11.11..-5.69, z: -9.31..-4.99) ---
  const guestRug = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.016, 1.9),
    new THREE.MeshStandardMaterial({ map: textures.rugBedroom, roughness: 0.95 }),
  );
  guestRug.position.set(-8.85, FY + 0.008, -6.2);
  addFurn(guestRug, 'guest_rug', 'rug');

  const guestBed = new THREE.Group();
  guestBed.position.set(-9.0, FY, -6.12);
  guestBed.rotation.y = Math.PI; // Headboard faces South solid wall (z = -4.99)
  const gBase = new THREE.Mesh(createRoundedBoxGeometry(1.62, 0.2, 1.98, 0.03), oakMat);
  gBase.position.y = 0.1;
  const gHead = new THREE.Mesh(createRoundedBoxGeometry(1.72, 0.92, 0.12, 0.04), navyAccentMat);
  gHead.position.set(0, 0.5, -0.95);
  const gMattress = new THREE.Mesh(createRoundedBoxGeometry(1.5, 0.2, 1.84, 0.04), ceramicWhiteMat);
  gMattress.position.set(0, 0.3, 0.02);
  const gDuvet = new THREE.Mesh(createRoundedBoxGeometry(1.54, 0.12, 1.18, 0.04), linenLightMat);
  gDuvet.position.set(0, 0.4, 0.34);
  const gPillow = new THREE.Mesh(createRoundedBoxGeometry(1.12, 0.12, 0.36, 0.04), linenTaupeMat);
  gPillow.position.set(0, 0.45, -0.68);
  guestBed.add(gBase, gHead, gMattress, gDuvet, gPillow);
  addFurn(guestBed, 'guest_bed');

  const gNightstand = new THREE.Mesh(createRoundedBoxGeometry(0.48, 0.52, 0.44, 0.03), oakMat);
  gNightstand.position.set(-7.85, FY + 0.26, -5.26);
  const gWardrobe = new THREE.Mesh(new THREE.BoxGeometry(0.58, 2.2, 1.8), oakMat);
  gWardrobe.position.set(-10.78, FY + 1.1, -8.15);

  const guestDeskGroup = new THREE.Group();
  guestDeskGroup.position.set(-6.65, FY, -8.96);
  const gDesk = new THREE.Mesh(createRoundedBoxGeometry(1.3, 0.05, 0.6, 0.02), oakMat);
  gDesk.position.y = 0.7;
  [-0.57, 0.57].forEach((lx) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.68, 0.52), darkMetalMat);
    leg.position.set(lx, 0.34, 0);
    guestDeskGroup.add(leg);
  });
  guestDeskGroup.add(gDesk);
  addFurn(gNightstand, 'guest_nightstand');
  addFurn(gWardrobe, 'guest_wardrobe');
  addFurn(guestDeskGroup, 'guest_desk');

  // --- I. SALA DE JANTAR (x: 5.89..11.11, z: -4.81..0.21) ---
  const diningTableGroup = new THREE.Group();
  diningTableGroup.position.set(8.65, FY, -2.3);
  const diningTableTop = new THREE.Mesh(createRoundedBoxGeometry(2.25, 0.06, 1.08, 0.03), oakMat);
  diningTableTop.position.y = 0.74;
  diningTableTop.castShadow = castShadows;
  [-0.82, 0.82].forEach((dx) => {
    const tLeg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.72, 0.8), darkMetalMat);
    tLeg.position.set(dx, 0.36, 0);
    diningTableGroup.add(tLeg);
  });
  diningTableGroup.add(diningTableTop);
  addFurn(diningTableGroup, 'dining_table');

  [-0.72, 0, 0.72].forEach((cx, ci) => {
    [-0.68, 0.68].forEach((cz, ri) => {
      const ch = new THREE.Group();
      ch.position.set(8.65 + cx, FY, -2.3 + cz);
      ch.rotation.y = cz > 0 ? 0 : Math.PI;
      const cSeat = new THREE.Mesh(createRoundedBoxGeometry(0.42, 0.08, 0.42, 0.03), linenTaupeMat);
      cSeat.position.y = 0.44;
      const cBack = new THREE.Mesh(createRoundedBoxGeometry(0.4, 0.38, 0.07, 0.03), linenTaupeMat);
      cBack.position.set(0, 0.65, 0.18);
      const cLegs = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.36), darkMetalMat);
      cLegs.position.y = 0.21;
      cLegs.scale.set(0.14, 1, 0.14);
      ch.add(cSeat, cBack, cLegs);
      addFurn(ch, `dining_chair_${ci}_${ri}`);
    });
  });

  const diningPendantGroup = new THREE.Group();
  diningPendantGroup.position.set(8.65, 2.15, -2.3);
  const diningPendant = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.18, 20), brushedBrassMat);
  const diningBulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), roomSpotMat);
  diningBulb.position.y = -0.11;
  diningPendantGroup.add(diningPendant, diningBulb);
  addFurn(diningPendantGroup, 'dining_pendant', 'ceiling');

  const sideboardGroup = new THREE.Group();
  sideboardGroup.position.set(9.15, FY, -4.52);
  const sideboard = new THREE.Mesh(createRoundedBoxGeometry(2.05, 0.8, 0.46, 0.025), walnutMat);
  sideboard.position.y = 0.4;
  const sideVase = createCeramicVase(0.24, 0.075, 0xede9e1);
  sideVase.position.set(-0.7, 0.8, 0);
  sideboardGroup.add(sideboard, sideVase);
  addFurn(sideboardGroup, 'dining_sideboard');

  const diningArtGroup = new THREE.Group();
  diningArtGroup.position.set(9.15, 1.65, -4.78);
  const diningArt = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.86, 0.04), oakMat);
  const diningArtCanvas = new THREE.Mesh(
    new THREE.PlaneGeometry(1.05, 0.76),
    new THREE.MeshStandardMaterial({ map: textures.artLiving, roughness: 0.7 }),
  );
  diningArtCanvas.position.z = 0.025;
  diningArtGroup.add(diningArt, diningArtCanvas);
  addFurn(diningArtGroup, 'dining_wall_art', 'wall');
  addFurn(createOrganicPlant(10.65, FY, -4.3, 0.9, 0xd6cfc2, castShadows), 'dining_plant');

  // --- J. LAVANDERIA (x: 5.89..11.11, z: -9.31..-4.99) ---
  const laundryCounterGroup = new THREE.Group();
  laundryCounterGroup.position.set(9.35, FY, -5.38);
  const laundryCounter = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.86, 0.68), ceramicWhiteMat);
  laundryCounter.position.y = 0.43;
  const laundryTop = new THREE.Mesh(new THREE.BoxGeometry(2.86, 0.05, 0.72), oakMat);
  laundryTop.position.y = 0.885;
  const utilitySink = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.22, 0.48), brushedSteelMat);
  utilitySink.position.set(0.95, 0.82, 0);
  laundryCounterGroup.add(laundryCounter, laundryTop, utilitySink);
  addFurn(laundryCounterGroup, 'laundry_counter');

  const laundryShelfGroup = new THREE.Group();
  laundryShelfGroup.position.set(9.35, 1.85, -5.18);
  const laundryShelf = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 0.32), oakMat);
  laundryShelfGroup.add(laundryShelf);
  [0x315eaa, 0x239b69, 0xd99b27].forEach((col, bi) => {
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.052, 0.06, 0.22, 12),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.45 }),
    );
    bottle.position.set(-0.7 + bi * 0.24, 0.13, 0);
    laundryShelfGroup.add(bottle);
  });
  addFurn(laundryShelfGroup, 'laundry_wall_shelf', 'wall');

  const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.18, 0.46, 16), linenTaupeMat);
  basket.position.set(10.65, FY + 0.23, -8.85);
  addFurn(basket, 'laundry_basket');

  // --- K. GARAGEM INTEGRADA (x: 5.89..11.11, z: 0.39..6.31) ---
  const parkedCar = new THREE.Group();
  parkedCar.position.set(8.5, FY, 3.65);
  const carPaintMat = new THREE.MeshPhysicalMaterial({
    color: 0x64748b,
    metalness: 0.72,
    roughness: 0.22,
    clearcoat: 0.9,
  });
  const carBody = new THREE.Mesh(createRoundedBoxGeometry(1.88, 0.6, 4.05, 0.12), carPaintMat);
  carBody.position.y = 0.56;
  const carCabin = new THREE.Mesh(createRoundedBoxGeometry(1.52, 0.52, 2.08, 0.12), glassMat);
  carCabin.position.set(0, 1.04, -0.15);
  const carRoof = new THREE.Mesh(createRoundedBoxGeometry(1.44, 0.06, 1.8, 0.02), carPaintMat);
  carRoof.position.set(0, 1.3, -0.15);
  [
    [-0.92, 0.34, 1.22],
    [0.92, 0.34, 1.22],
    [-0.92, 0.34, -1.22],
    [0.92, 0.34, -1.22],
  ].forEach(([wx, wy, wz]) => {
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.22, 18), darkMetalMat);
    tire.rotation.z = Math.PI / 2;
    tire.position.set(wx, wy, wz);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.23, 14), brushedSteelMat);
    rim.rotation.z = Math.PI / 2;
    rim.position.set(wx, wy, wz);
    parkedCar.add(tire, rim);
  });
  parkedCar.add(carBody, carCabin, carRoof);
  parkedCar.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) c.castShadow = castShadows;
  });

  const garageRack = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.82, 0.48), darkMetalMat);
  garageRack.position.set(9.35, FY + 0.91, 0.66);
  const workbench = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.88, 2.1), oakMat);
  workbench.position.set(10.76, FY + 0.44, 3.15);
  const toolBoard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.82, 1.75), darkMetalMat);
  toolBoard.position.set(11.08, FY + 1.44, 3.15);
  const bikeGroup = new THREE.Group();
  bikeGroup.position.set(6.18, FY, 4.4);
  [-0.5, 0.5].forEach((bz) => {
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.028, 8, 20), darkMetalMat);
    wheel.rotation.y = Math.PI / 2;
    wheel.position.set(0, 0.34, bz);
    bikeGroup.add(wheel);
  });
  const bikeFrame = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.92), terracottaMat);
  bikeFrame.position.set(0, 0.62, 0);
  bikeGroup.add(bikeFrame);
  addFurn(parkedCar, 'garage_car');
  addFurn(garageRack, 'garage_rack');
  addFurn(workbench, 'garage_workbench');
  addFurn(toolBoard, 'garage_tool_board', 'wall');
  addFurn(bikeGroup, 'garage_bicycle');

  return {
    group,
    structureGroup,
    wallCapGroup,
    ceilingGroup,
    roofGroup,
    furnitureGroup,
    fireplaceGlowMat,
    roomSpotMat,
  };
}
