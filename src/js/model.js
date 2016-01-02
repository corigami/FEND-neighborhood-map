var app = app || {};
Model = function () {
    var self = this;
    self.wikiStatus = 'up';
    self.locations = [
        {
            name: 'National Museum of the U.S. Air Force',
            address: '1100 Spaatz St',
            city: 'Wright-Patterson AFB'
    },
        {
            name: 'Dayton Art Institute',
            address: '456 Belmonte Park North',
            city: 'Dayton'
    },
        {
            name: '2nd Street Market',
            address: '600 E Second St',
            city: 'Dayton'
    },
        {
            name: 'Wegerzyn Gardens MetroPark',
            address: '1301 E. Siebenthaler Avenue',
            city: 'Dayton'
    },
        {
            name: "Dayton Aviation Heritage National Historical Park",
            address: '16 South Williams Street',
            city: 'Dayton'
        }
            ];

    self.getAllLocations = function () {
        return self.locations;
    };

    self.getWikiData = function (loc) {
        loc.wikiStatus = 'pending';
        loc.wikiInfo('Wikipedia information pending...')
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + loc.name + '&format=json&callback=wikiCallback';

        $.ajax({
            url: wikiUrl,
            dataType: "jsonp",
            success: function (response) {
                loc.wikiStatus = 'up';
                loc.wikiInfo(response[2]);
                clearTimeout(self.wikiRequestTimeout);
            }
        });
    }
    self.wikiRequestTimeout = setTimeout(function () {
        self.wikiStatus = 'down';
    }, 8000);

    self.getWikiStatus = function () {
        return self.wikiStatus;
    }

};

var LocItem = function (data) {
    var self = this;
    self.name = data.name;
    self.city = data.city;
    self.address = data.address;
    self.queryString = ko.computed(function () {
        return this.address + ', ' + this.city + ', USA';
    }, this);
    self.pin = '';
    self.gCallback = function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            self.pin = createMarker(results[0], self);
        }
    };
    self.wikiStatus = 'down';
    self.wikiInfo = ko.observable('');

};