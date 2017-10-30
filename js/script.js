var margin = {top: 20, right: 20, bottom: 60, left: 60},
    width = 800,
    height = 200;

var attr;
var yValue = function(d) {return d;}, // data -> value
    yScale = d3.scaleLinear().range([height-margin.top-margin.bottom,0]).nice(), // value -> display
    yAxis = d3.axisLeft(yScale);
var xValue = function(d) { return d;}, // data -> value
    xScale = d3.scaleLinear().range([0, width-margin.left-margin.right]).nice(), // value -> display
    xAxis = d3.axisBottom(xScale);
var colorScale = d3.scaleLinear()
    .range(['blue', 'red']);
var newplot = d3.select("#hdPlot");

readData('data/Pu_TOT.csv');

//CB function to readdata & create plot
function readData(data){


    d3.csv(data, function (error, data) {
        if (error) throw error;

        var attr = data.columns;
        var datacol = attr.length;
        var datarow = data.length;
        var obj={};
        for(var j = 0;j<datacol;j++)
            obj[attr[j]]=[];
        for(var i = 0; i<datarow;i++)
        {
            for(j = 0;j<datacol;j++)
            {
                obj[attr[j]].push(parseFloat(data[i][attr[j]]));
            }
        }
        var curplot;
        xScale.domain([d3.min(obj[attr[datacol-1]], yValue), d3.max(obj[attr[datacol-1]], yValue)]);
        colorScale.domain([d3.min(obj[attr[datacol-1]], yValue), d3.max(obj[attr[datacol-1]], yValue)]);
        for(i = 0; i<datacol-1;i++ ){
            // X, y domains

            var col = data.columns;

            yScale.domain([d3.min(obj[attr[i]], xValue), d3.max(obj[attr[i]], xValue)]);
            newplot.append("svg").attr('id',"plot"+i);
            curplot = d3.select("#plot"+i);

            curplot.attr("height",200)
                .attr("width",800);
                //.attr()
            curplot.append('g').attr('id',"xAxis"+i);
            curplot.append('g').attr('id',"yAxis"+i);
            curplot.append('g').attr('id', "scatter"+i);
            curplot.selectAll("#scatter"+i).data(obj[attr[i]])
                .enter().append("circle")
                .attr("r", 1)
                .attr("cx", function(d,i) { return xScale(obj[attr[datacol-1]][i]); })
                .attr("transform","translate("+[margin.left,height-margin.bottom]+")")
                .attr("cy", function(d) { return yScale(d); })
                .attr("transform","translate("+[margin.left,margin.top]+")")
                .attr('fill', function (d,i) {
                    return colorScale(obj[attr[datacol-1]][i]);
                });

            xAxis.scale(xScale);
            yAxis.scale(yScale);

            curplot.select("#xAxis"+i).call(xAxis).attr("transform","translate("+[margin.left,height-margin.bottom]+")");//.attr("class","label");
            //Translate for y_val will be modified later
            curplot.select("#yAxis"+i).call(yAxis).attr("transform","translate("+[margin.left,margin.top]+")");//.attr("class","label");

            //d3.select("#xAxis").selectAll("text").attr("transform"," translate(-12,25) rotate(-90)");
        }


    });




}

