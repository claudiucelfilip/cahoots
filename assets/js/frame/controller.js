(function (app) {
    'use strict';
    app.controller('FrameCtrl',
        function ($scope, Pusher, $rootScope, Constants, $timeout, Video, Message) {

            $scope.frameUrl = 'http://reddit.com';
            $scope.frameApi = Constants.api.url + 'proxy/';
            $scope.$watch('frameUrl', function(newValue, previousValue) {
                if (newValue !== previousValue) {
                    Pusher.emit(Constants.events.changeFrameLink, newValue);
                }
            });

            // Smart sharing

            var frame;

            $('#ifr').load(function () {
                frame = getFrameTargetElement(document.getElementById('ifr'));

                frame.onclick = function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                };

                frame.onscroll = $.throttle(200, function (event) {
                    if ($scope.ownsFrame) {
                        Pusher.emit(Constants.events.changeFramePosition, {
                            scrollX: frame.scrollX,
                            scrollY: frame.scrollY
                        });
                    }
                });
            });





            Pusher.on(Constants.events.changeFramePosition, function(data) {
                var f = document.getElementById('ifr');
                f.contentWindow.scrollTo(data.scrollX, data.scrollY);
            });

            Pusher.on(Constants.events.changeFrameLink, function(data) {

                $scope.frameUrl = data;

                if (!$scope.$$phase) {
                    $scope.$digest();
                }
            });


        });
}(angular.module('cahoots')));

function getFrameTargetElement(objI) {
    var objFrame = objI.contentWindow;
    if(window.pageYOffset == undefined) {
        objFrame = (objFrame .document.documentElement) ? objFrame .document.documentElement : objFrame =document.body;
    }
    return objFrame ;
}