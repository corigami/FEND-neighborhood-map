/*global google, LocItem, app */
var app = app || {};

/**
 * @description - helper object for map functions.  Some of the functionality
 *                was derived from the nanodegree resume project.
 * @constructor
 */
var MapHelper = function () {
    'use strict';
    var self = this,
        i = '',
        mapLocations = '';
    self.map = '';
    self.service = '';

    /**
     * @description - initialize default map view
     * @param {array} locations - array of locations
     */
    self.initMap = function (locations) {
        mapLocations = locations;
        self.map = new google.maps.Map(document.getElementById('map_container'), {
            center: {
                lat: 39.764093,
                lng: -84.187295
            },
            zoom: 12
        });

        // Sets the boundaries of the map based on pin locations
        window.mapBounds = new google.maps.LatLngBounds();
        self.service = new google.maps.places.PlacesService(self.map);

        //adds window event listener to the map.  redraws map to fit pins within new size
        google.maps.event.addDomListener(window, 'resize', function () {
            self.map.fitBounds(window.mapBounds);
            self.map.setCenter(window.mapBounds.getCenter());
        });
        self.placePins();

    };

    /**
     * @description - places pins by getting calling the google textSearch service
     *                with the formatted requests object and callback function
     * @param {array} locations - array of locations
     */
    self.placePins = function () {
        // Iterates through the array of locations, creates a search object for each location
        mapLocations.forEach(function (place) {
            // the search request object
            var request = {
                query: place.queryString()

            };

            // Actually searches the Google Maps API for location data and runs the callback
            // function with the search results after each search.
            self.service.textSearch(request, place.gCallback);
        });
    };

    /**
     * @description - creates google map marker objects and adds event listeners
     * @param {object} placeData - data returned from google textSearch
     * @param {object} locItem - data object that represents locations
     */
    window.createMarker = function (placeData, locItem) {
        // The next lines save location data from the search result object to local variables
        var lat = placeData.geometry.location.lat(), // latitude from the place service
            lon = placeData.geometry.location.lng(), // longitude from the place service
            name = placeData.formatted_address, // name of the place from the place service
            bounds = window.mapBounds, // current boundaries of the map window
            // marker is an object with additional data about the pin for a single location
            marker = new google.maps.Marker({
                map: self.map,
                position: placeData.geometry.location,
                title: name,
                icon: locItem.pinImage
            });

        //adds click event listener to marker
        google.maps.event.addListener(marker, 'click', function () {
            app.viewModel.showPin(locItem);

        });

        // this is where the pin actually gets added to the map.
        // bounds.extend() takes in a map location object
        bounds.extend(new google.maps.LatLng(lat, lon));
        self.map.fitBounds(bounds); // fit the map to the new marker
        self.map.setCenter(bounds.getCenter()); // center the map
        locItem.pin = marker;
    };

    /**
     * @description -  creates a info window to be attached to a pin.
     *                 Only one window should be created according to google
     *                 best practices.
     */
    self.createInfoWindow = function () {
        var window = new google.maps.InfoWindow({
            content: ''
        });
        return window;
    };
};