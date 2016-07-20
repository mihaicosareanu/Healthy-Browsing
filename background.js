var defaultBlinkValue = 20;
var defaultWaterValue = 45;
var defaultStretchValue = 90;
var defaultPostureValue = 20;
var defaultRunning = true;
var defaultPlaySound = false;

var waterInterval;
var blinkInterval;
var stretchInterval;
var postureInterval;

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
    iconUrl: 'water.png'
};

var blinkNotification = {
    type: "basic",
    title: "Blink your eyes",
    message: "Blink your eyes 10 times, then focus in the distance for a couple of seconds.",
    iconUrl: 'eye.png'
};

var stretchNotification = {
    type: "basic",
    title: "Time to stretch",
    message: "Get up and stretch, go to the kitchen or to the bathroom or to the balcony.",
    iconUrl: 'stretch.png'
};

var postureNotification = {
    type: "basic",
    title: "Are you sitting correctly?",
    message: "Push your hips as far back as you can. Keep your shoulders back and your back straight.",
    iconUrl: 'posture.png'
};

var refreshScheduler = function() {
    chrome.storage.sync.get('healthyBrowsingSettings', function (prefs) {
        prefs = prefs.healthyBrowsingSettings;

        if (prefs != null) {
            var multiplier = 1000;
            blinkInterval = prefs.blinkInterval * multiplier || defaultBlinkValue * multiplier;
            stretchInterval = prefs.stretchInterval * multiplier || defaultStretchValue * multiplier;
            waterInterval = prefs.waterInterval * multiplier || defaultWaterValue * multiplier;
            postureInterval = prefs.postureInterval * multiplier || defaultPostureValue * multiplier;

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

var receiveMessage = function(message, sender, sendResponse) {
    if (message.action == "optionsChanged") {
        refreshScheduler();
    }
};

refreshScheduler();

chrome.runtime.onInstalled.addListener(refreshScheduler);
chrome.runtime.onStartup.addListener(refreshScheduler);
chrome.runtime.onMessage.addListener(receiveMessage);