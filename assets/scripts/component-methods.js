//Loops through the city array and filters out
//unwanted elements, then sorts the remaining data.
function getDisplayData( filter ) {
	//Destructure the filter.
	let {
		min_pop,
		max_pop,
		states_to_search,
		search_term,
		sort_method,
		sort_order
	} = filter;

	let rv = [];

	this.city_data.forEach( function( element ) {
		//Assume that we will add this element.
		let add = true;

		//Do the quick number comparisons first.
		if( element[2] < Number( min_pop ) ) {
			add = false;
		}
		else if ( element[2] > Number( max_pop ) ) {
			add = false;
		}
		//Then check the states array.
		else if ( !states_to_search.includes( "-Any-" ) && !states_to_search.includes( element[1] ) ) {
			add = false;
		}
		//Only do the regex search as the final criteria.
		else if ( search_term !== "" ) {
			let search_re = new RegExp( search_term, 'i' );
			if( !search_re.test( element[0] ) )
				add = false;
		}

		//Push the element if it passed the filters.
		if( add ) {
			rv.push( element );
		}
	});
	//Once the data is filtered, then sort it.
	rv.sort( this.compare_function );

	return rv;
}

//The sort function for all three modes:
//State, City Name, and Population
function compare_function( a, b ){
	//Dynamically setting the before and after variables
	//so that the I can always assume ascending sort
	//when resolving comparisons, regardless of the sort order.
	let before = this.sort_order === "asc" ? -1 : 1;
	let after = before * -1;

	switch( this.sort_method ) {


		case "state":
			//Check state comparison.
			if( a[1] < b[1] )
				return before;
			else if( a[1] > b[1] )
				return after;

			//If the states are equal then sort by city name.
			//Note that the city names will always be in ascending
			//order within their state.
			else if( a[0] < b[0] )
				return -1;
			else if( a[0] > b[0] )
				return 1;

			//If somehow state and city name are equal, then the elements are equal.
			else
				return 0;
			break;


		case "city_name":
			//Check city name comparison.
			if( a[0] < b[0] )
				return before;
			else if( a[0] > b[0] )
				return after;

			//If cities have the same name sort by state.
			//Note that the states will be listed in ascending
			//order for a particular city name.
			else if( a[1] < b[1] )
				return -1;
			else if( a[1] > b[1] )
				return 1;

			//Should never have a city with a duplicate name
			//in the same state, but if there somehow is then
			//they will be treated equally.
			else
				return 0;
			break;


		case "population":
			//Compare the populations.
			if( Number( a[2] ) < Number( b[2] ) )
				return before;
			else if( Number( a[2] ) > Number( b[2] ) )
				return after;

			//Then compare the city names (always ascending order).
			else if( a[0] < b[0] )
				return -1;
			else if( a[0] > b[0] )
				return 1;

			//If still equal check the state (again, sorted in ascending order).
			else if( a[1] < b[1] )
				return -1;
			else if( a[1] > b[1] )
				return 1;

			//Should never hit here, but would return equal.
			else
				return 0;
			break;

		//For unknown sort_methods all elements would be equal.
		default:
			return 0;
			break;
	}
}

//This function is triggered by clicking on the table headers.
//It alters the sort method and/or the sort order for the Vue component.
//method -> "state" | "city_name" | "population"
function sort_func( method ) {
	//If the user was previously using a different method
	//then switch to this method and use the default sorting
	//order for the method.
	if( this.sort_method !== method ) {
		this.sort_method = method;
		//Default sorting order is ascending for "state" and "city_name"
		//but is descending for "population".
		this.sort_order = method === "population" ? "desc" : "asc";
	}
	//If the user clicked on the same heading again, then keep the method the same
	//but swap the sort order.
	else {
		if( this.sort_order === "asc" )
			this.sort_order = "desc";
		else {
			this.sort_order = "asc";
		}
	}
}
