let questions = [];

const getRandomQuestions = (questions, count) => {
    return questions.sort(() => 0.5 - Math.random()).slice(0, count);
};

const getSequentialQuestions = (questions, start, count) => {
    if(start > 10000) {
        start = 2805 + (start - 10000);
    }
    return questions.slice(start - 1, start - 1 + count);
};

const createQuestionElement = (question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";

    const questionNumber = document.createElement("p");
    questionNumber.textContent = `Питання №${question.number}`;
    questionDiv.appendChild(questionNumber);

    const questionText = document.createElement("p");
    questionText.textContent = question.text;
    questionDiv.appendChild(questionText);

    const answersForm = document.createElement("form");
    answersForm.id = `answers-form-${index}`;

    question.answers.forEach(answer => {
        const label = document.createElement("label");
        label.textContent = answer;

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `answer-${index}`;
        radio.value = answer;

        label.prepend(radio);
        answersForm.appendChild(label);
    });

    questionDiv.appendChild(answersForm);
    return questionDiv;
};

const displayQuestions = (questions) => {
    const container = document.getElementById("questions-container");
    const fragment = document.createDocumentFragment();

    questions.forEach((question, index) => {
        const questionElement = createQuestionElement(question, index);
        fragment.appendChild(questionElement);
    });

    container.innerHTML = "";
    container.appendChild(fragment);
};

const checkAnswers = () => {
    let correctCount = 0;
    let incorrectCount = 0;

    questions.forEach((question, index) => {
        const selectedAnswer = document.querySelector(`input[name="answer-${index}"]:checked`);
        const questionDiv = document.querySelectorAll(".question")[index];

        if (selectedAnswer) {
            if (selectedAnswer.value === question.correct) {
                correctCount++;
                questionDiv.style.display = "none";
            } else {
                incorrectCount++;
                selectedAnswer.parentElement.classList.add("incorrect");
                const correctAnswer = Array.from(questionDiv.querySelectorAll('input')).find(input => input.value === question.correct);
                correctAnswer.parentElement.classList.add("correct");
            }
        } else {
            incorrectCount++;
            const correctAnswer = Array.from(questionDiv.querySelectorAll('input')).find(input => input.value === question.correct);
            correctAnswer.parentElement.classList.add("correct");
        }
    });

    const result = document.getElementById("result");
    result.textContent = `Правильних: ${correctCount}, Неправильних: ${incorrectCount}`;
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("check-button").addEventListener("click", () => {
        checkAnswers();
    });
});
