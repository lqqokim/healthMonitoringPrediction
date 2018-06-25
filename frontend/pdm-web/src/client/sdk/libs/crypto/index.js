var cryptojs = require('crypto-js');

module.exports = {
    randomBytes: function(num){
        return cryptojs.lib.WordArray.random(num);
    }
};