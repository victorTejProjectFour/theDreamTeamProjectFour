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
        console.log(triviaApp.CataArray(res.trivia_categories));
        console.log(res.trivia_categories);
    })
}

const asd = ['1','2','3','4','5','6','7'];


triviaApp.CataArray = function(catName){
    const x = [];
    
    let loop = 3;
    while(loop > 0){
        let index = Math.floor(Math.random() * (catName.length - 1));
        console.log(x[name] == catName[name]);
        /* Ex. 0 to 2 */
        /* console.log(Index); */
        if (x.includes(index)){
            index = Math.floor(Math.random() * (catName.length - 1));
        }else{
            x.push(catName[index]);
            loop--;
        }
       /*  if (x.includes */
    }
    return x;
}
/* triviaApp.getAnotherUrl = () => {
    $.ajax({
        url: ''

    })
} */


triviaApp.init = () => {
/*     triviaApp.getTriviaUrl(20,'easy');
    triviaApp.getTriviaUrl(9,'easy'); */
    triviaApp.getCatNameUrl();
/*     triviaApp.CataArray(asd);
    console.log(triviaApp.CataArray(asd)); */
/*     triviaApp.getAnotherUrl(); */
}
$(document).ready(triviaApp.init());
