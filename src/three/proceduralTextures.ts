import * as THREE from 'three';

export interface ProceduralTextureSet {
  woodFloor: THREE.CanvasTexture;
  woodNormal: THREE.CanvasTexture;
  woodRoughness: THREE.CanvasTexture;
  bedroomWood: THREE.CanvasTexture;
  tileFloor: THREE.CanvasTexture;
  tileNormal: THREE.CanvasTexture;
  bathroomTile: THREE.CanvasTexture;
  garageEpoxy: THREE.CanvasTexture;
  marble: THREE.CanvasTexture;
  fabric: THREE.CanvasTexture;
  fabricNormal: THREE.CanvasTexture;
  deckWood: THREE.CanvasTexture;
  stonePaver: THREE.CanvasTexture;
  lawnGrass: THREE.CanvasTexture;
  asphaltRoad: THREE.CanvasTexture;
  sidewalkPaver: THREE.CanvasTexture;
  poolMosaic: THREE.CanvasTexture;
  poolWaterNormal: THREE.CanvasTexture;
  rugLiving: THREE.CanvasTexture;
  rugBedroom: THREE.CanvasTexture;
  artLiving: THREE.CanvasTexture;
  artBedroom: THREE.CanvasTexture;
  tvScreen: THREE.CanvasTexture;
  fridgeScreen: THREE.CanvasTexture;
  monitorScreen: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  holoRing: THREE.CanvasTexture;
  dispose: () => void;
}

function configureTexture(
  canvas: HTMLCanvasElement,
  repeatX: number,
  repeatY: number,
  maxAnisotropy: number,
  isColor: boolean,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

export function createProceduralTextures(maxAnisotropy: number): ProceduralTextureSet {
  // 1. Scandinavian Light Oak Hardwood (Albedo + Normal + Roughness)
  const woodCanvas = document.createElement('canvas');
  woodCanvas.width = 512;
  woodCanvas.height = 512;
  const wCtx = woodCanvas.getContext('2d')!;

  const woodNormCanvas = document.createElement('canvas');
  woodNormCanvas.width = 512;
  woodNormCanvas.height = 512;
  const wnCtx = woodNormCanvas.getContext('2d')!;
  wnCtx.fillStyle = 'rgb(128,128,255)';
  wnCtx.fillRect(0, 0, 512, 512);

  const woodRoughCanvas = document.createElement('canvas');
  woodRoughCanvas.width = 512;
  woodRoughCanvas.height = 512;
  const wrCtx = woodRoughCanvas.getContext('2d')!;
  wrCtx.fillStyle = 'rgb(145,145,145)';
  wrCtx.fillRect(0, 0, 512, 512);

  const plankRows = 8;
  const plankH = 512 / plankRows;
  for (let r = 0; r < plankRows; r++) {
    const tone = ((r * 7) % 5) * 5 - 10;
    wCtx.fillStyle = `rgb(${214 + tone}, ${192 + tone}, ${164 + tone})`;
    wCtx.fillRect(0, r * plankH + 1, 512, plankH - 2);

    const roughBase = 135 + ((r * 13) % 30);
    wrCtx.fillStyle = `rgb(${roughBase},${roughBase},${roughBase})`;
    wrCtx.fillRect(0, r * plankH + 1, 512, plankH - 2);

    for (let g = 0; g < 9; g++) {
      const gy = r * plankH + 4 + g * 6.8;
      wCtx.strokeStyle = g % 2 === 0 ? 'rgba(138, 108, 76, 0.14)' : 'rgba(255, 248, 236, 0.16)';
      wCtx.lineWidth = 1;
      wCtx.beginPath();
      wCtx.moveTo(0, gy);
      wCtx.bezierCurveTo(160, gy + (g % 2 ? 2.5 : -2.5), 340, gy + (g % 2 ? -2 : 2), 512, gy);
      wCtx.stroke();

      wnCtx.strokeStyle = g % 2 === 0 ? 'rgba(128,142,255,0.45)' : 'rgba(128,114,255,0.45)';
      wnCtx.lineWidth = 1;
      wnCtx.beginPath();
      wnCtx.moveTo(0, gy);
      wnCtx.lineTo(512, gy);
      wnCtx.stroke();
    }

    wCtx.fillStyle = 'rgba(110, 86, 60, 0.32)';
    wCtx.fillRect(0, r * plankH, 512, 2);
    wnCtx.fillStyle = 'rgb(128, 70, 220)';
    wnCtx.fillRect(0, r * plankH, 512, 2);
    wrCtx.fillStyle = 'rgb(220, 220, 220)';
    wrCtx.fillRect(0, r * plankH, 512, 2);

    const jointX = ((r * 173 + 90) % 440) + 32;
    wCtx.fillRect(jointX, r * plankH, 2, plankH);
    wnCtx.fillStyle = 'rgb(70, 128, 220)';
    wnCtx.fillRect(jointX, r * plankH, 2, plankH);
  }
  const woodFloor = configureTexture(woodCanvas, 3.2, 3.2, maxAnisotropy, true);
  const woodNormal = configureTexture(woodNormCanvas, 3.2, 3.2, maxAnisotropy, false);
  const woodRoughness = configureTexture(woodRoughCanvas, 3.2, 3.2, maxAnisotropy, false);

  // 2. Warm Honey-Walnut Bedroom Wood
  const bedWoodCanvas = document.createElement('canvas');
  bedWoodCanvas.width = 512;
  bedWoodCanvas.height = 512;
  const bwCtx = bedWoodCanvas.getContext('2d')!;
  for (let r = 0; r < plankRows; r++) {
    const tone = ((r * 5) % 4) * 5 - 7;
    bwCtx.fillStyle = `rgb(${182 + tone}, ${152 + tone}, ${120 + tone})`;
    bwCtx.fillRect(0, r * plankH + 1, 512, plankH - 2);
    bwCtx.strokeStyle = 'rgba(92, 65, 42, 0.16)';
    for (let g = 0; g < 7; g++) {
      const gy = r * plankH + 6 + g * 8;
      bwCtx.beginPath();
      bwCtx.moveTo(0, gy);
      bwCtx.bezierCurveTo(180, gy + 2, 320, gy - 2, 512, gy);
      bwCtx.stroke();
    }
    bwCtx.fillStyle = 'rgba(70, 48, 30, 0.35)';
    bwCtx.fillRect(0, r * plankH, 512, 2);
    const jx = ((r * 211 + 40) % 450) + 25;
    bwCtx.fillRect(jx, r * plankH, 2, plankH);
  }
  const bedroomWood = configureTexture(bedWoodCanvas, 3, 3, maxAnisotropy, true);

  // 3. Natural Travertine / Porcelain Slab Floor
  const tileCanvas = document.createElement('canvas');
  tileCanvas.width = 512;
  tileCanvas.height = 512;
  const tCtx = tileCanvas.getContext('2d')!;

  const tileNormCanvas = document.createElement('canvas');
  tileNormCanvas.width = 512;
  tileNormCanvas.height = 512;
  const tnCtx = tileNormCanvas.getContext('2d')!;
  tnCtx.fillStyle = 'rgb(128,128,255)';
  tnCtx.fillRect(0, 0, 512, 512);

  tCtx.fillStyle = '#d6d2ca';
  tCtx.fillRect(0, 0, 512, 512);
  const grid = 4;
  const cell = 512 / grid;
  for (let x = 0; x < grid; x++) {
    for (let y = 0; y < grid; y++) {
      const tone = ((x * 3 + y * 5) % 4) * 4;
      tCtx.fillStyle = `rgb(${236 - tone}, ${233 - tone}, ${227 - tone})`;
      tCtx.fillRect(x * cell + 2, y * cell + 2, cell - 4, cell - 4);
      tnCtx.strokeStyle = 'rgb(100,100,220)';
      tnCtx.lineWidth = 3;
      tnCtx.strokeRect(x * cell, y * cell, cell, cell);
    }
  }
  for (let i = 0; i < 240; i++) {
    const fx = (i * 89) % 512;
    const fy = (i * 151) % 512;
    tCtx.fillStyle = i % 2 === 0 ? 'rgba(180,170,155,0.22)' : 'rgba(255,255,255,0.35)';
    tCtx.fillRect(fx, fy, 4, 2);
  }
  const tileFloor = configureTexture(tileCanvas, 2.5, 2.5, maxAnisotropy, true);
  const tileNormal = configureTexture(tileNormCanvas, 2.5, 2.5, maxAnisotropy, false);

  // 3b. Bathroom Terrazzo Tile
  const bathCanvas = document.createElement('canvas');
  bathCanvas.width = 256;
  bathCanvas.height = 256;
  const bCtx = bathCanvas.getContext('2d')!;
  bCtx.fillStyle = '#edf0f2';
  bCtx.fillRect(0, 0, 256, 256);
  const chipCols = ['#94a3b8', '#cbd5e1', '#b9896b', '#64748b'];
  for (let i = 0; i < 110; i++) {
    bCtx.fillStyle = chipCols[i % chipCols.length];
    bCtx.fillRect((i * 53) % 248, (i * 97) % 248, 3 + (i % 4), 2 + (i % 3));
  }
  bCtx.strokeStyle = 'rgba(148,163,184,0.35)';
  bCtx.lineWidth = 2;
  bCtx.strokeRect(0, 0, 128, 128);
  bCtx.strokeRect(128, 128, 128, 128);
  const bathroomTile = configureTexture(bathCanvas, 2.4, 2.4, maxAnisotropy, true);

  // 3c. Garage Epoxy Textured Concrete Floor
  const garCanvas = document.createElement('canvas');
  garCanvas.width = 256;
  garCanvas.height = 256;
  const gCtx = garCanvas.getContext('2d')!;
  gCtx.fillStyle = '#cfd5dd';
  gCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 320; i++) {
    gCtx.fillStyle = i % 3 === 0 ? 'rgba(71,85,105,0.22)' : 'rgba(255,255,255,0.35)';
    gCtx.fillRect((i * 37) % 254, (i * 71) % 254, 2, 2);
  }
  gCtx.strokeStyle = 'rgba(100,116,139,0.25)';
  gCtx.lineWidth = 2;
  gCtx.strokeRect(2, 2, 252, 252);
  const garageEpoxy = configureTexture(garCanvas, 2.5, 3, maxAnisotropy, true);

  // 4. Carrara Marble Countertop Texture
  const marbleCanvas = document.createElement('canvas');
  marbleCanvas.width = 512;
  marbleCanvas.height = 512;
  const mCtx = marbleCanvas.getContext('2d')!;
  mCtx.fillStyle = '#f5f4f0';
  mCtx.fillRect(0, 0, 512, 512);
  for (let v = 0; v < 14; v++) {
    mCtx.strokeStyle = v % 3 === 0 ? 'rgba(148, 163, 184, 0.25)' : 'rgba(203, 213, 225, 0.28)';
    mCtx.lineWidth = v % 3 === 0 ? 2.2 : 1;
    mCtx.beginPath();
    const sy = (v * 43) % 512;
    mCtx.moveTo(0, sy);
    mCtx.bezierCurveTo(
      140,
      sy + ((v % 2 ? 1 : -1) * 45),
      350,
      sy + ((v % 2 ? -1 : 1) * 55),
      512,
      (sy + 60) % 512,
    );
    mCtx.stroke();
  }
  const marble = configureTexture(marbleCanvas, 1.5, 1.5, maxAnisotropy, true);

  // 5. Fine Linen / Bouclé Upholstery Texture (Albedo + Normal)
  const fabCanvas = document.createElement('canvas');
  fabCanvas.width = 256;
  fabCanvas.height = 256;
  const fCtx = fabCanvas.getContext('2d')!;
  fCtx.fillStyle = '#ece9e2';
  fCtx.fillRect(0, 0, 256, 256);

  const fabNormCanvas = document.createElement('canvas');
  fabNormCanvas.width = 256;
  fabNormCanvas.height = 256;
  const fnCtx = fabNormCanvas.getContext('2d')!;
  fnCtx.fillStyle = 'rgb(128,128,255)';
  fnCtx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 256; i += 4) {
    fCtx.fillStyle = i % 8 === 0 ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)';
    fCtx.fillRect(0, i, 256, 2);
    fCtx.fillRect(i, 0, 2, 256);

    fnCtx.fillStyle = 'rgb(128,142,240)';
    fnCtx.fillRect(0, i, 256, 1);
    fnCtx.fillStyle = 'rgb(142,128,240)';
    fnCtx.fillRect(i, 0, 1, 256);
  }
  const fabric = configureTexture(fabCanvas, 4, 4, maxAnisotropy, true);
  const fabricNormal = configureTexture(fabNormCanvas, 4, 4, maxAnisotropy, false);

  // 6. Outdoor Cedar Deck & Natural Limestone Pavers
  const deckCanvas = document.createElement('canvas');
  deckCanvas.width = 512;
  deckCanvas.height = 512;
  const dCtx = deckCanvas.getContext('2d')!;
  for (let i = 0; i < 10; i++) {
    const y = i * 51.2;
    const tone = (i % 3) * 6;
    dCtx.fillStyle = `rgb(${168 - tone}, ${134 - tone}, ${102 - tone})`;
    dCtx.fillRect(0, y + 2, 512, 47);
    dCtx.fillStyle = 'rgba(75, 52, 34, 0.45)';
    dCtx.fillRect(0, y, 512, 3);
  }
  const deckWood = configureTexture(deckCanvas, 2.5, 2.5, maxAnisotropy, true);

  const paverCanvas = document.createElement('canvas');
  paverCanvas.width = 512;
  paverCanvas.height = 512;
  const pCtx = paverCanvas.getContext('2d')!;
  pCtx.fillStyle = '#c2beb6';
  pCtx.fillRect(0, 0, 512, 512);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const shade = ((r * 3 + c) % 4) * 6;
      pCtx.fillStyle = `rgb(${216 - shade}, ${212 - shade}, ${205 - shade})`;
      pCtx.fillRect(c * 128 + 3, r * 128 + 3, 122, 122);
    }
  }
  const stonePaver = configureTexture(paverCanvas, 2, 2, maxAnisotropy, true);

  // 6b. Lush Backyard Lawn Grass
  const grassCanvas = document.createElement('canvas');
  grassCanvas.width = 256;
  grassCanvas.height = 256;
  const grCtx = grassCanvas.getContext('2d')!;
  grCtx.fillStyle = '#9bb87f';
  grCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 550; i++) {
    grCtx.fillStyle =
      i % 3 === 0
        ? 'rgba(118, 152, 92, 0.45)'
        : i % 3 === 1
          ? 'rgba(176, 206, 138, 0.4)'
          : 'rgba(85, 118, 65, 0.25)';
    grCtx.fillRect((i * 47) % 254, (i * 83) % 254, 3, 2);
  }
  const lawnGrass = configureTexture(grassCanvas, 9, 9, maxAnisotropy, true);

  // 6c. Public Asphalt Road + Sidewalk Concrete
  const roadCanvas = document.createElement('canvas');
  roadCanvas.width = 512;
  roadCanvas.height = 512;
  const rCtx = roadCanvas.getContext('2d')!;
  rCtx.fillStyle = '#47505d';
  rCtx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 900; i++) {
    rCtx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.08)';
    rCtx.fillRect((i * 59) % 510, (i * 113) % 510, 2, 2);
  }
  // Dashed center divider
  rCtx.fillStyle = '#facc15';
  rCtx.fillRect(24, 250, 175, 12);
  rCtx.fillRect(280, 250, 175, 12);
  // Crisp white edge shoulders
  rCtx.fillStyle = 'rgba(248, 250, 252, 0.72)';
  rCtx.fillRect(0, 16, 512, 8);
  rCtx.fillRect(0, 488, 512, 8);
  const asphaltRoad = configureTexture(roadCanvas, 8, 1, maxAnisotropy, true);

  const swCanvas = document.createElement('canvas');
  swCanvas.width = 256;
  swCanvas.height = 256;
  const swCtx = swCanvas.getContext('2d')!;
  swCtx.fillStyle = '#dfe3e8';
  swCtx.fillRect(0, 0, 256, 256);
  swCtx.strokeStyle = '#cbd5e1';
  swCtx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    swCtx.strokeRect(i * 64, 0, 64, 128);
    swCtx.strokeRect(i * 64, 128, 64, 128);
  }
  const sidewalkPaver = configureTexture(swCanvas, 16, 1, maxAnisotropy, true);

  // 6d. Pool Mosaic & Water Normal Map
  const pmCanvas = document.createElement('canvas');
  pmCanvas.width = 256;
  pmCanvas.height = 256;
  const pmCtx = pmCanvas.getContext('2d')!;
  pmCtx.fillStyle = '#38bdf8';
  pmCtx.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      const shift = ((x * 5 + y * 3) % 4) * 9;
      pmCtx.fillStyle = `rgb(${32 + shift}, ${164 + shift}, ${216 + shift / 2})`;
      pmCtx.fillRect(x * 16 + 1, y * 16 + 1, 14, 14);
    }
  }
  const poolMosaic = configureTexture(pmCanvas, 3, 2, maxAnisotropy, true);

  const pwNormCanvas = document.createElement('canvas');
  pwNormCanvas.width = 256;
  pwNormCanvas.height = 256;
  const pwnCtx = pwNormCanvas.getContext('2d')!;
  pwnCtx.fillStyle = 'rgb(128,128,255)';
  pwnCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 48; i++) {
    pwnCtx.strokeStyle = i % 2 === 0 ? 'rgba(165,165,255,0.4)' : 'rgba(95,95,255,0.4)';
    pwnCtx.lineWidth = 3;
    pwnCtx.beginPath();
    pwnCtx.arc((i * 53) % 256, (i * 79) % 256, 18 + (i % 20), 0, Math.PI * 2);
    pwnCtx.stroke();
  }
  const poolWaterNormal = configureTexture(pwNormCanvas, 3, 2, maxAnisotropy, false);

  // 7. Woven Area Rugs (Living & Bedroom)
  const rugLCanvas = document.createElement('canvas');
  rugLCanvas.width = 256;
  rugLCanvas.height = 256;
  const rlCtx = rugLCanvas.getContext('2d')!;
  rlCtx.fillStyle = '#dedad2';
  rlCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 4) {
    rlCtx.fillStyle = i % 8 === 0 ? 'rgba(120,113,108,0.12)' : 'rgba(255,255,255,0.22)';
    rlCtx.fillRect(0, i, 256, 2);
  }
  rlCtx.strokeStyle = 'rgba(100, 96, 90, 0.25)';
  rlCtx.lineWidth = 8;
  rlCtx.strokeRect(12, 12, 232, 232);
  const rugLiving = configureTexture(rugLCanvas, 1, 1, maxAnisotropy, true);

  const rugBCanvas = document.createElement('canvas');
  rugBCanvas.width = 256;
  rugBCanvas.height = 256;
  const rbCtx = rugBCanvas.getContext('2d')!;
  rbCtx.fillStyle = '#d5dbe2';
  rbCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 6) {
    rbCtx.fillStyle = 'rgba(100,116,139,0.12)';
    rbCtx.fillRect(i, 0, 2, 256);
  }
  const rugBedroom = configureTexture(rugBCanvas, 1, 1, maxAnisotropy, true);

  // 8. Framed Minimalist Wall Artworks
  const art1Canvas = document.createElement('canvas');
  art1Canvas.width = 256;
  art1Canvas.height = 256;
  const a1 = art1Canvas.getContext('2d')!;
  a1.fillStyle = '#f4f1ea';
  a1.fillRect(0, 0, 256, 256);
  a1.fillStyle = '#c48f65';
  a1.beginPath();
  a1.arc(140, 118, 56, 0, Math.PI * 2);
  a1.fill();
  a1.fillStyle = '#2d3748';
  a1.beginPath();
  a1.moveTo(45, 215);
  a1.quadraticCurveTo(128, 125, 210, 215);
  a1.fill();
  const artLiving = configureTexture(art1Canvas, 1, 1, maxAnisotropy, true);

  const art2Canvas = document.createElement('canvas');
  art2Canvas.width = 256;
  art2Canvas.height = 256;
  const a2 = art2Canvas.getContext('2d')!;
  a2.fillStyle = '#f3f2ee';
  a2.fillRect(0, 0, 256, 256);
  a2.strokeStyle = '#64748b';
  a2.lineWidth = 5;
  a2.beginPath();
  a2.arc(128, 128, 62, 0.4, Math.PI * 1.7);
  a2.stroke();
  a2.fillStyle = '#94a3b8';
  a2.fillRect(72, 168, 112, 12);
  const artBedroom = configureTexture(art2Canvas, 1, 1, maxAnisotropy, true);

  // 9. Smart TV 4K, Fridge & Office Monitor Screens
  const tvCanvas = document.createElement('canvas');
  tvCanvas.width = 512;
  tvCanvas.height = 256;
  const tvCtx = tvCanvas.getContext('2d')!;
  const tvGrad = tvCtx.createLinearGradient(0, 0, 512, 256);
  tvGrad.addColorStop(0, '#1e3a5f');
  tvGrad.addColorStop(0.55, '#3b6998');
  tvGrad.addColorStop(1, '#1a2c42');
  tvCtx.fillStyle = tvGrad;
  tvCtx.fillRect(0, 0, 512, 256);
  tvCtx.fillStyle = 'rgba(255,255,255,0.12)';
  tvCtx.beginPath();
  tvCtx.arc(380, 90, 88, 0, Math.PI * 2);
  tvCtx.fill();
  tvCtx.fillStyle = '#f8fafc';
  tvCtx.font = '600 24px sans-serif';
  tvCtx.fillText('18:45', 42, 64);
  tvCtx.font = '15px sans-serif';
  tvCtx.fillStyle = '#cbd5e1';
  tvCtx.fillText('Modo Conforto · 22 °C', 42, 92);
  const tvScreen = configureTexture(tvCanvas, 1, 1, maxAnisotropy, true);
  tvScreen.wrapS = THREE.ClampToEdgeWrapping;
  tvScreen.wrapT = THREE.ClampToEdgeWrapping;

  const frCanvas = document.createElement('canvas');
  frCanvas.width = 256;
  frCanvas.height = 256;
  const frCtx = frCanvas.getContext('2d')!;
  frCtx.fillStyle = '#18212f';
  frCtx.fillRect(0, 0, 256, 256);
  frCtx.fillStyle = '#e2e8f0';
  frCtx.font = 'bold 36px sans-serif';
  frCtx.textAlign = 'center';
  frCtx.fillText('3°C', 128, 96);
  frCtx.fillStyle = '#94a3b8';
  frCtx.font = '16px sans-serif';
  frCtx.fillText('SMART COOLING', 128, 138);
  frCtx.fillStyle = '#315eaa';
  frCtx.fillRect(68, 174, 120, 8);
  const fridgeScreen = configureTexture(frCanvas, 1, 1, maxAnisotropy, true);
  fridgeScreen.wrapS = THREE.ClampToEdgeWrapping;
  fridgeScreen.wrapT = THREE.ClampToEdgeWrapping;

  const monCanvas = document.createElement('canvas');
  monCanvas.width = 256;
  monCanvas.height = 160;
  const monCtx = monCanvas.getContext('2d')!;
  monCtx.fillStyle = '#0f172a';
  monCtx.fillRect(0, 0, 256, 160);
  monCtx.fillStyle = '#1e293b';
  monCtx.fillRect(10, 12, 95, 136);
  monCtx.fillStyle = '#315eaa';
  monCtx.fillRect(114, 12, 132, 34);
  monCtx.fillStyle = '#334155';
  monCtx.fillRect(114, 54, 132, 94);
  monCtx.fillStyle = '#94a3b8';
  monCtx.fillRect(20, 24, 65, 6);
  monCtx.fillRect(20, 38, 52, 6);
  monCtx.fillRect(20, 52, 72, 6);
  const monitorScreen = configureTexture(monCanvas, 1, 1, maxAnisotropy, true);
  monitorScreen.wrapS = THREE.ClampToEdgeWrapping;
  monitorScreen.wrapT = THREE.ClampToEdgeWrapping;

  // 10. Soft Contact Shadow & Architectural Status Ring
  const shCanvas = document.createElement('canvas');
  shCanvas.width = 128;
  shCanvas.height = 128;
  const sCtx = shCanvas.getContext('2d')!;
  const shGrad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 62);
  shGrad.addColorStop(0, 'rgba(24, 33, 47, 0.28)');
  shGrad.addColorStop(0.6, 'rgba(24, 33, 47, 0.11)');
  shGrad.addColorStop(1, 'rgba(24, 33, 47, 0)');
  sCtx.fillStyle = shGrad;
  sCtx.fillRect(0, 0, 128, 128);
  const contactShadow = new THREE.CanvasTexture(shCanvas);
  contactShadow.colorSpace = THREE.SRGBColorSpace;

  const holoCanvas = document.createElement('canvas');
  holoCanvas.width = 256;
  holoCanvas.height = 256;
  const hCtx = holoCanvas.getContext('2d')!;
  hCtx.clearRect(0, 0, 256, 256);
  hCtx.strokeStyle = '#ffffff';
  hCtx.lineWidth = 7;
  hCtx.beginPath();
  hCtx.arc(128, 128, 102, 0, Math.PI * 2);
  hCtx.stroke();
  const holoRing = new THREE.CanvasTexture(holoCanvas);
  holoRing.colorSpace = THREE.SRGBColorSpace;

  return {
    woodFloor,
    woodNormal,
    woodRoughness,
    bedroomWood,
    tileFloor,
    tileNormal,
    bathroomTile,
    garageEpoxy,
    marble,
    fabric,
    fabricNormal,
    deckWood,
    stonePaver,
    lawnGrass,
    asphaltRoad,
    sidewalkPaver,
    poolMosaic,
    poolWaterNormal,
    rugLiving,
    rugBedroom,
    artLiving,
    artBedroom,
    tvScreen,
    fridgeScreen,
    monitorScreen,
    contactShadow,
    holoRing,
    dispose: () => {
      woodFloor.dispose();
      woodNormal.dispose();
      woodRoughness.dispose();
      bedroomWood.dispose();
      tileFloor.dispose();
      tileNormal.dispose();
      bathroomTile.dispose();
      garageEpoxy.dispose();
      marble.dispose();
      fabric.dispose();
      fabricNormal.dispose();
      deckWood.dispose();
      stonePaver.dispose();
      lawnGrass.dispose();
      asphaltRoad.dispose();
      sidewalkPaver.dispose();
      poolMosaic.dispose();
      poolWaterNormal.dispose();
      rugLiving.dispose();
      rugBedroom.dispose();
      artLiving.dispose();
      artBedroom.dispose();
      tvScreen.dispose();
      fridgeScreen.dispose();
      monitorScreen.dispose();
      contactShadow.dispose();
      holoRing.dispose();
    },
  };
}
