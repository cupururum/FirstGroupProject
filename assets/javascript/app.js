
var locationOfOriginLat;
var locationOfOriginLng;
var infowindow;
var newWaypointLocation
var directionsService
var directionsDisplay
var geocoder
var map
var infoWindow;
var places;
var request;
var service; //this is the same as places
var markers = [];
var hostnameRegexp = new RegExp('^https?://.+?/');
var arrayOfLat =[];
var arrayOfLng =[];
var arrayOfLatLng = [];
var positionLat;
var positionLng;



function initMap() {
  // var directionsService = new google.maps.DirectionsService;
  // var directionsDisplay = new google.maps.DirectionsRenderer;
  // var geocoder = new google.maps.Geocoder;

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 39.33, lng: -99.74}
  });

  var marker = new google.maps.Marker({
          map: map
        });

  var origin = document.getElementById('origin');
  var destination = document.getElementById('destination');

  var autocompleteOrigin = new google.maps.places.Autocomplete(origin, {
    componentRestriction: {country : "us"}
  });
  var autocompleteDestination = new google.maps.places.Autocomplete(destination, {
    componentRestriction: {country : "us"}
  });
}//end of initMap()

$("#clear-all").on("click", function(){
  document.getElementById('origin').value = "";
  document.getElementById('destination').value = "";
  initMap();

})


  var locationOrigin, locatinDestination;

$("#run-search").on("click", function(event){
      event.preventDefault();


    initialiseMapForSearch()

});//end of on click search function

$("button.show").on("click", function(){
    var value = $(this).attr("value");
    console.log("value: ", value)
    getPlaces(newWaypointLocation, map, initialiseMapForSearch, value)
})

$("#show-elec").on("click", function(){

  getElecStation(arrayOfLatLng, map);
})

function initialiseMapForSearch() {

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map
  });;
  geocoder = new google.maps.Geocoder;

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 39.33, lng: -99.74}
  });

origin = document.getElementById('origin').value;
console.log("origin: ", origin)
destination = document.getElementById('destination').value;
console.log("destination: ", destination)

directionsDisplay.setMap(map);

function calculateAndDisplayRoute(directionsService, directionsDisplay, middle) {
  directionsService.route({
    origin: origin,
    destination: destination,
    travelMode: 'DRIVING',
    region: "US"
  }, function(response, status) {
    if (status === 'OK') {

      //console.log("direction service response: ", response)

      var overallDistanceInMiles = response.routes[0].legs[0].distance.text

      $("#overallDistance").text("Overall distance: " + overallDistanceInMiles)

      var overallDistanceInMeters = response.routes[0].legs[0].distance.value

      var overviewPath = response.routes[0].overview_path;


      function computePortionsOfTheRoute() {

        var flightPath = new google.maps.Polyline({
           path: overviewPath,
           geodesic: true,
           strokeColor: '#FF0000',
           strokeOpacity: 0.0,
           strokeWeight: 2
        });
        var flightPathGetPath = flightPath.getPath();

        var computePath = google.maps.geometry.spherical.computeLength(flightPathGetPath)
        var halfOfComputePath = computePath / 2;

        var arrayFindHalfDistance = [];
        var indexOfMiddlePoint = 0;

        for (var i = 0; i < overviewPath.length; i++){
           arrayFindHalfDistance.push(overviewPath[i])
           flightPath = new google.maps.Polyline({
             path: arrayFindHalfDistance,
             geodesic: true
           });

           flightPathGetPath = flightPath.getPath();
           var computeHalfPath = google.maps.geometry.spherical.computeLength(flightPathGetPath)
           //console.log(i, " computeHalfPath: ", computeHalfPath)



           if (computeHalfPath >= halfOfComputePath) {

             flightPath = new google.maps.Polyline({
               path: arrayFindHalfDistance,
               geodesic: true,
               // strokeColor: '#FF0000',
               // strokeOpacity: 0.0,
               // strokeWeight: 2
             });

             //flightPath.setMap(map);




             var indexOfBeforeMiddlePoint = arrayFindHalfDistance[i - 1];
             indexOfMiddlePoint = arrayFindHalfDistance[i];
             var indexOfBeforeMiddlePointLat = indexOfBeforeMiddlePoint.lat()
             var indexOfMiddlePointLat = indexOfMiddlePoint.lat()

             var averageOfLatForMiddlePoint = (indexOfBeforeMiddlePointLat + indexOfMiddlePointLat) / 2;
             var averageOfLngForMiddlePoint = (indexOfBeforeMiddlePoint.lng() + indexOfMiddlePoint.lng()) / 2;

             var middlePointLatLong = {
               lat: averageOfLatForMiddlePoint,
               lng: averageOfLngForMiddlePoint
             }

             //pinMiddlePoint(middlePointLatLong, geocoder, map, initialiseMapForSearch)
             //console.log("indexOfMiddlePoint: ", indexOfMiddlePoint)

             directionsService.route({
               origin: origin,
               destination: destination,
               travelMode: 'DRIVING',
               waypoints: [{
                   location: middlePointLatLong,
                   stopover: true
                 }],
               region: "US"
             }, function(response, status) {
               if (status === 'OK') {
                 directionsDisplay.setDirections(response);

                 console.log("response of directionsService with middle point waypoint: ", response)


               }
              });

              directionsService.route({
                origin: origin,
                destination: middlePointLatLong,
                travelMode: 'DRIVING',
                region: "US"
              }, function(response, status) {
                if (status === 'OK') {
                  var distanceInMilesUntillMiddlePoint = response.routes[0].legs[0].distance.text;
                  $("#distanceInMilesUntillMiddlePoint").text("Distance to midpoint: " + distanceInMilesUntillMiddlePoint)

                }
               });


             return

           } else {
             //ignore
           }
        }; //end of for each loop
        console.log("indexOfMiddlePoint: ", indexOfMiddlePoint)

      }//end of computePortionsOfTheRoute()

     computePortionsOfTheRoute()

     //flightPath.setMap(map);

    } else {
      window.alert('Directions request failed due to ' + status);
    }
  }); // end of function(response, status)
} // end of calculateAndDisplayRoute()

calculateAndDisplayRoute(directionsService, directionsDisplay)

directionsDisplay.addListener('directions_changed', function() {
    console.log("directionsDisplay.getDirections(): ", directionsDisplay.getDirections())
    computeTotalDistance(directionsDisplay.getDirections());
    var response = directionsDisplay.getDirections()
        console.log("response.routes[0].legs: ", response.routes[0].legs)

        var overviewPath = response.routes[0].overview_path;
        getCoordinatesOfEachPointOfTheRoute(overviewPath, map)

        var waypointsArray = response.request.waypoints

        newWaypointLocation = response.routes[0].legs[0].end_location

        //pinMiddlePoint(newWaypointLocation, geocoder, map, initialiseMapForSearch)
        console.log("newWaypointLocation: ", newWaypointLocation)

    })// end of directionsDisplay.addListener('directions_changed'...
}//end of initialiseMapForSearch()

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1609.34;

  $("#overallDistance").text("Overall Distance: " + Math.round(total) + " mi")
}



 function codeAddress(address, geocoder, map) {
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        //map.setCenter(results[0].geometry.location);
        console.log("results[0].geometry.location: ", results[0].geometry.location);

        var marker = new google.maps.Marker({
         position: results[0].geometry.location,
         animation: google.maps.Animation.DROP,
         icon: "assets/images/GoogleMapsMarkers/green_MarkerR.png",
         map: map
       });

      } else {
        //ignore
        console.log('Geocode was not successful for the following reason: ' + status);
        //alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }// end of codeAddress

 function pinMiddlePoint(middle, geocoder, map, initialiseMapForSearch) {

  //  var marker = new google.maps.Marker({
  //   position: middle,
  //   animation: google.maps.Animation.DROP,
  //   icon: "assets/images/GoogleMapsMarkers/orange_MarkerM.png",
  //   draggable: true,
  //   map: map
  // });

  // map.setCenter(middle)
  // map.setZoom(8);

  geocoder.geocode({'location': middle}, function(results, status) {
    console.log("geocoder results with middle: ", results)
     if (status === 'OK') {
       if (results[0]) {


         var positionLat = middle.lat
         var positionLng = middle.lng
         var coordinatesMiddle = [];

         var positionMiddleObject = {
           lat: positionLat,
           lng: positionLng
         }
         coordinatesMiddle.push(positionLat)
         coordinatesMiddle.push(positionLng)
         console.log("coordinatesMiddle: ", coordinatesMiddle)

         var addressMiddle = results[0].formatted_address;
         $("#adress-mid-point").text(addressMiddle);
         var placeId = results[0].place_id;

         $("button.show").on("click", function(){
             var value = $(this).attr("value");
             console.log("value: ", value)
             infowindows(middle, map, initialiseMapForSearch, value)
         })



         console.log("placeId: ", placeId);
         console.log(results[0].formatted_address);
         codeAddress(addressMiddle, geocoder)
         getWeatheReport(positionLat, positionLng)
         $("#show-vegeterian-restaurants").on("click", function(){
           getVegeterianPlaces(positionLat, positionLng, geocoder, map)
         });

       } else {
         //ignore!

         //window.alert('No results found');
       }



     } else {
       window.alert('Geocoder failed due to: ' + status);
     }
   });
 }// end of pinMiddlePoint


 function getCoordinatesOfEachPointOfTheRoute(overviewPath, map) {

   arrayOfLat =[];
   arrayOfLng =[];
   arrayOfLatLng = [];

   overviewPath.forEach(function(coordinate){
       arrayOfLat.push(coordinate.lat())
       arrayOfLng.push(coordinate.lng())
   })
   console.log("arrayOfLat", arrayOfLat);
   console.log("arrayOfLng", arrayOfLng);


   for (i = 0; i < arrayOfLat.length & i < arrayOfLng.length ; i++ ) {
     arrayOfLat[i] = Math.round10(arrayOfLat[i], -1)
     arrayOfLng[i] = Math.round10(arrayOfLng[i], -1)
     var latLng = arrayOfLng[i] + "+" + arrayOfLat[i]
     arrayOfLatLng.push(latLng)
   }
   console.log("arrayOfLatLng: ", arrayOfLatLng)



 } //end of getCoordinatesOfEachPointOfTheRoute()



 function getElecStation(arrayOfLatLng, map) {



   var url = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearby-route.json?api_key=xHIvbkK7W6G0pLIRU4BywSWNm0z3HINHnwJw92Rg&fuel_type=ELEC&distance=0&route=LINESTRING(" + arrayOfLatLng + ")"

   $.ajax({
     url: url,
     method: "POST",
     dataType: 'json',
     contentType: "application/x-www-form-urlencoded; charset=UTF-8"
   }).done(function(response){
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
     //console.log("locationsFuleStations: ", locations)

     locations.forEach(function(location){
       var marker = new google.maps.Marker({
           position: location,
           //animation: google.maps.Animation.DROP,
           icon: "assets/images/GoogleMapsMarkers/purple_MarkerE.png",
           map: map
         });
     })//end forEach
   });//end of ajax done
 } // end of getElecStation

 function getPlaces(middle, map, initialiseMapForSearch, value) {
           var infowindow;
           var request;
           var service;
           var icon;
           // markers are the icons that denote the places
           var markers = [];
           infowindow = new google.maps.InfoWindow();
           var service = new google.maps.places.PlacesService(map);

           service.nearbySearch({
             location: middle,
             radius: 50000,
             //keyword: "vegetarian",
             type: value,
             //type: "lodging",
           }, callback);

           // google.maps.event.addListener(map, 'dbclick', function(event) {
           //     map.setCenter(event.latLng)
           //     clearResults(markers)
           //
           //     var request = {
           //         location: event.latLng,
           //         radius: 10000,
           //         type: "lodging"
           //     };
           //     service.nearbySearch(request, callback);
           // })


         function callback(results, status) {
           if (status === google.maps.places.PlacesServiceStatus.OK) {
             for (var i = 0; i < results.length; i++) {
               console.log("places results: ", i, results[i])
               markers.push(createMarker(results[i]));
             }
           }
         }

         function createMarker(place) {
           var photos = place.photos;
           if (!photos) {
               return;
           }
           var placeLoc = place.geometry.location;

           if (value === "allRestaurants" ) {
             icon = "assets/images/GoogleMapsMarkers/pink_MarkerR.png"
           } else if (value === "lodging") {
             icon = "assets/images/GoogleMapsMarkers/paleblue_MarkerH.png"
           } else {
             //ignore!
           };

           var marker = new google.maps.Marker({
             map: map,
             icon: icon,
             position: place.geometry.location,
             title: place.name,
             rating: place.rating
           });

           google.maps.event.addListener(marker, 'click', function() {
             infowindow.setContent(place.name, place.rating);
             infowindow.open(map, this);
           });
           return marker;
         }

         // function clearResults(markers) {
         //     for (var m in markers) {
         //         markers[m].setMap(null)
         //     }
         //     markers = []
         //     console.log(markers);
         // }


         google.maps.event.addDomListener(window, 'load', initialiseMapForSearch);

 }//getPlaces

 function infowindows(middle, map, initialiseMapForSearch, value) {

     request = {
       location: middle,
       radius: 50000,
       type: value
     };

     infoWindow = new google.maps.InfoWindow({
       content: document.getElementById('info-content')
     });

     places = new google.maps.places.PlacesService(map);

     places.nearbySearch(request, callback);

     google.maps.event.addListener(map, 'rightclick', function(event) {
       map.setCenter(event.latLng)
       clearResults(markers)

       var request = {
         location: event.latLng,
         radius: 50000,
         type: value
       };
       places.nearbySearch(request, callback);
     });


   function callback(results, status) {
     if(status == google.maps.places.PlacesServiceStatus.OK){
       for (var i = 0; i < results.length; i++){
         var newMarker = createMarker(results[i]);
         newMarker.placeResult = results[i];
         markers.push(newMarker);
       }
     }
   }

   function createMarker(place) {

     if (value === "allRestaurants" ) {
       icon = "assets/images/GoogleMapsMarkers/pink_MarkerR.png"
     } else if (value === "lodging") {
       icon = "assets/images/GoogleMapsMarkers/paleblue_MarkerH.png"
     } else {
       //ignore!
     };

     var photos = place.photos;
     if (!photos) {
       return;
     }
     var placeLoc = place.geometry.location;
     var marker = new google.maps.Marker({
       icom: icon,
       map: map,
       position: place.geometry.location,
       title: place.name,
       // rating: place.rating

       // icon: photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})
     });

     google.maps.event.addListener(marker, 'click', showInfoWindow);
     return marker;

   }

   function clearResults(markers) {
     for (var m in markers) {
       markers[m].setMap(null)
     }
     markers = []
     console.log(markers);
   }

   function showInfoWindow() {
     console.log("i am in showInfoWindow()")
     var marker = this;
     var placeDetails = places.getDetails({placeId: marker.placeResult.place_id},
       function(place, status) {
         if (status !== google.maps.places.PlacesServiceStatus.OK) {
           return;
         }
         infoWindow.open(map, marker);
         buildIWContent(place);
       });
   }

   function buildIWContent(place) {
     document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
         'src="' + place.icon + '"/>';
     document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url + '">' + place.name + '</a></b>';
     document.getElementById('iw-address').textContent = place.vicinity;

     if (place.formatted_phone_number) {
       document.getElementById('iw-phone-row').style.display = '';
       document.getElementById('iw-phone').textContent = place.formatted_phone_number;
     } else {
       document.getElementById('iw-phone-row').style.display = 'none';
     }

     if (place.rating) {
       var ratingHtml = '';
       for (var i = 0; i < 5; i++) {
         if (place.rating < (i + 0.5)) {
           ratingHtml += '&#10025;';
         } else {
           ratingHtml += '&#10029;';
         }
       document.getElementById('iw-rating-row').style.display ='';
       document.getElementById('iw-rating').innerHTML = ratingHtml;
         }
       } else {
         document.getElementById('iw-rating-row').style.display = 'none';
       }



     if (place.website) {
       var fullUrl = place.website;
       var website = hostnameRegexp.exec(place.website);
       if (website === null) {
         website = 'http://' + place.website + '/';
         fullUrl = website;
       }
       document.getElementById('iw-website-row').style.display = '';
       document.getElementById('iw-website').textContent = website;
     } else {
       document.getElementById('iw-website-row').style.display = 'none';
     }
   }

 } //end of infowindows

//google.maps.event.addDomListener(window, 'load', initialize);


Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };

    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
          return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
          return NaN;
        }
        // If the value is negative...
        if (value < 0) {
          return -decimalAdjust(type, -value, exp);
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
      }
