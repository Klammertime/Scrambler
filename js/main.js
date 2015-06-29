

;(function($) {


$(document).ready(function() {
    var zi = 1;
    var empty_square = 16;
    var square_size;
    var g_image_for_overlay;

    $.fn.extend({
        scrambler:

            function(square_size) {

            var game_object_element = '#' + $(this).attr('id');
            var sq_size = square_size + 'px';
            var board_size = (square_size * 4) + 'px';
            var board_with_padding = (square_size * 4) + 5 + 'px';

            $(game_object_element).css({
                height: board_size,
                width: board_size
            });

            $(game_object_element).html('<div id="board"></div>');

            $('#board').children('div').css({
                height: sq_size,
                width: sq_size,
                lineHeight: sq_size,
                backgroundSize: board_with_padding + ' ' + board_with_padding
            });

            $('#board').css({
                position: 'absolute',
                width: board_size,
                height: board_size,
                border: '1px solid gray'
            });

            for (var i = 0; i < 16; i++) {
                $('#board').append('<div style="left:' + ((i % 4) * square_size) + 'px; top: ' + Math.floor(i / 4) * square_size + 
                    'px; width: ' + square_size + 'px; height: ' + square_size + 'px; background-position: ' + (-(i % 4) * square_size) + 
                    'px ' + -Math.floor(i / 4) * square_size + 'px; "></div>');
            }

            $(game_object_element).before('<section class="btns"></section>');
            $('.btns').append('<button type="button" value="Easy" id="easy"><label>Easy</label></button>' +
                '<button type="button" value="Medium" id="medium"><label>Medium</label></button>' +
                '<button type="button" value="Hard" id="hard"><label>Hard</label></button>' +
                '<button type="button" value="Unshuffle" id="unshuffle"><label>Unshuffle</label></button>' +
                '<button type="button" value="Help" class="btn" data-popup-open="popup-1"><label>Help</label></button>' +
                '<button type="button" value="New_image" id="new-image"><label>New Image</label></button>');



            $('[data-popup-open]').after('<div class="popup" data-popup="popup-1"></div');
            $('.popup').html('<div class="popup-inner"></div>');
            $('.popup-inner').append('<p class="image"></p><p><a data-popup-close="popup-1" href="#">Close</a></p>' +
                '<a class="popup-close" data-popup-close="popup-1" href="#">x</a>');

            getImages(square_size);

            // Emptys the 16th square.
            $('#board').children('div:nth-of-type(' + empty_square + ')').css({
                backgroundImage: '',
                background: '#ffffff'
            });

            // Attach a click event to each of the squares, or divs.
            $('#board').children('div').click(function() {
                Move(this, square_size, true);
            });

            $('#easy').click(function() {
                Shuffle(square_size, 6);
            });

            $('#medium').click(function() {
                Shuffle(square_size, 15);
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

    function win(square_size) {
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
                borderColor: '#F89406',
            }, 500, function() {
           $('#new-image').css({
                color: '#F2784B',
                borderColor: '#F2784B'
           });
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
        var bg_size = (square_size * 4 + 'px') + ' ' + (square_size * 4 + 'px');
        g_image_for_overlay = 'https://unsplash.it/' + (square_size * 4) + '/' + (square_size * 4) + '?image=' + image_index;
        $('#board').children('div').css({
            backgroundImage: 'url("' + g_image_for_overlay + '")'
        });
        $('#board').children('div:nth-of-type(' + empty_square + ')').css({
            backgroundImage: '',
            background: '#ffffff'
        });
        $('.image').css({
            backgroundImage: 'url("' + g_image_for_overlay + '")',
            width: (square_size * 4) + 'px',
            height: (square_size * 4) + 'px'
        });
        $('#new-image').css({
            color: '#999',
            borderColor: '#e6e6e6'
        });
        Grid();
    }

    // shuffles based on num_swaps, or number of swaps
    function Shuffle(square_size, num_swaps) {
        for (var i = 0; i < num_swaps; i++) {
            var empty_x = parseInt($('#board').children('div:nth-of-type(' + empty_square + ')').css('left'));
            var empty_y = parseInt($('#board').children('div:nth-of-type(' + empty_square + ')').css('top'));

            // Possible moves are moves where the empty square is next to the one to move, avoiding the risk of an unsolvable shuffle
            var possible_moves = [];
            $('#board').children('div').each(function(key, val) {
                var image_x = parseInt($(val).css('left'));
                var image_y = parseInt($(val).css('top'));

                // If there is only a 175px dif, or the next square up or down, its a possible move
                if (empty_x == image_x && (empty_y - square_size == image_y || empty_y + square_size == image_y)) {
                    // val grabs the entire div, later used in place of clicked square, clicked square in Move also would grab the entire div
                    possible_moves.push(val);
                }
                // If there is only a 175px dif, or the next square right or left, its a possible move
                else if (empty_y == image_y && (empty_x - square_size == image_x || empty_x + square_size == image_x)) {
                    possible_moves.push(val);
                }
            });

            var rand_index = Math.floor(Math.random() * possible_moves.length);
            var swap_square = possible_moves[rand_index];
            // random possible move is stored in swap_square and used as the clicked_square
            Move(swap_square, square_size, false);
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

    function Ungrid(){
            $('#board div').css({
                boxShadow: "none",
                "-webkit-box-shadow": "none",
                "box-shadow": "none"
           });
    }

    function Move(clicked_square, square_size, do_animate) {
        var movable = false;

        // swap the old with the new, just make it so new has x and y for top and bottom of the empty spot
        var empty_x = parseInt($('#board').children('div:nth-of-type(' + empty_square + ')').css('left'));
        var empty_y = parseInt($('#board').children('div:nth-of-type(' + empty_square + ')').css('top'));

        var image_x = parseInt($(clicked_square).css('left'));
        var image_y = parseInt($(clicked_square).css('top'));

        // check to see if clicked square or image_x and image_y is north of empty square
        if (empty_x == image_x && image_y == empty_y - square_size)
            movable = true;

        // check to see if clicked square is south of empty square, so its y would be more, so +
        if (empty_x == image_x && image_y == empty_y + square_size)
            movable = true;

        // check to see if clicked square is left of empty square, which makes left less, or x less
        if (empty_x - square_size == image_x && image_y == empty_y)
            movable = true;

        // check to see if clicked square is right of empty square, so left is more
        if (empty_x + square_size == image_x && image_y == empty_y)
            movable = true;

        // once movable is true, activate this if statement, first increments z-index, then move the image into the white square.
        if (movable) {
            // increment z-index up from 1 so that new tile is on top of others
            $(clicked_square).css('z-index', zi++);

            // move image square into the empty square position using animate, left and top are in an object of CSS 
            // properties that the animation will change over 200ms, and once that's complete, the function is called
            // Durations are given in milliseconds; higher values indicate slower animations, not faster ones.
            if (do_animate) {
                $(clicked_square).animate({
                    left: empty_x,
                    top: empty_y
                }, 200, function() {
                    // move empty square where image square you just moved was
                    // .css() used to set the left and top CSS properties to the new values
                    $('#board').children('div:nth-of-type(' + empty_square + ')').css('left', image_x);
                    $('#board').children('div:nth-of-type(' + empty_square + ')').css('top', image_y);
                    win(square_size);
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
        // OPEN
        $('[data-popup-open]').on('click', function(e) {
            var targeted_popup_class = $(this).attr('data-popup-open');
            $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

            e.preventDefault();
        });

        // CLOSE
        $('[data-popup-close]').on('click', function(e) {
            var targeted_popup_class2 = $(this).attr('data-popup-close');
            console.log(targeted_popup_class2);
            $('[data-popup="' + targeted_popup_class2 + '"]').fadeOut(350);

            e.preventDefault();
        });
    });

    // initialize game in #game_object div
    $('#game_object').scrambler(100);

});

}(jQuery));