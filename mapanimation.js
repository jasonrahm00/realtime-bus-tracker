const busIcons = [
  ['bus1.png', 'bus2.png']
];
const allTransitRoutes = [];
const selector = document.getElementById('route-selector');

let map;
let mapCenter = { lat:42.353350, lng:-71.091525 };
let markers = [];
let routeId = '';

// Get all transit routes
(async function getAllRoutes() {
  const url = 'https://api-v3.mbta.com/routes';
  const response = await fetch(url);
  const json = await response.json();
  const data = await json.data;

  data.forEach(route => {
    let entry = {
      id: route.id,
      type: route.attributes.type,
      name: route.attributes.long_name
    };

    let option = document.createElement('option');
    option.value = entry.id;
    option.text = entry.name;

    selector.appendChild(option);
    allTransitRoutes.push(entry);
  });
  selector.addEventListener('change', selectRoute)
})();

// Clear markers
function clearMarkers() {
  markers.forEach(marker => {
    marker.marker.setMap(null);
  })
  markers = [];
}

// Handle change event from selector
function selectRoute(e) {
  let selectedRoute = e.target.value;
  if (routeId === selectedRoute) return;
  clearMarkers();
  routeId = selectedRoute;
  placeMarkers();
}

// Request route data from MBTA
async function getBusLocations() {
  const url = `https://api-v3.mbta.com/vehicles?filter[route]=${routeId}&include=trip`;
  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}

// Place markers on map
async function placeMarkers() {
  // Get all buses from API
  let buses = await getBusLocations();

  buses.forEach(bus => {
    // Test to see if marker already exists for each bus
    let marker = markers.find(marker => marker.id === bus.id);

    if (marker) {
      // Move marker if it already exists
      moveMarker(marker, bus);
    } else {
      // Otherwise, create new marker
      createMarker(bus);
    }
  });

  setTimeout(placeMarkers, 15000);

}

// Move bus marker
function moveMarker(marker, bus) {

  // Update marker direction and icon if different
  if (marker.direction !== bus.attributes.direction_id) {
    marker.direction = bus.attributes.direction_id;
  }

  // Update bus/marker position if marker exists
  marker.marker.setPosition({
    lat: bus.attributes.latitude,
    lng: bus.attributes.longitude
  });

}

// Create bus marker
async function createMarker(bus) {
  const { Marker } = await google.maps.importLibrary("marker");

  let marker = new Marker({
    map,
    position: {
      lat: bus.attributes.latitude,
      lng: bus.attributes.longitude
    },
    // icon: busIcons[0][bus.attributes.direction_id]
  });

  markers.push({
    id: bus.id, 
    direction: bus.attributes.direction_id, 
    marker
  });

}

// Create and initialize google map
(async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  
  map = new Map(document.getElementById("map"), {
    center: mapCenter,
    zoom: 14
  });

})();
