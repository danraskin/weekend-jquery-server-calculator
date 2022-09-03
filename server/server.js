const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('server/public'));

const calculationHistory = require('./modules/calculations.js')
const calculateEquation = require('./modules/calc_function.js')

// ROUTES BELOW HERE

app.post('/calculate', (req, res) => {
    console.log('POST route /calculate request received. req.body is: ', req.body);
    let newCalc = req.body;
    console.log('new data object is:', calculateEquation(newCalc));
    calculationHistory.push(newCalc);
    console.log(calculationHistory);
    res.sendStatus(201);
});

app.get('/calculate', (req, res) => {
    res.send(calculationHistory);
});

app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`)
 });

