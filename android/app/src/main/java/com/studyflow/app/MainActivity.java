package com.studyflow.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(StepBackgroundPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
