(function (app) {
    'use strict';

    app.service('Video', function ($stateParams, $rootScope, Pusher, Utils, Constants, Api, $localStorage) {
        var skylink, recordRTC;

        var self = this;
        var $videoContainer = $('.video-container');
        var mainVideo = document.getElementById('mainVideo');
        var currentMainStreamId;
        this.streams = [];
        this.myStream = null;


        $videoContainer.on('click', 'video', function() {
            var $this = $(this);
            self.setMainStreamById($this.attr('stream-id'), true);
        });

        var needsForce = false;
        this.setMainStream = $.throttle(2000, function(stream, forced) {

            if (forced) {
                needsForce = true;
            }

            if(self.streams.length === 0) {
                $('#mainVideo').hide();
                $('#canvas').show();
            } else {
                $('#mainVideo').show();
                $('#canvas').remove();
                source.disconnect();
                LoopVisualizer.remove();
                $rootScope.removeFeature('bot-mute');

            }

            if ((needsForce && forced) || !needsForce) {
                attachMediaStream(mainVideo, stream);
                $(stream.el).addClass('active').siblings().removeClass('active');
            }
        });

        this.setMainStreamById = function(streamId, forced) {
            if (currentMainStreamId === streamId) {
                return;
            }

            var index = _.findIndex(self.streams, function(item) {
                return item.id === streamId;
            });

            if (index !== -1) {
                currentMainStreamId =  streamId;
                self.setMainStream(self.streams[index], forced);

            }
        };
        this.init = function (roomId) {
            skylink = window.skylink = new Skylink();

            skylink.setUserData($localStorage.userName);

            skylink.setDebugMode(true);


            skylink.on('incomingStream', function (peerId, stream, isSelf, peerInfo) {
                var vid;
                if (isSelf) {
                    if(!self.myStream) {
                        vid = document.getElementById('myvideo');
                        if (!vid) {
                            return;
                        }
                        self.setMainStream(stream);
                        self.myStream = stream;
                        vid.muted = 'muted';
                    } else {
                        return
                    }
                } else {
                    vid = document.createElement('video');
                }

                vid.setAttribute('stream-id', stream.id);
                vid.autoplay = true;

                stream.el = vid;
                stream.peerId = peerId;
                vid.id = peerId;

                $videoContainer.append(vid);

                self.streams.push(stream);

                attachMediaStream(vid, stream);

            });

            skylink.on('peerJoined', function (peerId, peerInfo, isSelf) {
                if(!isSelf) {
                    var payload = {
                        id: Utils.generateId(),
                        type: Constants.types.join,
                        userName: peerInfo.userData,
                        created: new Date()
                    };

                    $rootScope.$emit(Constants.events.activityEvent, payload);
                }

                var activeUsers = 0;
                angular.forEach(self.streams, function(value) {
                    if(value.active) {
                        activeUsers++;
                    }
                });

                console.log($('video').length);

                console.log(activeUsers)


                if(activeUsers > 1) {
                    $('#mainVideo').show();
                    $('#canvas').remove();
                    source.disconnect();
                    LoopVisualizer.remove();
                    $rootScope.removeFeature('bot-mute');


                }
            });

            skylink.on('peerLeft', function (peerId, peerInfo, isSelf) {
                // Remove video
                var vid = document.getElementById(peerId);
                $(vid).remove();

                var index = _.findIndex(self.streams, function(item) {
                    return item.peerId === peerId;
                });

                if (index !== -1) {
                    self.streams.splice(index, 1);
                }

                // Notify server
                if(!isSelf) {
                    var payload = {
                        id: Utils.generateId(),
                        type: Constants.types.leave,
                        userName: peerInfo.userData,
                        created: new Date()
                    };

                    $rootScope.$emit(Constants.events.activityEvent, payload);
                }

                // Remove from Room
                Api.deleteUser({ second: $stateParams.roomId, fourth: peerInfo.userData.id },
                    function(response) {

                    },
                    function(error) {
                        console.log(error)
                    }
                );

                var activeUsers = 0;
                angular.forEach(self.streams, function(value) {
                    if(value.active) {
                        activeUsers++;
                    }
                });

                if(activeUsers === 1) {
                    $('#mainVideo').hide();
                    $('#canvas').show();
                } else {
                    $('#mainVideo').show();
                    $('#canvas').remove();
                    source.disconnect();
                    LoopVisualizer.remove();
                    $rootScope.removeFeature('bot-mute');


                }
            });

            skylink.on('mediaAccessSuccess', function (stream, peerInfo) {
                var vid = document.getElementById('myvideo');
                if (!vid) {
                    return;
                }
                attachMediaStream(vid, stream);
                vid.setAttribute('stream-id', stream.id);

                stream.el = vid;
                self.setMainStream(stream);
                self.streams.push(stream);
                self.myStream = stream;
            });


            this.shareScreen = function(errorCallback) {
                // Notify server
                var payload = {
                    id: Utils.generateId(),
                    type: Constants.types.shareScreen,
                    userName: $localStorage.userName,
                    created: new Date()
                };

                Pusher.emitServer(payload);
                $rootScope.$emit(Constants.events.activityEvent, payload);

                skylink.shareScreen(errorCallback);
            };

            this.stopScreen = function() {
                // Notify server
                var payload = {
                    id: Utils.generateId(),
                    type: Constants.types.stopShareScreen,
                    userName: $localStorage.userName,
                    created: new Date()
                };

                $rootScope.$emit(Constants.events.activityEvent, payload);

                self.myStream = null;
                skylink.stopScreen();
            };

            var streamConfig = {
                audioMuted: false,
                videoMuted: false
            };

            function setStream() {
                skylink.muteStream(streamConfig);
            }

            this.toggleMuteAudio = function() {
                // Notify server
                var payload = {
                    id: Utils.generateId(),
                    type: Constants.types.mute,
                    value: !streamConfig.audioMuted,
                    userName: $localStorage.userName,
                    created: new Date()
                };

                $rootScope.$emit(Constants.events.activityEvent, payload);

                streamConfig.audioMuted = !streamConfig.audioMuted;
                setStream();
            };

            this.toggleMuteVideo = function() {
                var payload = {
                    id: Utils.generateId(),
                    type: Constants.types.noVideo,
                    value: !streamConfig.videoMuted,
                    userName: $localStorage.userName,
                    created: new Date()
                };

                $rootScope.$emit(Constants.events.activityEvent, payload);

                streamConfig.videoMuted = !streamConfig.videoMuted;
                setStream();
            };

            skylink.init({
                apiKey: 'a1a9c9c3-da9a-417c-bb2b-0ebc55b119e3',
                defaultRoom: roomId
            }, function () {
                skylink.joinRoom({
                    audio: true,
                    video: {
                        resolution: {
                            width: 1280,
                            height: 720
                        },
                        frameRate: 24
                    }
                });
            });
        };
    });
})(angular.module('cahoots'));