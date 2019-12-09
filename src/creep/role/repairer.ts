import { Activity, Role, COMMON_CREEP } from '../../constants/creep';
import { collectOrHarvest } from './common';
import {
    createCreep,
    changeCreepActivity,
    upgradeCommonCreep,
} from '../../utils/creep';
import roleHarvester from './harvester';
import roleBuilder from './builder';
import roleWallRepairer from './wallRepairer';

const roleRepairer = {
    run: function(creep: Creep) {
        if (
            creep.memory['activity'] === Activity.REPAIR &&
            creep.store[RESOURCE_ENERGY] == 0
        ) {
            creep.memory['activity'] = Activity.NONE;
        }
        if (
            creep.memory['activity'] !== Activity.REPAIR &&
            creep.store[RESOURCE_ENERGY] > 0 &&
            creep.room.memory['damagedStructures'].length > 0
        ) {
            changeCreepActivity(creep, Activity.REPAIR);
        }

        if (creep.memory['activity'] === Activity.REPAIR) {
            const closestDamagedStructure = creep.pos.findClosestByRange(
                FIND_STRUCTURES,
                {
                    filter: s =>
                        s.hits < s.hitsMax &&
                        s.structureType != STRUCTURE_WALL &&
                        s.structureType != STRUCTURE_RAMPART,
                }
            );
            if (closestDamagedStructure) {
                if (creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestDamagedStructure, {
                        visualizePathStyle: { stroke: '#ffffff' },
                        maxOps: 5000, reusePath: 15
                        
                    });
                }
                return Activity.REPAIR;
            } else if (creep.room.memory['constructionSites'].length > 0) {
                return roleBuilder.run(creep);
            } else if (creep.room.memory['wallsAndRamparts'].length > 0) {
                roleWallRepairer.run(creep);
            } else {
                return roleHarvester.run(creep);
            }
        } else if (
            creep.room.memory['damagedStructures'].length == 0 &&
            creep.room.memory['constructionSites'].length > 0
        ) {
            return roleBuilder.run(creep);
        } else if (creep.room.memory['damagedStructures'].length > 0) {
            return collectOrHarvest(creep);
        } else {
            return roleHarvester.run(creep);
        }
    },
    generate: function(spawn: StructureSpawn) {
        const repairers = spawn.room.memory['creeps'][Role.REPAIRER];

        const harvesters = spawn.room.memory['creeps'][Role.HARVESTER];

        const towers = spawn.room.memory['towers'];

        const repairersNeeded = Math.ceil(
            spawn.room.memory['damagedStructures'].length / 10
        );

        if (
            towers.length == 0 &&
            repairers.length < repairersNeeded &&
            harvesters.length > 2
        ) {
            createCreep(spawn, Role.REPAIRER, [
                ...COMMON_CREEP,
                ...upgradeCommonCreep(spawn),
            ]);
        }
    },
};

export default roleRepairer;
