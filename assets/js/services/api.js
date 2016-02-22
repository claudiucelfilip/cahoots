(function () {
    'use strict';

    angular
        .module('cahoots')
        .factory('Api', [
            '$resource',
            'Constants',
            function ($resource, Constants) {
                return $resource(Constants.api.url + ':first/:second/:third/:fourth', { first: '@first', second: '@second', third: '@third', fourth: '@fourth'}, {
                    createRoom: {
                        method: 'POST',
                        params: {
                            first: 'rooms'
                        },
                        isArray: false
                    },
                    getActivity: {
                        method: 'GET',
                        params: {
                            first: 'rooms',
                            third: 'activity'
                        },
                        isArray: true
                    },
                    deleteUser: {
                        method: 'DELETE',
                        params: {
                            first: 'rooms',
                            third: 'users'
                        }
                    },
                    startListener: {
                        method: 'POST',
                        params: {
                            first: 'pusher',
                            third: 'receive'
                        }
                    },
                    getRoom: {
                        method: 'GET',
                        params: {
                            first: 'rooms'
                        }
                    },
                    addUser: {
                        method: 'POST',
                        params: {
                            first: 'rooms',
                            third: 'users'
                        }
                    },
                    getMessages: {
                        method: 'GET',
                        params: {
                            first: 'room',
                            third: 'messages'
                        },
                        isArray: false
                    }
                });
            }
        ]);
}());
