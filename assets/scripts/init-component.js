function initComponent( data ) {
	//The primary data property for the Vue component
	//Contains all the cities, their state, and their population.
	let city_data = [];

	//This array will populate the select element for filtering by state.
	let states = [];

	//Loop through the API response
	data.forEach(function( element, index ) {
		//The first element describes the structure of the data, but is not data itself.
		if( index !== 0 ) {
			let population = Number( element[0] );
			let city_name = "";
			let state = "";
			//Group 1: city-name, Group 2: (non-capture) optional city description, Group 3: (non-capture) all the various optional city classifications from the census, Group 4: state
			let re = /(.+?)(?:,.+)? ?(?:village|town|city|municipality|borough|unified government|unified government \(balance\)|city and borough|\(balance\)|city \(balance\)|corporation|urban county|consolidated government|consolidated government \(balance\)|metropolitan government| metropolitan government \(balance\)|metro government \(balance\))?, ([\w ^,]+)/;

			//Run the regex and parse out the appropriate data.
			let capture_grps = re.exec(element[1]);
			if( capture_grps === null ) {
				console.log( "Regex failed for: " + element[1] );
			}
			else {
				//If the regex passed then update our data.
				city_name = capture_grps[1];
				state = capture_grps[2];

				//Build the city_data and state select arrays.
				city_data.push( [city_name, state, population] );
				if( !states.includes( state ) ) {
					states.push( state );
				}
			}
		}
	});

	//Contruct the state select element from the states array.

	//Default "-Any-" option
	let states_select = document.getElementById( "states" );
	states_select.options[0] = null;
	let option_any = document.createElement( "option" );
	option_any.text = "-Any-";
	states_select.add( option_any );
	//State options
	states.forEach( function( element ){
		let state_option = document.createElement( "option" );
		state_option.text = element;
		states_select.add( state_option );
	});

	//Default to "-Any-" selected.
	states_select.value = "-Any-";


	//Registering the Vue component.
	let app = new Vue({
		el: "#app",
		//Providing the city data and setting the default filters.
		data: {
			city_data : city_data,
			states_to_search: ["-Any-"],
			min_pop: 100000, 		//Absolute max and min values for pouplation filters
			max_pop: 10000000,		//are 10 million and 0.
			search_term: "",
			sort_method: "state", 	//sort methods -> "state" | "city_name" | "population"
			sort_order: "asc" 		//sort_order -> "asc" | "desc"
		},
		computed: {
			filtered_data: function() {
				let f_data = [];

				//Filtered data will recalculate when any filters change.
				let params = {
					min_pop: this.min_pop,
					max_pop: this.max_pop,
					states_to_search: this.states_to_search,
					search_term: this.search_term,
					sort_method: this.sort_method,
					sort_order: this.sort_order
				};
				//getDisplayData defined in component-methods.js
				f_data = this.getDisplayData( params );
				return f_data;
			}
		},
		watch: {
			//Both the watched properties are for input fields.

			//Using debounce to avoid overcalculating while the user is typing.
			min_pop: _.debounce(function( newVal, oldVal ) {
				//Make sure the newVal is still a number
				if(newVal === ""){
					this.min_pop = 0;
				}
				//Make sure the minimum is actually the minimum.
				if( Number( newVal ) > Number( this.max_pop ) ) {
					this.max_pop = Number( newVal );
				}

				//Make sure the new value is within the global min and max.
				if( Number( newVal ) > 10000000)
					this.min_pop = 10000000;
				if( Number( newVal ) < 0 )
					this.min_pop = 0;
			}, 500 ),

			max_pop: _.debounce( function( newVal, oldVal ) {
				//Make sure the newVal is still a number.
				if(newVal == "") {
					this.max_pop = 0;
				}

				//Make sure the maximum is actually the maximum.
				if( Number( newVal ) < Number( this.min_pop ) ) {
					this.min_pop = Number(newVal);
				}

				//Make sure the new value is within the global min and max.
				if( Number( newVal ) > 10000000 )
					this.max_pop = 10000000;
				if( Number( newVal ) < 0 )
					this.max_pop = 0;
			}, 500 )
		},
		//Methods defined in component-methods.js
		methods: {
			getDisplayData: getDisplayData,

			compare_function: compare_function,

			sort_func: sort_func
		}
	});


	//This section is only relevant to the noUiSlider.
	//Placed after the Vue component delcaration because Vue will
	//wipe all references to elements within a component once it mounts,
	//meaning that the references need to be decalred after the Vue component
	//has already been mounted.


	//Grabbing references to the number input fields
	let min_pop_element = document.getElementById( "min-pop" );
	let max_pop_element = document.getElementById( "max-pop" );

	//end -> "min" | "max". It represents which end of the noUiSlider
	//was changed to trigger the event.
	function updateSlider( end ) {
		//If the noUiSlider does not exist, no need to proceed.
		if( typeof slider.noUiSlider === "undefined" )
			return;

		//Otherwise check the values.
		let min_val = min_pop_element.value;
		let max_val = max_pop_element.value;

		//If the values are not consistent:
		if( Number( min_val ) > Number( max_val ) ) {
			//Then update the value that was *NOT* changed
			//to the value that was changed.
			if(end === "min")
				max_val = min_val;
			else {
				min_val = max_val;
			}
		}
		//Reflect these changes on the slider.
		slider.noUiSlider.set( [min_val, max_val] );
	}

	//Register the event listeners for the input fields.
	function updateMinSlider(e) { e.preventDefault(); updateSlider( 'min' ); }

	function updateMaxSlider(e) { e.preventDefault(); updateSlider( 'max' ); }


	min_pop_element.addEventListener( "input", updateMinSlider );

	max_pop_element.addEventListener( "input", updateMaxSlider );
}
