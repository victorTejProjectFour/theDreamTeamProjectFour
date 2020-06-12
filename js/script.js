// namespacing
const triviaApp = {};

triviaApp.apiQuestionUrl = 'https://opentdb.com/api.php';
triviaApp.apiCatUrl = 'https://opentdb.com/api_category.php';
triviaApp.allQuestions = [];
triviaApp.totalScore = 0;


// triviaApp.getTriviaUrl = function (userCategory, userDifficulty) {
triviaApp.getTriviaUrl = function () {
    const userCategory = (Math.floor(Math.random() * 23) + 9);
    $.ajax({
        url: triviaApp.apiQuestionUrl,
        method: 'GET',
        datatype: 'json',
        data: {
            amount: '9',
            category: userCategory,
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
    // console.log(answerRandomIndex);
    choices.splice(answerRandomIndex - 1, 0, obj.correct_answer);
    // console.log(choices);
    $('.randomQuestion').text(obj.question);
    choices.forEach((choice) => {
        $(`.multipleChoice`).append(`<button class="multipleChoiceAnswer">${choice}</button>`)
    })
    triviaApp.checkUserAnswer(obj);
}

triviaApp.checkUserAnswer = function (obj) {
    console.log('obj', obj);
    $('.multipleChoiceAnswer').on('click', function () {
        console.log('hello');
        let userAnswer = $(this).text();
        console.log(userAnswer);
        console.log(obj.correct_answer);
        if (userAnswer == obj.correct_answer) {
            triviaApp.scoreCount(obj.points);
            console.log(triviaApp.totalScore);
        }
    })
}

triviaApp.scoreCount = function (points) {
    triviaApp.totalScore += points;
}

triviaApp.displayRightAnswer =

    // Create a function that displays the Categories
    triviaApp.displayCategories = function () {
        // cat1questions = arr.filter(question => question.category === category[0].name)
        // console.log(cat1questions);
        let category = triviaApp.allQuestions[0].category;
        $('.categoryName').text(category);
        triviaApp.checkQuestionButton();
    }

triviaApp.checkQuestionButton = function () {
    $('.jQuestion').on('click', function () {
        // console.log(`${data - index}`);
        $('.categorySection').hide();
        let dataIndex = $(this).data("index");
        // console.log($(this).text());
        triviaApp.allQuestions[dataIndex].points = parseInt($(this).text());
        triviaApp.allQuestions[dataIndex].boxStatus = false;
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

triviaApp.starGame = function () {
    $('.categorySection').hide();
    $('.questionSection').hide();
    $('.gameStart').on('click', function () {
        console.log('hello');
        $('header').hide();
        $('.categorySection').fadeIn(1000);
        triviaApp.displayCategories();

    });
}



triviaApp.init = () => {


    triviaApp.starGame();
    triviaApp.checkQuestionButton();
    // triviaApp.getCatNameUrl().then(function (rest) {
    //     const x = triviaApp.CataArray(rest.trivia_categories);
    //     triviaApp.getAllQuestions(x);
    // });

    triviaApp.getTriviaUrl()

    /*     triviaApp.getTriviaUrl(9, 'easy').then(function (result) {
            triviaApp.displayQuestions(result.results[0]);
        }) */

    // triviaApp.getAllQuestions(triviaApp.getCatNameUrl());
    // console.log(triviaApp.allQuestions);
    /* console.log(triviaApp.allQuestions); */
    /*     triviaApp.CataArray(asd);
        console.log(triviaApp.CataArray(asd)); */
    /*     triviaApp.getAnotherUrl(); */
}
$(document).ready(triviaApp.init());
