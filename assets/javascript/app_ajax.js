// var url = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearby-route.json?api_key=xHIvbkK7W6G0pLIRU4BywSWNm0z3HINHnwJw92Rg&distance=2&route=LINESTRING()
// $.getJSON(url, function(response){
//   console.log(response);
// });


// var url = "https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=39.02346&longitude=-100.0833&ywsid=9epjfrwZDVDNsY1UZGdgqg_wlI12jWYhlD7xSC8eAo8UO4g3o7Q_n47z5OST6M1aCmzSc6MJMN4z5O8aMPIy8s7ysYMlLe51Gy96YxSYzVewX3QBlU3jqAHR&jsoncallback=?"
// $.getJSON(url, {
//
// }
// function(response){console.log("YELP: ", response)})

// $.ajax({
//   type: "GET",
//   dataType: "jsonp",
//   url:  "https://api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972",
//   headers: "Authorization: Bearer 9epjfrwZDVDNsY1UZGdgqg_wlI12jWYhlD7xSC8eAo8UO4g3o7Q_n47z5OST6M1aCmzSc6MJMN4z5O8aMPIy8s7ysYMlLe51Gy96YxSYzVewX3QBlU3jqAHR",
//   jsonpCallback: 'cb',
//   async: false,
//   cache: true
// }).done(function(data){
//   console.log(data);
// });

// $.ajax({
//     url: 'https://developers.zomato.com/api/v2.1/geocode?lat=38.78318&lon=-120.22406' + "&jsoncallback=?",
//
//     headers: {
//         'user-key': '8376a5feabb71417a346299da63ae0b3'
//     }
//
//
// }).done(function(data){
//     console.log(data);
// });
// console.log("overviewPolyline:  ", overviewPath)
function getVegeterianPlaces(lat, log, geocoder, map) {
  var veggyURL = "https://www.vegguide.org/search/by-lat-long/" + lat + "," + log + "?unit=mile;distance=5";
  $.getJSON(veggyURL, function(response){
     console.log("veg API response: ", response)
     var entries = response.entries;
     entries.forEach(function(entry){
       var vegEntryAdress = entry.address1;
       var vegEntryCity = entry.city;
       var vegEntryState = entry.region;
       console.log("veg entry adress", vegEntryAdress, vegEntryCity)
       var vegFullAdress = vegEntryAdress + vegEntryCity //+ vegEntryState

       if (vegEntryAdress !== undefined) {
         codeAddress(vegFullAdress, geocoder, map)
       } else {
         //ignore!
       }


     })
  })
} //getVegeterianPlaces()

// all of the different variables for the map and the places

// function findHotelsAroundMiddlePoint(middle){
//   var map;
//   var infoWindow;
//
//   var request;
//   var service;
//   // markers are the icons that denote the places
//   var markers = [];
//
//   function initialize() {
//       var center = new google.maps.LatLng(37.422, -122.084058);
//       //place the middle point in the center variable within the initialize function
//       map = new google.maps.Map(document.getElementById('map'), {
//           center: middle,
//           zoom: 13
//       });
//
//       request = {
//           location: center,
//           radius: 10000,
//           type: ['hotel']
//       };
//       infoWindow = new google.maps.InfoWindow();
//
//       service = new google.maps.places.PlacesService(map);
//
//       service.nearbySearch(request, callback);
//
//       google.maps.event.addListener(map, 'rightclick', function(event) {
//           map.setCenter(event.latLng)
//           clearResults(markers)
//
//           var request = {
//               location: event.latLng,
//               radius: 10000,
//               type: ['hotel']
//           };
//           service.nearbySearch(request, callback);
//       })
//
//   }
//
//   function callback(results, status) {
//       if(status == google.maps.places.PlacesServiceStatus.OK){
//           for (var i = 0; i < results.length; i++){
//               markers.push(createMarker(results[i]));
//           }
//       }
//   }
//
//   function createMarker(place) {
//       var photos = place.photos;
//       if (!photos) {
//           return;
//       }
//       var placeLoc = place.geometry.location;
//       var marker = new google.maps.Marker({
//           map: map,
//           position: place.geometry.location,
//           title: place.name,
//           rating: place.rating
//
//           // icon: photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})
//       });
//
//       google.maps.event.addListener(marker, 'click', function(){
//
//           infoWindow.setContent(place.name, place.rating);
//           infoWindow.open(map, this);
//       });
//       return marker;
//
//   }
//
//   function clearResults(markers) {
//       for (var m in markers) {
//           markers[m].setMap(null)
//       }
//       markers = []
//       console.log(markers);
//   }
//

//   google.maps.event.addDomListener(window, 'load', initialize);
//
//
// }//end findHotelsAroundMiddlePoint()


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
