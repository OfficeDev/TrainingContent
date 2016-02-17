package com.example.o365testapp;

import android.app.Activity;
import android.os.Bundle;
import com.microsoft.services.graph.fetchers.GraphServiceClient;
import com.microsoft.services.orc.auth.AuthenticationCredentials;
import com.microsoft.services.orc.core.DependencyResolver;
import com.microsoft.services.orc.http.Credentials;
import com.microsoft.services.orc.http.impl.OAuthCredentials;
import com.microsoft.services.orc.http.impl.OkHttpTransport;
import com.microsoft.services.orc.serialization.impl.GsonSerializer;

public class MainActivity extends Activity {

    public static final String PARAM_ACCESS_TOKEN = "param_access_token";

    private DependencyResolver mResolver;
    private GraphServiceClient graphServiceClient;

    /**
     * OAuth Access Token provided by LaunchActivity.
     */
    private String mAccessToken;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //Access token obtained by LaunchActivity using the Active Directory Authentication Library
        mAccessToken = getIntent().getStringExtra(PARAM_ACCESS_TOKEN);

        mResolver = new DependencyResolver.Builder(
                new OkHttpTransport(), new GsonSerializer(),
                new AuthenticationCredentials() {
                    @Override
                    public Credentials getCredentials() {
                        return new OAuthCredentials(mAccessToken);
                    }
                }).build();

        graphServiceClient = new GraphServiceClient("https://graph.microsoft.com/v1.0", mResolver);
    }
}
