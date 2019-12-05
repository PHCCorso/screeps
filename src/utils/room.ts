import { ROOM_HEIGHT, ROOM_WIDTH } from '../constants/room';

export function distance(pos1: RoomPosition, pos2: RoomPosition) {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

// @ts-ignore
const isObstacle = _.transform(
    OBSTACLE_OBJECT_TYPES,
    (o, type) => {
        o[type] = true;
    },
    {}
);

export function isEnterable(pos: RoomPosition, considerCreeps: boolean) {
    // @ts-ignore
    return _.every(pos.look(), item => {
        if (item.type === 'terrain') {
            return item.terrain !== 'wall';
        }
        if (item.type == 'structure') {
            return !isObstacle[item.structure.structureType];
        }
        if (item.type === 'creep' && considerCreeps) {
            return false;
        }
        return true;
    });
}

export function getWalkableSurroundings(
    room: Room,
    x: number,
    y: number,
    considerCreeps: boolean
) {
    const res: RoomPosition[] = [];
    const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
    ];
    for (const direction of directions) {
        const cx = x + direction[0];
        const cy = y + direction[1];
        if (cy >= 0 && cy < ROOM_HEIGHT && cx >= 0 && cx < ROOM_WIDTH) {
            const pos = room.getPositionAt(cx, cy);
            if (isEnterable(pos, considerCreeps)) res.push(pos);
        }
    }
    return res;
}

export function checkHostilesInRange(pos: RoomPosition) {
    return pos.findInRange(FIND_HOSTILE_CREEPS, 5).length;
}
