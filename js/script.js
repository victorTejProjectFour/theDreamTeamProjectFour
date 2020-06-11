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
            amount: '1',
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
    $.ajax({
        url: triviaApp.apiCatUrl,
        method: 'GET',
        datatype: 'json',
    }).then(function (res) {
        console.log(triviaApp.CataArray(res.trivia_categories));
        // console.log(res.trivia_categories);
    })
}

triviaApp.CataArray = function (catName) {
    const x = [];
    let loop = 3;
    while (loop > 0) {
        let index = Math.floor(Math.random() * (catName.length - 1));
        if (x.includes(catName[index])) {
            index = Math.floor(Math.random() * (catName.length - 1));
        } else {
            x.push(catName[index]);
            loop--;
        }
    }
    return x;
}




triviaApp.init = () => {
    /*     triviaApp.getTriviaUrl(20,'easy');
        triviaApp.getTriviaUrl(9,'easy'); */
    triviaApp.getCatNameUrl();
    triviaApp.getTriviaUrl(9, 'easy').then(function (result) {
        console.log(result);
    })
    /*     triviaApp.CataArray(asd);
        console.log(triviaApp.CataArray(asd)); */
    /*     triviaApp.getAnotherUrl(); */
}
$(document).ready(triviaApp.init());
