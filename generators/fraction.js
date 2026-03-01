const fractionGenerator = {
    generate: function (subtopic, count) {
        const problems = [];
        const [topic, sub, level] = subtopic.split('-'); // e.g., 'frac-visual-sederhana'

        for (let i = 0; i < count; i++) {
            let problem;
            if (sub === 'visual') {
                problem = this.generateVisualProblem(level);
            } else if (sub === 'equivalent') {
                problem = this.generateEquivalentProblem(level);
            } else if (sub === 'simplest') {
                problem = this.generateSimplestFormProblem(level);
            } else {
                problem = this.generateVisualProblem(level);
            }
            problems.push(problem);
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

    renderVisual: function (numerator, denominator, isCircle) {
        const size = 100;
        const spacing = 10;
        const totalShapes = Math.ceil(numerator / denominator);
        let html = '';

        for (let s = 0; s < totalShapes; s++) {
            const currentNumerator = Math.min(denominator, numerator - (s * denominator));
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
};
