package com.studyflow.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ServiceInfo;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class StepForegroundService extends Service implements SensorEventListener {

    private static final String CHANNEL_ID = "StepTrackerChannel";
    private static final int NOTIFICATION_ID = 1;
    
    private SensorManager sensorManager;
    private Sensor stepSensor;

    @Override
    public void onCreate() {
        super.onCreate();
        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager != null) {
            stepSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Step Tracker Service",
                    NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
            }
        }

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Step Tracker Active")
                .setContentText("Counting your steps in the background")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setOngoing(true)
                .build();

        if (Build.VERSION.SDK_INT >= 34) { // Build.VERSION_CODES.UPSIDE_DOWN_CAKE
            int type = 1 << 8; // FOREGROUND_SERVICE_TYPE_HEALTH
            startForeground(NOTIFICATION_ID, notification, type);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_NONE);
        } else {
            startForeground(NOTIFICATION_ID, notification);
        }

        if (stepSensor != null) {
            sensorManager.registerListener(this, stepSensor, SensorManager.SENSOR_DELAY_NORMAL);
        }

        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (sensorManager != null) {
            sensorManager.unregisterListener(this);
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_STEP_COUNTER) {
            float totalSteps = event.values[0];
            
            SharedPreferences prefs = getSharedPreferences("StepTrackerPrefs", Context.MODE_PRIVATE);
            prefs.edit().putFloat("currentSteps", totalSteps).apply();
            
            String today = new SimpleDateFormat("yyyy-M-d", Locale.US).format(new Date());
            String key = "steps_" + today;
            prefs.edit().putFloat(key, totalSteps).apply();
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }
}
