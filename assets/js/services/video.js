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

        this.setMainStream = function(stream) {
            attachMediaStream(mainVideo, stream);
        };

        this.setMainStreamById = function(streamId) {
            if (currentMainStreamId === streamId) {
                return;
            }
            currentMainStreamId =  streamId;
            var index = _.findIndex(self.streams, function(item) {
                return item.id === streamId;
            });

            if (index !== -1) {
                self.setMainStream(self.streams[index]);
            }
        };
        this.init = function (roomId) {
            skylink = new Skylink();


            skylink.on('peerJoined', function (peerId, peerInfo, isSelf) {
                if (isSelf) return; // We already have a video element for our video and don't need to create a new one.
                var vid = document.createElement('video');
                vid.autoplay = true;
                vid.muted = true; // Added to avoid feedback when testing locally
                vid.id = peerId;
                $videoContainer.append(vid);
            });

            skylink.on('incomingStream', function (peerId, stream, isSelf) {
                if (isSelf) return;
                var vid = document.getElementById(peerId);
                vid.setAttribute('stream-id', stream.id);
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
                self.setMainStream(stream);

                vid.setAttribute('stream-id', stream.id);
                self.streams.push(stream);
                self.myStream = stream;

            });


            this.startRecording = function() {
                recordRTC = new RecordRTC(self.myStream, {
                    type: 'video'
                });
            };
            this.stopRecording = function() {
                recordRTC.stopRecording(function(url) {
                    var formData = new FormData();
                    formData.append('edition[video]', recordRTC.getBlob());

                    $.ajax({
                        type: 'POST',
                        url: '/record',
                        data: formData,
                        contentType: false,
                        cache: false,
                        processData: false
                    });
                });
            };


            $('#share').on('click', function () {
                skylink.shareScreen(true);
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