package com.microsoft.androidoffice365calendar;

import android.app.Activity;
import android.app.ProgressDialog;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.util.Log;
import android.content.Intent;

import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.SettableFuture;

import android.widget.ListView;
import android.widget.LinearLayout;
import android.widget.Toast;

import java.util.List;

public class MainActivity extends Activity {
    private final static String TAG = "MainActivity";
    private ProgressDialog process;
    private ListView listEvents;
    private LinearLayout panelSignIn;
    private LinearLayout panelEvents;
    private LinearLayout panelLoadEvent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        listEvents = (ListView)findViewById(R.id.list_events);
        panelSignIn = (LinearLayout)findViewById(R.id.panel_signIn);
        panelEvents = (LinearLayout)findViewById(R.id.panel_events);
        panelLoadEvent = (LinearLayout)findViewById(R.id.panel_loadEvent);

        ((Button)findViewById(R.id.btn_signIn)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                signIn();
            }
        });

        ((Button)findViewById(R.id.btn_loadEvent)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                loadEvents();
            }
        });

        setPanelVisibility(true,false,false);
    }

    private void signIn() {
        AuthenticationController.getInstance().setContextActivity(this);
        SettableFuture<Boolean> authenticated = AuthenticationController.getInstance().initialize();

        Futures.addCallback(authenticated, new FutureCallback<Boolean>() {
            @Override
            public void onSuccess(Boolean result) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(MainActivity.this,"Sign in successfully.",Toast.LENGTH_SHORT).show();
                        setPanelVisibility(false,true,false);
                    }
                });
            }
            @Override
            public void onFailure(final Throwable t) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(MainActivity.this,"Sign in failed.",Toast.LENGTH_LONG).show();
                        Log.e(TAG, "Sign in failed. " + t.getMessage());
                    }
                });
            }
        });
    }

    private void loadEvents(){
        process = ProgressDialog.show(this,"Loading","Loading events in the past 30 days...");
        SettableFuture<List<String>> graphController = GraphController.getInstance().initialize(getApplication());
        Futures.addCallback(graphController, new FutureCallback<List<String>>() {
            @Override
            public void onSuccess(final List<String> result) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(MainActivity.this,"Load event successfully.",Toast.LENGTH_LONG).show();
                        process.dismiss();
                        bindEvents(result);
                    }
                });
            }

            @Override
            public void onFailure(final Throwable t) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Log.e(TAG, "Load event failed. " + t.getMessage());
                        process.dismiss();
                        Toast.makeText(MainActivity.this,"Load event failed.",Toast.LENGTH_LONG).show();
                    }
                });
            }
        });
    }

    private void bindEvents(List<String> events){
        setPanelVisibility(false,false,true);
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,android.R.layout.simple_expandable_list_item_1,events);
        listEvents.setAdapter(adapter);
    }

    private void setPanelVisibility(Boolean showSignIn, Boolean showLoadEvents, Boolean showList){
        panelSignIn.setVisibility(showSignIn ? View.VISIBLE : View.GONE);
        panelLoadEvent.setVisibility(showLoadEvents ? View.VISIBLE : View.GONE);
        panelEvents.setVisibility(showList ? View.VISIBLE : View.GONE);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.i(TAG, "AuthenticationActivity has come back with results");
        super.onActivityResult(requestCode, resultCode, data);
        AuthenticationController
                .getInstance()
                .getAuthenticationContext()
                .onActivityResult(requestCode, resultCode, data);
    }

}