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
            let target = creep.memory['collectTarget']
                ? (Game.getObjectById(creep.memory['collectTarget']) as any)
                : null;

            let targetHasEnergy =
                target && target.store.getUsedCapacity(RESOURCE_ENERGY) > 0;

            if (tombstones.length > 0 && !targetHasEnergy) {
                const tombstone = Game.getObjectById(
                    tombstones[0]
                ) as Tombstone;
                target = tombstone;
                targetHasEnergy = true;
            }

            if (
                creep.room.memory['ruinsWithEnergy'].length > 0 &&
                !targetHasEnergy
            ) {
                const ruinsWithEnergy = creep.room.memory['ruinsWithEnergy'];
                const ruin = Game.getObjectById(
                    ruinsWithEnergy[0]
                ) as Structure;
                target = ruin;
                targetHasEnergy = true;
            }

            if (
                creep.room.memory['filledContainers'].length > 0 &&
                !targetHasEnergy
            ) {
                const filledContainers = creep.room.memory['filledContainers']
                    .map(c => Game.getObjectById(c))
                    .sort(
                        (a, b) =>
                            distance(creep.pos, a.pos) -
                            distance(creep.pos, b.pos)
                    );
                const container = filledContainers[0] as any;
                if (
                    container.store.getUsedCapacity() - creep.carryCapacity <=
                    0
                ) {
                    creep.room.memory['filledContainers'].shift();
                }
                target = container;
                targetHasEnergy = true;
            }

            if (creep.room.memory['storages'].length > 0 && !targetHasEnergy) {
                const storages = creep.room.memory['storages'];
                const storage = Game.getObjectById(storages[0]) as any;
                target = storage;
                targetHasEnergy = true;
            }

            if (
                target &&
                creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
            ) {
                creep.memory['storeTarget'] = undefined;
                creep.memory['collectTarget'] = target.id;
                creep.moveTo(target, {
                    visualizePathStyle: { stroke: '#ffaa00' },
                    maxOps: 5000,
                    swampCost: 4,
                });
                return Activity.COLLECT;
            }

            return Activity.NONE;
        }

        if (creep.memory['activity'] === Activity.STORE) {
            const hostiles = creep.room.memory['hostiles'];
            let target = creep.memory['storeTarget']
                ? (Game.getObjectById(creep.memory['storeTarget']) as any)
                : Game.getObjectById(creep.memory['sourceSpawn']);

            let targetHasFreeCapacity =
                target.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            if (
                !targetHasFreeCapacity &&
                creep.room.memory['extensions'].length
            ) {
                target = Game.getObjectById(creep.room.memory['extensions'][0]);
                targetHasFreeCapacity =
                    target.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }

            if (
                creep.room.memory['towers'].length &&
                (!targetHasFreeCapacity || hostiles.length)
            ) {
                target = Game.getObjectById(creep.room.memory['towers'][0]);
                targetHasFreeCapacity =
                    target.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }

            if (
                !targetHasFreeCapacity &&
                creep.room.memory['storages'].length &&
                !hostiles.length
            ) {
                target = Game.getObjectById(creep.room.memory['storages'][0]);
                targetHasFreeCapacity =
                    target.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }

            if (
                target.id != creep.memory['collectTarget'] &&
                targetHasFreeCapacity
            ) {
                creep.memory['storeTarget'] = target.id;
                if (
                    creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
                ) {
                    creep.moveTo(target, {
                        visualizePathStyle: { stroke: '#ffffff' },
                        maxOps: 5000,
                        swampCost: 4,
                    });
                }
                creep.memory['collectTarget'] = undefined;
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
