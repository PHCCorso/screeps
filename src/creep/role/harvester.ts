import { Role, COMMON_CREEP, Activity } from '../../constants/creep';
import {
    createCreep,
    changeCreepActivity,
    upgradeCommonCreep,
    upgradeHarvesterCreep,
} from '../../utils/creep';
import { findClosestFreeSource } from '../../utils/source';
import { distance } from '../../utils/room';

const roleHarvester = {
    run: function(creep: Creep) {
        if (
            creep.memory['activity'] !== Activity.HARVEST &&
            creep.store[RESOURCE_ENERGY] == 0
        ) {
            changeCreepActivity(creep, Activity.HARVEST);
        }
        if (
            creep.memory['activity'] === Activity.HARVEST &&
            creep.store.getFreeCapacity() == 0
        ) {
            changeCreepActivity(creep, Activity.STORE);
        }

        if (creep.memory['activity'] === Activity.HARVEST) {
            if (!creep.memory['gotoSource']) {
                const closestFreeSource = findClosestFreeSource(creep);
                if (closestFreeSource)
                    creep.memory['gotoSource'] = closestFreeSource.id;
                return Activity.NONE;
            } else {
                const sourceId = creep.memory['gotoSource'];
                const source = Game.getObjectById(sourceId) as Source;

                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    if (
                        creep.room.memory['sources'][sourceId][
                            'freePositions'
                        ] > 0
                    ) {
                        creep.room.memory['sources'][sourceId][
                            'freePositions'
                        ] -= 1;
                        creep.moveTo(source, {
                            visualizePathStyle: { stroke: '#ffaa00' },
                            maxOps: 5000, reusePath: 15
                            
                        });
                    } else {
                        creep.memory['gotoSource'] = undefined;
                        return Activity.NONE;
                    }
                }
                return Activity.HARVEST;
            }
        } else {
            creep.memory['gotoSource'] = undefined;
            var targets = creep.room
                .find(FIND_STRUCTURES, {
                    filter: structure => {
                        if (
                            creep.room.find(FIND_MY_CREEPS).length ==
                                creep.room.memory['creeps'][Role.HARVESTER]
                                    .length ||
                            (creep.room.memory['creeps'][Role.COLLECTOR]
                                .length == 0 &&
                                creep.room.memory['filledContainers'].length >
                                    0)
                        ) {
                            return (
                                (structure.structureType ==
                                    STRUCTURE_EXTENSION ||
                                    structure.structureType ==
                                        STRUCTURE_SPAWN) &&
                                structure.store.getFreeCapacity(
                                    RESOURCE_ENERGY
                                ) > 0
                            );
                        }
                        return (
                            (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType ==
                                    STRUCTURE_CONTAINER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                        );
                    },
                })
                .sort(
                    (a, b) =>
                        distance(a.pos, creep.pos) - distance(b.pos, creep.pos)
                );
            if (targets.length > 0) {
                if (
                    creep.transfer(targets[0], RESOURCE_ENERGY) ==
                    ERR_NOT_IN_RANGE
                ) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: { stroke: '#ffffff' },
                        maxOps: 5000, reusePath: 15
                        
                    });
                }
                return Activity.STORE;
            }
            return Activity.NONE;
        }
    },

    generate: function(spawn: StructureSpawn) {
        const harvesters = spawn.room.memory['creeps'][Role.HARVESTER];
        let cost = 0;
        if (harvesters.length < spawn.room.memory['maxFreeSourcePositions']) {
            cost = createCreep(spawn, Role.HARVESTER, [
                ...COMMON_CREEP,
                ...upgradeHarvesterCreep(spawn),
            ]);
        }

        if (spawn.room.energyAvailable < cost && harvesters.length == 0) {
            createCreep(spawn, Role.HARVESTER, [...COMMON_CREEP]);
        }
    },
};

export default roleHarvester;
