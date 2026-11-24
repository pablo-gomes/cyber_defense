import { RoomId } from '../types/game';

/**
 * Unified architectural metric specification (1 unit = 1 meter).
 * Origin Y = 0.00 is the structural subfloor / foundation top.
 * Interior finished floor surface sits at FLOOR_Y = 0.04.
 */
export const ARCH = {
  WALL_T: 0.18,
  WALL_H: 2.8,
  FOUNDATION_H: 0.24,
  FLOOR_THICK: 0.04,
  FLOOR_Y: 0.04,
  CEILING_THICK: 0.1,
  CEILING_Y: 2.8,
  ROOF_THICK: 0.18,
  ROOF_PARAPET_H: 0.14,
  BASEBOARD_H: 0.085,
  BASEBOARD_PROTRUSION: 0.014,
  CAP_H: 0.032,

  DOOR_W: 0.92,
  DOOR_H: 2.15,
  DOUBLE_PORTAL_W: 1.8,
  DOUBLE_PORTAL_H: 2.35,
  SLIDING_DOOR_W: 2.1,
  SLIDING_DOOR_H: 2.25,
  GARAGE_DOOR_W: 3.8,
  GARAGE_DOOR_H: 2.25,

  WINDOW_SILL_Y: 0.72,
  WINDOW_H: 1.48,
  BATH_WINDOW_SILL_Y: 1.45,
  BATH_WINDOW_H: 0.75,

  EXTERIOR_LAWN_Y: -0.22,
  EXTERIOR_LAWN_THICK: 0.12, // top at -0.16
  SIDEWALK_TOP_Y: -0.1,
  ROAD_TOP_Y: -0.18,
  DECK_THICK: 0.04,
} as const;

export const GRID_X = {
  WEST_EXT: -11.2,
  WEST_SPINE: -5.6,
  CENTER_SPINE: 0.5,
  EAST_SPINE: 5.8,
  EAST_EXT: 11.2,
} as const;

export const GRID_Z = {
  NORTH_EXT: -9.4,
  NORTH_SPINE: -4.9,
  MID_SPINE: -0.8,
  EAST_MID_SPINE: 0.3,
  SOUTH_LIVING: 4.5,
  SOUTH_GARAGE: 6.4,
  SOUTH_HALL: 6.8,
} as const;

export interface RoomRectSpec {
  id: RoomId;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  floorType: 'wood_oak' | 'wood_walnut' | 'porcelain' | 'terrazzo' | 'epoxy' | 'deck' | 'stone' | 'lawn' | 'asphalt';
  hasCeiling: boolean;
}

export const ROOM_RECTS: Record<RoomId, RoomRectSpec> = {
  guest_bedroom: {
    id: 'guest_bedroom',
    minX: GRID_X.WEST_EXT,
    maxX: GRID_X.WEST_SPINE,
    minZ: GRID_Z.NORTH_EXT,
    maxZ: GRID_Z.NORTH_SPINE,
    floorType: 'wood_walnut',
    hasCeiling: true,
  },
  bathroom: {
    id: 'bathroom',
    minX: GRID_X.WEST_EXT,
    maxX: GRID_X.WEST_SPINE,
    minZ: GRID_Z.NORTH_SPINE,
    maxZ: GRID_Z.MID_SPINE,
    floorType: 'terrazzo',
    hasCeiling: true,
  },
  office: {
    id: 'office',
    minX: GRID_X.WEST_EXT,
    maxX: GRID_X.WEST_SPINE,
    minZ: GRID_Z.MID_SPINE,
    maxZ: GRID_Z.SOUTH_LIVING,
    floorType: 'wood_oak',
    hasCeiling: true,
  },
  bedroom: {
    id: 'bedroom',
    minX: GRID_X.WEST_SPINE,
    maxX: GRID_X.CENTER_SPINE,
    minZ: GRID_Z.NORTH_SPINE,
    maxZ: GRID_Z.MID_SPINE,
    floorType: 'wood_walnut',
    hasCeiling: true,
  },
  living_room: {
    id: 'living_room',
    minX: GRID_X.WEST_SPINE,
    maxX: GRID_X.CENTER_SPINE,
    minZ: GRID_Z.MID_SPINE,
    maxZ: GRID_Z.SOUTH_LIVING,
    floorType: 'wood_oak',
    hasCeiling: true,
  },
  hallway: {
    id: 'hallway',
    minX: GRID_X.WEST_SPINE,
    maxX: GRID_X.CENTER_SPINE,
    minZ: GRID_Z.SOUTH_LIVING,
    maxZ: GRID_Z.SOUTH_HALL,
    floorType: 'porcelain',
    hasCeiling: true,
  },
  kitchen: {
    id: 'kitchen',
    minX: GRID_X.CENTER_SPINE,
    maxX: GRID_X.EAST_SPINE,
    minZ: GRID_Z.NORTH_SPINE,
    maxZ: GRID_Z.EAST_MID_SPINE,
    floorType: 'porcelain',
    hasCeiling: true,
  },
  exterior: {
    id: 'exterior',
    minX: GRID_X.CENTER_SPINE,
    maxX: GRID_X.EAST_SPINE,
    minZ: GRID_Z.EAST_MID_SPINE,
    maxZ: 4.8,
    floorType: 'deck',
    hasCeiling: false,
  },
  gourmet: {
    id: 'gourmet',
    minX: GRID_X.CENTER_SPINE,
    maxX: GRID_X.EAST_SPINE,
    minZ: GRID_Z.NORTH_EXT,
    maxZ: GRID_Z.NORTH_SPINE,
    floorType: 'deck',
    hasCeiling: false,
  },
  laundry: {
    id: 'laundry',
    minX: GRID_X.EAST_SPINE,
    maxX: GRID_X.EAST_EXT,
    minZ: GRID_Z.NORTH_EXT,
    maxZ: GRID_Z.NORTH_SPINE,
    floorType: 'porcelain',
    hasCeiling: true,
  },
  dining_room: {
    id: 'dining_room',
    minX: GRID_X.EAST_SPINE,
    maxX: GRID_X.EAST_EXT,
    minZ: GRID_Z.NORTH_SPINE,
    maxZ: GRID_Z.EAST_MID_SPINE,
    floorType: 'wood_oak',
    hasCeiling: true,
  },
  garage: {
    id: 'garage',
    minX: GRID_X.EAST_SPINE,
    maxX: GRID_X.EAST_EXT,
    minZ: GRID_Z.EAST_MID_SPINE,
    maxZ: GRID_Z.SOUTH_GARAGE,
    floorType: 'epoxy',
    hasCeiling: true,
  },
  pool: {
    id: 'pool',
    minX: -5.2,
    maxX: 4.8,
    minZ: -17.8,
    maxZ: -10.2,
    floorType: 'stone',
    hasCeiling: false,
  },
  backyard: {
    id: 'backyard',
    minX: -13.5,
    maxX: 13.5,
    minZ: -19.5,
    maxZ: -9.5,
    floorType: 'lawn',
    hasCeiling: false,
  },
  street: {
    id: 'street',
    minX: -28,
    maxX: 28,
    minZ: 7.2,
    maxZ: 17.5,
    floorType: 'asphalt',
    hasCeiling: false,
  },
};

export type OpeningType =
  | 'door_hinged'
  | 'door_double_entry'
  | 'door_sliding_glass'
  | 'door_garage'
  | 'portal_arch'
  | 'window'
  | 'interior_glass_window'
  | 'window_clerestory';

export interface WallOpeningSpec {
  id: string;
  /** Center coordinate along the wall's primary axis (X for E-W walls, Z for N-S walls) */
  centerCoord: number;
  width: number;
  sillY: number;
  height: number;
  type: OpeningType;
  /** Direction the door swings or glass faces (+1 or -1 perpendicular to wall) */
  swingDir?: 1 | -1;
  /** Hinge side along primary axis (+1 or -1) */
  hingeSide?: 1 | -1;
  /** Optional curtain set on interior side (+1 or -1 perpendicular to wall) */
  curtainSide?: 1 | -1;
  /** Threshold material at floor level */
  threshold?: 'stone' | 'wood' | 'none';
}

export interface WallSegmentSpec {
  id: string;
  axis: 'x' | 'z';
  /** Fixed coordinate perpendicular to wall axis (Z for axis='x', X for axis='z') */
  fixedCoord: number;
  /** Centerline grid start and end along primary axis (corners trimmed by half WALL_T automatically) */
  start: number;
  end: number;
  materialVariant?: 'standard' | 'accent' | 'bath_tile';
  isExterior: boolean;
  openings: WallOpeningSpec[];
}

export interface CornerPostSpec {
  id: string;
  x: number;
  z: number;
  materialVariant?: 'standard' | 'accent';
}

/**
 * Exact grid intersection posts (every wall junction has a crisp WALL_T x WALL_H x WALL_T column,
 * while wall spans run strictly between post faces: [start + WALL_T/2, end - WALL_T/2]).
 * This mathematically prevents any wall-wall overlap or corner crack!
 */
export const CORNER_POSTS: CornerPostSpec[] = [
  // Row Z = -9.4 (NORTH_EXT)
  { id: 'post_w_n', x: GRID_X.WEST_EXT, z: GRID_Z.NORTH_EXT },
  { id: 'post_ws_n', x: GRID_X.WEST_SPINE, z: GRID_Z.NORTH_EXT },
  { id: 'post_es_n', x: GRID_X.EAST_SPINE, z: GRID_Z.NORTH_EXT },
  { id: 'post_e_n', x: GRID_X.EAST_EXT, z: GRID_Z.NORTH_EXT },

  // Row Z = -4.9 (NORTH_SPINE)
  { id: 'post_w_ns', x: GRID_X.WEST_EXT, z: GRID_Z.NORTH_SPINE },
  { id: 'post_ws_ns', x: GRID_X.WEST_SPINE, z: GRID_Z.NORTH_SPINE },
  { id: 'post_c_ns', x: GRID_X.CENTER_SPINE, z: GRID_Z.NORTH_SPINE },
  { id: 'post_es_ns', x: GRID_X.EAST_SPINE, z: GRID_Z.NORTH_SPINE },
  { id: 'post_e_ns', x: GRID_X.EAST_EXT, z: GRID_Z.NORTH_SPINE },

  // Row Z = -0.8 (MID_SPINE)
  { id: 'post_w_m', x: GRID_X.WEST_EXT, z: GRID_Z.MID_SPINE },
  { id: 'post_ws_m', x: GRID_X.WEST_SPINE, z: GRID_Z.MID_SPINE },
  { id: 'post_c_m', x: GRID_X.CENTER_SPINE, z: GRID_Z.MID_SPINE },

  // Row Z = 0.3 (EAST_MID_SPINE)
  { id: 'post_c_em', x: GRID_X.CENTER_SPINE, z: GRID_Z.EAST_MID_SPINE },
  { id: 'post_es_em', x: GRID_X.EAST_SPINE, z: GRID_Z.EAST_MID_SPINE },
  { id: 'post_e_em', x: GRID_X.EAST_EXT, z: GRID_Z.EAST_MID_SPINE },

  // Row Z = 4.5 (SOUTH_LIVING)
  { id: 'post_w_sl', x: GRID_X.WEST_EXT, z: GRID_Z.SOUTH_LIVING },
  { id: 'post_ws_sl', x: GRID_X.WEST_SPINE, z: GRID_Z.SOUTH_LIVING },
  { id: 'post_c_sl', x: GRID_X.CENTER_SPINE, z: GRID_Z.SOUTH_LIVING },

  // Row Z = 6.4 (SOUTH_GARAGE)
  { id: 'post_es_sg', x: GRID_X.EAST_SPINE, z: GRID_Z.SOUTH_GARAGE },
  { id: 'post_e_sg', x: GRID_X.EAST_EXT, z: GRID_Z.SOUTH_GARAGE },

  // Row Z = 6.8 (SOUTH_HALL)
  { id: 'post_ws_sh', x: GRID_X.WEST_SPINE, z: GRID_Z.SOUTH_HALL },
  { id: 'post_c_sh', x: GRID_X.CENTER_SPINE, z: GRID_Z.SOUTH_HALL },
];

export const WALL_SEGMENTS: WallSegmentSpec[] = [
  // =========================================================================
  // HORIZONTAL WALLS (axis = 'x', fixed Z)
  // =========================================================================
  // Guest Bedroom North Backyard Wall (z = -9.40, x: -11.20 -> -5.60)
  {
    id: 'wall_guest_north',
    axis: 'x',
    fixedCoord: GRID_Z.NORTH_EXT,
    start: GRID_X.WEST_EXT,
    end: GRID_X.WEST_SPINE,
    isExterior: true,
    openings: [
      {
        id: 'win_guest_north',
        centerCoord: -8.6,
        width: 2.1,
        sillY: ARCH.WINDOW_SILL_Y,
        height: ARCH.WINDOW_H,
        type: 'window',
        curtainSide: 1,
      },
    ],
  },
  // Laundry North Backyard Wall (z = -9.40, x: 5.80 -> 11.20)
  {
    id: 'wall_laundry_north',
    axis: 'x',
    fixedCoord: GRID_Z.NORTH_EXT,
    start: GRID_X.EAST_SPINE,
    end: GRID_X.EAST_EXT,
    isExterior: true,
    openings: [
      {
        id: 'door_laundry_back',
        centerCoord: 6.9,
        width: ARCH.DOOR_W,
        sillY: 0,
        height: ARCH.DOOR_H,
        type: 'door_hinged',
        swingDir: 1,
        hingeSide: -1,
        threshold: 'stone',
      },
      {
        id: 'win_laundry_north',
        centerCoord: 9.4,
        width: 1.35,
        sillY: 1.15,
        height: 1.05,
        type: 'window_clerestory',
      },
    ],
  },

  // Guest Bedroom <-> Bathroom Wall (z = -4.90, x: -11.20 -> -5.60)
  {
    id: 'wall_guest_bath',
    axis: 'x',
    fixedCoord: GRID_Z.NORTH_SPINE,
    start: GRID_X.WEST_EXT,
    end: GRID_X.WEST_SPINE,
    isExterior: false,
    openings: [
      {
        id: 'door_guest_bath',
        centerCoord: -6.4,
        width: ARCH.DOOR_W,
        sillY: 0,
        height: ARCH.DOOR_H,
        type: 'door_hinged',
        swingDir: -1,
        hingeSide: 1,
        threshold: 'stone',
      },
    ],
  },
  // Bedroom North Exterior Wall (z = -4.90, x: -5.60 -> 0.50)
  {
    id: 'wall_bedroom_north',
    axis: 'x',
    fixedCoord: GRID_Z.NORTH_SPINE,
    start: GRID_X.WEST_SPINE,
    end: GRID_X.CENTER_SPINE,
    isExterior: true,
    openings: [
      {
        id: 'win_bedroom_north',
        centerCoord: -1.35,
        width: 2.0,
        sillY: ARCH.WINDOW_SILL_Y,
        height: ARCH.WINDOW_H,
        type: 'window',
        curtainSide: 1,
      },
    ],
  },
  // Kitchen <-> Gourmet Wall (z = -4.90, x: 0.50 -> 5.80)
  {
    id: 'wall_kitchen_gourmet',
    axis: 'x',
    fixedCoord: GRID_Z.NORTH_SPINE,
    start: GRID_X.CENTER_SPINE,
    end: GRID_X.EAST_SPINE,
    isExterior: true,
    openings: [
      {
        id: 'door_kitchen_gourmet',
        centerCoord: 2.65,
        width: 1.9,
        sillY: 0,
        height: ARCH.SLIDING_DOOR_H,
        type: 'door_sliding_glass',
        threshold: 'stone',
      },
    ],
  },
  // Dining <-> Laundry Wall (z = -4.90, x: 5.80 -> 11.20)
  {
    id: 'wall_dining_laundry',
    axis: 'x',
    fixedCoord: GRID_Z.NORTH_SPINE,
    start: GRID_X.EAST_SPINE,
    end: GRID_X.EAST_EXT,
    isExterior: false,
    openings: [
      {
        id: 'door_dining_laundry',
        centerCoord: 6.65,
        width: ARCH.DOOR_W,
        sillY: 0,
        height: ARCH.DOOR_H,
        type: 'door_hinged',
        swingDir: -1,
        hingeSide: -1,
        threshold: 'stone',
      },
    ],
  },

  // Bathroom <-> Office Wall (z = -0.80, x: -11.20 -> -5.60)
  {
    id: 'wall_bath_office',
    axis: 'x',
    fixedCoord: GRID_Z.MID_SPINE,
    start: GRID_X.WEST_EXT,
    end: GRID_X.WEST_SPINE,
    isExterior: false,
    openings: [
      {
        id: 'door_bath_office',
        centerCoord: -6.4,
        width: ARCH.DOOR_W,
        sillY: 0,
        height: ARCH.DOOR_H,
        type: 'door_hinged',
        swingDir: -1,
        hingeSide: 1,
        threshold: 'stone',
      },
    ],
  },
  // Bedroom <-> Living Room Wall (z = -0.80, x: -5.60 -> 0.50)
  {
    id: 'wall_bedroom_living',
    axis: 'x',
    fixedCoord: GRID_Z.MID_SPINE,
    start: GRID_X.WEST_SPINE,
    end: GRID_X.CENTER_SPINE,
    isExterior: false,
    openings: [
      {
        id: 'door_living_bedroom',
        centerCoord: -0.95,
        width: ARCH.DOOR_W,
        sillY: 0,
        height: ARCH.DOOR_H,
        type: 'door_hinged',
        swingDir: -1,
        hingeSide: 1,
        threshold: 'wood',
      },
    ],
  },

  // Kitchen <-> Front Terrace Wall (z = 0.30, x: 0.50 -> 5.80)
  {
    id: 'wall_kitchen_terrace',
    axis: 'x',
    fixedCoord: GRID_Z.EAST_MID_SPINE,
    start: GRID_X.CENTER_SPINE,
    end: GRID_X.EAST_SPINE,
    isExterior: true,
    openings: [
      {
        id: 'win_kitchen_terrace',
        centerCoord: 3.15,
        width: 2.3,
        sillY: ARCH.WINDOW_SILL_Y,
        height: ARCH.WINDOW_H,
        type: 'window',
      },
    ],
  },
  // Dining <-> Garage Wall (z = 0.30, x: 5.80 -> 11.20)
  {
    id: 'wall_dining_garage',
    axis: 'x',
    fixedCoord: GRID_Z.EAST_MID_SPINE,
    start: GRID_X.EAST_SPINE,
    end: GRID_X.EAST_EXT,
    isExterior: false,
    openings: [
      {
        id: 'door_dining_garage',
        centerCoord: 6.65,
        width: ARCH.DOOR_W,
        sillY: 0,
        height: ARCH.DOOR_H,
        type: 'door_hinged',
        swingDir: 1,
        hingeSide: -1,
        threshold: 'stone',
      },
    ],
  },

  // Office South Front Wall (z = 4.50, x: -11.20 -> -5.60)
  {
    id: 'wall_office_south',
    axis: 'x',
    fixedCoord: GRID_Z.SOUTH_LIVING,
    start: GRID_X.WEST_EXT,
    end: GRID_X.WEST_SPINE,
    isExterior: true,
    openings: [
      {
        id: 'win_office_south',
        centerCoord: -8.4,
        width: 2.1,
        sillY: ARCH.WINDOW_SILL_Y,
        height: ARCH.WINDOW_H,
        type: 'window',
        curtainSide: -1,
      },
    ],
  },
  // Living <-> Hallway Wall (z = 4.50, x: -5.60 -> 0.50)
  {
    id: 'wall_living_hallway',
    axis: 'x',
    fixedCoord: GRID_Z.SOUTH_LIVING,
    start: GRID_X.WEST_SPINE,
    end: GRID_X.CENTER_SPINE,
    isExterior: false,
    openings: [
      {
        id: 'portal_living_hallway',
        centerCoord: -1.15,
        width: 1.9,
        sillY: 0,
        height: ARCH.DOUBLE_PORTAL_H,
        type: 'portal_arch',
        threshold: 'stone',
      },
    ],
  },

  // Garage South Door Wall (z = 6.40, x: 5.80 -> 11.20)
  {
    id: 'wall_garage_south',
    axis: 'x',
    fixedCoord: GRID_Z.SOUTH_GARAGE,
    start: GRID_X.EAST_SPINE,
    end: GRID_X.EAST_EXT,
    isExterior: true,
    openings: [
      {
        id: 'door_garage_main',
        centerCoord: 8.5,
        width: ARCH.GARAGE_DOOR_W,
        sillY: 0,
        height: ARCH.GARAGE_DOOR_H,
        type: 'door_garage',
        threshold: 'stone',
      },
    ],
  },

  // Hallway South Front Entry Wall (z = 6.80, x: -5.60 -> 0.50)
  {
    id: 'wall_hallway_south',
    axis: 'x',
    fixedCoord: GRID_Z.SOUTH_HALL,
    start: GRID_X.WEST_SPINE,
    end: GRID_X.CENTER_SPINE,
    isExterior: true,
    openings: [
      {
        id: 'door_main_entrance',
        centerCoord: -2.55,
        width: 1.7,
        sillY: 0,
        height: ARCH.DOUBLE_PORTAL_H,
        type: 'door_double_entry',
        swingDir: -1,
        hingeSide: -1,
        threshold: 'stone',
      },
    ],
  },

  // =========================================================================
  // VERTICAL WALLS (axis = 'z', fixed X)
  // =========================================================================
  // Far West Wall (x = -11.20)
  {
    id: 'wall_guest_west',
    axis: 'z',
    fixedCoord: GRID_X.WEST_EXT,
    start: GRID_Z.NORTH_EXT,
    end: GRID_Z.NORTH_SPINE,
    isExterior: true,
    openings: [],
  },
  {
    id: 'wall_bath_west',
    axis: 'z',
    fixedCoord: GRID_X.WEST_EXT,
    start: GRID_Z.NORTH_SPINE,
    end: GRID_Z.MID_SPINE,
    isExterior: true,
    openings: [
      {
        id: 'win_bath_west',
        centerCoord: -2.85,
        width: 1.5,
        sillY: ARCH.BATH_WINDOW_SILL_Y,
        height: ARCH.BATH_WINDOW_H,
        type: 'window_clerestory',
      },
    ],
  },
  {
    id: 'wall_office_west',
    axis: 'z',
    fixedCoord: GRID_X.WEST_EXT,
    start: GRID_Z.MID_SPINE,
    end: GRID_Z.SOUTH_LIVING,
    isExterior: true,
    openings: [
      {
        id: 'win_office_west',
        centerCoord: 1.85,
        width: 2.0,
        sillY: ARCH.WINDOW_SILL_Y,
        height: ARCH.WINDOW_H,
        type: 'window',
      },
    ],
  },

  // West Spine (x = -5.60)
  {
    id: 'wall_guest_east',
    axis: 'z',
    fixedCoord: GRID_X.WEST_SPINE,
    start: GRID_Z.NORTH_EXT,
    end: GRID_Z.NORTH_SPINE,
    isExterior: true,
    openings: [
      {
        id: 'door_guest_patio',
        centerCoord: -7.15,
        width: ARCH.DOOR_W,
        sillY: 0,
        height: ARCH.DOOR_H,
        type: 'door_hinged',
        swingDir: -1,
        hingeSide: -1,
        threshold: 'stone',
      },
    ],
  },
  {
    id: 'wall_bath_bedroom',
    axis: 'z',
    fixedCoord: GRID_X.WEST_SPINE,
    start: GRID_Z.NORTH_SPINE,
    end: GRID_Z.MID_SPINE,
    isExterior: false,
    openings: [
      {
        id: 'door_bedroom_bath',
        centerCoord: -1.65,
        width: ARCH.DOOR_W,
        sillY: 0,
        height: ARCH.DOOR_H,
        type: 'door_hinged',
        swingDir: -1,
        hingeSide: 1,
        threshold: 'stone',
      },
    ],
  },
  {
    id: 'wall_office_living',
    axis: 'z',
    fixedCoord: GRID_X.WEST_SPINE,
    start: GRID_Z.MID_SPINE,
    end: GRID_Z.SOUTH_LIVING,
    isExterior: false,
    openings: [
      {
        id: 'win_office_living_glass',
        centerCoord: 1.85,
        width: 1.75,
        sillY: 0.65,
        height: 1.55,
        type: 'interior_glass_window',
        curtainSide: 1,
      },
      {
        id: 'door_living_office',
        centerCoord: 3.65,
        width: ARCH.DOOR_W,
        sillY: 0,
        height: ARCH.DOOR_H,
        type: 'door_hinged',
        swingDir: -1,
        hingeSide: 1,
        threshold: 'wood',
      },
    ],
  },
  {
    id: 'wall_hallway_west',
    axis: 'z',
    fixedCoord: GRID_X.WEST_SPINE,
    start: GRID_Z.SOUTH_LIVING,
    end: GRID_Z.SOUTH_HALL,
    isExterior: true,
    openings: [],
  },

  // Center Spine (x = 0.50)
  {
    id: 'wall_bedroom_kitchen',
    axis: 'z',
    fixedCoord: GRID_X.CENTER_SPINE,
    start: GRID_Z.NORTH_SPINE,
    end: GRID_Z.MID_SPINE,
    isExterior: false,
    openings: [],
  },
  {
    id: 'wall_living_kitchen_joint',
    axis: 'z',
    fixedCoord: GRID_X.CENTER_SPINE,
    start: GRID_Z.MID_SPINE,
    end: GRID_Z.EAST_MID_SPINE,
    isExterior: false,
    openings: [
      {
        id: 'portal_living_kitchen',
        centerCoord: -0.25,
        width: 0.9,
        sillY: 0,
        height: ARCH.DOOR_H,
        type: 'portal_arch',
        threshold: 'stone',
      },
    ],
  },
  {
    id: 'wall_living_terrace',
    axis: 'z',
    fixedCoord: GRID_X.CENTER_SPINE,
    start: GRID_Z.EAST_MID_SPINE,
    end: GRID_Z.SOUTH_LIVING,
    isExterior: true,
    openings: [
      {
        id: 'door_living_terrace',
        centerCoord: 2.4,
        width: 1.65,
        sillY: 0,
        height: ARCH.DOUBLE_PORTAL_H,
        type: 'door_double_entry',
        swingDir: -1,
        hingeSide: -1,
        threshold: 'stone',
      },
    ],
  },
  {
    id: 'wall_hallway_east',
    axis: 'z',
    fixedCoord: GRID_X.CENTER_SPINE,
    start: GRID_Z.SOUTH_LIVING,
    end: GRID_Z.SOUTH_HALL,
    isExterior: true,
    openings: [
      {
        id: 'win_hallway_east',
        centerCoord: 5.65,
        width: 1.1,
        sillY: ARCH.WINDOW_SILL_Y,
        height: ARCH.WINDOW_H,
        type: 'window',
      },
    ],
  },

  // East Spine (x = 5.80)
  {
    id: 'wall_gourmet_laundry',
    axis: 'z',
    fixedCoord: GRID_X.EAST_SPINE,
    start: GRID_Z.NORTH_EXT,
    end: GRID_Z.NORTH_SPINE,
    isExterior: true,
    openings: [
      {
        id: 'door_gourmet_laundry',
        centerCoord: -7.1,
        width: ARCH.DOOR_W,
        sillY: 0,
        height: ARCH.DOOR_H,
        type: 'door_hinged',
        swingDir: 1,
        hingeSide: -1,
        threshold: 'stone',
      },
    ],
  },
  {
    id: 'wall_kitchen_dining',
    axis: 'z',
    fixedCoord: GRID_X.EAST_SPINE,
    start: GRID_Z.NORTH_SPINE,
    end: GRID_Z.EAST_MID_SPINE,
    materialVariant: 'accent',
    isExterior: false,
    openings: [
      {
        id: 'portal_kitchen_dining',
        centerCoord: -2.3,
        width: 2.3,
        sillY: 0,
        height: ARCH.DOUBLE_PORTAL_H,
        type: 'portal_arch',
        threshold: 'stone',
      },
    ],
  },
  {
    id: 'wall_terrace_garage',
    axis: 'z',
    fixedCoord: GRID_X.EAST_SPINE,
    start: GRID_Z.EAST_MID_SPINE,
    end: GRID_Z.SOUTH_GARAGE,
    isExterior: true,
    openings: [
      {
        id: 'door_terrace_garage',
        centerCoord: 1.65,
        width: ARCH.DOOR_W,
        sillY: 0,
        height: ARCH.DOOR_H,
        type: 'door_hinged',
        swingDir: 1,
        hingeSide: -1,
        threshold: 'stone',
      },
    ],
  },

  // Far East Wall (x = 11.20)
  {
    id: 'wall_laundry_east',
    axis: 'z',
    fixedCoord: GRID_X.EAST_EXT,
    start: GRID_Z.NORTH_EXT,
    end: GRID_Z.NORTH_SPINE,
    isExterior: true,
    openings: [],
  },
  {
    id: 'wall_dining_east',
    axis: 'z',
    fixedCoord: GRID_X.EAST_EXT,
    start: GRID_Z.NORTH_SPINE,
    end: GRID_Z.EAST_MID_SPINE,
    materialVariant: 'accent',
    isExterior: true,
    openings: [
      {
        id: 'win_dining_east',
        centerCoord: -2.3,
        width: 2.1,
        sillY: ARCH.WINDOW_SILL_Y,
        height: ARCH.WINDOW_H,
        type: 'window',
      },
    ],
  },
  {
    id: 'wall_garage_east',
    axis: 'z',
    fixedCoord: GRID_X.EAST_EXT,
    start: GRID_Z.EAST_MID_SPINE,
    end: GRID_Z.SOUTH_GARAGE,
    isExterior: true,
    openings: [],
  },
];

/**
 * Helper: compute world-space doorway clearance boxes (so automated validator checks
 * that no furniture blocks any door or passage).
 */
export interface DoorwayClearanceBox {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export function getDoorwayClearanceBoxes(): DoorwayClearanceBox[] {
  const boxes: DoorwayClearanceBox[] = [];
  for (const wall of WALL_SEGMENTS) {
    for (const op of wall.openings) {
      if (
        op.type === 'door_hinged' ||
        op.type === 'door_double_entry' ||
        op.type === 'door_sliding_glass' ||
        op.type === 'portal_arch'
      ) {
        const halfW = op.width / 2 - 0.08;
        const depth = 0.65;
        if (wall.axis === 'x') {
          boxes.push({
            id: op.id,
            minX: op.centerCoord - halfW,
            maxX: op.centerCoord + halfW,
            minZ: wall.fixedCoord - depth,
            maxZ: wall.fixedCoord + depth,
          });
        } else {
          boxes.push({
            id: op.id,
            minX: wall.fixedCoord - depth,
            maxX: wall.fixedCoord + depth,
            minZ: op.centerCoord - halfW,
            maxZ: op.centerCoord + halfW,
          });
        }
      }
    }
  }
  return boxes;
}
