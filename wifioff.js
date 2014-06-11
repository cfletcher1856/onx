var pollMinutes = 20;
var pollWaitSeconds = 30;
var enabledMinutes = 2;

//******************************************************************************
//* Rule logic below. Don't edit it if you don't know what you are doing.      *
//******************************************************************************
console.log('*******************');
console.log('* Starting Script *');
console.log('*******************');

// Turn Data On
device.screen.on('unlock', function() {
    console.log('Screen unlocked');

    clearTimers();

    //Turn wifi/data back on
    wifiEnabled(true);
});

device.battery.on('startedCharging', function(){
    console.log('Started charging');

    clearTimers();

    //Turn wifi/data back on
    wifiEnabled(true);
});

// Turn Data Off
device.screen.on('off', function() {
    var statusCharge = device.battery.status.isCharging ? "Charging" : "Not Charging";
    var statusTelephony = device.telephony.isIdle ? "Not Calling" : "Calling";
    console.log('Screen off: ' + statusCharge + " - " + statusTelephony);

    if(!device.battery.status.isCharging && device.telephony.isIdle) {
        // Just in case
        clearTimers();

        startTimers();
    }
});

device.battery.on('stoppedCharging', function(){
    var statusScreen = device.screen.isOn ? "Screen On" : "Screen Off";
    var statusTelephony = device.telephony.isIdle ? "Not Calling" : "Calling";
    console.log('Stopped charging: ' + statusScreen + " - " + statusTelephony);

    if(!device.screen.isOn && device.telephony.isIdle) {
        // Just in case
        clearTimers();

        startTimers();
    }
});

// Helper Functions
function startTimers() {
    var now = new Date();

    // Wait a few seconds before turning off the wifi/data
    device.scheduler.setTimer({
        name: 'waitTimer',
        time: now.getTime() + (pollWaitSeconds * 1000),
        exact: true },
        function() {
            wifiEnabled(false);
        }
    );

    // Every poll period turn wifi/data back on
    device.scheduler.setTimer({
        name: 'pollTimer',
        time: now.getTime() + (pollWaitSeconds * 1000) + (pollMinutes * 60 * 1000),
        interval: pollMinutes * 60 * 1000,
        exact: true },
        function() {
            var now2 = new Date();

            //Turn wifi/data back on
            wifiEnabled(true);

            //Remove the previous enabledTimer
            device.scheduler.removeTimer('enabledTimer');

            //Set a timer to turn it back off in the specified number of minutes
            device.scheduler.setTimer({
                name: 'enabledTimer',
                time: now2.getTime() + (enabledMinutes * 60 * 1000),
                exact: true },
                function() {
                    wifiEnabled(false);
                }
            );
        }
    );
}

function clearTimers() {
    //Remove all the screen off timers
    device.scheduler.removeTimer('waitTimer');
    device.scheduler.removeTimer('pollTimer');
    device.scheduler.removeTimer('enabledTimer');
}

function wifiEnabled(enabled) {
    if(device.network.wifiEnabled != enabled) {
        console.log(enabled ? 'Setting wifi to: enabled' : 'Setting wifi to: disabled');
        device.network.wifiEnabled = enabled;
    }
}
