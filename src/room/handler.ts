import { Role } from '../constants/creep';

function handleRooms() {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];

        // # MEMORY

        // Resources
        // ---------------------------------------------
        const containers = room.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType == STRUCTURE_CONTAINER,
        });

        room.memory['containers'] = containers.map(c => c.id);

        room.memory['filledContainers'] = containers
            // @ts-ignore
            .filter(c => c.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            .sort(
                (a: any, b: any) =>
                    a.store.getUsedCapacity(RESOURCE_ENERGY) -
                    b.store.getUsedCapacity(RESOURCE_ENERGY)
            )
            .map(c => c.id);

        const tombstones = room
            .find(FIND_TOMBSTONES)
            .filter(t => t.store[RESOURCE_ENERGY] > 0);
        room.memory['tombstones'] = tombstones.map(t => t.id);

        const ruinsWithEnergy = room
            // @ts-ignore
            .find(FIND_RUINS)
            .filter((r: any) => r.store && r.store[RESOURCE_ENERGY] > 0);
        room.memory['ruinsWithEnergy'] = ruinsWithEnergy.map((r: any) => r.id);

        // STRUCTURES
        // --------------------------------------------

        room.memory['towers'] = room
            .find(FIND_STRUCTURES)
            .filter(s => s.structureType == STRUCTURE_TOWER)
            .map(s => s.id);

        room.memory['damagedStructures'] = room
            .find(FIND_STRUCTURES)
            .filter(
                s =>
                    s.hits < s.hitsMax &&
                    s.structureType != STRUCTURE_RAMPART &&
                    s.structureType != STRUCTURE_WALL
            )
            .map(s => s.id);

        room.memory['wallsAndRamparts'] = room
            .find(FIND_STRUCTURES)
            .filter(
                s =>
                    s.hits < s.hitsMax &&
                    (s.structureType == STRUCTURE_RAMPART ||
                        s.structureType == STRUCTURE_WALL)
            )
            .sort((a, b) => {
                if (a.structureType == STRUCTURE_RAMPART) {
                    return a.hits - 3000 - b.hits;
                }
                return a.hits - b.hits;
            })
            .map(s => s.id);

        room.memory['extensions'] = room
            .find(FIND_MY_STRUCTURES)
            .filter(s => s.structureType === STRUCTURE_EXTENSION)
            .map(e => e.id);

        // CREEPS
        // ---------------------------------------------

        room.memory['creeps'] = {};

        for (const role in Role) {
            room.memory['creeps'][Role[role]] = [];
        }

        room.find(FIND_MY_CREEPS).forEach(creep => {
            const role = creep.memory['role'];
            if (role) room.memory['creeps'][role].push(creep.id);
        });

        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        room.memory['hostiles'] = hostiles.map(h => h.id);
    }
}

export default handleRooms;
