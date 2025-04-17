import  { useEffect, useState } from 'react';
import './Weather.css';
import axios from 'axios';

const Weather = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
    useEffect(() =>{
      const fetchDefaultLocation = async () =>{
        const defaultLocation = 'Lagos'
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=metric&appid=517fffa3f91ac76023557b8c959a65f8`;

        const response = await axios.get(url)
        setData(response.data)
        
      }
      fetchDefaultLocation()
    },[])

  const search = async () => {
    if (!location.trim()) return; // Prevent API call if location is empty
    

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=517fffa3f91ac76023557b8c959a65f8`;

    try {
      const response = await axios.get(url);
      if(response.data.cod !== 200){
        setData({notfound: true})
      }else{
        setData(response.data); // Correctly set response data
        setLocation(""); // Optional: Clear input field
      }
      
      console.log(response.data);
    } catch (error) {
      if(error.response?.status === 404){
        setData({notfound: true})
      }else{
        console.error("An unexpected error occured", error)
      }
     
    }
    console.log(data)
    
  };
  
  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  const handleKeyDown = (e) =>{
    if(e.key === 'Enter'){
      search()
    }
  }
  const getWeatherIcon = (weatherType) =>{
    switch(weatherType){
      case 'Clear':
      return <i className='bx bxs-sun'></i>
      case 'Clouds':
        return <i className='bx bxs-cloud'></i>
        case 'Rain':
          return <i className='bx bxs-rain'></i>
          case 'Thunderstorm':
            return <i className='bx bxs-cloud-lightning'></i>
            case 'Snow':
              return <i className='bx bxs-cloud-snow'></i>
              case 'Haze':
                case 'Mist':
                return <i className='bx bxs-cloud'></i>
                default:
                  return <i className='bx bxs-cloud'></i>
    }
  }

  return (
    <div className="weather">
      <div className="search">
        <div className="search-top">
          <i className="fa-solid fa-location-dot"></i>
          <div className="location">{data.name || ""}</div>
        </div>
        <div className="search-location">
          <input 
            type="text" 
            placeholder="Enter Location" 
            value={location} 
            onChange={handleInputChange} 
            onKeyDown={handleKeyDown}
          />
          <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
        </div>
      </div>

      {data.notfound ? (
        <div className='not-found'>Not Found </div>
      ): (
        <div className='weather-data'> 
        {data.weather && data.weather[0] && getWeatherIcon(data.weather[0].main)}
        <div className="weather-type">{data.weather ? data.weather[0].main : null}</div>

        <div className="temp">{data.main ? `${Math.floor(data.main.temp)}°C` : null}</div>
        </div>
      ) }

    </div>
  );
};

export default Weather;


