var waterInterval = 1000 * 60 * 45;
var blinkInterval = 1000 * 60 * 20;
var stretchInterval = 1000 * 60 * 90;

var waterScheduler;
var blinkScheduler;
var stretchScheduler;

var running = true;

waterNotification = {
    type: "basic",
    title: "Take a sip",
    message: "It's time to drink some water",
    iconUrl: 'water.png'
}

blinkNotification = {
    type: "basic",
    title: "Blink your eyes",
    message: "Blink your eyes 10 times, then focus in the distance for a couple of seconds.",
    iconUrl: 'eye.png'
}

stretchNotification = {
    type: "basic",
    title: "Time to stretch",
    message: "Get up and stretch, go to the kitchen or to the bathroom or to the balcony",
    iconUrl: 'stretch.png'
}

refreshScheduler = function() {
    chrome.storage.sync.get('healthyBrowsingSettings', function (prefs) {
        prefs = prefs.healthyBrowsingSettings;

        if (prefs != null) {
            var multiplier = 60 * 1000;
            blinkInterval = prefs.blinkInterval * multiplier;
            stretchInterval = prefs.stretchInterval * multiplier;
            waterInterval = prefs.waterInterval * multiplier;
            running = prefs.running;
        }
        notificationScheduler();
    });
}

notificationScheduler = function() {
    clearInterval(waterScheduler);
    waterScheduler = setInterval(function() {
        if (running) {
            chrome.notifications.create('water', waterNotification);
        }
    }, waterInterval);

    clearInterval(blinkScheduler);
    blinkScheduler = setInterval(function() {
        if (running) {
            chrome.notifications.create('blink', blinkNotification);
        }
    }, blinkInterval);

    clearInterval(stretchScheduler);
    stretchScheduler = setInterval(function() {
        if (running) {
            chrome.notifications.create('stretch', stretchNotification);
        }
    }, stretchInterval);
};

receiveMessage = function(message, sender, sendResponse) {
    if (message.action = "optionsChanged") {
        refreshScheduler();
    }
}

refreshScheduler();

chrome.runtime.onInstalled.addListener(refreshScheduler);
chrome.runtime.onStartup.addListener(refreshScheduler);
chrome.runtime.onMessage.addListener(receiveMessage);