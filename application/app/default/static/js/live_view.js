$(document).ready(function() {
    $('#difficulty-selector').change(function(e) {
        var sel = $('input[name="difficulties"]:checked').attr('id');
        $('.diff-block').attr('hidden', true);
        if (sel) {
            $('#diff-' + sel).attr('hidden', false);
        }
    });
});
