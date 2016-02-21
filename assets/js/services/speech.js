(function (app) {
    'use strict';

    var recognizer;

    window.SpeechRecognition = window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        null;

    app.service('Speech', function ($localStorage, $rootScope, Translation, Pusher, Constants, Video, DataChan, Utils) {


        this.init = function () {
            var self = this;

            self.text = '';

            if (!SpeechRecognition) {
                return;
            }

            window.recognizer = recognizer = new window.SpeechRecognition();

            recognizer.continuous = true;
            recognizer.interimResults = true;


            var currentMessageId =  Utils.generateId();

            recognizer.onresult = $.throttle(100, function (event) {
                var str = '';
                var final = false;

                for (var i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        str = event.results[i][0].transcript;
                        currentMessageId =  Utils.generateId();
                        final = true;
                        recognizer.abort();

                    } else {
                        str += event.results[i][0].transcript;
                    }
                }

                var data = {
                    id: currentMessageId,
                    text: str,
                    streamId: Video.myStream && Video.myStream.id,
                    userName: $localStorage.userName
                };

                if( ! final ) {
                    $rootScope.$emit(Constants.events.captionLocal, data);
                    Pusher.emit(Constants.events.caption, data);
                } else {
                    $rootScope.$emit(Constants.events.message, data);
                    Pusher.emit(Constants.events.message, data);
                }
            });

            recognizer.onend = function(event) {
                try {
                    recognizer.start();
                } catch (e) {
                    console.log(e);
                }
            };

            setTimeout(function() {
                recognizer.start();
            });

        };

    });
})(angular.module('cahoots'));