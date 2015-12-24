var app = app || {};
(function () {
    'use strict';

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
        }

    };
})();