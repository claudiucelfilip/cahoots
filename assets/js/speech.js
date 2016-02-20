var SPEECH = (function () {
    var recognition;
    var $subtitle = $('#subtitle');

    if (window.webkitSpeechRecognition !== 'undefined') {
        recognition = new webkitSpeechRecognition();
    } else if (window.SpeechRecognition !== 'undefined') {
        recognition = new SpeechRecognition();
    } else {
        return alert('No Speech API');
    }

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onspeechstart = function() {
        console.log('onspeechstart');
    };

    recognition.onspeechend = function() {
        console.log('onspeechend');
    };

    recognition.onnomatch = function(event) {
        console.log('onnomatch', event);

    };

    recognition.onerror = function(event) {
        console.log('onerror');
    };

    recognition.onstart = function() {


    };

    recognition.onend = function() {

    };

    recognition.onresult = function(event) {

        if (typeof(event.results) === 'undefined') {
            recognition.stop();
            return;
        }

        for (var i = event.resultIndex; i < event.results.length; ++i) {
            $subtitle.text(event.results[i][0].transcript);
            if (event.results[i].isFinal) {
                $subtitle.addClass('final');
            } else {
                $subtitle.removeClass('final');
            }
        }
    };

    recognition.start();

})();