package com.microsoft.researchtracker.sharepoint.models;

import com.microsoft.listservices.SPListItem;
import com.microsoft.researchtracker.utils.SPListItemWrapper;

import org.json.JSONObject;

public class ResearchReferenceModel {

    public static final String[] SELECT = {
        "Id", "Project", "URL", "Comments"
    };

    public static final String[] EXPAND = { };

    private final SPListItemWrapper mData;

    public ResearchReferenceModel() {
        this(new SPListItem());
    }

    public ResearchReferenceModel(SPListItem listItem) {
        mData = new SPListItemWrapper(listItem);
    }

    public int getId() {
        return mData.getInt("Id");
    }

    public void setId(int value) {
        mData.setInt("Id", value);
    }

    public int getProjectId() {
        try {
            return Integer.parseInt(mData.getString("Project"));
        }
        catch (Exception ex) {
            return -1;
        }
    }

    public void setProjectId(int projectId) {
        mData.setString("Project", Integer.toString(projectId));
    }

    public UrlModel getURL() {
        JSONObject data = mData.getObject("URL");
        return new UrlModel(data);
    }

    public void setURL(UrlModel value) {
        JSONObject data = (value == null) ? null : value.getData();
        mData.setObject("URL", data);
    }

    public String getDescription() {
        return mData.getString("Comments");
    }

    public void setDescription(String value) {
        mData.setString("Comments", value);
    }

    public SPListItem getData() {
        return mData.getInner();
    }
}
