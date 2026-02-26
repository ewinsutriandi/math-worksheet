const fractionGenerator = {
    generate: function (subtopic, count) {
        const problems = [];
        for (let i = 0; i < count; i++) {
            let problem;
            switch (subtopic) {
                case 'visual':
                    problem = this.generateVisualProblem();
                    break;
                case 'equivalent':
                    problem = this.generateEquivalentProblem();
                    break;
                case 'simplest':
                    problem = this.generateSimplestFormProblem();
                    break;
                default:
                    problem = this.generateVisualProblem();
            }
            problems.push(problem);
        }
        return problems;
    },

    utils: {
        gcd: (a, b) => b === 0 ? a : fractionGenerator.utils.gcd(b, a % b),
        getRandomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    },

    generateVisualProblem: function () {
        const denominator = this.utils.getRandomInt(2, 10);
        const numerator = this.utils.getRandomInt(1, denominator - 1);
        const isCircle = Math.random() > 0.5;

        let visualHTML = '';
        const size = 100;
        const center = size / 2;
        const radius = size / 2 - 5;

        if (isCircle) {
            // SVG Pie Chart
            let paths = '';
            // Calculate slice angle
            const angle = 360 / denominator;

            // Draw all slices (outlines)
            for (let i = 0; i < denominator; i++) {
                const startAngle = (i * angle - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * angle - 90) * (Math.PI / 180);

                const x1 = center + radius * Math.cos(startAngle);
                const y1 = center + radius * Math.sin(startAngle);
                const x2 = center + radius * Math.cos(endAngle);
                const y2 = center + radius * Math.sin(endAngle);

                const largeArcFlag = angle > 180 ? 1 : 0;

                // For shaded slices
                const fill = i < numerator ? '#E0E0E0' : 'none';

                // SVG Path command
                // M center,center L x1,y1 A radius,radius 0 largeArc,1 x2,y2 Z
                const d = `M ${center},${center} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;

                paths += `<path d="${d}" fill="${fill}" stroke="black" stroke-width="2" />`;
            }

            visualHTML = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${paths}</svg>`;
        } else {
            // SVG Bar Chart
            const barWidth = size / denominator;
            let rects = '';
            for (let i = 0; i < denominator; i++) {
                const fill = i < numerator ? '#E0E0E0' : 'none';
                const x = i * barWidth;
                rects += `<rect x="${x}" y="0" width="${barWidth}" height="${size / 2}" fill="${fill}" stroke="black" stroke-width="2" />`;
            }
            visualHTML = `<svg width="${size}" height="${size / 2}" viewBox="0 0 ${size} ${size / 2}">${rects}</svg>`;
        }

        return {
            questionHTML: `
                <div class="fraction-problem">
                    <p>Tuliskan pecahan untuk bagian yang diarsir:</p>
                    <div class="visual-container" style="margin: 10px 0;">${visualHTML}</div>
                </div>
            `,
            answerHTML: `<span class="fraction-text"><span class="numerator">${numerator}</span><span class="denominator">${denominator}</span></span>`
        };
    },

    generateEquivalentProblem: function () {
        // Find missing numerator or denominator
        // 1/2 = ?/4
        const baseDenom = this.utils.getRandomInt(2, 9);
        const baseNum = this.utils.getRandomInt(1, baseDenom - 1);

        // Ensure base is simplified for better questions, though not strictly required
        // Actually, let's just pick a factor
        const factor = this.utils.getRandomInt(2, 5);

        const targetNum = baseNum * factor;
        const targetDenom = baseDenom * factor;

        // Randomly hide one of the target values (num or denom)
        const hideNumerator = Math.random() > 0.5;

        let questionHTML = '';

        if (hideNumerator) {
            questionHTML = `
                <div class="fraction-problem">
                    <p>Isilah titik-titik di bawah ini agar menjadi pecahan senilai:</p>
                    <div class="equation" style="font-size: 1.5rem; margin-top: 10px;">
                        <span class="fraction-text"><span class="numerator">${baseNum}</span><span class="denominator">${baseDenom}</span></span>
                        =
                        <span class="fraction-text"><span class="numerator">...</span><span class="denominator">${targetDenom}</span></span>
                    </div>
                </div>
            `;
            return {
                questionHTML: questionHTML,
                answerHTML: `<span class="fraction-text"><span class="numerator"><strong>${targetNum}</strong></span><span class="denominator">${targetDenom}</span></span>`
            };
        } else {
            questionHTML = `
                <div class="fraction-problem">
                    <p>Isilah titik-titik di bawah ini agar menjadi pecahan senilai:</p>
                    <div class="equation" style="font-size: 1.5rem; margin-top: 10px;">
                        <span class="fraction-text"><span class="numerator">${baseNum}</span><span class="denominator">${baseDenom}</span></span>
                        =
                        <span class="fraction-text"><span class="numerator">${targetNum}</span><span class="denominator">...</span></span>
                    </div>
                </div>
            `;
            return {
                questionHTML: questionHTML,
                answerHTML: `<span class="fraction-text"><span class="numerator">${targetNum}</span><span class="denominator"><strong>${targetDenom}</strong></span></span>`
            };
        }
    },

    generateSimplestFormProblem: function () {
        // Generate a fraction that is NOT in simplest form
        let num, denom, common;
        do {
            const baseDenom = this.utils.getRandomInt(2, 10);
            const baseNum = this.utils.getRandomInt(1, baseDenom - 1);

            // Ensure base is simplified initially (or close to it)
            // Then multiply by factor
            const factor = this.utils.getRandomInt(2, 5);

            num = baseNum * factor;
            denom = baseDenom * factor;

            // Re-calculate gcd to ensure it really can be simplified
            common = this.utils.gcd(num, denom);
        } while (common === 1); // Repeat until we get something reducible

        const simpleNum = num / common;
        const simpleDenom = denom / common;

        return {
            questionHTML: `
                <div class="fraction-problem">
                    <p>Sederhanakan pecahan berikut:</p>
                    <div class="equation" style="font-size: 1.5rem; margin-top: 10px;">
                        <span class="fraction-text"><span class="numerator">${num}</span><span class="denominator">${denom}</span></span>
                    </div>
                </div>
            `,
            answerHTML: `<span class="fraction-text"><span class="numerator">${simpleNum}</span><span class="denominator">${simpleDenom}</span></span>`
        };
    }
};
