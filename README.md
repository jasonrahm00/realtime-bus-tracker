# Real Time Bus Tracker

The goal of this project is to track real-time locations of busses in the Massachusetts Bay Transportation Authority (MBTA). Bus data was retrieved from the MBTA API and their API documentation was utilized to determine how to extract necessary data points. This project was created as an assingment for the MIT Full-Stack MERN Certification. For information on other projects I created for this certficiation, visit my [Github Portfolio Page](https://jasonrahm00.github.io/).

## Features

### Original Project Features

- Pull location data from the [MBTA API](https://api-v3.mbta.com) for a single bus route running between MIT and Harvard
- Use Google Maps JavaScript API to display the location of the bus along the route
- Update the map every 15 seconds with the new location of the bus

### Enhancements

- Pulled vehicle location data for all routes from the MBTA API
- Pulled the shape of each route, which is an encoded polyline
- Added selector to select specific routes
- Added markers for all vehicles along the route
- Used Google Maps Geometry library to decode the route shape polyline and add it to the map, highlighting the exact route
- Adjusted the map center, zoom and boundaries to focus on the activated route

### Improvement Roadmap

- Handle empty/buggy results: Some routes display nothing on the map or cause console errors, those need to be handled
- General code cleanup: code is a little dirty, presently
- Check routes against live examples from MBTA, some of the polylines are really complicated and want to verify they are accurate
- Add "Reset" button to the interface to clear current route and reset center of map
- Add a way to distinguish the different route types (bus, train, commuter, ferry), either through groups in the selector or radio buttons
- Replace the default map marker with custom icons for each route type
- Improve overall styling: current efforts focused solely on functionality
- Distinguish the direction the vehicle is moving
- Investigate whether or not decoding of the route polyline is necessary to add to map 
  - GMaps documentation shows you have to decode then re-encode to add to the map
  - This seems like an unnecessary step
- Investigate replacing GMaps with Mapbox (might allow easier customization of map)???

## Implementation

- Clone, fork or download the repository
- Create your own [Google API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
- Add the API Key to the script tag in the index.html file where it says: Your_API_Key
- Load the index.html into the browser or use a local server

## Licensing

Licensed under the terms of the MIT license.
