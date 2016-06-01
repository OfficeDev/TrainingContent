package com.microsoft.androidoffice365calendar;

import android.app.Activity;
import android.util.Log;

import com.google.common.util.concurrent.SettableFuture;
import com.microsoft.aad.adal.AuthenticationCallback;
import com.microsoft.aad.adal.AuthenticationContext;
import com.microsoft.aad.adal.AuthenticationResult;
import com.microsoft.aad.adal.PromptBehavior;

/**
 * Created by Microsoft on 5/24/2016.
 */
public class AuthenticationController {
    private final String TAG = "Authentication";
    private AuthenticationContext authContext;
    private Activity contextActivity;
    private String resourceId;
    private String graphToken;

    public static synchronized AuthenticationController getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new AuthenticationController();
        }
        return INSTANCE;
    }
    private static AuthenticationController INSTANCE;

    private AuthenticationController() {
        resourceId = Constants.GRAPH_RESOURCE_ID;
    }

    public void setContextActivity(final Activity contextActivity) {
        this.contextActivity = contextActivity;
    }

    public SettableFuture<Boolean> initialize() {
        final SettableFuture<Boolean> result = SettableFuture.create();

        if (verifyAuthenticationContext()) {
            getAuthenticationContext().acquireToken(
                    this.contextActivity,
                    this.resourceId,
                    Constants.AAD_CLIENT_ID,
                    Constants.AAD_REDIRECT_URL,
                    PromptBehavior.Auto,
                    new AuthenticationCallback<AuthenticationResult>() {
                        @Override
                        public void onSuccess(final AuthenticationResult authenticationResult) {
                            if (authenticationResult != null && authenticationResult.getStatus() == AuthenticationResult.AuthenticationStatus.Succeeded) {
                                graphToken = authenticationResult.getAccessToken();
                                result.set(true);
                            }
                        }

                        @Override
                        public void onError(Exception t) {
                            Log.e(TAG, "Acquire token failed. " + t.getMessage());
                            result.setException(t);
                        }
                    });
        } else {
            result.setException(new Throwable("Auth context verification failed."));
        }
        return result;
    }

    public AuthenticationContext getAuthenticationContext() {
        if (authContext == null) {
            try {
                authContext = new AuthenticationContext(this.contextActivity, Constants.AAD_AUTHORITY, false);
            } catch (Throwable t) {
                Log.e(TAG, "Get AuthenticationContext failed. " + t.toString());
            }
        }
        return authContext;
    }

     private boolean verifyAuthenticationContext() {
        if (this.contextActivity == null) {
            return false;
        }
        return true;
    }

    public String getGraphToken(){
        return graphToken;
    }
}
