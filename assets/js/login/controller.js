(function(app) {
    'use strict';

    app.controller('LoginCtrl',
        function($scope, $state, $stateParams, $localStorage, Api, Error) {

            // Validate browser
            var nVer = navigator.appVersion;
            var nAgt = navigator.userAgent;
            var browserName  = navigator.appName;
            var fullVersion  = ''+parseFloat(navigator.appVersion);
            var majorVersion = parseInt(navigator.appVersion,10);
            var nameOffset,verOffset,ix;


            if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
                browserName = "Opera";
                fullVersion = nAgt.substring(verOffset+6);
                if ((verOffset=nAgt.indexOf("Version"))!=-1)
                    fullVersion = nAgt.substring(verOffset+8);
            }

            else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
                browserName = "Microsoft Internet Explorer";
                fullVersion = nAgt.substring(verOffset+5);
            }

            else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
                browserName = "Chrome";
                fullVersion = nAgt.substring(verOffset+7);
            }

            else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
                browserName = "Safari";
                fullVersion = nAgt.substring(verOffset+7);
                if ((verOffset=nAgt.indexOf("Version"))!=-1)
                    fullVersion = nAgt.substring(verOffset+8);
            }

            else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
                browserName = "Firefox";
                fullVersion = nAgt.substring(verOffset+8);
            }

            else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
                (verOffset=nAgt.lastIndexOf('/')) )
            {
                browserName = nAgt.substring(nameOffset,verOffset);
                fullVersion = nAgt.substring(verOffset+1);
                if (browserName.toLowerCase()==browserName.toUpperCase()) {
                    browserName = navigator.appName;
                }
            }

            if ((ix=fullVersion.indexOf(";"))!=-1)
                fullVersion=fullVersion.substring(0,ix);
            if ((ix=fullVersion.indexOf(" "))!=-1)
                fullVersion=fullVersion.substring(0,ix);

            majorVersion = parseInt(''+fullVersion,10);
            if (isNaN(majorVersion)) {
                fullVersion  = ''+parseFloat(navigator.appVersion);
                majorVersion = parseInt(navigator.appVersion,10);
            }

            if(browserName !== 'Chrome' && browserName !== 'Firefox') {
                $scope.notification = 'Minimum required browser Chrome version 33 or Firefox version 44. Thank you!';
            }

            if(browserName == 'Chrome' && majorVersion < 33) {
                $scope.notification = 'Minimum required browser Chrome version 33 or Firefox version 44. Thank you!';
            } else if(browserName == 'Firefox' && majorVersion < 44) {
                $scope.notification = 'Minimum required browser Chrome version 33 or Firefox version 44. Thank you!';
            }

            if(typeof($localStorage.userName) !== 'undefined') {
                $scope.userName = $localStorage.userName.name;
            }

            if(typeof($localStorage.recentRoom) !== 'undefined') {
                $scope.recentRoom = $localStorage.recentRoom;
            }

            $scope.error = $stateParams.errorExists;
            $scope.requestUser = $stateParams.requestUser;
            $scope.room = $stateParams.roomId;

            $scope.joinRoom = function() {
                Api.addUser({ second: $stateParams.roomId, name: $scope.user },
                    function (response) {
                        $localStorage.userName = response.users[response.users.length - 1];
                        $localStorage.recentRoom = response;

                        $state.go('meeting', { roomId: response.name, justCreated: true });
                    },
                    function (error) {
                        $scope.error = Error.handler(error);
                    }
                );
            };

            // Regular login (create room)
            $scope.createRoom = function() {

                Api.createRoom({ name: $scope.room, user_name: $scope.userName },
                    function(response) {
                        $localStorage.userName = response.users[0];
                        $localStorage.recentRoom = response;

                        Api.startListener({ second: response.name },
                            function(notUsed) {
                                $state.go('meeting', { roomId: response.name, justCreated: true });
                            },
                            function(error) {
                                $scope.error = Error.handler(error);
                            }
                        );

                        $state.go('meeting', { roomId: response.name, justCreated: true });
                    },
                    function(error) {
                        $scope.error = Error.handler(error);
                    }
                );
            }
        }
    );

}(angular.module('cahoots')));
