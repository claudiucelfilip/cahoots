(function (app) {
    'use strict';

    var recognizer;

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
                    streamId: Video.myStream && Video.myStream.id
                };

                //console.log(event.results.length);
                if(!final) {
                    DataChan.emit(Constants.events.message, data);
                } else {
                    Pusher.emit(Constants.events.message, data);
                }

            });


            // Listen for errors
            recognizer.onerror = function (event) {
                console.log('Recognition error: ', event);
            };

            recognizer.onsoundend = function(event) {
                console.log('onsoundend', event);
            };
            recognizer.onspeechend = function(event) {
                console.log('onspeechend', event);
            };
            recognizer.onend = function(event) {
                recognizer.start();
            };
            recognizer.onmatch = function(event) {
                console.log('onmatch', event);
            };

            setTimeout(function() {
                recognizer.start();
            });

        };

    });
})(angular.module('cahoots'));