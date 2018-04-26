package com.microsoft.researchtracker;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.microsoft.researchtracker.sharepoint.data.ResearchDataSource;
import com.microsoft.researchtracker.sharepoint.models.ResearchProjectModel;
import com.microsoft.researchtracker.utils.AsyncUtil;
import com.microsoft.researchtracker.utils.AuthUtil;
import com.microsoft.researchtracker.utils.DialogUtil;
import com.microsoft.researchtracker.utils.auth.DefaultAuthHandler;

public class EditProjectActivity extends Activity {

    private static final String TAG = "EditProjectActivity";
    private static final int NEW_PROJECT_ID = -1;

    public static final String PARAM_NEW_PROJECT_MODE = "new_project_mode";
    public static final String PARAM_PROJECT_ID = "project_id";

    private App mApp;

    private EditText mTitleText;
    private ProgressBar mProgress;

    private int mProjectId;

    private boolean mLoaded;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_project);

        mApp = (App) getApplication();

        mTitleText = (EditText) findViewById(R.id.title_edit_text);
        mTitleText.setEnabled(false);

        mProgress = (ProgressBar) findViewById(R.id.progress);
        mProgress.setVisibility(View.GONE);

        configureActionBar();

        mLoaded = false;
    }

    private void configureActionBar() {
        //Action Bar buttons (OK, Cancel)
        View actionBarButtons = getLayoutInflater().inflate(R.layout.action_buttons_ok_cancel, new LinearLayout(this), false);
        actionBarButtons.findViewById(R.id.action_accept).setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                saveChangesAndFinish();
            }
        });
        actionBarButtons.findViewById(R.id.action_cancel).setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                finish();
            }
        });

        //Switch action bar to use entirely custom view
        ActionBar actionBar = getActionBar();

        assert actionBar != null;

        actionBar.setHomeButtonEnabled(false);
        actionBar.setDisplayShowHomeEnabled(false);
        actionBar.setDisplayHomeAsUpEnabled(false);
        actionBar.setDisplayShowTitleEnabled(false);
        actionBar.setDisplayShowCustomEnabled(true);
        actionBar.setCustomView(actionBarButtons);
    }

    @Override
    protected void onStart() {
        super.onStart();

        if (!mLoaded) {
            mLoaded = true;

            Intent launchIntent = getIntent();

            if (launchIntent.getBooleanExtra(PARAM_NEW_PROJECT_MODE, false)) {

                mProjectId = NEW_PROJECT_ID;
                prepareView(null);
            }
            else {

                mProjectId = launchIntent.getIntExtra(PARAM_PROJECT_ID, 0);
                retrieveProjectDetails();
            }
        }
    }

    private void prepareView(ResearchProjectModel model) {

        mTitleText.setText(model == null ? null : model.getTitle());
        mTitleText.setEnabled(true);
    }

    private void ensureAuthenticated(final Runnable r) {
        AuthUtil.ensureAuthenticated(this, new DefaultAuthHandler(this) {
            @Override public void onSuccess() {
                r.run();
            }
        });
    }

    private void retrieveProjectDetails() {

        ensureAuthenticated(new Runnable() {
            public void run() {

                mProgress.setVisibility(View.VISIBLE);

                AsyncUtil.onBackgroundThread(new AsyncUtil.BackgroundHandler<ResearchProjectModel>() {
                    public ResearchProjectModel run() {
                        try {
                            return mApp.getDataSource().getResearchProjectById(mProjectId);
                        }
                        catch (Exception e) {
                            Log.e(TAG, "Error retrieving project", e);
                            return null;
                        }
                    }
                })
                .thenOnUiThread(new AsyncUtil.ResultHandler<ResearchProjectModel>() {
                    public void run(ResearchProjectModel model) {

                        mProgress.setVisibility(View.GONE);

                        if (model == null) {
                            //Let the user know something went wrong
                            DialogUtil
                                .makeGoBackDialog(
                                    EditProjectActivity.this,
                                    R.string.dialog_generic_error_title,
                                    R.string.dialog_generic_error_message,
                                    new Runnable() {
                                        public void run() {
                                            setResult(RESULT_CANCELED);
                                            finish();
                                        }
                                    }
                                )
                                .show();

                            return;
                        }

                        prepareView(model);
                    }
                })
                .execute();

            }
        });
    }

    private boolean validateForm() {
        boolean ok = true;

        String title = mTitleText.getText().toString();

        if (TextUtils.isEmpty(title)) {
            mTitleText.setError(getString(R.string.validation_error_required));
            ok = false;
        }

        return ok;
    }

    private void saveChangesAndFinish() {

        if (!validateForm()) {
            return;
        }

        ensureAuthenticated(new Runnable() {
            public void run() {

                mProgress.setVisibility(View.VISIBLE);
                mTitleText.setEnabled(false);

                AsyncUtil.onBackgroundThread(new AsyncUtil.BackgroundHandler<Boolean>() {
                    public Boolean run() {
                        try {

                            final ResearchDataSource data = mApp.getDataSource();
                            final ResearchProjectModel model = new ResearchProjectModel();

                            model.setTitle(mTitleText.getText().toString());

                            if (mProjectId == NEW_PROJECT_ID) {
                                data.createResearchProject(model);
                            }
                            else {
                                model.setId(mProjectId);
                                data.updateResearchProject(model);
                            }
                            return true;
                        }
                        catch (Exception e) {
                            Log.e(TAG, "Error saving project changes", e);
                            return false;
                        }
                    }
                })
                .thenOnUiThread(new AsyncUtil.ResultHandler<Boolean>() {
                    public void run(Boolean success) {

                        mProgress.setVisibility(View.GONE);
                        mTitleText.setEnabled(true);

                        if (!success) {
                            //Let the user know something went wrong
                            DialogUtil
                                .makeContinueDialog(
                                    EditProjectActivity.this,
                                    R.string.dialog_generic_error_title,
                                    R.string.dialog_generic_error_message
                                )
                                .show();

                            return;
                        }

                        int resourceId =
                            (mProjectId == NEW_PROJECT_ID)
                                ? R.string.activity_edit_project_created_message
                                : R.string.activity_edit_project_updated_message;

                        Toast.makeText(EditProjectActivity.this, resourceId, Toast.LENGTH_LONG).show();

                        setResult(RESULT_OK);
                        finish();
                    }
                })
                .execute();
            }
        });
    }

}
