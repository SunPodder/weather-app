const api_key = "Get Your API Key from https://openweather.org/api",
  input = document.querySelector("#input"),
  form = document.querySelector("form"),
  container = document.querySelector("#container"),
  container1 = document.querySelector("#container1"),
  container2 = document.querySelector("#container2"),
  container3 = document.querySelector("#container3"),
  container4 = document.querySelector("#container4"),
  container5 = document.querySelector("#container5")

//Get data based on city name given by User
form.addEventListener("submit", e => {
  e.preventDefault()
  let cityName = input.value
  let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${api_key}`
  getData(url)
})

//Function to fetch data from URL
function getData(url){
  fetch(url)
  .then(res => {
    return res.json()
  })
  .then(data => {
    let list = data.list
    writeData(list)
  })
}

function writeData(list){
  list.forEach(item => {
    let li = document.createElement("li")
    //Converting temperature from Kelvin to Celsius
    let temp = Math.round(+(item.main.temp) - 273) + "°C"
      //minmum and maximum temperature incase you need them.
      /*min_temp = item.main.temp_min,
      max_temp = item.main.temp_max,*/
    let pressure = item.main.pressure,
      humidity = item.main.humidity + "%",
      clouds = item.clouds.all,
      wind = item.wind.speed,
      weather = item.weather
      weather = weather[0]
    let dateTime = item.dt_txt,
      iconCode = weather.icon,
      main = weather.main,
      //svg weather icon
      icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${iconCode}.svg`;
    li.innerHTML = `
    <div class="card">
    <p class="center">Forcast for: <br>${dateTime}</p>
    <img src="${icon}">
    <p><big><b>${main}</b></big></p>
    <details>
    <summary>More Details</summary>
    <br>
    <b>Temp:</b> ${temp}<br>
    <b>Pressure:</b> ${pressure}<br>
    <b>Humidity:</b> ${humidity}<br>
    <b>Wind Speed:</b> ${wind}<br>
    <b>Clouds:</b> ${clouds}
    </details>
    </div>
    `
    console.log(iconCode)
    if(list.indexOf(item) <= 7){
      container1.appendChild(li)
    }else if(list.indexOf(item) <= 15){
      container2.appendChild(li)
    }else if(list.indexOf(item) <= 23){
      container3.appendChild(li)
    }else if(list.indexOf(item) <= 31){
      container4.appendChild(li)
    }else if(list.indexOf(item) <= 39){
      container5.appendChild(li)
    }
   // document.write(JSON.stringify(item))
  })
}
function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(useLocation, onErr, constraints)
  }else{
    alert("Geo Location isn't supported by your browser. Please enter your city name in the input field")
  }
}
const constraints = {
  enableHighAccuracy: true
}
//Get weather data based on GPS coordinates
function useLocation(pos){
  let lat = pos.coords.latitude
  let lon = pos.coords.longitude
  let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`
  getData(url)
}
//incase of geo location error
function onErr(err){
  alert("Please allow location access.\nError: " + err.message)
}
