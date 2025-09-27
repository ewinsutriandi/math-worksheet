function generateProblems() {
    const worksheet = document.getElementById('worksheet');
    worksheet.innerHTML = ''; // Clear existing problems

    for (let i = 0; i < 27; i++) {
        let num1 = Math.floor(Math.random() * 90) + 10; // 10-99
        let num2 = Math.floor(Math.random() * 90) + 10; // 10-99

        // Ensure num1 >= num2 and result is not 0
        if (num1 < num2) {
            [num1, num2] = [num2, num1]; // Swap to ensure num1 >= num2
        }
        if (num1 === num2) {
            num2 -= 1; // Prevent zero result
        }

        const problemDiv = document.createElement('div');
        problemDiv.className = 'problem';

        const p1 = document.createElement('p');
        p1.textContent = num1;
        problemDiv.appendChild(p1);

        const p2 = document.createElement('p');
        p2.textContent = num2;
        problemDiv.appendChild(p2);

        const operationLineDiv = document.createElement('div');
        operationLineDiv.className = 'operation-line';

        const operationDiv = document.createElement('div');
        operationDiv.className = 'operation';
        operationDiv.textContent = '-';
        operationLineDiv.appendChild(operationDiv);

        const hr = document.createElement('hr');
        hr.className = 'line';
        operationLineDiv.appendChild(hr);

        problemDiv.appendChild(operationLineDiv);

        const sumP = document.createElement('p');
        sumP.className = 'sum';
        sumP.textContent = ' '; // Empty space for answer
        problemDiv.appendChild(sumP);

        worksheet.appendChild(problemDiv);
    }
}

function printWorksheet() {
    window.print();
}