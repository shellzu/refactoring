module.exports = function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;

    function enrichPerformance(aPerformance) {
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function totalAmount(data) {
        let result = 0;
        for(let perf of data.performances) {
            result += perf.amount;
        }
        return result;
    }

    function totalVolumeCredits(data) {
        let volumeCredits = 0;
        for(let perf of data.performances) {
            volumeCredits += perf.volumeCredits;
        }
        return volumeCredits;
    }
}

class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount() {
        let result = 0;
        switch (this.play.type) {
            case "tragedy":
                throw '想定外の呼び出し';
            case "comedy":
                throw '想定外の呼び出し';
            default:
                throw new Error(`unknown type: ${this.play.type}`);
        }
        return result;
    }

    get volumeCredits() {
        let result = 0;
        result += Math.max(this.performance.audience -30, 0);
        if ("comedy" === this.play.type) result += Math.floor(this.performance.audience / 5)
        return result;
    }
}

function createPerformanceCalculator(aPerformance, aPlay) {
    switch(aPlay.type) {
        case "tragedy" : return new TragedyCalculator(aPerformance, aPlay);
        case "comedy" : return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error(`未知の演劇の種類: ${aPlay.type}`);
    }
}

class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }
}