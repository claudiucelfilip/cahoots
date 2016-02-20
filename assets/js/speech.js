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
        transcription.textContent = '';

        for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                transcription.textContent = event.results[i][0].transcript + ' (Confidence: ' + event.results[i][0].confidence + ')';
            } else {
                transcription.textContent += event.results[i][0].transcript;
            }
        }
    };

    recognizer.start();

    // Listen for errors
    recognizer.onerror = function(event) {
        console.log('Recognition error: ' + event.message);
    };

})();