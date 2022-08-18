const connectToMongo = require('./db')
const fs = require('fs');
// const path = -require('');
const path = require('path')
const cors = require('cors')
const express = require("express");
const app = express();
const port = 5000;
const bodyparser = require('body-parser')
const RouteStore = require('./models/Routes')
const { body, validationResult } = require('express-validator');
var http = require("http");


setInterval(function() {
    http.get("http://shotifylink.herokuapp.com/awake");
},250000); 


app.use(express.static('static'))
app.use(bodyparser.urlencoded())


app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.static('static'))
app.use(bodyparser.json()); // support json encoded bodies
app.use(bodyparser.urlencoded({ extended: true })); // support encoded bodies

connectToMongo();

app.get('/:code', async (req, res) => {
    if (req.params.code.length > 22) {
        return res.redirect('/sorry/notFound');
    }
    try {
        const details = await RouteStore.findOne({ identifier: req.params.code })
        if (!details) {
            return res.redirect('/sorry/notFound');
        }
        res.redirect(details.urladdress)

    } catch (error) {
        console.log(error)
    }

})

// validation lagane haii 
// input mila ya blank haii 
// url sahi haii ya ni
// uppercase ko lowecase krna haii
app.post('/new', [
    body('identifier', 'Enter a valid identifier').exists(),
    body('url', 'Enter valid URL').exists(),
    body('identifier', 'Enter a valid identifier of min length 3 ').isLength({ min: 3 }),
    body('identifier', 'Enter a valid identifier of max length 20 ').isLength({ max: 20 }),
    body('url', 'Enter valid URL').isLength({ min: 8 }),
    body('url', 'Enter valid URL').isURL()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.errors[0].msg)
        return res.render("home", { error: errors.errors[0].msg });
    }

    if(req.body.identifier === 'new'){
        return res.render("home", { error: "Not available"});
    }

    try {
        console.log('called');
        const details = await RouteStore.findOne({ identifier: req.body.identifier })
        if (details) {
            console.log("Returning");
            return res.render("home", { error: "Already Exist, Try other one !" });
        }
        let route = await RouteStore.create({
            identifier: req.body.identifier,
            urladdress: req.body.url
        })

        console.log(route)
        // res.json({ route });
        res.render("home", { message: `URL : https://shotifylink.herokuapp.com/${req.body.identifier}` });

    } catch (error) {
        console.log(error)
    }
})



app.get('/sorry/notFound', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/Notfound.html'));
})
app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname + '/views/test2.html'));
    res.render("home")
})

app.listen(process.env.PORT || port, () => {
    console.log(`Server started on  port ${port}`);
})


