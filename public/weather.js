const submit = document.getElementById('submit');
let lat, lon

window.addEventListener('load', setup());

submit.addEventListener('click', checkin);

function setup(){
    var mymap = L.map('mapid').setView([-50, 147], 13);
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contribut'
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, {attribution});
    tiles.addTo(mymap);

    if('geolocation' in navigator){
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(async position=>{
            console.log(position);
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            document.getElementById('latitude').textContent = lat;
            document.getElementById('longitude').innerHTML = lon;
            var marker = L.marker([lat, lon]).addTo(mymap);

            mymap.setView([lat, lon], 11);

            let weatherAPI = `/weather/${lat},${lon}`;
            const response = await fetch(weatherAPI);
            const json = await response.json();
            console.log(json);
            marker.bindPopup(`<b>${json.weather.name}</b><br>${json.weather.main.temp}<br>${json.air.results[0].measurements[0].value}`).openPopup();
            
            
            console.log(json);

            });

        }
        else{
            console.log('geolocation not available');
        }
    }

async function checkin(){
    console.log("test")
    const data = {lat, lon};
    const options = {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    const response = await fetch("http://localhost:3000/api", options)
    console.log(await response.json())
}
