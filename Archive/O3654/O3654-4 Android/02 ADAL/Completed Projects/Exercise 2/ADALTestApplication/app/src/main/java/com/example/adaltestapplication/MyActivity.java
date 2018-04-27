package com.example.adaltestapplication;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.microsoft.aad.adal.AuthenticationCallback;
import com.microsoft.aad.adal.AuthenticationContext;
import com.microsoft.aad.adal.AuthenticationResult;
import com.microsoft.aad.adal.PromptBehavior;

import java.security.NoSuchAlgorithmException;

import javax.crypto.NoSuchPaddingException;

public class MyActivity extends Activity {

    //The resource we want to authenticate for
    private static final String RESOURCE = "https://graph.microsoft.com/";
    private static final String CLIENT_ID = "YOUR CLIENT ID";
    private static final String REDIRECT_URI = "http://example.com/redirect";
    //Local instance variables
    private AuthenticationContext mAuthContext;
    private Button mGetAccessTokenButton;

    private Button mRefreshAccessTokenButton;
    //The last user to sign in
    private String mLastUserId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_my);

        //Create an authentication context...
        final String AUTHORITY = "https://login.windows.net/common";
        final boolean VALIDATE_AUTHORITY = false;
        final Context context = getApplicationContext();
        try {
            mAuthContext = new AuthenticationContext(context, AUTHORITY, VALIDATE_AUTHORITY);
        }
        catch (NoSuchAlgorithmException e) {
            //This error should not occur in normal operation, but we cannot continue if it does
            throw new RuntimeException("Error creating authentication context", e);
        }
        catch (NoSuchPaddingException e) {
            //This error should not occur in normal operation, but we cannot continue if it does
            throw new RuntimeException("Error creating authentication context", e);
        }

        //Hook up the "Get Access Token" button
        mGetAccessTokenButton = (Button) findViewById(R.id.get_access_token);
        mGetAccessTokenButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                startAuthentication();
            }
        });

        //Hook up the "Refresh Access Token" button
        mRefreshAccessTokenButton = (Button) findViewById(R.id.refresh_access_token);
        mRefreshAccessTokenButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                startSilentAuthentication();
            }
        });
    }

    private void startAuthentication() {
        mAuthContext.acquireToken(
                this,
                RESOURCE,
                CLIENT_ID,
                REDIRECT_URI,
                PromptBehavior.Always,
                new AuthenticationCallback<AuthenticationResult>() {
                    public void onSuccess(AuthenticationResult authenticationResult) {
                        handleSuccess(authenticationResult);
                    }

                    public void onError(Exception e) {
                        handleError(e.toString());
                    }
                }
        );
    }

    private void handleSuccess(AuthenticationResult authenticationResult) {
        String message = String.format(
                "User Id: %1$s\nExpires on: %2$s\nAccess Token: %3$s...\nRefresh Token: %4$s...",
                authenticationResult.getUserInfo().getUserId(),
                authenticationResult.getExpiresOn().toString(),
                authenticationResult.getAccessToken().substring(0, 10),
                authenticationResult.getRefreshToken().substring(0, 10)
        );

        //Cache the user Id...
        mLastUserId = authenticationResult.getUserInfo().getUserId();

        new AlertDialog.Builder(this)
                .setTitle("Success")
                .setMessage(message)
                .setPositiveButton("Ok", null)
                .show();
    }

    private void handleError(String errorMessage) {
        new AlertDialog.Builder(this)
                .setTitle("Whoops!")
                .setMessage("Something went wrong: " + errorMessage)
                .setPositiveButton("Ok", null)
                .show();
    }

    private void startSilentAuthentication() {
        if (TextUtils.isEmpty(mLastUserId)) {
            Toast.makeText(this, "No cached user Id!", Toast.LENGTH_SHORT)
                    .show();
            return;
        }
        mAuthContext.acquireTokenSilent(
                RESOURCE,
                CLIENT_ID,
                mLastUserId,
                new AuthenticationCallback<AuthenticationResult>() {
                    public void onSuccess(AuthenticationResult result) {
                        handleSuccess(result);
                    }

                    public void onError(Exception e) {
                        handleError(e.toString());
                    }
                }
        );
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        mAuthContext.onActivityResult(requestCode, resultCode, data);
    }
}
