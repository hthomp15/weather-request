// This will display the current weather on the index.html "current-weather"
var displayCurrentWeather = (weather_data)=>{
   
    var tempEl = document.querySelector(".temp");
    var windEl = document.querySelector(".wind");
    var humidEl = document.querySelector(".humid");
    var uviEl = document.querySelector(".uvi");
    console.log(weather_data);
    tempEl.textContent += `${weather_data.current.temp}°F`
    windEl.textContent += `${weather_data.current.wind_speed}mph`
    humidEl.textContent += `${weather_data.current.humidity}%`
    uviEl.textContent += weather_data.current.uvi
    
}
// Uses first fetch data to display city 
// Uses javascript to display date
var displayCityAndDate = (data1)=>{
    var cityEl = document.querySelector(".city")
        cityEl.textContent = data1.name
}


// This will display the 5 day forecast
var displayExtendedForcast = (future_data)=>{
    
}



// Gets my weather by city name 
var getWeather = ()=> {
    var api_key = '1c6a9b4261903a20ca46df884c067f7b'
    var city_name = 'london'
    var weatherData = `http://api.openweathermap.org/data/2.5/weather?appid=${api_key}&q=${city_name}&units=imperial`
    fetch(weatherData).then(function(response) {
         return response.json()
    }).then(function(data) {
        console.log(data)
        var lat = data.coord.lat
        var lon = data.coord.lon
        displayCityAndDate(data)
        getExtendedForcast(lat, lon)
        
    })
};



getWeather()
// gets an extended 5 day forecast of a specified location. 
// use lat and lon of city name fetch as inputs. 
var getExtendedForcast = (lat, lon)=> {
    var api_key = '1c6a9b4261903a20ca46df884c067f7b'
    var extendedData = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutes&exclude=alerts&appid=${api_key}&units=imperial`

    fetch(extendedData).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        displayCurrentWeather(data);
        
    })
}

