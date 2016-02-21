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
            skylink.on('peerJoined', function (peerId, peerInfo, isSelf) {
                if (isSelf) return; // We already have a video element for our video and don't need to create a new one.
                var vid = document.createElement('video');
                vid.autoplay = true;

                vid.id = peerId;
                $videoContainer.append(vid);
            });

            skylink.on('incomingStream', function (peerId, stream, isSelf) {
                if (isSelf) return;
                var vid = document.getElementById(peerId);
                vid.setAttribute('stream-id', stream.id);
                stream.el = vid;
                self.streams.push(stream);
                attachMediaStream(vid, stream);
            });

            skylink.on('peerLeft', function (peerId, peerInfo, isSelf) {
                var vid = document.getElementById(peerId);
                $(vid).remove();
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


            this.shareScreen = function() {
                skylink.shareScreen();
            };

            this.stopScreen = function() {
                skylink.stopScreen();
                self.setMainStream(self.myStream);
            };


            skylink.on('iceConnectionState', function (state, peerId) {
                if (iceConnectionState === skylink.ICE_CONNECTION_STATE.FAILED) {
                    // Do a refresh
                    skylink.refreshConnection(peerId);
                }
            });


            skylink.init({
                apiKey: 'a1a9c9c3-da9a-417c-bb2b-0ebc55b119e3',
                defaultRoom: roomId
            }, function () {
                skylink.joinRoom({
                    audio: true,
                    video: true
                });
            });
        };
    });
})(angular.module('cahoots'));