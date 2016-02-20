(function () {
    'use strict';

    angular
        .module('cahoots')
        .factory('Api', [
            '$resource',
            'Constants',
            function ($resource, Constants) {
                return $resource(Constants.api.url + ':first/:second/:third', { first: '@first', second: '@second', third: '@third'}, {
                    createRoom: {
                        method: 'POST',
                        params: {
                            first: 'rooms'
                        },
                        isArray: false,
                        cache: false
                    },
                    getRoom: {
                        method: 'GET',
                        params: {
                            first: 'rooms'
                        },
                        cache: false
                    },
                    addUser: {
                        method: 'POST',
                        params: {
                            first: 'rooms',
                            third: 'users'
                        },
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
