import { RoleFunctionMap } from '../constants/mappings';
import { Role } from '../constants/creep';

export default function handleCreeps() {
    // Clear creep memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        for (const roleName in RoleFunctionMap) {
            const role = RoleFunctionMap[roleName];
            if (
                spawn.room.memory['hostiles'].length == 0 ||
                roleName == Role.ATTACKER
            ) {
                role.generate(spawn);
            }
        }
    }

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        const roleName = creep.memory['role'];
        if (
            (creep.room.memory['extensions'] < 4 &&
                creep.room.memory['creeps'][Role.HARVESTER].length <
                    creep.room.memory['maxFreeSourcePositions']) ||
            creep.room.memory['creeps'][Role.HARVESTER].length == 0
        ) {
            if (
                creep.body.some(p => p.type == WORK) &&
                creep.body.some(p => p.type == CARRY)
            ) {
                creep.memory['role'] = Role.HARVESTER;
                creep.room.memory['creeps'][Role.HARVESTER].push(creep.id);
            }
        }
        if (RoleFunctionMap[roleName]) RoleFunctionMap[roleName].run(creep);
    }
}
