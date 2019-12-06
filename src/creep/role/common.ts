import roleCollector from './collector';
import { Activity } from '../../constants/creep';
import roleHarvester from './harvester';

export function collectOrHarvest(creep: Creep) {
    if (creep.memory['activity'] != Activity.HARVEST) {
        const collectorActivity = roleCollector.run(creep);
        if (collectorActivity !== Activity.NONE) {
            return collectorActivity;
        }
    }
    if (creep.room.memory['containers'].length == 0) {
        return roleHarvester.run(creep);
    } else {
        return roleCollector.run(creep);
    }
}
