/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {
	let dur = 1000;
	let aScale = d3.scaleLinear()
        .domain([0, d3.max(this.allData, d => d[selectedDimension])])
        .range([0, 300]);
	let width = 500,
	height = 400,
	left = 60,
	bottom = 60,
	right = 20,
	top = 20;
        // ******* TODO: PART I *******


        // Create the x and y scales; make
        // sure to leave room for the axes
	let yScale = d3.scaleLinear()
	.domain([0, d3.max(this.allData, d => d[selectedDimension])])    
// values between 0 and 100
	.range([height-bottom-top,0])
	.nice();


	let xScale = d3.scaleBand()
    	.domain(this.allData.map(d => d.year))
    	.range([0, width-left-right])
    	.paddingInner([0.1])
	.paddingOuter([0.3])
	.align([0.5]);


        // Create colorScale
	let cScale = d3.scaleLinear()
	.domain([0, d3.max(this.allData, d => d[selectedDimension])])    
	.range(['#c6dbef', '#3182bd']);
        // Create the axes (hint: use #xAxis and #yAxis)

    let xAxis = d3.axisBottom()
	.tickSizeInner(4)
    	.tickSizeOuter(20)
	.tickPadding(3);

    xAxis.scale(xScale); 
    //xAxis.attr("transform", "translate("+[left, top]+")");
    var x = d3.select("#xAxis")
	.attr("transform", "translate("+[left, height-bottom]+")");

    x.call(xAxis).attr("class","label");
    d3.select("#xAxis").selectAll("text").attr("transform"," translate(-12,25) rotate(-90)");
    //console.log(x);

    let yAxis = d3.axisLeft();
    yAxis.scale(yScale);
    var y = d3.select("#yAxis")
	.attr("transform", "translate("+[left, top]+")")

    y.call(yAxis);


var xbar = d3.select("#bars").selectAll("rect").data(this.allData);
	xbar.exit()
            .transition()
            .duration(dur)
	    .attr("opacity", 0)
	    .remove();
	xbar = xbar.enter().append("rect").attr("height", 0).merge(xbar);
        xbar.transition()
            .duration(dur)
	    .attr("transform", "translate("+[left+6, height-bottom]+") scale(1,-1)")
//            .attr("style", "fill: steelblue")
            .attr("opacity", 1)
            .attr("x", function (d, i) {return i*20.5;})
            .attr("y", 0)
            .attr("width", 18)
	    .attr("height", function (d) {return aScale(d[selectedDimension]);})
	    .style('fill', function(d) { return cScale(d[selectedDimension]) });
	xbar.on("mouseover", function () {event.target.setAttribute("style", "fill: red");});

	xbar.on("mouseout", function () {
xbar.style('fill', function(d) { return cScale(d[selectedDimension]) });});
        // Create the bars (hint: use #bars)


        //console.log(this.worldMap);

        // ******* TODO: PART II *******
	xbar.on("click", function (d,i) {

	//console.log(d);
	//console.log(barChart.worldMap);
	barChart.worldMap.updateMap(d);
        barChart.infoPanel.updateInfo(d);
        //barChart.infoPanel.updateInfo(worldCup)
		});
        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
	let selectDim = document.getElementById('dataset').value;

        updateBarChart(selectDim)
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.

    }
}
