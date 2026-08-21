let defaultQuestions = [
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Text Markup Language", "Hyper Tabular Markup Language", "None of these"],
        correct: 0
    },
    {
        question: "Which language is used for web styling?",
        options: ["HTML", "CSS", "Python", "Java"],
        correct: 1
    }
];

let questions = JSON.parse(localStorage.getItem('quiz_questions')) || defaultQuestions;
let currentQ = 0;
let score = 0;

function showSection(sectionId) {
    document.getElementById('take-quiz').classList.add('hidden');
    document.getElementById('create-quiz').classList.add('hidden');
    document.getElementById(sectionId).classList.remove('hidden');
}

function loadQuestion() {
    if (currentQ >= questions.length) {
        document.getElementById('quiz-container').classList.add('hidden');
        document.getElementById('result-container').classList.remove('hidden');
        document.getElementById('score-text').innerText = `You scored ${score} out of ${questions.length}`;
        return;
    }

    let q = questions[currentQ];
    document.getElementById('question-text').innerText = `${currentQ + 1}. ${q.question}`;
    let optsDiv = document.getElementById('options-container');
    optsDiv.innerHTML = '';

    q.options.forEach((opt, idx) => {
        let btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => selectOption(idx);
        optsDiv.appendChild(btn);
    });
}

function selectOption(idx) {
    if (idx === questions[currentQ].correct) {
        score++;
    }
    currentQ++;
    loadQuestion();
}

function restartQuiz() {
    currentQ = 0;
    score = 0;
    document.getElementById('result-container').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    loadQuestion();
}

function addCustomQuestion(e) {
    e.preventDefault();
    let newQ = {
        question: document.getElementById('new-q').value,
        options: [
            document.getElementById('opt1').value,
            document.getElementById('opt2').value,
            document.getElementById('opt3').value,
            document.getElementById('opt4').value
        ],
        correct: parseInt(document.getElementById('correct-opt').value)
    };

    questions.push(newQ);
    localStorage.setItem('quiz_questions', JSON.stringify(questions));
    document.getElementById('msg').innerText = "Question Added Successfully!";
    document.getElementById('quiz-form').reset();
}

loadQuestion();
