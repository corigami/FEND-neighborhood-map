var app = app || {};
app.model = {
    locations: [
        {
            city: 'test 1',
            address: '123 Bob St.'
    },
        {
            city: 'test 2',
            address: '456 Dave Rd.'
    }
        ],
    init: function () {

    },
    getAllLocations: function () {
        return app.model.locations;
    },
};

var MenuItem = function (data) {
    this.city = ko.observable(data.city);
    this.address = ko.observable(data.address);
}
