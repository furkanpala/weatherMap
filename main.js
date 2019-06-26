const API_KEY = "94e070be6b974d978eeb670ab2fa7fea";

const capitalsApi = "https://restcountries.eu/rest/v2/all";
let capitals = [];

const mymap = L.map('weatherMap').setView([39, 35], 4);
const attr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';
const tileURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
L.tileLayer(tileURL,{attribution : attr}).addTo(mymap);

async function getCapitals() {
    const data = await fetch(capitalsApi);
    const jsonData = await data.json();

    for(const data of jsonData) {
        const capitalName = data.capital;
        if (capitalName != "") {
            capitals.push(capitalName);
        }
    }
}

async function getWeather(capitalName) {
    const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capitalName}&APPID=${API_KEY}`);
    const jsonData = await weather.json();
    const cityData = {iconID:jsonData.weather[0].icon,pos:jsonData.coord,desc : jsonData.weather[0].description};
    return cityData;
}

async function plot(capitalName) {
    try {
        const cityData = await getWeather(capitalName);
        const iconURL = `http://openweathermap.org/img/w/${cityData.iconID}.png`;
        const myIcon = L.icon({
            iconUrl: iconURL,
            iconSize: [76, 76],
            iconAnchor: [38, 38],
        });
        L.marker([cityData.pos.lat,cityData.pos.lon],{icon:myIcon,title:cityData.desc}).addTo(mymap);
    }   
    catch(error) {
        console.log("Could not get the city " + capitalName);
    }
}
let i = 0;
let timer;
getCapitals().then(() => {
    timer = setInterval(() => {
        if (i == capitals.length) {
            clearInterval(timer);
        }
        else {
            plot(capitals[i]);
            document.getElementById("progress").innerText =  ((100 * (i + 1)) / capitals.length ).toFixed(2);
            i++;
        }
    }, 1000);
});