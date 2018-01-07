var map;
var infoWindow;
var places;

var request;
var service; //this is the same as places
var markers = [];
var hostnameRegexp = new RegExp('^https?://.+?/');

function initialize() {
  var center = new google.maps.LatLng(37.422, -122.084058);
  //place the middle point in the center variable within the initialize function
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 13
  });

  request = {
    location: center,
    radius: 10000,
    type: ['lodging']
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
      radius: 10000,
      type: ['lodging']
    };
    places.nearbySearch(request, callback);
  })

}

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
  var photos = place.photos;
  if (!photos) {
    return;
  }
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
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
  var marker = this;
  places.getDetails({placeId: marker.placeResult.place_id},
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



google.maps.event.addDomListener(window, 'load', initialize);