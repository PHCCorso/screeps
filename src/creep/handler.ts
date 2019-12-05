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
        for (const roleName in RoleFunctionMap) {
            const role = RoleFunctionMap[roleName];
            role.generate(Game.spawns[spawnName]);
        }
    }

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        const roleName = creep.memory['role'];
        if (creep.room.memory['creeps'][Role.HARVESTER].length == 0) {
            if (
                creep.body.some(p => p.type == WORK) &&
                creep.body.some(p => p.type == CARRY)
            ) {
                RoleFunctionMap[Role.HARVESTER].run(creep);
            }
        }
        if (RoleFunctionMap[roleName]) RoleFunctionMap[roleName].run(creep);
    }
}
