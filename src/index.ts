import handleCreeps from './creep/handler';
import handleSources from './source/handler';
import handleSpawns from './spawn/handler';
import handleTowers from './tower/handler';
import handleRooms from './room/handler';

module.exports.loop = function() {
    handleRooms();
    handleSources();
    handleCreeps();
    handleSpawns();
    handleTowers();
};
