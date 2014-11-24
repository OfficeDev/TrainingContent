package com.microsoft.researchtracker.sharepoint.models;

import com.microsoft.listservices.SPListItem;
import com.microsoft.researchtracker.utils.SPListItemWrapper;

import org.json.JSONObject;

import java.util.Date;

public class ResearchProjectModel {

    public static final String[] SELECT = {
        "Id", "Title", "Modified", "Editor/Title"
    };
    
    public static final String[] EXPAND = {
        "Editor"
    };

    private final SPListItemWrapper mData;

    public ResearchProjectModel() {
        this(new SPListItem());
    }

    public ResearchProjectModel(SPListItem listItem) {
        mData = new SPListItemWrapper(listItem);
    }

    public int getId() {
        return mData.getInt("Id");
    }

    public void setId(int value) {
        mData.setInt("Id", value);
    }

    public String getTitle() {
        return mData.getString("Title");
    }

    public void setTitle(String value) {
        mData.setString("Title", value);
    }

    public UserDetailModel getEditor() {
        JSONObject data = mData.getObject("Editor");
        return new UserDetailModel(data);
    }

    public Date getModified() {
        return mData.getDate("Modified");
    }

    public SPListItem getData() {
        return mData.getInner();
    }
}
