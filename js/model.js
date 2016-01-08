/*global $,ko, google */
var app = app || {};

/**
 * @description - object that represents hard-coded location data and associated methods
 * @constructor
 */
var Model = function () {
    'use strict';
    var self = this;
    self.wikiStatus = 'up';
    self.locations = [
        {
            name: 'National Museum of the United States Air Force',
            address: '1100 Spaatz St, Wright-Patterson AFB'
        },
        {
            name: 'Dayton Art Institute',
            address: '456 Belmonte Park North, Dayton'
        },
        {
            name: '2nd Street Market',
            address: '600 E Second St , Dayton'
        },
        {
            name: 'Wegerzyn Gardens MetroPark',
            address: '1301 E. Siebenthaler Avenue, Dayton'
        },
        {
            name: "Dayton Aviation Heritage National Historical Park",
            address: '16 South Williams Street, Dayton'
        }
    ];

    /**
     * @description - returns model location
     * @returns array of locations
     */
    self.getAllLocations = function () {
        return self.locations;
    };


    /**
     * @description - initiates asynchronous request to wikipeda for information
     *                using jQuery ajax request.
     * @param {object} loc - LocItem object
     */
    self.getWikiData = function (loc) {
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + loc.name + '&format=json&callback=wikiCallback';
        loc.wikiStatus = 'pending';
        loc.wikiInfo('Wikipedia information pending...');

        var wikiRequest = $.ajax({
            url: wikiUrl,
            dataType: "jsonp",
            timeout: 3000,
            success: function (response) {
                self.wikiStatus = 'up';
                loc.wikiInfo(response[2]);
            }
        });

        wikiRequest.error(function () {
            self.wikiStatus = 'error';

        });
    };

    /**
     * @description - returns current status of wikipedia
     * @returns last known status of wikipedia availability
     */
    self.getWikiStatus = function () {
        return self.wikiStatus;
    };
};

/**
 * @description - object that represents location data to be used by the controller
 * @constructor
 */
var LocItem = function (data) {
    'use strict';
    var self = this;
    self.name = data.name;
    self.address = data.address;
    self.queryString = ko.computed(function () {
        return this.address + ', USA';
    }, this);
    self.pin = '';
    //callback function for google maps place services.
    self.gCallback = function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            window.createMarker(results[0], self);
        }
    };
    self.wikiInfo = ko.observable('');
    self.pinImage = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

};