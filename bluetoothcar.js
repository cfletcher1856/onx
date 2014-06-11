// Initializing variables

var deviceName = "Subaru";

// End of variables initializing

console.log('Started Script:' + device.currentSource);

if (!(device.version && device.version.isSupported(0, 54))) {

    var notification = device.notifications.createNotification('on{X} is out of date');
    notification.content = "the recipe '" + device.currentSource + "' requires an up to date on{X} application.";
    notification.show();
}
else {

    // time to wait for connection
    var timeOut = 10000;

    // whether the device was found
    var found = false;

    // the timer name
    var timerName = "BluetoothRecipeTimer";

    // check for MOT state change every minute
    device.modeOfTransport.samplingInterval = 60000;

    // register on 'connected' event to determine whether the device is near
    device.bluetooth.on('connected', function (bluetoothDevice) {
        if (bluetoothDevice.name === deviceName) {
            // found the device
            found = true;
            device.scheduler.removeTimer(timerName);
        }
    });

    // when driving is detected try turning the bluetooth on and looking for the device
    device.modeOfTransport.on("changed", function (signal) {
        if (signal.current === "driving") {

            if (device.bluetooth.enabled) {
                console.log('bluetooth is already enabled. doing nothing');
                return;
            }

            found = false;
            device.bluetooth.enabled = true;

            device.scheduler.setTimer({
                name: timerName,
                time: new Date().getTime() + timeOut,
                exact: true
            },
            function () {
                if (!found) {
                    console.log('could not find the device, disabling bluetooth');
                    device.bluetooth.enabled = false;
                }
            });
        }
    });
}

console.log('Completed Script:' + device.currentSource);
