document.addEventListener('DOMContentLoaded', function() {

    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');

    const firebaseConfig = {
        apiKey: "AIzaSyCbmV3zE-vcFocvtdtW3DPqrW0dnDj-5DI",
        authDomain: "quiz-2db2f.firebaseapp.com",
        databaseURL: "https://quiz-2db2f.firebaseio.com",
        projectId: "quiz-2db2f",
        storageBucket: "quiz-2db2f.appspot.com",
        messagingSenderId: "211508423959",
        appId: "1:211508423959:web:9963a3cc8a13748072db52",
        measurementId: "G-QS5QFEVKW1"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);

    const getData = () => {
        formAnswers.textContent = 'LOAD';

        nextButton.classList.add('d-none');      
        prevButton.classList.add('d-none');

        setTimeout(() => {
            firebase.database().ref().child('questions').once('value')
            .then(snap => playTest(snap.val())) 
        }, 500)
        
    }   

    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        getData();
    })

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
    })

    const playTest = (questions) => {
        const finalAnswers = [];
        let numberQuestion = 0;
        const renderAnswers = (index) => {
            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
                answerItem.innerHTML = `
                <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                <img class="answerImg" src="${answer.url}" alt="burger">
                <span>${answer.title}</span>
                </label>
                `;
                formAnswers.appendChild(answerItem);
            })
        }

        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = '';

            if (numberQuestion >=0 && numberQuestion <= questions.length - 1) {
                questionTitle.textContent = `${questions[indexQuestion].question}`;
                renderAnswers(indexQuestion);
                nextButton.classList.remove('d-none'); 
                prevButton.classList.remove('d-none');
                sendButton.classList.add('d-none');  
            }

            if (numberQuestion === 0) {
                prevButton.classList.add('d-none'); 

            }

            if (numberQuestion === questions.length) {
                nextButton.classList.add('d-none');      
                prevButton.classList.add('d-none');
                sendButton.classList.remove('d-none');                                        
                formAnswers.innerHTML = `
                <div class="form-group">
                    <label for="phoneNumber">Введите Ваш номер телефона:</label>
                    <input type="phone" class="form-control" id="phoneNumber">
                </div>
                `;
            }

            if (numberQuestion === questions.length + 1) {
                formAnswers.textContent = "Спасибо за пройденный тест!";
                setTimeout(() => {
                    modalBlock.classList.remove('d-block');
                }, 2000);
            }

        }
        renderQuestions(numberQuestion);

        const checkAnswer = () => {
            const obj = {};
            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'phoneNumber');
            inputs.forEach((input, index) => {
                
                if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value;
                }

                if (numberQuestion === questions.length) {
                    obj['Номер телефона'] = input.value;
                }
            })
            
            finalAnswers.push(obj);
        }

        nextButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        }

        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        }

        sendButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            firebase
            .database()
            .ref()
            .child('contacts')
            .push(finalAnswers)
        }

    }
    
})

