const api_key = "Your API Key",
  input = document.querySelector("#input"),
  form = document.querySelector("form"),
  container = document.querySelector("#container"),
  container1 = document.querySelector("#container1"),
  container2 = document.querySelector("#container2"),
  container3 = document.querySelector("#container3"),
  container4 = document.querySelector("#container4"),
  container5 = document.querySelector("#container5")
var loader = document.querySelector("#loader")
  loader = loader.querySelector("i")

const constraints = {
  enableHighAccuracy: true
}

form.addEventListener("submit", e => {
  e.preventDefault()
  if(checkStatus()){
    let cityName = input.value
    if(cityName != ""){
      let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${api_key}`
      getData(url)
    }else if(localStorage.latitude && localStorage.longitude){
      let lat = localStorage.latitude
      let lon = localStorage.longitude
      let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`
      getData(url)
    }
  }
})

function getData(url){
  loader.style.display = "flex"
  container1.innerHTML = ""
  container2.innerHTML = ""
  container3.innerHTML = ""
  container4.innerHTML = ""
  container5.innerHTML = ""
  fetch(url)
  .then(res => {
    return res.json()
  })
  .then(data => {
    let list = data.list
    if(data.cod == 404){
      if(data.message == "city not found"){
        container1.innerHTML = data.message + "\nTap the location button to get weather data of your nearest available city."
      }else{
        container1.innerHTML = data.message
      }
    }else{
      input.value = data.city.name
      writeData(list)
    }
    loader.style.display = "none"
  })
}

function writeData(list){
    container1.innerHTML = "" 
    list.forEach(item => {
    let li = document.createElement("li")
    let temp = Math.round(+(item.main.temp) - 273)
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
      icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${iconCode}.svg`;
    li.innerHTML = `
    <div class="card">
    <p class="center">Forcast for: <br>${dateTime}</p>
    <img src="${icon}">
    <p><big><b>${main}</b></big></p>
    <details>
    <summary>More Details</summary>
    <br>
    <b>Temp:</b> ${temp}&#176;C<br>
    <b>Pressure:</b> ${pressure}<br>
    <b>Humidity:</b> ${humidity}<br>
    <b>Wind Speed:</b> ${wind}<br>
    <b>Clouds:</b> ${clouds}
    </details>
    </div>
    `
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
  })
}
function getLocation(){
  if(checkStatus()){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(useLocation, onErr, constraints)
    }else{
      container1.innerHTML = "Geo Location isn't supported by your phone. Please use the search bar."
    }
  }
}
getLocation()

function useLocation(pos){
  let lat = pos.coords.latitude
  let lon = pos.coords.longitude
  let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`
  getData(url)
  localStorage.latitude = lat
  localStorage.longitude = lon
}
function onErr(err){
  if(checkStatus()){
    if(localStorage.latitude && localStorage.longitude){
      let lat = localStorage.latitude
      let lon = localStorage.longitude
      let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`
      getData(url)
    }else{
      loader.style.display = "none"
      container1.innerHTML = `${err.message}<br><br>Can't get your location.<br>Please enable location permission and try again...<br><br>Or you can also search for your city using the search bar...`
    }
  }
}
function checkStatus(){
  if(!navigator.onLine){
    container1.innerHTML = "You are offline.<br>Please connect to a network to get Weather Data."
    return false;
  }else{
    return true;
  }
}
checkStatus()
