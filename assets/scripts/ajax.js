// Already loading jQuery for Bootstrap 4, so utilizing jQuery's AJAX method.

/*
	Note: The data set is pretty large (about 19.5k 5-tuples).
	If the city filters are very inclusive I have performance drops
	on my Macbook when painting the cities table (on the Desktop it is fine however). 
*/

// Reaching out to the census.gov API. Data is from 2016.
$.ajax(
{
	url: "https://api.census.gov/data/2016/pep/population?get=POP,GEONAME&for=place:*&key=471426acb7ff08e78545b593d25ef77c68a2e1ee",
	type: "GET",
	//Defined in init-component.js
	success: initComponent
});
