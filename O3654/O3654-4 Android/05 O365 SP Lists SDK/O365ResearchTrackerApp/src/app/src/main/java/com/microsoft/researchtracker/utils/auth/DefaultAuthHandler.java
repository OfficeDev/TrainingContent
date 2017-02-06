package com.microsoft.researchtracker.utils.auth;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.DialogInterface;
import android.content.Intent;
import android.util.Log;

import com.microsoft.researchtracker.LoginActivity;
import com.microsoft.researchtracker.R;
import com.microsoft.researchtracker.utils.AuthUtil;

/**
 * An abstract AuthHandler implementation which presents a dialog to the user when authentication fails,
 * prompting them to re-authenticate.
 *
 * When the user acknowledges the dialog we automatically restart the application and force the user to authenticate.
 */
public abstract class DefaultAuthHandler implements AuthUtil.AuthHandler {

    private static final String TAG = "DefaultAuthHandler";

    private Activity mActivity;

    public DefaultAuthHandler(Activity activity) {
        mActivity = activity;
    }

    public void onFailure(String errorDescription) {

        Log.w(TAG, "Error while verifying or refreshing access token: " + errorDescription);

        //Authentication has failed! Launch a dialog to let the user know.
        //When the user taps Continue, we will restart the app so that they may authenticate again.

        new AlertDialog.Builder(mActivity)
                .setTitle(R.string.dialog_session_expired_title)
                .setMessage(R.string.dialog_session_expired_message)
                .setPositiveButton(R.string.label_continue, new DialogInterface.OnClickListener() {
                    @Override public void onClick(DialogInterface dialog, int which) {

                        //user has confirmed - restart the app
                        final Intent intent = Intent.makeRestartActivityTask(new ComponentName(mActivity, LoginActivity.class));
                        intent.putExtra(LoginActivity.PARAM_AUTH_IMMEDIATE, true);

                        mActivity.startActivity(intent);
                    }
                })
                .setCancelable(false)
                .create()
                .show();
    }
}