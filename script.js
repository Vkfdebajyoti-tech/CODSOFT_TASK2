let defaultQuizzes = [
    {
        title: "Web Development Master Quiz (20 Questions)",
        questions: [
            { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Markup Language", "Hyper Tabular Markup Language", "None"], correct: 0 },
            { question: "Which CSS property changes text color?", options: ["text-color", "color", "fgcolor", "font-color"], correct: 1 },
            { question: "Inside which HTML element do we put JavaScript?", options: ["<script>", "<js>", "<javascript>", "<scripting>"], correct: 0 },
            { question: "Which HTML tag is used for the largest heading?", options: ["<h6>", "<head>", "<h1>", "<heading>"], correct: 2 },
            { question: "How do you add a background color in CSS?", options: ["color: red", "background-color: red", "bg: red", "background: color red"], correct: 1 },
            { question: "How do you write 'Hello World' in an alert box?", options: ["msg('Hello World')", "alertBox('Hello World')", "alert('Hello World')", "msgBox('Hello World')"], correct: 2 },
            { question: "Which HTML attribute specifies an alternate text for an image?", options: ["src", "alt", "title", "longdesc"], correct: 1 },
            { question: "How do you create a function in JavaScript?", options: ["function myFunction()", "function:myFunction()", "function = myFunction()", "create myFunction()"], correct: 0 },
            { question: "Which character is used to indicate an end tag in HTML?", options: ["*", "^", "<", "/"], correct: 3 },
            { question: "How do you call a function named 'myFunction'?", options: ["call myFunction()", "myFunction()", "call function myFunction()", "Execute myFunction()"], correct: 1 },
            { question: "Which property is used to change font size in CSS?", options: ["font-style", "text-size", "font-size", "size"], correct: 2 },
            { question: "How to write an IF statement in JavaScript?", options: ["if i = 5 then", "if i = 5", "if (i == 5)", "if i == 5 then"], correct: 2 },
            { question: "Which HTML tag is used to define an unordered list?", options: ["<ul>", "<ol>", "<li>", "<list>"], correct: 0 },
            { question: "How do you select an element with id 'demo' in CSS?", options: [".demo", "#demo", "*demo", "demo"], correct: 1 },
            { question: "How does a FOR loop start in JavaScript?", options: ["for (i = 0; i <= 5; i++)", "for (i = 0; i <= 5)", "for i = 1 to 5", "for (i <= 5; i++)"], correct: 0 },
            { question: "Which HTML tag is used to make text bold?", options: ["<bold>", "<b>", "<important>", "<bb>"], correct: 1 },
            { question: "How do you add comments in CSS?", options: ["// this is a comment", "/* this is a comment */", "' this is a comment", "<!-- comment -->"], correct: 1 },
            { question: "Which operator is used to assign a value to a variable?", options: ["*", "-", "=", "x"], correct: 2 },
            { question: "Which HTML element is used to specify a footer for a document?", options: ["<bottom>", "<section>", "<footer>", "<foot>"], correct: 2 },
            { question: "Is JavaScript same as Java?", options: ["Yes", "No", "It is a version of Java", "None of these"], correct: 1 }
        ]
    }
];

let quizzes = JSON.parse(localStorage.getItem('quiz_app_data_v2')) || defaultQuizzes;
let users = JSON.parse(localStorage.getItem('quiz_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('current_quiz_user')) || null;

let currentQuizIndex = 0;
let currentQ = 0;
let score = 0;
let isRegisterMode = false;

function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    document.getElementById('auth-title').innerText = isRegisterMode ? "Register New Account" : "Login to Continue";
    document.getElementById('auth-btn').innerText = isRegisterMode ? "Register" : "Login";
    document.getElementById('auth-toggle-msg').innerText = isRegisterMode ? "Already have an account?" : "Don't have an account?";
}

function handleAuth(e) {
    e.preventDefault();
    let un = document.getElementById('username').value.trim();
    let pw = document.getElementById('password').value.trim();

    if (isRegisterMode) {
        if (users.find(u => u.username === un)) {
            alert("Username already exists!");
            return;
        }
        users.push({ username: un, password: pw });
        localStorage.setItem('quiz_users', JSON.stringify(users));
        alert("Registration Successful! Please login.");
        toggleAuthMode();
    } else {
        let found = users.find(u => u.username === un && u.password === pw);
        if (found || (un === "admin" && pw === "1234")) {
            currentUser = un;
            localStorage.setItem('current_quiz_user', JSON.stringify(currentUser));
            initApp();
        } else {
            alert("Invalid Credentials! (Try admin / 1234)");
        }
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('current_quiz_user');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
}

function initApp() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    document.getElementById('user-display').innerText = currentUser;
    renderQuizList();
}

function showSection(sectionId) {
    document.querySelectorAll('.sub-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

function renderQuizList() {
    let listDiv = document.getElementById('quiz-list');
    listDiv.innerHTML = '';
    
    quizzes.forEach((quiz, index) => {
        let card = document.createElement('div');
        card.className = 'quiz-card';
        card.innerHTML = `
            <div>
                <h4>${quiz.title}</h4>
                <small>${quiz.questions.length} Question(s)</small>
            </div>
            <button onclick="startQuiz(${index})">Start</button>
        `;
        listDiv.appendChild(card);
    });
}

function startQuiz(index) {
    currentQuizIndex = index;
    currentQ = 0;
    score = 0;
    document.getElementById('current-quiz-title').innerText = quizzes[index].title;
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('result-container').classList.add('hidden');
    showSection('take-quiz');
    loadQuestion();
}

function loadQuestion() {
    let activeQuiz = quizzes[currentQuizIndex];
    if (currentQ >= activeQuiz.questions.length) {
        document.getElementById('quiz-container').classList.add('hidden');
        document.getElementById('result-container').classList.remove('hidden');
        document.getElementById('score-text').innerText = `You scored ${score} out of ${activeQuiz.questions.length}`;
        
        let reviewDiv = document.getElementById('review-container');
        reviewDiv.innerHTML = '<b>Correct Answers:</b><br>';
        activeQuiz.questions.forEach((q, idx) => {
            reviewDiv.innerHTML += `<div class="review-item">${idx + 1}. ${q.question} <br><i style="color:green">Ans: ${q.options[q.correct]}</i></div>`;
        });
        return;
    }

    let q = activeQuiz.questions[currentQ];
    document.getElementById('question-text').innerText = `${currentQ + 1}. ${q.question}`;
    let optsDiv = document.getElementById('options-container');
    optsDiv.innerHTML = '';

    q.options.forEach((opt, idx) => {
        let btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => {
            if (idx === q.correct) score++;
            currentQ++;
            loadQuestion();
        };
        optsDiv.appendChild(btn);
    });
}

function addCustomQuestion(e) {
    e.preventDefault();
    let category = document.getElementById('quiz-category').value.trim();
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

    let existingQuiz = quizzes.find(q => q.title.toLowerCase() === category.toLowerCase());
    if (existingQuiz) {
        existingQuiz.questions.push(newQ);
    } else {
        quizzes.push({ title: category, questions: [newQ] });
    }

    localStorage.setItem('quiz_app_data_v2', JSON.stringify(quizzes));
    document.getElementById('msg').innerText = "Question Added Successfully!";
    document.getElementById('quiz-form').reset();
    renderQuizList();
}

if (currentUser) {
    initApp();
}
