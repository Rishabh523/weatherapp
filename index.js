//  const API_key= "b54e79de46ed62c31186cba26ae82bf2";

// function renderWeatherInfo(data){
//         let newPara=document.createElement('p');
//      newPara.textContent= `${data?.main?.temp.toFixed(2)} °C`;
//      document.body.appendChild(newPara);
// }

// async function fetchWeatherDetails(){
//     try{
//     //  let latitude=15.3333;
//     //  let longitude=74.8833;
//      let city= "goa";
//     //  let state="Maharasthra";
//     //  let country="India";
//     //  let limit=2;
//      const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
//      let data=await response.json();
//      console.log("Weather is", data);
//     //  let newPara=document.createElement('p');
//     //  newPara.textContent= `${data?.main?.temp.toFixed(2)} °C`;
//     //  document.body.appendChild(newPara);
//        renderWeatherInfo(data);
//      }
//      catch(err){
//         //how to handle the error

//      }

// }

// async function getcustomWeatherDetails(){
//     try{
//          let latitude=15.3333;
//          let longitude=74.8833;
//          let weath=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}&units=metric`)
//          let data=await weath.json();
//          console.log(data);
//     }
//     catch(err)
//     {
//         console.log("Error found",err);
//     }
// }


// // function to find the current location

// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("Position not found");
//     }
// }
// function showPosition(position){
//     let lat=position.coords.latitude;
//     let longi=position.coords.longitude;
//     console.log(lat);
//     console.log(longi);
// }


const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen= document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

//Intaial variables need

let currentTab=userTab;
const API_key= "b54e79de46ed62c31186cba26ae82bf2";

currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            //mtlb me your weather me tha, ab me search form baale me aa rha hu to searchform ko visible kar do
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //mtlb me search wetherbaale me tha,ab me your weather baale form me aana chahta hu to your weather baale ko visible kro depending ki uske pass location ke coordinates h
             searchForm.classList.remove("active");
             userInfoContainer.classList.remove("active");
             getFromSessionStorage();
        }
    }
}


userTab.addEventListener("click", ()=> {
    //pass clicked Tab as input parameter
   switchTab(userTab);
});

searchTab.addEventListener("click", ()=> {
    switchTab(searchTab);
});



function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-cordinates");
    if(!localCoordinates){
        //agar local coordinates nhi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon}=coordinates;

    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loadingscreen visible
    loadingScreen.classList.add("active");
    
    //API call
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        
        const data=await response.json();
        //make loadingscreen invisible
        loadingScreen.classList.remove("active");
        //make userinfo visible
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        //make lloading screen invisible
        loadingScreen.classList.remove("active");

        // do as you want HW
    }
}

function renderWeatherInfo(WeatherInfo) {
    const cityname=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    //fetch kro values weather info se aur bo saari values respective variables me daal do

    cityname.innerText=WeatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${WeatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=WeatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${WeatherInfo?.weather?.[0]?.icon.toLowerCase()}.png`;
    temp.innerText=`${WeatherInfo?.main?.temp}°C`;
    windspeed.innerText=`${WeatherInfo?.wind?.speed}m/s`;
    humidity.innerText=`${WeatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${WeatherInfo?.clouds?.all}%`;

}

function getLocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.alert("geolocation is not supported");
    }
   
}

function showPosition(position){
    const usercoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }
    sessionStorage.setItem("user-cordinates", JSON.stringify(usercoordinates));
    fetchUserWeatherInfo(usercoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);


const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName === "")
    return;
    else
    fetchWeatherInfo(cityName);
  
    
})

async function fetchWeatherInfo(city) {
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
   try{
      const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
      const data=await response.json();
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
   }
   catch(err){
    
   }
}