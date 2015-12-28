var app = app || {};

'use strict';
app.ViewModel = function () {
    var self = this;
    var currentLocation = '';
    self.testFunc = function (data) {
        console.log(data);
    };

    this.menuList = ko.observableArray();

    app.model.getAllLocations().forEach(function (loc) {
        self.menuList.push(new MenuItem(loc));
    });

    /*
     * Open the drawer when the menu icon is clicked.
     */
    var $menu = $('#menu');
    var $main = $('#map_container');
    var $drawer = $('.nav');

    $menu.click(function (e) {
        console.log("clicked");
        $drawer.toggleClass('open', true);
        e.stopPropagation();
    });
    $main.click(function () {
        $drawer.removeClass('open');
    });
};

//bind the view to our ViewModel
ko.applyBindings(new app.ViewModel());
