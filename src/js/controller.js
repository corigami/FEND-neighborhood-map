var app = app || {};
(function () {
    'use strict';

    app.controller = {
        init: function () {

            app.view.init();
            app.view.displayLocations();
        },
        getLocations: function () {
            return app.model.getAllLocations();
        }
    };
    app.controller.init();
})();