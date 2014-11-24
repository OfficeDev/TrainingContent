package com.microsoft.researchtracker;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.microsoft.researchtracker.sharepoint.data.ResearchDataSource;
import com.microsoft.researchtracker.sharepoint.models.ResearchProjectModel;
import com.microsoft.researchtracker.sharepoint.models.ResearchReferenceModel;
import com.microsoft.researchtracker.utils.AsyncUtil;
import com.microsoft.researchtracker.utils.AuthUtil;
import com.microsoft.researchtracker.utils.DialogUtil;
import com.microsoft.researchtracker.utils.ProjectUtils;
import com.microsoft.researchtracker.utils.ViewUtil;
import com.microsoft.researchtracker.utils.auth.DefaultAuthHandler;

import java.text.DateFormat;
import java.util.Collections;
import java.util.List;

public class ViewProjectActivity extends Activity {

    private static final String TAG = "ViewProjectActivity";

    private static final int REQUEST_EDIT_PROJECT = 1;
    private static final int REQUEST_CREATE_REFERENCE = 2;
    private static final int REQUEST_VIEW_REFERENCE = 3;

    public static final String PARAM_PROJECT_ID = "project_id";

    private App mApp;

    private TextView mIconLabel;
    private TextView mTitleLabel;
    private TextView mModifiedLabel;
    private ListView mListView;
    private ProgressBar mProgress;

    private ListAdapter mAdapter;

    private int mProjectId;

    private boolean mLoaded;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_project);

        mApp = (App) getApplication();

        mIconLabel = (TextView) findViewById(R.id.letter_icon);
        mIconLabel.setVisibility(View.INVISIBLE);

        mTitleLabel = (TextView) findViewById(R.id.title_label);
        mTitleLabel.setVisibility(View.INVISIBLE);

        mModifiedLabel = (TextView) findViewById(R.id.modified_label);
        mModifiedLabel.setVisibility(View.INVISIBLE);

        mListView = (ListView) findViewById(R.id.list_view);
        mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                ResearchReferenceModel reference = (ResearchReferenceModel) mAdapter.getItem(position);

                //Launch the "View Project" activity
                final Intent intent = new Intent(ViewProjectActivity.this, ViewReferenceActivity.class);
                intent.putExtra(ViewReferenceActivity.PARAM_REFERENCE_ID, reference.getId());

                startActivityForResult(intent, REQUEST_VIEW_REFERENCE);
            }
        });

        mProgress = (ProgressBar) findViewById(R.id.progress);

        mProjectId = getIntent().getIntExtra(PARAM_PROJECT_ID, -1);

        mLoaded = false;
    }

    @Override
    protected void onStart() {
        super.onStart();

        if (!mLoaded) {
            startRefresh();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.view_project, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_edit) {
            handleActionEdit(item);
            return true;
        }
        if (id == R.id.action_new) {
            handleActionNew(item);
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

        if ((requestCode == REQUEST_VIEW_REFERENCE   && (resultCode == ViewReferenceActivity.RESULT_DELETED || resultCode == ViewReferenceActivity.RESULT_UPDATED)) ||
            (requestCode == REQUEST_CREATE_REFERENCE && resultCode == RESULT_OK) ||
            (requestCode == REQUEST_EDIT_PROJECT     && resultCode == RESULT_OK)) {
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

    private void startRefresh() {
        mLoaded = true;

        ensureAuthenticated(new Runnable() {

            //A temporary class for use within this refresh function
            class ViewModel {

                public final ResearchProjectModel project;
                public final List<ResearchReferenceModel> references;

                public ViewModel(ResearchProjectModel project, List<ResearchReferenceModel> references) {

                    this.project = project;
                    this.references = references;
                }
            }

            public void run() {
                mListView.setEnabled(false);
                mProgress.setVisibility(View.VISIBLE);

                AsyncUtil.onBackgroundThread(new AsyncUtil.BackgroundHandler<ViewModel>() {
                    public ViewModel run() {
                        try {
                            ResearchDataSource repository = mApp.getDataSource();

                            ResearchProjectModel project = repository.getResearchProjectById(mProjectId);

                            if (project == null) {
                                return null;
                            }

                            List<ResearchReferenceModel> items = repository.getResearchReferencesByProjectId(mProjectId);

                            if (items == null) {
                                items = Collections.emptyList();
                            }

                            return new ViewModel(project, items);
                        }
                        catch (Exception e) {
                            Log.e(TAG, "Error retrieving project", e);

                            return null;
                        }
                    }
                })
                .thenOnUiThread(new AsyncUtil.ResultHandler<ViewModel>() {

                    public void run(ViewModel result) {

                        mListView.setEnabled(true);
                        mProgress.setVisibility(View.GONE);

                        if (result == null) {

                            //let the user know something went wrong
                            DialogUtil
                                .makeGoBackDialog(
                                    ViewProjectActivity.this,
                                    R.string.dialog_generic_error_message,
                                    R.string.activity_view_project_error_loading_project,
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

                        String title = result.project.getTitle();
                        String letter = title == null || title.length() == 0 ? "" : title.substring(0, 1);
                        int color = ProjectUtils.getProjectColor(result.project);

                        DateFormat format = android.text.format.DateFormat.getDateFormat(ViewProjectActivity.this);

                        mIconLabel.setText(letter);
                        mIconLabel.setVisibility(View.VISIBLE);
                        mIconLabel.setBackgroundColor(color);

                        mTitleLabel.setText(title);
                        mTitleLabel.setVisibility(View.VISIBLE);

                        String editorName = result.project.getEditor().getDisplayName();
                        String dateString = format.format(result.project.getModified());

                        mModifiedLabel.setText(getString(R.string.format_last_modifed, editorName, dateString));
                        mModifiedLabel.setVisibility(View.VISIBLE);

                        mAdapter = new ReferencesListAdapter(result.references);
                        mListView.setAdapter(mAdapter);
                    }
                })
                .execute();
            }
        });
    }

    private void handleActionEdit(MenuItem item) {

        //Launch the "Edit Project" activity
        final Intent intent = new Intent(this, EditProjectActivity.class);
        intent.putExtra(EditProjectActivity.PARAM_PROJECT_ID, mProjectId);

        startActivityForResult(intent, REQUEST_EDIT_PROJECT);
    }

    private void handleActionNew(MenuItem item) {

        //Launch the "Edit Reference" activity in "new" mode
        final Intent intent = new Intent(this, EditReferenceActivity.class);
        intent.putExtra(EditReferenceActivity.PARAM_NEW_REFERENCE_MODE, true);
        intent.putExtra(EditReferenceActivity.PARAM_PROJECT_ID, mProjectId);

        startActivityForResult(intent, REQUEST_CREATE_REFERENCE);
    }

    private void launchConfirmDeleteDialog() {

        new AlertDialog.Builder(this)
                .setTitle(R.string.dialog_confirm_delete_project_title)
                .setMessage(R.string.dialog_confirm_delete_project_message)
                .setNegativeButton(R.string.label_cancel, null)
                .setPositiveButton(R.string.label_delete, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        deleteProjectAndFinish();
                    }
                })
                .create()
                .show();

    }

    private void deleteProjectAndFinish() {

        ensureAuthenticated(new Runnable() {
            public void run() {

                mProgress.setVisibility(View.VISIBLE);

                AsyncUtil.onBackgroundThread(new AsyncUtil.BackgroundHandler<Boolean>() {
                    public Boolean run() {
                        try {

                            mApp.getDataSource().deleteResearchProject(mProjectId);
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

                            //Let the user know something went wrong
                            DialogUtil
                                .makeContinueDialog(
                                        ViewProjectActivity.this,
                                        R.string.dialog_generic_error_title,
                                        R.string.dialog_generic_error_message
                                )
                                .show();

                            return;
                        }

                        Toast.makeText(ViewProjectActivity.this, R.string.activity_edit_project_deleted_message, Toast.LENGTH_LONG).show();
                        finish();
                    }
                })
                .execute();
            }
        });
    }

    private class ReferencesListAdapter extends BaseAdapter {

        private LayoutInflater mViewInflater;

        private List<ResearchReferenceModel> mItems;

        public ReferencesListAdapter(List<ResearchReferenceModel> result) {
            mViewInflater = getLayoutInflater();
            mItems = result;
        }

        @Override
        public int getCount() {
            return mItems.size();
        }

        @Override
        public Object getItem(int position) {
            return mItems.get(position);
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {

            View view = ViewUtil.prepareView(mViewInflater, R.layout.simple_list_item_2, convertView, null);

            TextView text1 = (TextView) ViewUtil.findChildView(view, R.id.text1);
            TextView text2 = (TextView) ViewUtil.findChildView(view, R.id.text2);

            ResearchReferenceModel item = mItems.get(position);

            text1.setText(item.getURL().getTitle());
            text2.setText(item.getDescription());

            return view;
        }
    }

}
