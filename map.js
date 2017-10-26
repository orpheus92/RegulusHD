/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here.

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();
	//console.log(worldcupData);
    d3.json("data/world.json", function (error, world) {
        if (error) throw error;
	//console.log(world);
        let countries = topojson.feature(world, 		world.objects.countries).features;
	//console.log(countries);        
barChart.worldMap.drawMap(countries);
	//console.log(countries);
    });
    var projection = this.projection;
	//console.log(worldcupData);
	let path = d3.geoPath().projection(projection);

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.

//Winner location
	let lon = worldcupData.win_pos[0];
	let lat = worldcupData.win_pos[1];
	let first = d3.select('#points');

	first.selectAll("circle").remove();             
		
                first.append("circle")
                .attr("cx",projection([lon,lat])[0])
		.attr("cy",projection([lon,lat])[1])
                .attr("r", 5)
                .style("opacity", 0.8)
		.attr('class', "gold");

//Silver location
	let lon2 = worldcupData.ru_pos[0];
	let lat2 = worldcupData.ru_pos[1];
	let second = d3.select('#points');
	
                second.append("circle")
                .attr("cx",projection([lon2,lat2])[0])
		.attr("cy",projection([lon2,lat2])[1])
                .attr("r", 5)
                .style("opacity", 0.8)
		.attr('class', "silver");
//Update teams and hosts

    var map = d3.select("#map");

    map
        .selectAll(".countries")
        .attr("class",
              function (d) {
                  if (d.id == worldcupData.host_country_code) {
                      return "countries host"
                  } else if (worldcupData.teams_iso.includes(d.id)) {
                      return "countries team"
                  } else {
                      return "countries"
                  }
              });



        // Iterate through all participating teams and change their color as well.

        // We strongly suggest using CSS classes to style the selected countries.


        // Add a marker for gold/silver medalists
    }
colorMap(country) {


}
    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {
// ******* TODO: PART IV *******

        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)
    var projection = this.projection;
	//console.log(world);
    // create path variable
    var path = d3.geoPath().projection(projection);
    var map = d3.select('#map');
    // countries
    map
        .selectAll('path')
        .data(world)
        .enter()
        .append('path')
        .attr('class', 'countries')
        .attr('d', path)
        .attr('id', function(d) {return d.id});

	let graticule = d3.geoGraticule();
	d3.select("#map").append('path').datum(graticule).attr('class', "grat").attr('d', path).attr('fill', 'none');

        // updateMap() will need it to add the winner/runner_up markers.)

        

    }


}
