import { Activity, Role, COMMON_CREEP } from '../../constants/creep';
import { collectOrHarvest } from './common';
import {
    createCreep,
    changeCreepActivity,
    upgradeCollectorCreep,
} from '../../utils/creep';
import roleHarvester from './harvester';
import roleCollector from './collector';

function setWallOrRampartToRepair(creep: Creep) {
    const firstWallOrRampart = Game.getObjectById(
        creep.room.memory['wallsAndRamparts'][0]
    ) as StructureWall;
    if (firstWallOrRampart) {
        creep.memory['wallOrRampartToRepair'] = {
            wallOrRampart: firstWallOrRampart.id,
            wallOrRampartHealth: firstWallOrRampart.hits,
        };
    }
    return firstWallOrRampart;
}

const roleWallRepairer = {
    run: function(creep: Creep) {
        if (
            creep.memory['activity'] === Activity.REPAIR &&
            creep.store[RESOURCE_ENERGY] == 0
        ) {
            creep.memory['activity'] = Activity.NONE;
        }
        if (
            creep.memory['activity'] !== Activity.REPAIR &&
            creep.store.getFreeCapacity() == 0 &&
            creep.room.memory['wallsAndRamparts'].length > 0
        ) {
            changeCreepActivity(creep, Activity.REPAIR);
        }

        if (creep.memory['activity'] === Activity.REPAIR) {
            if (!creep.memory['wallOrRampartToRepair']) {
                setWallOrRampartToRepair(creep);
            }
            let wallOrRampartToRepair = Game.getObjectById(
                creep.memory['wallOrRampartToRepair'].wallOrRampart
            ) as StructureWall;

            if (
                !wallOrRampartToRepair ||
                wallOrRampartToRepair.hits -
                    creep.memory['wallOrRampartToRepair'].wallOrRampartHealth >=
                    1000
            ) {
                wallOrRampartToRepair = setWallOrRampartToRepair(creep);
            }

            if (wallOrRampartToRepair) {
                if (creep.repair(wallOrRampartToRepair) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(wallOrRampartToRepair, {
                        visualizePathStyle: { stroke: '#ffffff' },
                        maxOps: 5000,
                        reusePath: 15,
                    });
                }
                return Activity.REPAIR;
            } else {
                return collectOrHarvest(creep);
            }
        } else if (creep.room.memory['wallsAndRamparts'].length > 0) {
            if (creep.room.memory['storages'].length) {
                const storage = creep.room.memory['storages'][0];
                creep.memory['collectTarget'] = storage;
            }
            return collectOrHarvest(creep);
        } else {
            return roleCollector.run(creep);
        }
    },
    generate: function(spawn: StructureSpawn) {
        const repairers = spawn.room.memory['creeps'][Role.WALL_REPAIRER];

        const harvesters = spawn.room.memory['creeps'][Role.HARVESTER];

        const towers = spawn.room.memory['towers'];

        const repairersNeeded = Math.ceil(
            spawn.room.memory['wallsAndRamparts'].length / 20
        );

        if (
            !towers.length &&
            repairers.length < repairersNeeded &&
            harvesters.length > 2
        ) {
            createCreep(spawn, Role.WALL_REPAIRER, [
                ...COMMON_CREEP,
                ...upgradeCollectorCreep(spawn),
            ]);
        }
    },
};

export default roleWallRepairer;
