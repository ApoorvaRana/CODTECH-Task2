const apiKey = '9bbdb4875982496c85b171022240709'; 
const searchBtn = document.getElementById('search-btn');
const tabButton = document.querySelectorAll('.tab-btn.active');
const tabButtons = document.querySelectorAll('.tab-btn');
const weatherSections = document.querySelectorAll('.weather-section');
weatherSections.forEach(section => section.classList.add('hidden'));
tabButtons.forEach(button => button.classList.remove('active'));

searchBtn.addEventListener('click', () => {
    const city = document.getElementById('city').value;  
    if (city) {
        fetchWeatherData(city);
        selectToday('today');
    }
});
function selectToday(tabId) {
    tabButton.forEach(today => today.classList.add('active'));
    weatherSections.forEach(section => section.classList.add('active'));
    const selectedTab = document.getElementById(`${tabId}-btn`);
    const sectionToShow = document.getElementById(`${tabId}-weather`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    if (sectionToShow) {
        sectionToShow.classList.remove('hidden');
        sectionToShow.classList.add('active');
    }
}

function selectTab(tabId) {
    tabButtons.forEach(button => button.classList.remove('active'));
    weatherSections.forEach(section => section.classList.add('hidden'));
    const selectedTab = document.getElementById(`${tabId}-btn`);
    const sectionToShow = document.getElementById(`${tabId}-weather`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    if (sectionToShow) {
        sectionToShow.classList.remove('hidden');
        sectionToShow.classList.add('active');
    }
}
tabButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        tabButtons.forEach(button => button.classList.remove('active'));
        weatherSections.forEach(section => section.classList.add('hidden'));
        this.classList.add('active');
        const sectionToShow = document.getElementById(this.id.split('-')[0] + '-weather');
        sectionToShow.classList.remove('hidden');
        sectionToShow.classList.add('active');
    });
});
async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes&alerts=yes`);
        const data = await response.json();
        populateWeatherData(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function populateWeatherData(data) {
    document.getElementById('temperature').innerText = `Temperature: ${data.current.temp_c}°C`;
    document.getElementById('climate').innerText = `Climate: ${data.current.condition.text}`;
    document.getElementById('aqi').innerText = `AQI: ${data.current.air_quality.pm2_5}`;
    document.getElementById('uvindex').innerText = `UV Index: ${data.current.uv}`;
    document.getElementById('humidity').innerText = `Humidity: ${data.current.humidity}%`;
    document.getElementById('wind').innerText = `Wind: ${data.current.wind_kph} kph`;
    document.getElementById('dewpoint').innerText = `Dew Point: ${data.current.dewpoint_c}°C`;
    document.getElementById('pressure').innerText = `Pressure: ${data.current.pressure_mb} mb`;
    document.getElementById('visibility').innerText = `Visibility: ${data.current.vis_km} km`;
    document.getElementById('sunrise').innerText = `Sunrise: ${data.forecast.forecastday[0].astro.sunrise}`;
    document.getElementById('sunset').innerText = `Sunset: ${data.forecast.forecastday[0].astro.sunset}`;
    document.getElementById('moon-phase').innerText = `Moon Phase: ${data.forecast.forecastday[0].astro.moon_phase}`;
    document.getElementById('cloudiness').innerText = `Cloudiness: ${data.current.cloud}%`;
    document.getElementById('storm').innerText = data.alerts.alert.length > 0 ? `Storm Alert: ${data.alerts.alert[0].headline}` : 'No Storms Incoming';
    populateHourlyForecast(data);
    populateDailyForecast(data);
}

function populateHourlyForecast(data) {
    const hourlyContainer = document.querySelector('.hourly-container');
    hourlyContainer.innerHTML = '';
    data.forecast.forecastday[0].hour.forEach(hour => {
        const hourDiv = document.createElement('div');
        hourDiv.innerHTML = `
            <p>${hour.time.split(' ')[1]}</p>
            <p>${hour.temp_c}°C</p>
            <p>${hour.condition.text}</p> `;
        hourlyContainer.appendChild(hourDiv);
    });
}
function populateDailyForecast(data) {
    const dailyContainer = document.querySelector('.daily-container');
    dailyContainer.innerHTML = '';
    data.forecast.forecastday.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.innerHTML = `
            <p>${day.date}</p>
            <p>${day.day.avgtemp_c}°C</p>
            <p>${day.day.condition.text}</p>`;
        dailyContainer.appendChild(dayDiv);
    });
}
