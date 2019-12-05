import roleCollector from './collector';
import { Activity } from '../../constants/creep';
import roleHarvester from './harvester';

export function collectOrHarvest(creep: Creep) {
    const collectorActivity = roleCollector.run(creep);
    if (collectorActivity !== Activity.NONE) {
        return collectorActivity;
    }
    return roleHarvester.run(creep);
}
