/*global $, MapHelper, Model, ko, LocItem, google */
// global application variable
var app = app || {};


/**
 * @description - controller for index.html
 * @constructor
 */
var ViewModel = function () {
    'use strict';
    var self = this,
        $main = $('#map_container'),
        $nav = $('#menu_container'),
        $menuButton = $('#menu_button_container');
    self.map = new MapHelper();
    self.model = new Model();
    self.infoWindow = '';
    self.filterString = ko.observable();
    self.currentLocation = ko.observable('');
    self.locations = ko.observableArray();

    self.googleTimeout = setTimeout(function () {
        $('#header_status').text("Google Failed To load");
    }, 5000);


    //populate locations observable container with data from model
    self.model.getAllLocations().forEach(function (loc) {
        self.locations.push(new LocItem(loc));
    });

    //get wiki data for each location
    self.locations().forEach(function (loc) {
        self.model.getWikiData(loc);
    });

    /**
     * @description - returns current status of attempt to get information from Wikipedia for currentLocation
     * @returns string literal of wikipedia access status
     */
    self.getWikiString = function () {
        if (this.currentLocation().wikiInfo) {
            if (self.model.getWikiStatus().toString() === 'down') {
                this.currentLocation().wikiInfo("Wikipedia Unavailable");
            } else if (this.currentLocation().wikiInfo().toString() === '') {
                this.currentLocation().wikiInfo("No Wikipedia information available");
            }
            return this.currentLocation().wikiInfo();
        }
    };

    /**
     * @description - sets content string to html to be used by google info window
     */
    self.contentStr = ko.computed(function () {
        return '<div id="infoWindowContent">' +
            '<div><strong>' + this.currentLocation().name + '</strong></div>' +
            '<div id="markerLoc">' + this.currentLocation().address + '<hr></div>' +
            '<p>Wikipedia Description: </p>' +
            '<p><em>' + self.getWikiString() + '</em></p>' +
            '</div>';
    }, this);


    /**
     * @description - displays google maps infor window for the selected location,
     *                changs the marker style, sets the html for the window, and turns on the 
     *                animation for for the location marker
     * @param {locItem} loc - location to be shown.
     */
    self.showPin = function (loc) {
        //if currentLocation has been set
        if (self.currentLocation()) {
            self.pinBounceOff(self.currentLocation().pin);
            self.currentLocation().pin.setIcon(loc.pinImage);
        }
        self.currentLocation(loc);

        //create an info window if it doesn't exist yet.
        if (!self.infoWindow) {
            self.infoWindow = self.map.createInfoWindow();
        }
        self.currentLocation().pin.setIcon('http://maps.google.com/mapfiles/ms/icons/purple-dot.png');
        self.infoWindow.setContent($('#infoWindowContent').html());
        self.pinBounceOn(self.currentLocation().pin);
        self.infoWindow.open(self.currentLocation().pin.map, self.currentLocation().pin);
    };

    /**
     * @description - hides the pin for the location set as the current location
     */
    self.hidePin = function () {
        if (self.currentLocation()) {
            self.pinBounceOff(self.currentLocation().pin);
        }
        if (self.infoWindow) {
            self.infoWindow.close();
        }
    };

    /**
     * @description - Knockout.js computed function that filters the array of locations
     *                based on user input.  This value is used by index.html to populate
     *                the location menu and map pins
     */
    self.filterLocations = ko.computed(function () {
        if (!self.filterString()) {
            self.locations().forEach(function (loc) {
                if (loc.pin) { //only run if pin has been created
                    loc.pin.setVisible(true);
                }
            });
            return self.locations();
        } else {
            return ko.utils.arrayFilter(self.locations(), function (loc) {
                if (loc.name.toLowerCase().search(self.filterString().toLowerCase()) >= 0) {
                    if (loc.pin) {
                        loc.pin.setVisible(true);
                    }
                    return true;
                } else {
                    if (loc.pin) {
                        loc.pin.setVisible(false);
                    }
                    if (self.currentLocation() === loc) {
                        self.hidePin();
                    }
                    return false;
                }
            });
        }
    });

    /**
     * @description - bounces google map pin for 3 seconds when selected
     * @param {object} pin - google map marker to be bounced.
     */
    self.pinBounceOn = function (pin) {
        pin.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            self.pinBounceOff(pin);
        }, 3000);
    };

    /**
     * @description - removes animation from google marker
     * @param {object} pin - google map marker to have animation removed from.
     */
    self.pinBounceOff = function (pin) {
        pin.setAnimation(null);
    };

    /**
     * @description - toggles location navigation drawer (only shown when responsive
     *                css is loaded)
     */
    $menuButton.click(function (e) {
        $nav.toggleClass('open');
        e.stopPropagation();
    });

    /**
     * @description - closes navigation drawer when the main screen is clicked.
     *                (only shown when responsive css is loaded)
     */
    $main.click(function () {
        $nav.removeClass('open');
    });

    /**
     * @description - closes menu drawer and displays info window for selected pin.
     *                function is bound by Knockout.js framework in index.html
     */
    window.menuClick = function () {
        $nav.removeClass('open');
        self.showPin(this);
    };

    /**
     * @description - initiates creation of google map upon succesful response from google.
     *                cancels timer for google response and clears status text.
     */
    window.loadMap = function () {
        self.map.initMap(self.locations());
        clearTimeout(self.googleTimeout);
        $('#header_status').text("");
        console.log("here");
    };

    /**
     * @description - closes navigation menu upon window resize.
     *                (only shown when responsive css is loaded)
     */
    window.onresize = function () {
        //  $nav.removeClass('open');
    };
};

//instaniate our controller
app.viewModel = new ViewModel();
//bind the view to our ViewModel
ko.applyBindings(app.viewModel);