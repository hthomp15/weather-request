// This will display the current weather on the index.html "current-weather"
var displayCurrentWeather = (weather_data)=>{
   
    var tempEl = document.querySelector(".temp");
    var windEl = document.querySelector(".wind");
    var humidEl = document.querySelector(".humid");
    var uviEl = document.querySelector(".uvi");
    // console.log(weather_data);
    tempEl.textContent += `${weather_data.current.temp}°F`;
    windEl.textContent += `${weather_data.current.wind_speed}mph`;
    humidEl.textContent += `${weather_data.current.humidity}%`;
    uviEl.textContent += weather_data.current.uvi;
    
}

// Uses first fetch data to display city 
// Uses javascript to display date
var displayCityAndDate = (data1)=>{
    var cityEl = document.querySelector(".city")
    var timeConverter = (timestamp)=>{
        // console.log(timestamp)
        var timestamp = timestamp.dt
        var a = new Date(timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        return`${month}/${date}/${year}`;
    }
    cityEl.textContent = `${data1.name} - ${timeConverter(data1)}`
    
}


// This will display the 5 day forecast
var displayExtendedForcast = (future_data)=>{
    console.log(future_data);
    for (let i = 1; i < 6; i++ ) {
        var weatherContainerEl = document.querySelector(".future-weather-cards");
        var cardContainerEl = document.createElement("div");
        var dateEl = document.createElement("h4");
        var forecastEl = document.createElement("span");

        function timeConverter(timestamp){
            console.log(timestamp)
            var a = new Date(timestamp * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            return`${month}/${date}/${year}`;
        }
        dateEl.textContent = timeConverter(future_data.daily[i].dt);
        forecastEl.textContent = `Temperature: ${future_data.daily[i].temp.day}\nWind Speed: ${future_data.daily[i].wind_speed}\nHumidity: ${future_data.daily[i].humidity}\nUV Index: ${future_data.daily[i].uvi}`;
        console.log(forecastEl, dateEl)
        cardContainerEl.setAttribute("class", "weather-card");
        cardContainerEl.appendChild(dateEl);
        cardContainerEl.appendChild(forecastEl);
        
        weatherContainerEl.appendChild(cardContainerEl);
        
        
        
     




    }
}



// Gets my weather by city name 
var getWeather = ()=> {
    var api_key = '1c6a9b4261903a20ca46df884c067f7b';
    var city_name = 'london';
    var weatherData = `http://api.openweathermap.org/data/2.5/weather?appid=${api_key}&q=${city_name}&units=imperial`;
    fetch(weatherData).then(function(response) {
         return response.json();
    }).then(function(data) {
        // console.log(data)
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        displayCityAndDate(data);
        getExtendedForcast(lat, lon);
        
    })
};



getWeather()
// gets an extended 5 day forecast of a specified location. 
// use lat and lon of city name fetch as inputs. 
var getExtendedForcast = (lat, lon)=> {
    var api_key = '1c6a9b4261903a20ca46df884c067f7b';
    var extendedData = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutes&exclude=alerts&appid=${api_key}&units=imperial`;

    fetch(extendedData).then(function(response) {
        return response.json();
    }).then(function(data) {
        // console.log(data);
        displayCurrentWeather(data);
        displayExtendedForcast(data);
    })
}

