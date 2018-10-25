var defaultBlinkValue = 20;
var defaultWaterValue = 45;
var defaultStretchValue = 90;
var defaultPostureValue = 20;
var defaultRunning = true;
var defaultPlaySound = false;

var multiplier = 60 * 1000;

var waterInterval = defaultWaterValue * multiplier;
var blinkInterval = defaultBlinkValue * multiplier;
var stretchInterval = defaultStretchValue * multiplier;
var postureInterval = defaultPostureValue * multiplier;

var waterScheduler;
var blinkScheduler;
var stretchScheduler;
var postureScheduler;

var running = defaultRunning;
var playSound = defaultPlaySound;

var defaultSound = new Audio('sound.mp3');
var waterSound = defaultSound;
var blinkSound = defaultSound;
var stretchSound = defaultSound;
var postureSound = defaultSound;

var waterNotification = {
    type: "basic",
    title: "Take a sip",
    message: "It's time to drink some water.",
    iconUrl: 'images/water.png'
};

var blinkNotification = {
    type: "basic",
    title: "Blink your eyes",
    message: "Blink your eyes 10 times, then focus in the distance for a couple of seconds.",
    iconUrl: 'images/eye.png'
};

var stretchNotification = {
    type: "basic",
    title: "Time to stretch",
    message: "Get up and stretch, go to the kitchen or to the bathroom or to the balcony.",
    iconUrl: 'images/stretch.png'
};

var postureNotification = {
    type: "basic",
    title: "Are you sitting correctly?",
    message: "Push your hips as far back as you can. Keep your shoulders back and your back straight.",
    iconUrl: 'images/posture.png'
};

var refreshScheduler = function() {
    chrome.storage.sync.get('healthyBrowsingSettings', function (prefs) {
        prefs = prefs.healthyBrowsingSettings;

        if (prefs != null) {

            if (prefs.blinkInterval != null)
                blinkInterval = prefs.blinkInterval * multiplier;
            else
                blinkInterval = defaultBlinkValue * multiplier;

            if (prefs.stretchInterval != null)
                stretchInterval = prefs.stretchInterval * multiplier;
            else
                stretchInterval = defaultStretchValue * multiplier;

            if (prefs.waterInterval != null)
                waterInterval = prefs.waterInterval * multiplier;
            else
                waterInterval = defaultWaterValue * multiplier;

            if (prefs.postureInterval != null)
                postureInterval = prefs.postureInterval * multiplier;
            else
                postureInterval = defaultPostureValue * multiplier;

            if (prefs.running != null)
                running = prefs.running;
            else
                running = defaultRunning;

            if (prefs.playSound != null)
                playSound = prefs.playSound;
            else
                playSound = defaultPlaySound;
        }
        notificationScheduler();
    });
};

var notificationScheduler = function() {
    clearInterval(waterScheduler);
    clearInterval(blinkScheduler);
    clearInterval(stretchScheduler);
    clearInterval(postureScheduler);

    if (!running)
        return;

    if (waterInterval) {
        waterScheduler = setInterval(function () {
            chrome.notifications.create('water', waterNotification);
            if (playSound) {
                waterSound.play();
            }
        }, waterInterval);
    }

    if (blinkInterval) {
        blinkScheduler = setInterval(function () {
            chrome.notifications.create('blink', blinkNotification);
            if (playSound) {
                blinkSound.play();
            }
        }, blinkInterval);
    }

    if (stretchInterval) {
        stretchScheduler = setInterval(function () {
            chrome.notifications.create('stretch', stretchNotification);
            if (playSound) {
                stretchSound.play();
            }
        }, stretchInterval);
    }

    if (postureInterval) {
        postureScheduler = setInterval(function () {
            chrome.notifications.create('posture', postureNotification);
            if (playSound) {
                postureSound.play();
            }
        }, postureInterval);
    }
};

var receiveMessage = function(message, sender, sendResponse) {
    if (message.action == "optionsChanged") {
        refreshScheduler();
    }
};

refreshScheduler();

chrome.runtime.onInstalled.addListener(refreshScheduler);
chrome.runtime.onStartup.addListener(refreshScheduler);
chrome.runtime.onMessage.addListener(receiveMessage);