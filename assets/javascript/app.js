function initMap() {
  var moscow = {lat: 55.755, lng: 37.617};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: moscow
  });
  var marker = new google.maps.Marker({
    position: moscow,
    map: map
  });
}
