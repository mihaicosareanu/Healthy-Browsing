var defaultBlinkValue = 20;
var defaultWaterValue = 45;
var defaultStretchValue = 90;
var defaultPostureValue = 20;

var running = true;
var playSound = false;

var getUserPrefs = function() {
	var prefs = {};
    prefs.blinkInterval = $("#blink_slider").slider("value");
    prefs.waterInterval = $("#water_slider").slider("value");
    prefs.stretchInterval = $("#stretch_slider").slider("value");
	prefs.postureInterval = $("#posture_slider").slider("value");
	prefs.running = running;
	prefs.playSound = playSound;
    return prefs;
}

var storeUserPrefs = function() {
	chrome.storage.sync.set({healthyBrowsingSettings: getUserPrefs()}, function() {
		chrome.extension.sendMessage({action: "optionsChanged"});
	});
}

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

		$("#blink_value").html(blinkInterval + ' minutes');
		$("#water_value").html(waterInterval + ' minutes');
		$("#stretch_value").html(stretchInterval + ' minutes');
		$("#posture_value").html(postureInterval + ' minutes');

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
			$("#blink_value").html(ui.value + ' minutes');
		}

		$("#blink_slider").slider(blinkSliderOptions);

		var waterSliderOptions = sliderOptions;
		waterSliderOptions.value = waterInterval;
		waterSliderOptions.change = storeUserPrefs;
		waterSliderOptions.slide = function (event, ui) {
			$("#water_value").html(ui.value + ' minutes');
		}

		$("#water_slider").slider(waterSliderOptions);

		var stretchSliderOptions = sliderOptions;
		stretchSliderOptions.value = stretchInterval;
		stretchSliderOptions.change = storeUserPrefs;
		stretchSliderOptions.slide = function (event, ui) {
			$("#stretch_value").html(ui.value + ' minutes');
		}

		$("#stretch_slider").slider(stretchSliderOptions);

		var postureSliderOptions = sliderOptions;
		postureSliderOptions.value = postureInterval;
		postureSliderOptions.change = storeUserPrefs;
		postureSliderOptions.slide = function (event, ui) {
			$("#posture_value").html(ui.value + ' minutes');
		}

		$("#posture_slider").slider(postureSliderOptions);

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