// function recursion() {
//   if (entryCount < 5) {
//
//      console.log("entryCount++: ", entryCount++)
//      recursion()
//
//   } else {
//      return
//   }
// }
//
// recursion()


function getVegeterianPlaces(lat, log, geocoder, map) {

  //var entryCount = 0;

  var milesArray = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  var veggyURL;
  var i = 0;


function recursionOfJSON() {

  veggyURL = "https://www.vegguide.org/search/by-lat-long/" + lat + "," + log + "?unit=mile;limit=10;distance=" + milesArray[i];

  $.getJSON(veggyURL, function(response){
      entryCount = response.entry_count;

      if (entryCount < 1) {
        i++
        recursionOfJSON()
      } else {
        console.log("veg API response: ", response)
        var entries = response.entries;
        entries.forEach(function(entry){

          var vegEntryAdress = entry.address1;
          var vegEntryCity = entry.city;
          var vegEntryState = entry.region;

          //var restaurantDescription = entry.text/html;

          console.log("veg entry adress", vegEntryAdress, vegEntryCity)
          var vegFullAdress = vegEntryAdress + vegEntryCity //+ vegEntryState

          if (vegEntryAdress !== undefined) {
              codeAddress(vegFullAdress, geocoder, map, entry);
          } else {
            //ignore!
          }

        });//end of entries.forEach(function(entry)
        return
      }
   });// end of json
  }//end of recurtionOfJSON()
  recursionOfJSON()
}// end of get veg places function


function getWeatheReport(lat, log){
  var APIKey = "2fed8f4901a44c1fc8836915c086c9e8";

  // Here we are building the URL we need to query the database
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + log + "&units=imperial&appid=" + APIKey;

  // We then created an AJAX call
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
     console.log(response)

     var iconCode = response.weather[0].icon;
     var temperature = Math.round(response.main.temp);
     var name = response.name;

     $("#weather-icon").html('<img src="http://openweathermap.org/img/w/' + iconCode + '.png">');
     $("#city-temperature-h3").text(temperature + "\xB0" + "F");
     $("#city-name-h3").text(name);
    // Create CODE HERE to Log the queryURL
    // Create CODE HERE to log the resulting object
    // Create CODE HERE to transfer content to HTML
    // Create CODE HERE to calculate the temperature (converted from Kelvin)
    // Hint: To convert from Kelvin to Fahrenheit: F = (K - 273.15) * 1.80 + 32
    // Create CODE HERE to dump the temperature content into HTML

  });
}
