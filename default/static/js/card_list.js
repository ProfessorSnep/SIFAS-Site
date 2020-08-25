window.memberFilterSelector = null;
window.rarityFilterSelector = null;
window.attributeFilterSelector = null;
window.roleFilterSelector = null;
window.setFilterSelector = null;

function updateFilter() {
    var mf = window.memberFilterSelector || '';
    var rf = window.rarityFilterSelector || '';
    var af = window.attributeFilterSelector || '';
    var tf = window.roleFilterSelector || '';
    var sf = window.setFilterSelector || '';

    var select = '' + mf + rf + af + tf + sf;

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
    $('.school-filter.img-hl').removeClass('img-hl');
    if (window.memberFilterSelector !== ms) {
        window.memberFilterSelector = ms;
        $(this).addClass('img-hl');
    } else {
        window.memberFilterSelector = null;
    }
    updateFilter();
});

$('.school-filter').click(function(e) {
    e.preventDefault();
    var memberId = $(this).attr('school-id');
    var ms = '.card-school-' + memberId;

    $('.member-filter.img-hl').removeClass('img-hl');
    $('.school-filter.img-hl').removeClass('img-hl');
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
    var rarity = $(this).attr('rarity-id');
    var rs = '.card-rarity-' + rarity;

    $('.fes-filter.img-hl').removeClass('img-hl');
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
    var attrib = $(this).attr('attribute-id');
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
    var attrib = $(this).attr('role-id');
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
    $('.rarity-filter.img-hl').removeClass('img-hl');
    if (window.rarityFilterSelector !== fs) {
        window.rarityFilterSelector = fs;
        $(this).addClass('img-hl');
    } else {
        window.rarityFilterSelector = null;
    }
    updateFilter();
});

$('#set-sort').change(function(e) {
    if (this.value.length > 0) {
        var ss = '.card-set-' + this.value;
        window.setFilterSelector = ss;
    } else {
        window.setFilterSelector = null;
    }
    updateFilter();
});

$(document).ready(function() {
    $('.show-on-load').show();
    $('.hide-on-load').hide();
});
