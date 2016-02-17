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

import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;
import com.microsoft.services.graph.DriveItem;
import com.microsoft.services.graph.File;
import com.microsoft.services.graph.Folder;
import com.microsoft.services.graph.fetchers.GraphServiceClient;
import com.microsoft.services.orc.auth.AuthenticationCredentials;
import com.microsoft.services.orc.core.DependencyResolver;
import com.microsoft.services.orc.core.OrcList;
import com.microsoft.services.orc.http.Credentials;
import com.microsoft.services.orc.http.impl.OAuthCredentials;
import com.microsoft.services.orc.http.impl.OkHttpTransport;
import com.microsoft.services.orc.serialization.impl.GsonSerializer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.List;

public class MainActivity extends Activity {

    public static final String PARAM_ACCESS_TOKEN = "param_access_token";

    /**
     * The OAuth Access Token provided by LaunchActivity.
     */
    private String mAccessToken;

    private DependencyResolver mResolver;
    private GraphServiceClient graphServiceClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //Access token obtained by LaunchActivity using the Active Directory Authentication Library
        mAccessToken = getIntent().getStringExtra(PARAM_ACCESS_TOKEN);

        mResolver = new DependencyResolver.Builder(
                new OkHttpTransport(), new GsonSerializer(),
                new AuthenticationCredentials() {
                    @Override
                    public Credentials getCredentials() {
                        return new OAuthCredentials(mAccessToken);
                    }
                }).build();

        graphServiceClient = new GraphServiceClient("https://graph.microsoft.com/v1.0", mResolver);

        findViewById(R.id.retrieve_files_button).setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        startRetrieveFiles(null);
                    }
                }
        );

        findViewById(R.id.create_folder_button).setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        showCreateFolderDialog();
                    }
                }
        );

        findViewById(R.id.create_file_button).setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        showCreateFileDialog();
                    }
                }
        );
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

        ListenableFuture<OrcList<DriveItem>> itemsFuture;

        if (folder == null) {
            //Get the files in the root folder
            itemsFuture = graphServiceClient.getMe().getDrive()
                    .getRoot()
                    .getChildren()
                    .read();
        }
        else {
            //Get the files in this folder
            itemsFuture = graphServiceClient.getMe().getDrive()
                    .getItem(folder.getId())
                    .getChildren()
                    .read();
        }

        Futures.addCallback(itemsFuture, new FutureCallback<List<DriveItem>>() {
            @Override
            public void onSuccess(final List<DriveItem> result) {
                //Transform the results into a collection of strings
                final String[] items = new String[result.size()];
                for (int i = 0; i < result.size(); i++) {
                    DriveItem item = result.get(i);
                    items[i] = "(" + (item.getFolder() != null ? "Folder" : "File") + ") " + item.getName();
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
                                        DriveItem item = result.get(i);
                                        if (item.getFolder() == null) {
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
            public void onFailure(final Throwable t) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        progress.dismiss();
                        showErrorDialog(t);
                    }
                });
            }
        });

    }

    private void startDownloadFile(final DriveItem file) {
        //Show a "work-in-progress" dialog
        final ProgressDialog progress = ProgressDialog.show(
                this, "Working", "Retrieving File Contents"
        );

        //Get the contents of the file
        ListenableFuture<InputStream> resultFuture = graphServiceClient.getMe().getDrive()
                .getItem(file.getId())
                .getContent()
                .getStream();

        Futures.addCallback(resultFuture, new FutureCallback<InputStream>() {
            @Override
            public void onSuccess(final InputStream result) {

                //Try and parse this data as an image or plain text
                final View view = getFileView(result);

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

            @Override
            public void onFailure(final Throwable t) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        progress.dismiss();
                        showErrorDialog(t);
                    }
                });
            }
        });
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

    private void showCreateFolderDialog() {
        final EditText input = new EditText(this);

        //Prompt the user for a new folder name
        new AlertDialog.Builder(this)
                .setTitle("Create a Folder")
                .setMessage("Please enter a folder name")
                .setView(input)
                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        String newFolderName = input.getText().toString();
                        startCreateFolder(newFolderName);
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void startCreateFolder(String newFolderName) {
        //Show a "work-in-progress" dialog
        final ProgressDialog progress = ProgressDialog.show(
                this, "Working", "Creating Folder"
        );

        //Create a new folder entity
        DriveItem  item = new DriveItem();
        Folder folder = new Folder();
        item.setFolder(folder);
        item.setName(newFolderName);

        //Create the folder via the API
        ListenableFuture<DriveItem> newFolderFuture = graphServiceClient.getMe().getDrive()
                .getRoot()
                .getChildren()
                .add(item);

        Futures.addCallback(newFolderFuture, new FutureCallback<DriveItem>() {
            @Override
            public void onSuccess(final DriveItem result) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        progress.dismiss();
                        new AlertDialog.Builder(MainActivity.this)
                                .setTitle("Success")
                                .setMessage("Created folder " + result.getName())
                                .setPositiveButton("OK", null)
                                .show();
                    }
                });
            }

            @Override
            public void onFailure(final Throwable t) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        progress.dismiss();
                        showErrorDialog(t);
                    }
                });
            }
        });
    }

    private void showCreateFileDialog() {

        final EditText input = new EditText(this);

        //Prompt the user for a new folder name
        new AlertDialog.Builder(this)
                .setTitle("Create a File")
                .setMessage("Please enter a file name")
                .setView(input)
                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        String newFileName = input.getText().toString();
                        startCreateFile(newFileName);
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void startCreateFile(String newFileName) {

        //Show a "work-in-progress" dialog
        final ProgressDialog progress = ProgressDialog.show(
                this, "Working", "Creating File"
        );

        DriveItem item = new DriveItem();
        File file = new File();
        item.setFile(file);
        item.setName(newFileName);

        //Create the folder via the API
        ListenableFuture<DriveItem> newFileFuture = graphServiceClient.getMe().getDrive()
                .getRoot()
                .getChildren()
                .add(item);

        Futures.addCallback(newFileFuture, new FutureCallback<DriveItem>() {
            @Override
            public void onSuccess(final DriveItem result) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        progress.dismiss();
                        uploadFileContent(result);
                    }
                });
            }

            @Override
            public void onFailure(final Throwable t) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        progress.dismiss();
                        showErrorDialog(t);
                    }
                });
            }
        });
    }

    private void uploadFileContent(final DriveItem file) {

        //Show a "work-in-progress" dialog
        final ProgressDialog progress = ProgressDialog.show(
                this, "Working", "Uploading Data"
        );

        //Upload some file content
        String content = "This is some file content!";

        byte[] bytes = new byte[0];
        try {
            bytes = content.getBytes("UTF-8");
        }
        catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        //Upload the file content
        ListenableFuture<Void> future = graphServiceClient.getMe().getDrive()
                .getItem(file.getId())
                .getContent()
                .putContent(bytes);

        Futures.addCallback(future, new FutureCallback<Void>() {
            @Override
            public void onSuccess(final Void result) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                progress.dismiss();
                                new AlertDialog.Builder(MainActivity.this)
                                        .setTitle("Success")
                                        .setMessage("Created file " + file.getName())
                                        .setPositiveButton("OK", null)
                                        .show();
                            }
                        });
                    }
                });
            }

            @Override
            public void onFailure(final Throwable t) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        progress.dismiss();
                        showErrorDialog(t);
                    }
                });
            }
        });
    }
}
