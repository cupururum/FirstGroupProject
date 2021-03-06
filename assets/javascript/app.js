
var locationOfOriginLat;
var locationOfOriginLng;
//var infowindow;
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
var markersForElectStations = [];
var markersForVeg = [];
var markersForRest = [];
var markersForHotels = [];
var actionForElec = 1;
var actionForRest = 1;
var actionForHotels = 1;
var actionForVegPlaces = 1;
var alertExists = false;


function showDivAlert() {

  var $divAlert = $('<div id="alertDiv"></div>')//.css({"background-color": "rgba(248,150,112, 0.7);", "font-size":"20px;", "color": "rgb(250,231,231);"})
  $divAlert = $divAlert.text("Oops, something went wrong. Enter a valid location! We support only driving routes, choose locations on the same continent.")
  $("#prependAlert").prepend($divAlert);
  alertExists = true;
}

function hideDiveAlert() {
  $("#alertDiv").remove()
  alertExists = false;
}



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
  clearResults(markersForVeg)
  clearResults(markersForRest)
  clearResults(markersForHotels)
  clearResults(markersForElectStations)
  actionForElec = 1;
  actionForRest = 1;
  actionForHotels = 1;
  actionForVegPlaces = 1;
  // $("#address-mid-point").text("")
  // $("#overallDistance").text("")
  // $("#distanceInMilesUntillMiddlePoint").text("")
  // $("#weather-icon").html('');
  // $("#city-temperature-h3").text("");
  // $("#city-name-h3").text("");
})


  var locationOrigin, locatinDestination;

$("#run-search").on("click", function(event){
      event.preventDefault();
      //$divAlert.remove()
    initialiseMapForSearch()

    if (alertExists === true) {
      hideDiveAlert();
      alertExists = false;
    } else {
      //ignore!
    }

});//end of on click search function

$("#show-vegeterian-restaurants").on("click", function(){
  if (actionForVegPlaces == 1) {
    getVegeterianPlaces(positionLat, positionLng, geocoder, map)
    actionForVegPlaces = 2
  } else {
    clearResults(markersForVeg)
    actionForVegPlaces = 1
  }

});

$("#show-restaurants").on("click", function(){
    var value = $(this).attr("value");
    //console.log("value: ", value)
    if (actionForRest == 1) {
      infowindows(newWaypointLocation, map, initialiseMapForSearch, value);
      actionForRest = 2;
    } else {
      clearResults(markersForRest)
      actionForRest = 1
    }
});

$("#show-hotels").on("click", function(){
    var value = $(this).attr("value");
    //console.log("value: ", value)
    if (actionForHotels == 1) {
      infowindows(newWaypointLocation, map, initialiseMapForSearch, value);
      actionForHotels = 2;
    } else {
      clearResults(markersForHotels)
      actionForHotels = 1
    }
});

$("#show-elec").on("click", function(){
  if (actionForElec == 1) {
    getElecStation(arrayOfLatLng, map);
    actionForElec = 2;
  } else {
    clearResults(markersForElectStations)
  }
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
//console.log("origin: ", origin)
destination = document.getElementById('destination').value;
//console.log("destination: ", destination)

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

                 //console.log("response of directionsService with middle poit waypoint: ", response)


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
        //console.log("indexOfMiddlePoint: ", indexOfMiddlePoint)

      }//end of computePortionsOfTheRoute()

     computePortionsOfTheRoute()

     //flightPath.setMap(map);

    } else {
      //window.alert('Directions request failed due to ' + status);
      showDivAlert()
    }
  }); // end of function(response, status)
} // end of calculateAndDisplayRoute()

calculateAndDisplayRoute(directionsService, directionsDisplay)

directionsDisplay.addListener('directions_changed', function() {
    //console.log("directionsDisplay.getDirections(): ", directionsDisplay.getDirections())
    computeTotalDistance(directionsDisplay.getDirections());
    var response = directionsDisplay.getDirections()
        //console.log("response.routes[0].legs: ", response.routes[0].legs)
        var distanceFirstLeg = response.routes[0].legs[0].distance.text;
        var distanceSecondLeg = response.routes[0].legs[1].distance.text;
        var addressOfMarkerB = response.routes[0].legs[0].end_address;
        //console.log("addressOfMarkerB: ", addressOfMarkerB)

        $("#address-mid-point").text(addressOfMarkerB)
        $("#distanceInMilesUntillMiddlePoint").text("Distance to midpoint: " + distanceFirstLeg)

        var overviewPath = response.routes[0].overview_path;
        getCoordinatesOfEachPointOfTheRoute(overviewPath, map)

        var waypointsArray = response.request.waypoints

        newWaypointLocation = response.routes[0].legs[0].end_location

        positionLat = newWaypointLocation.lat()
        positionLng  = newWaypointLocation.lng()

        //console.log("positionLat, positionLng: ", positionLat, positionLng)

        getWeatheReport(positionLat, positionLng)

        clearResults(markersForVeg)
        clearResults(markersForRest)
        clearResults(markersForHotels)
        clearResults(markersForElectStations)
        actionForElec = 1;
        actionForRest = 1;
        actionForHotels = 1;
        actionForVegPlaces = 1;



        //pinMiddlePoint(newWaypointLocation, geocoder, map, initialiseMapForSearch)
        //console.log("newWaypointLocation: ", newWaypointLocation)

    })// end of directionsDisplay.addListener('directions_changed'...
}//end of initialiseMapForSearch()

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1609.34;

  $("#overallDistance").text("Overall distance: " + Math.round(total) + " mi")
}



 function codeAddress(address, geocoder, map, entry) {
   var vegEntryAdress = entry.address1;
   var vegEntryCity = entry.city;
   var vegEntryState = entry.region;
   var restaurantName = entry.name;
   var restaurantWebSite = entry.website;
   var restaurantRating = entry.rating_count;
   var restPhone = entry.phone;


   function createContentForInfowindowVeg () {
     $("#vegRestName").text(restaurantName)
     $("#vegRestAddr").text(vegEntryAdress + vegEntryCity);
     $("#vegRestTel").text(restPhone);
     $("#vegRestR").text(restaurantRating + "/5");
     $("#vegRestW").text(restaurantWebSite)
   }

   var infowindow = new google.maps.InfoWindow({
     content: document.getElementById('veg-content')
   });

   geocoder.geocode( { 'address': address}, function(results, status) {
     if (status == 'OK') {
       //map.setCenter(results[0].geometry.location);
       //console.log("geocoder results for veg rest: ", results);



       var marker = new google.maps.Marker({
        position: results[0].geometry.location,
        animation: google.maps.Animation.DROP,
        icon: "assets/images/GoogleMapsMarkers/green_MarkerR.png",
        map: map
      });


     markersForVeg.push(marker)

     } else {
       //ignore
       //console.log('Geocode was not successful for the following reason: ' + status);
       //alert('Geocode was not successful for the following reason: ' + status);
     }
     // marker.addListener('click', function() {
     //    infowindow.open(map, marker);
     //    createContentForInfowindowVeg()
     //  });
     //  return marker
     google.maps.event.addListener(marker, 'click', function() {
        var marker = this;
        infowindow.open(map, marker);
        createContentForInfowindowVeg()
      });
     return marker;
   });
  }// end of codeAddress


 function getCoordinatesOfEachPointOfTheRoute(overviewPath, map) {

   arrayOfLat =[];
   arrayOfLng =[];
   arrayOfLatLng = [];

   overviewPath.forEach(function(coordinate){
       arrayOfLat.push(coordinate.lat())
       arrayOfLng.push(coordinate.lng())
   })
   //console.log("arrayOfLat", arrayOfLat);
   //console.log("arrayOfLng", arrayOfLng);


   for (i = 0; i < arrayOfLat.length & i < arrayOfLng.length ; i++ ) {
     arrayOfLat[i] = Math.round10(arrayOfLat[i], -1)
     arrayOfLng[i] = Math.round10(arrayOfLng[i], -1)
     var latLng = arrayOfLng[i] + "+" + arrayOfLat[i]
     arrayOfLatLng.push(latLng)
   }
   //console.log("arrayOfLatLng: ", arrayOfLatLng)



 } //end of getCoordinatesOfEachPointOfTheRoute()



 function getElecStation(arrayOfLatLng, map) {



   var url = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearby-route.json?api_key=xHIvbkK7W6G0pLIRU4BywSWNm0z3HINHnwJw92Rg&fuel_type=ELEC&distance=0&route=LINESTRING(" + arrayOfLatLng + ")"

   $.ajax({
     url: url,
     method: "POST",
     dataType: 'json',
     contentType: "application/x-www-form-urlencoded; charset=UTF-8"
   }).done(function(response){
     //console.log(response);
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

     function createMarkersForElectStations(){
       for (var k = 0; k < locations.length; k++) {
         var marker = new google.maps.Marker({
             position: locations[k],
             //animation: google.maps.Animation.DROP,
             icon: "assets/images/GoogleMapsMarkers/purple_MarkerE.png",
             map: map
           });
           markersForElectStations.push(marker)
       }
     }

     createMarkersForElectStations()
   });//end of ajax done
 } // end of getElecStation

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
     //console.log("results: ", results)
     if(status == google.maps.places.PlacesServiceStatus.OK){
       for (var i = 0; i < results.length; i++){
         var newMarker = createMarker(results[i], value);
         //console.log("newMarker: ", newMarker)
         newMarker.placeResult = results[i];

         if (value === "restaurant" ) {
           markersForRest.push(newMarker);
         } else if (value === "lodging") {
           markersForHotels.push(newMarker)
         } else {
           //ignore!
         };

         //console.log("markers in infowindow: ", markers)
       }
     }
   }

   function createMarker(place, value) {

     var icon;

     if (value === "restaurant" ) {
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
       icon: icon,
       map: map,
       position: place.geometry.location,
       title: place.name,
       // rating: place.rating

       // icon: photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})
     });

     google.maps.event.addListener(marker, 'click', showInfoWindow);
     return marker;

   }



   function showInfoWindow() {
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
   } //buildIWContent(place)

 } //end of infowindows

 function clearResults(markers) {
   for (var m in markers) {
     markers[m].setMap(null)
   }
   markers = []
   //console.log(markers);
 }//enf of function clearMarkers

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
