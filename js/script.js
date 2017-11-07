//read data;
d3.csv('data/Pu_TOT.csv', function (error, data) {
    if (error) throw error;
    let plots = new Plots(data, 600, 120);
    window.plots = plots;
    window.plots.histogramPlot();
});

class Plots {

    constructor(data, widht, height) {
        this.data = data;
        this.margin = {top: 5, right: 5, bottom: 20, left: 30};
        this.width = widht;
        this.height = height;

        this.plot = d3.select("#hdPlot");
    }

    //printPlots
    printPlots() {
        let dataFile = document.getElementById('dataset').value;
        switch (dataFile) {
            case "Coordinate": {
                this.clearPlots();
                this.rawDataPlot();
                break;
            }
            case "BoxPlot": {
                this.clearPlots();
                this.boxPlot();
                break;
            }
            case "Histogram":{
                this.clearPlots();
                this.histogramPlot();
                break;
            }

            case "HDView": {
                break;
            }

            case "Stats": {
                break;
            }

            default:
        }
    }

    //rawDataPlot
    rawDataPlot() {

        let data = this.data;
        let margin = this.margin;
        let height = this.height;
        let width = this.width;
        let newplot = this.plot;

        //load data as array
        var attr = data.columns;
        var datacol = attr.length;
        var datarow = data.length;
        var obj = {};
        for (let j = 0; j < datacol; j++)
            obj[attr[j]] = [];
        for (let i = 0; i < datarow; i++) {
            for (let j = 0; j < datacol; j++) {
                obj[attr[j]].push(parseFloat(data[i][attr[j]]));
            }
        }

        var value = function (d) {
            return d;
        }; // data -> value

        let minVal = d3.min(obj[attr[datacol - 1]], value);
        let maxVal = d3.max(obj[attr[datacol - 1]], value);


        let yScale = d3.scaleLinear()
                .range([height - margin.top - margin.bottom, 0])
                .nice(), // value -> display
            yAxis = d3.axisLeft(yScale);
        let xScale = d3.scaleLinear()
                .range([0, width - margin.left - margin.right])
                .domain([minVal, maxVal])
                .nice(), // value -> display
            xAxis = d3.axisBottom(xScale);
        var colorScale = d3.scaleLinear()
            .range(['blue', 'red'])
            .domain([minVal, maxVal]);


        var curplot;
        for (let i = 0; i < datacol - 1; i++) {

            yScale.domain([d3.min(obj[attr[i]], value), d3.max(obj[attr[i]], value)]);
            newplot.append("svg")
                .attr('id', "plot" + i);
            curplot = d3.select("#plot" + i);

            curplot.attr("height", height)
                .attr("width", width);
            //.attr()
            curplot.append('g').attr('id', "xAxis" + i);
            curplot.append('g').attr('id', "yAxis" + i);

            curplot.selectAll("circle")
                .data(obj[attr[i]])
                .enter()
                .append("circle")
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

    //clearPlots
    clearPlots() {
        let allPlots = d3.select("#hdPlot")
            .selectAll("svg")
            .remove();

    }

    //BoxPlot
    boxPlot() {
        let data = this.data;
        let margin = this.margin;
        let height = this.height - margin.top - margin.bottom;
        let width = this.width - margin.left - margin.right;
        let newplot = this.plot;
        let barWidth = 30;

        //load data as array
        let attr = data.columns;
        let datacol = attr.length;
        let datarow = data.length;
        let obj = {};
        for (let j = 0; j < datacol; j++)
            obj[attr[j]] = [];
        for (let i = 0; i < datarow; i++) {
            for (let j = 0; j < datacol; j++) {
                obj[attr[j]].push(parseFloat(data[i][attr[j]]));
            }
        }

        for (let i = 0; i < datacol - 1; i++) {
            let groupCount = obj[attr[i]];
            groupCount.sort(function (a, b) {
                return a - b
            });
            let record = {};
            let localMin = d3.min(groupCount);
            let localMax = d3.max(groupCount);

            record["counts"] = groupCount;
            record["quartile"] = boxQuartiles(groupCount);
            record["whiskers"] = [localMin, localMax];

            let xScale = d3.scaleLinear()
                .domain([localMin, localMax])
                .range([0, width]);

            newplot.append("svg")
                .attr("height", height)
                .attr("width", width)
                .append('g')
                .attr('id', "boxPlot" + i)
                .attr("transform", "translate(" + [margin.left, margin.top] + ")");
            let g = newplot.select("#boxPlot" + i);

            g.append("line")
                .attr("x1", xScale(record.whiskers[0]))
                .attr("y1", height / 2)
                .attr("x2", xScale(record.whiskers[1]))
                .attr("y2", height / 2)
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("fill", "none");

            g.append("rect")
                .attr("height", barWidth)
                .attr("width", xScale(record.quartile[2]) - xScale(record.quartile[0]))
                .attr("x", xScale(record.quartile[0]))
                .attr("y", height / 2 - barWidth / 2)
                .attr("fill", "green")
                .attr("stroke", "#000")
                .attr("stroke-width", 1);


            g.append("line")
                .attr("x1", xScale(record.quartile[1]))
                .attr("y1", height / 2 - barWidth / 2)
                .attr("x2", xScale(record.quartile[1]))
                .attr("y2", height / 2 + barWidth / 2)
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("fill", "none");


        }

        function boxQuartiles(d) {
            return [
                d3.quantile(d, .25),
                d3.quantile(d, .5),
                d3.quantile(d, .75)
            ];
        }
    }

    histogramPlot() {
        let data = this.data;
        let margin = this.margin;
        let height = this.height - margin.top - margin.bottom;
        let width = this.width - margin.left - margin.right;
        let newplot = this.plot;
        let barWidth = 30;

        //load data as array
        let attr = data.columns;
        let datacol = attr.length;
        let datarow = data.length;




        let numOfBins = 10;

        for (let i = 0; i < datacol - 1; i++) {
            let y_attr = attr[datacol - 1];
            let curData = [];
            for (let j = 0; j < datarow; j++) {
                let dict = {};
                dict[y_attr] = parseFloat(data[j][y_attr]);
                dict[attr[i]] = parseFloat(data[j][attr[i]]);
                curData.push(dict);
            }
            let value = function (d) {
                return d[y_attr];
            };

            let minVal = d3.min(curData, value);
            let maxVal = d3.max(curData, value);

            let x = d3.scaleLinear()
                .domain([minVal, maxVal])
                .rangeRound([0, width]);
            let y = d3.scaleLinear()
                .range([height, 0]);

            let histogram = d3.histogram()
                .value(function(d) { return d[y_attr]; })
                .domain(x.domain())
                .thresholds(x.ticks(20));

            let bins = histogram(curData);

            y.domain([0, d3.max(bins, function(d) { return d.length; })]);

            let svg = newplot.append("svg")
                .attr("height", this.height)
                .attr("width", this.width)
                .append('g')
                .attr('id', "boxPlot" + i)
                .attr("transform", "translate(" + [margin.left, margin.top] + ")");

            svg.selectAll("rect")
                .data(bins)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", 1)
                .attr("transform", function(d) {
                    return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return height - y(d.length); });

            svg
                .append('g')
                .attr('id', "xAxis" + i)
                .call(d3.axisBottom(x))
                .attr("transform", "translate(" + [margin.left, height] + ")");//.attr("class","label");;
            svg
                .append('g')
                .attr('id', "yAxis" + i)
                .call(d3.axisLeft(y))
                    .attr("transform", "translate(" + [margin.left, margin.top] + ")");//.attr("class","label");;

        }
    }
}

function printPlots() {
    window.plots.printPlots()
}