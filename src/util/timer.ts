export default class Timer {
    constructor(private initialTime: number, private interval: number) {}

    getTime() {
        return (Game.time - this.initialTime) % this.interval;
    }
}
