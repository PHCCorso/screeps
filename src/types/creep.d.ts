import { CreepActivity, CreepRole } from '../constants/creep';

interface Creep {
    store: Store;
    activity?: CreepActivity;
    role?: CreepRole;
}
