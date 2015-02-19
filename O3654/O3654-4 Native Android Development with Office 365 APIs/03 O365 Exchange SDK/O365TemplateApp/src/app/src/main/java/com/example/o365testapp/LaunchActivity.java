package com.example.o365testapp;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.Window;

import com.microsoft.aad.adal.AuthenticationCallback;
import com.microsoft.aad.adal.AuthenticationResult;
import com.microsoft.aad.adal.PromptBehavior;

public class LaunchActivity extends Activity {

    private App mApp;

    private View mSignInButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS);
        setContentView(R.layout.activity_launch);
        setProgressBarIndeterminate(true);

        mApp = (App) getApplication();

        mSignInButton = findViewById(R.id.sign_in_button);
        mSignInButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                startSignIn();
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        mApp.getAuthContext().onActivityResult(requestCode, resultCode, data);
    }

    private void lockView() {
        mSignInButton.setEnabled(false);
        setProgressBarIndeterminateVisibility(true);
    }

    private void unlockView() {
        mSignInButton.setEnabled(true);
        setProgressBarIndeterminateVisibility(false);
    }

    private void startSignIn() {

        lockView();

        mApp.getAuthContext().acquireToken(
                this,
                Constants.RESOURCE,
                Constants.CLIENT_ID,
                Constants.REDIRECT_URI,
                PromptBehavior.Auto,
                new AuthenticationCallback<AuthenticationResult>() {
                    public void onSuccess(AuthenticationResult authenticationResult) {

                        unlockView();
                        launchMainActivity(authenticationResult);
                    }

                    public void onError(Exception e) {

                        unlockView();
                        //We were unable to authenticate the user - let them know
                        new AlertDialog.Builder(LaunchActivity.this)
                                .setTitle(R.string.dialog_error_title)
                                .setMessage(getString(R.string.dialog_error_unable_to_sign_in, e.getMessage()))
                                .setPositiveButton(getString(R.string.label_ok), null)
                                .show();
                    }
                }
        );
    }

    private void launchMainActivity(AuthenticationResult authenticationResult) {

        //Forward the user to the Main activity
        Intent launchIntent = new Intent(this, MainActivity.class);

        launchIntent.putExtra(MainActivity.PARAM_ACCESS_TOKEN, authenticationResult.getAccessToken());

        startActivity(launchIntent);
        finish();
    }
}
