var app = app || {};

ViewModel = function () {
    var self = this;
    self.filterString = ko.observable();
    self.infoWindow = '';
    self.locations = ko.observableArray();
    self.contentStr = '';
    app.Model.getAllLocations().forEach(function (loc) {
        self.locations.push(new LocItem(loc));
    });

    window.addEventListener('load', app.map.initMap(self.locations()));

    self.infoWindow = app.map.createInfoWindow(this.locations()[0]);
    self.currentLocation = ko.observable(this.locations()[0]);
    self.contentStr = ko.computed(function () {
        return '<div i="infoWindow"><div id="markerName">' + this.currentLocation().name + '</div><div id="markerLoc">' +
            this.currentLocation().address + '</div></div>';
    }, this);


    //Open the drawer when the menu icon is clicked.
    var $menu = $('#menu');
    var $main = $('#map_container');
    var $drawer = $('.nav');

    //open navigation drawer
    $menu.click(function (e) {
        $drawer.toggleClass('open');
        e.stopPropagation();
    });

    $main.click(function () {
        $drawer.removeClass('open');
    });

    menuClick = function () {
        self.currentLocation().bounceOff();
        self.currentLocation(this);
        self.showPin()
    };

    self.showPin = function () {
        self.infoWindow.setContent(this.contentStr());
        self.currentLocation().bounceOn();
        self.infoWindow.open(self.currentLocation().pin.map, self.currentLocation().pin);
    };

    self.hidePin = function () {
        self.currentLocation().bounceOff();
        self.infoWindow.close();
    };


    self.filterLocations = ko.computed(function () {
        if (!self.filterString()) {
            self.locations().forEach(function (loc) {
                if (loc.pin) //only run if pin has been created
                    loc.pin.setVisible(true);
            });
            return self.locations();
        } else {
            return ko.utils.arrayFilter(self.locations(), function (loc) {
                if (loc.name.toLowerCase().search(self.filterString().toLowerCase()) >= 0) {
                    if (loc.pin)
                        loc.pin.setVisible(true);
                    return true;
                } else {
                    if (loc.pin)
                        loc.pin.setVisible(false)
                    if (self.currentLocation() == loc)
                        self.hidePin();
                    return false;
                }
            });
        }
    });
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
    self.bounceOn = function () {
        self.pin.setAnimation(google.maps.Animation.BOUNCE);
    }
    self.bounceOff = function () {
        self.pin.setAnimation(null);
    }
}


app.map = new MapHelper();
app.Model = new Model();
app.viewModel = new ViewModel();
//bind the view to our ViewModel
ko.applyBindings(app.viewModel);