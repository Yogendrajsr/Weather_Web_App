const apiKey = '43518e510c574bfe956164346232809'; 

const submitButton = document.getElementById('submit-btn');
const locationInput = document.getElementById('location-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastWeatherDiv = document.getElementById('forecast-weather');

submitButton.addEventListener('click', () => {
  const location = locationInput.value;
  if (location.trim() === '') {
    alert('Please enter a location');
    return;
  }

  fetchWeather(location);
});

async function fetchWeather(location) {
    const currentWeatherURL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;
    const xhrCurrentWeather = new XMLHttpRequest();
    xhrCurrentWeather.open('GET', currentWeatherURL, true);
  
    xhrCurrentWeather.onload = function () {
      if (xhrCurrentWeather.status === 200) {
        const currentWeatherData = JSON.parse(xhrCurrentWeather.responseText);
        displayCurrentWeather(currentWeatherData);
  
        // Fetch forecast weather data
        const forecastWeatherURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;
        const xhrForecastWeather = new XMLHttpRequest();
        xhrForecastWeather.open('GET', forecastWeatherURL, true);
  
        xhrForecastWeather.onload = function () {
          if (xhrForecastWeather.status === 200) {
            const forecastWeatherData = JSON.parse(xhrForecastWeather.responseText);
            displayForecastWeather(forecastWeatherData);
          } else {
            console.log('Error:', xhrForecastWeather.status);
            alert('An error occurred while fetching forecast weather data');
          }
        };
  
        xhrForecastWeather.send();
      } else {
        console.log('Error:', xhrCurrentWeather.status);
        alert('An error occurred while fetching current weather data');
      }
    };
  
    xhrCurrentWeather.send();
}


let isCelsius = true;

// Function to toggle between Celsius and Fahrenheit
function toggleTemperatureUnit() {
  isCelsius = !isCelsius;
  // Re-fetch and display weather data with the new unit
  const location = locationInput.value;
  if (location.trim() === '') {
    alert('Please enter a location');
    return;
  }
  fetchWeather(location);
}

// Event listener for the toggle button
const toggleUnitButton = document.getElementById('toggle-unit-btn');
toggleUnitButton.addEventListener('click', toggleTemperatureUnit);

// Function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

// Function to display temperature in the selected unit
function displayTemperature(tempCelsius) {
  let temperatureText = '';

  if (isCelsius) {
    temperatureText = `Temperature: ${tempCelsius}°C`;
  } else {
    const tempFahrenheit = celsiusToFahrenheit(tempCelsius);
    temperatureText = `Temperature: ${tempFahrenheit}°F`;
  }

  return temperatureText;
}



function setBackgroundBasedOnCondition(condition) {
  const body = document.body;
  switch (condition.toLowerCase()) {
    case 'sunny':
      body.style.backgroundImage = 'url(https://img.freepik.com/free-photo/field-blooming-sunflowers_23-2150742978.jpg)'; // Replace with your sunny image path
      break;
    case 'rainy':
      body.style.backgroundImage = 'url(https://img.freepik.com/free-photo/ai-generated-water-drops-picture_23-2150644612.jpg)'; // Replace with your rainy image path
      break;
    case 'cloudy':
      body.style.backgroundImage = 'url(https://img.freepik.com/free-photo/digital-art-selected_1340-29004.jpg)'; // Replace with your cloudy image path
      break;
    default:
      // Set a default background image or handle other conditions
      body.style.backgroundImage = 'url(https://img.freepik.com/free-photo/vibrant-blue-sky-tranquil-rural-meadow-generated-by-ai_188544-15079.jpg)'; // Replace with your default image path
      break;
  }
}




function displayCurrentWeather(data) {
  const lt = data.location.localtime;
  const location = data.location.name;
  const tempC = data.current.temp_c;
  const condition = data.current.condition.text;
  
 const humidity = data.current.humidity;
 const wndsped = data.current.wind_kph;
  currentWeatherDiv.innerHTML = `
    <h3>Current Weather</h3>
    <h3>Forecast for ${lt}</h3>
    <p>Location: ${location}</p>
    <p>${displayTemperature(tempC)}</p>
    <p>Humidity: ${humidity}% </p>
    <p>Wind Speed : ${wndsped} Kmph </p>
    <p>Condition: ${condition}</p>
  `;
  setBackgroundBasedOnCondition(condition);
}



function displayForecastWeather(data) {
  const forecast = data.forecast.forecastday;
  let forecastHTML = '<h3>Forecast Weather</h3>';

  forecast.forEach(day => {
    const date = day.date;
    const maxTempC = day.day.maxtemp_c;
    const minTempC = day.day.mintemp_c;

    forecastHTML += `
      <h3>Forecast for ${date}</h3>
      <p>Max Temperature: ${displayTemperature(maxTempC)}</p>
      <p>Min Temperature: ${displayTemperature(minTempC)}</p>
    `;
  });

  forecastWeatherDiv.innerHTML = forecastHTML;

}
