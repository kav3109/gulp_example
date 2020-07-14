(function($) {
    $(document).ready(() => {

        const $arrCard = ['&#10084;','&#9885;','&#9742;','&#9875;', '&#9731;'];
        const $backCard = '&#9884;';
        const $btnStart = $('input[value="Start"]');
        const $btnFinish = $('input[value="Finish"]');

        let $firstCard = '', $secondCard = '', $firstInd, $secondInd, $startPositions = $getRandomCards($arrCard);

        // mix cards
        function $getRandomCards(cards) {
            return cards.concat(cards).sort(function(){
                return Math.random() - 0.5;
            });
        }

        //set cards view
        const $setCards = (cards) => {

            const $wrap = $('.wrapper');
            $wrap.empty();

            if(typeof cards === 'object') {
                for(let $i = 0; $i < cards.length; $i++) {
                    $wrap.append(`<div><span>${$startPositions[$i]}</span></div>`);
                }
            } else {
                for(let $i = 0; $i < 10; $i++) {
                    $wrap.append(`<div class="back" data-num=${$i}><span>${$backCard}</span></div>`);
                }
            }
        };

        // clack on button Start
        $btnStart.click(function () {
            $setCards($backCard);
            $(this).hide().toggleClass('visible invisible');
            $btnFinish.show().toggleClass('visible invisible');

            $('.back').click(function () {

                let $index = $(this).data('num');

                //block repeated click on the opened card or open third card
                if($(this).hasClass('paired') || $secondCard !== '' || $firstInd === $index || $secondInd === $index) return;

                //open cards
                if($firstCard.length === 0) {
                    $firstCard = $startPositions[$index];
                    $(this).addClass('check').empty().append(`<span>${$firstCard}</span>`);
                    $firstInd = $index;
                } else {
                    $secondCard = $startPositions[$index];
                    $(this).addClass('check').empty().append(`<span>${$secondCard}</span>`);
                    $secondInd = $index;
                }
                if($secondCard === '') return;

                //check pair
                if($firstCard === $secondCard) {
                    $('.check').toggleClass('paired check');
                    $firstInd = '';
                    $firstCard = '';
                    $secondInd = '';
                    $secondCard = '';
                } else {
                    setTimeout(()=>{
                        $('.check').toggleClass('check').empty().append(`<span>${$backCard}</span>`);
                        $firstInd = '';
                        $firstCard = '';
                        $secondInd = '';
                        $secondCard = '';
                    }, 2000);

                }

                //check all pairs
                if($('.paired').length === $startPositions.length) {
                    $('.finished').fadeIn(1000);
                }

            });
        });

        //click on button Finish
        $btnFinish.click(function () {
            $startPositions = $getRandomCards($arrCard);
            $setCards($startPositions);
            $(this).hide().toggleClass('visible invisible');
            $btnStart.toggleClass('visible invisible');
            $('.finished').fadeOut(1000);
            $btnStart.show();
            $firstInd = '';
            $firstCard = '';
            $secondInd = '';
            $secondCard = '';
        });

        //first view
        $setCards($startPositions);
    });
})(jQuery);