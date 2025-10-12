const canvases = [];
for (let i = 1; i <= 8; i++) {
    canvases.push(document.getElementById(`canvas${i}`));
}

function generateUniqueFractions(count) {
    const fractions = new Set();
    while (fractions.size < count) {
        const numSlices = Math.floor(Math.random() * 11) + 2; // 2 to 12
        const filledSlices = Math.floor(Math.random() * (numSlices - 1)) + 1;
        const fraction = `${filledSlices}/${numSlices}`;
        fractions.add(fraction);
    }
    return Array.from(fractions).map(f => {
        const [num, den] = f.split('/').map(Number);
        return { numSlices: den, filledSlices: num };
    });
}

function drawFraction(canvas, numSlices, filledSlices) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 120, 120);

    const centerX = 60;
    const centerY = 60;
    const radius = 50;
    const anglePerSlice = (2 * Math.PI) / numSlices;

    for (let i = 0; i < numSlices; i++) {
        const startAngle = i * anglePerSlice;
        const endAngle = (i + 1) * anglePerSlice;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        if (i < filledSlices) {
            ctx.fillStyle = '#4CAF50';
            ctx.fill();
        }

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawAll() {
    const fractions = generateUniqueFractions(8);
    canvases.forEach((canvas, index) => {
        const { numSlices, filledSlices } = fractions[index];
        drawFraction(canvas, numSlices, filledSlices);
    });
}

window.addEventListener('load', drawAll);

document.getElementById('regenerate').addEventListener('click', drawAll);

document.getElementById('print').addEventListener('click', () => {
    window.print();
});