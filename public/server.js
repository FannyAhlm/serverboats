const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 1337;

const {
    getBoats,
    getThisBoat,
    createBoat,
    deleteBoat,
    checkDB,
    searchBoats
} = require("./databasskiten.js");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html');
})

app.get('/boats/', (req, res) =>{
    getBoats( boats => res.send(boats));
})

app.get('/boat/', (req , res) => {
    getThisBoat(req.query.id, boat => res.send(boat));
})

app.post('/boat/', (req, res) => {
    createBoat(req.body, newBoat => res.send(newBoat));
})

app.delete('/boat/', (req, res) =>{
    deleteBoat(req.query.id, deleteBoat => res.send(deleteBoat));
})

app.get('/search/', (req, res) => {
    console.log(req.query);
    searchBoats(req.query, boats => res.send(boats));
})

checkDB();

app.listen(PORT, ()=>{
    console.log("servern startad");
})