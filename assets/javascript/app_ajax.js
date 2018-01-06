// var url = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearby-route.json?api_key=xHIvbkK7W6G0pLIRU4BywSWNm0z3HINHnwJw92Rg&distance=2&route=LINESTRING()"
//
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
function getCoordinatesOfEachPointOfTheRoute() {
  overviewPath.forEach(function(coordinate){
      arrayOfLat.push(coordinate.lat())
      arrayOfLng.push(coordinate.lng())
  })
  console.log("arrayOfLat", arrayOfLat);
  console.log("arrayOfLng", arrayOfLng);

  for (i = 0; i < arrayOfLat.length & i < arrayOfLng.length ; i++ ) {
    var latLng = arrayOfLng[i] + "+" + arrayOfLat[i]
    arrayOfLatLng.push(latLng)
  }
  console.log("arrayOfLatLng: ", arrayOfLatLng)

  var url = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearby-route.json?api_key=xHIvbkK7W6G0pLIRU4BywSWNm0z3HINHnwJw92Rg&distance=2&route=LINESTRING(" + arrayOfLatLng + ")"

  $.getJSON(url, function(response){
    console.log(response);
    var locations = [];
    response.fuel_stations.forEach(function(station){
      var locationsFormat = {
        lat: undefined,
        lng: undefined
      }
      locationsFormat.lat = station.latitude;
      locationsFormat.lng = station.longitude;
      locations.push(locationsFormat)
    });
    console.log("locationsFuleStations: ", locations)

    locations.forEach(function(location){
      var marker = new google.maps.Marker({
          position: location,
          map: map
        });
    })

  });
}


function getWeatheReport(lat, log){
  var APIKey = "2fed8f4901a44c1fc8836915c086c9e8";

  // Here we are building the URL we need to query the database
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + log + "&appid=" + APIKey;

  // We then created an AJAX call
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
     console.log(response)

  });
}
