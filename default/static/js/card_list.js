window.memberFilterSelector = null;
window.rarityFilterSelector = null;

function updateFilter() {
    var mf = window.memberFilterSelector || '';
    var rf = window.rarityFilterSelector || '';

    var select = '' + mf + rf;

    if (select.length > 0) {
        $('.filtered-card').hide();
        $(select).show();
    } else {
        $('.filtered-card').show();
    }
}

$('.member-filter').click(function(e) {
    e.preventDefault();
    var memberId = $(this).attr('member-id');
    var ms = '.card-member-' + memberId;

    $('.member-filter.img-hl').removeClass('img-hl');
    if (window.memberFilterSelector !== ms) {
        window.memberFilterSelector = ms;
        $(this).addClass('img-hl');
    } else {
        window.memberFilterSelector = null;
    }
    updateFilter();
});

$('.rarity-filter').click(function(e) {
    e.preventDefault();
    var rarity = $(this).attr('rarity');
    var rs = '.card-rarity-' + rarity;

    $('.rarity-filter.img-hl').removeClass('img-hl');
    if (window.rarityFilterSelector !== rs) {
        window.rarityFilterSelector = rs;
        $(this).addClass('img-hl');
    } else {
        window.rarityFilterSelector = null;
    }
    updateFilter();
});
