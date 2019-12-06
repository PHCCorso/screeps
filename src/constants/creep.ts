export enum Role {
    ATTACKER = 'attacker',
    BUILDER = 'builder',
    COLLECTOR = 'collector',
    HARVESTER = 'harvester',
    REPAIRER = 'repairer',
    UPGRADER = 'upgrader',
    WALL_REPAIRER = 'wallRepairer',
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
    [CARRY, CARRY], // 400
    [CARRY, CARRY, CARRY], // 450
];

export const HARVESTER_CREEP_UPGRADE = [
    [],
    [],
    [CARRY], // 300
    [WORK], // 350
    [WORK],
    [WORK, WORK], // 500
];

export const COLLECTOR_CREEP_UPGRADE = [
    [],
    [],
    [CARRY],
    [CARRY],
    [CARRY, CARRY],
    [CARRY, CARRY, CARRY],
];

export const ATTACKER_CREEP_UPGRADE = [
    [],
    [],
    [TOUGH], // 310
    [ATTACK], // 380
    [TOUGH, ATTACK], // 440
    [TOUGH, ATTACK],
];

export const COMMON_CREEP: BodyPartConstant[] = [WORK, CARRY]; // 200
export const ATTACKER_CREEP: BodyPartConstant[] = [TOUGH, TOUGH, ATTACK]; // 250
export const COLLECTOR_CREEP: BodyPartConstant[] = [CARRY, MOVE]; // 150
