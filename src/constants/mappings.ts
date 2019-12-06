import { Role, Activity } from './creep';
import roleHarvester from '../creep/role/harvester';
import roleBuilder from '../creep/role/builder';
import roleUpgrader from '../creep/role/upgrader';
import roleAttacker from '../creep/role/attacker';
import roleRepairer from '../creep/role/repairer';
import roleCollector from '../creep/role/collector';
import { Message } from './messages';
import roleWallRepairer from '../creep/role/wallRepairer';

export const RoleFunctionMap: {
    [key in Role]: {
        run: (creep: Creep) => Activity;
        generate?: (spawn: StructureSpawn) => void;
    };
} = {
    [Role.HARVESTER]: roleHarvester,
    [Role.BUILDER]: roleBuilder,
    [Role.UPGRADER]: roleUpgrader,
    [Role.ATTACKER]: roleAttacker,
    [Role.REPAIRER]: roleRepairer,
    [Role.WALL_REPAIRER]: roleWallRepairer,
    [Role.COLLECTOR]: roleCollector,
};

export const ActivityMessageMap = {
    [Activity.ATTACK]: Message.ATTACK,
    [Activity.BUILD]: Message.BUILD,
    [Activity.COLLECT]: Message.COLLECT,
    [Activity.HARVEST]: Message.HARVEST,
    [Activity.REPAIR]: Message.REPAIR,
    [Activity.RETREAT]: Message.RETREAT,
    [Activity.STORE]: Message.STORE,
    [Activity.UPGRADE]: Message.UPGRADE,
};
