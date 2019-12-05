import roleHarvester from './harvester';
import { Message } from '../../constants/messages';
import {
    createCreep,
    changeCreepActivity,
    upgradeCommonCreep,
} from '../../utils/creep';
import { Role, COMMON_CREEP, Activity } from '../../constants/creep';
import { collectOrHarvest } from './common';

const roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep: Creep) {
        if (
            creep.memory['activity'] === Activity.UPGRADE &&
            creep.store[RESOURCE_ENERGY] == 0
        ) {
            creep.memory['activity'] = Activity.NONE;
        }
        if (
            creep.memory['activity'] !== Activity.UPGRADE &&
            creep.store.getFreeCapacity() == 0
        ) {
            changeCreepActivity(creep, Activity.UPGRADE);
        }

        if (creep.memory['activity'] === Activity.UPGRADE) {
            if (
                creep.upgradeController(creep.room.controller) ==
                ERR_NOT_IN_RANGE
            ) {
                creep.moveTo(creep.room.controller, {
                    visualizePathStyle: { stroke: '#ffffff' },
                    maxOps: 5000,
                    swampCost: 2,
                });
            }
            return Activity.UPGRADE;
        } else {
            return collectOrHarvest(creep);
        }
    },

    generate: function(spawn: StructureSpawn) {
        const upgraders = spawn.room.memory['creeps'][Role.UPGRADER];

        const harvesters = spawn.room.memory['creeps'][Role.HARVESTER];

        if (upgraders.length < 5 && harvesters.length > 2) {
            createCreep(spawn, Role.UPGRADER, [
                ...COMMON_CREEP,
                ...upgradeCommonCreep(spawn),
            ]);
        }
    },
};

export default roleUpgrader;
