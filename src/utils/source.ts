import {
    distance,
    getWalkableSurroundings,
    checkHostilesInRange,
} from './room';

export function findClosestFreeSource(creep: Creep) {
    const { pos, room } = creep;
    const sources = room
        .find(FIND_SOURCES_ACTIVE)
        .sort((a, b) => distance(pos, a.pos) - distance(pos, b.pos));
    for (const source of sources) {
        const source_pos = source.pos;
        const walkableSurroundings = getWalkableSurroundings(
            room,
            source_pos.x,
            source_pos.y,
            true
        );
        if (
            (walkableSurroundings.length > 0 &&
                checkHostilesInRange(source.pos) == 0 &&
                creep.room.memory['sources'][source.id]['freePositions'] > 0) ||
            distance(creep.pos, source.pos) <= 2
        ) {
            return source;
        }
    }
    return pos.findClosestByPath(FIND_SOURCES_ACTIVE);
}
