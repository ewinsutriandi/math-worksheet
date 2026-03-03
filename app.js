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
        window.addEventListener('resize', () => this.handleResize());
    },

    toggleSidebar: function () {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('open');
    },

    handleResize: function () {
        const page = document.querySelector('.worksheet-page');
        const container = document.querySelector('.preview-area');
        if (!page || !container) return;

        if (window.innerWidth <= 768) {
            const containerWidth = container.offsetWidth - 32; // 1rem padding
            const pageWidth = 210; // mm
            // Convert mm to px roughly (3.78 px per mm)
            const pageWidthPx = pageWidth * 3.78;
            const scale = containerWidth / pageWidthPx;

            if (scale < 1) {
                page.style.transformOrigin = 'top center';
                page.style.transform = `scale(${scale})`;
                // Maintain container height since scale doesn't affect flow
                container.style.height = `${page.offsetHeight * scale + 40}px`;
            } else {
                page.style.transformOrigin = 'top center';
                page.style.transform = 'none';
                container.style.height = 'auto';
            }
        } else {
            page.style.transformOrigin = 'top center';
            page.style.transform = 'none';
            container.style.height = 'auto';
        }
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
        document.querySelector('.sidebar').classList.remove('open');
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
            'frac-visual': 'Visualisasi',
            'frac-equivalent': 'Pecahan Senilai',
            'frac-compare': 'Membandingkan',
            'frac-addsub': 'Tambah & Kurang',
            'frac-muldiv': 'Kali & Bagi',
            'frac-simplest': 'Penyederhanaan'
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
        else if (currentSub.startsWith('frac-visual')) subName = 'Visualisasi';
        else if (currentSub.startsWith('frac-equivalent')) subName = 'Pecahan Senilai';
        else if (currentSub.startsWith('frac-compare')) subName = 'Membandingkan';
        else if (currentSub.startsWith('frac-addsub')) subName = 'Tambah & Kurang';
        else if (currentSub.startsWith('frac-muldiv')) subName = 'Kali & Bagi';
        else if (currentSub.startsWith('frac-simplest')) subName = 'Penyederhanaan';

        const breadcrumbTitle = subName ? `${topicName} - ${subName}` : topicName;

        document.getElementById('current-topic-title').textContent = breadcrumbTitle;
        document.getElementById('worksheet-title').textContent = "Lembar Kerja Matematika";
        document.getElementById('worksheet-subtitle').textContent = breadcrumbTitle;

        // Populate Subtopic Chips
        const chipsContainer = document.getElementById('subtopic-chips');
        chipsContainer.innerHTML = '';

        let subtopics = [];
        if (this.state.currentTopic === 'fraction') {
            const sub = this.state.currentSubtopic || '';
            const prefix = sub.split('-').slice(0, 2).join('-'); // e.g., 'frac-visual'

            if (prefix === 'frac-visual' || prefix === 'frac-compare' || prefix === 'frac-addsub' || prefix === 'frac-muldiv') {
                if (prefix === 'frac-addsub') {
                    subtopics = [
                        { value: `${prefix}-visual`, label: 'Visual' },
                        { value: `${prefix}-sederhana`, label: 'Sederhana' },
                        { value: `${prefix}-kompleks`, label: 'Kompleks' }
                    ];
                } else if (prefix === 'frac-muldiv') {
                    subtopics = [
                        { value: `${prefix}-perkalian`, label: 'Perkalian' },
                        { value: `${prefix}-pembagian`, label: 'Pembagian' }
                    ];
                } else {
                    subtopics = [
                        { value: `${prefix}-sederhana`, label: 'Sederhana' },
                        { value: `${prefix}-kompleks`, label: 'Kompleks' }
                    ];
                }
            } else {
                // Both Senilai and Sederhana now use Dasar/Mahir
                subtopics = [
                    { value: `${prefix}-dasar`, label: 'Dasar' },
                    { value: `${prefix}-mahir`, label: 'Mahir' }
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

        // Update subtitles with the full topic - level breadcrumb if needed, 
        // but user specifically asked for "Topic - subtopic" for line 2.
        // Let's refine breadcrumbTitle creation to be available here or recalculate.
        const titleMap = { 'fraction': 'Pecahan', 'arithmetic': 'Aritmatika' };
        const subtopicNameMap = {
            'addition': 'Penjumlahan', 'subtraction': 'Pengurangan', 'multiplication': 'Perkalian', 'division': 'Pembagian',
            'frac-visual': 'Visualisasi', 'frac-equivalent': 'Pecahan Senilai', 'frac-compare': 'Membandingkan', 'frac-simplest': 'Penyederhanaan'
        };
        const topicName = titleMap[this.state.currentTopic] || this.state.currentTopic;
        const currentSub = this.state.currentSubtopic || '';
        let subName = '';
        if (subtopicNameMap[currentSub]) subName = subtopicNameMap[currentSub];
        else if (currentSub.includes('add')) subName = 'Penjumlahan';
        else if (currentSub.includes('sub')) subName = 'Pengurangan';
        else if (currentSub.includes('mul')) subName = 'Perkalian';
        else if (currentSub.includes('div')) subName = 'Pembagian';
        else if (currentSub.includes('visual')) subName = 'Visualisasi';
        else if (currentSub.includes('equivalent')) subName = 'Pecahan Senilai';
        else if (currentSub.includes('compare')) subName = 'Membandingkan';
        else if (currentSub.includes('simplest')) subName = 'Penyederhanaan';

        const breadcrumb = subName ? `${topicName} - ${subName}` : topicName;
        const activeSubtopicChip = document.querySelector('#subtopic-chips .chip.active');
        const levelLabel = activeSubtopicChip ? activeSubtopicChip.textContent : '';

        document.getElementById('worksheet-subtitle').textContent = `${breadcrumb} (${levelLabel})`;
        document.getElementById('answer-key-subtitle').textContent = `${breadcrumb} (${levelLabel})`;

        this.regenerate();
    },

    regenerate: function () {
        const container = document.getElementById('problems-container');
        const answersContainer = document.getElementById('answers-container');
        const answerKeyPage = document.getElementById('answer-key-page');

        container.innerHTML = '';
        answersContainer.innerHTML = '';

        if (this.state.currentSubtopic && this.state.currentSubtopic === 'frac-addsub-visual') {
            container.classList.add('one-column');
        } else {
            container.classList.remove('one-column');
        }

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
                <span class="answer-number">${index + 1}.</span>
                <span class="answer-content">${problem.answerHTML}</span>
            `;
            answersContainer.appendChild(answerDiv);
        });

        // Toggle Answer Key Page
        if (this.state.config.includeAnswerKey) {
            answerKeyPage.style.display = 'block';
        } else {
            answerKeyPage.style.display = 'none';
        }

        // Apply scale for mobile
        setTimeout(() => this.handleResize(), 50);
    }
};

// Initialize on load
window.onload = function () {
    app.init();
};
