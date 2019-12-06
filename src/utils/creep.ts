import {
    Role,
    Activity,
    COMMON_CREEP_UPGRADE,
    COLLECTOR_CREEP_UPGRADE,
    HARVESTER_CREEP_UPGRADE,
    BODY_PART_PRIORITY,
    ATTACKER_CREEP_UPGRADE,
} from '../constants/creep';
import { ActivityMessageMap } from '../constants/mappings';

export function createCreep(
    spawn: StructureSpawn,
    role: Role,
    body: BodyPartConstant[]
) {
    const parts = [...body];
    for (const part of body) {
        if (part !== MOVE) {
            parts.push(MOVE);
        }
    }

    parts.sort(bodyPartSorter);

    const newName = role + '_' + Game.time;

    spawn.spawnCreep(parts, newName, {
        memory: {
            role: role,
            sourceRoom: spawn.room.name,
            sourceSpawn: spawn.id,
        },
    });

    return parts.reduce((a, b: BodyPartConstant) => {
        return a + BODYPART_COST[b];
    }, 0);
}

function bodyPartSorter(a: BodyPartConstant, b: BodyPartConstant) {
    return BODY_PART_PRIORITY[a] - BODY_PART_PRIORITY[b];
}

export function changeCreepActivity(creep: Creep, activity: Activity) {
    creep.memory['activity'] = activity;
    creep.say(ActivityMessageMap[activity]);
}

export function upgradeCommonCreep(spawn: StructureSpawn) {
    const room = spawn.room;
    const extensionNumber = room.memory['extensions'].length;
    return COMMON_CREEP_UPGRADE[extensionNumber];
}

export function upgradeCollectorCreep(spawn: StructureSpawn) {
    const room = spawn.room;
    const extensionNumber = room.memory['extensions'].length;
    return COLLECTOR_CREEP_UPGRADE[extensionNumber];
}

export function upgradeAttackerCreep(spawn: StructureSpawn) {
    const room = spawn.room;
    const extensionNumber = room.memory['extensions'].length;
    return ATTACKER_CREEP_UPGRADE[extensionNumber];
}

export function upgradeHarvesterCreep(spawn: StructureSpawn) {
    const room = spawn.room;
    const extensionNumber = room.memory['extensions'].length;
    return HARVESTER_CREEP_UPGRADE[extensionNumber];
}
