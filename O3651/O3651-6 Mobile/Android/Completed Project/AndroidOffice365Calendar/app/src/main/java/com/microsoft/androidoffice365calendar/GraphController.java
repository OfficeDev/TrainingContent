package com.microsoft.androidoffice365calendar;

import android.util.Log;

import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.SettableFuture;
import com.microsoft.services.graph.Event;
import com.microsoft.services.graph.fetchers.GraphServiceClient;
import com.microsoft.services.orc.core.DependencyResolver;
import com.microsoft.services.orc.core.OrcList;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class GraphController {
    private final static String TAG = "GraphController";

    public static synchronized GraphController getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new GraphController();
        }
        return INSTANCE;
    }
    private static GraphController INSTANCE;

    public SettableFuture<List<String>> initialize() {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar = Calendar.getInstance();
        int day = calendar.get(Calendar.DAY_OF_MONTH) - 30;
        calendar.set(Calendar.DAY_OF_MONTH,day);
        String filterDate = formatter.format(calendar.getTime());
        final SettableFuture<List<String>> result = SettableFuture.create();
        final List<String> events = new ArrayList<String>();

        DependencyResolver dependencyResolver = AuthenticationController.getInstance().getDependencyResolver();
        GraphServiceClient graphServiceClient = new GraphServiceClient(Constants.GRAPH_RESOURCE_URL,dependencyResolver);
        try {
            Futures.addCallback(graphServiceClient.getMe().getEvents()
                    .filter("Start/DateTime ge '" + filterDate + "'")
                    .select("subject,start,end")
                    .orderBy("Start/DateTime desc")
                    .top(10000).read(), new FutureCallback<OrcList<Event>>() {
                @Override
                public void onSuccess(OrcList<Event> list) {
                    for (Event event : list){
                        events.add(event.getSubject());
                    }
                    result.set(events);
                }

                @Override
                public void onFailure(Throwable t) {
                    Log.e(TAG, "Get events failed. " + t.getMessage());
                    result.setException(t);
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Initialize failed. " + e.getMessage());
            result.setException(e);
        }
        return result;
    }
}
