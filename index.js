const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');

const app = express();
app.use(express.static('public'));
app.use(express.json());
const APIkey='e61a13c3450875c77cf4e4e2a90e7451'

const database = new Datastore('database.db');
database.loadDatabase();

app.post('/api', async(req, res)=> {
    console.log(req.body);
    let data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data)
    res.json(data)
})

app.get('/api', (req, res) => {
    database.find({}, (err, data)=>{
        if(err) res.status(500).send("no data found")
        res.json(data)
    })
})

app.get('/weather/:latlon', async(request, response) => {
    console.log(request.param.latlon);
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0]
    const lon = latlon[1]
    let weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e61a13c3450875c77cf4e4e2a90e7451`
    const weatherData = await fetch(weatherAPI)
    const json = await weatherData.json()

    let airAPI = `http://api.openaq.org/v2/latest?coordinates=${lat},${lon}`
    const airData = await fetch(airAPI)
    const airJson = await airData.json()
    
    
    console.log(latlon)
    console.log(json)

    response.json({weather: json, air: airJson})
})

app.listen(3000, () => console.log('listening on 3000'));