import { useEffect, useState } from 'react';
import './App.css';

/*Img */

import CloudIcon from "./assets/cloud.png";
import DrizzleIcon from "./assets/dizzle.png";
import HumidityIcon from "./assets/humidity.png";
import RainIcon from "./assets/rain.png";
import SearchIcon from "./assets/search.png";
import SnowIcon from "./assets/snow.png";
import SunIcon from "./assets/sun.webp";
import WindIcon from "./assets/wind.png";

const Weatherdetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="weather-img" />
      </div>
      <div className='temp'>{temp}°C</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <div>
          <span className='lat'>latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={HumidityIcon} alt="humidity" className="icon" />
          <div className='data'>
            <div className='humidity-percent'>{humidity}</div>
            <div className='text'>Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={WindIcon} alt="wind" className="icon" />
          <div className='data'>
            <div className='wind-percent'>{wind}</div>
            <div className='text'>Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  let api_key = "260713dba291f6b008fac7b4ec6871dc";
  const [text, setText] = useState("Chennai");

  const [icon, setIcon] = useState(SnowIcon);
  const [city, setCity] = useState("Chennai");
  const [temp, setTemp] = useState(0);
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error,setError] = useState(null);
  const weatherIconMap = {
    "01d": SunIcon,
    "01n": SunIcon,
    "02d": CloudIcon,
    "02n": CloudIcon,
    "03d": DrizzleIcon,
    "03n": DrizzleIcon,
    "04d": DrizzleIcon,
    "04n": DrizzleIcon,
    "09d": RainIcon,
    "09n": RainIcon,
    "10d": RainIcon,
    "10n": RainIcon,
    "13d": SnowIcon,
    "13n": SnowIcon,
  };

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;
    try {
      let response = await fetch(url);
      let data = await response.json();
      console.log(data);

      if (data.cod === "404") {
        console.error("City Not Found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setCityNotFound(false);
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || SunIcon);

    } catch (error) {
      console.log("An error occurred:", error.message);
      setError("An error occurred while fetching weather data")
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=>{
    search();
  },[search])

  const handleCity = (e) => {
    setText(e.target.value);
  }

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  }
 

  return (
    <>
      <div className='container'>
      <div className='input-container'>
        <input type='text' className='cityInput' 
        onChange={handleCity} 
        placeHolder="Search City" 
        onKeyDown={handleKeydown}
        value={text}/>
      <div className='search-icon' onClick={()=>{search()}}>
        <img src={SearchIcon} alt="Search" width="25"/>
      </div>
      </div>
     
      {loading && <div className='loading-message'>Loading...</div>}
      {error && <div className='error-message'>{error}</div>}
      {cityNotFound && <div className='city-not-found'>City Not Found</div>}
       
       {!loading && !cityNotFound && 
       
       <Weatherdetails icon={icon} temp={temp} city={city} 
       country={country} lat={lat} log={log} humidity={humidity} wind={wind}
       />
       }

       <p className='copyright'>
        Designed by <span>Jaya prakash</span>
      </p>
    </div>
    </>
  );
}

export default App;
