import { Message } from '../../constants/messages';
import {
    createCreep,
    changeCreepActivity,
    upgradeCommonCreep,
    upgradeCollectorCreep,
} from '../../utils/creep';
import { Role, COMMON_CREEP, Activity } from '../../constants/creep';
import roleRepairer from './repairer';
import { collectOrHarvest } from './common';
import roleWallRepairer from './wallRepairer';

const roleBuilder = {
    run: function(creep: Creep) {
        if (
            creep.memory['activity'] === Activity.BUILD &&
            creep.store[RESOURCE_ENERGY] == 0
        ) {
            creep.memory['activity'] = Activity.NONE;
        }
        if (
            creep.memory['activity'] !== Activity.BUILD &&
            (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 ||
                creep.store[RESOURCE_ENERGY] > 0)
        ) {
            changeCreepActivity(creep, Activity.BUILD);
        }

        if (creep.memory['activity'] === Activity.BUILD) {
            const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: { stroke: '#ffffff' },
                        maxOps: 5000,
                        reusePath: 15,
                    });
                }
                return Activity.BUILD;
            } else {
                return roleRepairer.run(creep);
            }
        } else if (creep.room.memory['wallsAndRamparts'].length > 0) {
            roleWallRepairer.run(creep);
        } else {
            if (creep.room.memory['storages'].length) {
                const storage = creep.room.memory['storages'][0];
                creep.memory['collectTarget'] = storage;
            }
            return collectOrHarvest(creep);
        }
    },

    generate: function(spawn: StructureSpawn) {
        const builders = spawn.room.memory['creeps'][Role.BUILDER];

        const harvesters = spawn.room.memory['creeps'][Role.HARVESTER];

        const buildersNeeded = Math.ceil(
            spawn.room.memory['constructionSites'].length / 2
        );

        const extensionNumber = spawn.room.memory['extensions'].length;

        if (
            builders.length < buildersNeeded &&
            harvesters.length > 2 &&
            builders.length < 7 //- Math.ceil(extensionNumber / 2)
        ) {
            createCreep(spawn, Role.BUILDER, [
                ...COMMON_CREEP,
                ...upgradeCollectorCreep(spawn),
            ]);
        }
    },
};

export default roleBuilder;
