/**
 * Global variable declaration
 */
const allTransitRoutes = [];
const selector = document.getElementById('route-selector');

let map;
let mapCenter = { lat:42.353350, lng:-71.091525 };
let markers = [];
let routeId = '';

/**
 * Anonymous initialization functions
 */

// Get all transit routes
(async () => {
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
  selector.addEventListener('change', selectRoute);
})();

// Create and initialize google map
(async () => {
  const { Map } = await google.maps.importLibrary("maps");
  
  map = new Map(document.getElementById("map"), {
    center: mapCenter,
    zoom: 14
  });

})();

/**
 * Interaction functions
 */

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
async function getLocations() {
  const url = `https://api-v3.mbta.com/vehicles?filter[route]=${routeId}&include=trip`;
  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}

// Place markers on map
async function placeMarkers() {
  // Get all vehicles from API
  let locations = await getLocations();

  locations.forEach(vehicle => {
    // Test to see if marker already exists for each vehicle
    let marker = markers.find(marker => marker.id === vehicle.id);

    if (marker) {
      // Move marker if it already exists
      moveMarker(marker, vehicle);
    } else {
      // Otherwise, create new marker
      createMarker(vehicle);
    }
  });

  setTimeout(placeMarkers, 15000);

}

// Move marker
function moveMarker(marker, vehicle) {

  // Update marker direction and icon if different
  if (marker.direction !== vehicle.attributes.direction_id) {
    marker.direction = vehicle.attributes.direction_id;
  }

  // Update marker position if marker exists
  marker.marker.setPosition({
    lat: vehicle.attributes.latitude,
    lng: vehicle.attributes.longitude
  });

}

// Create marker
async function createMarker(vehicle) {
  const { Marker } = await google.maps.importLibrary("marker");

  let marker = new Marker({
    map,
    position: {
      lat: vehicle.attributes.latitude,
      lng: vehicle.attributes.longitude
    },
  });

  markers.push({
    id: vehicle.id, 
    direction: vehicle.attributes.direction_id, 
    marker
  });

}
