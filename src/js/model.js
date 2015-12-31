var app = app || {};
Model = function () {
    var self = this;
    self.locations = [
        {
            name: 'National Museum of the U.S. Air Force',
            address: '1100 Spaatz St',
            city: 'Wright-Patterson AFB'
    },
        {
            name: 'The Wright Cycle Company Complex',
            address: '16 South Williams Street',
            city: 'Dayton'
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
    }
            ];

    self.getAllLocations = function () {
        return self.locations;
    };

    self.getWikiData = function (loc) {
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + loc.name + '&format=json&callback=wikiCallback';

        $.ajax({
            url: wikiUrl,
            dataType: "jsonp",
            success: function (response) {
                var articleList = response[1];

                for (var i = 0; i < articleList.length; i++) {
                    articleStr = articleList[i];
                    var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    loc.wikiInfo.push(articleStr);
                };

                clearTimeout(self.wikiRequestTimeout);
            }
        });
    }
    self.wikiRequestTimeout = setTimeout(function () {
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);
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
    self.wikiInfo = ko.observableArray();

};
