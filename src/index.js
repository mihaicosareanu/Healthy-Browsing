/*
	Default values
 */
var defaultBlinkInterval = 20;
var defaultWaterInterval = 45;
var defaultStretchInterval = 90;
var defaultPostureInterval = 20;
var defaultRunning = true;
var defaultPlaySound = false;
var defaultInteractiveNotification = false;

/*
	Slider ids
 */
var blinkSliderId = "#blink_slider";
var waterSliderId = "#water_slider";
var stretchSliderId = "#stretch_slider";
var postureSliderId = "#posture_slider";

/*
	Toggle ids
 */
var runningToggleButton = "#toggle-running";
var playSoundToggleButton = "#toggle-sound";
var interactiveNotificationToggleButton = "#toggle-interactive";
var toggleButtonSelected = "toggle-button-selected";

var running = defaultRunning;
var playSound = defaultPlaySound;
var interactiveNotification = defaultInteractiveNotification;

var resetDefaultSettings = function() {
	$(blinkSliderId).slider("value", defaultBlinkInterval);
	$(waterSliderId).slider("value", defaultWaterInterval);
	$(stretchSliderId).slider("value", defaultStretchInterval);
	$(postureSliderId).slider("value", defaultPostureInterval);

	updateBlinkText(getSliderText(defaultBlinkInterval));
	updateWaterText(getSliderText(defaultWaterInterval));
	updateStretchText(getSliderText(defaultStretchInterval));
	updatePostureText(getSliderText(defaultPostureInterval));

	storeUserPrefs();
};

var getUserPrefs = function() {
	var prefs = {};
    prefs.blinkInterval = $(blinkSliderId).slider("value");
    prefs.waterInterval = $(waterSliderId).slider("value");
    prefs.stretchInterval = $(stretchSliderId).slider("value");
	prefs.postureInterval = $(postureSliderId).slider("value");
	prefs.running = running;
	prefs.playSound = playSound;
    prefs.interactiveNotification = interactiveNotification;
    return prefs;
};

var storeUserPrefs = function() {
	chrome.storage.sync.set({healthyBrowsingSettings: getUserPrefs()}, function() {
		chrome.extension.sendMessage({action: "optionsChanged"});
	});
};

var updateBlinkText = function(value) { $("#blink_value").html(value);};
var updateWaterText = function(value) { $("#water_value").html(value);};
var updateStretchText = function(value) { $("#stretch_value").html(value);};
var updatePostureText = function(value) { $("#posture_value").html(value);};

function getSliderText(value) {
	if (typeof value == undefined)
		return 'Error';
	if (value == 0)
		return 'Disabled';
	return value + ' minutes';
}

$(document).ready(function() {
	chrome.storage.sync.get('healthyBrowsingSettings', function (prefs) {
		prefs = prefs.healthyBrowsingSettings;

		var blinkInterval;
		var stretchInterval;
		var waterInterval;
		var postureInterval;

		if (prefs == null) {
			blinkInterval = defaultBlinkInterval;
			stretchInterval = defaultStretchInterval;
			waterInterval = defaultWaterInterval;
			postureInterval = defaultPostureInterval;
			running = defaultRunning;
			playSound = defaultPlaySound;
            interactiveNotification = defaultInteractiveNotification;
		} else {

			if (prefs.blinkInterval != null)
				blinkInterval = prefs.blinkInterval;
			else
				blinkInterval = defaultBlinkInterval;

			if (prefs.stretchInterval != null)
				stretchInterval = prefs.stretchInterval;
			else
				stretchInterval = defaultStretchInterval;

			if (prefs.waterInterval != null)
				waterInterval = prefs.waterInterval;
			else
				waterInterval = defaultWaterInterval;

			if (prefs.postureInterval != null)
				postureInterval = prefs.postureInterval;
			else
				postureInterval = defaultPostureInterval;

			if (prefs.running != null) {
				running = prefs.running;
			}
			else {
				running = defaultRunning;
			}

			if (prefs.interactiveNotification != null) {
				interactiveNotification = prefs.interactiveNotification;
			}
			else {
				interactiveNotification = defaultInteractiveNotification;
			}

			if (prefs.playSound != null) {
				playSound = prefs.playSound;
			}
			else {
				playSound = defaultPlaySound;
			}
		}

		updateBlinkText(getSliderText(blinkInterval));
		updateWaterText(getSliderText(waterInterval));
		updateStretchText(getSliderText(stretchInterval));
		updatePostureText(getSliderText(postureInterval));

		var sliderOptions = {
			step: 5,
			min: 0,
			max: 120,
			value: 10
		};

		var blinkSliderOptions = sliderOptions;
		blinkSliderOptions.value = blinkInterval;
		blinkSliderOptions.change = storeUserPrefs;
		blinkSliderOptions.slide = function (event, ui) {
			updateBlinkText(getSliderText(ui.value));
		};
		$(blinkSliderId).slider(blinkSliderOptions);


		var waterSliderOptions = sliderOptions;
		waterSliderOptions.value = waterInterval;
		waterSliderOptions.change = storeUserPrefs;
		waterSliderOptions.slide = function (event, ui) {
			updateWaterText(getSliderText(ui.value));
		};
		$(waterSliderId).slider(waterSliderOptions);


		var stretchSliderOptions = sliderOptions;
		stretchSliderOptions.value = stretchInterval;
		stretchSliderOptions.change = storeUserPrefs;
		stretchSliderOptions.slide = function (event, ui) {
			updateStretchText(getSliderText(ui.value));
		};
		$(stretchSliderId).slider(stretchSliderOptions);


		var postureSliderOptions = sliderOptions;
		postureSliderOptions.value = postureInterval;
		postureSliderOptions.change = storeUserPrefs;
		postureSliderOptions.slide = function (event, ui) {
			updatePostureText(getSliderText(ui.value));
		};
		$(postureSliderId).slider(postureSliderOptions);

		if (running) {
			$(runningToggleButton).toggleClass(toggleButtonSelected);
		}

		if (playSound) {
			$(playSoundToggleButton).toggleClass(toggleButtonSelected);
		}

        if (interactiveNotification) {
            $(interactiveNotificationToggleButton).toggleClass(toggleButtonSelected);
        }
	});

});

$(document).on('click', runningToggleButton, function() {
	if (running) {
		running = false;
	}
	else {
		running = true;
	}

	storeUserPrefs();

	$(this).toggleClass(toggleButtonSelected);
});

$(document).on('click', interactiveNotificationToggleButton, function() {
	if (interactiveNotification) {
		interactiveNotification = false;
	}
	else {
		interactiveNotification = true;
	}

	storeUserPrefs();

	$(this).toggleClass(toggleButtonSelected);
});

$(document).on('click', playSoundToggleButton, function() {
	if (playSound) {
		playSound = false;
	}
	else {
		playSound = true;
	}

	storeUserPrefs();

	$(this).toggleClass(toggleButtonSelected);
});

$(document).on('click', '#reset-settings', function() {
	resetDefaultSettings();
});
