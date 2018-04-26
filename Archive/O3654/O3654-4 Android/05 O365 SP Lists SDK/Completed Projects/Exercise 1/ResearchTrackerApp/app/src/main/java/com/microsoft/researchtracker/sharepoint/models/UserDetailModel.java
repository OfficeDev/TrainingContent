package com.microsoft.researchtracker.sharepoint.models;

import org.json.JSONException;
import org.json.JSONObject;

public class UserDetailModel {

    private final JSONObject mData;

    public UserDetailModel(JSONObject data) {
        mData = data;
    }

    public String getDisplayName() {
        try {
            return mData.getString("Title");
        }
        catch (JSONException e) {
            return null;
        }
    }

    public void setDisplayName(String displayName) {
        try {
            mData.put("Title", displayName);
        }
        catch (JSONException e) {

        }
    }
}
