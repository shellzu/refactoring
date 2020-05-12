module.exports = function statement (invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US", 
                        { style: "currency", currency: "USD",
                        minimumFractionDigits: 2 }).format;
    
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = 0;

        // ボリューム特典のポイントを加算
        volumeCredits += Math.max(perf.audience -30, 0);
        // 喜劇のときは10人につき、さらにポイントを加算
        if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
        // 注文の内訳を出力
        result += `  ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}