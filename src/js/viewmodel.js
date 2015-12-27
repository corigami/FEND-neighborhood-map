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

    this.testFunc("test");
};




ko.applyBindings(new app.ViewModel());
