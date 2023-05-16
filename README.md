# Real Time Bus Tracker
This project was created as an assingment for the MIT Full-Stack MERN Certification. The goal is to create a bus-tracker using real-time data from the Massachusetts Bay Transportation Authority (MBTA).
## Features
### Original Project Features
- Pull location data from the [MBTA API](https://api-v3.mbta.com) for a single bus route running between MIT and Harvard
- Use Google Maps JavaScript API to display the location of the bus along the route
- Update the map every 15 seconds with the new location of the bus
### Enhancements
- Pulled vehicle location data for all routes from the MBTA API
- Pulled the shape of each route which is an encoded polyline 
- Added selector to select specific routes
- Added markers for all vehicles along the route
- Used Google Maps Geometry library to decode the polyline and add an outline to the map highlighting the exact route
- Adjusted the map center and zoom/boundaries to focus on the activated route 
### Improvement Roadmap
- Handle empty/buggy results: Some route display nothing on the map or cause console errors, those need to be handled
- Add "Reset" button to the interface to clear current route and reset center of map
- Add a way to distinguish the different route types (bus, train, commuter, ferry), either through groupes in the selector or radio buttons
- Replace the default map marker with custom icons for each route type
## Implementation
- Clone the repository
- Create your own [Google API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
- Add the API Key to the <script> tag in the index.html file where it says: Your_API_Key
- Load the index.html into the browser or use a local server
## Licensing
Licensed under the terms of the MIT license.
