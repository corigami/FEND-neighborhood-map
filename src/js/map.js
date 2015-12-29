/*global google, app */
var app = app || {};
MapHelper = function () {
    var self = this;
    var map = '';


    //initialize default map view
    self.initMap = function (locations) {
        map = new google.maps.Map(document.getElementById('map_content'), {
            center: {
                lat: 39.764093,
                lng: -84.187295
            },
            zoom: 12
        });

        // Sets the boundaries of the map based on pin locations
        window.mapBounds = new google.maps.LatLngBounds();
        self.placePins(locations);
    };

    /*
    getPins(locations) takes in the array of locations created by locationFinder()
    and fires off Google place searches for each location
    */
    getPins = function (locations) {

        // creates a Google place search service object. PlacesService does the work of
        // actually searching for location data.
        var service = new google.maps.places.PlacesService(self.map);

        // Iterates through the array of locations, creates a search object for each location
        locations.forEach(function (place) {

            // the search request object
            var request = {
                query: place
            };

            // Actually searches the Google Maps API for location data and runs the callback
            // function with the search results after each search.
            service.textSearch(request, place.callback);
        });
    };

    /*
    pinPoster(locations) takes in the array of locations created by locationFinder()
    and fires off Google place searches for each location
    */
    self.placePins = function (locations) {
        // creates a Google place search service object. PlacesService does the work of
        // actually searching for location data.
        var service = new google.maps.places.PlacesService(map);

        // Iterates through the array of locations, creates a search object for each location
        locations.forEach(function (place) {
            // the search request object
            var request = {
                query: place.queryString()
            };

            // Actually searches the Google Maps API for location data and runs the callback
            // function with the search results after each search.
            service.textSearch(request, place.gCallback);
        });
    };



    /*
    createMapMarker(placeData) reads Google Places search results to create map pins.
    placeData is the object returned from search results containing information
    about a single location.
    */
    createMarker = function (placeData, locItem) {
        // The next lines save location data from the search result object to local variables
        var lat = placeData.geometry.location.lat(), // latitude from the place service
            lon = placeData.geometry.location.lng(), // longitude from the place service
            name = placeData.formatted_address, // name of the place from the place service
            bounds = window.mapBounds, // current boundaries of the map window
            // marker is an object with additional data about the pin for a single location
            marker = new google.maps.Marker({
                map: map,
                position: placeData.geometry.location,
                title: name
            });

        google.maps.event.addListener(marker, 'click', function () {
            app.viewModel.currentLocation().bounceOff();
            app.viewModel.currentLocation(locItem);
            app.viewModel.showPin();

        });
        google.maps.event.addListener(map, 'click', function () {
            app.viewModel.hidePin();

        });

        // this is where the pin actually gets added to the map.
        // bounds.extend() takes in a map location object
        bounds.extend(new google.maps.LatLng(lat, lon));
        map.fitBounds(bounds); // fit the map to the new marker
        map.setCenter(bounds.getCenter()); // center the map
        return marker;
    };

    self.createInfoWindow = function (currentLoc) {
        var window = new google.maps.InfoWindow({
            content: ""
        })
        return window;
    };
}
