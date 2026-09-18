package com.studyflow.app;

import android.Manifest;
import android.content.Intent;
import android.os.Build;

import androidx.core.content.ContextCompat;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(
    name = "StepBackground",
    permissions = {
        @Permission(
            alias = "activity",
            strings = {Manifest.permission.ACTIVITY_RECOGNITION}
        ),
        @Permission(
            alias = "notifications",
            strings = {Manifest.permission.POST_NOTIFICATIONS}
        )
    }
)
public class StepBackgroundPlugin extends Plugin {

    @PluginMethod
    public void startTracker(PluginCall call) {
        if (getPermissionState("activity") != com.getcapacitor.PermissionState.GRANTED ||
            (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && getPermissionState("notifications") != com.getcapacitor.PermissionState.GRANTED)) {
            
            requestAllPermissions(call, "permissionsCallback");
        } else {
            startForegroundService();
            call.resolve();
        }
    }

    @PluginMethod
    public void stopTracker(PluginCall call) {
        Intent intent = new Intent(getContext(), StepForegroundService.class);
        getContext().stopService(intent);
        call.resolve();
    }

    @PermissionCallback
    private void permissionsCallback(PluginCall call) {
        if (getPermissionState("activity") == com.getcapacitor.PermissionState.GRANTED) {
            boolean notificationsGranted = true;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                notificationsGranted = getPermissionState("notifications") == com.getcapacitor.PermissionState.GRANTED;
            }
            
            if (notificationsGranted) {
                startForegroundService();
                call.resolve();
            } else {
                call.reject("Notification permission denied");
            }
        } else {
            call.reject("Activity Recognition permission denied");
        }
    }

    private void startForegroundService() {
        Intent intent = new Intent(getContext(), StepForegroundService.class);
        ContextCompat.startForegroundService(getContext(), intent);
    }

    @PluginMethod
    public void getSteps(PluginCall call) {
        android.content.SharedPreferences prefs = getContext().getSharedPreferences("StepTrackerPrefs", android.content.Context.MODE_PRIVATE);
        float currentSteps = prefs.getFloat("currentSteps", -1f);
        
        com.getcapacitor.JSObject ret = new com.getcapacitor.JSObject();
        ret.put("steps", currentSteps);
        call.resolve(ret);
    }
}
