// Bus tracker function
var map;
var markers = [];
            
 // load map
function init(){
    var myMap = {
    zoom      : 14,
    // centered at MIT
    center    : { lat:42.36008201889161,lng:-71.09835377702795},
    mapTypeId : google.maps.MapTypeId.ROADMAP
};
    var element = document.getElementById('map');
    map = new google.maps.Map(element, myMap);
    addMarkers();
}
            
// add bus markers to map
async function addMarkers(){
// get bus data
    var locations = await getBusLocations();
            
// loop through data, add bus markers
locations.forEach(function(bus){
    var marker = getMarker(bus.id);		
    if (marker){
        moveMarker(marker,bus);
    }
    else{
        addMarker(bus);
    }
});

console.log(new Date());
setTimeout(addMarkers,15000);
}
            
// request real-time bus data from Massachusetts Bay Transportation Authority (MBTA)
async function getBusLocations(){
    var url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';	
    var response = await fetch(url);
    var json     = await response.json();
    return json.data;
}

function addMarker(bus){
    var icon = getIcon(bus);
    var marker = new google.maps.Marker({
    position: {
        lat: bus.attributes.latitude,
        lng: bus.attributes.longitude
    },
        map: map,
        icon: icon,
        id: bus.id
    });
        markers.push(marker);
    }
            
function getIcon(bus){
// select icon based on bus direction
    if (bus.attributes.direction_id === 0) {
        return 'mybusA.png';
    }
    return 'mybusB.png';
}
            
function moveMarker(marker,bus) {
// change icon if bus has changed direction
var icon = getIcon(bus);
marker.setIcon(icon);
            
// move icon to new latitude/longitude
marker.setPosition( {
    lat: bus.attributes.latitude, 
    lng: bus.attributes.longitude
});
}
            
function getMarker(id){
    var marker = markers.find(function(item){
        return item.id === id;
    });
    return marker;
}
window.onload = init;

let counter = 0;
function move() {
    setTimeout(() => {
        if (counter >= busStops.length) return;
        marker.setLngLat(busStops[counter]);
        counter++;
        move();
      }, 1000);
}

if (typeof module !== 'undefined') {
    module.exports = { move };
  }