$(document).ready(function() {
    $('.tower-level-box').click(function(e) {
        var level = $(this).attr('level-no');
        $('.tower-diff-block').attr('hidden', true);
        $('#level-' + level).attr('hidden', false);
    });
});
