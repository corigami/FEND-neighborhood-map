var app = app || {};
var Model = function () {
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
    self.address = data.address;
    self.queryString = ko.computed(function () {
        return this.address + ', USA';
    }, this);
    self.pin = '';
    self.gCallback = function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            createMarker(results[0], self);
        }
    };
    self.wikiStatus = 'down';
    self.wikiInfo = ko.observable('');
    self.pinImage = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

};