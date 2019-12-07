function handleTowers() {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];

        const hostiles = room.memory['hostiles'];
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER },
        }) as StructureTower[];

        for (const tower of towers) {
            if (hostiles.length > 0) {
                for (const hostileId of room.memory['hostiles']) {
                    const hostile = Game.getObjectById(hostileId) as Creep;
                    tower.attack(hostile);
                    for (const bodyPart of hostile.body) {
                        if (bodyPart.type == HEAL) {
                            tower.attack(hostile);
                        }
                    }
                }
            } else {
                if (tower.energy > tower.energyCapacity / 2) {
                    if (tower.room.memory['woundedCreeps'].length > 0) {
                        const creep = Game.getObjectById(
                            tower.room.memory['woundedCreeps'][0]
                        ) as Creep;
                        tower.heal(creep);
                    } else if (
                        tower.room.memory['damagedStructures'].length > 0
                    ) {
                        const damagedStructure = Game.getObjectById(
                            tower.room.memory['damagedStructures'][0]
                        ) as Structure;
                        tower.repair(damagedStructure);
                    } else {
                        const firstWallOrRampart = Game.getObjectById(
                            tower.room.memory['wallsAndRamparts'][0]
                        ) as StructureWall;

                        if (firstWallOrRampart) {
                            tower.repair(firstWallOrRampart);
                        }
                    }
                }
            }
        }
    }
}

export default handleTowers;
