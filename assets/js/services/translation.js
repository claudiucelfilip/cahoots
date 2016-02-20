(function () {
    'use strict';

    angular.module('cahoots')
        .service('Translation', function () {
            var apiKey = 'trnsl.1.1.20160213T144342Z.0e1e51109f86deb9.995e8da220cf06608effb93564af95a18952aef9';
            var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?';

            function ajax(url, payload) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: url,
                        data: payload,
                        success: resolve,
                        error: reject
                    })
                });
            }


            function translate(text, target) {
                return ajax(url, {
                    key: apiKey,
                    text: text,
                    lang: 'ro'
                });
            }

            this.translate = translate;
        });
})();