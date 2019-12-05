export enum Role {
    ATTACKER = 'attacker',
    BUILDER = 'builder',
    COLLECTOR = 'collector',
    HARVESTER = 'harvester',
    REPAIRER = 'repairer',
    UPGRADER = 'upgrader',
}

export enum Activity {
    ATTACK = 'attack',
    BUILD = 'build',
    COLLECT = 'collect',
    HARVEST = 'harvest',
    REPAIR = 'repair',
    RETREAT = 'retreat',
    STORE = 'store',
    UPGRADE = 'upgrade',
    NONE = 'none',
    WALK = 'walk',
    WITHDRAW = 'withdraw',
}

export const BODY_PART_PRIORITY = {
    [TOUGH]: 0,
    [ATTACK]: 1,
    [RANGED_ATTACK]: 2,
    [WORK]: 3,
    [CARRY]: 4,
    [MOVE]: 5,
};

export const COMMON_CREEP_UPGRADE = [
    [],
    [],
    [CARRY],
    [CARRY],
    [CARRY, MOVE],
    [CARRY, MOVE],
];

export const HARVESTER_CREEP_UPGRADE = [
    [],
    [],
    [CARRY],
    [CARRY],
    [CARRY, MOVE],
    [CARRY, CARRY],
];

export const COLLECTOR_CREEP_UPGRADE = [
    [],
    [],
    [CARRY],
    [CARRY],
    [CARRY],
    [CARRY],
];

export const ATTACKER_CREEP_UPGRADE = [
    [],
    [],
    [ATTACK],
    [ATTACK],
    [ATTACK, ATTACK],
    [RANGED_ATTACK],
];

export const COMMON_CREEP: BodyPartConstant[] = [WORK, CARRY];
export const ATTACKER_CREEP: BodyPartConstant[] = [TOUGH, ATTACK];
export const COLLECTOR_CREEP: BodyPartConstant[] = [CARRY, MOVE];
