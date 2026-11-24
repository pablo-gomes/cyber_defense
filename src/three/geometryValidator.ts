import * as THREE from 'three';
import { ROOMS, SMART_DEVICES } from '../data/smartHomeData';
import {
  ARCH,
  CORNER_POSTS,
  getDoorwayClearanceBoxes,
  WALL_SEGMENTS,
} from './architectureSpec';
import { HouseBuildResult } from './houseArchitecture';

export interface GeometryIssue {
  category:
    | 'wall_overlap'
    | 'floor_overlap'
    | 'furniture_wall_collision'
    | 'furniture_doorway_blockage'
    | 'floating_furniture'
    | 'geometry_attribute'
    | 'device_bounds';
  severity: 'error' | 'warning';
  message: string;
}

export interface GeometryValidationReport {
  passed: boolean;
  stats: {
    wallsChecked: number;
    floorsChecked: number;
    furnitureChecked: number;
    doorwaysChecked: number;
    devicesChecked: number;
    meshesChecked: number;
  };
  issues: GeometryIssue[];
}

function boxesOverlap(a: THREE.Box3, b: THREE.Box3, tolerance = 0.015): boolean {
  return (
    a.min.x < b.max.x - tolerance &&
    a.max.x > b.min.x + tolerance &&
    a.min.y < b.max.y - tolerance &&
    a.max.y > b.min.y + tolerance &&
    a.min.z < b.max.z - tolerance &&
    a.max.z > b.min.z + tolerance
  );
}

function boxesOverlapXZ(
  a: THREE.Box3,
  b: { minX: number; maxX: number; minZ: number; maxZ: number },
  tolerance = 0.02,
): boolean {
  return (
    a.min.x < b.maxX - tolerance &&
    a.max.x > b.minX + tolerance &&
    a.min.z < b.maxZ - tolerance &&
    a.max.z > b.minZ + tolerance
  );
}

export function validateHouseArchitecture(arch: HouseBuildResult): GeometryValidationReport {
  const issues: GeometryIssue[] = [];
  arch.group.updateMatrixWorld(true);

  const wallBoxes: Array<{ label: string; box: THREE.Box3 }> = [];
  const floorBoxes: Array<{ label: string; box: THREE.Box3 }> = [];
  const furnitureBoxes: Array<{
    label: string;
    box: THREE.Box3;
    mount?: 'wall' | 'ceiling';
    isRug?: boolean;
  }> = [];
  let meshesChecked = 0;

  // 1. Validate structure meshes (walls, posts, floors, geometry attributes)
  arch.group.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      meshesChecked++;
      const mesh = obj as THREE.Mesh;
      const posAttr = mesh.geometry.getAttribute('position');
      const normAttr = mesh.geometry.getAttribute('normal');
      if (!posAttr || posAttr.count === 0) {
        issues.push({
          category: 'geometry_attribute',
          severity: 'error',
          message: `Mesh sem vértices válidos: ${mesh.name || mesh.userData.archId || 'unnamed'}`,
        });
      }
      if (!normAttr || normAttr.count === 0) {
        issues.push({
          category: 'geometry_attribute',
          severity: 'warning',
          message: `Mesh sem normais calculadas: ${mesh.name || mesh.userData.archId || 'unnamed'}`,
        });
      }

      const cat = mesh.userData.archCategory as string | undefined;
      if (cat === 'wall' || cat === 'post') {
        const box = new THREE.Box3().setFromObject(mesh);
        wallBoxes.push({
          label: `${cat}:${String(mesh.userData.archId ?? 'mesh')}`,
          box,
        });
      } else if (cat === 'floor' || cat === 'threshold') {
        const box = new THREE.Box3().setFromObject(mesh);
        floorBoxes.push({
          label: `${cat}:${String(mesh.userData.roomId ?? 'threshold')}`,
          box,
        });
      }
    }
  });

  // 2. Collect top-level furniture items
  for (const child of arch.furnitureGroup.children) {
    const box = new THREE.Box3().setFromObject(child);
    if (box.isEmpty()) continue;
    furnitureBoxes.push({
      label: child.name || child.userData.archCategory || `item(${box.min.x.toFixed(2)},${box.min.z.toFixed(2)})`,
      box,
      mount: child.userData.archMount as 'wall' | 'ceiling' | undefined,
      isRug: child.userData.archCategory === 'rug',
    });
  }

  // 3. Check Wall-Wall and Wall-Post Overlaps
  for (let i = 0; i < wallBoxes.length; i++) {
    for (let j = i + 1; j < wallBoxes.length; j++) {
      if (boxesOverlap(wallBoxes[i].box, wallBoxes[j].box, 0.01)) {
        issues.push({
          category: 'wall_overlap',
          severity: 'error',
          message: `Sobreposição estrutural detectada entre ${wallBoxes[i].label} e ${wallBoxes[j].label}`,
        });
      }
    }
  }

  // 4. Check Floor-Floor Overlaps (Z-fighting prevention)
  for (let i = 0; i < floorBoxes.length; i++) {
    for (let j = i + 1; j < floorBoxes.length; j++) {
      if (boxesOverlap(floorBoxes[i].box, floorBoxes[j].box, 0.008)) {
        issues.push({
          category: 'floor_overlap',
          severity: 'error',
          message: `Sobreposição de pisos detectada entre ${floorBoxes[i].label} e ${floorBoxes[j].label}`,
        });
      }
    }
  }

  // 5. Check Furniture vs Wall Collisions + Doorway Clearances + Grounding
  const doorways = getDoorwayClearanceBoxes();
  for (const furn of furnitureBoxes) {
    // Grounding check: floor furniture must sit flush at FLOOR_Y (0.04); wall/ceiling mounts are exempt
    if (!furn.mount && (furn.box.min.y > ARCH.FLOOR_Y + 0.04 || furn.box.min.y < ARCH.FLOOR_Y - 0.02)) {
      issues.push({
        category: 'floating_furniture',
        severity: 'warning',
        message: `Mobiliário possivelmente flutuando ou afundado (minY=${furn.box.min.y.toFixed(3)}) em ${furn.label}`,
      });
    }

    // Wall collision check (allow 0.025m flush contact with walls)
    for (const wall of wallBoxes) {
      if (boxesOverlap(furn.box, wall.box, 0.025)) {
        issues.push({
          category: 'furniture_wall_collision',
          severity: 'error',
          message: `Objeto ${furn.label} atravessando parede ${wall.label}`,
        });
      }
    }

    // Doorway clearance check (ignore flat rugs & high wall/ceiling mounts)
    if (!furn.isRug && furn.box.min.y < ARCH.DOOR_H) {
      for (const dw of doorways) {
        if (boxesOverlapXZ(furn.box, dw, 0.04)) {
          issues.push({
            category: 'furniture_doorway_blockage',
            severity: 'error',
            message: `Objeto ${furn.label} bloqueando passagem/porta ${dw.id}`,
          });
        }
      }
    }
  }

  // 6. Validate all 33 IoT devices fall inside their assigned room bounds (with mounting tolerance)
  for (const dev of SMART_DEVICES) {
    const room = ROOMS.find((r) => r.id === dev.roomId);
    if (!room) {
      issues.push({
        category: 'device_bounds',
        severity: 'error',
        message: `Dispositivo ${dev.id} referencia cômodo inexistente (${dev.roomId})`,
      });
      continue;
    }
    const [dx, , dz] = dev.position;
    const tol = 0.35; // allow exterior/facade wall mounting just on boundary
    if (
      dx < room.floorBounds.minX - tol ||
      dx > room.floorBounds.maxX + tol ||
      dz < room.floorBounds.minZ - tol ||
      dz > room.floorBounds.maxZ + tol
    ) {
      issues.push({
        category: 'device_bounds',
        severity: 'error',
        message: `Dispositivo ${dev.id} (${dx}, ${dz}) fora dos limites de ${room.id}`,
      });
    }
  }

  return {
    passed: issues.filter((i) => i.severity === 'error').length === 0,
    stats: {
      wallsChecked: WALL_SEGMENTS.length + CORNER_POSTS.length,
      floorsChecked: floorBoxes.length,
      furnitureChecked: furnitureBoxes.length,
      doorwaysChecked: doorways.length,
      devicesChecked: SMART_DEVICES.length,
      meshesChecked,
    },
    issues,
  };
}
