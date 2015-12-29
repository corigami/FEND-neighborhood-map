var app = app || {};

ViewModel = function () {
    var self = this;
    this.filterString = ko.observable("");
    this.infoWindow = '';
    this.menuList = ko.observableArray();
    this.contentStr = '';


    app.model.getAllLocations().forEach(function (loc) {
        self.menuList.push(new LocItem(loc));
    });

    window.addEventListener('load', app.map.initMap(self.menuList()));

    this.infoWindow = app.map.createInfoWindow(this.menuList()[0]);
    this.currentLocation = ko.observable(this.menuList()[0]);
    this.contentStr = ko.computed(function () {
        return '<div id="markerName"><em>' + this.currentLocation().name + '</em></div>';
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
        // self.infoWindow.setContent(self.currentLocation.pinContent);
        self.infoWindow.open(self.currentLocation().pin.map, self.currentLocation().pin);
    };

    self.hidePin = function () {
        self.currentLocation().bounceOff();
        self.infoWindow.close();
    };

    self.filterClick = function () {
        console.log(self.filterString());
    }

    $("#filter-textbox").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#filter-button").click();
        }
    });


};


var LocItem = function (data) {
    var self = this;
    this.name = data.name;
    this.city = data.city;
    this.address = data.address;
    this.queryString = ko.computed(function () {
        return this.address + ', ' + this.city + ', USA';
    }, this);
    this.visable = ko.observable(true);
    this.pin = '';

    this.gCallback = function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            self.pin = createMarker(results[0], self);
        }
    };
    this.bounceOn = function () {
        self.pin.setAnimation(google.maps.Animation.BOUNCE);
    }
    this.bounceOff = function () {
        self.pin.setAnimation(null);
    }
}

app.map = new MapHelper();
app.viewModel = new ViewModel();
//bind the view to our ViewModel
ko.applyBindings(app.viewModel);