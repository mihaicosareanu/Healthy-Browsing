var waterInterval = 1000 * 60 * 45;
var blinkInterval = 1000 * 60 * 20;
var stretchInterval = 1000 * 60 * 90;
var postureInterval = 1000 * 60 * 20;

var waterScheduler;
var blinkScheduler;
var stretchScheduler;
var postureScheduler;

var running = true;
var playSound = false;

var defaultSound = new Audio('water.mp3');
var waterSound = defaultSound;
var blinkSound = defaultSound;
var stretchSound = defaultSound;
var postureSound = defaultSound;

waterNotification = {
    type: "basic",
    title: "Take a sip",
    message: "It's time to drink some water.",
    iconUrl: 'water.png'
}

blinkNotification = {
    type: "basic",
    title: "Blink your eyes",
    message: "Blink your eyes 10 times, then focus in the distance for a couple of seconds.",
    iconUrl: 'eye.png'
    //imageUrl: 'giphy.gif'
}

stretchNotification = {
    type: "basic",
    title: "Time to stretch",
    message: "Get up and stretch, go to the kitchen or to the bathroom or to the balcony.",
    iconUrl: 'stretch.png'
}

postureNotification = {
    type: "basic",
    title: "Are you sitting correctly?",
    message: "Push your hips as far back as you can. Keep your shoulders back and your back straight.",
    iconUrl: 'posture.png'
}

refreshScheduler = function() {
    chrome.storage.sync.get('healthyBrowsingSettings', function (prefs) {
        prefs = prefs.healthyBrowsingSettings;

        if (prefs != null) {
            var multiplier = 1000;
            blinkInterval = prefs.blinkInterval * multiplier;
            stretchInterval = prefs.stretchInterval * multiplier;
            waterInterval = prefs.waterInterval * multiplier;
            postureInterval = prefs.postureInterval * multiplier;
            running = prefs.running;
            playSound = prefs.playSound;
        }
        notificationScheduler();
    });
}

notificationScheduler = function() {
    clearInterval(waterScheduler);
    waterScheduler = setInterval(function() {
        if (running) {
            chrome.notifications.create('water', waterNotification);
            if (playSound) {
                waterSound.play();
            }
        }
    }, waterInterval);

    clearInterval(blinkScheduler);
    blinkScheduler = setInterval(function() {
        if (running) {
            chrome.notifications.create('blink', blinkNotification);
            if (playSound) {
                blinkSound.play();
            }
        }
    }, blinkInterval);

    clearInterval(stretchScheduler);
    stretchScheduler = setInterval(function() {
        if (running) {
            chrome.notifications.create('stretch', stretchNotification);
            if (playSound) {
                stretchSound.play();
            }
        }
    }, stretchInterval);

    clearInterval(postureScheduler);
    postureScheduler = setInterval(function() {
        if (running) {
            chrome.notifications.create('posture', postureNotification);
            if (playSound) {
                postureSound.play();
            }
        }
    }, postureInterval);
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