import { Role, COLLECTOR_CREEP, Activity } from '../../constants/creep';
import {
    createCreep,
    changeCreepActivity,
    upgradeCommonCreep,
    upgradeCollectorCreep,
} from '../../utils/creep';
import { distance } from '../../utils/room';

const roleCollector = {
    run: function(creep: Creep) {
        if (
            creep.memory['activity'] !== Activity.COLLECT &&
            creep.store[RESOURCE_ENERGY] === 0
        ) {
            changeCreepActivity(creep, Activity.COLLECT);
        }

        if (
            creep.memory['activity'] === Activity.COLLECT &&
            creep.store.getFreeCapacity() === 0
        ) {
            changeCreepActivity(creep, Activity.STORE);
        }

        if (creep.memory['activity'] === Activity.COLLECT) {
            const tombstones = creep.room.memory['tombstones'];
            if (tombstones.length > 0) {
                const tombstone = Game.getObjectById(
                    tombstones[0]
                ) as Tombstone;
                if (
                    creep.withdraw(tombstone, RESOURCE_ENERGY) ==
                    ERR_NOT_IN_RANGE
                ) {
                    creep.moveTo(tombstone, {
                        visualizePathStyle: { stroke: '#ffaa00' },
                        maxOps: 5000,
                        swampCost: 2,
                    });
                }
                return Activity.WITHDRAW;
            }
            const ruinsWithEnergy = creep.room.memory['ruinsWithEnergy'];
            if (ruinsWithEnergy.length > 0) {
                const ruin = Game.getObjectById(
                    ruinsWithEnergy[0]
                ) as Structure;
                if (creep.withdraw(ruin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(ruin, {
                        visualizePathStyle: { stroke: '#ffaa00' },
                        maxOps: 5000,
                        swampCost: 2,
                    });
                }
                return Activity.WITHDRAW;
            }

            const filledContainers = creep.room.memory['filledContainers'];
            if (filledContainers.length > 0) {
                const container = Game.getObjectById(
                    filledContainers[0]
                ) as any;
                if (
                    container.store.getUsedCapacity() - creep.carryCapacity <=
                    0
                ) {
                    creep.room.memory['filledContainers'].shift();
                }
                if (
                    creep.withdraw(container, RESOURCE_ENERGY) ==
                    ERR_NOT_IN_RANGE
                ) {
                    creep.moveTo(container, {
                        visualizePathStyle: { stroke: '#ffaa00' },
                        maxOps: 5000,
                        swampCost: 2,
                    });
                }
                return Activity.COLLECT;
            }
            return Activity.NONE;
        }

        if (creep.memory['activity'] === Activity.STORE) {
            var targets = creep.room
                .find(FIND_STRUCTURES, {
                    filter: structure =>
                        (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) &&
                        // @ts-ignore
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
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
                        maxOps: 5000,
                        swampCost: 2,
                    });
                }
                return Activity.STORE;
            }
            return Activity.NONE;
        }

        return Activity.NONE;
    },

    generate: function(spawn: StructureSpawn) {
        const collectors = spawn.room.memory['creeps'][Role.COLLECTOR];

        if (
            collectors.length <
            spawn.room.memory['filledContainers'].length +
                spawn.room.memory['towers'].length
        ) {
            createCreep(spawn, Role.COLLECTOR, [
                ...COLLECTOR_CREEP,
                ...upgradeCollectorCreep(spawn),
            ]);
        }
    },
};

export default roleCollector;
