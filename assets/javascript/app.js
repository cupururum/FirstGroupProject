
function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var geocoder = new google.maps.Geocoder;

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 39.33, lng: -99.74}
  });

  directionsDisplay.setMap(map);

  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: "san francisco, ca",
      destination: "mammoth lakes, ca",
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        var overviewPath = response.routes[0].overview_path;
        var overviewPolyline = response.routes[0].overview_polyline;
        console.log("overviewPath:  ", overviewPath)
        console.log("overviewPolyline:  ", overviewPolyline)
        // $.ajax({
        //     url: 'https://developers.zomato.com/api/v2.1/geocode?lat=38.78318&lon=-120.22406',
        //
        //     headers: {
        //         'user-key': '8376a5feabb71417a346299da63ae0b3'
        //     }
        //
        //
        // }).done(function(data){
        //     console.log(data);
        // });
        //console.log("overviewPolyline:  ", overviewPath)
        var flightPath = new google.maps.Polyline({
          path: overviewPath,
          // geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 0.0,
          // strokeWeight: 2
        });

       var flightPathGetPath = flightPath.getPath();

       var computePath = google.maps.geometry.spherical.computeLength(flightPathGetPath)
       var halfOfComputePath = computePath / 2;
       console.log("computePath: ", computePath)
       console.log("halfOfComputePath: ", halfOfComputePath)

       var arrayfindHalfDistance = [];
       var indexOfMiddlePoint = 0;

       for (var i = 0; i < overviewPath.length; i++){
          arrayfindHalfDistance.push(overviewPath[i])
          flightPath = new google.maps.Polyline({
            path: arrayfindHalfDistance,
            // geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            // strokeWeight: 2
          });

          flightPathGetPath = flightPath.getPath();
          var computeHalfPath = google.maps.geometry.spherical.computeLength(flightPathGetPath)
          console.log(i, " computeHalfPath: ", computeHalfPath)
          if (computeHalfPath >= halfOfComputePath) {

            flightPath = new google.maps.Polyline({
              path: arrayfindHalfDistance,
              // geodesic: true,
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              // strokeWeight: 2
            });
            flightPath.setMap(map);

            indexOfMiddlePoint = arrayfindHalfDistance[i];
            pinMiddlePoint(arrayfindHalfDistance[i])
            console.log("indexOfMiddlePoint: ", indexOfMiddlePoint)
            return

          } else {
            //ignore
          }
       }; //end of for each loop
       console.log("indexOfMiddlePoint: ", indexOfMiddlePoint)

       function pinMiddlePoint(middle) {

         var marker = new google.maps.Marker({
          position: middle,
          map: map
        });
         geocoder.geocode({'location': middle}, function(results, status) {
           console.log("geocoder results with middle: ", results)
            if (status === 'OK') {
              if (results[0]) {
                map.setZoom(8);
                var marker = new google.maps.Marker({
                  position: middle,
                  map: map
                });
                var positionLat = marker.getPosition().lat()
                var positionLng = marker.getPosition().lng()
                var coordinatesMiddle = [];
                coordinatesMiddle.push(positionLat)
                coordinatesMiddle.push(positionLng)
                console.log("coordinatesMiddle: ", coordinatesMiddle)
                // console.log("positionLat: ", positionLat)
                // console.log("positionLng: ", positionLng)
                var addressMiddle = results[0].formatted_address;
                var placeId = results[0].place_id;
                console.log("placeId: ", placeId);
                console.log(results[0].formatted_address);
                codeAddress(addressMiddle)
              } else {
                window.alert('No results found');
              }
            } else {
              window.alert('Geocoder failed due to: ' + status);
            }
          });// end of pinMiddlePoint

         function codeAddress(address) {
            geocoder.geocode( { 'address': address}, function(results, status) {
              if (status == 'OK') {
                map.setCenter(results[0].geometry.location);
                console.log("results[0].geometry.location: ", results[0].geometry.location.lat());

              } else {
                alert('Geocode was not successful for the following reason: ' + status);
              }
            });
          }// end of codeAddress
       }
        flightPath.setMap(map);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    }); // end of function(response, status)
  } // end of calculateAndDisplayRoute()

  calculateAndDisplayRoute(directionsService, directionsDisplay)
}// end of initMap()
