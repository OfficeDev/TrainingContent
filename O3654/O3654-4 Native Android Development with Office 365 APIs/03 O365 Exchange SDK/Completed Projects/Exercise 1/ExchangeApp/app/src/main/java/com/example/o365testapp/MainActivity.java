package com.example.o365testapp;

import android.os.Bundle;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.view.View;
import android.widget.EditText;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.TimeZone;
import java.util.List;

import com.microsoft.graph.core.ClientException;
import com.microsoft.graph.core.IClientConfig;
import com.microsoft.graph.core.DefaultClientConfig;
import com.microsoft.graph.extensions.BodyType;
import com.microsoft.graph.extensions.EmailAddress;
import com.microsoft.graph.extensions.IMailFolderRequestBuilder;
import com.microsoft.graph.extensions.IMessageCollectionRequest;
import com.microsoft.graph.extensions.IMessageCollectionRequestBuilder;
import com.microsoft.graph.extensions.ItemBody;
import com.microsoft.graph.extensions.MailFolder;
import com.microsoft.graph.extensions.Message;
import com.microsoft.graph.extensions.Recipient;
import com.microsoft.graph.extensions.MailFolder;
import com.microsoft.graph.extensions.IMailFolderCollectionPage;
import com.microsoft.graph.extensions.IMailFolderCollectionRequest;
import com.microsoft.graph.extensions.GraphServiceClient;
import com.microsoft.graph.extensions.IGraphServiceClient;
import com.microsoft.graph.extensions.IMessageCollectionPage;
import com.microsoft.graph.authentication.IAuthenticationAdapter;
import com.microsoft.graph.authentication.MSAAuthAndroidAdapter;
import com.microsoft.graph.extensions.User;
import com.microsoft.graph.http.IHttpRequest;
import com.microsoft.graph.concurrency.ICallback;
import com.microsoft.graph.options.Option;
import com.microsoft.graph.options.HeaderOption;
import com.microsoft.graph.options.QueryOption;

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
                        "https://graph.microsoft.com/Calendars.ReadWrite",
                        "https://graph.microsoft.com/Contacts.ReadWrite",
                        "https://graph.microsoft.com/Files.ReadWrite",
                        "https://graph.microsoft.com/Mail.ReadWrite",
                        "https://graph.microsoft.com/Mail.Send",
                        "https://graph.microsoft.com/User.ReadBasic.All",
                        "https://graph.microsoft.com/User.ReadWrite",
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

    /*

        TODO: put lab code here

     */
}
