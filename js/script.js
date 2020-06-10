// namespacing
const triviaApp = {};

triviaApp.apiQuestionUrl = 'https://opentdb.com/api.php';
triviaApp.apiCatUrl = 'https://opentdb.com/api_category.php';

triviaApp.getTriviaUrl = function(userCategory,userDifficulty) {
    $.ajax({
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
    }).then((res) => {
        console.log(res);
    })
}

triviaApp.getCatNameUrl = function(){
    $.ajax({
        url: triviaApp.apiCatUrl,
        method: 'GET',
        datatype: 'json',
    }).then(function(res){
        console.log(res);
    })
}


/* triviaApp.getAnotherUrl = () => {
    $.ajax({
        url: ''

    })
} */


triviaApp.init = () => {
    triviaApp.getTriviaUrl(20,'easy');
    triviaApp.getTriviaUrl(9,'easy');
/*     triviaApp.getAnotherUrl(); */
}
$(document).ready(triviaApp.init());
