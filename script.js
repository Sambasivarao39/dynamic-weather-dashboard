// This is the line where you will add your API key
const API_KEY = 'a433b79aa5a2d81f34897d8d04d14ccd';

// Get references to HTML elements
const weatherInfo = document.getElementById('weather-info');
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');

// --- Event Listener for the Search Form ---
searchForm.addEventListener('submit', (event) => {
    // Prevent the form from reloading the page
    event.preventDefault(); 
    
    const cityName = cityInput.value;
    if (cityName) {
        fetchWeatherByCity(cityName);
    }
});

// --- Function to fetch weather by City Name ---
const fetchWeatherByCity = async (cityName) => {
    weatherInfo.innerHTML = `<p class="loading">Fetching weather for ${cityName}...</p>`;
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            displayWeather(data);
        } else {
            // Show an error if the city is not found
            weatherInfo.innerHTML = `<p>Error: ${data.message}. Please try another city.</p>`;
        }
    } catch (error) {
        weatherInfo.innerHTML = `<p>Could not fetch weather data. Please check your connection.</p>`;
    }
};

// --- Function to fetch weather by Coordinates (unchanged logic) ---
const fetchWeatherByCoords = async (lat, lon) => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            displayWeather(data);
        } else {
            weatherInfo.innerHTML = `<p>Error: ${data.message}</p>`;
        }
    } catch (error) {
        weatherInfo.innerHTML = `<p>Could not fetch weather data. Please check your connection.</p>`;
    }
};


// --- Function to display the weather data on the page (unchanged) ---
const displayWeather = (data) => {
    const { name, main, weather, wind } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    weatherInfo.innerHTML = `
        <div class="city">${name}</div>
        <img src="${iconUrl}" alt="Weather Icon" class="weather-icon">
        <div class="temperature">${Math.round(main.temp)}°C</div>
        <div class="description">${weather[0].description}</div>
        <div class="details">
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${wind.speed} m/s</p>
        </div>
    `;
};

// --- Using the Geolocation API on page load (unchanged) ---
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Call the coordinates-based fetch function
                fetchWeatherByCoords(latitude, longitude); 
            },
            (error) => {
                weatherInfo.innerHTML = `<p>Allow location access to see weather, or use the search bar.</p>`;
            }
        );
    } else {
        weatherInfo.innerHTML = `<p>Geolocation is not supported. Please use the search bar.</p>`;
    }
};

// Start the process when the page loads
window.addEventListener('load', getLocation);