function handleTowers() {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];

        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER },
        }) as StructureTower[];

        for (const tower of towers) {
            if (hostiles.length > 0) {
                tower.attack(tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS));
            } else {
                if (tower.energy > tower.energyCapacity / 2) {
                    const closestDamagedStructure = tower.pos.findClosestByRange(
                        FIND_STRUCTURES,
                        {
                            filter: s =>
                                s.hits < s.hitsMax &&
                                s.structureType != STRUCTURE_WALL &&
                                s.structureType != STRUCTURE_RAMPART,
                        }
                    );

                    if (closestDamagedStructure) {
                        tower.repair(closestDamagedStructure);
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
