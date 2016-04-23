(function($) {
    $(document).ready(function() {
        var squareSize,
            imageOverlay,
            zi = 1,
            score = 0,
            EMPTY_SQUARE = 16;

        $.fn.extend({
            scrambler: function(squareSize) {

                var gameObjectElement = '#' + $(this).attr('id'),
                    boardWithPadding = (squareSize * 4) + 5 + 'px';

                $(gameObjectElement).css({
                    height: (squareSize * 4) + 'px',
                    width: (squareSize * 4) + 'px',
                });

                $(gameObjectElement).html('<div id="board"></div>');

                $('#board').children('div').css({
                    height: squareSize + 'px',
                    width: squareSize + 'px',
                    lineHeight: squareSize + 'px',
                    backgroundSize: boardWithPadding + ' ' + boardWithPadding
                });

                $('#board').css({
                    position: 'absolute',
                    width: (squareSize * 4) + 'px',
                    height: (squareSize * 4) + 'px',
                    border: '1px solid gray'
                });

                for (var i = 0; i < 16; i++) {
                    $('#board').append('<div style="left:' + Left(i, squareSize) + 'px; top: ' + Top(i, squareSize) +
                        'px; width: ' + squareSize + 'px; height: ' + squareSize + 'px; background-position: ' + (-(i % 4) * squareSize) +
                        'px ' + -Math.floor(i / 4) * squareSize + 'px; "></div>');
                }

                $(gameObjectElement).before('<section class="btns"></section>');
                $('.btns').append('<input type="button" value="Easy" id="easy"></input>' +
                    '<input type="button" value="Hard" id="hard"></input>' +
                    '<input type="button" value="Unshuffle" id="unshuffle"></input>' +
                    '<input type="button" value="Help" class="btn" data-popup-open="popup-1"></input>' +
                    '<input type="button" value="Score" class="btn" data-popup-open="score"></input>' +
                    '<input type="button" value="New Image" id="new-image"></input>');

                $('[data-popup-open]').after('<div class="popup" data-popup="popup-1"></div');
                $('.popup').html('<div class="popup-inner"></div>');
                $('.popup-inner').append('<p class="image"></p><p><a data-popup-close="popup-1" href="#">Close</a></p>' +
                    '<a class="popup-close" data-popup-close="popup-1" href="#">x</a>');

                $('input[data-popup-open="score"]').after('<div class="score popup" data-popup="score"></div');
                $('.score').html('<div class="score-inner popup-inner"></div>');
                $('.score-inner').append('<div class="actual-score"><div class="score-container"></div></div><p><a data-popup-close="score" href="#">Close</a></p>' +
                    '<a class="popup-close" data-popup-close="score" href="#">x</a>');

                getImages(squareSize);

                // Emptys the 16th square.
                $('#board').children('div:nth-of-type(' + EMPTY_SQUARE + ')').css({
                    backgroundImage: '',
                    background: '#fff'
                });

                // Attach a click event to each of the squares, or divs.
                $('#board').children('div').click(function() {
                    Slide(this, squareSize, true);
                });

                $('#easy').click(function() {
                    Shuffle(squareSize, 15);
                });

                $('#hard').click(function() {
                    Shuffle(squareSize, 200);
                });

                $('#new-image').click(function() {
                    getImages(squareSize);
                });

                $('#unshuffle').click(function() {
                    unShuffle(squareSize);
                });

                $('input[data-popup-open="score"]').click(function() {
                    currentScore(score);
                });

            }
        });

        function unShuffle(squareSize) {
            for (var i = 1; i <= 16; i++) {
                var left = (((i - 1) % 4) * squareSize) + 'px',
                    top = Math.floor((i - 1) / 4) * squareSize + 'px';
                $('#board div:nth-of-type(' + i + ')').css({
                    left: left,
                    top: top
                });
            }
        }

        function Top(i, squareSize) {
            return Math.floor(i / 4) * squareSize;
        }

        function Left(i, squareSize) {
            return ((i % 4) * squareSize);
        }

        function Win(squareSize) {
            for (var i = 1; i <= 16; i++) {
                var left = (((i - 1) % 4) * squareSize),
                    top = Math.floor((i - 1) / 4) * squareSize,
                    winLeft = parseInt($('#board div:nth-of-type(' + i + ')').css('left')),
                    winTop = parseInt($('#board div:nth-of-type(' + i + ')').css('top'));
                // When Move called, so is win, so this keeps button black if moving didn't make you win
                if (winLeft != left || winTop != top) {
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
                score += 1;
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

        function getImages(squareSize) {
            var imageIndex = Math.floor(Math.random() * 700),
                // bg_size = (squareSize * 4 + 'px') + ' ' + (squareSize * 4 + 'px'),
                imageOverlay = 'https://unsplash.it/' + (squareSize * 4) + '/' + (squareSize * 4) + '?image=' + imageIndex;
            $('#board').children('div').css({
                backgroundImage: 'url("' + imageOverlay + '")'
            });
            $('#board').children('div:nth-of-type(' + EMPTY_SQUARE + ')').css({
                backgroundImage: '',
                background: '#fff'
            });
            $('.image').css({
                backgroundImage: 'url("' + imageOverlay + '")',
                width: (squareSize * 4) + 'px',
                height: (squareSize * 4) + 'px'
            });
            $('#new-image').css({
                color: '#999',
                borderColor: '#e6e6e6'
            });
            Grid();
        }

        function currentScore(score) {
            $('.score-container').remove();
            $('.actual-score').append('<div class="score-container"><p class="stat-number">' + score +
                '</p><p class="stat-label">Scramblers Solved</p></div>');
        }

        function getEmptyX(EMPTY_SQUARE) {
            return parseInt($('#board').children('div:nth-of-type(' + EMPTY_SQUARE + ')').css('left'));
        }

        function getEmptyY(EMPTY_SQUARE) {
            return parseInt($('#board').children('div:nth-of-type(' + EMPTY_SQUARE + ')').css('top'));
        }

        function getImageX(clickedSquare) {
            return parseInt($(clickedSquare).css('left'));
        }

        function getImageY(clickedSquare) {
            return parseInt($(clickedSquare).css('top'));
        }

        // Empty square next to the one to move,
        function generatePossibleMoves(emptyX, emptyY, squareSize) {
            var possibleMoves = [];
            $('#board').children('div').each(function(index, clickedSquare) {
                var imageX = getImageX(clickedSquare),
                    imageY = getImageY(clickedSquare);
                // If there is only a 175px dif, or the next square up or down, its a possible move
                if (isPossibleMove(emptyX, imageX, emptyY, imageY, squareSize)) {
                    possibleMoves.push(clickedSquare);
                }
            });
            return possibleMoves;
        }


        // Shuffles based on number of swaps
        function Shuffle(squareSize, numSwaps) {
            for (var i = 0, j = numSwaps; i < j; i++) {
                var randomIndex,
                    swapSquare,
                    possibleMoves,
                    emptyX = getEmptyX(EMPTY_SQUARE),
                    emptyY = getEmptyY(EMPTY_SQUARE);

                possibleMoves = generatePossibleMoves(emptyX, emptyY, squareSize);
                randomIndex = Math.floor(Math.random() * possibleMoves.length);
                swapSquare = possibleMoves[randomIndex];
                // random possible move is stored in swapSquare and used as the clickedSquare
                Slide(swapSquare, squareSize, false);
            }
            $('#board').removeClass('change');
            $('#new-image').css({ color: '#999', borderColor: '#e6e6e6' });
            Grid();
        }
        // bring back drop-shadow when no longer unscrambled
        function Grid() {
            $('#board div').css({
                "-webkit-box-shadow": "inset 0 0 20px #555",
                "box-shadow": "inset 0 0 20px #555"
            });
        }
        // Ungrid called when you've won
        function Ungrid() {
            $('#board div').css({
                boxShadow: "none",
                "-webkit-box-shadow": "none",
                "box-shadow": "none"
            });
        }

        function isPossibleMove(emptyX, imageX, emptyY, imageY, squareSize) {
            if (emptyX == imageX && (emptyY - squareSize == imageY || emptyY + squareSize == imageY)) {
                return true;
            }
            // If there is only a 175px dif, or the next square right or left, its a possible move
            if (emptyY == imageY && (emptyX - squareSize == imageX || emptyX + squareSize == imageX)) {
                return true;
            }
        }

        function Slide(clickedSquare, squareSize, do_animate) {
            // swap the old with the new, just make it so new has x and y for top and bottom of the empty spot
            var emptyX = getEmptyX(EMPTY_SQUARE),
                emptyY = getEmptyY(EMPTY_SQUARE),
                imageX = getImageX(clickedSquare),
                imageY = getImageY(clickedSquare);

            // if true, activate this if statement, first increments z-index, then move the image into the white square.
            if (isPossibleMove(emptyX, imageX, emptyY, imageY, squareSize)) {
                // increment z-index up from 1 so that new tile is on top of others
                $(clickedSquare).css('z-index', zi++);

                // move image square into the empty square position using animate, left and top are in an object of CSS
                if (do_animate) {
                    $(clickedSquare).animate({
                        left: emptyX,
                        top: emptyY
                    }, 200, function() {
                        // move empty square where image square you just moved was
                        // .css() used to set the left and top CSS properties to the new values
                        $('#board').children('div:nth-of-type(' + EMPTY_SQUARE + ')').css('left', imageX);
                        $('#board').children('div:nth-of-type(' + EMPTY_SQUARE + ')').css('top', imageY);
                        Win(squareSize);
                    });
                    // bring back drop-shadow when no longer unscrambled
                    Grid();

                } else {
                    $(clickedSquare).css('left', emptyX);
                    $(clickedSquare).css('top', emptyY);
                    $('#board').children('div:nth-of-type(' + EMPTY_SQUARE + ')').css('left', imageX);
                    $('#board').children('div:nth-of-type(' + EMPTY_SQUARE + ')').css('top', imageY);
                }
            }
            var zIndexValue = $(clickedSquare).css('z-index');
            if (zIndexValue > 500) {
                $(clickedSquare).css('z-index', 5);
            }
        }

        $(function() {
            // to show reminder of image and scoreboard
            $('[data-popup-open]').on('click', function(element) {
                var targetedPopupClass = $(this).attr('data-popup-open');
                $('[data-popup="' + targetedPopupClass + '"]').fadeIn(350);

                element.preventDefault();
            });

            $('[data-popup-close]').on('click', function(element) {
                var targetedPopupClass2 = $(this).attr('data-popup-close');
                $('[data-popup="' + targetedPopupClass2 + '"]').fadeOut(350);

                element.preventDefault();
            });
        });

        // initialize game in #game_object div
        $('#game_object').scrambler(130);
    });

}(jQuery));