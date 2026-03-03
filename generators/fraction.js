const fractionGenerator = {
    generate: function (subtopic, count) {
        const problems = [];
        const [topic, sub, level] = subtopic.split('-'); // e.g., 'frac-visual-sederhana'
        const seen = new Set();
        let attempts = 0;
        const maxAttempts = count * 2;

        while (problems.length < count && attempts < maxAttempts) {
            attempts++;
            let problem;
            if (sub === 'visual') {
                problem = this.generateVisualProblem(level);
            } else if (sub === 'equivalent') {
                problem = this.generateEquivalentProblem(level);
            } else if (sub === 'compare') {
                problem = this.generateComparingProblem(level);
            } else if (sub === 'addsub') {
                problem = this.generateAddSubProblem(level, problems.length);
            } else if (sub === 'simplest') {
                problem = this.generateSimplestFormProblem(level);
            } else {
                problem = this.generateVisualProblem(level);
            }

            // Create a unique key for duplicate prevention
            const key = JSON.stringify(problem.questionHTML);
            if (!seen.has(key)) {
                seen.add(key);
                problems.push(problem);
            }
        }

        // Sorting by sum of denominators if it's a comparison problem
        if (sub === 'compare') {
            problems.sort((a, b) => (a.denom1 + a.denom2) - (b.denom1 + b.denom2));
        }

        return problems;
    },

    utils: {
        gcd: (a, b) => b === 0 ? a : fractionGenerator.utils.gcd(b, a % b),
        getRandomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        shuffleArray: (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    },

    generateVisualProblem: function (level) {
        let denominator, numerator, isCircle, isImproper = false;

        if (level === 'sederhana') {
            // Sederhana: Proper fractions up to 12
            denominator = this.utils.getRandomInt(2, 12);
            numerator = this.utils.getRandomInt(1, denominator - 1);
            isCircle = Math.random() > 0.4;
        } else {
            // Kompleks: Improper fractions (e.g., 5/4)
            denominator = this.utils.getRandomInt(2, 6);
            const whole = this.utils.getRandomInt(1, 2);
            const extra = this.utils.getRandomInt(1, denominator - 1);
            numerator = whole * denominator + extra;
            isImproper = true;
            isCircle = Math.random() > 0.5;
        }

        const visualHTML = this.renderVisual(numerator, denominator, isCircle);

        return {
            questionHTML: `
                <div class="fraction-problem">
                    <p>Tuliskan pecahan untuk bagian yang diarsir:</p>
                    <div class="visual-container" style="margin: 10px 0;">${visualHTML}</div>
                </div>
            `,
            answerHTML: this.formatFraction(numerator, denominator, isImproper)
        };
    },

    renderVisual: function (numerator, denominator, isCircle, forceOneShape = false) {
        const size = 100;
        const spacing = 10;
        let totalShapes = Math.ceil(numerator / denominator);
        if (forceOneShape) totalShapes = Math.max(1, totalShapes);
        let html = '';

        for (let s = 0; s < totalShapes; s++) {
            const currentNumerator = Math.max(0, Math.min(denominator, numerator - (s * denominator)));
            if (isCircle) {
                html += this.renderCircle(currentNumerator, denominator, size);
            } else {
                html += this.renderBar(currentNumerator, denominator, size);
            }
        }

        return `<div style="display: flex; flex-wrap: wrap; gap: ${spacing}px; justify-content: center;">${html}</div>`;
    },

    renderCircle: function (numerator, denominator, size) {
        const center = size / 2;
        const radius = size / 2 - 5;
        const angle = 360 / denominator;
        let paths = '';

        for (let i = 0; i < denominator; i++) {
            const startAngle = (i * angle - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * angle - 90) * (Math.PI / 180);

            const x1 = center + radius * Math.cos(startAngle);
            const y1 = center + radius * Math.sin(startAngle);
            const x2 = center + radius * Math.cos(endAngle);
            const y2 = center + radius * Math.sin(endAngle);

            const largeArcFlag = angle > 180 ? 1 : 0;
            const fill = i < numerator ? '#E0E0E0' : 'none';
            const d = `M ${center},${center} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
            paths += `<path d="${d}" fill="${fill}" stroke="black" stroke-width="1.5" />`;
        }

        return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${paths}</svg>`;
    },

    renderBar: function (numerator, denominator, size) {
        const barWidth = size / denominator;
        const barHeight = size / 2;
        let rects = '';
        for (let i = 0; i < denominator; i++) {
            const fill = i < numerator ? '#E0E0E0' : 'none';
            const x = i * barWidth;
            rects += `<rect x="${x}" y="0" width="${barWidth}" height="${barHeight}" fill="${fill}" stroke="black" stroke-width="1.5" />`;
        }
        return `<svg width="${size}" height="${barHeight}" viewBox="0 0 ${size} ${barHeight}">${rects}</svg>`;
    },

    formatFraction: function (num, den, isImproper) {
        if (isImproper) {
            const whole = Math.floor(num / den);
            const rem = num % den;
            return `<span style="font-size: 1.2rem; vertical-align: middle;">${whole}</span><span class="fraction-text"><span class="numerator">${rem}</span><span class="denominator">${den}</span></span>`;
        }
        return `<span class="fraction-text"><span class="numerator">${num}</span><span class="denominator">${den}</span></span>`;
    },

    generateEquivalentProblem: function (level) {
        let baseNum, baseDenom, targetNum, targetDenom;

        if (level === 'dasar') {
            const isMultiply = Math.random() > 0.5;
            if (isMultiply) {
                baseDenom = this.utils.getRandomInt(2, 6);
                baseNum = this.utils.getRandomInt(1, baseDenom - 1);
                const factor = this.utils.getRandomInt(2, 4);
                targetNum = baseNum * factor;
                targetDenom = baseDenom * factor;
            } else {
                const sDenom = this.utils.getRandomInt(2, 5);
                const sNum = this.utils.getRandomInt(1, sDenom - 1);
                const factor = this.utils.getRandomInt(2, 3);
                baseNum = sNum * factor;
                baseDenom = sDenom * factor;
                targetNum = sNum;
                targetDenom = sDenom;
            }
        } else {
            // Mahir: Indirect Scaling (Simplify -> Scale)
            let a, b, m1, m2;
            do {
                b = this.utils.getRandomInt(2, 5);
                a = this.utils.getRandomInt(1, b - 1);
                if (this.utils.gcd(a, b) !== 1) continue;
                m1 = this.utils.getRandomInt(2, 5);
                m2 = this.utils.getRandomInt(2, 6);
            } while (m1 === m2 || m2 % m1 === 0 || m1 % m2 === 0);

            baseNum = a * m1;
            baseDenom = b * m1;
            targetNum = a * m2;
            targetDenom = b * m2;
        }

        const hideNumerator = Math.random() > 0.5;
        const placeholder = '<span style="color: #bbb;">...</span>';
        const displayTargetNum = hideNumerator ? placeholder : targetNum;
        const displayTargetDenom = hideNumerator ? targetNum : placeholder;

        return {
            questionHTML: `
                <div class="fraction-problem">
                    <p>Isilah titik-titik agar menjadi pecahan senilai:</p>
                    <div class="equation" style="font-size: 1.5rem; margin-top: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <span class="fraction-text"><span class="numerator">${baseNum}</span><span class="denominator">${baseDenom}</span></span>
                        <span>=</span>
                        <span class="fraction-text"><span class="numerator">${displayTargetNum}</span><span class="denominator">${displayTargetDenom}</span></span>
                    </div>
                </div>
            `,
            answerHTML: `<span class="fraction-text"><span class="numerator">${targetNum}</span><span class="denominator">${targetDenom}</span></span>`
        };
    },

    generateSimplestFormProblem: function (level) {
        let num, denom, common;

        if (level === 'dasar') {
            // Dasar: Numerator is a factor of denominator (e.g., simplifies to 1/n)
            const sDenom = this.utils.getRandomInt(2, 6);
            common = this.utils.getRandomInt(2, 6);
            num = 1 * common;
            denom = sDenom * common;
        } else {
            // Mahir: Multi-step or large GCD
            const largeGCDs = [12, 15, 16, 18, 20, 24, 25];
            const isLarge = Math.random() > 0.4;

            if (isLarge) {
                common = largeGCDs[this.utils.getRandomInt(0, largeGCDs.length - 1)];
                const sDenom = this.utils.getRandomInt(3, 5);
                const sNum = this.utils.getRandomInt(2, sDenom - 1);
                num = sNum * common;
                denom = sDenom * common;
            } else {
                const factor1 = this.utils.getRandomInt(2, 3);
                const factor2 = this.utils.getRandomInt(2, 4);
                common = factor1 * factor2;
                const sDenom = this.utils.getRandomInt(3, 8);
                const sNum = this.utils.getRandomInt(2, sDenom - 1);
                num = sNum * common;
                denom = sDenom * common;
            }
        }

        const gcd = this.utils.gcd(num, denom);
        const finalNum = num / gcd;
        const finalDenom = denom / gcd;

        const placeholder = '<span style="color: #bbb;">...</span>';

        return {
            questionHTML: `
                <div class="fraction-problem">
                    <p>Sederhanakan pecahan berikut:</p>
                    <div class="equation" style="font-size: 1.5rem; margin-top: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <span class="fraction-text"><span class="numerator">${num}</span><span class="denominator">${denom}</span></span>
                        <span>=</span>
                        <span class="fraction-text"><span class="numerator">${placeholder}</span><span class="denominator">${placeholder}</span></span>
                    </div>
                </div>
            `,
            answerHTML: `<span class="fraction-text"><span class="numerator">${finalNum}</span><span class="denominator">${finalDenom}</span></span>`
        };
    },

    generateComparingProblem: function (level) {
        let n1, d1, n2, d2;

        if (level === 'sederhana') {
            const isSameDenom = Math.random() > 0.5;
            if (isSameDenom) {
                // Same Denominator
                // Must be at least 3 to have two distinct numerators (1 and 2)
                d1 = d2 = this.utils.getRandomInt(3, 25);
                n1 = this.utils.getRandomInt(1, d1 - 1); // numerator < denominator
                do {
                    n2 = this.utils.getRandomInt(1, d2 - 1);
                } while (n1 === n2);
            } else {
                // Same Numerator
                // n1 must be at most 23 to allow two distinct denoms up to 25
                n1 = n2 = this.utils.getRandomInt(1, 23);
                d1 = this.utils.getRandomInt(n1 + 1, 24);
                do {
                    d2 = this.utils.getRandomInt(n1 + 1, 25);
                } while (d1 === d2);
            }
        } else {
            // Kompleks: Random denoms up to 25
            // Safety counter to prevent infinite loop
            let attempts = 0;
            do {
                attempts++;
                d1 = this.utils.getRandomInt(2, 25);
                n1 = this.utils.getRandomInt(1, d1 - 1); // proper fraction
                d2 = this.utils.getRandomInt(2, 25);
                n2 = this.utils.getRandomInt(1, d2 - 1); // proper fraction
                // Avoid same fractions, equivalent fractions or same num/denom
            } while (attempts < 100 && (d1 === d2 || n1 === n2 || (n1 * d2 === n2 * d1)));
        }

        const cross1 = n1 * d2;
        const cross2 = n2 * d1;
        let symbol = '=';
        if (cross1 > cross2) symbol = '>';
        else if (cross1 < cross2) symbol = '<';

        return {
            denom1: d1,
            denom2: d2,
            questionHTML: `
                <div class="fraction-problem">
                    <p style="margin-bottom: 10px;">Bandingkan pecahan berikut dengan tanda &lt;, &gt;, atau = :</p>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
                        <span class="fraction-text"><span class="numerator">${n1}</span><span class="denominator">${d1}</span></span>
                        <div style="width: 35px; height: 35px; border: 1.5px solid #bbb; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #bbb; font-size: 0.8rem;">...</div>
                        <span class="fraction-text"><span class="numerator">${n2}</span><span class="denominator">${d2}</span></span>
                    </div>
                </div>
            `,
            answerHTML: `<span style="font-weight: bold; font-size: 1.2rem;">${symbol}</span>`
        };
    },

    generateAddSubProblem: function (level, index = 0) {
        let n1, d1, n2, d2, op;
        const isAddition = index % 2 === 0;
        op = isAddition ? '+' : '-';

        if (level === 'visual') {
            d1 = d2 = this.utils.getRandomInt(2, 10);
            if (isAddition) {
                n1 = this.utils.getRandomInt(1, d1 - 1);
                n2 = this.utils.getRandomInt(1, d1 - n1);
            } else {
                n1 = this.utils.getRandomInt(2, d1 - 1);
                n2 = this.utils.getRandomInt(1, n1 - 1);
            }

            const isCircle = Math.random() > 0.5;
            const v1 = this.renderVisual(n1, d1, isCircle);
            const v2 = this.renderVisual(n2, d1, isCircle);
            const vAns = this.renderVisual(0, d1, isCircle, true); // Empty result box, forced outline

            const resN = isAddition ? (n1 + n2) : (n1 - n2);
            const commonGCD = this.utils.gcd(resN, d1);
            const finalAns = this.formatFraction(resN / commonGCD, d1 / commonGCD);

            return {
                denom1: d1, denom2: d1,
                questionHTML: `
                    <div class="fraction-problem">
                        <p style="margin-bottom: 5px;">Berapakah hasil dari:</p>
                        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                            ${v1} <span style="font-size: 1.5rem; font-weight: bold;">${op}</span> ${v2} <span style="font-size: 1.5rem; font-weight: bold;">=</span> ${vAns}
                        </div>
                        <p style="font-size: 0.8rem; color: #888; margin-top: 5px;">(Arsirlah kotak terakhir)</p>
                    </div>
                `,
                answerHTML: finalAns
            };
        } else if (level === 'sederhana') {
            const isSameDenom = Math.random() > 0.6;
            if (isSameDenom) {
                d1 = d2 = this.utils.getRandomInt(2, 20);
                if (isAddition) {
                    n1 = this.utils.getRandomInt(1, d1 - 1);
                    n2 = this.utils.getRandomInt(1, d1 - n1);
                } else {
                    n1 = this.utils.getRandomInt(2, d1 - 1);
                    n2 = this.utils.getRandomInt(1, n1 - 1);
                }
            } else {
                // Multiple denominator
                d1 = this.utils.getRandomInt(2, 10);
                const mult = this.utils.getRandomInt(2, 3);
                d2 = d1 * mult;
                if (isAddition) {
                    n1 = this.utils.getRandomInt(1, d1 - 1);
                    n2 = this.utils.getRandomInt(1, d2 - (n1 * mult));
                } else {
                    n1 = this.utils.getRandomInt(1, d1 - 1);
                    n2 = this.utils.getRandomInt(1, (n1 * mult) - 1);
                }
            }
        } else {
            // Kompleks
            let attempts = 0;
            const hasCommonFactor = Math.random() > 0.5;

            do {
                attempts++;
                if (hasCommonFactor) {
                    const common = this.utils.getRandomInt(2, 4);
                    d1 = common * this.utils.getRandomInt(2, 5);
                    d2 = common * this.utils.getRandomInt(2, 5);
                } else {
                    d1 = this.utils.getRandomInt(2, 12);
                    d2 = this.utils.getRandomInt(2, 12);
                }

                if (d1 === d2) continue;
                if (!hasCommonFactor && this.utils.gcd(d1, d2) > 1) continue;

                n1 = this.utils.getRandomInt(1, d1 - 1);
                n2 = this.utils.getRandomInt(1, d2 - 1);

                // Use cross-multiplication for exact integer comparison
                const checkAddition = (n1 * d2 + n2 * d1) <= (d1 * d2);
                const checkSubtraction = (n1 * d2 - n2 * d1) > 0;

                if (isAddition && checkAddition) break;
                if (!isAddition && checkSubtraction) break;

            } while (attempts < 100);
        }

        const resN = isAddition ? (n1 * d2 + n2 * d1) : (n1 * d2 - n2 * d1);
        const resD = d1 * d2;
        const commonGCD = this.utils.gcd(resN, resD);
        const finalAns = this.formatFraction(resN / commonGCD, resD / commonGCD);

        return {
            denom1: d1, denom2: d2,
            questionHTML: `
                <div class="fraction-problem" style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <span class="fraction-text"><span class="numerator">${n1}</span><span class="denominator">${d1}</span></span>
                    <span style="font-size: 1.2rem; font-weight: bold;">${op}</span>
                    <span class="fraction-text"><span class="numerator">${n2}</span><span class="denominator">${d2}</span></span>
                    <span style="font-size: 1.2rem; font-weight: bold;">=</span>
                    <div style="width: 40px; height: 1px; border-bottom: 2px solid #bbb; margin-top: 15px;"></div>
                </div>
            `,
            answerHTML: finalAns
        };
    },
};
