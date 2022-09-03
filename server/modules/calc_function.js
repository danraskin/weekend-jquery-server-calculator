function calculateEquation (equation){
    if (equation.operator === '+') {
        equation.solution = Number(equation.termOne) + Number(equation.termTwo);
    } else if (equation.operator === '-') {
        equation.solution = Number(equation.termOne) - Number(equation.termTwo);
    }   else if (equation.operator === '*') {
        equation.solution = Number(equation.termOne) * Number(equation.termTwo);
    }   else if (equation.operator === '/') {
        equation.solution = Number(equation.termOne) / Number(equation.termTwo);
    }
    return equation;
}

module.exports = calculateEquation;