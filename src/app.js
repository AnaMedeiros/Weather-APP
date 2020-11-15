let key = "a655939222306992b42a3cc83e99e95d";

// Changing Day and Hour to present moment
let now = new Date();
let currentDay = now.getDay();
function displaydayOfWeek(timestamp) {
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let dayOfWeek = daysOfWeek[timestamp];
  return dayOfWeek;
}

let dayOfWeek = displaydayOfWeek(currentDay);
let currentDayPosition = document.querySelector("#currentDay");
currentDayPosition.innerHTML = `${dayOfWeek}, `;

function hoursFormate() {
  let currentHour = now.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }
  let currentMinutes = now.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  let hoursForm = `${currentHour}:${currentMinutes}`;

  return hoursForm;
}

let hour = hoursFormate();
let currentHourPosition = document.querySelector("#currentHour");
currentHourPosition.innerHTML = `${hour}`;

function displayForcastWeather(response) {
  for (index = 1; index < 6; index++) {
    document.querySelector(
      `#forcastDay${index}-temperature`
    ).innerHTML = `${Math.round(response.data.daily[index].temp.day)} ºC`;

    let forcastDayIconId = response.data.daily[index].weather[0].icon;
    let iconUrl = `http://openweathermap.org/img/wn/${forcastDayIconId}@2x.png`;
    document.getElementById(`forcastDay${index}-icon`).src = iconUrl;
    document.getElementById(`forcastDay${index}-icon`).alt =
      response.data.daily[index].weather[0].main;

    if (index > 1) {
      document.querySelector(
        `#forcastDay${index}-day`
      ).innerHTML = `${displaydayOfWeek(
        new Date(response.data.daily[index].dt * 1000).getDay()
      )}`;
    }
  }
}

function displayWeather(response) {
  // Update city
  let userLocation = document.querySelector("#userLocation");
  userLocation.innerHTML = response.data.name;
  // Update present temperature
  let userLocationTemperature = document.querySelector("#today-temperature");
  userLocationTemperature.innerHTML = Math.round(response.data.main.temp);
  // Set temperature primary unit and alternative
  let temperatureSymbol = document.querySelector("#temperature-symbol");
  temperatureSymbol.innerHTML = "ºC";
  let temperatureSymbolSwitch = document.querySelector(
    "#temperature-symbol-switch"
  );
  temperatureSymbolSwitch.innerHTML = "ºF";
  // Update humidity
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  // Update wind-speed
  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = `Wind Speed: ${response.data.wind.speed} m/s`;
  // Update weather description
  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = response.data.weather[0].main;
  // Update temperature icon
  let iconID = response.data.weather[0].icon;
  let iconUrl = `http://openweathermap.org/img/wn/${iconID}@2x.png`;
  document.getElementById("today-icon").src = iconUrl;
  document.getElementById("today-icon").alt = response.data.weather[0].main;
  // Find lat and long
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let urlForcast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
  axios.get(urlForcast).then(displayForcastWeather);
}

function defineUrl(city) {
  let urlMain = "https://api.openweathermap.org/data/2.5/weather?";
  let url = `${urlMain}q=${city}&appid=${key}&units=metric`;
  axios.get(url).then(displayWeather);
}

function selectedCityChange(event) {
  event.preventDefault();
  let input = document.querySelector("#selectedCity");
  let selectedCityPosition = document.querySelector("h3");
  selectedCityPosition.innerHTML = `${input.value}`;
  defineUrl(input.value);
}

let selectedCity = document.querySelector("#selected-city-form");
selectedCity.addEventListener("submit", selectedCityChange);

defineUrl("Porto");

// Changing C to F and VC

function celsiusToFahrenheit(event) {
  let todayTemperaturePosition = document.querySelector("#today-temperature");
  let todayTemperature = todayTemperaturePosition.innerHTML;

  let temperatureSymbolPosition = document.querySelector("#temperature-symbol");
  console.log(temperatureSymbolPosition);
  let temperatureSymbol = temperatureSymbolPosition.innerHTML;
  console.log(temperatureSymbol);

  let temperatureSymbolSwitchPosition = document.querySelector(
    "#temperature-symbol-switch"
  );

  if (temperatureSymbol === "ºC") {
    temperatureSymbolPosition.innerHTML = "ºF";

    let fahrenheitTemperature = Math.round(
      Number(todayTemperature) * (9 / 5) + 32
    );
    temperatureSymbolSwitchPosition.innerHTML = "ºC";
    todayTemperaturePosition.innerHTML = `${fahrenheitTemperature}`;
  } else {
    temperatureSymbolPosition.innerHTML = "ºC";

    let celsiusTemperature = Math.round(
      (Number(todayTemperature) - 32) * (5 / 9)
    );
    temperatureSymbolSwitchPosition.innerHTML = "ºF";
    todayTemperaturePosition.innerHTML = `${celsiusTemperature}`;
  }
}

document
  .getElementById("temperature-symbol-switch")
  .addEventListener("click", celsiusToFahrenheit);

// Update de temperute to where the user is clicking on you-are-here-img

function handleRequests(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude, longitude);
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;
  axios.get(url).then(displayWeather);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(handleRequests);
}

let buttonYouAreHereImg = document.querySelector("#you-are-here-img");
buttonYouAreHereImg.addEventListener("click", getCurrentPosition);
