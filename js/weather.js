window.onload = function() {

    var resultArea = document.getElementById("result-area");
    var xmlbtn = document.getElementById("xmlbtn");
    var jsonbtn = document.getElementById("jsonbtn");
    var cityname = document.getElementById("cityname");
    var validation = document.getElementById("validation");
    const APIKEY = "fb133f342f93cc1c2832ddbc3ec4e757";

    // "https://samples.openweathermap.org/data/2.5/forecast/daily?q="+cityInput+"cnt="+cnt+"&lang=zh_cn&appid="+APIKEY
    // "https://samples.openweathermap.org/data/2.5/forecast?q="+cityInput+"&appid="+APIKEY+"&mode=xml"
    // "https://samples.openweathermap.org/data/2.5/forecast?q="+cityInput+"&appid="+APIKEY

    sharebtn = this.document.getElementById("sharebtn");
    sharebtn.addEventListener("click", function(){
        this.setAttribute("href", "https://www.facebook.com/sharer/sharer.php?href=http%3A%2F%2F127.0.0.1%3A5500%2FAJAX_PHP%2Findex.html");
    });

    xmlbtn.addEventListener("click", function(){
        var cityInput = cityname.value;
        ajaxLoading(cityInput, "https://api.openweathermap.org/data/2.5/weather?q="+cityInput+"&appid="+APIKEY+"&mode=xml", "xml");
    });

    jsonbtn.addEventListener("click", function(){
        var cityInput = cityname.value;
        ajaxLoading(cityInput, "https://api.openweathermap.org/data/2.5/forecast?q="+cityInput+"&appid="+APIKEY, "json");
    });

    function ajaxLoading(cityInput, filename, format){
       
        if(cityInput != ""){
            document.getElementById("loader").style.display = "block";
            var xmlRequest = new XMLHttpRequest();
            xmlRequest.open("GET",filename, true);
            xmlRequest.onload = function(){
                setTimeout(() => {
                    document.getElementById("loader").style.display = "none";
                }, 500);
                var data;
                if(format === "xml")
                    data = xmlRequest.responseXML;
                if(format === "json")
                    data = JSON.parse(xmlRequest.responseText);
                viewAsHTML(data, format);
                cityname.value = null;
            };
            xmlRequest.send();
        } else {
            validation.innerText = "Please Enter City Name";
            validation.style = "display: block; width: 18%; font-size:15px; margin: 0 0 0 25px; color:red;";
            setTimeout(() => {
                validation.innerText = null;
                validation.style = "display:none";
            }, 3000);
        }
    }
    function viewAsHTML(data, format) {
        var showed = "";
        if(format === "json"){
            if(data.list !== undefined ){
                //  do Loop Through JSON Data
                for (let i = 0; i < data.list.length; i++) {
                    const forecast = data.list[i];
                    var descImg = forecast.weather[0].icon;
                    showed += "<div class='container'><div class='h-con'>";
                    showed += "<p style='margin: 0;'><img style='width:38px; height:20px;' alt='"+ data.city.country +"' src='http://www.geonames.org/flags/x/"+ data.city.country.toLowerCase() +".gif'/>  " + data.city.name + " / "+ data.city.country + "</p>";
                    showed += "<p style='margin: 0;'>" + forecast.dt_txt + "</p>";
                    showed += "<p style='margin: 0; font-size:2rem'>" + new Date(forecast.dt_txt).toDateString().slice(0, 3)+ "day</p>";
                    showed += "<div style='width:80%; float:left;'>";
                    showed += "<p style='color: black; margin: 0; line-height: 1; font-size:3rem'>" + Math.round(forecast.main.temp - 273) + "&deg C</p>";
                    showed += "<h3 style='color: black; margin: 0'>" + forecast.weather[0].description.toUpperCase() + "</h3></div>";
                    showed += "<div style='width:20%; float:right;'><img style='width:100px; height:100px;' src='http://openweathermap.org/img/wn/"+ descImg +"@2x.png' alt='"+descImg+"'/></div>";
                    showed += "</div></div>";
                }
            } else{
                validation.innerText = "City Name did not found In Our API";
                validation.style = "display: block; width: 24%; font-size:15px; margin: 0 0 0 25px; color:red;";
                setTimeout(() => {
                    validation.innerText = null;
                    validation.style = "display:none";
                }, 4000);
            }
        }
        if(format === "xml"){
            if(data.getElementsByTagName("current")[0] !== undefined){
                // Loop Through XML Data
                var citydoc = data.getElementsByTagName("city"),
                    tempdoc = data.getElementsByTagName("temperature"),
                    speeddoc = data.getElementsByTagName("speed"),
                    clouddoc = data.getElementsByTagName("clouds"),
                    weatherdoc = data.getElementsByTagName("weather"),
                    lastupdate = data.getElementsByTagName("lastupdate");

                    showed += "<div class='container bg-weather' style='width:50%; float:left;'>";
                    showed += "<p style='border-radius:20px'><img style='border-radius:20px; width:100%; height:150px;' src='http://www.geonames.org/flags/x/"+ citydoc[0].childNodes[1].firstChild.nodeValue.toLowerCase() +".gif'/></p>";
                    showed += "<h2>" + citydoc[0].getAttributeNode("name").nodeValue + "</h2>";
                    showed += "<p style='color: darkblue; font-size:2.6rem'>Temperature : " + Math.round(tempdoc[0].getAttributeNode("value").nodeValue - 273) + "&deg C</p>";
                    showed += "<p style='font-size:1.8rem'>Wind : " + speeddoc[0].attributes.getNamedItem("name").nodeValue +" ----------- " + speeddoc[0].attributes.getNamedItem("value").nodeValue + "</p>";
                    showed += "<p style='font-size:1.8rem'>Clouds : " + clouddoc[0].attributes.getNamedItem("name").nodeValue +" ----------- " + clouddoc[0].attributes.getNamedItem("value").nodeValue + "</p>";
                    showed += "<p style='color: darkblue; font-size:1.8rem'>Last Update : " + lastupdate[0].attributes.getNamedItem("value").nodeValue + "</p></div>";
                    showed += "<div class='container bg-weather' style='width:50%; float:right;'><img style='width:400px; height:471px;' src='http://openweathermap.org/img/wn/"+weatherdoc[0].attributes.getNamedItem("icon").nodeValue+"@2x.png' alt='"+ clouddoc[0].attributes.getNamedItem("name").nodeValue +"'/>";
            } else{
                validation.innerText = "City Name did not found In Our API";
                validation.style = "display: block; width: 24%; font-size:15px; margin: 0 0 0 25px; color:red;";
                setTimeout(() => {
                    validation.innerText = null;
                    validation.style = "display:none";
                }, 4000);
            }
        }

        resultArea.innerHTML = showed;
    }
}
// get the Text Of an Element:
// xmldoc[0].childNodes[3].firstChild.nodeValue

// Get the attribute of an Element:
// [1] xmldoc[0].childNodes[1].attributes.getNamedItem("lon").nodeValue
// [2] xmldoc[0].getAttributeNode("name").nodeValue