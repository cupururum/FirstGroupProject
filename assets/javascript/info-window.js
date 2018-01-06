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