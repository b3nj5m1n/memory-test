$(document).ready(function() {
    recall_target = "π";
    $(".recall-target").text(recall_target);
    add_input();
    // $("#number-fields").css("background-color", "black");
});

// This first makes all previous inputs read only and then adds a new input
function add_input() {
    $('.number-fields-input').each(function(i, obj) {
        $(this).prop("readonly", true);
    });
    input = $('<input oninput="add_input();" class="number-fields-input" type="text" maxlength="1">')
    $("#number-fields").append(input);
    $(".number-fields-input").last().focus();
}