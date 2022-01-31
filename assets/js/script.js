var searchbtnEl = document.querySelector(".searchbtn")
var cityInputEl = document.querySelector(".search-input")
var forecastContainerEl = document.querySelector(".future-weather-cards");

var currentWeatherEl = document.querySelector(".current-weather")
var currentBox = document.querySelector(".weather-box")
var uviValue = document.createElement("span")
var currentWeatherSpanEl = document.createElement("span")
var cityEl = document.createElement("h4")



// This will display the current weather on the index.html "current-weather"
var displayCurrentWeather = (weather_data)=>{
    
    // var tempEl = document.querySelector(".temp");
    // var windEl = document.querySelector(".wind");
    // var humidEl = document.querySelector(".humid");
    // var uviContainerEl = document.querySelector(".uvi");
    

    // console.log(weather_data);
    currentWeatherSpanEl.innerHTML = `Temperature: ${weather_data.current.temp}°F\nWind Speed: ${weather_data.current.wind_speed}\nHumidity: ${weather_data.current.humidity}\n UV Index:`;
    // tempEl.textContent += `${weather_data.current.temp}°F`;
    // windEl.textContent += `${weather_data.current.wind_speed}mph`;
    // humidEl.textContent += `${weather_data.current.humidity}%`;
    uviValue.innerHTML = weather_data.current.uvi;
    currentBox.appendChild(currentWeatherSpanEl);
    currentBox.appendChild(uviValue);
    // uviContainerEl.appendChild(uviValue);
    if(weather_data.daily[0].uvi < 2){
        uviValue.style.backgroundColor = "green";
        uviValue.style.display = "inline";
        uviValue.style.padding = "5px";
        uviValue.style.borderRadius = "10px";
    }else if (weather_data.daily[0].uvi < 5){
        uviValue.style.backgroundColor = "yellow";
        uviValue.style.display = "inline";
        uviValue.style.padding = "5px";
        uviValue.style.borderRadius = "10px";
    } else {
        uviValue.style.backgroundColor = "red";
        uviValue.style.display = "inline";
        uviValue.style.padding = "5px";
        uviValue.style.borderRadius = "10px";
    }
    
}

// Uses first fetch data to display city 
// Uses javascript to display date
var displayCityAndDate = (data1)=>{
   
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
    currentBox.appendChild(cityEl);
    
}

var forecastBoxEl = document.querySelectorAll(".future-weather-box")
// This will display the 5 day forecast
var displayExtendedForcast = (future_data)=>{
    // console.log(future_data);
    for (let i = 0; i < forecastBoxEl.length ; i++ ) {
        var z = 1;
        var dateEl = document.createElement("h4");
        var forecastEl = document.createElement("span");
        var uviEl = document.createElement("span");
        var iconEl = document.createElement("img");
        var iconUrl = `http://openweathermap.org/img/w/${future_data.daily[z].weather[0].icon}.png`
        forecastBoxEl[i].innerHTML = "";
        function timeConverter(timestamp){
            // console.log(timestamp)
            var a = new Date(timestamp * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            return`${month}/${date}/${year}`;
        }
        // Create the DOM items to append to the index.html
        dateEl.innerHTML = timeConverter(future_data.daily[i+1].dt);
        forecastEl.innerHTML = `Temperature: ${future_data.daily[z].temp.day}°F\nWind Speed: ${future_data.daily[z].wind_speed}\nHumidity: ${future_data.daily[z].humidity}\n UV Index:`;
        uviEl.innerHTML = ` ${future_data.daily[z].uvi}`
        // console.log(forecastEl, dateEl)
        iconEl.setAttribute("src", iconUrl)
        // console.log(iconEl);
        forecastEl.appendChild(uviEl);
        forecastBoxEl[i].setAttribute("class", "weather-card");
        forecastBoxEl[i].appendChild(dateEl);
        forecastBoxEl[i].appendChild(iconEl);
        forecastBoxEl[i].appendChild(forecastEl);

        // Conditional to make the uv index background color
        if(future_data.daily[z].uvi < 2){
            uviEl.style.backgroundColor = "green";
            uviEl.style.display = "inline";
            uviEl.style.padding = "5px";
            uviEl.style.borderRadius = "10px";
        }else if (future_data.daily[z].uvi < 5){
            uviEl.style.backgroundColor = "yellow";
            uviEl.style.display = "inline";
            uviEl.style.padding = "5px";
            uviEl.style.borderRadius = "10px";
        } else {
            uviEl.style.backgroundColor = "red";
            uviEl.style.display = "inline";
            uviEl.style.padding = "5px";
            uviEl.style.borderRadius = "10px";
        }
        
    }
    
}

// Local Storage and adding cities to favorites list
var saveSearch = ()=> {
    // Add clear search function for add get weather
}

// Gets my weather by city name 
var getWeather = ()=> {
    var api_key = '1c6a9b4261903a20ca46df884c067f7b';
    var weatherData = `http://api.openweathermap.org/data/2.5/weather?appid=${api_key}&q=${cityInputEl.value}&units=imperial`;
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

searchbtnEl.addEventListener("click", getWeather);
