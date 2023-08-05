const apiKey = 'your-key'; 
function getWeather() {
    const cityInput = document.getElementById('cityInput').value;


    if (cityInput.trim() !== '') {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ville non trouvée');
                }
                return response.json();
            })
            .then(data => displayWeather(data))
            .catch(error => {
                console.log('Une erreur s\'est produite:', error.message);
                displayErrorMessage();
            });
    }
    const wheatherbox = document.querySelector('.weather-box');
    const rightColumn = document.querySelector('.right-column');
    wheatherbox.classList.add('show');
    rightColumn.classList.add('show');


}

function handleKeyDown(event) {
    if (event.keyCode === 13) {
        getWeather();
    }
}
function displayWeather(data) {
    const cityNameElement = document.getElementById('cityName');
    const weatherInfo = document.getElementById('weatherInfo');
    const additionalInfo = document.querySelector('.additional-info');
    const forecastInfo = document.querySelector('.forecast');

    const cityName = data.name;
    const temperature = data.main && data.main.temp;
    const description = data.weather && data.weather[0].description;
    const icon = data.weather && data.weather[0].icon;

    if (!cityName || !temperature || !description || !icon) {
        displayErrorMessage();
        return;
    }

    const content = `
        <h2>${cityName}</h2>
        <p>${temperature}°C</p>
        <p>${description}</p>
        <img src="https://openweathermap.org/img/w/${icon}.png" alt="${description}">
    `;

    weatherInfo.innerHTML = content;
    const humidity = data.main && data.main.humidity;
    const windSpeed = data.wind && data.wind.speed;
    const sunrise = data.sys && data.sys.sunrise;
    const sunset = data.sys && data.sys.sunset;

    const additionalContent = `
        <p>humidité : ${humidity}%</p>
        <p>vitesse du vents : ${windSpeed} m/s</p>
        <p>lever de soleil : ${new Date(sunrise * 1000).toLocaleTimeString()}</p>
        <p>coucher de soleil : ${new Date(sunset * 1000).toLocaleTimeString()}</p>
    `;

    additionalInfo.innerHTML = additionalContent;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apiKey}&units=metric&lang=fr`)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.log('Erreur lors de la récupération des prévisions:', error));
}

function displayForecast(data) {
    const forecastInfo = document.querySelector('.forecast');
    const forecasts = data.list;

    const nextSevenDays = {};

    forecasts.forEach(forecast => {
        const forecastDate = new Date(forecast.dt_txt);
        const day = forecastDate.toLocaleDateString('fr-FR', { weekday: 'long' });

        if (!nextSevenDays[day] || forecast.main.temp_max > nextSevenDays[day].temp_max) {
            nextSevenDays[day] = {
                temp_max: forecast.main.temp_max,
                weatherIcon: forecast.weather[0].icon
            };
        }
    });

    let forecastContent = '<h2>Prévisions pour les 7 prochains jours </h2>';

    for (const day in nextSevenDays) {
        forecastContent += `
            <p>
                ${day} - Température Max : ${nextSevenDays[day].temp_max.toFixed(1)}°C
                <img src="http://openweathermap.org/img/wn/${nextSevenDays[day].weatherIcon}.png" alt="Icone Meteo">
            </p>
        `;
    }

    forecastInfo.innerHTML = forecastContent;
}


function handleKeyDown(event) {
    if (event.keyCode === 13) {
        getWeather();
    }
}

function getDayOfWeek(date) {
    const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    return daysOfWeek[date.getDay()];
}



