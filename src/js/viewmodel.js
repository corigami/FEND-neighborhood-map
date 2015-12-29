var app = app || {};

'use strict';
app.ViewModel = function () {
    var self = this;
    var currentLocation = '';
    var map;
    var infoWindow = '';
    var infoWindowContent = '';

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
        placePins(self.menuList());
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
    placePins = function (locations) {
        // creates a Google place search service object. PlacesService does the work of
        // actually searching for location data.
        var service = new google.maps.places.PlacesService(self.map);

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
            });
        // infoWindows are the little helper windows that open when you click
        // or hover over a pin on a map. They usually contain more information
        // about a location.

        self.infoWindow = new google.maps.InfoWindow({
            content: '<div id="markerName">' +
                '<b>' + name + '</b>' +
                '</div>'
        })

        google.maps.event.addListener(marker, 'click', function () {
            self.infoWindow.open(self.map, marker);
        });

        // this is where the pin actually gets added to the map.
        // bounds.extend() takes in a map location object
        bounds.extend(new google.maps.LatLng(lat, lon));
        self.map.fitBounds(bounds); // fit the map to the new marker
        self.map.setCenter(bounds.getCenter()); // center the map
        return marker;
    };

    onClick = function () {
        if (self.currentLocation) {
            self.currentLocation.bounceOff();
            self.infoWindow.close();
        }
        self.currentLocation = this;
        this.bounceOn();
        self.infoWindow.set
        self.infoWindow.setContent(self.currentLocation.pinContent);
        self.infoWindow.open(this.pin.map, this.pin);
    }

    window.addEventListener('load', initMap);

};


var MenuItem = function (data) {
    var self = this;
    this.name = ko.observable(data.name);
    this.city = ko.observable(data.city);
    this.address = ko.observable(data.address);
    this.queryString = ko.computed(function () {
        return this.address() + ', ' + this.city() + ', USA';
    }, this);
    this.visable = ko.observable(true);
    this.pin = '';

    this.gCallback = function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            self.pin = createMarker(results[0]);
        }
    };
    this.bounceOn = function () {
        self.pin.setAnimation(google.maps.Animation.BOUNCE);
    }
    this.bounceOff = function () {
        self.pin.setAnimation(null);
    }
    this.pinContent = '<div id="markerName">' +
        '<b>' + self.name() + '</b>' +
        '</div>';
}

//bind the view to our ViewModel
ko.applyBindings(new app.ViewModel());