import { useState } from "react";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [bgClass, setBgClass] = useState("default");
  const [videoSrc, setVideoSrc] = useState("/videos/default.mp4");
  const [mobileBg, setMobileBg] = useState("/images/default.jpg");

  const isMobile = window.innerWidth <= 768;

  const API_KEY = "2ab976d2c79954e239e76cd5cd38b6c6";

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) {
        throw new Error("City not found.");
      }

      const data = await res.json();

      setWeather(data);

      const condition = data.weather[0].main;

      const cityTime = new Date(
        Date.now() + data.timezone * 1000
      );

      const hour = cityTime.getUTCHours();

      const isDay = hour >= 6 && hour < 18;

      
      if (condition === "Clear") {
        setBgClass(isDay ? "clear-day" : "clear-night");

        if (hour >= 5 && hour < 8) {
          !isMobile
            ? setVideoSrc("/videos/morning.mp4")
            : setMobileBg("/images/morning.jpg");
        } else if (hour >= 8 && hour < 17) {
          !isMobile
            ? setVideoSrc("/videos/sunny.mp4")
            : setMobileBg("/images/sunny.jpg");
        } else if (hour >= 17 && hour < 19) {
          !isMobile
            ? setVideoSrc("/videos/evening.mp4")
            : setMobileBg("/images/evening.jpg");
        } else {
          !isMobile
            ? setVideoSrc("/videos/night.mp4")
            : setMobileBg("/images/night.jpg");
        }
      }

      
      else if (condition === "Clouds") {
        setBgClass(isDay ? "clouds-day" : "clouds-night");

        !isMobile
          ? setVideoSrc("/videos/cloudy.mp4")
          : setMobileBg("/images/cloudy.jpg");
      }

      
      else if (
        condition === "Rain" ||
        condition === "Drizzle" ||
        condition === "Thunderstorm"
      ) {
        setBgClass(isDay ? "rain-day" : "rain-night");

        !isMobile
          ? setVideoSrc("/videos/rain.mp4")
          : setMobileBg("/images/rain.jpg");
      }

      
      else if (condition === "Snow") {
        !isMobile
          ? setVideoSrc("/videos/snow.mp4")
          : setMobileBg("/images/snow.jpg");
      }

      
      else {
        setBgClass("default");

        !isMobile
          ? setVideoSrc("/videos/default.mp4")
          : setMobileBg("/images/default.jpg");
      }
    } catch (err) {
      setError(err.message);
      setWeather(null);

      setBgClass("default");

      if (!isMobile) {
        setVideoSrc("/videos/default.mp4");
      } else {
        setMobileBg("/images/default.jpg");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`app ${bgClass}`}
      style={
        isMobile
          ? {
              backgroundImage: `url(${mobileBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      {!isMobile && (
        <video
          key={videoSrc}
          className="background-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      <div className="weather-container">
        <h1 className="title">🌤 Weather App</h1>

        <p className="subtitle">
          Live Weather Forecast
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getWeather();
              }
            }}
          />

          <button onClick={getWeather}>
            Search
          </button>
        </div>

        {loading && (
          <p className="info">
            Loading weather...
          </p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {weather && (
          <div className="card">
            <h2>{weather.name}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather"
            />

            <h3>{weather.weather[0].main}</h3>

            <p className="temp">
              {Math.round(weather.main.temp)}°C
            </p>

            <div className="extra">
              <span>
                💧 Humidity: {weather.main.humidity}%
              </span>

              <span>
                🌬 Wind: {weather.wind.speed} m/s
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}