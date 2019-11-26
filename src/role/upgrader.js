const spawnName = 'Spawn_1';

const roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if (
                creep.upgradeController(creep.room.controller) ==
                ERR_NOT_IN_RANGE
            ) {
                creep.moveTo(creep.room.controller, {
                    visualizePathStyle: { stroke: '#ffffff' },
                });
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {
                    visualizePathStyle: { stroke: '#ffaa00' },
                });
            }
        }
    },

    generate: function() {
        const upgraders = _.filter(
            Game.creeps,
            creep => creep.memory.role == 'upgrader'
        );

        if (upgraders.length < 2) {
            const newName = 'Upgrader' + Game.time;
            Game.spawns[spawnName].spawnCreep([WORK, CARRY, MOVE], newName, {
                memory: { role: 'upgrader' },
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

export default roleUpgrader;
