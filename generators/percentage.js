const percentageGenerator = {
    utils: null,

    init: function (utils) {
        this.utils = utils;
    },

    generate: function (subtopic, count) {
        const problems = [];
        const seen = new Set();
        let attempts = 0;
        const maxAttempts = count * 3;

        while (problems.length < count && attempts < maxAttempts) {
            attempts++;
            const problem = this.generatePercentageProblem(problems.length);

            // Key based on numerical value and direction
            const key = `${problem.val}:${problem.type}`;
            if (!seen.has(key)) {
                seen.add(key);
                problems.push(problem);
            }
        }
        return problems;
    },

    generatePercentageProblem: function (index) {
        const toPercentage = index % 2 === 0;

        if (toPercentage) {
            // Decimal or Fraction -> Percentage
            const useFraction = Math.random() > 0.5;
            if (useFraction) {
                const denoms = [2, 4, 5, 10, 20, 25, 50];
                const d = denoms[this.utils.getRandomInt(0, denoms.length - 1)];
                const n = this.utils.getRandomInt(1, d - 1);
                const percent = (n / d) * 100;

                return {
                    val: n / d,
                    type: 'to-percent',
                    questionHTML: `
                        <div class="percentage-problem" style="text-align: center; font-size: 1.5rem;">
                            Ubahlah <span class="fraction-text"><span class="numerator">${n}</span><span class="denominator">${d}</span></span> menjadi persen:
                            <div style="margin-top: 15px;">
                                <span style="display:inline-block; width: 60px; height: 1px; border-bottom: 2px dashed #bbb;"></span> %
                            </div>
                        </div>
                    `,
                    answerHTML: `${percent}%`
                };
            } else {
                const val = this.utils.getRandomInt(1, 99) / 100;
                return {
                    val: val,
                    type: 'to-percent',
                    questionHTML: `
                        <div class="percentage-problem" style="text-align: center; font-size: 1.5rem;">
                            Ubahlah <strong>${val}</strong> menjadi persen:
                            <div style="margin-top: 15px;">
                                <span style="display:inline-block; width: 60px; height: 1px; border-bottom: 2px dashed #bbb;"></span> %
                            </div>
                        </div>
                    `,
                    answerHTML: `${val * 100}%`
                };
            }
        } else {
            // Percentage -> Decimal or Fraction
            const useDecimalAns = Math.random() > 0.5;
            const percent = this.utils.getRandomInt(1, 20) * 5; // Multiples of 5%

            if (useDecimalAns) {
                const decimal = percent / 100;
                return {
                    val: percent,
                    type: 'from-percent',
                    questionHTML: `
                        <div class="percentage-problem" style="text-align: center; font-size: 1.5rem;">
                            Ubahlah <strong>${percent}%</strong> menjadi desimal:
                            <div style="margin-top: 15px;">
                                = <span style="display:inline-block; width: 60px; height: 1px; border-bottom: 2px dashed #bbb;"></span>
                            </div>
                        </div>
                    `,
                    answerHTML: `${decimal}`
                };
            } else {
                const n = percent;
                const d = 100;
                const common = this.utils.gcd(n, d);
                const resN = n / common;
                const resD = d / common;

                return {
                    val: percent,
                    type: 'from-percent',
                    questionHTML: `
                        <div class="percentage-problem" style="text-align: center; font-size: 1.5rem;">
                            Ubahlah <strong>${percent}%</strong> menjadi pecahan paling sederhana:
                            <div style="margin-top: 15px;">
                                = <span style="display:inline-block; width: 40px; height: 1px; border-bottom: 2px dashed #bbb;"></span>
                            </div>
                        </div>
                    `,
                    answerHTML: `<span class="fraction-text"><span class="numerator">${resN}</span><span class="denominator">${resD}</span></span>`
                };
            }
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = percentageGenerator;
}
