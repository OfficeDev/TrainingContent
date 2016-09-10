package com.example.o365testapp;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.List;

import com.microsoft.graph.concurrency.ICallback;
import com.microsoft.graph.extensions.DriveItem;
import com.microsoft.graph.extensions.File;
import com.microsoft.graph.extensions.Folder;
import com.microsoft.graph.extensions.GraphServiceClient;;
import com.microsoft.graph.extensions.IDriveItemCollectionPage;
import com.microsoft.graph.extensions.IDriveItemCollectionRequest;
import com.microsoft.graph.extensions.IGraphServiceClient;
import com.microsoft.graph.core.ClientException;
import com.microsoft.graph.core.IClientConfig;
import com.microsoft.graph.core.DefaultClientConfig;
import com.microsoft.graph.authentication.MSAAuthAndroidAdapter;
import com.microsoft.graph.authentication.IAuthenticationAdapter;
import com.microsoft.graph.http.IHttpRequest;
import com.microsoft.graph.options.HeaderOption;

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

        findViewById(R.id.retrieve_files_button).setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        startRetrieveFiles(null);
                    }
                }
        );

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
                        "https://graph.microsoft.com/File.ReadWrite",
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

    private class ErrorHandler implements Runnable {
        private ProgressDialog progress;
        private Throwable throwable;
        ErrorHandler(ProgressDialog progress, Throwable throwable) {
            this.progress = progress;
            this.throwable = throwable;
        }
        public void run() {
            progress.dismiss();
            showErrorDialog(throwable);
        }
    }

    private void showErrorDialog(Throwable t) {
        new AlertDialog.Builder(this)
                .setTitle("Whoops!")
                .setMessage(t.toString())
                .setPositiveButton("OK", null)
                .show();
    }

    private void startRetrieveFiles(final DriveItem folder) {

        //Show a "work-in-progress" dialog
        final ProgressDialog progress = ProgressDialog.show(
                this, "Working", "Retrieving Files"
        );

        IDriveItemCollectionRequest itemsRequest = null;
        if (folder == null) {
            //Get the files in the root folder
            itemsRequest = graphServiceClient.
                    getMe().
                    getDrive().
                    getRoot().
                    getChildren().
                    buildRequest();
        }
        else {
            //Get the files in this folder
            itemsRequest = graphServiceClient.
                    getMe().
                    getDrive().
                    getItems(folder.id).
                    getChildren().
                    buildRequest();
        }

        itemsRequest.get(new ICallback<IDriveItemCollectionPage>() {
            @Override
            public void success(IDriveItemCollectionPage driveItemsPage) {
                final List<DriveItem> driveItems = driveItemsPage.getCurrentPage();
                //Transform the results into a collection of strings
                final String[] items = new String[driveItems.size()];
                for (int i = 0; i < driveItems.size(); i++) {
                    DriveItem item = driveItems.get(i);
                    items[i] = "(" + (item.folder != null ? "Folder" : "File") + ") " + item.name;
                }
                //Launch a dialog to show the results to the user
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        progress.dismiss();
                        new AlertDialog.Builder(MainActivity.this)
                                .setTitle("Files")
                                .setItems(items, new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialogInterface, int i) {
                                        //The user picked a file - figure out if it is a file or folder
                                        DriveItem item = driveItems.get(i);
                                        if (item.folder == null) {
                                            //download the file contents
                                            startDownloadFile(item);
                                        } else {
                                            //download the child files
                                            startRetrieveFiles(item);
                                        }
                                    }
                                })
                                .setPositiveButton("OK", null)
                                .show();
                    }
                });
            }

            @Override
            public void failure(ClientException ex) {
                runOnUiThread(new ErrorHandler(progress, ex));
            }
        });
    }

    private void startDownloadFile(final DriveItem file) {
        //Show a "work-in-progress" dialog
        final ProgressDialog progress = ProgressDialog.show(
                this, "Working", "Retrieving File Contents"
        );
        new Thread() {
            @Override
            public void run() {
                try {
                    //Get the contents of the file
                    InputStream stream = graphServiceClient.
                            getMe().
                            getDrive().
                            getItems(file.id).
                            getContent().
                            buildRequest().
                            get();
                    final View view = getFileView(stream);

                    //Launch a dialog to show the results to the user
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            progress.dismiss();
                            new AlertDialog.Builder(MainActivity.this)
                                    .setTitle("File Contents")
                                    .setView(view)
                                    .setPositiveButton("OK", null)
                                    .show();
                        }
                    });
                }
                catch (final Throwable t){
                    runOnUiThread(new ErrorHandler(progress, t));
                }
            }}.start();
    }

    private View getFileView(InputStream result) {
        Bitmap bitmap = BitmapFactory.decodeStream(result);

        if (bitmap != null) {
            ImageView imageView = new ImageView(this);
            imageView.setImageBitmap(bitmap);
            return imageView;
        }

        String utf8String = null;
        try {
            utf8String = getStringFromInputStream(result);
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        TextView textView = new TextView(this);
        textView.setText(utf8String);

        return textView;
    }

    private static String getStringFromInputStream(InputStream is) {
        BufferedReader br = null;
        StringBuilder sb = new StringBuilder();

        String line;
        try {

            br = new BufferedReader(new InputStreamReader(is));
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return sb.toString();

    }
}
