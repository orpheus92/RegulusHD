

//read data;
d3.csv('data/Pu_TOT.csv', function (error, data) {
    if (error) throw error;
    let plots = new Plots(data, 600, 120);
    plots.printPlots();
});

class Plots {

    constructor(data, widht, height){
        this.data = data;
        this.margin = {top: 5, right: 5, bottom: 20, left: 30};
        this.width = widht;
        this.height = height;
    }

    //printPlots
    printPlots(){
        let dataFile = document.getElementById('dataset').value;
        switch(dataFile){
            case "Coordinate":{
                this.rawDataPlot();
                break;
            }
            case "Pairwise":{

            }
                break;
            case "HDView":{

            }
                break;
            case "Stats":{

            }
                break;
            default:
                ;
        }
    }

    //rawDataPlot
    rawDataPlot() {

        let data = this.data;
        let margin = this.margin;
        let height = this.height;
        let width = this.width;

        //load data as array
        var attr = data.columns;
        var datacol = attr.length;
        var datarow = data.length;
        var obj = {};
        for (var j = 0; j < datacol; j++)
            obj[attr[j]] = [];
        for (var i = 0; i < datarow; i++) {
            for (j = 0; j < datacol; j++) {
                obj[attr[j]].push(parseFloat(data[i][attr[j]]));
            }
        }

        var value = function(d) {return d;}; // data -> value

        let minVal = d3.min(obj[attr[datacol - 1]], value);
        let maxVal = d3.max(obj[attr[datacol - 1]], value);

        var newplot = d3.select("#hdPlot");



        let yScale = d3.scaleLinear()
                .range([height-margin.top-margin.bottom,0])
                .nice(), // value -> display
            yAxis = d3.axisLeft(yScale);
        let xScale = d3.scaleLinear()
                .range([0, width-margin.left-margin.right])
                .domain([minVal, maxVal])
                .nice(), // value -> display
            xAxis = d3.axisBottom(xScale);
        var colorScale = d3.scaleLinear()
            .range(['blue', 'red'])
            .domain([minVal, maxVal]);


        var curplot;
        for (i = 0; i < datacol - 1; i++) {

            yScale.domain([d3.min(obj[attr[i]], value), d3.max(obj[attr[i]], value)]);
            newplot.append("svg")
                .attr('id', "plot" + i);
            curplot = d3.select("#plot" + i);

            curplot.attr("height", height)
                .attr("width", width);
            //.attr()
            curplot.append('g').attr('id', "xAxis" + i);
            curplot.append('g').attr('id', "yAxis" + i);
            curplot.append('g').attr('id', "scatter" + i);
            curplot.selectAll("#scatter" + i).data(obj[attr[i]])
                .enter().append("circle")
                .attr("r", 1)
                .attr("cx", function (d, i) {
                    return xScale(obj[attr[datacol - 1]][i]);
                })
                .attr("transform", "translate(" + [margin.left, height - margin.bottom] + ")")
                .attr("cy", function (d) {
                    return yScale(d);
                })
                .attr("transform", "translate(" + [margin.left, margin.top] + ")")
                .attr('fill', function (d, i) {
                    return colorScale(obj[attr[datacol - 1]][i]);
                });

            xAxis.scale(xScale);
            yAxis.scale(yScale);

            curplot.select("#xAxis" + i).call(xAxis).attr("transform", "translate(" + [margin.left, height - margin.bottom] + ")");//.attr("class","label");
            //Translate for y_val will be modified later
            curplot.select("#yAxis" + i).call(yAxis).attr("transform", "translate(" + [margin.left, margin.top] + ")");//.attr("class","label");
        }
    }
}
