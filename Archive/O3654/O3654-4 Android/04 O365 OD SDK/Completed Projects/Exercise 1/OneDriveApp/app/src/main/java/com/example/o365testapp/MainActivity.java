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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.List;

import com.microsoft.graph.concurrency.ICallback;
import com.microsoft.graph.extensions.DriveItem;
import com.microsoft.graph.extensions.File;
import com.microsoft.graph.extensions.Folder;
import com.microsoft.graph.extensions.GraphServiceClient;;
import com.microsoft.graph.extensions.IDriveItemCollectionPage;
import com.microsoft.graph.extensions.IDriveItemCollectionRequest;
import com.microsoft.graph.extensions.IGraphServiceClient;
import com.microsoft.graph.core.ClientException;
import com.microsoft.graph.core.IClientConfig;
import com.microsoft.graph.core.DefaultClientConfig;
import com.microsoft.graph.authentication.MSAAuthAndroidAdapter;
import com.microsoft.graph.authentication.IAuthenticationAdapter;
import com.microsoft.graph.http.IHttpRequest;
import com.microsoft.graph.options.HeaderOption;

public class MainActivity extends Activity {

    public static final String PARAM_ACCESS_TOKEN = "param_access_token";

    private IGraphServiceClient graphServiceClient;

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

        final IAuthenticationAdapter authenticationAdapter = new MSAAuthAndroidAdapter(getApplication()) {
            @Override
            public String getClientId() {
                return Constants.CLIENT_ID;
            }

            @Override
            public String[] getScopes() {
                return new String[] {
                        "https://graph.microsoft.com/File.ReadWrite",
                        "offline_access",
                        "openid"
                };
            }
            @Override
            public void authenticateRequest(final IHttpRequest request) {
                for (final HeaderOption option : request.getHeaders()) {
                    if (option.getName().equals(AUTHORIZATION_HEADER_NAME)) {
                        return;
                    }
                }
                if (mAccessToken != null && mAccessToken.length() > 0){
                    request.addHeader(AUTHORIZATION_HEADER_NAME, OAUTH_BEARER_PREFIX + mAccessToken);
                    return;
                }
                super.authenticateRequest(request);
            }
        };
        final IClientConfig mClientConfig = DefaultClientConfig.createWithAuthenticationProvider(authenticationAdapter);
        graphServiceClient  = new GraphServiceClient
                .Builder()
                .fromConfig(mClientConfig)
                .buildClient();
    }
}
