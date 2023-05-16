/**
 * Global variable declaration
 */
const allTransitRoutes = [];
const selector = document.getElementById('route-selector');

let map;
let mapCenter = { lat:42.353350, lng:-71.091525 };
let markers = [];
let routeId = '';
let routePath = null;

/**
 * Anonymous initialization functions
 */

// Get all transit routes
(async () => {
  const url = 'https://api-v3.mbta.com/routes';
  const response = await fetch(url);
  const json = await response.json();
  const data = await json.data;

  // Create options for each route returned form API
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

  // Attach event listener to newly created selector
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
function clearMap() {

  // Remove route path
  routePath.setMap(null);

  // Remove markers
  markers.forEach(marker => {
    marker.marker.setMap(null);
  })
  markers = [];

}

// Get route outline
async function traceRoute() {
  const {encoding} = await google.maps.importLibrary("geometry");

  // Retrieve route polyline from MTBA
  const url = `https://api-v3.mbta.com/shapes?filter[route]=${routeId}`;
  const response = await fetch(url);
  const json = await response.json();
  const shapes = json.data;
  let segments = [];
  let bounds = new google.maps.LatLngBounds();

  // Iterate over each polyline and convert into geo coordinates for use by gMaps
  shapes.forEach(shape => {
    const path = encoding.decodePath(shape.attributes.polyline);

    // Decode into Lag/Long Coordinates
    path.forEach(segment => {
      let latLong = {lat: segment.lat(), lng: segment.lng()};

      // Change the bounding box of the map to focus on the route data
      bounds.extend(new google.maps.LatLng(latLong.lat, latLong.lng));

      // Push coordinate objects to array for later use
      segments.push(latLong);
    });

  });

  // Generate polyline of route using available segments
  routePath = new google.maps.Polyline({
    path: segments,
    geodesic: true,
    strokeColor: '#0000ff',
    strokeOpacity: 1,
    strokeWeight: 5
  });

  // Add the path to the map
  routePath.setMap(map);

  // Recenter and re-zoom the map to focus on the route
  map.setCenter(bounds.getCenter());
  map.fitBounds(bounds);
  
}

// Handle change event from selector
function selectRoute(e) {
  let selectedRoute = e.target.value;

  // Do nothing if the same route is selected
  if (routeId === selectedRoute) return;

  // Only clear map if there is already a route
  if (routePath !== null) clearMap();

  // Add new data to map
  routeId = selectedRoute;
  traceRoute();
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
