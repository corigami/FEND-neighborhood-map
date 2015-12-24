var app = app || {};
(function () {
    'use strict';

    app.view = {
        init: function () {
            this.$mapView = $('#map_content');
            this.$mapHeader = $('#map_header');
            this.$menuHeader = $('#menu_header');
            this.$menuContent = $('menu_content');
        },
        render: function () {

        },
        displayLocations: function () {
            app.controller.getLocations().forEach(function (loc) {
                console.log(loc.city);
                console.log(loc.address);
            });
        }

    };
})();