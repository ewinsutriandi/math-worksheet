const arithmeticGenerator = {
    generate: function (subtopic, count) {
        let problems = [];
        const [op, level] = subtopic.split('-');
        const seen = new Set();
        let attempts = 0;
        const maxAttempts = count * 10;

        while (problems.length < count && attempts < maxAttempts) {
            attempts++;
            let problem;
            switch (op) {
                case 'add': problem = this.generateAddition(level); break;
                case 'sub': problem = this.generateSubtraction(level); break;
                case 'mul': problem = this.generateMultiplication(level); break;
                case 'div': problem = this.generateDivision(level); break;
            }

            if (!problem) continue;

            // Identity check (op + operands)
            const id = `${op}:${problem.operands.join(',')}`;
            if (!seen.has(id)) {
                seen.add(id);
                problems.push(problem);
            }
        }

        // Sort by specific criteria per operation
        problems.sort((a, b) => {
            if (op === 'sub') {
                // Subtraction sorting: total digits first
                const digitsA = a.operands.reduce((acc, n) => acc + n.toString().length, 0);
                const digitsB = b.operands.reduce((acc, n) => acc + n.toString().length, 0);
                if (digitsA !== digitsB) return digitsA - digitsB;

                // Then borrowing
                const borrowA = a.needsBorrowing ? 1 : 0;
                const borrowB = b.needsBorrowing ? 1 : 0;
                if (borrowA !== borrowB) return borrowA - borrowB;
            } else if (op === 'add') {
                // Addition sorting: total digits first
                const digitsA = a.operands.reduce((acc, n) => acc + n.toString().length, 0);
                const digitsB = b.operands.reduce((acc, n) => acc + n.toString().length, 0);
                if (digitsA !== digitsB) return digitsA - digitsB;

                // Then regrouping
                const regroupA = a.needsRegrouping ? 1 : 0;
                const regroupB = b.needsRegrouping ? 1 : 0;
                if (regroupA !== regroupB) return regroupA - regroupB;
            } else if (op === 'mul') {
                // Multiplication sorting: total digits first
                const digitsA = a.operands.reduce((acc, n) => acc + n.toString().length, 0);
                const digitsB = b.operands.reduce((acc, n) => acc + n.toString().length, 0);
                if (digitsA !== digitsB) return digitsA - digitsB;

                // Then carrying
                const carryA = a.needsCarrying ? 1 : 0;
                const carryB = b.needsCarrying ? 1 : 0;
                if (carryA !== carryB) return carryA - carryB;
            } else if (op === 'div') {
                // Division sorting: total digits first
                const digitsA = a.operands.reduce((acc, n) => acc + n.toString().length, 0);
                const digitsB = b.operands.reduce((acc, n) => acc + n.toString().length, 0);
                if (digitsA !== digitsB) return digitsA - digitsB;

                // Then complexity (carry-over remainders)
                const complexA = a.isComplex ? 1 : 0;
                const complexB = b.isComplex ? 1 : 0;
                if (complexA !== complexB) return complexA - complexB;
            }

            // Default: Sort by operand sum (natural progression)
            const sumA = a.operands.reduce((acc, n) => acc + n, 0);
            const sumB = b.operands.reduce((acc, n) => acc + n, 0);
            return sumA - sumB || (a.difficulty || 0) - (b.difficulty || 0);
        });

        return problems;
    },

    utils: {
        getRandomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        needsRegrouping: (a, b) => {
            let s1 = a.toString().split('').reverse();
            let s2 = b.toString().split('').reverse();
            let len = Math.max(s1.length, s2.length);
            for (let i = 0; i < len; i++) {
                let d1 = parseInt(s1[i] || 0);
                let d2 = parseInt(s2[i] || 0);
                if (d1 + d2 >= 10) return true;
            }
            return false;
        },
        needsMultiCarrying: (a, b) => {
            let s1 = a.toString().split('').reverse();
            let s2 = b.toString().split('').reverse();
            // Check for carrying in any column multiplication or final addition
            // For simplicity, detect if any digit multiplication >= 10
            // or if any column addition in the process would carry
            for (let i = 0; i < s2.length; i++) {
                let d2 = parseInt(s2[i]);
                let carry = 0;
                for (let j = 0; j < s1.length; j++) {
                    let d1 = parseInt(s1[j]);
                    let prod = (d1 * d2) + carry;
                    if (prod >= 10) return true;
                    carry = Math.floor(prod / 10);
                }
            }
            // Also check for carrying in addition if s2 has multiple digits
            if (s2.length > 1) {
                // Any multi-digit multiplication involves addition steps
                // which often imply a higher difficulty even if individual prods are small
                // but we keep the logic consistent with 'carrying'
                return true;
            }
            return false;
        },
        isComplexDivision: (dividend, divisor) => {
            // A division is "simple" if every digit of the dividend (from left to right)
            // is divisible by the divisor OR if the current prefix is divisible.
            // Pedagogically, if you can divide the first digit(s) without carrying 
            // a remainder to the next, it's easier.
            let s = dividend.toString();
            let remainder = 0;
            for (let i = 0; i < s.length; i++) {
                let current = remainder * 10 + parseInt(s[i]);
                if (current < divisor && i < s.length - 1) {
                    remainder = current;
                    continue;
                }
                if (current % divisor !== 0) return true; // Remainder exists, will carry over
                remainder = 0; // Perfectly divisible at this step
            }
            return false;
        },
        needsBorrowing: (a, b) => {
            let s1 = a.toString().split('').reverse();
            let s2 = b.toString().split('').reverse();
            for (let i = 0; i < s2.length; i++) {
                if (parseInt(s1[i]) < parseInt(s2[i])) return true;
            }
            return false;
        }
    },

    generateAddition: function (level) {
        let cases = [];

        if (level === 'dasar') {
            cases = [
                () => { // Case 1: 1D + 1D
                    const n1 = this.utils.getRandomInt(1, 9);
                    const n2 = this.utils.getRandomInt(1, 9);
                    return { nums: [n1, n2], diff: 1 };
                },
                () => { // Case 2: 2D + 1D, No Regrouping
                    let n1, n2;
                    do {
                        n1 = this.utils.getRandomInt(10, 90);
                        n2 = this.utils.getRandomInt(1, 9);
                    } while (this.utils.needsRegrouping(n1, n2));
                    return { nums: [n1, n2], diff: 2 };
                },
                () => { // Case 3: Multiple 1D
                    return { nums: [this.utils.getRandomInt(1, 9), this.utils.getRandomInt(1, 9), this.utils.getRandomInt(1, 9)], diff: 3 };
                }
            ];
        } else if (level === 'menengah') {
            cases = [
                () => { // Case 4: 2D + 1D, With Regrouping
                    let n1, n2;
                    do {
                        n1 = this.utils.getRandomInt(11, 89);
                        n2 = this.utils.getRandomInt(1, 9);
                    } while (!this.utils.needsRegrouping(n1, n2));
                    return { nums: [n1, n2], diff: 4 };
                },
                () => { // Case 5: 2D + 2D, No Regrouping
                    let n1, n2;
                    do {
                        n1 = this.utils.getRandomInt(10, 80);
                        n2 = this.utils.getRandomInt(10, 80);
                    } while (this.utils.needsRegrouping(n1, n2));
                    return { nums: [n1, n2], diff: 5 };
                },
                () => { // Case 6: 2D + 2D, With Regrouping
                    let n1, n2;
                    do {
                        n1 = this.utils.getRandomInt(11, 79);
                        n2 = this.utils.getRandomInt(11, 79);
                    } while (!this.utils.needsRegrouping(n1, n2));
                    return { nums: [n1, n2], diff: 6 };
                }
            ];
        } else { // mahir
            cases = [
                () => { // Case 7: 3D + 2D, With Regrouping
                    let n1, n2;
                    do {
                        n1 = this.utils.getRandomInt(100, 900);
                        n2 = this.utils.getRandomInt(11, 99);
                    } while (!this.utils.needsRegrouping(n1, n2));
                    return { nums: [n1, n2], diff: 7 };
                },
                () => { // Case 8: 3D + 3D, Standard Regrouping
                    let n1, n2;
                    do {
                        n1 = this.utils.getRandomInt(100, 500);
                        n2 = this.utils.getRandomInt(100, 400);
                    } while (!this.utils.needsRegrouping(n1, n2));
                    return { nums: [n1, n2], diff: 8 };
                },
                () => { // Case 9: 3D + 3D, Double Regrouping / Overflow
                    return { nums: [this.utils.getRandomInt(500, 999), this.utils.getRandomInt(500, 999)], diff: 9 };
                }
            ];
        }

        const res = cases[Math.floor(Math.random() * cases.length)]();
        const sum = res.nums.reduce((a, b) => a + b, 0);
        const needsRegrouping = res.nums.length === 2 && this.utils.needsRegrouping(res.nums[0], res.nums[1]);

        // Horizontal Rule: If any adder (except possibly the first) is 1-digit
        let isHorizontal = false;
        if (res.nums.length > 2) {
            isHorizontal = res.nums.every(n => n < 10); // Multiple 1D
        } else {
            isHorizontal = res.nums[1] < 10; // n2 is 1-digit
        }

        if (isHorizontal) {
            return {
                ...this.formatHorizontalAddition(res.nums, sum),
                difficulty: res.diff,
                operands: res.nums,
                needsRegrouping: needsRegrouping
            };
        } else {
            return {
                ...this.formatVerticalAddition(res.nums, sum),
                difficulty: res.diff,
                operands: res.nums,
                needsRegrouping: needsRegrouping
            };
        }
    },

    generateSubtraction: function (level) {
        let cases = [];

        if (level === 'dasar') {
            cases = [
                () => { // Case 1: 1D - 1D (Result 1-8)
                    let res = this.utils.getRandomInt(1, 8);
                    let n2 = this.utils.getRandomInt(1, 9 - res);
                    return { n1: res + n2, n2: n2, diff: 1 };
                },
                () => { // Case 2: 2D - 1D (Result 1-9)
                    let res = this.utils.getRandomInt(1, 9);
                    let n1 = this.utils.getRandomInt(10, 18);
                    let n2 = n1 - res;
                    // Ensure n2 is 1-digit
                    if (n2 > 9) {
                        n2 = 9; n1 = res + n2;
                    }
                    return { n1, n2, diff: 2 };
                },
                () => { // Case 3: 2D - 2D (Result 1-9)
                    let res = this.utils.getRandomInt(1, 9);
                    let n1 = this.utils.getRandomInt(11, 19);
                    let n2 = n1 - res;
                    // Ensure n2 is 2-digit
                    if (n2 < 10) {
                        n2 = 10; n1 = res + n2;
                    }
                    return { n1, n2, diff: 3 };
                }
            ];
        } else if (level === 'menengah') {
            cases = [
                () => { // Case 4: 2D - 1D, With Borrowing
                    let n1, n2;
                    do {
                        n1 = this.utils.getRandomInt(21, 89);
                        n2 = this.utils.getRandomInt(1, 9);
                    } while (!this.utils.needsBorrowing(n1, n2) || n1 - n2 < 10);
                    return { n1, n2, diff: 4 };
                },
                () => { // Case 5: 2D - 2D, No Borrowing
                    let n1, n2;
                    do {
                        n1 = this.utils.getRandomInt(20, 99);
                        n2 = this.utils.getRandomInt(11, n1 - 1);
                    } while (this.utils.needsBorrowing(n1, n2));
                    return { n1, n2, diff: 5 };
                },
                () => { // Case 6: 2D - 2D, With Borrowing
                    let n1, n2;
                    do {
                        n1 = this.utils.getRandomInt(31, 99);
                        n2 = this.utils.getRandomInt(12, n1 - 1);
                    } while (!this.utils.needsBorrowing(n1, n2));
                    return { n1, n2, diff: 6 };
                }
            ];
        } else { // mahir
            cases = [
                () => { // Case 7: 3D - 2D, Standard Borrowing
                    let n1, n2;
                    do {
                        n1 = this.utils.getRandomInt(121, 999);
                        n2 = this.utils.getRandomInt(25, 99);
                    } while (!this.utils.needsBorrowing(n1, n2));
                    return { n1, n2, diff: 7 };
                },
                () => { // Case 8: 3D - 3D, Double Borrowing
                    let n1, n2;
                    do {
                        n1 = this.utils.getRandomInt(321, 999);
                        n2 = this.utils.getRandomInt(125, n1 - 10);
                    } while (!this.utils.needsBorrowing(n1, n2));
                    return { n1, n2, diff: 8 };
                },
                () => { // Case 9: Subtraction across Zero
                    let n1 = [100, 200, 300, 400, 500, 600, 700, 800, 900, 107][this.utils.getRandomInt(0, 9)];
                    if (n1 === 107) n1 = this.utils.getRandomInt(1, 9) * 100 + this.utils.getRandomInt(1, 9);
                    let n2 = this.utils.getRandomInt(11, n1 - 1);
                    return { n1, n2, diff: 9 };
                }
            ];
        }

        const res = cases[Math.floor(Math.random() * cases.length)]();
        const answer = res.n1 - res.n2;
        const needsBorrowing = this.utils.needsBorrowing(res.n1, res.n2);

        if (level === 'dasar') {
            return {
                ...this.formatHorizontalSubtraction(res.n1, res.n2, answer),
                difficulty: res.diff,
                operands: [res.n1, res.n2],
                needsBorrowing: needsBorrowing
            };
        } else {
            return {
                ...this.formatVertical(res.n1, res.n2, '-', answer),
                difficulty: res.diff,
                operands: [res.n1, res.n2],
                needsBorrowing: needsBorrowing
            };
        }
    },

    generateMultiplication: function (level) {
        let cases = [];
        if (level === 'dasar') {
            cases = [
                () => ({ n1: this.utils.getRandomInt(2, 5), n2: this.utils.getRandomInt(2, 9), diff: 1 }),
                () => ({ n1: this.utils.getRandomInt(6, 9), n2: this.utils.getRandomInt(6, 9), diff: 2 }),
                () => ({ n1: this.utils.getRandomInt(2, 9), n2: this.utils.getRandomInt(1, 9) * 10, diff: 3 })
            ];
        } else if (level === 'menengah') {
            cases = [
                () => ({ n1: this.utils.getRandomInt(11, 33), n2: this.utils.getRandomInt(2, 3), diff: 4 }),
                () => ({ n1: this.utils.getRandomInt(14, 29), n2: this.utils.getRandomInt(4, 7), diff: 5 }),
                () => ({ n1: this.utils.getRandomInt(11, 14), n2: this.utils.getRandomInt(11, 13), diff: 6 })
            ];
        } else {
            cases = [
                () => ({ n1: this.utils.getRandomInt(24, 89), n2: this.utils.getRandomInt(12, 45), diff: 7 }),
                () => ({ n1: this.utils.getRandomInt(111, 444), n2: this.utils.getRandomInt(3, 9), diff: 8 }),
                () => ({ n1: this.utils.getRandomInt(111, 333), n2: this.utils.getRandomInt(11, 25), diff: 9 })
            ];
        }

        const res = cases[Math.floor(Math.random() * cases.length)]();
        const answer = res.n1 * res.n2;
        const needsCarrying = this.utils.needsMultiCarrying(res.n1, res.n2);

        if (level === 'dasar') {
            return {
                ...this.formatHorizontalMultiplication(res.n1, res.n2, answer),
                difficulty: res.diff,
                operands: [res.n1, res.n2],
                needsCarrying: needsCarrying
            };
        } else {
            return {
                ...this.formatVertical(res.n1, res.n2, '×', answer),
                difficulty: res.diff,
                operands: [res.n1, res.n2],
                needsCarrying: needsCarrying
            };
        }
    },

    generateDivision: function (level) {
        let cases = [];
        if (level === 'dasar') {
            cases = [
                () => { let q = this.utils.getRandomInt(2, 9), d = this.utils.getRandomInt(2, 9); return [q * d, d, q, 1]; },
                () => { let q = this.utils.getRandomInt(11, 19), d = this.utils.getRandomInt(2, 5); return [q * d, d, q, 2]; },
                () => { let q = this.utils.getRandomInt(2, 9), d = this.utils.getRandomInt(10, 11); return [q * d, d, q, 3]; }
            ];
        } else if (level === 'menengah') {
            cases = [
                () => { let q = this.utils.getRandomInt(20, 50), d = this.utils.getRandomInt(6, 9); return [q * d, d, q, 4]; },
                () => { let q = this.utils.getRandomInt(100, 450), d = this.utils.getRandomInt(2, 2); return [q * d, d, q, 5]; },
                () => { let q = this.utils.getRandomInt(50, 99), d = this.utils.getRandomInt(3, 5); return [q * d, d, q, 6]; }
            ];
        } else {
            cases = [
                () => { let q = this.utils.getRandomInt(25, 150), d = this.utils.getRandomInt(3, 8); return [q * d, d, q, 7]; },
                () => { let q = this.utils.getRandomInt(11, 45), d = this.utils.getRandomInt(11, 22); return [q * d, d, q, 8]; },
                () => { let q = this.utils.getRandomInt(5, 25), d = this.utils.getRandomInt(25, 45); return [q * d, d, q, 9]; }
            ];
        }

        const [dividend, divisor, quotient, diff] = cases[Math.floor(Math.random() * cases.length)]();
        const isComplex = this.utils.isComplexDivision(dividend, divisor);
        let res;
        if (level === 'dasar' || level === 'menengah') {
            res = this.formatHorizontalDivision(dividend, divisor, quotient);
        } else {
            res = this.formatDivision(dividend, divisor, quotient);
        }
        return { ...res, difficulty: diff, operands: [dividend, divisor], isComplex: isComplex };
    },

    formatHorizontalAddition: function (nums, answer) {
        return {
            questionHTML: `
                <div class="horizontal-math" style="font-size: 1.5rem; font-family: var(--font-mono);">
                    ${nums.join(' + ')} = ...
                </div>
            `,
            answerHTML: `<span class="answer-text">${answer}</span>`
        };
    },

    formatHorizontalSubtraction: function (n1, n2, answer) {
        return {
            questionHTML: `
                <div class="horizontal-math" style="font-size: 1.5rem; font-family: var(--font-mono);">
                    ${n1} - ${n2} = ...
                </div>
            `,
            answerHTML: `<span class="answer-text">${answer}</span>`
        };
    },

    formatHorizontalMultiplication: function (n1, n2, answer) {
        return {
            questionHTML: `
                <div class="horizontal-math" style="font-size: 1.5rem; font-family: var(--font-mono);">
                    ${n1} &times; ${n2} = ...
                </div>
            `,
            answerHTML: `<span class="answer-text">${answer}</span>`
        };
    },

    formatHorizontalDivision: function (n1, n2, answer) {
        return {
            questionHTML: `
                <div class="horizontal-math" style="font-size: 1.5rem; font-family: var(--font-mono);">
                    ${n1} &divide; ${n2} = ...
                </div>
            `,
            answerHTML: `<span class="answer-text">${answer}</span>`
        };
    },

    formatVerticalAddition: function (nums, answer) {
        if (nums.length === 2) {
            return this.formatVertical(nums[0], nums[1], '+', answer);
        }
        return this.formatVerticalMultiple(nums, '+', answer);
    },

    formatVertical: function (top, bottom, op, answer) {
        return {
            questionHTML: `
                <div class="vertical-math">
                    <div class="row number">${top}</div>
                    <div class="row number">
                        ${bottom}
                        <span class="operator">${op}</span>    
                    </div>
                    <div class="row line"></div>
                </div>
            `,
            answerHTML: `<span class="answer-text">${answer}</span>`
        };
    },

    formatVerticalMultiple: function (numbers, op, answer) {
        let rows = numbers.map((n, i) => {
            if (i === numbers.length - 1) {
                return `<div class="row number">${n}<span class="operator">${op}</span></div>`;
            }
            return `<div class="row number">${n}</div>`;
        }).join('');

        return {
            questionHTML: `
                <div class="vertical-math">
                    ${rows}
                    <div class="row line"></div>
                </div>
            `,
            answerHTML: `<span class="answer-text">${answer}</span>`
        };
    },

    formatDivision: function (dividend, divisor, quotient) {
        return {
            questionHTML: `
                <div class="long-division">
                    <span class="divisor">${divisor}</span>
                    <span class="dividend">${dividend}</span>
                </div>
            `,
            answerHTML: `<span class="answer-text">${quotient}</span>`
        };
    }
};
