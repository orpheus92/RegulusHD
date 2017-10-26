/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {
	//console.log("Inside updateInfo");
        // ******* TODO: PART III *******
	//let Winner = oneWorldCup.winner;
	//let Silver = oneWorldCup.runner_up;
	//let Teams = oneWorldCup.TEAM_NAMES;
	let host = d3.select('#host');//.append("text", oneWorldCup.host);
	host.selectAll("text").remove();
	host.append("text")
	.text(oneWorldCup.host);
	//console.log(host);

	let Winner = d3.select('#winner');//.append("text", oneWorldCup.host);
	Winner.selectAll("text").remove();
	Winner.append("text")
	.text(oneWorldCup.winner);
	//console.log(host);

	let Silver = d3.select('#silver');//.append("text", oneWorldCup.host);
	Silver.selectAll("text").remove();
	Silver.append("text")
	.text(oneWorldCup.runner_up);
	//console.log(host);

	let Teams = d3.select('#teams').data(oneWorldCup.teams_names);//.append("text", oneWorldCup.host);
//	console.log(Teams);
	Teams.selectAll("text").remove();
	//console.log(oneWorldCup.teams_names);

    
Teams.append("text")       
    .each(function (d) {
    var arr = oneWorldCup.teams_names;
    //console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        d3.select(this).append("li")
            .text(arr[i])
            .attr("dy", i ? "1.2em" : 0)
            .attr("x", 0)
            .attr("text-anchor", "middle")
            .attr("class", "li" + i);
    }
});
        //Teams.append("text")
	//.text(oneWorldCup.teams_names);
    }

//console.log(Teams);
	//console.log(host);

        // Update the text elements in the infoBox to reflect:
        // World Cup Title, host, winner, runner_up, and all participating teams that year

        // Hint: For the list of teams, you can create an list element for each team.
        // Hint: Select the appropriate ids to update the text content.

        //Set Labels

    

}
