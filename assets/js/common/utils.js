(function () {
    'use strict';

    angular
        .module('cahoots')

        .factory('Error', function() {
            return {
                handler: function (response) {
                    var error;
                    if (response.data && response.data.errors) {
                        if (typeof(response.data.errors) === 'string') {
                            error = response.data.errors;
                        } else {
                            for (var message in response.data.errors) {
                                error = response.data.errors[message][0];
                            }
                        }
                    } else {
                        error = response.statusText;
                    }

                    return error;
                }
            }
        })
        .directive('ngEnter', function () {
            var Directive = {
                link: function (scope, element, attrs) {
                    element.bind("keydown keypress", function (event) {
                        if (event.which === 13) {
                            scope.$apply(function () {
                                scope.$eval(attrs.ngEnter, {'event': event});
                            });

                            event.preventDefault();
                        }
                    });
                }
            };

            return {
                restrict: 'A',
                link: Directive.link,
                replace: true
            };
        });
})();
