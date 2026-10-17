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

    @PluginMethod
    public void syncWidgetData(PluginCall call) {
        int steps = call.getInt("steps", 0);
        int goal = call.getInt("goal", 10000);
        
        android.content.SharedPreferences meshinePrefs = getContext().getSharedPreferences("MeshineStepData", android.content.Context.MODE_PRIVATE);
        meshinePrefs.edit().putInt("current_steps", steps).putInt("step_goal", goal).apply();
        
        android.content.SharedPreferences prefs = getContext().getSharedPreferences("StepTrackerPrefs", android.content.Context.MODE_PRIVATE);
        float currentSensorSteps = prefs.getFloat("currentSteps", 0f);
        float offset = currentSensorSteps - steps;
        
        String today = new java.text.SimpleDateFormat("yyyy-M-d", java.util.Locale.US).format(new java.util.Date());
        prefs.edit().putFloat("widget_offset_" + today, offset).apply();

        Intent widgetIntent = new Intent(getContext(), StepWidgetProvider.class);
        widgetIntent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        getContext().sendBroadcast(widgetIntent);
        
        call.resolve();
    }
}
