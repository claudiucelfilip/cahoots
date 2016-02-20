(function (app) {
    'use strict';

    app.service('Video', function () {
        var skylink, recordRTC;

        var self = this;
        this.peerIds = [];
        this.myId;


        this.init = function (roomId) {
            skylink = new Skylink();

            skylink.on('peerJoined', function (peerId, peerInfo, isSelf) {
                if (isSelf) return; // We already have a video element for our video and don't need to create a new one.
                var vid = document.createElement('video');
                vid.autoplay = true;
                vid.muted = true; // Added to avoid feedback when testing locally
                vid.id = peerId;
                document.body.appendChild(vid);
            });

            skylink.on('incomingStream', function (peerId, stream, isSelf) {
                if (isSelf) return;
                var vid = document.getElementById(peerId);
                vid.setAttribute('stream-id', stream.id);
                self.peerIds.push(stream.id);
                attachMediaStream(vid, stream);
            });

            skylink.on('peerLeft', function (peerId, peerInfo, isSelf) {
                var vid = document.getElementById(peerId);
                if (vid) {
                    document.body.removeChild(vid);
                }

            });


            skylink.on('mediaAccessSuccess', function (stream) {
                var vid = document.getElementById('myvideo');
                attachMediaStream(vid, stream);

                vid.setAttribute('stream-id', stream.id);
                self.myId = stream.id;

                $('#record').on('click', function () {
                    recordRTC = new RecordRTC(stream, {
                        type: 'video'
                    });
                });
                $('#stop').on('click', function () {
                    recordRTC.stopRecording(function(url) {
                        var formData = new FormData();
                        formData.append('edition[video]', recordRTC.getBlob());

                        $.ajax({
                            type: 'POST',
                            url: 'https://api.cahoots-be.dev/record',
                            data: formData,
                            contentType: false,
                            cache: false,
                            processData: false
                        });
                    });
                });
            });


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