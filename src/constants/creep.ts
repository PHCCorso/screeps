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
    [CARRY], // 350
    [CARRY],
    [WORK, CARRY], // 500
    [WORK, CARRY],
    [WORK, CARRY],
    [WORK, CARRY], // 600
    [WORK, CARRY],
    [WORK, CARRY, CARRY], // 650
    [WORK, WORK, CARRY], // 650
];

export const HARVESTER_CREEP_UPGRADE = [
    [],
    [],
    [CARRY], // 300
    [WORK], // 350
    [WORK],
    [WORK, WORK], // 500
    [WORK, WORK], // 500
    [WORK, WORK], // 500
    [WORK, WORK], // 650
    [WORK, WORK],
    [WORK, WORK, WORK],
];

export const COLLECTOR_CREEP_UPGRADE = [
    [],
    [],
    [CARRY], // 200
    [CARRY],
    [CARRY, CARRY], // 300
    [CARRY, CARRY, CARRY], // 400
    [CARRY, CARRY, CARRY],
    [CARRY, CARRY, CARRY],
    [CARRY, CARRY, CARRY],
    [CARRY, CARRY, CARRY],
    [CARRY, CARRY, CARRY],
];

export const ATTACKER_CREEP_UPGRADE = [
    [],
    [],
    [TOUGH], // 310
    [ATTACK], // 380
    [TOUGH, ATTACK], // 440
    [TOUGH, RANGED_ATTACK],
    [TOUGH, RANGED_ATTACK],
    [TOUGH, RANGED_ATTACK],
    [TOUGH, RANGED_ATTACK],
    [TOUGH, RANGED_ATTACK],
    [TOUGH, RANGED_ATTACK],
];

export const COMMON_CREEP: BodyPartConstant[] = [WORK, CARRY]; // 250
export const ATTACKER_CREEP: BodyPartConstant[] = [TOUGH, TOUGH, ATTACK]; // 250
export const COLLECTOR_CREEP: BodyPartConstant[] = [CARRY]; // 100
