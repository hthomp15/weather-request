var searchbtnEl = document.querySelector("#search-bar")
var cityInputEl = document.querySelector("#city-search")
var forecastContainerEl = document.querySelector("#future-weather-cards");
var searchList = document.querySelector(".saved-locations")
var listCityEl = document.querySelector(".city-list")


var currentWeatherEl = document.querySelector(".current-weather")
var currentBox = document.querySelector(".weather-box")
var uviValue = document.createElement("span")
var currentWeatherSpanEl = document.createElement("span")
var cityEl = document.createElement("h4")

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
    
    // console.log(weather_data);
    currentWeatherSpanEl.innerHTML = `Temperature: ${weather_data.current.temp}°F\nWind Speed: ${weather_data.current.wind_speed}\nHumidity: ${weather_data.current.humidity}\n UV Index:`;
    uviValue.innerHTML = weather_data.current.uvi;
    uviValue.setAttribute("class", "uv-index")
    currentBox.appendChild(currentWeatherSpanEl);
    currentBox.appendChild(uviValue);

    if(weather_data.daily[0].uvi < 2){
        uviValue.style.backgroundColor = "green";
        
    }else if (weather_data.daily[0].uvi < 5){
        uviValue.style.backgroundColor = "yellow";
       
    } else {
        uviValue.style.backgroundColor = "red";
        
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

var forecastBoxEl = document.querySelectorAll("#future-weather-box")
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
        // cityEl.textContent = `${future_data.name} - ${timeConverter(future_data)}`
        //  currentBox.appendChild(cityEl);
        // Create the DOM items to append to the index.html
        dateEl.innerHTML = timeConverter(future_data.daily[i+1].dt);
        forecastEl.innerHTML = `Temperature: ${future_data.daily[z].temp.day}°F\nWind Speed: ${future_data.daily[z].wind_speed}\nHumidity: ${future_data.daily[z].humidity}\n UV Index:`;
        uviEl.innerHTML = ` ${future_data.daily[z].uvi}`
        uviEl.setAttribute("class", "uv-index");
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

// List the array into the search history sidebar
// function listArray() {
//     // Empty out the elements in the sidebar
//     // Repopulate the sidebar with each city
//     // in the array
//     cityList.forEach(function(city){
//         var searchHistoryItem = document.createElement("li").setAttribute("class", "list-item");
//         searchHistoryItem.attr("data-value", city);
//         searchHistoryItem.text(city);
//         searchList.prepend(searchHistoryItem);
//     });
//     // Update city list history in local storage
//     localStorage.setItem("cities", JSON.stringify(cityList));
    
// }


// Display and save the search history of cities
var saveHistory = (search)=> {
    // Grab value entered into search bar 
    var search = cityInputEl.value
    listEl = document.createElement("button");
    listEl.textContent = search;
    listEl.classList = "d-flex w-100 btn-light border p-2 mt-2"
    listEl.setAttribute("type", "submit");
    listEl.setAttribute("data-search", search)
    listCityEl.appendChild(listEl)

    if (!cityList.includes(search)){
        cityList.push(search);
    }
    localStorage.setItem("cities", cityList);
}   
// var getHistory = ()=> {
//     var savedCities = JSON.parse(localStorage.getItem("cities"));
    
//     for (i = 0; i < cityList.length; i++) {
//         var cityEl = document.createElement("li")
//         cityEl.textContent = `${savedCities[i]}`;
//         listCityEl.appendChild(cityEl)
//     }
// }
// getHistory()


searchbtnEl.addEventListener("submit", searchCityHandler);
searchList.addEventListener("click", pastSearchHandler);
  