const express = require("express");
const bodyParser = require('body-parser')
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
 
// parse application/json
app.use(bodyParser.json())
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=> {
    console.log(`server listening on port ${PORT}. Please open this URL http://localhost:5000 in the browser and \nappend any name example http://localhost:5000/Oliver` )
    require("./solutions")(app)
});