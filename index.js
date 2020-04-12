// What constant is used, default is pi
var use = "π";

// Variable for the constant
var constant = "";
// Variable for correctly recalled numbers
var correct_count = 0;

$(document).ready(function () {
    setup();
});

function setup() {
    // Remove all the inputs
    $('.number-fields-input').each(function (i, obj) {
        $(this).remove();
    });
    recall_target = use;
    $(".recall-target").text(recall_target);
    // Get constant from json
    if (use == "π") {
        constant = JSON.parse(pi);
    } else if (use == "φ") {
        constant = JSON.parse(phi);
    } else if (use == "e") {
        constant = JSON.parse(e);
    }
    
    // Add the first digit (Not a decimal)
    add_input();
    // Add a second input field
    add_input();

    correct_count = 0;
    $("#correct-recall-indicator").text("")
}

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
        input = $('<input value="' + constant[0]["start"] + "." + '" style="background-color: #2F363F; border-color: #EEC213; color: #EEC213;" id="number-fields-input-num-' + count + '" oninput="add_input();" class="number-fields-input form-control" type="text" maxlength="2">')
        $("#number-fields").append(input);
    } else {
        // Add an empty input field
        input = $('<input id="number-fields-input-num-' + count + '" style="background-color: #2F363F;" oninput="add_input();" class="number-fields-input form-control" type="text" maxlength="1">')
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
        input.css("color", "#43BE31");
        input.css("border-color", "#43BE31");
        correct_count += 1;
        $("#correct-recall-indicator").text("You recalled " + correct_count + " digits correcty.")
    } else {
        console.log("Incorrect! You entered: " + typed_digit + ", the correct digit at that position is: " + correct_digit + "; index: " + (index-1).toString());
        input.css("color", "#D63031");
        input.css("border-color", "#D63031");
    }
}

// Functions to switch use
function switch_constant(param, sender) {
    use = param;
    setup();
    // Remove active from all entrys in header
    $('.active').each(function (i, obj) {
        $(this).removeClass("active");
    });
    $(sender).addClass("active");
}