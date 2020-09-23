"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenIdMetadata = void 0;
const axios_1 = require("axios");
const getPem = require('rsa-pem-from-mod-exp');
const base64url = require('base64url');
const debug = require("debug");
// init debug logging module
const log = debug('openid');
class OpenIdMetadata {
    constructor(url) {
        this.url = url;
        this.lastUpdated = 0;
    }
    ;
    getKey(keyId, callback) {
        let _this = this;
        // if keys are more than 5d old, refresh
        let now = new Date().getTime();
        if (this.lastUpdated < (now - 1000 * 60 * 60 * 24 * 5)) {
            this._refreshCache((error) => {
                if (error) { }
                // search cache even if failed to refresh
                callback(_this._findKey(keyId));
            });
        }
        else {
            // otherwise read fro cache
            callback(this._findKey(keyId));
        }
    }
    /**
     * Refresh the internal cache.
     * @param cb
     *   The callback after the cache is refreshed.
     */
    _refreshCache(callback) {
        let _this = this;
        axios_1.default.get(this.url)
            .then((openIdConfigResponse) => {
            log(`OpenID Config HTTP GET response = (${openIdConfigResponse.status})`, openIdConfigResponse.data);
            if (openIdConfigResponse.status >= 400 || !openIdConfigResponse.data) {
                throw new Error(`Failed to load OpenID config. ${openIdConfigResponse.status}: ${openIdConfigResponse.statusText}`);
            }
            let openIdConfig = openIdConfigResponse.data;
            // get the keys
            axios_1.default.get(openIdConfig.jwks_uri)
                .then((keySetResponse) => {
                log(`Key request = (${keySetResponse.status})`, keySetResponse.data);
                if (keySetResponse.status >= 400 || !keySetResponse.data) {
                    throw new Error(`Failed to load JSON web key set. ${openIdConfigResponse.status}: ${openIdConfigResponse.statusText}`);
                }
                _this.lastUpdated = new Date().getTime();
                _this.keys = keySetResponse.data.keys;
                callback(null);
            }).catch((error) => {
                callback(error);
            });
        }).catch((error) => {
            callback(error);
        });
    }
    /**
     * Find the key given the key ID.
     * @param keyId
     *   The ID of the key.
     *
     * @return
     *   The value of the key if found; else null.
     */
    _findKey(keyId) {
        if (!this.keys) {
            return null;
        }
        for (let i = 0; i < this.keys.length; i++) {
            if (this.keys[i].kid == keyId) {
                let key = this.keys[i];
                if (!key.n || !key.e) {
                    return null;
                }
                let modulus = base64url.toBase64(key.n);
                let exponent = key.e;
                return getPem(modulus, exponent);
            }
        }
    }
}
exports.OpenIdMetadata = OpenIdMetadata;
//# sourceMappingURL=OpenIdMetadata.js.map