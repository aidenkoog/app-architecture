package io.github.aidenkoog.android_wear_os.presentation.setting.activity

import android.os.Bundle
import io.github.aidenkoog.android_wear_os.R
import io.github.aidenkoog.android_wear_os.presentation.base.activity.BaseActivity

class SettingActivity: BaseActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_setting)
    }
}