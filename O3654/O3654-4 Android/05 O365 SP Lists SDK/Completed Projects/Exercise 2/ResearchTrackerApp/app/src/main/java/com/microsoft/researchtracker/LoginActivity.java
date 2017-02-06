package com.microsoft.researchtracker;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.microsoft.researchtracker.auth.AuthCallback;
import com.microsoft.researchtracker.auth.AuthManager;
import com.microsoft.researchtracker.utils.DialogUtil;

public class LoginActivity extends Activity {

    public static final String PARAM_AUTH_IMMEDIATE = "auth_immediate";

    private App mApp;
    private AuthManager mAuth;

    private Button mloginButton;
    private ProgressBar mProgress;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setProgressBarIndeterminate(true);

        setContentView(R.layout.activity_login);

        mApp = (App) getApplication();
        mAuth = mApp.getAuthManager();

        mloginButton = (Button) findViewById(R.id.loginButton);
        mloginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startUserAuthentication();
            }
        });

        mProgress = (ProgressBar) findViewById(R.id.progress);

        resetView();
    }

    @Override
    protected void onStart() {
        super.onStart();

        if (!mAuth.isAuthenticationInProgress()) {
            if (getIntent().getBooleanExtra(PARAM_AUTH_IMMEDIATE, false)) {

                //The splash screen was launched with the explicit intent of re-authenticating the user.
                //Ask the user to authenticate immediately.
                startUserAuthentication();
            } else {

                //Attempt to acquire a cached access token, or to retrieve a new token using a cached refresh token.
                startAcquireToken();
            }
        }
    }

    /**
     * Locks all user controls in this view and displays the "work in progress" indicator.
     */
    private void lockViewForBackgroundTask() {
        mloginButton.setEnabled(false);
        mProgress.setVisibility(View.VISIBLE);
    }

    /**
     * Unlocks all user controls in this view and hides the progress indicator.
     */
    private void resetView() {
        mloginButton.setEnabled(true);
        mProgress.setVisibility(View.INVISIBLE);
    }

    /**
     * Attempts to acquire an auth token from the cache, and may optionally attempt to use a refresh token.
     * If this fails then the user must sign in explicitly.
     */
    private void startAcquireToken() {

        lockViewForBackgroundTask();

        mAuth.authenticateSilently(new AuthCallback() {

            @Override
            public void onSuccess() {
                Toast.makeText(LoginActivity.this, R.string.activity_login_already_signed_in, Toast.LENGTH_SHORT).show();
                completeLogin();
            }

            @Override
            public void onFailure(String errorDescription) {
                resetView();
            }

            @Override
            public void onCancelled() {
                resetView();
            }
        });
    }

    /**
     * Starts authentication with the O365 backend.
     * The user will be prompted for their credentials.
     */
    private void startUserAuthentication() {

        lockViewForBackgroundTask();

        //Start authentication procedure
        mAuth.forceAuthenticate(this, new AuthCallback() {

            @Override
            public void onSuccess() {
                Toast.makeText(LoginActivity.this, R.string.activity_login_sign_in_complete, Toast.LENGTH_SHORT).show();
                completeLogin();
            }

            @Override
            public void onFailure(String errorDescription) {
                Toast.makeText(LoginActivity.this, errorDescription, Toast.LENGTH_LONG).show();
                launchRetryDialog(errorDescription);
            }

            @Override
            public void onCancelled() {
                resetView();
            }

            private void launchRetryDialog(String errorDescription) {
                DialogUtil.makeRetryDialog(LoginActivity.this,
                        R.string.dialog_auth_failed_title,
                        R.string.dialog_auth_failed_message,
                        new Runnable() {
                            @Override
                            public void run() {
                                resetView();
                                startUserAuthentication();
                            }
                        }
                )
                .show();
            }
        });

    }

    /**
     * Navigates to the main application Activity
     */
    private void completeLogin() {

        final Intent intent = new Intent(this, ListProjectsActivity.class);

        startActivity(intent);
        finish();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        //Handle authentication completion
        mAuth.onActivityResult(requestCode, resultCode, data);
    }

}
