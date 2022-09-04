$(document).ready(onReady);

function onReady() {
    console.log('JQ is hot');
    //click listeners
    $('.numbtn').on('click', addTerms); //numbers
    $('.opbtn').on('click',setOperator); //operators
    $('.clear').on('click',clearFields); //clear user input display field
    $('.equals').on('click', sendEquation); // '=' sends data
    $('.delete').on('click', clearHistory); // clears history
    $('.dec').on('click',  ()=>{decimalCounter ++; decimalToggle();}); //sets and toggles decimal
    $('#calculationHistory').on('click', '[id*=equation]',resubmitEquation); //allows user to re-submit past equations
    startWithEquationHistory();
    clearFields();

}

let equationInputArray = [];
let equation = {};
let selectedOperator = null;
let inputCounter = 0;
let decimalCounter = 0;

function inputToggle() { //prevents user input error
    if (inputCounter === 0) {
        $('.equals').prop('disabled', true);
        $('.opbtn').prop('disabled', true);
    } else if (inputCounter > 0 && selectedOperator === null) {
        $('.opbtn').prop('disabled', false);
        $('.equals').prop('disabled', true);
    } else if (inputCounter > 0 && selectedOperator !== null) {
        $('.equals').prop('disabled', false);
        $('.opbtn').prop('disabled', true);
    }
}

function decimalToggle() { //toggles decimal button
    if (decimalCounter === 1) {
        $('.dec').prop('disabled', true);
    } else {
        $('.dec').prop('disabled', false);
    }
}

function addTerms() { //pushes numeral and decimal inputs to input array and display field
    equationInputArray.push($(this).data('val')); //adds terms to input array
    $('#input_display').append($(this).data('val')); //adds terms to display field
    inputCounter ++;
    inputToggle();
    decimalToggle()
}

function setOperator() { //sets operator variable and resets counters
    selectedOperator = $(this).data('val'); //sets operator to global variable
    equationInputArray.push($(this).data('val')); // add 
    $('#input_display').append(` ${$(this).data('val')} `);
    inputCounter = 0;
    decimalCounter = 0;
    inputToggle();
    decimalToggle();
}

function createEquationObject() { //creates equation data object
    equationInputArray = equationInputArray.join('').split(`${selectedOperator}`);
    equation.operator = selectedOperator;
    equation.termOne = equationInputArray[0];
    equation.termTwo = equationInputArray[1];
}

function clearFields() { // clears display fields and all variables
    $('#input_display').empty();
    $('#solution_display').empty();
    equationInputArray = [];
    equation = {};
    selectedOperator = null;
    inputCounter = 0;
    decimalCounter = 0;
    inputToggle();
    decimalToggle();
}

function sendEquation() { // POST request to server
    createEquationObject();
    $.ajax({
        method: 'POST',
        url: '/calculate',
        data: equation
    }).then(function(serverStatus){
        console.log('response', serverStatus);
        getEquationSolution();
    })
    clearFields();
}

function getEquationSolution() { //GET request to server. recieves solution in array of equation objecs
    $.ajax({
        method: 'GET',
        url: '/calculate'
    }).then(function(equationSolutions){
        $('#solution_display').empty();
        $('#calculationHistory').empty();
        $('#solution_display').html(`
            ${equationSolutions[equationSolutions.length-1].solution}
        `);
        for (let i=0; i<equationSolutions.length; i++) {
            $('#calculationHistory').append(`
            <li id="equation${i}" 
                data-termone="${equationSolutions[i].termOne}" 
                data-termtwo="${equationSolutions[i].termTwo}" 
                data-operator="${equationSolutions[i].operator}">
                ${equationSolutions[i].termOne} ${equationSolutions[i].operator} ${equationSolutions[i].termTwo}
            </li>
            `);
        }
    });
}

function startWithEquationHistory() { //same as getEquationHistory but clears solution field.
    $.ajax({
        method: 'GET',
        url: '/calculate'
    }).then(function(equationSolutions){
        $('#solution_display').empty();
        $('#calculationHistory').empty();
        for (let i=0; i<equationSolutions.length; i++) {
            $('#calculationHistory').append(`
            <li id="equation${i}" 
                data-termone="${equationSolutions[i].termOne}" 
                data-termtwo="${equationSolutions[i].termTwo}" 
                data-operator="${equationSolutions[i].operator}">
                ${equationSolutions[i].termOne} ${equationSolutions[i].operator} ${equationSolutions[i].termTwo}
            </li>
            `);
        }
    });
}


function resubmitEquation() { //user can re-submit equation from history display
    $.ajax({
        method: 'POST',
        url: '/calculate',
        data: {
            termOne: $(this).data('termone'),
            termTwo: $(this).data('termtwo'),
            operator: $(this).data('operator'),
        }
    }).then(function(serverStatus){
        console.log('response', serverStatus);
        getEquationSolution();
    })
}

function clearHistory() { //DELETE request to server
    $.ajax({
        method: 'DELETE',
        url: '/delete',
    }).then(function(serverStatus){
        console.log('response', serverStatus);
        $('#calculationHistory').empty();
    })
    $('#solution_display').empty();
}
