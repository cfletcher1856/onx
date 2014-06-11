console.log('Started Script:' + device.currentSource);

    if (!(device.version && device.version.isSupported(0, 54))) {

        var notification = device.notifications.createNotification('on{X} is out of date');
        notification.content = "the recipe '" + device.currentSource + "' requires an up to date on{X} application.";
        notification.show();
    }
    else {

        // create a geo region for the trigger to take place at
        var region = device.regions.createRegion({
            latitude: parseFloat("30.470894", 10),
            longitude: parseFloat("-97.687657", 10),
            name: "work",
            radius: 500
        });

        // enable/disable WiFi when entering/leaving the region
        region.on('enter', function () {
            device.network.wifiEnabled = true;
        });

        device.regions.startMonitoring(region);
    }

    console.log('Completed Script:' + device.currentSource);
