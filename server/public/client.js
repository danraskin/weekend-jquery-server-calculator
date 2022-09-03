$(document).ready(onReady);

function onReady (){
    console.log('JQ is hot');
    $('.numbtn').on('click', addTerms); //two button classes in case there is a better solution to building the data object
    $('.opbtn').on('click',setOperator);
    $('.clear').on('click',clearEquation);
    $('.equals').on('click', sendEquation);
    $('#calculationHistory').on('click', '[id*=equation]',resubmitEquation);
  
}

let equationInputArray = [];
let equation = {};
let selectedOperator = null;

function addTerms(){
equationInputArray.push($(this).data('val'));
$('#input_display').append($(this).data('val'));
console.log(equationInputArray);
}

function setOperator(){
    selectedOperator = $(this).data('val');
    equationInputArray.push($(this).data('val'));
    $('#input_display').append(` ${$(this).data('val')} `);
    $('.opbtn').prop('disabled',true);
}

function createEquationObject(){
        equationInputArray = equationInputArray.join('').split(`${selectedOperator}`);
        equation.operator = selectedOperator;
        equation.termOne = equationInputArray[0];
        equation.termTwo = equationInputArray[1];
}

function clearEquation () {
    $('#input_display').empty();
    equationInputArray = [];
    equation = {};
    selectedOperator = null;
    $('.opbtn').prop('disabled',false);
}

function sendEquation (){
    createEquationObject();
    $.ajax({
        method: 'POST',
        url: '/calculate',
        data: equation
    }).then(function(serverStatus){
        console.log('response', serverStatus);
        getEquationSolution();
    })
}

function getEquationSolution(){
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
                ${equationSolutions[i].termOne} ${equationSolutions[i].operator} ${equationSolutions[i].termTwo} = ${equationSolutions[i].solution}
            </li>
        `);
        }
    });
}

function resubmitEquation () {
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

function removeEquation(){
    console.log($(this));
    $.ajax({
        method: 'DELETE',
        url: '/delete',
    })
}
//#solution
//#calculationHistory