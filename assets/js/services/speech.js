(function () {
    'use strict';

    window.SpeechRecognition = window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        null;

    angular.module('cahoots')
        .service('Speech', function (Translation) {
            var self = this;

            self.text = '';

            if (!SpeechRecognition) {
                return;
            }

            var recognizer = new window.SpeechRecognition();
            recognizer.continuous = true;

            recognizer.onresult = function (event) {
                var str = '';

                for (var i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        str = event.results[i][0].transcript;
                    } else {
                        str += event.results[i][0].transcript;
                    }
                }

                Translation.translate(str, 'ro').then(function (result) {
                    if (result && result.text) {
                        self.text = result.text.join();
                    }
                })

            };

            recognizer.start();

            // Listen for errors
            recognizer.onerror = function (event) {
                console.log('Recognition error: ' + event.message);
            };

        });
})();