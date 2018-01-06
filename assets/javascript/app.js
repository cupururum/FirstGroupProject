
var locationOfOriginLat;
var locationOfOriginLng;
var infowindow;


function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var geocoder = new google.maps.Geocoder;

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 39.33, lng: -99.74}
  });

  var marker = new google.maps.Marker({
          map: map
        });

  var origin = document.getElementById('origin');
  var destination = document.getElementById('destination');

  var autocompleteOrigin = new google.maps.places.Autocomplete(origin, {
    country: "us"
  });
  var autocompleteDestination = new google.maps.places.Autocomplete(destination, {
    country: "us"
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
      function initialiseMapForSearch() {
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var geocoder = new google.maps.Geocoder;

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: {lat: 39.33, lng: -99.74}
        });

      origin = document.getElementById('origin').value;
      console.log("origin: ", origin)
      destination = document.getElementById('destination').value;
      console.log("destination: ", destination)

      directionsDisplay.setMap(map);

      function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
          origin: origin,
          destination: destination,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);


            console.log("direction service response: ", response)

            var overallDistanceInMiles = response.routes[0].legs[0].distance.text

            $("#overallDistance").text("Overall Distance: " + overallDistanceInMiles)

            var overallDistanceInMeters = response.routes[0].legs[0].distance.value

            var overviewPath = response.routes[0].overview_path;
            //var overviewPolyline = response.routes[0].overview_polyline;
            console.log("overviewPath:  ", overviewPath)
            //console.log("overviewPolyline:  ", overviewPolyline)

            getCoordinatesOfEachPointOfTheRoute(overviewPath, map)


            function computePortionsOfTheRoute(n) {

            }//end of computePortionsOfTheRoute()




           var flightPath = new google.maps.Polyline({
              path: overviewPath,
              geodesic: true,
              strokeColor: '#FF0000',
              strokeOpacity: 0.0,
              strokeWeight: 2
           });
           var flightPathGetPath = flightPath.getPath();

           console.log("flightPathGetPath: ", flightPathGetPath)
           var computePath = google.maps.geometry.spherical.computeLength(flightPathGetPath)
           var halfOfComputePath = computePath / 2;


           console.log("computePath: ", computePath)
           console.log("halfOfComputePath: ", halfOfComputePath)

           var arrayFindHalfDistance = [];
           var indexOfMiddlePoint = 0;

           for (var i = 0; i < overviewPath.length; i++){
              arrayFindHalfDistance.push(overviewPath[i])
              flightPath = new google.maps.Polyline({
                path: arrayFindHalfDistance,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
              });

              flightPathGetPath = flightPath.getPath();
              var computeHalfPath = google.maps.geometry.spherical.computeLength(flightPathGetPath)
              console.log(i, " computeHalfPath: ", computeHalfPath)



              if (computeHalfPath >= halfOfComputePath) {

                flightPath = new google.maps.Polyline({
                  path: arrayFindHalfDistance,
                  geodesic: true,
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.0,
                  strokeWeight: 2
                });
                flightPath.setMap(map);

                var distanceInMilesUntillMiddlePoint = Math.round(computeHalfPath/1609.34);

                $("#distanceInMilesUntillMiddlePoint").text("Miles untill middle point: " + distanceInMilesUntillMiddlePoint + " miles")

                indexOfMiddlePoint = arrayFindHalfDistance[i];
                pinMiddlePoint(arrayFindHalfDistance[i], geocoder, map, initialiseMapForSearch)
                console.log("indexOfMiddlePoint: ", indexOfMiddlePoint)
                return

              } else {
                //ignore
              }
           }; //end of for each loop
           console.log("indexOfMiddlePoint: ", indexOfMiddlePoint)

           flightPath.setMap(map);

          } else {
            window.alert('Directions request failed due to ' + status);
          }
        }); // end of function(response, status)
      } // end of calculateAndDisplayRoute()

      calculateAndDisplayRoute(directionsService, directionsDisplay)
    }//end of initialiseMapForSearch()
    initialiseMapForSearch()
});//end of on click search function


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

   var marker = new google.maps.Marker({
    position: middle,
    animation: google.maps.Animation.DROP,
    icon: "assets/images/GoogleMapsMarkers/orange_MarkerM.png",
    map: map
  });

  map.setCenter(middle)
  map.setZoom(8);

  geocoder.geocode({'location': middle}, function(results, status) {
    console.log("geocoder results with middle: ", results)
     if (status === 'OK') {
       if (results[0]) {


         var positionLat = middle.lat()//marker.getPosition().lat()
         var positionLng = middle.lng()//marker.getPosition().lng()
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

         $("#show-restaurants").on("click", function(){
             getPlaces(middle, map, initialiseMapForSearch)
         })



         console.log("placeId: ", placeId);
         console.log(results[0].formatted_address);
         codeAddress(addressMiddle, geocoder)
         getWeatheReport(positionLat, positionLng)
         getVegeterianPlaces(positionLat, positionLng, geocoder, map)
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
   var arrayOfLat =[];
   var arrayOfLng =[];
   var arrayOfLatLng = [];

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


   $("#show-elec").on("click", function(){
     getElecStation(arrayOfLatLng, map);
   })



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

 function getPlaces(middle, map, initialiseMapForSearch) {
           var infowindow;
           var request;
           var service;
           // markers are the icons that denote the places
           var markers = [];
           infowindow = new google.maps.InfoWindow();
           var service = new google.maps.places.PlacesService(map);
           service.nearbySearch({
             location: middle,
             radius: 10000,
             //keyword: "vegetarian",
             //type: 'restaurant'
             type: "lodging",
           }, callback);

           google.maps.event.addListener(map, 'dbclick', function(event) {
               map.setCenter(event.latLng)
               clearResults(markers)

               var request = {
                   location: event.latLng,
                   radius: 10000,
                   type: "lodging"
               };
               service.nearbySearch(request, callback);
           })


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
           var marker = new google.maps.Marker({
             map: map,
             icon: "assets/images/GoogleMapsMarkers/pink_MarkerR.png",
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

         function clearResults(markers) {
             for (var m in markers) {
                 markers[m].setMap(null)
             }
             markers = []
             console.log(markers);
         }


         google.maps.event.addDomListener(window, 'load', initialiseMapForSearch);

 }//getPlaces


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




  //autocompleteOrigin.addListener('place_changed', function() {
          //infowindow.close();
    //       marker.setVisible(false);
    //       var placeOrigin = autocompleteOrigin.getPlace();
    //       if (!placeOrigin.geometry) {
    //         // User entered the name of a Place that was not suggested and
    //         // pressed the Enter key, or the Place Details request failed.
    //         window.alert("No details available for input: '" + placeOrigin.name + "'");
    //         return;
    //       }
    //
    //       if (placeOrigin.geometry.viewport) {
    //         map.fitBounds(placeOrigin.geometry.viewport);
    //       } else {
    //         map.setCenter(placeOrigin.geometry.location);
    //         map.setZoom(7);
    //
    //
    //       }
    //       marker.setPosition(placeOrigin.geometry.location);
    //       marker.setVisible(true);
    //       var locationOfOrigin = placeOrigin.geometry.location;
    //       console.log("locationOfOrigin: ", locationOfOrigin)
    //       locationOfOriginLat = locationOfOrigin.lat();
    //       locationOfOriginLng = locationOfOrigin.lng();
    //
    // });//autocompleteOrigin.addListener closed

    // console.log("locationOfOriginLat: ", locationOfOriginLat)
    // console.log("locationOfOriginLng: ", locationOfOriginLng)


//} //close init map for autocomplit




// // function initMap() {
//   var directionsService = new google.maps.DirectionsService;
//   var directionsDisplay = new google.maps.DirectionsRenderer;
//   var geocoder = new google.maps.Geocoder;
//
//   var map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 4,
//     center: {lat: 39.33, lng: -99.74}
//   });
//
//   //directionsDisplay.setMap(map);
//
//    marker1 = new google.maps.Marker({
//          map: map,
//          position: {lat: 40.714, lng: -74.006}
//        });
   //
   // marker2 = new google.maps.Marker({
   //   map: map,
   //   position: {lat: 48.857, lng: 2.352}
   // });
   //
   // var bounds = new google.maps.LatLngBounds(
   //     marker1.getPosition(), marker2.getPosition());
   // map.fitBounds(bounds);
   //
   // poly = new google.maps.Polyline({
   //        strokeColor: '#FF0000',
   //        strokeOpacity: 1.0,
   //        strokeWeight: 3,
   //        map: map,
   //      });

  //   geodesicPoly = new google.maps.Polyline({
  //     strokeColor: '#CC0099',
  //     strokeOpacity: 1.0,
  //     strokeWeight: 3,
  //     geodesic: true,
  //     map: map
  //   });
  //
  //   update();
  // }

  // function update() {
  //       var path = [marker1.getPosition(), marker2.getPosition()];
  //       poly.setPath(path);
  //       geodesicPoly.setPath(path);
  //     }

  // function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  //   directionsService.route({
  //     origin: "san francisco, ca",
  //     destination: "new york, ny",
  //     travelMode: 'DRIVING'
  //   }, function(response, status) {
  //     if (status === 'OK') {
  //       directionsDisplay.setDirections(response);
  //       var overviewPath = response.routes[0].overview_path;
  //       var overviewPolyline = response.routes[0].overview_polyline;
  //       console.log("overviewPath:  ", overviewPath)
  //       console.log("overviewPolyline:  ", overviewPolyline)
  //
  //       var arrayOfLat =[];
  //       var arrayOfLng =[];
  //       var arrayOfLatLng = [];
  //
  //
  //       getCoordinatesOfEachPointOfTheRoute()
  //
  //
  //       var flightPath = new google.maps.Polyline({
  //         path: overviewPath,
  //         geodesic: true,
  //         strokeColor: '#FF0000',
  //         strokeOpacity: 0.0,
  //         strokeWeight: 2
  //       });
  //
  //      var flightPathGetPath = flightPath.getPath();
  //      console.log("flightPathGetPath: ", flightPathGetPath)
  //      var computePath = google.maps.geometry.spherical.computeLength(flightPathGetPath)
  //      var halfOfComputePath = computePath / 2;
  //      console.log("computePath: ", computePath)
  //      console.log("halfOfComputePath: ", halfOfComputePath)
  //
  //      var arrayFindHalfDistance = [];
  //      var indexOfMiddlePoint = 0;
  //
  //      for (var i = 0; i < overviewPath.length; i++){
  //         arrayFindHalfDistance.push(overviewPath[i])
  //         flightPath = new google.maps.Polyline({
  //           path: arrayFindHalfDistance,
  //           geodesic: true,
  //           strokeColor: '#FF0000',
  //           strokeOpacity: 1.0,
  //           strokeWeight: 2
  //         });
  //
  //         flightPathGetPath = flightPath.getPath();
  //         var computeHalfPath = google.maps.geometry.spherical.computeLength(flightPathGetPath)
  //         console.log(i, " computeHalfPath: ", computeHalfPath)
  //         if (computeHalfPath >= halfOfComputePath) {
  //
  //           flightPath = new google.maps.Polyline({
  //             path: arrayFindHalfDistance,
  //             geodesic: true,
  //             strokeColor: '#FF0000',
  //             strokeOpacity: 1.0,
  //             strokeWeight: 2
  //           });
  //           flightPath.setMap(map);
  //
  //           indexOfMiddlePoint = arrayFindHalfDistance[i];
  //           pinMiddlePoint(arrayFindHalfDistance[i])
  //           console.log("indexOfMiddlePoint: ", indexOfMiddlePoint)
  //           return
  //
  //         } else {
  //           //ignore
  //         }
  //      }; //end of for each loop
  //      console.log("indexOfMiddlePoint: ", indexOfMiddlePoint)
  //
  //      function pinMiddlePoint(middle) {
  //
  //        var marker = new google.maps.Marker({
  //         position: middle,
  //         map: map
  //       });
  //        geocoder.geocode({'location': middle}, function(results, status) {
  //          console.log("geocoder results with middle: ", results)
  //           if (status === 'OK') {
  //             if (results[0]) {
  //               map.setZoom(8);
  //               var marker = new google.maps.Marker({
  //                 position: middle,
  //                 map: map,
  //                 title: 'Hello Middle Point!'
  //               });
  //               var positionLat = marker.getPosition().lat()
  //               var positionLng = marker.getPosition().lng()
  //               var coordinatesMiddle = [];
  //               coordinatesMiddle.push(positionLat)
  //               coordinatesMiddle.push(positionLng)
  //               console.log("coordinatesMiddle: ", coordinatesMiddle)
  //
  //               var addressMiddle = results[0].formatted_address;
  //               var placeId = results[0].place_id;
  //               console.log("placeId: ", placeId);
  //               console.log(results[0].formatted_address);
  //               codeAddress(addressMiddle)
  //               getWeatheReport(positionLat, positionLng)
  //             } else {
  //               window.alert('No results found');
  //             }
  //           } else {
  //             window.alert('Geocoder failed due to: ' + status);
  //           }
  //         });// end of pinMiddlePoint
  //
  //        function codeAddress(address) {
  //           geocoder.geocode( { 'address': address}, function(results, status) {
  //             if (status == 'OK') {
  //               map.setCenter(results[0].geometry.location);
  //               console.log("results[0].geometry.location: ", results[0].geometry.location.lat());
  //
  //             } else {
  //               alert('Geocode was not successful for the following reason: ' + status);
  //             }
  //           });
  //         }// end of codeAddress
  //      }
  //
  //       flightPath.setMap(map);
  //
  //     } else {
  //       window.alert('Directions request failed due to ' + status);
  //     }
  //   }); // end of function(response, status)
  // } // end of calculateAndDisplayRoute()
  //
  // calculateAndDisplayRoute(directionsService, directionsDisplay)
//}// end of initMap()
