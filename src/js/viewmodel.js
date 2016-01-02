var app = app || {};

ViewModel = function () {
    var self = this;
    self.infoWindow = '';
    self.filterString = ko.observable();
    self.locations = ko.observableArray();
    app.Model.getAllLocations().forEach(function (loc) {
        self.locations.push(new LocItem(loc));
    });

    self.locations().forEach(function (loc) {
        app.Model.getWikiData(loc);

    });

    self.currentLocation = ko.observable('');

    self.getWikiString = function () {
        if (this.currentLocation().wikiInfo) {
            if (app.Model.getWikiStatus() == 'down') {
                this.currentLocation().wikiInfo("Wikipedia Unavailable");
            } else if (this.currentLocation().wikiInfo() == '') {
                this.currentLocation().wikiInfo("No Wikipedia information available");
            }

            return this.currentLocation().wikiInfo();
        }

    };

    self.contentStr = ko.computed(function () {
        return '<div id="infoWindowContent">' +
            '<div><strong>' + this.currentLocation().name + '</strong></div>' +
            '<div id="markerLoc">' + this.currentLocation().address + '<hr></div>' +
            '<p>Wikipedia Description: </p>' +
            '<p><em>' + self.getWikiString() + '</em></p>' +
            '</div>';

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

    menuClick = function (data, event) {
        self.showPin(this)

    };


    self.showPin = function (loc) {
        if (self.currentLocation())
            self.pinBounceOff(self.currentLocation().pin);
        self.currentLocation(loc);

        if (!self.infoWindow)
            self.createWindow();
        self.infoWindow.setContent($('#infoWindowContent').html());
        self.pinBounceOn(self.currentLocation().pin);
        self.infoWindow.open(self.currentLocation().pin.map, self.currentLocation().pin);
    };

    self.hidePin = function () {
        if (self.currentLocation())
            self.pinBounceOff(self.currentLocation().pin);
        if (self.infoWindow);
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

    self.pinBounceOn = function (pin) {
        pin.setAnimation(google.maps.Animation.BOUNCE);
    }
    self.pinBounceOff = function (pin) {
        pin.setAnimation(null);
    }

    self.createWindow = function () {
        self.infoWindow = app.map.createInfoWindow(self.currentLocation());
    }

    window.addEventListener('load', app.map.initMap(self.locations()));

};

app.Model = new Model();
app.map = new MapHelper();
app.viewModel = new ViewModel();
//bind the view to our ViewModel
ko.applyBindings(app.viewModel);