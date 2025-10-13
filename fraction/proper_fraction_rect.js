const canvases = [];
for (let i = 1; i <= 8; i++) {
    canvases.push(document.getElementById(`canvas${i}`));
}

function generateUniqueFractions(count) {
    const fractions = new Set();
    const possibleRows = [2, 3, 4, 5];
    const possibleCols = [2, 3, 4, 5];
    const result = [];

    // Generate initial unique fractions
    while (fractions.size < count) {
        const rows = possibleRows[Math.floor(Math.random() * possibleRows.length)];
        const cols = possibleCols[Math.floor(Math.random() * possibleCols.length)];
        const total = rows * cols;
        const filled = Math.floor(Math.random() * (total - 1)) + 1; // Ensure proper fraction
        const fraction = `${filled}/${total}`;
        fractions.add(fraction);
    }

    // Map to final grid configurations, ensuring unique final fractions
    const finalFractions = new Set();
    for (const f of fractions) {
        let newRows, newCols, newTotal, newFilled;
        let fraction;
        let attempts = 0;
        const maxAttempts = 10; // Prevent infinite loops

        do {
            newRows = possibleRows[Math.floor(Math.random() * possibleRows.length)];
            newCols = possibleCols[Math.floor(Math.random() * possibleCols.length)];
            newTotal = newRows * newCols;
            newFilled = Math.floor(Math.random() * (newTotal - 1)) + 1; // Ensure proper fraction
            fraction = `${newFilled}/${newTotal}`;
            attempts++;
        } while (finalFractions.has(fraction) && attempts < maxAttempts);

        finalFractions.add(fraction);
        result.push({ rows: newRows, cols: newCols, filled: newFilled, total: newTotal });
    }

    return result;
}

function drawFraction(canvas, rows, cols, filled, total) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 120, 120);

    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;
    const offsetX = 10;
    const offsetY = 10;

    let filledCount = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            ctx.beginPath();
            ctx.rect(offsetX + j * cellWidth, offsetY + i * cellHeight, cellWidth, cellHeight);
            if (filledCount < filled) {
                ctx.fillStyle = '#4CAF50';
                ctx.fill();
                filledCount++;
            }
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

function drawAll() {
    const fractions = generateUniqueFractions(8);
    canvases.forEach((canvas, index) => {
        const { rows, cols, filled, total } = fractions[index];
        drawFraction(canvas, rows, cols, filled, total);
    });
}

window.addEventListener('load', drawAll);

document.getElementById('regenerate').addEventListener('click', drawAll);

document.getElementById('print').addEventListener('click', () => {
    window.print();
});