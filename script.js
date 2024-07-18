document.addEventListener("DOMContentLoaded", () => {
    function getRandomQuestions(questions, count) {
        const shuffled = questions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function displayQuestions(questions) {
        const container = document.getElementById("questions-container");
        container.innerHTML = "";
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.className = "question";

            const questionNumber = document.createElement("p");
            questionNumber.textContent = `Вопрос №${question.number}`;
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
                answersForm.appendChild(document.createElement("br"));
            });

            questionDiv.appendChild(answersForm);
            container.appendChild(questionDiv);
        });
    }

    function checkAnswers() {
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
                questionDiv.querySelector('form').classList.add("incorrect");
                const correctAnswer = Array.from(questionDiv.querySelectorAll('input')).find(input => input.value === question.correct);
                correctAnswer.parentElement.classList.add("correct");
            }
        });

        const result = document.getElementById("result");
        result.textContent = `Правильных ответов: ${correctCount}, Неправильных ответов: ${incorrectCount}`;
    }

    fetch('output.json')
        .then(response => response.json())
        .then(data => {
            questions = getRandomQuestions(data, 100);
            displayQuestions(questions);
        })
        .catch(error => console.error('Ошибка загрузки вопросов:', error));
});