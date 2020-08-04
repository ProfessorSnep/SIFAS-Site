window.memberFilterSelector = null;
window.rarityFilterSelector = null;
window.attributeFilterSelector = null;
window.roleFilterSelector = null;
window.fesFilterSelector = null;

function updateFilter() {
    var mf = window.memberFilterSelector || '';
    var rf = window.rarityFilterSelector || '';
    var af = window.attributeFilterSelector || '';
    var tf = window.roleFilterSelector || '';
    var ff = window.fesFilterSelector || '';

    var select = '' + mf + rf + af + tf + ff;

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

$('.attribute-filter').click(function(e) {
    e.preventDefault();
    var attrib = $(this).attr('attribute');
    var as = '.card-attribute-' + attrib;

    $('.attribute-filter.img-hl').removeClass('img-hl');
    if (window.attributeFilterSelector !== as) {
        window.attributeFilterSelector = as;
        $(this).addClass('img-hl');
    } else {
        window.attributeFilterSelector = null;
    }
    updateFilter();
});

$('.role-filter').click(function(e) {
    e.preventDefault();
    var attrib = $(this).attr('role');
    var ts = '.card-role-' + attrib;

    $('.role-filter.img-hl').removeClass('img-hl');
    if (window.roleFilterSelector !== ts) {
        window.roleFilterSelector = ts;
        $(this).addClass('img-hl');
    } else {
        window.roleFilterSelector = null;
    }
    updateFilter();
});

$('.fes-filter').click(function(e) {
    e.preventDefault();
    var fs = '.card-fes';

    $('.fes-filter.img-hl').removeClass('img-hl');
    if (window.fesFilterSelector !== fs) {
        window.fesFilterSelector = fs;
        $(this).addClass('img-hl');
    } else {
        window.fesFilterSelector = null;
    }
    updateFilter();
});
