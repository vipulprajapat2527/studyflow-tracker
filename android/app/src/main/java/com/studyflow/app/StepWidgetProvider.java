package com.studyflow.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class StepWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        if (AppWidgetManager.ACTION_APPWIDGET_UPDATE.equals(intent.getAction())) {
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            ComponentName thisWidget = new ComponentName(context, StepWidgetProvider.class);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
            if (appWidgetIds != null && appWidgetIds.length > 0) {
                for (int appWidgetId : appWidgetIds) {
                    updateAppWidget(context, appWidgetManager, appWidgetId);
                }
            }
        }
    }

    private void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences("MeshineStepData", Context.MODE_PRIVATE);
        int currentSteps = prefs.getInt("current_steps", 0);
        int stepGoal = prefs.getInt("step_goal", 10000);

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_step_counter);
        
        java.text.NumberFormat formatter = java.text.NumberFormat.getInstance(java.util.Locale.US);
        String stepText = formatter.format(currentSteps) + " / " + formatter.format(stepGoal);
        views.setTextViewText(R.id.widget_step_text, stepText);

        int progress = 0;
        if (stepGoal > 0) {
            progress = (int) (((float) currentSteps / stepGoal) * 100);
        }
        views.setProgressBar(R.id.widget_progress_bar, 100, progress, false);

        // Intent to launch the main app
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
