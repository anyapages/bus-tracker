let map;
let markers = [];

// Initialise the map, centered at MIT
function initMap() {
  const myMap = {
    zoom: 14,
    center: { lat: 42.36008201889161, lng: -71.09835377702795 },
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  const element = document.getElementById('map');
  map = new google.maps.Map(element, myMap);
  addMarkers();
}

// Add bus markers to the map
async function addMarkers() {
  const locations = await getBusLocations();

  locations.forEach(bus => {
    const marker = getMarker(bus.id);

    if (marker) {
      moveMarker(marker, bus);
    } else {
      addMarker(bus);
    }
  });

  setTimeout(addMarkers, 15000); // Refresh markers every 15 seconds
}

// Request real-time bus data from Massachusetts Bay Transportation Authority (MBTA)
async function getBusLocations() {
  const url = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap';
  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}

// Add a new marker for the bus
function addMarker(bus) {
  const icon = getIcon(bus);
  const marker = new google.maps.Marker({
    position: { lat: bus.attributes.latitude, lng: bus.attributes.longitude },
    map,
    icon,
    id: bus.id
  });

  markers.push(marker);
}

// Determine the appropriate icon for the bus based on its direction
function getIcon(bus) {
  if (bus.attributes.direction_id === 0) {
    return 'mybusA.png';
  }
  return 'mybusB.png';
}

// Update the position and icon of an existing marker
function moveMarker(marker, bus) {
  const icon = getIcon(bus);
  marker.setIcon(icon);
  marker.setPosition({
    lat: bus.attributes.latitude,
    lng: bus.attributes.longitude
  });
}

// Get the marker by its ID
function getMarker(id) {
  return markers.find(item => item.id === id);
}

window.onload = initMap;
