(function () {
    'use strict';

    angular
        .module('cahoots')
        .factory('Api', [
            '$resource',
            'Constants',
            function ($resource, Constants) {
                return $resource(Constants.api.url + '/:first/:second/:third', {}, {
                    createRoom: {
                        method: 'POST',
                        params: {
                            first: 'room'
                        },
                        isArray: false,
                        cache: false
                    },
                    getMessages: {
                        method: 'GET',
                        params: {
                            first: 'room',
                            third: 'messages'
                        },
                        isArray: false,
                        cache: false
                    }
                });
            }
        ]);
}());
