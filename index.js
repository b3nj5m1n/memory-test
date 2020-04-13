// What constant is used, default is pi
var use = "π";

// Variable for the constant (JSON will be stored in this)
var constant = "";
// Variable for correctly recalled numbers
var correct_count = 0;
// Variable to store how many digits to group together
var group_count_user = 3;

// Called when the document has finished loading
$(document).ready(function () {
    setup_ui();
});

// Function to remove all inputs on the screen
function clear_inputs() {
    $('.input_group').each(function (i, obj) {
        $(this).remove();
    });
    $('.number-fields-input').each(function (i, obj) {
        $(this).remove();
    });
}

// Function to setup all of the elements, except for the intput fields
function setup_ui() {
    // Get value of how many input fields need to be adeed
    num_of_digits = $("#recall-digits-count").val();
    // Get the value for how many digits to group together
    group_count_user = $("#input-group-count").val()
    // Hide the progress bar
    $("#progress-bar-digits-recalled-container").addClass("hidden");
    // Unhide the config
    $("#user-config").removeClass("hidden");
    // Hide submit button
    $("#submit-numbers-btn").addClass("hidden");
    // Remove all the inputs
    clear_inputs();
    // Put the symbol of the constant to use in the text under the navbar
    recall_target = use;
    $(".recall-target").text(recall_target);
    // Hide the text saying how many numbers have been correctly recalled
    $("#correct-recall-indicator").text("")
    // Reset the progress bar
    $("#progress-bar-digits-recalled").css("width", "0%")
}

// Function called when a new recall session is started
function setup() {
    setup_ui();
    // Hide config
    $("#user-config").addClass("hidden");
    // Show progress bar
    $("#progress-bar-digits-recalled-container").removeClass("hidden");
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
    // Add the input fields in groups
    add_inputs_groups(num_of_digits, group_count_user);
    // Show submit button
    $("#submit-numbers-btn").removeClass("hidden");
    // Set correct count to 0
    correct_count = 0;
}

// Function called by the submit button
function submit() {
    // Function to count the input fields
    count = -1
    // Make all the inputs read only
    $('.number-fields-input').each(function (i, obj) {
        $(this).prop("readonly", true);
        // If the current input is not the first one (Conatining the predetermined value, for pi for example it would be 3.)
        if (count > -1) {
            // Check if the user input is correct
            check_input(count + 1);
        }
        // Increase the count
        count += 1;
    });
    // Hide the progress bar
    $("#progress-bar-digits-recalled-container").addClass("hidden");
    // Unhide the button allowing you to start a new session
    $("#user-config").removeClass("hidden");
}

// Function to automatically create all necessary input groups
function add_inputs_groups(input_count, group_size) {
    // If the input is not valid, so 0 or lower
    if (group_size < 1) {
        // Make the group size as big as the input count, hence creating one giant group for all inputs
        group_size = input_count;
    }
    // Add the inital input field, which is not a decimal point (The parent does not matter in this case)
    add_input(1, -1)
    // Calculate how many groups will be needed to get the desired number of fields
    num_of_groups = input_count / group_size;
    // Add all necessary input groups
    for (let current_group = 0; current_group < num_of_groups; current_group++) {
        add_input_group(group_size, current_group);
    }
}

// Add an input group (A div containing multiple input fields, to be able to put spacing between pairs of 3's, 6's, and so on), group_index being the index of the current group
function add_input_group(group_size, group_index) {
    // Create DOM element for the group
    input_group = $('<div class="input_group"></div>');
    // Add as many inputs as specified
    for (let current_field = 0; current_field < group_size; current_field++) {
        add_input(input_group, group_index * group_size + current_field);
    }
    // Append the input group to the number fields div
    $("#number-fields").append(input_group);
}

// Function to add a new input field, parent being the input group to add to and curr the current index
function add_input(parent, curr) {
    // If this input is the first input, it should contain the value before the .
    if (curr == -1) {
        // Add special input field containing that value, read only with custom colors
        input = $('<input value="' + constant[0]["start"] + "." + '" style="background-color: #2F363F; border-color: #EEC213; color: #EEC213;" id="number-fields-input-num-start" oninput="add_input();" class="number-fields-input form-control" readonly="true" type="text" maxlength="2">')
        // Add the input to the number-fields div
        $("#number-fields").append(input);
    } else {
        // Add an empty input field
        input = $('<input id="number-fields-input-num-' + curr + '" style="background-color: #2F363F;" onkeydown="on_input(this); //add_input();" class="number-fields-input form-control" type="text" maxlength="1">')
        // Append the input field to the parent (An input group)
        $(parent).append(input);
    }
}

// Function called when a key is pressed inside one of the input fields
function on_input(sender) {
    // Get what key has been pressed, complicated because keycodes for numpad keys are weird
    var keyCode = event.keyCode || event.which;
    if (keyCode >= 96 && keyCode <= 105) {
        // Subtract to get from numpad keys to numbers
        keyCode -= 48;
    }
    // If backspace has been pressed
    if (keyCode == 8) {
        // Focus the previous input
        focus_prev(sender);
    }
    // Convert the number to a string
    var number = String.fromCharCode(keyCode);
    // Set the key previous on the input to the value currently in it
    $(sender).data('previous', $(sender).data("current"));
    // Set the key current on the input to the key that has been pressed
    $(sender).data('current', number);
    // If the key pressed was not backspace
    if (keyCode != 8) {
        // Focus the next input
        focus_next(sender);
        // Prevent the keydown event from producing a char (This would be put in the new input field)
        event.preventDefault();
        // Set the value for the input field where the value was originally entered
        set_input(get_input_index(sender), $(sender).data("current"))
    }
    // Adjust the progress bar
    update_progress();
}

// Function to focus an input field based on index
function focus_input(index_to_focus) {
    // Variable to count what the current index is while looping over the input fields
    var index = -1
    // Loop over input fields
    $('.number-fields-input').each(function (i, obj) {
        // If the current index is matching the one passed as a parameter
        if (index == index_to_focus) {
            // Focus the current input field
            $(this).focus();
        }
        // Set the current index to i
        index = i;
    });
}

// Function to set the value of an input field based on index
function set_input(index_to_delete, value_to_set) {
    // Variable to count what the current index is while looping over the input fields
    var index = -1
    // Loop over input fields
    $('.number-fields-input').each(function (i, obj) {
        // If the current index is matching the one passed as a parameter
        if (index == index_to_delete) {
            // Set the value of the current input field
            $(this).val(value_to_set);
        }
        // Set index to i
        index = i;
    });
}

// Functoin to get the index of an input field
function get_input_index(sender) {
    // Variable to store the result to return
    result = -1;
    // Loop over input fields
    $('.number-fields-input').each(function (i, obj) {
        // If the id of the current input field is matching the id of the input field passed as a parameter
        if ($(sender).attr('id') == $(this).attr('id')) {
            // Set the result to i
            result = i;
        }
    });
    // Return the result
    return result - 1;
}

// Function to focus the next input field relative to the one passed as a parameter & delete the value in that next input field
function focus_next(sender) {
    // Focus the input at the index after the index of the current input field
    focus_input(get_input_index(sender) + 1);
    // Set the text of the new input field to nothing
    set_input(get_input_index(sender) + 1, "");
}
// Function to focus the previous input field relative to the one passed as a parameter & delete the value in that previous input field
function focus_prev(sender) {
    if (get_input_index(sender) != 0) {
        // Focus the input at the index before the index of the current input field
        focus_input(get_input_index(sender) - 1);
        // Set the text of the new input field to nothing
        set_input(get_input_index(sender) - 1, "");
        // Set the text of the current input field to nothing, just in case there was something there
        set_input(get_input_index(sender), "");
    }
}

// Function to check if the value entered in an input field at the index passed as a parameter is correct
function check_input(index) {
    // Get the input at that index
    input = $(".number-fields-input").eq(index);
    // Get the digit that would be correct at that position
    correct_digit = constant[index][(index - 1).toString()]
    // Get the digit that was actually typed at that position
    typed_digit = input.val();
    // If the digit is correct
    if (correct_digit == typed_digit) {
        // console.log("Correct! You entered: " + typed_digit + ", the correct digit at that position is: " + correct_digit + "; index: " + (index - 1).toString());
        // Set the input's color to green
        input.css("color", "#43BE31");
        // Set the input's border's color to green
        input.css("border-color", "#43BE31");
        // Add one to the variable keeping track of how many digits were correct
        correct_count += 1;
        // Update the text displaying how many digits were recalled correctly
        $("#correct-recall-indicator").text("You recalled " + correct_count + " digits correcty.")
    } else {
        // console.log("Incorrect! You entered: " + typed_digit + ", the correct digit at that position is: " + correct_digit + "; index: " + (index - 1).toString());
        // Set the input's color to red
        input.css("color", "#D63031");
        // Set the input's border's color to red
        input.css("border-color", "#D63031");
        // Create a tooltip to show the correct digit when hovering
        input.attr("data-toggle", "tooltip")
        input.attr("data-placement", "top")
        input.attr("title", correct_digit)
    }
}

// Functions to switch the used constant
function switch_constant(param, sender) {
    // Set the use variable to the supplied parameter
    use = param;
    // Load the ui
    setup_ui();
    // Remove all current inputs
    clear_inputs();
    // Remove the active class from all elements that have it
    $('.active').each(function (i, obj) {
        $(this).removeClass("active");
    });
    // Set the active class on the element that was clicked
    $(sender).addClass("active");
}

// Function to update the progress bar
function update_progress() {
    // Variable for how many inputs exist in total
    total = 0;
    // Variable for how many inputs have something in them
    containing = 0;
    // Loop over all inputs
    $('.number-fields-input').each(function (i, obj) {
        // If the input is not empty (Contains something)
        if ($(this).val() != "") {
            // Increment
            containing++;
        }
        // Increment total
        total++;
    });
    // Calculate how many percent of fields are filled with something
    percent = (containing / total) * 100;
    // Adjust the progress bar accordingly
    $("#progress-bar-digits-recalled").css("width", percent.toString() + "%")
}

// Enable tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
// Enable popovers
$(function () {
    $('[data-toggle="popover"]').popover()
})

// Function to save input's value on focus
$('input').on('focusin', function () {
    $(this).data('current', $(this).val());
});