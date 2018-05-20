package com.microsoft.researchtracker.utils;

import android.util.SparseArray;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

public class ViewUtil {

    private static class ViewCache {
        public final int layoutId;
        public final SparseArray<View> views;

        private ViewCache(int layoutId) {
            this.layoutId = layoutId;
            this.views = new SparseArray<View>();
        }
    }

    /**
     * Prepares a view with the given layoutId.
     *
     * If the parameter reusableView is not-null and was hydrated from the same layoutId, then
     * that view is returned. Otherwise, a new view is inflated using the given inflater instance.
     *
     * The returned view is tagged with information relating to it's inflation and a child view
     * cache intended to improve performance when rendering many small views
     * (e.g. in a ListView Adapter)
     *
     * @param inflater The inflater to inflate new views with
     * @param layoutId The id of the layout to use
     * @param reusableView The view to consider re-using
     * @param parent The parent ViewGroup to associate any newly-created views with
     * @return A usable view.
     */
    public static View prepareView(LayoutInflater inflater, int layoutId, View reusableView, ViewGroup parent) {
        View view = reusableView;
        if (view != null) {
            Object tag = view.getTag();
            if (tag instanceof ViewCache && ((ViewCache)tag).layoutId == layoutId) {
                return view;
            }
        }

        view = inflater.inflate(layoutId, parent, false);
        assert view != null;
        view.setTag(new ViewCache(layoutId));
        return view;
    }

    /**
     * To be used in conjunction with #prepareView. Searches the given view for the View with the
     * id #id. If found, the View is cached in a fast-lookup table for future searches.
     *
     * @param view The View to search
     * @param id The id of the View to find
     * @return The located view
     */
    public static View findChildView(View view, int id) {
        ViewCache cache = (ViewCache) view.getTag();

        View childView = cache.views.get(id);
        if (childView == null) {
            childView = view.findViewById(id);
            cache.views.put(id, childView);
        }

        return childView;
    }
}

