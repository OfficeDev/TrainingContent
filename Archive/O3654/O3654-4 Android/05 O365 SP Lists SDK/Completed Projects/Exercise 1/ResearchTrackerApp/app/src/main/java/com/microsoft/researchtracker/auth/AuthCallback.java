package com.microsoft.researchtracker.auth;

public interface AuthCallback {
    public void onFailure(String errorDescription);
    public void onCancelled();
    public void onSuccess();
}
