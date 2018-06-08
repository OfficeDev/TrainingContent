package com.microsoft.androidoffice365calendar;

import android.app.Application;
import android.util.Log;

import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.SettableFuture;
import com.microsoft.graph.authentication.IAuthenticationAdapter;
import com.microsoft.graph.authentication.MSAAuthAndroidAdapter;
import com.microsoft.graph.concurrency.ICallback;
import com.microsoft.graph.core.ClientException;
import com.microsoft.graph.core.DefaultClientConfig;
import com.microsoft.graph.core.IClientConfig;
import com.microsoft.graph.extensions.Event;
import com.microsoft.graph.extensions.GraphServiceClient;
import com.microsoft.graph.extensions.IEventCollectionPage;
import com.microsoft.graph.extensions.IGraphServiceClient;
import com.microsoft.graph.http.IHttpRequest;
import com.microsoft.graph.options.HeaderOption;
import com.microsoft.graph.options.Option;
import com.microsoft.graph.options.QueryOption;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

/**
 * Created by Microsoft on 5/24/2016.
 */
public class GraphController {
    private final static String TAG = "GraphController";

    public static synchronized GraphController getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new GraphController();
        }
        return INSTANCE;
    }
    private static GraphController INSTANCE;

    public SettableFuture<List<String>> initialize(Application app) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar = Calendar.getInstance();
        int day = calendar.get(Calendar.DAY_OF_MONTH) - 30;
        calendar.set(Calendar.DAY_OF_MONTH,day);
        String filterDate = formatter.format(calendar.getTime());
        final SettableFuture<List<String>> result = SettableFuture.create();
        final List<String> events = new ArrayList<String>();

        final String graphToken = AuthenticationController.getInstance().getGraphToken();
        final IAuthenticationAdapter authenticationAdapter = new MSAAuthAndroidAdapter(app) {
            @Override
            public String getClientId() {
                return Constants.AAD_CLIENT_ID;
            }

            @Override
            public String[] getScopes() {
                return new String[] {
                        "https://graph.microsoft.com/Calendars.ReadWrite",
                        "https://graph.microsoft.com/User.Read",
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
                if (graphToken != null && graphToken.length() > 0){
                    request.addHeader(AUTHORIZATION_HEADER_NAME, OAUTH_BEARER_PREFIX + graphToken);
                    return;
                }
                super.authenticateRequest(request);
            }
        };
        final IClientConfig mClientConfig = DefaultClientConfig.createWithAuthenticationProvider(authenticationAdapter);
        final IGraphServiceClient graphServiceClient = new GraphServiceClient
                .Builder()
                .fromConfig(mClientConfig)
                .buildClient();

        try {
            graphServiceClient
                    .getMe()
                    .getEvents()
                    .buildRequest(Arrays.asList(new Option[] {
                            new QueryOption("$filter", "Start/DateTime ge '" + filterDate + "'"),
                            new QueryOption("$select", "subject,start,end"),
                            new QueryOption("$orderyBy", "Start/DateTime desc"),
                            new QueryOption("$top", "10000")
                    }))
            .get(new ICallback<IEventCollectionPage>(){
                @Override
                public void success(IEventCollectionPage page) {
                    List<Event> list = page.getCurrentPage();
                    for (Event item : list) {
                        events.add(item.subject);
                    }
                    result.set(events);
                }

                @Override
                public void failure(ClientException ex) {
                    Log.e(TAG, "Get events failed. " + ex.getMessage());
                    result.setException(ex);
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Initialize failed. " + e.getMessage());
            result.setException(e);
        }
        return result;
    }
}
