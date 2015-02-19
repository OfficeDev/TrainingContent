package com.microsoft.researchtracker.auth;

import java.security.NoSuchAlgorithmException;

import javax.crypto.NoSuchPaddingException;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

import com.microsoft.aad.adal.AuthenticationCallback;
import com.microsoft.aad.adal.AuthenticationCancelError;
import com.microsoft.aad.adal.AuthenticationContext;
import com.microsoft.aad.adal.AuthenticationResult;
import com.microsoft.aad.adal.AuthenticationResult.AuthenticationStatus;
import com.microsoft.aad.adal.PromptBehavior;
import com.microsoft.researchtracker.Constants;
import com.microsoft.researchtracker.App;

public class AuthManager {

    private static final String TAG = "AuthManager";
    public static final String LAST_USER_ID_KEY = "user_id";

    private AuthenticationContext mAuthContext;
    private final SharedPreferences mPrefs;

    private AuthenticationResult mCachedAuthResult;
    private boolean mAuthInProgress;


    public AuthManager(App application) throws NoSuchAlgorithmException, NoSuchPaddingException {
        //AAD_AUTHORITY is in the form of "https://login.windows.net/yourtenant.onmicrosoft.com"
        mAuthContext = new AuthenticationContext(application, Constants.AAD_AUTHORITY, false);
        mPrefs = application.getSharedPreferences("login_prefs", Context.MODE_PRIVATE);
    }

    public String getAccessToken() {

        if (!isCachedAuthResultValid()) {
            //Must call authenticate, forceAuthenticate or refresh before invoking this method
            throw new RuntimeException("Auth token is not valid");
        }

        return mCachedAuthResult.getAccessToken();
    }

    private boolean isCachedAuthResultValid() {
        return mCachedAuthResult != null && !mCachedAuthResult.isExpired();
    }

    private void updateCachedAuthResult(AuthenticationResult result) {
        mCachedAuthResult = result;
        String userId = isCachedAuthResultValid() ?  result.getUserInfo().getUserId() : null;
        mPrefs.edit().putString(LAST_USER_ID_KEY, userId).apply();
    }

    public boolean hasCachedCredentials() {
        return mPrefs.getString(LAST_USER_ID_KEY, null) != null;
    }

    public boolean isAuthenticationInProgress() {
        return mAuthInProgress;
    }

    public void clearAuthTokenAndCachedCredentials() {
        updateCachedAuthResult(null);
        mAuthContext.getCache().removeAll();
    }

    /**
     * Attempts to retrieve a new auth token. If there is already an unexpired auth token then no action
     * is taken. If the token has expired then this method attempts to refresh it using the refresh token.
     *
     * Note: must be called from the UI thread.
     *
     * @param currentActivity
     * @param handler
     */
    public void forceAuthenticate(final Activity currentActivity, final AuthCallback handler) {

        assert currentActivity != null;
        assert handler != null;

        if (isCachedAuthResultValid()) {
            //Already authenticated...
            handler.onSuccess();
            return;
        }

        mAuthInProgress = true;

        //Asks the user to authenticate directly only if it cannot acquire a refresh token
        mAuthContext.acquireToken(currentActivity,
            /* Resource         */ Constants.AAD_RESOURCE_ID,
            /* Client Id        */ Constants.AAD_CLIENT_ID,
            /* Redirect Uri     */ Constants.AAD_REDIRECT_URL,
            /* Login Hint       */ null,
            /* Prompt Behaviour */ PromptBehavior.Always,
            /* Extra            */ null,
                createAuthCallback(handler)
        );
    }

    /**
     * Attempts to refresh the cached auth token if it has expired.
     *
     * @param handler
     */
    public void authenticateSilently(final AuthCallback handler) {

        assert handler != null;

        if (isCachedAuthResultValid()) {
            //Already authenticated...
            handler.onSuccess();
            return;
        }

        //Will not prompt the user if it cannot acquire a token
        mAuthContext.acquireTokenSilent(
            /* Resource  */ Constants.AAD_RESOURCE_ID,
            /* Client Id */ Constants.AAD_CLIENT_ID,
            /* User Id   */ mPrefs.getString(LAST_USER_ID_KEY, null),
                createAuthCallback(handler)
        );
    }

    private AuthenticationCallback<AuthenticationResult> createAuthCallback(final AuthCallback handler) {
        return new AuthenticationCallback<AuthenticationResult>() {
            @Override
            public void onSuccess(AuthenticationResult authResult) {
                mAuthInProgress = false;
                final AuthenticationStatus status = authResult.getStatus();
                if (status == AuthenticationStatus.Succeeded) {
                    // create a credentials instance using the token from ADAL
                    updateCachedAuthResult(authResult);
                    handler.onSuccess();
                }
                else if (status == AuthenticationStatus.Failed) {
                    Log.e(TAG, "Authentication failed: " + authResult.getErrorDescription());
                    handler.onFailure(authResult.getErrorDescription());
                }
                else {
                    Log.i(TAG, "Authentication cancelled");
                    handler.onCancelled();
                }
            }

            @Override
            public void onError(Exception ex) {
                mAuthInProgress = false;
                if (ex instanceof AuthenticationCancelError) {
                    Log.i(TAG, "Authentication cancelled");
                    handler.onCancelled();
                }
                else {
                    Log.e(TAG, "Error during authentication", ex);
                    handler.onFailure(ex.getMessage());
                }
            }
        };
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        mAuthContext.onActivityResult(requestCode, resultCode, data);
    }
}

