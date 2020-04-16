import axios from 'axios';
import { AxiosResponse } from "axios";
const getPem = require('rsa-pem-from-mod-exp');
const base64url = require('base64url');
import * as debug from 'debug';

// init debug logging module
const log = debug('openid');

interface OpenIdConfiguration {
  issuer: string;
  token_endpoint: string;
  jwks_uri: string;
  authorization_endpoint: string;
  response_types_supported: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  claims_supported: string[];
}

class OpenIdMetadata {
  public lastUpdated: number = 0;

  public keys: { kid: string, e: string, n: string }[];

  private _keys: { kid: string, e: string, n: string }[];

  constructor(public url: string) { };

  public getKey(keyId: string, callback): void {
    let _this = this;

    // if keys are more than 5d old, refresh
    let now = new Date().getTime();
    if (this.lastUpdated < (now - 1000 * 60 * 60 * 24 * 5)) {
      this._refreshCache((error) => {
        if (error) { }
        // search cache even if failed to refresh
        callback(_this._findKey(keyId));
      });
    } else {
      // otherwise read fro cache
      callback(this._findKey(keyId))
    }
  }

  /**
   * Refresh the internal cache.
   * @param cb
   *   The callback after the cache is refreshed.
   */
  private _refreshCache(callback): void {
    let _this = this;

    axios.get(this.url)
      .then((openIdConfigResponse: AxiosResponse) => {
        log(`OpenID Config HTTP GET response = (${openIdConfigResponse.status})`, openIdConfigResponse.data);

        if (openIdConfigResponse.status >= 400 || !openIdConfigResponse.data) {
          throw new Error(`Failed to load OpenID config. ${openIdConfigResponse.status}: ${openIdConfigResponse.statusText}`);
        }

        let openIdConfig: OpenIdConfiguration = openIdConfigResponse.data;
        // get the keys
        axios.get(openIdConfig.jwks_uri)
          .then((keySetResponse: AxiosResponse) => {
            log(`Key request = (${keySetResponse.status})`, keySetResponse.data);

            if (keySetResponse.status >= 400 || !keySetResponse.data) {
              throw new Error(`Failed to load JSON web key set. ${openIdConfigResponse.status}: ${openIdConfigResponse.statusText}`);
            }

            _this.lastUpdated = new Date().getTime();
            _this.keys = keySetResponse.data.keys;
            callback(null);
          }).catch((error: Error) => {
            callback(error);
          });
      }).catch((error: Error) => {
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
  private _findKey(keyId: string): any {
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

export { OpenIdMetadata };