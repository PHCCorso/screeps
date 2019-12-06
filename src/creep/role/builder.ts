import { Message } from '../../constants/messages';
import {
    createCreep,
    changeCreepActivity,
    upgradeCommonCreep,
} from '../../utils/creep';
import { Role, COMMON_CREEP, Activity } from '../../constants/creep';
import roleRepairer from './repairer';
import { collectOrHarvest } from './common';

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
            creep.store.getFreeCapacity() == 0
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
                        swampCost: 2,
                    });
                }
                return Activity.BUILD;
            } else {
                return roleRepairer.run(creep);
            }
        } else {
            return collectOrHarvest(creep);
        }
    },

    generate: function(spawn: StructureSpawn) {
        const builders = spawn.room.memory['creeps'][Role.BUILDER];

        const harvesters = spawn.room.memory['creeps'][Role.HARVESTER];

        const buildersNeeded = Math.ceil(
            spawn.room.memory['constructionSites'].length / 2
        );

        if (builders.length < buildersNeeded && harvesters.length > 2) {
            createCreep(spawn, Role.BUILDER, [
                ...COMMON_CREEP,
                ...upgradeCommonCreep(spawn),
            ]);
        }
    },
};

export default roleBuilder;
