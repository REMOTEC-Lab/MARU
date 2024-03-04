package ko.remotec.payoutrmt;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class AutoRunApp extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if(intent.getAction().equals("android.intent.action.BOOT_COMPLETED")){
            Intent m_intent = new Intent(context, MainActivity.class);
            m_intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(m_intent);
        }
    }
}