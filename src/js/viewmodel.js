var app = app || {};

'use strict';
app.ViewModel = function () {
    var self = this;
    var currentLocation = '';
    var map;

    this.menuList = ko.observableArray();

    app.model.getAllLocations().forEach(function (loc) {
        self.menuList.push(new MenuItem(loc));
    });

    //Open the drawer when the menu icon is clicked.
    var $menu = $('#menu');
    var $main = $('#map_container');
    var $drawer = $('.nav');

    $menu.click(function (e) {
        $drawer.toggleClass('open');
        e.stopPropagation();
    });

    $main.click(function () {
        $drawer.removeClass('open');
    });

    //initialize default map view
    initMap = function () {
        self.map = new google.maps.Map(document.getElementById('map_content'), {
            center: {
                lat: 39.764093,
                lng: -84.187295
            },
            zoom: 12
        });

        // Sets the boundaries of the map based on pin locations
        window.mapBounds = new google.maps.LatLngBounds();
        placePins(getLocStrings());
    };

    /*
    pinPoster(locations) takes in the array of locations created by locationFinder()
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
            service.textSearch(request, callback);
        });
    };

    /*
    getLocStrings() returns an array of every location string from the JSONs
    written for bio, education, and work.
    */
    getLocStrings = function () {
        var locations = [];
        app.model.getAllLocations().forEach(function (loc) {
            var locStr = loc.address + ', ' + loc.city;
            locations.push(locStr);
        });
        return locations;
    };

    /*
    pinPoster(locations) takes in the array of locations created by locationFinder()
    and fires off Google place searches for each location
    */
    placePins = function (locations) {

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
            service.textSearch(request, callback);
        });
    };

    /*
    callback(results, status) makes sure the search returned results for a location.
    If so, it creates a new map marker for that location.
    */
    callback = function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            createMarker(results[0]);
        }
    }

    /*
    createMapMarker(placeData) reads Google Places search results to create map pins.
    placeData is the object returned from search results containing information
    about a single location.
    */
    createMarker = function (placeData) {
        // The next lines save location data from the search result object to local variables
        var lat = placeData.geometry.location.lat(), // latitude from the place service
            lon = placeData.geometry.location.lng(), // longitude from the place service
            name = placeData.formatted_address, // name of the place from the place service
            bounds = window.mapBounds, // current boundaries of the map window
            // marker is an object with additional data about the pin for a single location
            marker = new google.maps.Marker({
                map: self.map,
                position: placeData.geometry.location,
                title: name
            }),
            // infoWindows are the little helper windows that open when you click
            // or hover over a pin on a map. They usually contain more information
            // about a location.
            infoWindow = new google.maps.InfoWindow({
                content: '<div id="markerName">' +
                    '<b>' + name + '</b>' +
                    '</div>'
            });
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(self.map, marker);
        });

        // this is where the pin actually gets added to the map.
        // bounds.extend() takes in a map location object
        bounds.extend(new google.maps.LatLng(lat, lon));
        self.map.fitBounds(bounds); // fit the map to the new marker
        self.map.setCenter(bounds.getCenter()); // center the map
    }

    window.addEventListener('load', initMap);

};

//bind the view to our ViewModel
ko.applyBindings(new app.ViewModel());
