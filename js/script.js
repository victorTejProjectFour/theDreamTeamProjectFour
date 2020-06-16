// namespacing
const triviaApp = {};

triviaApp.apiQuestionUrl = 'https://opentdb.com/api.php';
triviaApp.apiCatUrl = 'https://opentdb.com/api_category.php';
triviaApp.allQuestions = [];
triviaApp.totalScore = 0;
triviaApp.volume = 0.2;

// Call ajax request
triviaApp.getTriviaUrl = function () {
    // 13,24,25,29,30
    // The following numbers can't give 9 questions
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
        triviaApp.allQuestions = [];
        triviaApp.allQuestions.push(...results.results);
        triviaApp.addBoolean();
    })
}

// Adding boolean value to each object in the array allQuestions
triviaApp.addBoolean = function () {
    triviaApp.allQuestions.forEach(function (item) {
        item.boxStatus = true;
    })
}
// Create a function that starts the game
triviaApp.startGame = function () {

    $('.categorySection,.questionSection,.resultsSection').hide();
    $('.headerTitle').hide();
    $('.headerLoader').show();
    $('audio').prop("volume", triviaApp.volume);
    setTimeout(function () {
        $('.headerLoader').hide();
        $('.headerTitle').show();
    }, 3000);
    $('.gameStart').on('click', function () {
        triviaApp.displayCategories();
        $('header').hide();
    });
}

// Create a function that displays the Categories
triviaApp.displayCategories = function () {
    $('.categorySection').show();
    let category = triviaApp.allQuestions[0].category;
    $('.categoryName').text(category);
    $('.soundCountdown').trigger('play');
    triviaApp.checkQuestionButton();
}

// Create a function that checks user's question choice
triviaApp.checkQuestionButton = function () {
    $('.jQuestion').on('click', function () {
        triviaApp.initTimer();
        triviaApp.question = {};
        $('.categorySection').hide();
        $('.nextButton').css('visibility', 'hidden');
        let dataIndex = $(this).data("index");
        triviaApp.allQuestions[dataIndex].points = parseInt($(this).text());
        triviaApp.allQuestions[dataIndex].boxStatus = false;

        $(`*[data-index=${dataIndex}]`).prop('disabled', true);
        $(`*[data-index=${dataIndex}]`).addClass('disabled');
        triviaApp.question = { ...triviaApp.allQuestions[dataIndex] };
        triviaApp.displayQuestions(triviaApp.question);
        $('.questionSection').show();
    })
}

// Create a Function that will have a parameter of an obj
triviaApp.displayQuestions = function (obj) {
    $('.multipleChoice').empty();
    $('.responseResult').css('visibility', 'hidden');
    const choices = [...obj.incorrect_answers];
    let answerRandomIndex = Math.floor(Math.random() * (4 - 1)) + 1;
    choices.splice(answerRandomIndex - 1, 0, obj.correct_answer);
    $('.randomQuestion').html(obj.question);
    $('.multipleChoiceAnswer').prop('disabled', false);
    choices.forEach((choice, index) => {
        $('.multipleChoice').append(`<button class="multipleChoiceAnswer answer${index}">${choice}</button>`)
    })
    triviaApp.checkUserAnswer(obj);
}

// Create a function that will check users answer
triviaApp.checkUserAnswer = function (obj) {
    triviaApp.questionHelper(obj);
    $('.multipleChoiceAnswer').on('click', function () {
        $('.multipleChoiceAnswer').prop('disabled', true);
        let userAnswer = $(this).html();
        $('.responseResult').css('visibility', 'visible');
        if (triviaApp.translate(obj, userAnswer)) {
            triviaApp.scoreCount(obj.points);
            $('.soundCorrect').trigger('play');
            $('.responseResult').text('Correct!');
        } else {
            $('.soundWrong').trigger('play');
            $('.responseResult').text('Try harder!');
        }
        triviaApp.showAnswer(obj);
        $('.nextButton').prop('disabled', false);
        $('.nextButton').css('visibility', 'visible');
        triviaApp.checkCategory(obj);
    })
}

// Create a function that check if user click the next button, and decide to bring user back to category or result section
triviaApp.checkCategory = function (obj) {
    $('.nextButton').on('click', function () {
        clearInterval(triviaApp.timer);
        $('.nextButton').prop('disabled', true);
        /* audio */
        triviaApp.resetAudio('.soundCorrect');
        triviaApp.resetAudio('.soundWrong');
        /* audio */
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
            triviaApp.displayCategories();
        }
    })
}

// Create a function that will show user's result
triviaApp.displayResult = function () {
    $('.categorySection').hide();
    $('.resultsSection').show();
    triviaApp.resetAudio('.soundCountdown');
    $('.soundOutro').trigger('play');
    $('.totalScore').text(triviaApp.totalScore);
    $('.restartButton').on('click', function () {
        location.reload(true);
    })
}


// Misc.

/* These are the special characters need to replace */
triviaApp.translate = function (obj, item) {
    return item == obj.correct_answer || item == obj.correct_answer.replace(/&quot;/g, '\"').replace(/&#039;/g, "\'").replace(/&amp;/g, '\&').replace(/&ntilde;/g, 'ñ').replace(/&aacute;/g, 'á').replace(/&oacute;/g, 'ó').replace(/&Delta;/g, 'Δ').replace(/&Uuml;/g, 'Ü').replace(/&Omicron;/g, 'Ο');
}

// Create a function that will color the answer
triviaApp.showAnswer = function (obj) {
    for (let i = 0; i < 4; i++) {
        if (triviaApp.translate(obj, $(`.answer${i}`).text())) {
            $(`.answer${i}`).addClass('correct');
        } else {
            $(`.answer${i}`).addClass('incorrect');
        }
    }
}

// Create a function that give users hint
triviaApp.questionHelper = function (obj) {
    $('.helpKit').on('click', function () {
        $('.helpKit').addClass('disableHelpKit').prop('disabled', true);
        triviaApp.showAnswer(obj);
    })
}

// Create a function to reset Audio
triviaApp.resetAudio = function (audio) {
    $(audio).trigger('pause');
    $(audio).prop("currentTime", 0);
}

// Create a function to count the user's score
triviaApp.scoreCount = function (points) {
    triviaApp.totalScore += points;
    $(".displayScore,.totalScore").text(triviaApp.totalScore);
}

// Create a function that initialize the timer
triviaApp.initTimer = function () {

    let now = moment();
    let end = moment().add({ seconds: 10 });
    let diff = end.diff(now);
    let $element = $('.cContainer');
    let $txt = $('.cText');
    let svg = Snap($element.find('svg')[0]);
    let progress = svg.select('#progress');
    progress.attr({
        strokeDasharray: '0, 301.44'
    });
    Snap.animate(0, 301.44, function (value) {
        progress.attr({
            'stroke-dasharray': value + ', 301.44'
        });
    }, diff);
    let timer = setInterval(function () {
        now = moment();
        diff = (end.diff(now)) / 1000;
        let counter = Math.floor(diff);
        if ($('.multipleChoiceAnswer').prop('disabled') == true) {
            diff = 0;
            return clearInterval(timer);
        } else if (diff > 0) {
            $txt.text(counter);
        } else {
            $('.multipleChoiceAnswer').prop('disabled', true);
            $('.soundEndTimer').trigger('play');
            $('.nextButton').prop('disabled', false);
            $('.nextButton').css('visibility', 'visible');
            triviaApp.checkCategory(triviaApp.question);
            triviaApp.showAnswer(triviaApp.question);
            $txt.text("Time's up!");
            diff = 0;
            return clearInterval(timer);
        }
    }, 10);
}


// Create a function that initialize the audio files
triviaApp.initAudio = function () {
    $('.play').on('click', function () {
        $('.soundCountdown').prop('muted', true);
        $('.soundOutro').prop('muted', true);
        $('.play').hide();
        $('.pause').show();
        $('.displayVolume').show().delay(1500).fadeOut().text('Volume:OFF');
    });
    $('.pause').on('click', function () {
        $('.soundCountdown').prop('muted', false);
        $('.soundOutro').prop('muted', false);
        $('.pause').hide();
        $('.play').show();
        $('.displayVolume').show().delay(1500).fadeOut().text('Volume:ON');
    });

    $('.plusVolume').on('click', function () {
        if (triviaApp.volume < 1 && (triviaApp.volume + 0.1) < 1) {
            triviaApp.volume += 0.1;
        } else {
            triviaApp.volume = 1;
        }
        $('.displayVolume').show().delay(1500).fadeOut().html(`Volume: ${(triviaApp.volume * 100).toFixed(0)}%`);
        $('audio').prop("volume", triviaApp.volume);
    })

    $('.minusVolume').on('click', function () {
        if (triviaApp.volume > 0 && (triviaApp.volume - 0.1) > 0) {
            triviaApp.volume -= 0.1;
        } else {
            triviaApp.volume = 0;
        }
        $('.displayVolume').show().delay(1500).fadeOut().html(`Volume: ${(triviaApp.volume * 100).toFixed(0)}%`);
        $('audio').prop("volume", triviaApp.volume);
    })

    $('.multipleChoiceAnswer,.nextButton,.restartButton,.gameStart,.jQuestion,.helpKit').mouseenter(function () {
        $('.soundHover').prop('currentTime', 0);
        $('.soundHover').trigger('play');
    })

}

// Create a function that listen to the easter egg events
triviaApp.easterEggs = function () {
    $('footer > p').one('click', function () {
        triviaApp.scoreCount(500);
        $('.soundEaster').trigger('play');
    });

    $('footer > p').on('click', function () {
        if ($('footer > p').text() == 'Copyright ⓒ 2020 Victor Wong🐒 & Tej Lehal🧞') {
            $('footer > p').html('Subscribe and Follow us! We will give you Free points!🐒🧞');
        } else if ($('footer > p').text() == 'Subscribe and Follow us! We will give you Free points!🐒🧞') {
            $('footer > p').html('You got a Key!');

        } else {
            $('footer > p').html('Copyright ⓒ 2020 Victor Wong🐒 & Tej Lehal🧞');
        }
    });
    /* Easter Egg 2 */
    $('.displayScore').on('click', function () {
        if ($('.displayScore').html() == 'Initial') {
            $('.displayScore').html('🍣 & 🍕');
        }
    });
}

// Create an init function
triviaApp.init = () => {
    triviaApp.getTriviaUrl();
    triviaApp.startGame();
    triviaApp.initAudio();
    triviaApp.easterEggs();
}

// Set document ready
$(document).ready(triviaApp.init());



// future upgrade 
// 1. putting in 3 categories in ajax call
// 2. more easter egg event
// 3. fire base implementation
// 4. timerfix

//Extracting all 9 questions

// triviaApp.getAllQuestions = function (category) {
//     const difficulty = ['easy', 'medium', 'hard'];
//     for (let i = 0; i < category.length; i++) {
//         triviaApp.getTriviaUrl(category[i].id, 'medium').then(function (rest) {
//             triviaApp.allQuestions.push(...rest.results);
//         })
//     }
// }

// triviaApp.CataArray = function (catName) {
//     const categoryTitle = [];
//     do {
//         categoryTitle[categoryTitle.length] = catName.splice(Math.floor(Math.random() * catName.length), 1)[0];
//     } while (categoryTitle.length < 3)
//     return categoryTitle;
// }

// triviaApp.getCatNameUrl = function () {
//     return $.ajax({
//         url: triviaApp.apiCatUrl,
//         method: 'GET',
//         datatype: 'json',
//     })
// }