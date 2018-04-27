package com.microsoft.researchtracker;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Patterns;
import android.view.View;
import android.widget.ProgressBar;

import com.microsoft.researchtracker.utils.DialogUtil;

public class ReceiveShareActivity extends Activity {

    private App mApp;

    private ProgressBar mProgress;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_receive_share);

        mApp = (App) getApplication();

        mProgress = (ProgressBar) findViewById(R.id.progress);
        mProgress.setVisibility(View.GONE);

        Intent launchIntent = getIntent();

        if (Intent.ACTION_SEND.equals(launchIntent.getAction()) && "text/plain".equals(launchIntent.getType())) {

            handlePlainTextShare(launchIntent);
        }
        else {

            //Not supported
            DialogUtil
                .makeGoBackDialog(this,
                    R.string.dialog_generic_error_title,
                    R.string.dialog_share_error_not_supported_message,
                    new Runnable() {
                        public void run() {
                            setResult(RESULT_CANCELED);
                            finish();
                        }
                    }
                )
                .show();
        }
    }

    /**
     * Forwards the request to the Edit Reference activity
     */
    private void handlePlainTextShare(Intent intent) {

        String text = intent.getStringExtra(Intent.EXTRA_TEXT);

        Intent editIntent = new Intent(this, EditReferenceActivity.class);
        editIntent.putExtra(EditReferenceActivity.PARAM_NEW_REFERENCE_MODE, true);

        if (Patterns.WEB_URL.matcher(text).matches()) {
            editIntent.putExtra(EditReferenceActivity.PARAM_NEW_REFERENCE_URL, text);
        }
        else {
            editIntent.putExtra(EditReferenceActivity.PARAM_NEW_REFERENCE_DESCRIPTION, text);
        }

        startActivity(editIntent);
        finish();
    }
}
