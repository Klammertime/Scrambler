

;(function($) {


$(document).ready(function() {
    var win = $(window);
    var window_width = $(win).width();
    var zi = 1;
    var the_score = 0;
    var empty_square = 16;
    var square_size, image_for_overlay;

    $.fn.extend({
        scrambler:

            function(square_size) {
            var game_object_element = '#' + $(this).attr('id');
            var sq_size = square_size + 'px';
            var board_size = (square_size * 4) + 'px';
            var board_with_padding = (square_size * 4) + 5 + 'px';

            $(game_object_element).css({
                height: board_size,
                width: board_size,
                margin: "0 auto",
                position: "relative"
            });

            $(game_object_element).html('<div id="board"></div>');

            $('#board').children('div').css({
                height: sq_size,
                width: sq_size,
                lineHeight: sq_size,
                backgroundSize: board_with_padding + ' ' + board_with_padding,
            });

            $('#board').css({
                position: 'absolute',
                width: board_size,
                height: board_size,
                border: '1px solid gray'
            });

            for (var i = 0; i < 16; i++) {
                $('#board').append('<div style="left:' + Left(i, square_size) + 'px; top: ' + Top(i, square_size) + 
                    'px; width: ' + square_size + 'px; height: ' + square_size + 'px; background-position: ' + (-(i % 4) * square_size) + 
                    'px ' + -Math.floor(i / 4) * square_size + 'px; "></div>');
            }

            $(game_object_element).before('<section class="btns"></section>');
            $('.btns').append('<button value="Easy" id="easy" class="first btn"><label>Easy</label></button>' +
                '<button value="Medium" id="medium" class="btn"><label>Medium</label></button>' +
                '<button value="Hard" id="hard" class="btn"><label>Hard</label></button>' +
                '<button value="New_image" id="new-image" class="icon"><span class="icon-camera"></span></button>' +
                '<button value="Help" data-popup-open="popup-1" class="icon"><span class="icon-image"></span></button>' +
                '<button value="Unshuffle" id="unshuffle" class="icon"><span class="icon-spinner11"></span></button>');


            $('[data-popup-open]').after('<div class="popup" data-popup="popup-1"></div');
            $('.popup').html('<div class="popup-inner"></div>');
            $('.popup-inner').append('<p class="image"></p><p><a data-popup-close="popup-1" href="#">Close</a></p>' +
                '<a class="popup-close" data-popup-close="popup-1" href="#">x</a>');

            $('button[data-popup-open="score"]').after('<div class="score popup" data-popup="score"></div');
            $('.score').html('<div class="score-inner popup-inner"></div>');
            $('.score-inner').append('<div class="actual-score"><div class="score-container"></div></div><p><a data-popup-close="score" href="#">Close</a></p>' +
                '<a class="popup-close" data-popup-close="score" href="#">x</a>');

            getImages(square_size);

            // Emptys the 16th square.
            $('#board').children('div:nth-of-type(' + empty_square + ')').css({
                backgroundImage: '',
                background: '#ffffff'
            });

            Grid();

            // Attach a click event to each of the squares, or divs.
            $('#board').children('div').click(function() {
                Slide(this, square_size, true);
            });

            $('#easy').click(function() {
                Shuffle(square_size, 6);
            });

            $('#medium').click(function() {
                Shuffle(square_size, 25);
            });

            $('#hard').click(function() {
                Shuffle(square_size, 200);
            });

            $('#new-image').click(function() {
                getImages(square_size);
            });

            $('#unshuffle').click(function() {
                unShuffle(square_size);
            });

            $('button[data-popup-open="score"]').click(function() {
                currentScore(the_score);
            });
        }
    });

    function unShuffle(square_size) {
        for (var i = 1; i <= 16; i++) {
            var left = (((i - 1) % 4) * square_size) + 'px';
            var top = Math.floor((i - 1) / 4) * square_size + 'px';
            $('#board div:nth-of-type(' + i + ')').css({
                left: left,
                top: top
            });
        }
    }

    function Top(i, square_size){
        return Math.floor(i / 4) * square_size;
    }

    function Left(i, square_size){
        return ((i % 4) * square_size);
    }

    function Win(square_size) {
        for (var i = 1; i <= 16; i++) {
            var left = (((i - 1) % 4) * square_size);
            var top = Math.floor((i - 1) / 4) * square_size;
            var win_left = parseInt($('#board div:nth-of-type(' + i + ')').css('left'));
            var win_top = parseInt($('#board div:nth-of-type(' + i + ')').css('top'));
            if (win_left != left || win_top != top) {
                $('#new-image').css({
                    color: '#999',
                    borderColor: '#e6e6e6'
            });
                return false;
            }
        }  
            $('#board').animate({

            }, 500, function() {
           $('#new-image').css({
                color: '#F2784B',
                borderColor: '#F2784B'
           });
           the_score +=1;
            Ungrid();
            $('#board').click(function() {
                $(this).removeClass('change');
            });
            $('#new-image').click(function() {
                $(this).css({
                    color: '#999',
                    borderColor: '#e6e6e6'
                });
            });

        });
    }

    function getImages(square_size) {
        var image_index = Math.floor(Math.random() * 700);
        image_for_overlay = 'https://unsplash.it/' + (square_size * 4) + '/' + (square_size * 4) + '?image=' + image_index;
        $('#board').children('div').css({
            backgroundImage: 'url("' + image_for_overlay + '")'
        });
        $('#board').children('div:nth-of-type(' + empty_square + ')').css({
            backgroundImage: '',
            background: '#ffffff'
        });
        $('.image').css({
            backgroundImage: 'url("' + image_for_overlay + '")',
            width: (square_size * 4) + 'px',
            height: (square_size * 4) + 'px'
        });
        $('#new-image').css({
            color: '#999',
            borderColor: '#e6e6e6'
        });
        Grid();
    }

    function currentScore(the_score){
        
        $('.score-container').remove();
        $('.actual-score').append('<div class="score-container"><p class="stat-number">' + the_score + 
            '</p><p class="stat-label">Scramblers Solved</p></div>');
    }

    function getEmptyX(empty_square){
        return parseInt($('#board').children('div:nth-of-type(' + empty_square + ')').css('left'));
    }

    function getEmptyY(empty_square){
        return parseInt($('#board').children('div:nth-of-type(' + empty_square + ')').css('top'));  
    }

    function getImageX(clicked_square){
        return parseInt($(clicked_square).css('left'));
    }

    function getImageY(clicked_square){
        return parseInt($(clicked_square).css('top'));
    }

    // shuffles based on number of swaps
    function Shuffle(square_size, num_swaps) {
        for (var i = 0; i < num_swaps; i++) {
            var empty_x = getEmptyX(empty_square);
            var empty_y = getEmptyY(empty_square);

            // Possible moves are moves where the empty square is next to the one to move, avoiding the risk of an unsolvable shuffle
            var possible_moves = [];
            $('#board').children('div').each(function(index, clicked_square) {
                var image_x = getImageX(clicked_square);
                var image_y = getImageY(clicked_square);

                // If there is only a 175px dif, or the next square up or down, its a possible move
                if (isPossibleMove(empty_x, image_x, empty_y, image_y, square_size)) {
                    possible_moves.push(clicked_square);
                }
            });

            var rand_index = Math.floor(Math.random() * possible_moves.length);
            var swap_square = possible_moves[rand_index];
            // random possible move is stored in swap_square and used as the clicked_square
            Slide(swap_square, square_size, false);
        }
        $('#board').removeClass('change');
        $('#new-image').css({color: '#999', borderColor: '#e6e6e6' });
        Grid();
    }
    // bring back drop-shadow when no longer unscrambled
    function Grid(){
            $('#board div').css({
                "-webkit-box-shadow": "inset 0 0 20px #555555",
                "box-shadow": "inset 0 0 20px #555555"
           });
    }
    // Ungrid called when you've won
    function Ungrid(){
            $('#board div').css({
                boxShadow: "none",
                "-webkit-box-shadow": "none",
                "box-shadow": "none"
           });
    }

    function isPossibleMove(empty_x, image_x, empty_y, image_y, square_size){
        if (empty_x == image_x && (empty_y - square_size == image_y || empty_y + square_size == image_y)) {
            return true;
        }
        // If there is only a 175px dif, or the next square right or left, its a possible move
        if (empty_y == image_y && (empty_x - square_size == image_x || empty_x + square_size == image_x)) {
            return true;
        }
    }

    function Slide(clicked_square, square_size, do_animate) {

        // swap the old with the new, just make it so new has x and y for top and bottom of the empty spot
        var empty_x = getEmptyX(empty_square);
        var empty_y = getEmptyY(empty_square);

        var image_x = getImageX(clicked_square);
        var image_y = getImageY(clicked_square);


        // if true, activate this if statement, first increments z-index, then move the image into the white square.
        if (isPossibleMove(empty_x, image_x, empty_y, image_y, square_size)) {
            // increment z-index up from 1 so that new tile is on top of others
            $(clicked_square).css('z-index', zi++);

            // move image square into the empty square position using animate, left and top are in an object of CSS 
            if (do_animate) {
                $(clicked_square).animate({
                    left: empty_x,
                    top: empty_y
                }, 200, function() {
                    // move empty square where image square you just moved was
                    $('#board').children('div:nth-of-type(' + empty_square + ')').css('left', image_x);
                    $('#board').children('div:nth-of-type(' + empty_square + ')').css('top', image_y);
                    Win(square_size);
                });
            // bring back drop-shadow when no longer unscrambled
            Grid();

            } else {
                $(clicked_square).css('left', empty_x);
                $(clicked_square).css('top', empty_y);
                $('#board').children('div:nth-of-type(' + empty_square + ')').css('left', image_x);
                $('#board').children('div:nth-of-type(' + empty_square + ')').css('top', image_y);
            }
        }
        var z_index_value = $(clicked_square).css('z-index');
        if (z_index_value > 500) {
            $(clicked_square).css('z-index', 5);
        }
    }

    $(function() {
        // to show reminder of image and scoreboard
        $('[data-popup-open]').on('click', function(element) {
            var targeted_popup_class = $(this).attr('data-popup-open');
            $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

            element.preventDefault();
        });

        $('[data-popup-close]').on('click', function(element) {
            var targeted_popup_class2 = $(this).attr('data-popup-close');
            $('[data-popup="' + targeted_popup_class2 + '"]').fadeOut(350);

            element.preventDefault();
        });
    });

if (window_width < 520) {
    $('#scrambler').scrambler(80);
} if ((window_width > 520) && (window_width < 800)){
    $('#scrambler').scrambler(130); 
} if (window_width > 800){
    $('#scrambler').scrambler(150); 
}

});

}(jQuery));