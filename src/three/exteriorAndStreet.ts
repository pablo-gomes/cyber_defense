import * as THREE from 'three';
import { createCeramicVase, createOrganicPlant, createRoundedBoxGeometry } from './houseArchitecture';
import { ProceduralTextureSet } from './proceduralTextures';

export interface TrafficVehicle {
  mesh: THREE.Group;
  wheels: THREE.Mesh[];
  lane: 1 | -1; // +1 = Eastbound (+X), -1 = Westbound (-X)
  baseSpeed: number;
  currentSpeed: number;
  x: number;
  z: number;
}

export interface ExteriorAndStreetResult {
  group: THREE.Group;
  poolWaterMat: THREE.MeshPhysicalMaterial;
  vehicles: TrafficVehicle[];
  updateTraffic: (delta: number, elapsed: number, reducedMotion: boolean) => void;
}

function buildCompositeCar(
  colorHex: number,
  isSUV: boolean,
  castShadows: boolean,
): { group: THREE.Group; wheels: THREE.Mesh[] } {
  const car = new THREE.Group();
  const wheels: THREE.Mesh[] = [];

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: colorHex,
    metalness: 0.75,
    roughness: 0.22,
    clearcoat: 0.9,
  });
  const cabinGlassMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.1,
    metalness: 0.85,
  });
  const rubberMat = new THREE.MeshStandardMaterial({ color: 0x1e242c, roughness: 0.85 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.85, roughness: 0.25 });
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xfffbeb,
    emissive: 0xfef08a,
    emissiveIntensity: 0.85,
  });
  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 0.8,
  });

  const length = isSUV ? 4.3 : 3.95;
  const height = isSUV ? 0.68 : 0.56;
  const body = new THREE.Mesh(createRoundedBoxGeometry(length, height, 1.72, 0.1), bodyMat);
  body.position.y = 0.52;

  const cabinLen = isSUV ? 2.45 : 1.95;
  const cabinH = isSUV ? 0.58 : 0.48;
  const cabin = new THREE.Mesh(
    createRoundedBoxGeometry(cabinLen, cabinH, 1.48, 0.1),
    cabinGlassMat,
  );
  cabin.position.set(-0.18, 0.52 + height * 0.5 + cabinH * 0.4, 0);

  const roof = new THREE.Mesh(
    createRoundedBoxGeometry(cabinLen * 0.82, 0.06, 1.4, 0.02),
    bodyMat,
  );
  roof.position.set(-0.2, 0.52 + height * 0.5 + cabinH * 0.82, 0);

  // Headlights (+X front) & Taillights (-X back)
  [-0.58, 0.58].forEach((lz) => {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.24), headlightMat);
    hl.position.set(length / 2, 0.54, lz);
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.24), taillightMat);
    tl.position.set(-length / 2, 0.56, lz);
    car.add(hl, tl);
  });

  const tireGeom = new THREE.CylinderGeometry(0.32, 0.32, 0.2, 16);
  const rimGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.21, 12);
  [
    [length * 0.31, 0.32, 0.84],
    [length * 0.31, 0.32, -0.84],
    [-length * 0.31, 0.32, 0.84],
    [-length * 0.31, 0.32, -0.84],
  ].forEach(([wx, wy, wz]) => {
    const wheelHolder = new THREE.Mesh(tireGeom, rubberMat);
    wheelHolder.rotation.x = Math.PI / 2;
    wheelHolder.position.set(wx, wy, wz);
    const rim = new THREE.Mesh(rimGeom, rimMat);
    wheelHolder.add(rim);
    wheels.push(wheelHolder);
    car.add(wheelHolder);
  });

  car.add(body, cabin, roof);
  car.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) c.castShadow = castShadows;
  });
  return { group: car, wheels };
}

function createTreeLOD(castShadows: boolean): THREE.LOD {
  const lod = new THREE.LOD();
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6f533d, roughness: 0.9 });
  const canopyMatA = new THREE.MeshStandardMaterial({ color: 0x4f7f56, roughness: 0.82 });
  const canopyMatB = new THREE.MeshStandardMaterial({ color: 0x629666, roughness: 0.8 });

  // High detail (close)
  const high = new THREE.Group();
  const trunkH = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, 1.9, 10), trunkMat);
  trunkH.position.y = 0.95;
  trunkH.castShadow = castShadows;
  const c1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.05, 1), canopyMatA);
  c1.position.set(0, 2.45, 0);
  c1.castShadow = castShadows;
  const c2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 1), canopyMatB);
  c2.position.set(0.55, 2.15, 0.35);
  const c3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7, 1), canopyMatB);
  c3.position.set(-0.5, 2.2, -0.3);
  high.add(trunkH, c1, c2, c3);
  lod.addLevel(high, 0);

  // Low detail (far)
  const low = new THREE.Group();
  const trunkL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 1.85, 6), trunkMat);
  trunkL.position.y = 0.92;
  const cLow = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 0), canopyMatA);
  cLow.position.y = 2.45;
  low.add(trunkL, cLow);
  lod.addLevel(low, 26);

  return lod;
}

export function buildExteriorAndStreet(
  textures: ProceduralTextureSet,
  castShadows: boolean,
): ExteriorAndStreetResult {
  const group = new THREE.Group();
  group.name = 'exterior-yard-pool-gourmet-street';

  const oakMat = new THREE.MeshStandardMaterial({ color: 0xc49f77, roughness: 0.56 });
  const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x262f3d, roughness: 0.38, metalness: 0.7 });
  const brushedSteelMat = new THREE.MeshStandardMaterial({ color: 0xb0b8c4, roughness: 0.25, metalness: 0.88 });
  const wallFenceMat = new THREE.MeshStandardMaterial({ color: 0xe6e2da, roughness: 0.82 });
  const stoneMat = new THREE.MeshStandardMaterial({ map: textures.stonePaver, roughness: 0.78 });
  const marbleMat = new THREE.MeshStandardMaterial({ map: textures.marble, roughness: 0.24 });
  const linenMat = new THREE.MeshStandardMaterial({ color: 0xede9e1, roughness: 0.9 });
  const warmLedMat = new THREE.MeshStandardMaterial({
    color: 0xfff8eb,
    emissive: 0xfde68a,
    emissiveIntensity: 0.95,
  });

  // =========================================================================
  // 1. VAST LOT LAWN & NEIGHBORHOOD GROUND
  // =========================================================================
  const neighborhoodGround = new THREE.Mesh(
    new THREE.BoxGeometry(84, 0.24, 52),
    new THREE.MeshStandardMaterial({ color: 0xd5dfd0, roughness: 0.95 }),
  );
  neighborhoodGround.position.set(0, -0.34, 1.5);
  neighborhoodGround.receiveShadow = true;
  group.add(neighborhoodGround);

  const propertyLawn = new THREE.Mesh(
    new THREE.BoxGeometry(27.5, 0.14, 27.2),
    new THREE.MeshStandardMaterial({ map: textures.lawnGrass, roughness: 0.94 }),
  );
  propertyLawn.position.set(0, -0.25, -6.2);
  propertyLawn.receiveShadow = true;
  group.add(propertyLawn);

  // =========================================================================
  // 2. QUINTAL: MUROS PERIMETRAIS, CERCAS DE MADEIRA, PORTÃO & CAMINHOS
  // =========================================================================
  // Backyard North, West, East Perimeter Walls (x: -13.6..13.6, z: -19.6..7.2)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(27.4, 2.0, 0.26), wallFenceMat);
  backWall.position.set(0, 0.8, -19.6);
  backWall.castShadow = castShadows;
  backWall.receiveShadow = true;
  const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.26, 2.0, 26.8), wallFenceMat);
  westWall.position.set(-13.6, 0.8, -6.2);
  westWall.receiveShadow = true;
  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.26, 2.0, 26.8), wallFenceMat);
  eastWall.position.set(13.6, 0.8, -6.2);
  eastWall.receiveShadow = true;
  group.add(backWall, westWall, eastWall);

  // Front Boundary Wall + Pedestrian Gate + Driveway Apron (z = 7.25)
  const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.35, 0.24), wallFenceMat);
  frontWallLeft.position.set(-9.9, 0.5, 7.25);
  const frontWallMid = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.35, 0.24), wallFenceMat);
  frontWallMid.position.set(2.2, 0.5, 7.25);
  const frontWallRight = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.35, 0.24), wallFenceMat);
  frontWallRight.position.set(12.4, 0.5, 7.25);
  const pedGate = new THREE.Mesh(new THREE.BoxGeometry(1.85, 1.45, 0.08), oakMat);
  pedGate.position.set(-2.5, 0.55, 7.25);
  group.add(frontWallLeft, frontWallMid, frontWallRight, pedGate);

  // Driveway Paved Apron (Garage -> Street)
  const driveway = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.1, 2.8), stoneMat);
  driveway.position.set(8.5, -0.18, 7.7);
  driveway.receiveShadow = true;
  group.add(driveway);

  // Stepping Stones Path around Backyard & Garden (InstancedMesh)
  const stepGeom = new THREE.BoxGeometry(0.78, 0.06, 0.54);
  const stepCoords: Array<[number, number]> = [
    [-7.5, -10.5], [-7.5, -11.5], [-7.5, -12.5], [-7.5, -13.5],
    [-6.6, -14.2], [6.8, -10.5], [6.8, -11.5], [6.8, -12.5],
    [-2.5, 7.9], [-2.5, 8.6],
  ];
  const stepInst = new THREE.InstancedMesh(stepGeom, stoneMat, stepCoords.length);
  const dummy = new THREE.Object3D();
  stepCoords.forEach(([sx, sz], i) => {
    dummy.position.set(sx, -0.16, sz);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    stepInst.setMatrixAt(i, dummy.matrix);
  });
  stepInst.instanceMatrix.needsUpdate = true;
  stepInst.computeBoundingSphere();
  stepInst.receiveShadow = true;
  group.add(stepInst);

  // =========================================================================
  // 3. ÁREA GOURMET (x: 0.2 .. 5.6, z: -9.4 .. -5.0)
  // =========================================================================
  const gourmetDeck = new THREE.Mesh(
    new THREE.BoxGeometry(5.6, 0.08, 4.5),
    new THREE.MeshStandardMaterial({ map: textures.deckWood, roughness: 0.72 }),
  );
  gourmetDeck.position.set(2.85, 0.0, -7.2);
  gourmetDeck.receiveShadow = true;
  group.add(gourmetDeck);

  // Timber & Steel Pergola Overhead
  [-0.05, 5.55].forEach((px) => {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.75, 0.14), darkMetalMat);
    col.position.set(px, 1.38, -9.25);
    col.castShadow = castShadows;
    group.add(col);
  });
  for (let b = 0; b < 6; b++) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(5.85, 0.1, 0.12), oakMat);
    beam.position.set(2.75, 2.78, -5.2 - b * 0.8);
    beam.castShadow = castShadows;
    group.add(beam);
  }

  // Outdoor Gourmet Counter, Sink, Cabinets & Stainless BBQ Grill (Churrasqueira)
  const gCounterBase = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.88, 0.76), wallFenceMat);
  gCounterBase.position.set(2.8, 0.46, -8.85);
  const gCounterTop = new THREE.Mesh(new THREE.BoxGeometry(3.48, 0.06, 0.82), marbleMat);
  gCounterTop.position.set(2.8, 0.93, -8.85);
  const bbqBody = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.42, 0.56), brushedSteelMat);
  bbqBody.position.set(1.75, 1.15, -8.85);
  const bbqChimney = new THREE.Mesh(new THREE.BoxGeometry(0.36, 1.25, 0.36), darkMetalMat);
  bbqChimney.position.set(1.75, 2.0, -8.85);
  const gSink = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.04, 0.42), brushedSteelMat);
  gSink.position.set(3.45, 0.95, -8.85);

  // Outdoor Dining Table + 4 Chairs
  const gTableTop = new THREE.Mesh(createRoundedBoxGeometry(1.7, 0.06, 1.0, 0.03), oakMat);
  gTableTop.position.set(2.8, 0.76, -6.95);
  const gTableLeg = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.72, 0.65), darkMetalMat);
  gTableLeg.position.set(2.8, 0.38, -6.95);
  gTableLeg.scale.x = 0.08;
  [-0.5, 0.5].forEach((cx) => {
    [-0.65, 0.65].forEach((cz) => {
      const ch = new THREE.Mesh(createRoundedBoxGeometry(0.42, 0.46, 0.42, 0.03), linenMat);
      ch.position.set(2.8 + cx, 0.25, -6.95 + cz);
      group.add(ch);
    });
  });
  group.add(gCounterBase, gCounterTop, bbqBody, bbqChimney, gSink, gTableTop, gTableLeg);

  // =========================================================================
  // 4. PISCINA MODERNA & ESPRIGUIÇADEIRAS (x: -5.2 .. 4.8, z: -15.8 .. -10.2)
  // =========================================================================
  const poolDeck = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.12, 6.2), stoneMat);
  poolDeck.position.set(-0.2, -0.14, -13.0);
  poolDeck.receiveShadow = true;

  // Pool Mosaic Basin
  const poolBasin = new THREE.Mesh(
    new THREE.BoxGeometry(6.8, 0.08, 3.8),
    new THREE.MeshStandardMaterial({ map: textures.poolMosaic, roughness: 0.35 }),
  );
  poolBasin.position.set(-0.2, -0.22, -13.0);

  // Stone Coping Rim around Pool
  const copingMat = new THREE.MeshStandardMaterial({ color: 0xe7e3dc, roughness: 0.65 });
  const rimN = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.14, 0.28), copingMat);
  rimN.position.set(-0.2, -0.05, -15.0);
  const rimS = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.14, 0.28), copingMat);
  rimS.position.set(-0.2, -0.05, -11.0);
  const rimW = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 4.28), copingMat);
  rimW.position.set(-3.7, -0.05, -13.0);
  const rimE = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 4.28), copingMat);
  rimE.position.set(3.3, -0.05, -13.0);

  // Realistic Refractive Animated Water Surface
  const poolWaterMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    normalMap: textures.poolWaterNormal,
    normalScale: new THREE.Vector2(0.45, 0.45),
    roughness: 0.08,
    metalness: 0.05,
    transparent: true,
    opacity: 0.78,
    clearcoat: 1.0,
  });
  const poolWater = new THREE.Mesh(new THREE.PlaneGeometry(6.75, 3.75), poolWaterMat);
  poolWater.rotation.x = -Math.PI / 2;
  poolWater.position.set(-0.2, -0.06, -13.0);

  // Underwater Pool LED Strip Lights
  [-1.8, 0, 1.8].forEach((lx) => {
    const pLed = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.03, 14),
      new THREE.MeshStandardMaterial({
        color: 0x7dd3fc,
        emissive: 0x0ea5e9,
        emissiveIntensity: 1.4,
      }),
    );
    pLed.rotation.x = Math.PI / 2;
    pLed.position.set(-0.2 + lx, -0.14, -14.84);
    group.add(pLed);
  });

  // 3 Sun Loungers (Espreguiçadeiras) & Side Tables
  [-2.2, -0.2, 1.8].forEach((lx) => {
    const lBase = new THREE.Mesh(createRoundedBoxGeometry(0.76, 0.14, 1.75, 0.03), oakMat);
    lBase.position.set(lx, 0.02, -16.85);
    const lPad = new THREE.Mesh(createRoundedBoxGeometry(0.68, 0.08, 1.2, 0.03), linenMat);
    lPad.position.set(lx, 0.12, -16.65);
    const lBack = new THREE.Mesh(createRoundedBoxGeometry(0.68, 0.08, 0.62, 0.03), linenMat);
    lBack.position.set(lx, 0.3, -17.42);
    lBack.rotation.x = 0.5;
    group.add(lBase, lPad, lBack);
  });
  const poolVase = createCeramicVase(0.28, 0.1, 0xd8d2c7);
  poolVase.position.set(4.1, -0.06, -10.8);
  group.add(poolDeck, poolBasin, rimN, rimS, rimW, rimE, poolWater, poolVase);

  // =========================================================================
  // 5. VEGETAÇÃO OTIMIZADA (InstancedMesh + LOD) & LUZES DE JARDIM
  // =========================================================================
  // Instanced Ornamental Shrubs & Flower Clusters across Yard & Street
  const shrubGeom = new THREE.DodecahedronGeometry(0.42, 1);
  const shrubMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.84 });
  const shrubPlacements: Array<[number, number, number, number, number]> = [
    [-12.4, 0.15, -18.2, 1.2, 0x4c7c59],
    [-11.2, 0.15, -18.4, 0.95, 0x5c8f68],
    [-9.5, 0.15, -18.3, 1.1, 0x3f6b4b],
    [9.8, 0.15, -18.2, 1.25, 0x4c7c59],
    [11.4, 0.15, -18.1, 1.0, 0x679c73],
    [12.4, 0.15, -16.2, 1.15, 0x4c7c59],
    [12.3, 0.15, -12.8, 1.0, 0x5c8f68],
    [-12.4, 0.15, -13.5, 1.1, 0x5c8f68],
    [-12.4, 0.15, -10.8, 0.9, 0x679c73],
    [-12.2, 0.15, 5.8, 0.95, 0x4c7c59],
    [-10.8, 0.15, 6.2, 0.85, 0x5c8f68],
    [-7.8, 0.15, 6.2, 0.9, 0x4c7c59],
    [1.2, 0.15, 6.4, 0.85, 0x5c8f68],
    [4.4, 0.15, 6.4, 0.9, 0x4c7c59],
    // Flowering accent shrubs near pool & patio
    [-6.2, 0.1, -17.2, 0.65, 0xd97777],
    [5.6, 0.1, -17.2, 0.65, 0xeab308],
    [-5.8, 0.1, -11.5, 0.62, 0xd97777],
    [5.6, 0.1, -11.8, 0.62, 0xeab308],
  ];
  const shrubInst = new THREE.InstancedMesh(shrubGeom, shrubMat, shrubPlacements.length);
  const tintColor = new THREE.Color();
  shrubPlacements.forEach(([sx, sy, sz, sc, hex], i) => {
    dummy.position.set(sx, sy, sz);
    dummy.scale.set(sc, sc * 0.82, sc);
    dummy.rotation.set(0, i * 0.9, 0);
    dummy.updateMatrix();
    shrubInst.setMatrixAt(i, dummy.matrix);
    tintColor.setHex(hex);
    shrubInst.setColorAt(i, tintColor);
  });
  shrubInst.instanceMatrix.needsUpdate = true;
  if (shrubInst.instanceColor) shrubInst.instanceColor.needsUpdate = true;
  shrubInst.computeBoundingSphere();
  shrubInst.castShadow = castShadows;
  group.add(shrubInst);

  // LOD Trees in Backyard & Sidewalks
  [
    [-11.8, -0.2, -16.5],
    [11.8, -0.2, -16.8],
    [-12.2, -0.2, 2.5],
    [-14.5, -0.2, 8.2],
    [-5.5, -0.2, 8.2],
    [12.8, -0.2, 8.2],
    [22.0, -0.2, 8.2],
    [-16.0, -0.2, 16.6],
    [0.0, -0.2, 16.6],
    [16.0, -0.2, 16.6],
  ].forEach(([tx, ty, tz]) => {
    const tree = createTreeLOD(castShadows);
    tree.position.set(tx, ty, tz);
    group.add(tree);
  });

  // Garden Pathway Bollards
  [
    [-7.8, -0.18, -11.0],
    [-7.8, -0.18, -14.0],
    [6.6, -0.18, -11.0],
    [6.6, -0.18, -14.0],
    [1.15, 0.06, 4.18],
    [5.35, 0.06, 4.18],
  ].forEach(([bx, by, bz]) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.62, 12), darkMetalMat);
    post.position.set(bx, by + 0.31, bz);
    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.13, 12), warmLedMat);
    lantern.position.set(bx, by + 0.54, bz);
    group.add(post, lantern);
  });
  group.add(createOrganicPlant(-0.3, -0.1, 5.1, 1.15, 0x8b7e74, castShadows));

  // =========================================================================
  // 6. RUA PÚBLICA 3D, CALÇADAS, BAIRRO VIZINHO & POSTES DE ILUMINAÇÃO
  // =========================================================================
  const streetLength = 74;
  // Sidewalks & Curbs (Near Side z=8.35, Far Side z=16.55)
  const nearSidewalk = new THREE.Mesh(
    new THREE.BoxGeometry(streetLength, 0.16, 1.65),
    new THREE.MeshStandardMaterial({ map: textures.sidewalkPaver, roughness: 0.85 }),
  );
  nearSidewalk.position.set(0, -0.16, 8.35);
  nearSidewalk.receiveShadow = true;

  const farSidewalk = new THREE.Mesh(
    new THREE.BoxGeometry(streetLength, 0.16, 1.65),
    new THREE.MeshStandardMaterial({ map: textures.sidewalkPaver, roughness: 0.85 }),
  );
  farSidewalk.position.set(0, -0.16, 16.55);
  farSidewalk.receiveShadow = true;

  // Asphalt 2-Lane Road (z: 9.15 .. 15.75)
  const asphalt = new THREE.Mesh(
    new THREE.BoxGeometry(streetLength, 0.08, 6.6),
    new THREE.MeshStandardMaterial({ map: textures.asphaltRoad, roughness: 0.88 }),
  );
  asphalt.position.set(0, -0.22, 12.45);
  asphalt.receiveShadow = true;
  group.add(nearSidewalk, farSidewalk, asphalt);

  // Pedestrian Crosswalk Stripes (Faixa de Pedestres at x = -4.2)
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 });
  const stripeGeom = new THREE.BoxGeometry(1.5, 0.015, 0.42);
  const crosswalkInst = new THREE.InstancedMesh(stripeGeom, stripeMat, 7);
  for (let s = 0; s < 7; s++) {
    dummy.position.set(-4.2, -0.175, 9.75 + s * 0.9);
    dummy.scale.set(1, 1, 1);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    crosswalkInst.setMatrixAt(s, dummy.matrix);
  }
  crosswalkInst.instanceMatrix.needsUpdate = true;
  crosswalkInst.computeBoundingSphere();
  group.add(crosswalkInst);

  // Storm Drains (Bueiros) + Traffic Signs + Streetlights
  [-11.0, 11.5].forEach((bx) => {
    const drain = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.03, 0.42), darkMetalMat);
    drain.position.set(bx, -0.17, 9.35);
    group.add(drain);
  });

  // Traffic Sign (Speed Limit / Crosswalk)
  const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.3, 10), brushedSteelMat);
  signPost.position.set(-6.2, 1.0, 8.85);
  const signFace = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.03, 20),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 }),
  );
  signFace.rotation.x = Math.PI / 2;
  signFace.position.set(-6.2, 2.05, 8.85);
  const signRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.26, 0.03, 8, 20),
    new THREE.MeshStandardMaterial({ color: 0xd94a4a, roughness: 0.45 }),
  );
  signRim.position.set(-6.2, 2.05, 8.87);
  group.add(signPost, signFace, signRim);

  // Public Streetlights along sidewalks
  [
    [-18.0, 8.05, 0],
    [0.5, 8.05, 0],
    [18.0, 8.05, 0],
    [-9.5, 16.85, Math.PI],
    [9.5, 16.85, Math.PI],
  ].forEach(([lx, lz, rotY]) => {
    const lamp = new THREE.Group();
    lamp.position.set(lx, -0.1, lz);
    lamp.rotation.y = rotY;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 4.2, 10), darkMetalMat);
    pole.position.y = 2.1;
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.05), darkMetalMat);
    arm.position.set(0, 4.15, 0.45);
    const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.36), warmLedMat);
    bulb.position.set(0, 4.08, 0.85);
    lamp.add(pole, arm, bulb);
    group.add(lamp);
  });

  // Neighboring Residential Facades (Left, Right, Across the Street for Urban Continuity)
  const addNeighborHouse = (x: number, z: number, rotY: number, wallHex: number, roofHex: number) => {
    const nh = new THREE.Group();
    nh.position.set(x, -0.2, z);
    nh.rotation.y = rotY;
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(8.6, 3.3, 6.2),
      new THREE.MeshStandardMaterial({ color: wallHex, roughness: 0.85 }),
    );
    body.position.y = 1.65;
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(9.1, 0.28, 6.7),
      new THREE.MeshStandardMaterial({ color: roofHex, roughness: 0.65 }),
    );
    roof.position.y = 3.42;
    const nDoor = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.2, 0.12), oakMat);
    nDoor.position.set(-1.5, 1.1, 3.12);
    const nWin = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.4, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.15, metalness: 0.5 }),
    );
    nWin.position.set(1.6, 1.6, 3.12);
    const frontFence = new THREE.Mesh(new THREE.BoxGeometry(9.6, 1.15, 0.2), wallFenceMat);
    frontFence.position.set(0, 0.58, 4.4);
    nh.add(body, roof, nDoor, nWin, frontFence);
    group.add(nh);
  };
  addNeighborHouse(-20.5, 1.8, 0, 0xede9e0, 0x475569);
  addNeighborHouse(20.5, 1.8, 0, 0xe4e8ec, 0x3b4252);
  addNeighborHouse(-12.5, 22.5, Math.PI, 0xf2efe8, 0x475569);
  addNeighborHouse(4.0, 22.5, Math.PI, 0xe8e4dc, 0x334155);
  addNeighborHouse(20.0, 22.5, Math.PI, 0xebeef2, 0x475569);

  // =========================================================================
  // 7. SISTEMA DE TRÁFICO SIMULADO (6 VEÍCULOS COM COLISÃO E GIRO DE RODAS)
  // =========================================================================
  const vehicleSpecs: Array<{
    lane: 1 | -1;
    x: number;
    speed: number;
    color: number;
    suv: boolean;
  }> = [
    { lane: 1, x: -24, speed: 5.2, color: 0x315eaa, suv: false },
    { lane: 1, x: -4, speed: 4.5, color: 0xe2e8f0, suv: true },
    { lane: 1, x: 16, speed: 5.6, color: 0xb97a5b, suv: false },
    { lane: -1, x: 22, speed: 5.0, color: 0x334155, suv: true },
    { lane: -1, x: 3, speed: 5.8, color: 0x239b69, suv: false },
    { lane: -1, x: -18, speed: 4.7, color: 0xd97757, suv: false },
  ];

  const vehicles: TrafficVehicle[] = vehicleSpecs.map((spec) => {
    const built = buildCompositeCar(spec.color, spec.suv, castShadows);
    const z = spec.lane === 1 ? 10.8 : 14.1;
    built.group.position.set(spec.x, -0.18, z);
    built.group.rotation.y = spec.lane === 1 ? 0 : Math.PI;
    group.add(built.group);
    return {
      mesh: built.group,
      wheels: built.wheels,
      lane: spec.lane,
      baseSpeed: spec.speed,
      currentSpeed: spec.speed,
      x: spec.x,
      z,
    };
  });

  const ROAD_MIN_X = -34;
  const ROAD_MAX_X = 34;
  const ROAD_SPAN = ROAD_MAX_X - ROAD_MIN_X;

  const updateTraffic = (delta: number, elapsed: number, reducedMotion: boolean) => {
    // Animate subtle pool water ripples
    textures.poolWaterNormal.offset.x = (elapsed * 0.03) % 1;
    textures.poolWaterNormal.offset.y = (elapsed * 0.02) % 1;

    if (reducedMotion) return;

    // Safe following-distance traffic solver (zero GC allocations)
    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      let targetSpeed = v.baseSpeed;

      for (let j = 0; j < vehicles.length; j++) {
        if (i === j) continue;
        const other = vehicles[j];
        if (other.lane !== v.lane) continue;
        let gap = (other.x - v.x) * v.lane;
        if (gap < 0) gap += ROAD_SPAN;
        if (gap < 7.8) {
          targetSpeed = Math.min(targetSpeed, other.currentSpeed * 0.78);
        }
      }

      v.currentSpeed += (targetSpeed - v.currentSpeed) * Math.min(1, delta * 3.5);
      v.x += v.lane * v.currentSpeed * delta;
      if (v.x > ROAD_MAX_X) v.x -= ROAD_SPAN;
      if (v.x < ROAD_MIN_X) v.x += ROAD_SPAN;

      v.mesh.position.x = v.x;
      // Rotate wheels proportionally to travel distance (radius = 0.32m)
      const wheelSpin = (v.currentSpeed * delta) / 0.32;
      for (let w = 0; w < v.wheels.length; w++) {
        v.wheels[w].rotation.y -= wheelSpin;
      }
    }
  };

  return {
    group,
    poolWaterMat,
    vehicles,
    updateTraffic,
  };
}
