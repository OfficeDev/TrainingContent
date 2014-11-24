package com.microsoft.researchtracker.utils;

import com.microsoft.listservices.SPListItem;

import org.json.JSONObject;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

/**
 * Wrapper class which hides the complexity of reading SharePoint JSON data through the SPListItem interface.
 */
public class SPListItemWrapper {

    private SimpleDateFormat mZuluFormat;
    private SPListItem mInner;

    public SPListItemWrapper(SPListItem inner) {
        mInner = inner;
    }

    public SPListItem getInner() {
        return mInner;
    }

    private DateFormat getZuluFormat() {
        if (mZuluFormat == null) {
            //Format used by SharePoint for encoding datetimes
            mZuluFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
            mZuluFormat.setTimeZone(TimeZone.getTimeZone("GMT"));
        }
        return mZuluFormat;
    }

    public Date getDate(String fieldName) {
        try {
            Object data = mInner.getData(fieldName);
            if (data == null || !(data instanceof String)) {
                return null;
            }
            return getZuluFormat().parse((String) data);
        }
        catch (Exception ex) {
            return null;
        }
    }

    public void setDate(String fieldName, Date value) {
        if (value == null) {
            mInner.setData(fieldName, null);
        }
        mInner.setData(fieldName, getZuluFormat().format(value));
    }

    public int getInt(String fieldName) {
        try {
            return (Integer) mInner.getData(fieldName);
        }
        catch (Exception ex) {
            return 0;
        }
    }

    public void setInt(String fieldName, int value) {
        mInner.setData(fieldName, value);
    }

    public String getString(String fieldName) {
        try {
            return (String) mInner.getData(fieldName);
        }
        catch (Exception ex) {
            return null;
        }
    }

    public void setString(String fieldName, String value) {
        mInner.setData(fieldName, value);
    }

    public JSONObject getObject(String fieldName) {
        try {
            return (JSONObject) mInner.getData(fieldName);
        }
        catch (Exception ex) {
            return null;
        }
    }

    public void setObject(String fieldName, JSONObject value) {
        mInner.setData(fieldName, value);
    }
}
