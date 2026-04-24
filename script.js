async function getWeather() {
    const city = document.getElementById("city").value;
    const apiKey = "0e15dd9d86311547375ddd157baf9877";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod == 200) {
    document.getElementById("result").innerHTML = `
        <div class="weather-box">
            <p>🌡️ <b>Temp:</b> ${data.main.temp}°C</p>
            <p>☁️ <b>Weather:</b> ${data.weather[0].description}</p>
            <p>💧 <b>Humidity:</b> ${data.main.humidity}%</p>
            <p>⏲️ <b>Pressure:</b> ${data.main.pressure} hPa</p>
        </div>
    `;
} else {
    document.getElementById("result").innerHTML = "City not found!";
}