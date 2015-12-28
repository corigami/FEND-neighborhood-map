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
};

//bind the view to our ViewModel
ko.applyBindings(new app.ViewModel());