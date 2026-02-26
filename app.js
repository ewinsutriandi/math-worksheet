const app = {
    state: {
        currentTopic: null,
        currentSubtopic: null,
        config: {
            questionCount: 20,
            includeAnswerKey: false
        }
    },

    init: function () {
        console.log("Math Worksheet Generator Initialized");
        // Attach event listeners if needed
    },

    selectTopic: function (topic, subtopic) {
        this.state.currentTopic = topic;
        this.state.currentSubtopic = subtopic;
        this.updateUIForTopic();
        this.navigateToGenerator();
    },

    navigateToGenerator: function () {
        document.getElementById('dashboard-view').classList.remove('active');
        document.getElementById('generator-view').classList.add('active');
        this.regenerate(); // Initial generation
    },

    navigateToDashboard: function () {
        document.getElementById('generator-view').classList.remove('active');
        document.getElementById('dashboard-view').classList.add('active');
        this.state.currentTopic = null;
    },

    updateUIForTopic: function () {
        const titleMap = {
            'fraction': 'Pecahan',
            'arithmetic': 'Aritmatika'
        };
        const subtopicNameMap = {
            'addition': 'Penjumlahan',
            'subtraction': 'Pengurangan',
            'multiplication': 'Perkalian',
            'division': 'Pembagian',
            'fundamental': 'Pecahan Dasar'
        };

        const topicName = titleMap[this.state.currentTopic] || this.state.currentTopic;

        let subName = '';
        const currentSub = this.state.currentSubtopic || '';
        if (subtopicNameMap[currentSub]) {
            subName = subtopicNameMap[currentSub];
        } else if (currentSub.startsWith('add-')) subName = 'Penjumlahan';
        else if (currentSub.startsWith('sub-')) subName = 'Pengurangan';
        else if (currentSub.startsWith('mul-')) subName = 'Perkalian';
        else if (currentSub.startsWith('div-')) subName = 'Pembagian';
        else if (currentSub.startsWith('visual') || currentSub === 'equivalent' || currentSub === 'simplest') subName = 'Pecahan Dasar';

        const breadcrumbTitle = subName ? `${topicName} - ${subName}` : topicName;

        document.getElementById('current-topic-title').textContent = breadcrumbTitle;
        document.getElementById('worksheet-title').textContent = `Lembar Kerja ${breadcrumbTitle}`;

        // Populate Subtopic Chips
        const chipsContainer = document.getElementById('subtopic-chips');
        chipsContainer.innerHTML = '';

        let subtopics = [];
        if (this.state.currentTopic === 'fraction') {
            if (this.state.currentSubtopic === 'fundamental' || this.state.currentSubtopic.startsWith('visual')) {
                subtopics = [
                    { value: 'visual', label: 'Mengenal Pecahan' },
                    { value: 'equivalent', label: 'Pecahan Senilai' },
                    { value: 'simplest', label: 'Menyederhanakan' }
                ];
            }
        } else if (this.state.currentTopic === 'arithmetic') {
            const sub = this.state.currentSubtopic;
            if (sub === 'addition' || sub.startsWith('add-')) {
                subtopics = [
                    { value: 'add-dasar', label: 'Dasar' },
                    { value: 'add-menengah', label: 'Menengah' },
                    { value: 'add-mahir', label: 'Mahir' }
                ];
            } else if (sub === 'subtraction' || sub.startsWith('sub-')) {
                subtopics = [
                    { value: 'sub-dasar', label: 'Dasar' },
                    { value: 'sub-menengah', label: 'Menengah' },
                    { value: 'sub-mahir', label: 'Mahir' }
                ];
            } else if (sub === 'multiplication' || sub.startsWith('mul-')) {
                subtopics = [
                    { value: 'mul-dasar', label: 'Dasar' },
                    { value: 'mul-menengah', label: 'Menengah' },
                    { value: 'mul-mahir', label: 'Mahir' }
                ];
            } else if (sub === 'division' || sub.startsWith('div-')) {
                subtopics = [
                    { value: 'div-dasar', label: 'Dasar' },
                    { value: 'div-menengah', label: 'Menengah' },
                    { value: 'div-mahir', label: 'Mahir' }
                ];
            }
        }

        subtopics.forEach((opt, index) => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            if (index === 0) {
                chip.classList.add('active');
                this.state.currentSubtopic = opt.value;
            }
            chip.textContent = opt.label;
            chip.onclick = () => {
                chipsContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.state.currentSubtopic = opt.value;
                this.updateConfig();
            };
            chipsContainer.appendChild(chip);
        });

        // Populate Question Count Chips
        const countChipsContainer = document.getElementById('question-count-chips');
        countChipsContainer.innerHTML = '';
        const counts = [10, 15, 20, 25, 30];
        counts.forEach(c => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            if (c === this.state.config.questionCount) chip.classList.add('active');
            chip.textContent = c;
            chip.onclick = () => {
                countChipsContainer.querySelectorAll('.chip').forEach(ch => ch.classList.remove('active'));
                chip.classList.add('active');
                this.state.config.questionCount = c;
                this.updateConfig();
            };
            countChipsContainer.appendChild(chip);
        });

        this.updateConfig();
    },

    updateConfig: function () {
        this.state.config.includeAnswerKey = document.getElementById('include-answer-key').checked;

        // Find active subtopic chip label
        const activeSubtopicChip = document.querySelector('#subtopic-chips .chip.active');
        const subtitle = activeSubtopicChip ? activeSubtopicChip.textContent : '';

        document.getElementById('worksheet-subtitle').textContent = subtitle;
        document.getElementById('answer-key-subtitle').textContent = subtitle;

        this.regenerate();
    },

    regenerate: function () {
        const container = document.getElementById('problems-container');
        const answersContainer = document.getElementById('answers-container');
        const answerKeyPage = document.getElementById('answer-key-page');

        container.innerHTML = '';
        answersContainer.innerHTML = '';

        let problems = [];

        // Route to appropriate generator
        if (this.state.currentTopic === 'fraction') {
            if (typeof fractionGenerator !== 'undefined') {
                problems = fractionGenerator.generate(this.state.currentSubtopic, this.state.config.questionCount);
            } else {
                console.error("Fraction generator not loaded");
            }
        } else if (this.state.currentTopic === 'arithmetic') {
            // For arithmetic, the subtopic handling is slightly different because the buttons set the 'topic' as arithmetic and 'subtopic' as addition/subtraction initially
            // But we need to use the Select dropdown value for the actual generation logic (e.g. 3d3d vs 3d2d)
            // Wait, app.state.currentSubtopic gets overwritten by updateConfig()'s select value.
            // So we need to ensure the generator receives the specific sub-subtopic (e.g. '3d3d') from the dropdown.
            // The dropdown content is set in updateUIForTopic BEFORE updateConfig is called.

            if (typeof arithmeticGenerator !== 'undefined') {
                // Pass both the broad category (e.g. addition) and the specific level (e.g. 3d3d)
                // Actually my app logic in selectTopic sets currentSubtopic to 'addition'
                // Then updateUIForTopic populates dropdown with '3d3d', '3d2d'
                // Then updateConfig sets currentSubtopic to '3d3d' (the first option)
                // So state.currentSubtopic will be '3d3d' when regenerate is called.

                // We also need the operation type (add/sub/mul/div). 
                // Currently I don't store "addition" separately if currentSubtopic becomes '3d3d'.
                // I should probably infer the operation from the subtopic value or store operation separately.
                // Let's infer for simplicity: 3d3d/3d2d -> add/sub? Ambiguous. 
                // Better: The dropdown values should be unique or I should store the operation mode.
                // Let's make dropdown values like 'add-3d3d', 'sub-3d3d' or just store the operation.

                // Correction: In selectTopic, I set currentSubtopic. 
                // In updateConfig, I overwrite currentSubtopic with the dropdown value. 
                // This loses the parent category (addition/subtraction).
                // I will add a `currentMode` to state or just parse the value.

                problems = arithmeticGenerator.generate(this.state.currentSubtopic, this.state.config.questionCount);
            } else {
                console.error("Arithmetic generator not loaded");
            }
        }

        // Render Problems
        problems.forEach((problem, index) => {
            // Problem Card
            const problemDiv = document.createElement('div');
            problemDiv.className = 'problem-card';
            problemDiv.innerHTML = `
                <div class="problem-number">${index + 1}.</div>
                <div class="problem-content">${problem.questionHTML}</div>
            `;
            container.appendChild(problemDiv);

            // Answer Card
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-card';
            answerDiv.innerHTML = `
                <div class="answer-number">${index + 1}.</div>
                <div class="answer-content">${problem.answerHTML}</div>
            `;
            answersContainer.appendChild(answerDiv);
        });

        // Toggle Answer Key Page
        if (this.state.config.includeAnswerKey) {
            answerKeyPage.style.display = 'block'; // Or flex/grid depending on layout
        } else {
            answerKeyPage.style.display = 'none';
        }
    }
};

// Initialize on load
window.onload = function () {
    app.init();
};
