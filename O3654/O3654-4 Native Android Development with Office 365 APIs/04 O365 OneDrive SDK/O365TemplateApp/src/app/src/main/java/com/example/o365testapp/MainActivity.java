package com.example.o365testapp;

import android.app.Activity;
import android.os.Bundle;

public class MainActivity extends Activity {

    public static final String PARAM_ACCESS_TOKEN = "param_access_token";

    /**
     * The OAuth Access Token provided by LaunchActivity.
     */
    private String mAccessToken;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //Access token obtained by LaunchActivity using the Active Directory Authentication Library
        mAccessToken = getIntent().getStringExtra(PARAM_ACCESS_TOKEN);
    }
}
