$(document).ready(onReady);

function onReady() {
    console.log('JQ is hot');
    //click listeners
    $('.numbtn').on('click', addTerms); //numbers
    $('.opbtn').on('click',setOperator); //operators
    $('.clear').on('click',clearFields); //clear user input display field
    $('.equals').on('click', sendEquation); // '=' sends data
    $('.delete').on('click', clearHistory); // clears history
    $('#calculationHistory').on('click', '[id*=equation]',resubmitEquation); //allows user to re-submit past equations
    inputToggle();
}

let equationInputArray = [];
let equation = {};
let selectedOperator = null;
let inputCounter = 0;

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

function addTerms() {
    equationInputArray.push($(this).data('val')); //adds terms to input array
    $('#input_display').append($(this).data('val')); //adds terms to display field
    inputCounter ++;
    inputToggle();
}

function setOperator() {
    selectedOperator = $(this).data('val'); //sets operator to global variable
    equationInputArray.push($(this).data('val')); // add 
    $('#input_display').append(` ${$(this).data('val')} `);
    inputCounter = 0;
    inputToggle();
}

function createEquationObject() {
    equationInputArray = equationInputArray.join('').split(`${selectedOperator}`);
    equation.operator = selectedOperator;
    equation.termOne = equationInputArray[0];
    equation.termTwo = equationInputArray[1];
}

function clearFields() {
    $('#input_display').empty();
    equationInputArray = [];
    equation = {};
    selectedOperator = null;
    inputCounter = 0;
    inputToggle();
}

function sendEquation() {
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

function getEquationSolution() {
    $.ajax({
        method: 'GET',
        url: '/calculate'
    }).then(function(equationSolutions){
        $('#solution').empty();
        $('#calculationHistory').empty();
        $('#solution').html(`
            ${equationSolutions[equationSolutions.length-1].solution}
        `);
        for (let i=0; i<equationSolutions.length; i++) {
            $('#calculationHistory').prepend(`
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

function resubmitEquation() {
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

function clearHistory() {
    $.ajax({
        method: 'DELETE',
        url: '/delete',
    }).then(function(serverStatus){
        console.log('response', serverStatus);
        $('#calculationHistory').empty();
    })
    $('#solution').empty();
}
