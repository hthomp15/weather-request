// trying to use a geolocation to get lat/lon coordinates
// var location = "london";
// var coordRequest = `http://api.openweathermap.org/geo/1.0/direct?q=London,UK&limit=5&appid=1c6a9b4261903a20ca46df884c067f7b`;
// fetch(coordRequest).then(function(response){
//     return console.log(response.json());
    
// })



let lon = "40.6782"
let lat = "73.9442"
var weatherData = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely&appid=1c6a9b4261903a20ca46df884c067f7b`

fetch(weatherData).then(function(response) {
    return console.log(response.json());
    
})