(function (app) {
    'use strict';

    app.service('Translation', function ($http) {
        var apiKey = 'trnsl.1.1.20160213T144342Z.0e1e51109f86deb9.995e8da220cf06608effb93564af95a18952aef9';
        var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?';

        function translate(text, lang) {
            return $http({
                method: 'GET',
                url: url,
                params: {
                    key: apiKey,
                    text: text,
                    lang: lang
                }
            }).then(function(result) {
                return result.data;
            });
        }

        this.translate = translate;
    });
})(angular.module('cahoots'));