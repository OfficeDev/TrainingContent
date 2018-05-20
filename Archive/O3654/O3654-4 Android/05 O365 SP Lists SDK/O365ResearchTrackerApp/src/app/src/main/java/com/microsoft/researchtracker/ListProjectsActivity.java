package com.microsoft.researchtracker;

import android.app.Activity;
import android.content.ComponentName;
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
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.microsoft.researchtracker.sharepoint.models.ResearchProjectModel;
import com.microsoft.researchtracker.sharepoint.models.UserDetailModel;
import com.microsoft.researchtracker.utils.AsyncUtil;
import com.microsoft.researchtracker.utils.AuthUtil;
import com.microsoft.researchtracker.utils.ProjectUtils;
import com.microsoft.researchtracker.utils.ViewUtil;
import com.microsoft.researchtracker.utils.auth.DefaultAuthHandler;

import java.text.DateFormat;
import java.util.Collections;
import java.util.List;

public class ListProjectsActivity extends Activity {

    private static final String TAG = "ListProjectsActivity";

    private App mApp;

    private ListView mListView;
    private ProgressBar mProgress;

    private ProjectsListAdapter mAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list_projects);

        mApp = (App) getApplication();

        mListView = (ListView) findViewById(R.id.list_view);
        mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                ResearchProjectModel project = (ResearchProjectModel) mAdapter.getItem(position);

                //Launch the "View Project" activity
                final Intent intent = new Intent(ListProjectsActivity.this, ViewProjectActivity.class);
                intent.putExtra(ViewProjectActivity.PARAM_PROJECT_ID, project.getId());

                startActivity(intent);
            }
        });

        mProgress = (ProgressBar) findViewById(R.id.progress);
    }

    @Override
    protected void onStart() {
        super.onStart();

        startRefresh();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.list_projects, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_new) {
            handleActionNew();
            return true;
        }
        if (id == R.id.action_refresh) {
            startRefresh();
            return true;
        }
        if (id == R.id.action_sign_out) {
            handleActionSignOut();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void handleActionSignOut() {

        mApp.getAuthManager().clearAuthTokenAndCachedCredentials();

        //user has confirmed - restart the app
        final Intent intent = Intent.makeRestartActivityTask(new ComponentName(this, LoginActivity.class));
        intent.putExtra(LoginActivity.PARAM_AUTH_IMMEDIATE, false);

        startActivity(intent);
    }

    private void handleActionNew() {

        //Launch the "Edit Project" activity in "new" mode
        final Intent intent = new Intent(this, EditProjectActivity.class);
        intent.putExtra(EditProjectActivity.PARAM_NEW_PROJECT_MODE, true);

        startActivity(intent);
    }

    private void startRefresh() {
        ensureAuthenticated(new Runnable() {
            public void run() {
                mListView.setEnabled(false);
                mProgress.setVisibility(View.VISIBLE);

                AsyncUtil.onBackgroundThread(new AsyncUtil.BackgroundHandler<List<ResearchProjectModel>>() {
                    public List<ResearchProjectModel> run() {
                        try {
                            return mApp.getDataSource().getResearchProjects();
                        }
                        catch (Exception e) {
                            Log.e(TAG, "Error retrieving projects", e);

                            return null;
                        }
                    }
                })
                .thenOnUiThread(new AsyncUtil.ResultHandler<List<ResearchProjectModel>>() {

                    public void run(List<ResearchProjectModel> result) {
                        mListView.setEnabled(true);
                        mProgress.setVisibility(View.GONE);

                        if (result == null) {
                            result = Collections.emptyList();
                            Toast.makeText(ListProjectsActivity.this, R.string.activity_list_projects_error_loading_projects, Toast.LENGTH_LONG).show();
                        }

                        mAdapter = new ProjectsListAdapter(result);
                        mListView.setAdapter(mAdapter);
                    }
                })
                .execute();
            }
        });
    }

    private void ensureAuthenticated(final Runnable r) {
        AuthUtil.ensureAuthenticated(this, new DefaultAuthHandler(this) {
            @Override public void onSuccess() {
                r.run();
            }
        });
    }

    private class ProjectsListAdapter extends BaseAdapter {

        private final List<ResearchProjectModel> mItems;
        private final LayoutInflater mInflater;
        private final DateFormat mFormat;
        private final String mModifiedFormat;

        public ProjectsListAdapter(List<ResearchProjectModel> folderList) {

            mItems = folderList;
            mInflater = getLayoutInflater();
            mFormat = android.text.format.DateFormat.getDateFormat(ListProjectsActivity.this);
            mModifiedFormat = getString(R.string.format_last_modifed);
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

            View view = ViewUtil.prepareView(mInflater, R.layout.project_list_item, convertView, parent);

            TextView letterIcon = (TextView) ViewUtil.findChildView(view, R.id.letter_icon);
            TextView text1 = (TextView) ViewUtil.findChildView(view, R.id.title_label);
            TextView text2 = (TextView) ViewUtil.findChildView(view, R.id.modified_label);

            ResearchProjectModel project = mItems.get(position);
            UserDetailModel editor = project.getEditor();

            String projectTitle = project.getTitle();
            String editorTitle = String.format(mModifiedFormat, editor.getDisplayName(), mFormat.format(project.getModified()) );

            //Find the character to use for the "letter" icon
            String letter = projectTitle == null ? "" : projectTitle.substring(0, 1);
            int color = ProjectUtils.getProjectColor(project);

            letterIcon.setText(letter);
            letterIcon.setBackgroundColor(color);
            text1.setText(projectTitle);
            text2.setText(editorTitle);

            return view;
        }
    }
}
