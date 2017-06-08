package com.microsoft.researchtracker;

import android.app.Application;
import android.util.Log;

import com.microsoft.researchtracker.auth.AuthManager;
import com.microsoft.researchtracker.sharepoint.data.ResearchDataSource;
import com.microsoft.services.sharepoint.ListClient;
import com.microsoft.services.sharepoint.http.OAuthCredentials;

public class App extends Application {

    private static final String TAG = "TodoApplication";

    private AuthManager mAuthManager;

    public AuthManager getAuthManager() {

        if (mAuthManager == null) {
            try {
                mAuthManager = new AuthManager(this);
            }
            catch (Exception e) {
                Log.e(TAG, "Error creating authentication context", e);
                throw new RuntimeException("Error creating authentication context", e);
            }
        }

        return mAuthManager;
    }

    public ResearchDataSource getDataSource() {

        String accessToken = mAuthManager.getAccessToken();

        ListClient client = new ListClient(
                Constants.SHAREPOINT_URL,
                Constants.SHAREPOINT_SITE_PATH,
                new OAuthCredentials(accessToken)
        );

        return new ResearchDataSource(client);
    }
}
