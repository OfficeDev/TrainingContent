package com.example.o365testapp;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;
import com.microsoft.services.graph.DriveItem;
import com.microsoft.services.graph.File;
import com.microsoft.services.graph.Folder;
import com.microsoft.services.graph.fetchers.GraphServiceClient;
import com.microsoft.services.orc.auth.AuthenticationCredentials;
import com.microsoft.services.orc.core.DependencyResolver;
import com.microsoft.services.orc.core.OrcList;
import com.microsoft.services.orc.http.Credentials;
import com.microsoft.services.orc.http.impl.OAuthCredentials;
import com.microsoft.services.orc.http.impl.OkHttpTransport;
import com.microsoft.services.orc.serialization.impl.GsonSerializer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.List;

public class MainActivity extends Activity {

    public static final String PARAM_ACCESS_TOKEN = "param_access_token";

    /**
     * The OAuth Access Token provided by LaunchActivity.
     */
    private String mAccessToken;

    private DependencyResolver mResolver;
    private GraphServiceClient graphServiceClient;

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
