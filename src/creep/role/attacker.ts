import {
    changeCreepActivity,
    upgradeAttackerCreep,
    createCreep,
} from '../../utils/creep';
import { Role, Activity, ATTACKER_CREEP } from '../../constants/creep';
import { distance } from '../../utils/room';

const roleAttacker = {
    run: function(creep: Creep) {
        const hostiles = creep.room.memory['hostiles'];
        if (
            creep.memory['activity'] !== Activity.ATTACK &&
            hostiles.length > 0
        ) {
            changeCreepActivity(creep, Activity.ATTACK);
        }

        if (
            creep.memory['activity'] === Activity.ATTACK &&
            hostiles.length == 0
        ) {
            changeCreepActivity(creep, Activity.RETREAT);
        }

        if (creep.memory['activity'] === Activity.ATTACK) {
            const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

            if (creep.attack(hostile) == ERR_NOT_IN_RANGE) {
                creep.moveTo(hostile, { maxOps: 5000, swampCost: 4 });
            }
            return Activity.ATTACK;
        }

        if (creep.memory['activity'] === Activity.RETREAT) {
            const spawn = Game.getObjectById(
                creep.memory['sourceSpawn']
            ) as StructureSpawn;

            if (distance(creep.pos, spawn.pos) > 10) {
                creep.moveTo(spawn, { maxOps: 5000, swampCost: 4 });
                return Activity.RETREAT;
            }
        }
        return Activity.NONE;
    },

    generate: function(spawn: StructureSpawn) {
        if (spawn.room.memory['hostiles'].length > 0) {
            if (
                spawn.room.memory['hostiles'].length * 2 >
                spawn.room.memory['creeps'][Role.ATTACKER].length
            )
                createCreep(spawn, Role.ATTACKER, [
                    ...ATTACKER_CREEP,
                    ...upgradeAttackerCreep(spawn),
                ]);
        }
    },
};

export default roleAttacker;
