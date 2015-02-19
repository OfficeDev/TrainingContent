package com.microsoft.researchtracker.sharepoint.models;

import org.json.JSONException;
import org.json.JSONObject;

public class UrlModel {

    private final JSONObject mData;

    public UrlModel() {
        this(new JSONObject());
    }

    public UrlModel(JSONObject data) {
        mData = data;
    }

    public String getUrl() {
        try {
            return mData.getString("Url");
        }
        catch (JSONException e) {
            return null;
        }
    }

    public void setUrl(String url) {
        try {
            mData.put("Url", url);
        }
        catch (JSONException e) {

        }
    }

    public String getTitle() {
        try {
            return mData.getString("Description");
        }
        catch (JSONException e) {
            return null;
        }
    }

    public void setTitle(String title) {
        try {
            mData.put("Description", title);
        }
        catch (JSONException e) {
            
        }
    }

    public JSONObject getData() {
        return mData;
    }
}
