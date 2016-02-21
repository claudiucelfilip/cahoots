(function() {
    'use strict';
    angular.module('cahoots')
        .service('Room', function(Constants) {
            var roomId;

            this.setId = function(id) {
                roomId = Constants.uniqueId + '-' + id;
            };

            this.getId = function() {
                return roomId;
            };
        });
})();