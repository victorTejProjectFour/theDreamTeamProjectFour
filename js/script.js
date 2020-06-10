// namespacing
const triviaApp = {};

triviaApp.getTriviaUrl = () => {
    $.ajax({
        url: 'https://opentdb.com/api.php',
        method: 'GET',
        datatype: 'json',
        data: {
            amount: '20',
            category: '9',
            difficulty: 'easy'
        }
    }).then((res) => {
        console.log(res);
    })
}

triviaApp.getAnotherUrl = () => {

}


triviaApp.init = () => {
    triviaApp.getTriviaUrl();
    triviaApp.getAnotherUrl();
}
$(document).ready(triviaApp.init());
