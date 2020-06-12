// namespacing
const triviaApp = {};

triviaApp.apiQuestionUrl = 'https://opentdb.com/api.php';
triviaApp.apiCatUrl = 'https://opentdb.com/api_category.php';


triviaApp.getTriviaUrl = function (userCategory, userDifficulty) {
    const questionObj = $.ajax({
        url: triviaApp.apiQuestionUrl,
        method: 'GET',
        datatype: 'json',
        data: {
            amount: '3',
            /* 20 */
            category: userCategory,
            /* easy */
            difficulty: userDifficulty,
            type: 'multiple'
        }
    })
    return questionObj;
}

triviaApp.getCatNameUrl = function () {
    return $.ajax({
        url: triviaApp.apiCatUrl,
        method: 'GET',
        datatype: 'json',
    })/* .then(function (res) {
        console.log(triviaApp.CataArray(res.trivia_categories));
        return triviaApp.CataArray(res.trivia_categories);
        console.log(res.trivia_categories);
    }) */
}

triviaApp.CataArray = function (catName) {
    const categoryTitle = [];
    do {
        categoryTitle[categoryTitle.length] = catName.splice(Math.floor(Math.random() * catName.length), 1)[0];
    } while (categoryTitle.length < 3)
    return categoryTitle;
}

// Create a Function that will have a parameter of an obj 
triviaApp.displayQuestions = function (obj) {
    console.log(obj);
    const choices = [...obj.incorrect_answers];
    let answerRandomIndex = Math.floor(Math.random() * (4 - 1)) + 1;
    // console.log(answerRandomIndex);
    choices.splice(answerRandomIndex - 1, 0, obj.correct_answer);
    // console.log(choices);
    $('.questionSection').html(`
        <h2>${obj.question}<h2>
    `)
    choices.forEach((choice, index) => {
        $(`.questionSection`).append(`<p>${choice}</p>`)
    })
}

// Create a function that displays the Categories
triviaApp.displayCategories = function () {

}

//Extracting all 9 questions
triviaApp.allQuestions = [];
triviaApp.getAllQuestions = function(category){
    
    const difficulty = ['easy','medium','hard'];
    for(let i = 0; i < category.length ; i++){
            triviaApp.getTriviaUrl(category[i].id,'medium').then(function(rest){
                /* console.log(...rest.results); */
                triviaApp.allQuestions.push(...rest.results);
                /* console.log(triviaApp.allQuestions.length); */
            })
    }
/*     if(triviaApp.allQuestions.length < 9){
        
    } */
}



triviaApp.init = () => {
    /*     triviaApp.getTriviaUrl(20,'easy');
        triviaApp.getTriviaUrl(9,'easy'); */
     triviaApp.getCatNameUrl().then(function(rest){
        const x = triviaApp.CataArray(rest.trivia_categories);
        triviaApp.getAllQuestions(x);
    });

     
/*     triviaApp.getTriviaUrl(9, 'easy').then(function (result) {
        triviaApp.displayQuestions(result.results[0]);
    }) */

    triviaApp.getAllQuestions(triviaApp.getCatNameUrl());
    console.log(triviaApp.allQuestions);
    /* console.log(triviaApp.allQuestions); */
    /*     triviaApp.CataArray(asd);
        console.log(triviaApp.CataArray(asd)); */
    /*     triviaApp.getAnotherUrl(); */
}
$(document).ready(triviaApp.init());
