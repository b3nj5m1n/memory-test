// Variable for the constant
var constant = "";

$(document).ready(function () {
    recall_target = "π";
    $(".recall-target").text(recall_target);
    // Get constant from json
    constant = JSON.parse(e);
    // Add the first digit (Not a decimal)
    add_input();
    // Add a second input field
    add_input();
});

// This first makes all previous inputs read only and then adds a new input
function add_input() {
    var count = -1
    $('.number-fields-input').each(function (i, obj) {
        $(this).prop("readonly", true);
        count = i;
    });
    // If this is the first one added
    if (count == -1) {
        // Add an input with the number before the decimal points and a dot
        input = $('<input value="' + constant[0]["start"] + "." + '" id="number-fields-input-num-' + count + '" oninput="add_input();" class="number-fields-input" type="text" maxlength="2">')
        $("#number-fields").append(input);
    } else {
        // Add an empty input field
        input = $('<input id="number-fields-input-num-' + count + '" oninput="add_input();" class="number-fields-input" type="text" maxlength="1">')
        $("#number-fields").append(input);
    }
    // If a digit has been entered manually in the last field
    if (count > 0) {
        // Check the last input field
        check_input(count)
    }

    // Focus the newest input field
    $(".number-fields-input").last().focus();
}

function check_input(index) {
    input = $(".number-fields-input").eq(index);
    correct_digit = constant[index][(index-1).toString()]
    typed_digit = input.val();
    if (correct_digit == typed_digit) {
        console.log("Correct! You entered: " + typed_digit + ", the correct digit at that position is: " + correct_digit + "; index: " + (index-1).toString());
        input.css("background-color", "green");
    } else {
        console.log("Incorrect! You entered: " + typed_digit + ", the correct digit at that position is: " + correct_digit + "; index: " + (index-1).toString());
        input.css("background-color", "red");
    }
}