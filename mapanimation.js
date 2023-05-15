const busIcons = [
  ['bus1.png', 'bus2.png']
];
let map;
let mapCenter = { lat:42.353350, lng:-71.091525 };
let markers = [];

// Request bus data from MBTA
async function getBusLocations() {
  const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}

(async function getAllRoutes() {
  const url = 'https://api-v3.mbta.com/routes';
  const response = await fetch(url);
  const json = await response.json();
  console.log(json.data);
})()

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
    icon: busIcons[0][bus.attributes.direction_id]
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

  // Call placeMarkers function to add markers to the map
  placeMarkers();

})();
