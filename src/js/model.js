var app = app || {};
app.model = {
    locations: [
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
        ],
    init: function () {

    },
    getAllLocations: function () {
        return app.model.locations;
    },
};