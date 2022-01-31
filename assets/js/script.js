var searchbtnEl = document.querySelector("#search-bar");
var cityInputEl = document.querySelector("#city-search");
var searchList = document.querySelector(".saved-locations");
var listCityEl = document.querySelector(".city-list");
var forecastBoxEl = document.querySelectorAll("#future-weather-box");

var cityDateEl = document.querySelector(".city-date");
var clearHistoryBtn = document.querySelector("#clear-history");

var tempEl = document.querySelector(".temp");
var windEl = document.querySelector(".wind-speed");
var humidEl = document.querySelector(".humidity");
var uviEl = document.querySelector(".uvi");
var iconEl = document.querySelector(".icon");
// var uvibgEl = document.querySelector(".uvi-blackground")

var searchCityHandler = function(event) {
    event.preventDefault();
    //console.log(event);
    //get value from input element
    var cityName = cityInputEl.value.trim();
    if(cityName) {
        getWeather(cityName);
        saveHistory();
        cityInputEl.value = "";
    } else {
        alert("Plaese enter a city name")
    }
}

var pastSearchHandler = function (event) {
    event.stopPropagation() 
    // console.log(event)
    var city = event.target.getAttribute("data-search")
    if (city){
        getWeather(city)
    }
}

// This will display the current weather on the index.html "current-weather"
var displayCurrentWeather = (weather_data)=>{
    var currentWeatherSpanEl = document.createElement("span")
    var uvibgEl = document.createElement("span")
    var iconUrl = `http://openweathermap.org/img/w/${weather_data.daily[0].weather[0].icon}.png`
    iconEl.setAttribute("src", iconUrl);
    currentWeatherSpanEl.innerHTML = `Temperature: ${weather_data.current.temp}°F\rWind Speed: ${weather_data.current.wind_speed}\rHumidity: ${weather_data.current.humidity}\r UV Index:`;
    uvibgEl.innerHTML = weather_data.current.uvi;
    uvibgEl.setAttribute("class", "uvi-bg")
    tempEl.innerHTML = `Temperature: ${weather_data.current.temp}°F`
    windEl.innerHTML = `Wind Speed: ${weather_data.current.wind_speed}`
    humidEl.innerHTML = `Humidity: ${weather_data.current.humidity}`
    uviEl.textContent = "UV Index: "

    uviEl.appendChild(uvibgEl);

    if(weather_data.daily[0].uvi < 2){
        uvibgEl.style.backgroundColor = "green";
        
    }else if (weather_data.daily[0].uvi < 5){
        uvibgEl.style.backgroundColor = "yellow";
       
    } else {
        uvibgEl.style.backgroundColor = "red"; 
    }
}
 
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
    cityDateEl.innerHTML = `${data1.name} - ${timeConverter(data1)}` 
}

// This will display the 5 day forecast
var displayExtendedForcast = (future_data)=>{
    // console.log(future_data);
    // Loop through forecast divs, create elements, assign data value, append them to the div
    for (let i = 0; i < forecastBoxEl.length; i++) {
        var z = i + 1;
        // Create elements to append to forecase divs
        var dateEl = document.createElement("h4");
        var tempEl = document.createElement("p");
        var windEl = document.createElement("p");
        var humidEl = document.createElement("p");
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
        dateEl.innerHTML = timeConverter(future_data.daily[i+1].dt);
        tempEl.innerHTML = `Temperature: ${future_data.daily[z].temp.day}°F`
        windEl.innerHTML = `Wind Speed: ${future_data.daily[z].wind_speed}`
        humidEl.innerHTML = `Humidity: ${future_data.daily[z].humidity}`
        iconEl.setAttribute("src", iconUrl)
        forecastBoxEl[i].setAttribute("class", "weather-card");
        forecastBoxEl[i].appendChild(dateEl);
        forecastBoxEl[i].appendChild(iconEl);
        forecastBoxEl[i].appendChild(tempEl);
        forecastBoxEl[i].appendChild(windEl);
        forecastBoxEl[i].appendChild(humidEl);
    }  
}
// Gets my weather by city name 
var getWeather = (searchValue)=> {
    var api_key = '1c6a9b4261903a20ca46df884c067f7b';
    var weatherData = `http://api.openweathermap.org/data/2.5/weather?appid=${api_key}&q=${searchValue}&units=imperial`;
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
// Array for local storage access
var cityList = []
// Display and save the search history of cities
var saveHistory = (search)=> {
    // Grab value entered into search bar 
    var search = cityInputEl.value
    listEl = document.createElement("button");
    listEl.textContent = search;
    listEl.classList = "saveBtn w-100 btn-light border border-primary text-center p-2 mt-2"
    listEl.setAttribute("type", "submit");
    listEl.setAttribute("data-search", search)
    listCityEl.appendChild(listEl)

    if (!cityList.includes(search)){
        cityList.push(search);
    }
    JSON.parse(localStorage.setItem("cities", JSON.stringify(cityList)));
}   
// Save searches on page refresh
var getHistory = ()=> {
    var savedCities = JSON.parse(localStorage.getItem("cities")) ?? [];

    for (i = 0; i < savedCities.length; i++) {
        var cityEl = document.createElement("button");
        cityEl.classList = "saveBtn w-100 btn-light border border-primary text-center p-2 mt-2";
        cityEl.setAttribute("type", "submit");
        cityEl.setAttribute("data-search", savedCities[i]);
        cityEl.textContent = `${savedCities[i]}`;
        listCityEl.appendChild(cityEl)
    }
}
getHistory()
searchbtnEl.addEventListener("submit", searchCityHandler);
searchList.addEventListener("click", pastSearchHandler);
clearHistoryBtn.addEventListener("click", function(){
    // console.log(listCityEl.childNodes)
    var child = listCityEl.lastElementChild;
    while (child) {
        listCityEl.removeChild(child);
        child = listCityEl.lastElementChild;
    }
    localStorage.removeItem("cities");
})