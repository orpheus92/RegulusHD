var margin = {top: 20, right: 20, bottom: 60, left: 60},
    width = 900,
    height = 400;

var attr;
var yValue = function(d,i) { console.log(d);
                            console.log(i);
                            console.log(d[i]);return d[i];}, // data -> value
    yScale = d3.scaleLinear().range([0,height-margin.top-margin.bottom]).nice(), // value -> display
    //yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft(yScale);
//var i;
var xValue = function(d,i) { return d[i];}, // data -> value
    xScale = d3.scaleLinear().range([0, width-margin.left-margin.right]).nice(), // value -> display
    //xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom(xScale);

var newplot = d3.select("#hdPlot");

//var svg = d3.select("#hdPlot").append('svg');
//console.log(svg);

//d3.select('#plots').attr("transform", "translate("+[100, 100]+")");

readData('data/Pu_TOT.csv');

//CB function to readdata & create plot
function readData(data){
    //console.log(data);
    //var field1;
    //var field2;
    d3.csv(data, function (error, data) {
        /*csv.map(function(d){

            field1.push(d.name);
            field2.push(+d.value);
        })
       */

          data.forEach(function (d) {
            d = +d.value;
        });
          console.log(data);

        var keys = Array.from( data.keys() );


    //var aa = d3.csvParse(data);
        console.log(keys);

        attr = data.columns.length-1;
        // # of input attributes

        var size = data.length;
        //console.log(size);

        var curplot;
        for(var i = 0; i<attr;i++ ){
            // X, y domains
            //console.log(d3.min([data,i], xValue));
            //console.log(d3.max(xValue(data)));
            var col = data.columns;
            //console.log(col[i]);
            console.log(d3.min([data,col[i]], xValue));
            yScale.domain([d3.min([data,col[i]], xValue), d3.max([data,col[i]], xValue)]);
            xScale.domain([d3.min([data,col[attr]], yValue), d3.max([data,col[attr]], yValue)]);
            newplot.append("svg").attr('id',"plot"+i);
            curplot = d3.select("#plot"+i);
            //newplot = newplot.merge(curplot);
            //console.log(curplot);
            curplot.attr("height",400)
                .attr("width",900);
                //.attr()
            curplot.append('g').attr('id',"xAxis"+i);
            curplot.append('g').attr('id',"yAxis"+i);

            xAxis.scale(xScale);
            yAxis.scale(yScale);

            //xAxis.attr("transform", "translate("+[left, top]+")");
            //var x = d3.select("#xAxis")
            //    .attr("transform", "translate("+[left, height-bottom]+")");
            //console.log(height-margin.bottom)
            //console.log("translate("+[margin.left,height-margin.bottom]+")");
            curplot.select("#xAxis"+i).call(xAxis).attr("transform","translate("+[margin.left,height-margin.bottom]+")");//.attr("class","label");
            curplot.select("#yAxis"+i).call(yAxis).attr("transform","translate("+[margin.left,margin.top]+")");//.attr("class","label");

            d3.select("#xAxis").selectAll("text").attr("transform"," translate(-12,25) rotate(-90)");
        }
        console.log(newplot);
        //Create a different group for each plot


// x-axis
     /*   var x = d3.select("#xAxis")
            .attr("transform", "translate("+[margin.left, height-margin.bottom]+")");

        x.call(xAxis);//.attr("class","label");

        d3.select("#xAxis").selectAll("text").attr("transform"," translate(-12,25) rotate(-90)");

        // y-axis
        var y = d3.select("#yAxis")
            .attr("transform", "translate("+[margin.left, margin.top]+")");
        y.call(yAxis);
*/

    });




}

