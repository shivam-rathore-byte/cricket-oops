export class PlayerData {
    constructor(name, runs, matches, centuries, fifties, catches, wickets) {
        this.validateStats(runs, matches, centuries, fifties, catches, wickets);
        this.name = name;
        this.attributes = { runs, matches, centuries, fifties, catches, wickets };
    }

    validateStats(...stats) {
        const ranges = [
            { name: 'Runs', min: 0, max: 100000 },
            { name: 'Matches', min: 0, max: 500 },
            { name: 'Centuries', min: 0, max: 100 },
            { name: 'Fifties', min: 0, max: 80 },
            { name: 'Catches', min: 0, max: 380 },
            { name: 'Wickets', min: 0, max: 960 }
        ];

        stats.forEach((value, index) => {
            const { name, min, max } = ranges[index];
            if (value < min || value > max) {
                throw new Error(`${name} value ${value} is invalid (${min}-${max})`);
            }
        });
    }

    getCardData() {
        return {
            name: this.name,
            attributes: { ...this.attributes }
        };
    }
}