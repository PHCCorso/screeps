import { distance, getWalkableSurroundings } from '../utils/room';

function handleSources() {
    for (const roomName in Game.rooms) {
        updateSourceMemory(Game.rooms[roomName]);
    }
}

function updateSourceMemory(room: Room) {
    const sources = room.find(FIND_SOURCES);
    if (!room.memory['sources']) {
        room.memory['sources'] = {};
    }
    room.memory['freeSourcePositions'] = 0;
    let sum = 0;
    for (const source of sources) {
        if (!room.memory['sources'][source.id]) {
            room.memory['sources'][source.id] = {
                freePositions: 0,
            };
        }
        const sourceMemory = room.memory['sources'][source.id];
        const sourcePos = source.pos;
        const walkableSurroundings = getWalkableSurroundings(
            room,
            sourcePos.x,
            sourcePos.y,
            true
        );
        room.memory['freeSourcePositions'] += sourceMemory['freePositions'];
        sourceMemory['freePositions'] = walkableSurroundings.length;
        sum += walkableSurroundings.length;
    }
    if (!room.memory['maxFreeSourcePositions']) {
        room.memory['maxFreeSourcePositions'] = 0;
    }
    if (room.memory['maxFreeSourcePositions'] < sum) {
        room.memory['maxFreeSourcePositions'] = sum;
    }
}

export default handleSources;
