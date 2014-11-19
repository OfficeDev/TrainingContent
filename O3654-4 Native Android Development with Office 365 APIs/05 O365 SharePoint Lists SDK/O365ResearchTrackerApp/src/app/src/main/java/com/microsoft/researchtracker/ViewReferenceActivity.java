package com.microsoft.researchtracker;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.NavUtils;
import android.support.v4.app.TaskStackBuilder;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.method.LinkMovementMethod;
import android.text.style.URLSpan;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.microsoft.researchtracker.sharepoint.data.ResearchDataSource;
import com.microsoft.researchtracker.sharepoint.models.ResearchReferenceModel;
import com.microsoft.researchtracker.sharepoint.models.UrlModel;
import com.microsoft.researchtracker.utils.AsyncUtil;
import com.microsoft.researchtracker.utils.AuthUtil;
import com.microsoft.researchtracker.utils.DialogUtil;
import com.microsoft.researchtracker.utils.auth.DefaultAuthHandler;

public class ViewReferenceActivity extends Activity {

    private static final String TAG = "ViewReferenceActivity";

    private static final int REQUEST_UPDATE_REFERENCE = 1;

    public static final String PARAM_REFERENCE_ID = "reference_id";

    public static final int RESULT_DELETED = 101;
    public static final int RESULT_UPDATED = 102;

    private App mApp;

    private TextView mTitleLabel;
    private TextView mUrlLabel;
    private ImageView mUrlIcon;
    private TextView mDescriptionLabel;
    private ProgressBar mProgress;

    private int mReferenceId;
    private int mReferenceProjectId;

    private boolean mLoaded;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_reference);

        mApp = (App) getApplication();

        mUrlLabel = (TextView) findViewById(R.id.url_label);
        mUrlLabel.setText("");
        mUrlLabel.setMovementMethod(LinkMovementMethod.getInstance());

        mUrlIcon = (ImageView) findViewById(R.id.url_image);
        mUrlIcon.setVisibility(View.GONE);

        mTitleLabel = (TextView) findViewById(R.id.title_label);
        mTitleLabel.setText("");

        mDescriptionLabel = (TextView) findViewById(R.id.description_label);
        mDescriptionLabel.setText("");

        mProgress = (ProgressBar) findViewById(R.id.progress);

        mReferenceId = getIntent().getIntExtra(PARAM_REFERENCE_ID, -1);

        mLoaded = false;
    }

    @Override
    protected void onStart() {
        super.onStart();

        if (!mLoaded) {
            mLoaded = true;
            startRefresh();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.view_reference, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == android.R.id.home) {
            handleActionNavigateUp();
            return true;
        }
        if (id == R.id.action_edit) {
            handleActionEdit(item);
            return true;
        }
        if (id == R.id.action_delete) {
            launchConfirmDeleteDialog();
            return true;
        }
        if (id == R.id.action_refresh) {
            startRefresh();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQUEST_UPDATE_REFERENCE && resultCode == RESULT_OK) {
            setResult(RESULT_UPDATED);
            startRefresh();
        }
    }

    private void ensureAuthenticated(final Runnable r) {
        AuthUtil.ensureAuthenticated(this, new DefaultAuthHandler(this) {
            @Override public void onSuccess() {
                r.run();
            }
        });
    }

    private void handleActionNavigateUp() {
        Intent upIntent = new Intent(this, ViewProjectActivity.class);
        upIntent.putExtra(ViewProjectActivity.PARAM_PROJECT_ID, mReferenceProjectId);
        if (NavUtils.shouldUpRecreateTask(this, upIntent)) {
            // This activity is not part of the application's task, so
            // create a new task
            // with a synthesized back stack.
            TaskStackBuilder
                    .create(this)
                    .addNextIntent(new Intent(this, ListProjectsActivity.class))
                    .addNextIntent(upIntent)
                    .startActivities();
            finish();
        } else {
            // This activity is part of the application's task, so simply
            // navigate up to the hierarchical parent activity.
            NavUtils.navigateUpTo(this, upIntent);
        }
    }

    private void startRefresh() {

        ensureAuthenticated(new Runnable() {
            public void run() {

                mProgress.setVisibility(View.VISIBLE);

                AsyncUtil.onBackgroundThread(new AsyncUtil.BackgroundHandler<ResearchReferenceModel>() {
                    public ResearchReferenceModel run() {
                        try {
                            ResearchDataSource data = mApp.getDataSource();

                            return data.getResearchReferenceById(mReferenceId);
                        }
                        catch (Exception e) {
                            Log.e(TAG, "Error retrieving reference", e);

                            return null;
                        }
                    }
                })
                .thenOnUiThread(new AsyncUtil.ResultHandler<ResearchReferenceModel>() {

                    public void run(ResearchReferenceModel result) {

                        mProgress.setVisibility(View.GONE);

                        if (result == null) {

                            //Something went wrong - let the user know
                            DialogUtil
                                .makeGoBackDialog(
                                    ViewReferenceActivity.this,
                                    R.string.dialog_generic_error_message,
                                    R.string.activity_view_reference_error_loading_reference,
                                    new Runnable() {
                                        public void run() {
                                            setResult(Activity.RESULT_CANCELED);
                                            finish();
                                        }
                                    }
                                )
                                .show();

                            return;
                        }

                        mReferenceProjectId = result.getProjectId();

                        UrlModel url = result.getURL();

                        mTitleLabel.setText(url.getTitle());
                        mUrlLabel.setText(makeLinkText(url.getUrl()));
                        mUrlIcon.setVisibility(View.VISIBLE);
                        mDescriptionLabel.setText(result.getDescription());
                    }
                })
                .execute();

            }
        });

    }

    private Spanned makeLinkText(String url) {
        SpannableString text = new SpannableString(url);
        URLSpan link = new URLSpan(url);
        text.setSpan(link, 0, url.length(), 0);
        return text;
    }

    private void launchConfirmDeleteDialog() {
        new AlertDialog.Builder(this)
                .setTitle(R.string.dialog_confirm_delete_reference_title)
                .setMessage(R.string.dialog_confirm_delete_reference_message)
                .setNegativeButton(R.string.label_cancel, null)
                .setPositiveButton(R.string.label_delete, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        deleteReferenceAndFinish();
                    }
                })
                .create()
                .show();
    }

    private void deleteReferenceAndFinish() {

        ensureAuthenticated(new Runnable() {
            public void run() {

                mProgress.setVisibility(View.VISIBLE);

                AsyncUtil.onBackgroundThread(new AsyncUtil.BackgroundHandler<Boolean>() {
                    public Boolean run() {
                        try {

                            mApp.getDataSource().deleteResearchReference(mReferenceId);
                            return true;
                        }
                        catch (Exception e) {
                            Log.e(TAG, "Error deleting project", e);
                            return false;
                        }
                    }
                })
                .thenOnUiThread(new AsyncUtil.ResultHandler<Boolean>() {
                    public void run(Boolean success) {

                        mProgress.setVisibility(View.GONE);

                        if (!success) {
                            //Something went wrong - let the user know
                            DialogUtil
                                .makeContinueDialog(
                                    ViewReferenceActivity.this,
                                    R.string.dialog_generic_error_title,
                                    R.string.dialog_generic_error_message
                                )
                                .show();

                            return;
                        }

                        Toast.makeText(ViewReferenceActivity.this, R.string.activity_edit_reference_deleted_message, Toast.LENGTH_LONG).show();
                        setResult(RESULT_DELETED);
                        finish();
                    }
                })
                .execute();

            }
        });

    }

    private void handleActionEdit(MenuItem item) {

        //Launch the "Edit Reference" activity
        final Intent intent = new Intent(this, EditReferenceActivity.class);
        intent.putExtra(EditReferenceActivity.PARAM_REFERENCE_ID, mReferenceId);

        startActivityForResult(intent, REQUEST_UPDATE_REFERENCE);
    }
}
