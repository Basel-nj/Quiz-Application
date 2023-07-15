//Select Elements

let languageContainer = document.querySelector(".list") ;
let startPage = document.querySelectorAll(".list span") ;
let quizApp = document.querySelector(".quiz-app");
let quizArea = document.querySelector(".quiz-area");
let answerArea= document.querySelector(".answers-area");
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let submitButton = document.querySelector(".submit-button");
let countDownSpan = document.querySelector(".countdown");
let ressult = document.querySelector(".results");

//set Options
let languageChoosen;
let currentIndex= 0;
let rightAnswer = 0;
let countDownInterval;
let duration = 100;

//Start Page 

startPage.forEach((span)=>{
    span.addEventListener("click",function(){
        languageChoosen = span.getAttribute("class");
        languageContainer.remove();
        quizApp.style.display = "block";
        
        // The Main Calling For Start The Project
        getQuestions();
    })
});


function getQuestions(){
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;

            //Creat Bullets + Set Questions Count
            creatBullets(questionsCount);

            // Add Questions Data 
            addQuestionData(questionsObject[currentIndex],questionsCount);

            //start count Down // For The First Question
            countDown(duration,questionsCount);

            // on click Submit
            submitButton.onclick = () => {
                //Get Right Answers
                let correcAnswer = questionsObject[currentIndex].right_answer;
                //Increase Index
                currentIndex++;
                // Check The Answer
                checkAnswer(correcAnswer,questionsCount);

                //Remove previous Question
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";
                // Add Questions Data 
                addQuestionData(questionsObject[currentIndex],questionsCount);

                //Handle Bullets Class
                handleBullets();

                //start count Down
                clearInterval(countDownInterval);
                countDown(duration,questionsCount);

                //Show Result
                showResult(questionsCount);
            }
        }
    }
    myRequest.open("GET",`${languageChoosen}-questions.json`,true);
    myRequest.send();
    
    console.log(languageChoosen);
}

function creatBullets(num){
    countSpan.innerHTML= num;
    //Creat Spans
    for(let i=0;i<num;i++){
        //Creat bullet
        let bullet = document.createElement("span");
        //foucs on the first span
        if(i===0){
            bullet.className ="on";
        }
        //Append Bullets To Main Container
        bulletsSpanContainer.appendChild(bullet);
    }
}





function addQuestionData(obj,count){
    if(currentIndex < count){
            //creat H2 Question Title
    let questionTitle = document.createElement("h2");
    //creat Question Text
    let questionText = document.createTextNode(obj["title"]);
    //Append it
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    //creat The answers
    for(let i=1;i<=4;i++){

        //Creat main Div
        let answer = document.createElement("div");
        //Add Class To Main Div
        answer.className = "answer"

        //creat Radio Input
        let radioInput = document.createElement("input");
        //Add Type + Name + Id + Data Attribute
        radioInput.name = "question";
        radioInput.type = "radio";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`]; 

        //Make First Answers Checked
        if(i === 1){
            radioInput.checked = true;
        }

        //creat Label
        let theLabel = document.createElement("label");

        //Add For Attribute
        theLabel.htmlFor = `answer_${i}`;

        //Creat Label Text 
        let answerTitle = document.createTextNode(obj[`answer_${i}`]);

        //Add The Text To Label
        theLabel.appendChild(answerTitle);

        //Add Input + Label To Main Div
        answer.appendChild(radioInput);
        answer.appendChild(theLabel);

        //Append All Divs To Answers Area
        answerArea.appendChild(answer)
    }
    }
}

function checkAnswer(correcAnswer,count){

    let answer = document.getElementsByName("question");
    let theChoosenAnswer;

    for(let i = 0; i<answer.length ; i++){
        if(answer[i].checked){
            theChoosenAnswer = answer[i].dataset.answer;
        }
    }
    if(correcAnswer === theChoosenAnswer){
        rightAnswer++;
    }
}

function handleBullets(){
    let bulletsSapan = document.querySelectorAll(".bullets .spans span")
    let arrayOfSpans = Array.from(bulletsSapan);
    arrayOfSpans.forEach((span,index)=> {

        if(currentIndex === index){
            span.className = "on";
        }
    })
}

//show result Function
function showResult(count){
    let theResult;
    if(currentIndex === count){
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswer > (count / 2) && rightAnswer < count){
            theResult = `<span class="good">Good</span> The Coorect Answers are : ${rightAnswer}, from : ${count}`;
        } else if(rightAnswer === count){
            theResult = `<span class="perfect">Perfect</span> The Coorect Answers are : ${rightAnswer}, from : ${count}`;
        }else{
            theResult = `<span class="bad">Bad</span> The Coorect Answers are : ${rightAnswer}, from : ${count}`;
        }
        ressult.innerHTML = theResult;
    }
}

function countDown(duration,count){
    if(currentIndex < count){
        let minutes,seconds;
        countDownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds =  seconds < 10 ? `0${seconds}` : seconds;

            countDownSpan.innerHTML = `${minutes}:${seconds}`;
            if(--duration < 0){
                clearInterval(countDownInterval);
                submitButton.click();
            }
        },1000)
    }
}
