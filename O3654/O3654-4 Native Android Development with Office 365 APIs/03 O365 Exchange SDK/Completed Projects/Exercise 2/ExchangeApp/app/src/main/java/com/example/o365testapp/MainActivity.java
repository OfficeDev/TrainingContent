package com.example.o365testapp;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;
import com.microsoft.services.graph.BodyType;
import com.microsoft.services.graph.EmailAddress;
import com.microsoft.services.graph.ItemBody;
import com.microsoft.services.graph.MailFolder;
import com.microsoft.services.graph.Message;
import com.microsoft.services.graph.Recipient;
import com.microsoft.services.graph.fetchers.GraphServiceClient;
import com.microsoft.services.graph.fetchers.MailFolderFetcher;
import com.microsoft.services.orc.auth.AuthenticationCredentials;
import com.microsoft.services.orc.core.DependencyResolver;
import com.microsoft.services.orc.core.OrcList;
import com.microsoft.services.orc.http.Credentials;
import com.microsoft.services.orc.http.impl.OAuthCredentials;
import com.microsoft.services.orc.http.impl.OkHttpTransport;
import com.microsoft.services.orc.serialization.impl.GsonSerializer;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

public class MainActivity extends Activity {

    public static final String PARAM_ACCESS_TOKEN = "param_access_token";

    private DependencyResolver mResolver;
    private GraphServiceClient graphServiceClient;

    /**
     * OAuth Access Token provided by LaunchActivity.
     */
    private String mAccessToken;

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

        findViewById(R.id.retrieve_inbox_button).setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        startRetrieveInbox();
                    }
                }
        );

        findViewById(R.id.retrieve_folders_button).setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        startRetrieveFolders();
                    }
                }
        );

        findViewById(R.id.send_message_button).setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        startSendMessage();
                    }
                }
        );

        findViewById(R.id.create_folder_button).setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        promptUserForFolderName();
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

    private void startRetrieveInbox() {

        //Show a "work-in-progress" dialog
        final ProgressDialog progress = ProgressDialog.show(
                this, "Working", "Retrieving Inbox"
        );

        //Get a reference to the users Inbox
        MailFolderFetcher inboxFetcher = graphServiceClient.getMe()
                .getMailFolders()
                .getById("Inbox");

        //Retrieve the messages from the inbox
        //Get a timestamp for today at midnight
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        //Create a filter string
        DateFormat iso8601 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        iso8601.setTimeZone(TimeZone.getTimeZone("UTC"));
        String odataFilter = String.format(
                "receivedDateTime gt %s",
                iso8601.format(calendar.getTime())
        );

        // Retrieve the first page of 10 results
        int pageSize = 10, pageIndex = 0;

        //Retrieve the messages in the inbox
        final ListenableFuture<OrcList<Message>> messagesFuture =
                inboxFetcher.getMessages()
                        .top(pageSize)
                        .skip(pageSize * pageIndex)
                        .read();

        //Attach a callback to handle the eventual result
        Futures.addCallback(messagesFuture,new FutureCallback<List<Message>>() {
            @Override
            public void onSuccess(List<Message> result) {
                //Transform the results into a collection of strings
                final String[] items = new String[result.size()];
                for (int i = 0; i < result.size(); i++) {
                    items[i] = result.get(i).getSubject();
                }
                //Launch a dialog to show the results to the user
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        progress.dismiss();
                        new AlertDialog.Builder(MainActivity.this)
                                .setTitle("Inbox")
                                .setPositiveButton("OK", null)
                                .setItems(items, null)
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

    private void startRetrieveFolders() {

        //Show a "work-in-progress" dialog
        final ProgressDialog progress = ProgressDialog.show(
                this, "Working", "Retrieving Folders"
        );

        //Retrieve the top-level folders which have child folders
        int pageSize = 10, pageIndex = 0;

        //Retrieve the top-level folders
        ListenableFuture<OrcList<MailFolder>> foldersFuture =
                graphServiceClient.getMe()
                        .getMailFolders()
                        .filter("ChildFolderCount gt 0")
                        .top(pageSize)
                        .skip(pageSize * pageIndex)
                        .read();

        //Attach a callback to handle the eventual result
        Futures.addCallback(foldersFuture,new FutureCallback<List<MailFolder>>() {
            @Override
            public void onSuccess(List<MailFolder> result) {
                //Transform the results into a collection of strings
                final String[] items = new String[result.size()];
                for (int i = 0; i < result.size(); i++) {
                    items[i] = result.get(i).getDisplayName();
                }
                //Launch a dialog to show the results to the user
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        progress.dismiss();
                        new AlertDialog.Builder(MainActivity.this)
                                .setTitle("Folders")
                                .setPositiveButton("OK", null)
                                .setItems(items, null)
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

    private void startSendMessage() {

        //Show a "work-in-progress" dialog
        final ProgressDialog progress = ProgressDialog.show(
                this, "Working", "Sending a Message"
        );

        //Create an example message
        ItemBody body = new ItemBody();
        body.setContentType(BodyType.text);
        body.setContent("This is a message body");

        EmailAddress recipientAddress = new EmailAddress();
        recipientAddress.setAddress(PLACEHOLDER_ADDRESS);
        recipientAddress.setName(PLACEHOLDER_NAME);

        Recipient recipient = new Recipient();
        recipient.setEmailAddress(recipientAddress);

        Message message = new Message();
        message.setToRecipients(Arrays.asList(recipient));
        message.setSubject("This is a test message");
        message.setBody(body);

        //Send the message through the API
        boolean saveToSentItems = true;
        ListenableFuture future =
                graphServiceClient.getMe()
                        .getOperations()
                        .sendMail(message, saveToSentItems);

        Futures.addCallback(future, new FutureCallback() {
            @Override
            public void onSuccess(Object result) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        progress.dismiss();
                        new AlertDialog.Builder(MainActivity.this)
                                .setTitle("Success")
                                .setMessage("The message was sent")
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

    private void promptUserForFolderName() {

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

        MailFolder newFolder = new MailFolder();
        newFolder.setDisplayName(newFolderName);

        //Create the folder via the API
        ListenableFuture<MailFolder> newFolderFuture =
                graphServiceClient.getMe()
                        .getMailFolders()
                        .getById("Inbox")
                        .getChildFolders()
                        .add(newFolder);

        Futures.addCallback(newFolderFuture, new FutureCallback<MailFolder>() {
            @Override
            public void onSuccess(final MailFolder result) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        progress.dismiss();
                        new AlertDialog.Builder(MainActivity.this)
                                .setTitle("Success")
                                .setMessage("Created folder " + result.getDisplayName())
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
}
