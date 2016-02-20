var SPEECH = (function () {
    // Test browser support
    window.SpeechRecognition = window.SpeechRecognition       ||
        window.webkitSpeechRecognition ||
        null;


    if (!SpeechRecognition) {
        return;
    }
    var recognizer = new window.SpeechRecognition();
    var transcription = document.getElementById('subtitle');


    recognizer.continuous = true;

    recognizer.onresult = function(event) {
        var str = '';

        for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                str = event.results[i][0].transcript;
            } else {
                str += event.results[i][0].transcript;
            }
        }

        TRANSLATION.translate(str, 'ro').then(function(result) {
            if (result && result.text) {
                transcription.textContent = result.text.join();
            }
        })

    };

    recognizer.start();

    // Listen for errors
    recognizer.onerror = function(event) {
        console.log('Recognition error: ' + event.message);
    };

})();