package com.microsoft.researchtracker.utils;

import android.os.AsyncTask;

public class AsyncUtil {

    public static <TResult> AsyncTaskBuilder<TResult> onBackgroundThread(final BackgroundHandler<TResult> handler) {
        return new AsyncTaskBuilder<TResult>(handler);
    }

    public static class AsyncTaskBuilder<TResult> {

        private BackgroundHandler<TResult> mBackgroundHandler;
        private ResultHandler<TResult> mForegroundHandler;

        public AsyncTaskBuilder(BackgroundHandler<TResult> handler) {
            mBackgroundHandler = handler;
        }

        public AsyncTaskBuilder thenOnUiThread(ResultHandler<TResult> handler) {
            mForegroundHandler = handler;
            return this;
        }

        public AsyncTask<Void, Void, TResult> execute() {
            return new AsyncTask<Void, Void, TResult>() {
                @Override protected TResult doInBackground(Void... params) {
                    if (mBackgroundHandler != null) {
                        return mBackgroundHandler.run();
                    }
                    return null;
                }
                @Override protected void onPostExecute(TResult result) {
                    if (mForegroundHandler != null) {
                        mForegroundHandler.run(result);
                    }
                }
            }
            .execute();
        }
    }

    public interface BackgroundHandler<TResult> {
        public TResult run();
    }

    public interface ResultHandler<TResult> {
        public void run(TResult result);
    }
}
