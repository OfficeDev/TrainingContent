import express = require("express");
import * as jwt from "jsonwebtoken";
const jwksClient = require('jwks-rsa');

const getSigningKeys = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
  const client = jwksClient({
    jwksUri: "https://login.microsoftonline.com/common/discovery/keys"
  });

  client.getSigningKey(header.kid, function (err, key: any) {
    callback(err, key.publicKey || key.rsaPublicKey);
  });
};

export async function validateToken(req: express.Request): Promise<string> {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ").pop();

      if (token) {
        const validationOptions = {
          audience: `api://${process.env.PUBLIC_HOSTNAME}/${process.env.MICROSOFT_APP_ID}`
        };

        jwt.verify(token, getSigningKeys, validationOptions, (err, payload) => {
          if (err) { reject(new Error("403")); }
          resolve(token);
        });
      } else {
        reject(new Error("401"));
      }
    } else {
      reject(new Error("401"));
    }
  });
};