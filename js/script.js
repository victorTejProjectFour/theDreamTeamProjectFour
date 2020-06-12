// namespacing
const triviaApp = {};

triviaApp.apiQuestionUrl = 'https://opentdb.com/api.php';
triviaApp.apiCatUrl = 'https://opentdb.com/api_category.php';
triviaApp.allQuestions = [];
triviaApp.totalScore = 0;


// triviaApp.getTriviaUrl = function (userCategory, userDifficulty) {
triviaApp.getTriviaUrl = function () {
    // 13,24,25,29,30
    const userCategory = [9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 26, 27, 28, 31, 32];
    const randomIndex = (Math.floor(Math.random() * userCategory.length));
    $.ajax({
        url: triviaApp.apiQuestionUrl,
        method: 'GET',
        datatype: 'json',
        data: {
            amount: '9',
            category: userCategory[randomIndex],
            difficulty: 'easy',
            type: 'multiple'
        }
    }).then(function (results) {
        triviaApp.allQuestions.push(...results.results);
        triviaApp.addBoolean();
        console.log(triviaApp.allQuestions);
    })
}

// triviaApp.getCatNameUrl = function () {
//     return $.ajax({
//         url: triviaApp.apiCatUrl,
//         method: 'GET',
//         datatype: 'json',
//     })
// }

triviaApp.addBoolean = function () {
    triviaApp.allQuestions.forEach(function (item) {
        item.boxStatus = true;
    })
}
// triviaApp.CataArray = function (catName) {
//     const categoryTitle = [];
//     do {
//         categoryTitle[categoryTitle.length] = catName.splice(Math.floor(Math.random() * catName.length), 1)[0];
//     } while (categoryTitle.length < 3)
//     return categoryTitle;
// }

// Create a Function that will have a parameter of an obj 
triviaApp.displayQuestions = function (obj) {
    $(`.multipleChoice`).empty();
    const choices = [...obj.incorrect_answers];
    let answerRandomIndex = Math.floor(Math.random() * (4 - 1)) + 1;
    choices.splice(answerRandomIndex - 1, 0, obj.correct_answer);
    $('.randomQuestion').text(obj.question);
    $('.multipleChoiceAnswer').prop('disabled', false);
    choices.forEach((choice, index) => {
        $(`.multipleChoice`).append(`<button class="multipleChoiceAnswer answer${index}">${choice}</button>`)
    })
    triviaApp.checkUserAnswer(obj);
}

triviaApp.checkUserAnswer = function (obj) {
    $('.multipleChoiceAnswer').on('click', function () {
        $('.multipleChoiceAnswer').prop('disabled', true);
        let userAnswer = $(this).text();
        if (userAnswer === obj.correct_answer) {
            triviaApp.scoreCount(obj.points);
            console.log(triviaApp.totalScore);
        }
        triviaApp.showAnswer(obj);
        $('.nextButton').prop('disabled', false);
        $('.nextButton').fadeIn(1000);
        triviaApp.checkCategory(obj);
    })

}


triviaApp.showAnswer = function (obj) {
    for (let i = 0; i < 4; i++) {
        if ($(`.answer${i}`).text() == obj.correct_answer) {
            $(`.answer${i}`).addClass('correct');
        } else {
            $(`.answer${i}`).addClass('incorrect');
        }
    }
}


triviaApp.checkCategory = function (obj) {
    $('.nextButton').on('click', function () {
        $('.nextButton').prop('disabled', true);
        $('.questionSection').hide();
        let j = 0;
        for (let i = 0; i < triviaApp.allQuestions.length; i++) {
            if (triviaApp.allQuestions[i].boxStatus) {
                j++;
            }
        }
        if (j == 0) {
            triviaApp.displayResult();
        } else {
            $('.categorySection').fadeIn(1000);
        }
    })
}

triviaApp.scoreCount = function (points) {
    triviaApp.totalScore += points;
}


// Create a function that displays the Categories
triviaApp.displayCategories = function () {
    // cat1questions = arr.filter(question => question.category === category[0].name)
    // console.log(cat1questions);
    $('.categorySection').fadeIn(1000);
    let category = triviaApp.allQuestions[0].category;
    $('.categoryName').text(category);
    triviaApp.checkQuestionButton();
}


triviaApp.checkQuestionButton = function () {
    $('.jQuestion').on('click', function () {
        // console.log(`${data - index}`);
        $('.categorySection').hide();
        $('.nextButton').hide();
        let dataIndex = $(this).data("index");
        // console.log($(this).text());
        triviaApp.allQuestions[dataIndex].points = parseInt($(this).text());
        triviaApp.allQuestions[dataIndex].boxStatus = false;

        $(`*[data-index=${dataIndex}]`).hide();
        triviaApp.displayQuestions(triviaApp.allQuestions[dataIndex]);
        $('.questionSection').fadeIn(1000);
    })
}

//Extracting all 9 questions

// triviaApp.getAllQuestions = function (category) {

//     const difficulty = ['easy', 'medium', 'hard'];
//     for (let i = 0; i < category.length; i++) {
//         triviaApp.getTriviaUrl(category[i].id, 'medium').then(function (rest) {
//             triviaApp.allQuestions.push(...rest.results);
//         })
//     }
// }

triviaApp.displayResult = function () {
    $('.categorySection').hide();
    $('.resultsSection').fadeIn(1000);
    $('.totalScore').text(triviaApp.totalScore);
    $('.restartButton').on('click', function () {
        triviaApp.starGame();
    })
}

triviaApp.reset = function () {
    $('.categorySection').hide();
    $('.questionSection').hide();
    $('.resultsSection').hide();
    triviaApp.allQuestions = [];
    triviaApp.totalScore = 0;
    triviaApp.getTriviaUrl()
}

triviaApp.startGame = function () {
    triviaApp.reset();
    $('header').fadeIn(1000);
    $('.gameStart').on('click', function () {
        console.log('hello');
        $('header').hide();
        triviaApp.displayCategories();
    });
}

triviaApp.init = () => {
    triviaApp.starGame();
    triviaApp.getTriviaUrl();
}
$(document).ready(triviaApp.init());
