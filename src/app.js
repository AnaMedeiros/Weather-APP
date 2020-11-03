let key = "a655939222306992b42a3cc83e99e95d";

// Changing Day and Hour to present moment

let now = new Date();

let currentDay = now.getDay();

let daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

let dayOfWeek = daysOfWeek[currentDay];

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

// Changing h1 to selected City and search for local temperature

function displayWeather(response) {
  let userLocation = document.querySelector("#userLocation");
  userLocation.innerHTML = response.data.name;
  let userLocationTemperature = document.querySelector("#today-temperature");
  userLocationTemperature.innerHTML = Math.round(response.data.main.temp);
  let temperatureSymbol = document.querySelector("#temperature-symbol");
  temperatureSymbol.innerHTML = "ºC";
  let temperatureSymbolSwitch = document.querySelector(
    "#temperature-symbol-switch"
  );
  temperatureSymbolSwitch.innerHTML = "ºF";
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = `Wind Speed: ${response.data.wind.speed} m/s`;
  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = response.data.weather[0].main;
}

function defineUrl(city) {
  let urlMain = "https://api.openweathermap.org/data/2.5/weather?";
  let url = `${urlMain}q=${city}&appid=${key}&units=metric`;
  console.log(url);
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