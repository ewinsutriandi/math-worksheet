const clocks = [
    { canvas: document.getElementById('clock1'), ctx: document.getElementById('clock1').getContext('2d'), time: getRandomTime() },
    { canvas: document.getElementById('clock2'), ctx: document.getElementById('clock2').getContext('2d'), time: getRandomTime() },
    { canvas: document.getElementById('clock3'), ctx: document.getElementById('clock3').getContext('2d'), time: getRandomTime() },
    { canvas: document.getElementById('clock4'), ctx: document.getElementById('clock4').getContext('2d'), time: getRandomTime() },
    { canvas: document.getElementById('clock5'), ctx: document.getElementById('clock5').getContext('2d'), time: getRandomTime() },
    { canvas: document.getElementById('clock6'), ctx: document.getElementById('clock6').getContext('2d'), time: getRandomTime() },
    { canvas: document.getElementById('clock7'), ctx: document.getElementById('clock7').getContext('2d'), time: getRandomTime() },
    { canvas: document.getElementById('clock8'), ctx: document.getElementById('clock8').getContext('2d'), time: getRandomTime() }
];

function getRandomTime() {
    const hours = Math.floor(Math.random() * 12);
    const minutes = Math.floor(Math.random() * 60);
    return { hours, minutes };
}

function drawClock(clock) {
    const { canvas, ctx, time } = clock;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw hour ticks
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * Math.PI / 180;
        const isMajor = i % 3 === 0;
        const tickLength = isMajor ? 12 : 8;
        const tickWidth = isMajor ? 3 : 2;
        const start = radius - tickLength;
        ctx.beginPath();
        ctx.moveTo(centerX + start * Math.sin(angle), centerY - start * Math.cos(angle));
        ctx.lineTo(centerX + radius * Math.sin(angle), centerY - radius * Math.cos(angle));
        ctx.strokeStyle = '#000';
        ctx.lineWidth = tickWidth;
        ctx.stroke();
    }

    // Draw minute marks
    for (let i = 0; i < 60; i++) {
        if (i % 5 === 0) continue;
        const angle = (i * 6) * Math.PI / 180;
        const tickLength = 5;
        const start = radius - tickLength;
        ctx.beginPath();
        ctx.moveTo(centerX + start * Math.sin(angle), centerY - start * Math.cos(angle));
        ctx.lineTo(centerX + radius * Math.sin(angle), centerY - radius * Math.cos(angle));
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    const { hours, minutes } = time;

    // Hour hand
    const hourAngle = ((hours + minutes / 60) * 30) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + (radius - 24) * Math.sin(hourAngle), centerY - (radius - 24) * Math.cos(hourAngle));
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Minute hand
    const minuteAngle = (minutes * 6) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + (radius - 12) * Math.sin(minuteAngle), centerY - (radius - 12) * Math.cos(minuteAngle));
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
}

function regenerateClocks() {
    clocks.forEach(clock => {
        clock.time = getRandomTime();
        drawClock(clock);
    });
}

clocks.forEach(drawClock);