package com.microsoft.androidoffice365calendar;

import android.app.Activity;
import android.util.Log;

import com.google.common.util.concurrent.SettableFuture;
import com.microsoft.aad.adal.AuthenticationCallback;
import com.microsoft.aad.adal.AuthenticationContext;
import com.microsoft.aad.adal.AuthenticationResult;
import com.microsoft.aad.adal.PromptBehavior;
import com.microsoft.services.orc.auth.AuthenticationCredentials;
import com.microsoft.services.orc.core.DependencyResolver;
import com.microsoft.services.orc.http.Credentials;
import com.microsoft.services.orc.http.impl.OAuthCredentials;
import com.microsoft.services.orc.http.impl.OkHttpTransport;
import com.microsoft.services.orc.serialization.impl.GsonSerializer;

public class AuthenticationController {
    private final String TAG = "Authentication";
    private AuthenticationContext authContext;
    private DependencyResolver dependencyResolver;
    private Activity contextActivity;
    private String resourceId;

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
                                dependencyResolver = new DependencyResolver.Builder(
                                        new OkHttpTransport(), new GsonSerializer(),
                                        new AuthenticationCredentials() {
                                            @Override
                                            public Credentials getCredentials() {
                                                return new OAuthCredentials(authenticationResult.getAccessToken());
                                            }
                                        }).build();
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

    public DependencyResolver getDependencyResolver() {
        return getInstance().dependencyResolver;
    }

    private boolean verifyAuthenticationContext() {
        if (this.contextActivity == null) {
            return false;
        }
        return true;
    }
}
