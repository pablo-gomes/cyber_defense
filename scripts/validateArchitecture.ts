import * as THREE from 'three';
import { validateHouseArchitecture } from '../src/three/geometryValidator';
import { buildSmartHomeArchitecture } from '../src/three/houseArchitecture';
import { ProceduralTextureSet } from '../src/three/proceduralTextures';

function makeDummyTexture(): THREE.CanvasTexture {
  const tex = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
  tex.needsUpdate = true;
  return tex as unknown as THREE.CanvasTexture;
}

const dummyTex = makeDummyTexture();
const textures: ProceduralTextureSet = {
  woodFloor: dummyTex,
  woodNormal: dummyTex,
  woodRoughness: dummyTex,
  bedroomWood: dummyTex,
  tileFloor: dummyTex,
  tileNormal: dummyTex,
  bathroomTile: dummyTex,
  garageEpoxy: dummyTex,
  marble: dummyTex,
  fabric: dummyTex,
  fabricNormal: dummyTex,
  deckWood: dummyTex,
  stonePaver: dummyTex,
  lawnGrass: dummyTex,
  asphaltRoad: dummyTex,
  sidewalkPaver: dummyTex,
  poolMosaic: dummyTex,
  poolWaterNormal: dummyTex,
  rugLiving: dummyTex,
  rugBedroom: dummyTex,
  artLiving: dummyTex,
  artBedroom: dummyTex,
  tvScreen: dummyTex,
  fridgeScreen: dummyTex,
  monitorScreen: dummyTex,
  contactShadow: dummyTex,
  holoRing: dummyTex,
  dispose: () => {},
};

const arch = buildSmartHomeArchitecture(textures, true);
const report = validateHouseArchitecture(arch);

console.log('=== CYBER DEFENSE ARCHITECTURAL GEOMETRY VALIDATION ===');
console.log('Stats:', JSON.stringify(report.stats));
console.log(`Issues found: ${report.issues.length}`);
for (const issue of report.issues) {
  console.log(`[${issue.severity.toUpperCase()}] (${issue.category}) ${issue.message}`);
}

if (!report.passed) {
  process.exit(1);
}
console.log('ALL ARCHITECTURAL GEOMETRY CHECKS PASSED!');
