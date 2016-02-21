(function (app) {
    'use strict';
    app.controller('ChatCtrl',
        function ($scope) {
            $scope.langs = [
                {
                    label: 'English to English',
                    value: 'en'
                },
                {
                    label: 'English to French',
                    value: 'fr'
                },
                {
                    label: 'English to Spanish',
                    value: 'es'
                },
                {
                    label: 'English to German',
                    value: 'de'
                },
                {
                    label: 'English to Romanian',
                    value: 'ro'
                }
            ];
            $scope.currentLang = $scope.langs[0];

            $scope.setLang = function(val) {
                var index = _.findIndex($scope.langs, function(item) {
                    return item.value == val;
                });

                $scope.currentLang = $scope.langs[index];
            };




        });
}(angular.module('cahoots')));