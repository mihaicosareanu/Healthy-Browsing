var defaultBlinkValue = 20;
var defaultWaterValue = 45;
var defaultStretchValue = 90;
var defaultPostureValue = 20;

var blinkSliderId = "#blink_slider";
var waterSliderId = "#water_slider";
var stretchSliderId = "#stretch_slider";
var postureSliderId = "#posture_slider";

var running = true;
var playSound = false;

var resetDefaultSettings = function() {
	$(blinkSliderId).slider("value", defaultBlinkValue);
	$(waterSliderId).slider("value", defaultWaterValue);
	$(stretchSliderId).slider("value", defaultStretchValue);
	$(postureSliderId).slider("value", defaultPostureValue);

	updateBlinkValue(defaultBlinkValue);
	updateWaterValue(defaultWaterValue);
	updateStretchValue(defaultStretchValue);
	updatePostureValue(defaultPostureValue);
	storeUserPrefs();
}

var getUserPrefs = function() {
	var prefs = {};
    prefs.blinkInterval = $(blinkSliderId).slider("value");
    prefs.waterInterval = $(waterSliderId).slider("value");
    prefs.stretchInterval = $(stretchSliderId).slider("value");
	prefs.postureInterval = $(postureSliderId).slider("value");
	prefs.running = running;
	prefs.playSound = playSound;
    return prefs;
}

var storeUserPrefs = function() {
	chrome.storage.sync.set({healthyBrowsingSettings: getUserPrefs()}, function() {
		chrome.extension.sendMessage({action: "optionsChanged"});
	});
}

var updateBlinkValue = function(value) { $("#blink_value").html(value + ' minutes');}
var updateWaterValue = function(value) { $("#water_value").html(value + ' minutes');}
var updateStretchValue = function(value) { $("#stretch_value").html(value + ' minutes');}
var updatePostureValue = function(value) { $("#posture_value").html(value + ' minutes');}


$(document).ready(function() {
	chrome.storage.sync.get('healthyBrowsingSettings', function (prefs) {
		prefs = prefs.healthyBrowsingSettings;

		var blinkInterval;
		var stretchInterval;
		var waterInterval;
		var postureInterval;

		if (prefs == null || prefs.blinkInterval == null) {
			blinkInterval = defaultBlinkValue;
			stretchInterval = defaultStretchValue;
			waterInterval = defaultWaterValue;
			postureInterval = defaultPostureValue;
			running = true;
		} else {
			blinkInterval = prefs.blinkInterval;
			stretchInterval = prefs.stretchInterval;
			waterInterval = prefs.waterInterval;
			postureInterval = prefs.postureInterval;
			running = prefs.running;
		}

		updateBlinkValue(blinkInterval);
		updateWaterValue(waterInterval);
		updateStretchValue(stretchInterval);
		updatePostureValue(postureInterval);


		var sliderOptions = {
			step: 5,
			min: 5,
			max: 120,
			value: 10
		};

		var blinkSliderOptions = sliderOptions;
		blinkSliderOptions.value = blinkInterval;
		blinkSliderOptions.change = storeUserPrefs;
		blinkSliderOptions.slide = function (event, ui) {
			updateBlinkValue(ui.value);
		}
		$(blinkSliderId).slider(blinkSliderOptions);

		var waterSliderOptions = sliderOptions;
		waterSliderOptions.value = waterInterval;
		waterSliderOptions.change = storeUserPrefs;
		waterSliderOptions.slide = function (event, ui) {
			updateWaterValue(ui.value);
		}
		$(waterSliderId).slider(waterSliderOptions);


		var stretchSliderOptions = sliderOptions;
		stretchSliderOptions.value = stretchInterval;
		stretchSliderOptions.change = storeUserPrefs;
		stretchSliderOptions.slide = function (event, ui) {
			updateStretchValue(ui.value);
		}
		$(stretchSliderId).slider(stretchSliderOptions);


		var postureSliderOptions = sliderOptions;
		postureSliderOptions.value = postureInterval;
		postureSliderOptions.change = storeUserPrefs;
		postureSliderOptions.slide = function (event, ui) {
			updatePostureValue(ui.value);
		}
		$(postureSliderId).slider(postureSliderOptions);



		if (running) {
			$('#toggle-running').toggleClass('toggle-button-selected');
		}

		if (playSound) {
			$('#toggle-sound').toggleClass('toggle-button-selected');
		}
	});

});

$(document).on('click', '#toggle-running', function() {
	if (running)
		running = false;
	else
		running = true;

	storeUserPrefs();

	$(this).toggleClass('toggle-button-selected');
});

$(document).on('click', '#toggle-sound', function() {
	if (playSound)
		playSound = false;
	else
		playSound = true;

	storeUserPrefs();

	$(this).toggleClass('toggle-button-selected');
});

$(document).on('click', '#reset-settings', function() {
	resetDefaultSettings();
});