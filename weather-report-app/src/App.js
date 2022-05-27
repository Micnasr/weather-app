import axios from "axios";
import { useState } from "react";

function App() {

  //keep track of the data recieved from API
  const [data, setData] = useState({});
  //keep track of location chosen
  const [location, setLocation] = useState("");

  //keep track of country code
  const [code, setCode] = useState("");

  //keep track of errors like invalid country name
  const [error, setError] = useState(false);

  //API url
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}${","+code}&units=metric&appid=8cd69c2fe166b54daba42f23ce229254`;

  //when input is pressed, function will run
  const searchLocation = (event) => {
    if (event.key === 'Enter' && location !== ""){

      //fetch data from weather api
      axios.get(url).then((response) => {
        setError(false);
        setData(response.data);
      }).catch(error => {
        setError(true);
      })

      //reset values
      setLocation('');
      setCode('');
    }
  }

  //calculate country's time
  const getTime = () => {
    let countryTime = (new Date().getUTCHours()+(data.timezone/3600));
    let morningOrEvening = ' AM';
    
    if (countryTime > 24){
      countryTime = countryTime - 24;
    }
    
    if (countryTime > 12){
      countryTime = countryTime - 12;
      morningOrEvening= ' PM'
    }

    return countryTime +':' + (new Date().getUTCMinutes()) + morningOrEvening;
  }

  //concatenate string to get city and country (when inputted)
  const getInfo = (event) => {
    const info = event.target.value.split(" ");
    setLocation(info[0]);
    if (info[1] != null){
      getData(info[1]);
    }
  }

  //convert country name to country code
  const getData=(country)=>{
        
    fetch('./data.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        return response.json();
      })
      .then(function(data) {
        //go through country code array
        for (let i = 0; i < data.length; i++) {
          //check to see if the inputted country matches the code or name of a country
          if (country.toLocaleLowerCase() === data[i].Name.toLocaleLowerCase() || country.toLocaleLowerCase() === data[i].Code.toLocaleLowerCase()){
            setCode(data[i].Code);
            return;
          }
        }
      });
  }
  

  return (
  <div className="app">
    <div className="search">
      <input 
      onChange={getInfo}
      placeholder='Enter City Name' 
      type="text" 
      onKeyPress={searchLocation} />
    </div>
    {error && <p className='error'>Country Not Found (Check for spelling)</p>}

    {/*only print if there is no errors*/}
    {!error &&
    <div className="container">
      <div className="top">
        <div className="location">
          {data.sys ? <p>{data.name} ({data.sys.country})</p> : <p>{data.name}</p>}
        </div>
        <div className="temp">
          {data.main ? <h1>{Math.round(data.main.temp)}°C</h1> : null}
        </div>
        <div className="description">
          {data.weather ? <p>{data.weather[0].main}</p> : null}
        </div>
      </div>
      
      {/*only print if a location is chosen*/}
      {data.name !== undefined && 
      <div className="bottom">
        <div className="feels">
          {data.main ? <p className="bold">{Math.round(data.main.feels_like)}°C</p> : null}
          <p>Feels Like</p>
        </div>
        <div className="humidity">
          {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
          <p>Humidity</p>
        </div>
        <div className="humidity">
          {data.main ? <p className="bold">{getTime()}</p> : null}
          <p>Time</p>
        </div>
        <div className="wind">
          {data.main ? <p className="bold">{Math.round(data.wind.speed)} km/h</p> : null}
          <p>Wind Speed</p>
        </div>
      </div>}
    </div>
    }
  </div>
  );
}

export default App;
