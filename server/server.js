const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('server/public'));

let calculationHistory = require('./modules/calculations.js')
const calculateEquation = require('./modules/calc_function.js')

// ROUTES BELOW HERE

app.post('/calculate', (req, res) => {
    console.log('POST route /calculate request received. req.body is: ', req.body);
    let newCalc = req.body;
    newCalc=calculateEquation(newCalc);
    calculationHistory.push(newCalc);
    res.sendStatus(201);
});

app.get('/calculate', (req, res) => {
    res.send(calculationHistory);
});

app.delete('/delete', (req, res) => {
    calculationHistory = [];
    res.sendStatus(201);
});

app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`)
 });

