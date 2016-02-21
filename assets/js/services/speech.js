(function (app) {
    'use strict';

    window.SpeechRecognition = window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        null;

    app.service('Speech', function (Translation, Pusher, Constants, Video, DataChan, Utils) {


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


            var currentMessageId =  Utils.generateId();

            recognizer.onresult = $.throttle(100, function (event) {
                var str = '';


                for (var i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        str = event.results[i][0].transcript;
                        currentMessageId =  Utils.generateId();

                        Pusher.emit(Constants.events.message, {
                            id: currentMessageId,
                            text: str,
                            streamId: Video.myStream.id
                        });
                        return;

                    } else {
                        str += event.results[i][0].transcript;

                    }

                }
                DataChan.emit(Constants.events.message, {
                    id: currentMessageId,
                    text: str,
                    streamId: Video.myStream.id
                });

            });


            // Listen for errors
            recognizer.onerror = function (event) {
                console.log('Recognition error: ' + event.message);
            };


            recognizer.start();
        };

    });
})(angular.module('cahoots'));