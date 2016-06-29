package com.example.o365testapp;

import android.os.Bundle;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.view.View;
import android.widget.EditText;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.TimeZone;
import java.util.List;

import com.microsoft.graph.core.ClientException;
import com.microsoft.graph.core.IClientConfig;
import com.microsoft.graph.core.DefaultClientConfig;
import com.microsoft.graph.extensions.BodyType;
import com.microsoft.graph.extensions.EmailAddress;
import com.microsoft.graph.extensions.IMailFolderRequestBuilder;
import com.microsoft.graph.extensions.IMessageCollectionRequest;
import com.microsoft.graph.extensions.IMessageCollectionRequestBuilder;
import com.microsoft.graph.extensions.ItemBody;
import com.microsoft.graph.extensions.MailFolder;
import com.microsoft.graph.extensions.Message;
import com.microsoft.graph.extensions.Recipient;
import com.microsoft.graph.extensions.MailFolder;
import com.microsoft.graph.extensions.IMailFolderCollectionPage;
import com.microsoft.graph.extensions.IMailFolderCollectionRequest;
import com.microsoft.graph.extensions.GraphServiceClient;
import com.microsoft.graph.extensions.IGraphServiceClient;
import com.microsoft.graph.extensions.IMessageCollectionPage;
import com.microsoft.graph.authentication.IAuthenticationAdapter;
import com.microsoft.graph.authentication.MSAAuthAndroidAdapter;
import com.microsoft.graph.extensions.User;
import com.microsoft.graph.http.IHttpRequest;
import com.microsoft.graph.concurrency.ICallback;
import com.microsoft.graph.options.Option;
import com.microsoft.graph.options.HeaderOption;
import com.microsoft.graph.options.QueryOption;

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
                        "https://graph.microsoft.com/Mail.ReadWrite",
                        "https://graph.microsoft.com/Mail.Send",
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

    /*

        TODO: put lab code here

     */

    private class ErrorHandler implements Runnable {
        private ProgressDialog progress;
        private ClientException exception;
        ErrorHandler(ProgressDialog progress, ClientException exception) {
            this.progress = progress;
            this.exception = exception;
        }
        public void run() {
            progress.dismiss();
            showErrorDialog(exception);
        }
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

        graphServiceClient.
                getMe().
                getMailFolders().
                buildRequest(Arrays.asList(new Option[]{new QueryOption("$filter", "displayName eq 'Inbox'")})).
                get(new ICallback<IMailFolderCollectionPage>() {
                        @Override
                        public void success(IMailFolderCollectionPage foldersPage) {
                            List< MailFolder > mailFolders = foldersPage.getCurrentPage();
                            if (mailFolders.size() == 1){
                                //Get a reference to Inbox
                                String inboxId = mailFolders.get(0).id;
                                IMailFolderRequestBuilder mailFolderRequestBuilder = graphServiceClient.
                                        getMe().
                                        getMailFolders(inboxId);
                                //Get a timestamp for today at midnight
                                Calendar calendar = Calendar.getInstance();
                                calendar.set(Calendar.HOUR_OF_DAY, 0);
                                calendar.set(Calendar.MINUTE, 0);
                                calendar.set(Calendar.SECOND, 0);
                                calendar.set(Calendar.MILLISECOND, 0);

                                //Create a filter string
                                DateFormat iso8601 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
                                iso8601.setTimeZone(TimeZone.getTimeZone("UTC"));
                                String receivedDateFilter = String.format(
                                        "receivedDateTime gt %s",
                                        iso8601.format(calendar.getTime())
                                );

                                // Get messages from Inbox
                                IMessageCollectionRequest messagesRequest = mailFolderRequestBuilder.
                                        getMessages().
                                        buildRequest(Arrays.asList(new Option[]{new QueryOption("$filter", receivedDateFilter)}));
                                messagesRequest.get(new ICallback<IMessageCollectionPage>() {
                                    @Override
                                    public void success(IMessageCollectionPage messagesPage) {
                                        List<Message> messages = messagesPage.getCurrentPage();
                                        final String[] items = new String[messages.size()];
                                        for (int i = 0; i < messages.size(); i++) {
                                            items[i] = messages.get(i).subject;
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
                                    public void failure(final ClientException ex) {
                                        runOnUiThread(new ErrorHandler(progress, ex));
                                    }
                                });
                            }
                        }

                        @Override
                        public void failure(ClientException ex) {
                            runOnUiThread(new ErrorHandler(progress, ex));
                        }
                    });
    }

    private void startRetrieveFolders() {

        //Show a "work-in-progress" dialog
        final ProgressDialog progress = ProgressDialog.show(
                this, "Working", "Retrieving Folders"
        );

        //Retrieve the top-level folders
        graphServiceClient.getMe().
                getMailFolders().
                buildRequest().
                get(new ICallback<IMailFolderCollectionPage>() {
                    @Override
                    public void success(IMailFolderCollectionPage mailFoldersPage) {
                        //Transform the results into a collection of strings
                        List<MailFolder> mailFolders = mailFoldersPage.getCurrentPage();
                        final String[] items = new String[mailFolders.size()];
                        for (int i = 0; i < mailFolders.size(); i++) {
                            items[i] = mailFolders.get(i).displayName;
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
                    public void failure(final ClientException ex) {
                        runOnUiThread(new ErrorHandler(progress, ex));
                    }
                });
    }

    private void startSendMessage() {

        //Show a "work-in-progress" dialog
        final ProgressDialog progress = ProgressDialog.show(
                this, "Working", "Sending a Message"
        );

        graphServiceClient.
                getMe().
                buildRequest().
                get(new ICallback<User>() {
                    @Override
                    public void success(User user) {
                        //Create an example message
                        ItemBody body = new ItemBody();
                        body.contentType = BodyType.text;
                        body.content = "This is a message body";

                        EmailAddress recipientAddress = new EmailAddress();
                        recipientAddress.address = user.mail;
                        recipientAddress.name = user.displayName;

                        Recipient recipient = new Recipient();
                        recipient.emailAddress = recipientAddress;

                        Message message = new Message();
                        message.toRecipients = (Arrays.asList(recipient));
                        message.subject = "This is a test message";
                        message.body = body;

                        //Send the message through the API
                        boolean saveToSentItems = true;
                        graphServiceClient.getMe().
                                getSendMail(message, saveToSentItems).
                                buildRequest().
                                post(new ICallback<Void>() {
                                    @Override
                                    public void success(Void aVoid) {
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
                                    public void failure(final ClientException ex) {
                                        runOnUiThread(new ErrorHandler(progress, ex));
                                    }
                                });
                    }

                    @Override
                    public void failure(ClientException ex) {
                        runOnUiThread(new ErrorHandler(progress, ex));
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

    private void startCreateFolder(final String newFolderName) {

        //Show a "work-in-progress" dialog
        final ProgressDialog progress = ProgressDialog.show(
                this, "Working", "Creating Folder"
        );

        //Create the folder via the API
        graphServiceClient.
                getMe().
                getMailFolders().
                buildRequest(Arrays.asList(new Option[]{new QueryOption("$filter", "displayName eq 'Inbox'")})).
                get(new ICallback<IMailFolderCollectionPage>() {
                        @Override
                        public void success(IMailFolderCollectionPage foldersPage) {
                            List< MailFolder > mailFolders = foldersPage.getCurrentPage();
                            if (mailFolders.size() == 1) {
                                String inboxId = mailFolders.get(0).id;
                                final MailFolder newFolder = new MailFolder();
                                newFolder.displayName = newFolderName;

                                graphServiceClient.
                                        getMe().
                                        getMailFolders(inboxId).
                                        getChildFolders().
                                        buildRequest().
                                        post(newFolder, new ICallback<MailFolder>() {
                                            @Override
                                            public void success(final MailFolder mailFolder) {
                                                runOnUiThread(new Runnable() {
                                                    @Override
                                                    public void run() {
                                                        progress.dismiss();
                                                        new AlertDialog.Builder(MainActivity.this)
                                                                .setTitle("Success")
                                                                .setMessage("Created folder " + mailFolder.displayName)
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
                        }

                        @Override
                        public void failure(ClientException ex) {
                            runOnUiThread(new ErrorHandler(progress, ex));
                        }
                    });
    }
}
