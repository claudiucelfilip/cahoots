(function (app) {
    'use strict';

    app.service('Video', function () {
        var skylink, recordRTC;

        var self = this;
        var $videoContainer = $('.video-container');
        var mainVideo = document.getElementById('mainVideo');
        var currentMainStreamId;
        this.streams = [];
        this.myStream = null;

        this.setMainStream = $.throttle(2000, function(stream) {
            attachMediaStream(mainVideo, stream);

            $(stream.el).addClass('active').siblings().remove('active');
        });

        this.setMainStreamById = function(streamId) {
            if (currentMainStreamId === streamId) {
                return;
            }

            var index = _.findIndex(self.streams, function(item) {
                return item.id === streamId;
            });

            if (index !== -1) {
                currentMainStreamId =  streamId;
                self.setMainStream(self.streams[index]);

            }
        };
        this.init = function (roomId) {
            skylink = window.skylink = new Skylink();


            skylink.setDebugMode(true);

            skylink.on('incomingStream', function (peerId, stream, isSelf) {

                var vid;

                if (isSelf) {
                    if(!self.myStream) {
                        vid = document.getElementById('myvideo');
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

            skylink.on('peerLeft', function (peerId, peerInfo, isSelf) {
                var vid = document.getElementById(peerId);
                $(vid).remove();

                var index = _.findIndex(self.streams, function(item) {
                    return item.peerId === peerId;
                });

                if (index !== -1) {
                    self.streams.splice(index, 0);
                }
            });


            skylink.on('mediaAccessSuccess', function (stream) {
                var vid = document.getElementById('myvideo');
                attachMediaStream(vid, stream);
                vid.setAttribute('stream-id', stream.id);

                stream.el = vid;
                self.setMainStream(stream);
                self.streams.push(stream);
                self.myStream = stream;

            });


            this.shareScreen = function(errorCallback) {
                skylink.shareScreen(errorCallback);
            };

            this.stopScreen = function() {
                self.myStream = null;
                skylink.stopScreen();


            };

            skylink.init({
                apiKey: 'a1a9c9c3-da9a-417c-bb2b-0ebc55b119e3',
                defaultRoom: roomId,
                enableDataChannel: false
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