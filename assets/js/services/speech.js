(function (app) {
    'use strict';

    window.SpeechRecognition = window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        null;

    app.service('Speech', function (Translation, Pusher, Constants, Video, DataChan) {


        this.init = function () {
            var self = this;

            self.text = '';

            if (!SpeechRecognition) {
                return;
            }

            var recognizer = new window.SpeechRecognition();
            recognizer.lang = "en-GB";
            recognizer.continuous = true;
            recognizer.interimResults = true;

            function generateId() {
                return Math.floor(Math.random() * 10000) + '';
            }
            var currentMessageId =  generateId();

            recognizer.onresult = function (event) {
                var str = '';

                for (var i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        str = event.results[i][0].transcript;
                        currentMessageId =  generateId();
                    } else {
                        str += event.results[i][0].transcript;
                    }

                    Pusher.emit(Constants.events.message, {
                        id: currentMessageId,
                        text: str,
                        streamId: Video.myId
                    });
                    DataChan.emit(Constants.events.message, {
                        id: currentMessageId,
                        text: str,
                        streamId: Video.myId
                    });
                }

            };


            // Listen for errors
            recognizer.onerror = function (event) {
                console.log('Recognition error: ' + event.message);
            };


            recognizer.start();
        };

    });
})(angular.module('cahoots'));