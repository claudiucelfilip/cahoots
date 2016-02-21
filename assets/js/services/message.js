(function (app) {
    app.factory('Message', function ($q, Translation) {
        function Message(data) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    this[key] = data[key];
                }
            }
            this.translations = {};
        }

        Message.lang = 'en';
        //Message.prototype = Object.create(data.prototype);

        Message.prototype.translate = function () {
            var self = this;
            if (Message.lang === 'en') {
                return $q.resolve();
            }
            return Translation.translate(this.text, Message.lang).then(function (result) {
                self.translations[Message.lang] = self.translations[Message.lang] || {};
                self.translations[Message.lang].text = result.text.join();
            });

        };
        return Message;
    })
})(angular.module('cahoots'));