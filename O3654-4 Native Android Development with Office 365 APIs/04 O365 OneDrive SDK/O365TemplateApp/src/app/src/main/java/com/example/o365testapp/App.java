package com.example.o365testapp;

import android.app.Application;

import com.microsoft.aad.adal.AuthenticationContext;

import java.security.NoSuchAlgorithmException;

import javax.crypto.NoSuchPaddingException;

public class App extends Application {

    private AuthenticationContext mAuthContext;

    public AuthenticationContext getAuthContext() {
        if (mAuthContext == null) {
            try {
                mAuthContext = new AuthenticationContext(getApplicationContext(), "https://login.windows.net/common", false);
            }
            catch (NoSuchAlgorithmException e) {
                throw new RuntimeException("Error creating auth context", e);
            }
            catch (NoSuchPaddingException e) {
                throw new RuntimeException("Error creating auth context", e);
            }
        }

        return mAuthContext;
    }
}
