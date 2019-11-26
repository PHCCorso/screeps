import roleHarvester from './role/harvester';
import roleBuilder from './role/builder';
import roleUpgrader from './role/upgrader';

module.exports.loop = function() {
    // Clear creep memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    roleHarvester.generate();
    roleUpgrader.generate();

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
};
