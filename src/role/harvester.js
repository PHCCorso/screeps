const spawnName = 'Spawn_1';

const roleHarvester = {
    run: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {
                    visualizePathStyle: { stroke: '#ffaa00' },
                });
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return (
                        (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    );
                },
            });
            if (targets.length > 0) {
                if (
                    creep.transfer(targets[0], RESOURCE_ENERGY) ==
                    ERR_NOT_IN_RANGE
                ) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: { stroke: '#ffffff' },
                    });
                }
            }
        }
    },

    generate: function() {
        const harvesters = _.filter(
            Game.creeps,
            creep => creep.memory.role == 'harvester'
        );

        if (harvesters.length < 2) {
            const newName = 'Harvester' + Game.time;
            Game.spawns[spawnName].spawnCreep([WORK, CARRY, MOVE], newName, {
                memory: { role: 'harvester' },
            });
        }

        if (Game.spawns[spawnName].spawning) {
            const spawningCreep =
                Game.creeps[Game.spawns[spawnName].spawning.name];
            Game.spawns[spawnName].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[spawnName].pos.x + 1,
                Game.spawns[spawnName].pos.y,
                { align: 'left', opacity: 0.8 }
            );
        }
    },
};

export default roleHarvester;
