//Reference to the noUiSlider.
let slider = document.getElementById('slider');

//Instantiate the element.
noUiSlider.create(slider, {
    start: [1000, 10000000],
    connect: true,
    range: {
        'min': 0,
        'max': 10000000
    }
});

//The 'slide' event happens whenever
//either end of the noUiSlider is moved.
slider.noUiSlider.on('slide', function(){
	//Get references to the number inputs for min/max population.

	//Ideally these would be stored outside of the function in variables to avoid the two lookups
	//for each call, but because the Vue instance is created after the ajax call returns
	//those variables would get their references wiped.

	let min_pop = document.getElementById("min-pop");
	let max_pop = document.getElementById("max-pop");

	//Set the text fields to the rounded values of the noUiSlider.
	min_pop.value = Math.round(slider.noUiSlider.get()[0]);
	max_pop.value = Math.round(slider.noUiSlider.get()[1]);

	//Manually fire an input event for each property so that Vue will
	//update the v-model.
	let event = new Event('input', {
	    'bubbles': true,
	    'cancelable': true
	});

	min_pop.dispatchEvent(event);
	max_pop.dispatchEvent(event);
});
