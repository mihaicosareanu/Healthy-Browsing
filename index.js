var defaultBlinkValue = 20;
var defaultWaterValue = 45;
var defaultStretchValue = 90;

var running = true;

var getUserPrefs = function() {
	var prefs = {};
    prefs.blinkInterval = $("#blink_slider").slider("value");
    prefs.waterInterval = $("#water_slider").slider("value");
    prefs.stretchInterval = $("#stretch_slider").slider("value");
	prefs.running = running;
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

		if (prefs == null || prefs.blinkInterval == null) {
			blinkInterval = defaultBlinkValue;
			stretchInterval = defaultStretchValue;
			waterInterval = defaultWaterValue;
			running = true;
		} else {
			blinkInterval = prefs.blinkInterval;
			stretchInterval = prefs.stretchInterval;
			waterInterval = prefs.waterInterval;
			running = prefs.running;
		}

		$("#blink_value").html(blinkInterval + ' minutes');
		$("#water_value").html(waterInterval + ' minutes');
		$("#stretch_value").html(stretchInterval + ' minutes');

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

		if (running) {
			$('.toggle-button').toggleClass('toggle-button-selected');
		}
	});

});

$(document).on('click', '.toggle-button', function() {
	if (running)
		running = false;
	else
		running = true;

	storeUserPrefs();

	$(this).toggleClass('toggle-button-selected');
});