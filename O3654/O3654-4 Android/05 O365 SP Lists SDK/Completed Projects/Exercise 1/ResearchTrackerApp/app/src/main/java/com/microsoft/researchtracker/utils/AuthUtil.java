package com.microsoft.researchtracker.utils;

import android.app.Activity;
import android.util.Log;

import com.microsoft.researchtracker.BuildConfig;
import com.microsoft.researchtracker.App;
import com.microsoft.researchtracker.auth.AuthCallback;
import com.microsoft.researchtracker.auth.AuthManager;

public class AuthUtil {

    protected static final String TAG = "ActivityUtil";

    public static void ensureAuthenticated(final Activity activity, final AuthHandler handler) {

        final App application = (App) activity.getApplication();
        final AuthManager authManager = application.getAuthManager();

        authManager.authenticateSilently(new AuthCallback() {
            @Override
            public void onSuccess() {
                handler.onSuccess();
            }

            @Override
            public void onFailure(String errorDescription) {
                handler.onFailure(errorDescription);
            }

            @Override
            public void onCancelled() {
                //This should never occur because authManager.refresh does not take any user input
                Log.w(TAG, "AuthManager.refresh failed with onCancelled");
                if (BuildConfig.DEBUG) {
                    throw new RuntimeException("Invalid operation: AuthManager failed with onCancelled");
                }
            }
        });
    }

    public static interface AuthHandler {

        void onSuccess();

        void onFailure(String errorDescription);

    }
}
