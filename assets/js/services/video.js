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

                var vid = document.createElement('video');
                vid.autoplay = true;

                vid.id = peerId;
                $videoContainer.append(vid);
            });

            skylink.on('incomingStream', function (peerId, stream, isSelf) {

                var vid = document.getElementById(peerId);
                vid.setAttribute('stream-id', stream.id);
                stream.el = vid;
                self.streams.push(stream);

                attachMediaStream(vid, stream);

                if (isSelf) {
                    self.setMainStream(stream);
                    self.myStream = stream;
                    vid.muted = 'muted';
                }
            });

            skylink.on('peerLeft', function (peerId, peerInfo, isSelf) {
                var vid = document.getElementById(peerId);
                $(vid).remove();
            });


            this.shareScreen = function(errorCallback) {
                skylink.shareScreen(errorCallback);
            };

            this.stopScreen = function() {
                skylink.stopScreen();

            };

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