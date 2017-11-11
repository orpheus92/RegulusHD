//read data;
d3.csv('data/Pu_TOT.csv', function (error, data) {
    if (error) throw error;
    let plots = new Plots(data, 600, 150);
    window.plots = plots;
    window.plots.histogramPlot();
});

d3.json('data/partitions.json', function (error, data) {
    //let tree = new Tree();
    //tree.createTree(data);
})

class Plots {

    constructor(data, widht, height) {
        this.data = data;
        this.margin = {top: 20, right: 30, bottom: 20, left: 40};
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
            case "Histogram": {
                this.clearPlots();
                this.histogramPlot();
                break;
            }
            case "Pairwise": {
                this.clearPlots();
                this.PairwisePlot();
                break;
            }
            case "Stats": {
                break;
            }

            default:
        }
    }

    PairwisePlot() {
        let data = this.data;
        let margin = this.margin;
        let height = this.height - margin.top - margin.bottom;
        let width = this.width - margin.left - margin.right;
        let newplot = this.plot;

        //load data as array
        let attr = data.columns;
        let datacol = attr.length;
        let datarow = data.length;

        for (let i = 0; i < datacol - 1; i++) {
            for (let i_2 = i + 1; i_2 < datacol - 1; i_2++) {
                let curData = [];
                for (let j = 0; j < datarow; j++) {
                    let curPoint = {};
                    curPoint.x = parseFloat(data[j][attr[i]]);
                    curPoint.y = parseFloat(data[j][attr[i_2]]);
                    curData.push(curPoint);
                }

                let x_minVal = d3.min(curData, function (d) {
                    return d.x;
                });
                let x_maxVal = d3.max(curData, function (d) {
                    return d.x;
                });
                let y_minVal = d3.min(curData, function (d) {
                    return d.y;
                });
                let y_maxVal = d3.max(curData, function (d) {
                    return d.y;
                });

                let x = d3.scaleLinear()
                    .domain([x_minVal, x_maxVal])
                    .range([0, width])
                    .nice();
                let y = d3.scaleLinear()
                    .domain([y_minVal, y_maxVal])
                    .range([0, height])
                    .nice();

                var colorScale = d3.scaleLinear()
                    .range(['blue', 'red'])
                    .domain([y_minVal, y_maxVal]);

                let svg = newplot.append("svg")
                    .attr("height", this.height)
                    .attr("width", this.width)
                    .append('g')
                    .attr('id', "pairwisePlot" + i)
                    .attr("transform", "translate(" + [margin.left, margin.top] + ")");

                svg.selectAll("circle")
                    .data(curData)
                    .enter()
                    .append("circle")
                    .attr("r",1)
                    .attr("cx", function (d) {
                        return x(d.x);
                    })
                    .attr("cy", function (d) {
                        return y(d.y);
                    })
                    .attr('fill', function (d) {
                        return colorScale(d.y);
                    });

                svg
                    .append('g')
                    .attr('id', "xAxis" + i)
                    .call( d3.axisBottom(x).scale(x))
                    .attr("transform", "translate(" + [0, height] + ")");//.attr("class","label");;
                svg
                    .append('g')
                    .attr('id', "yAxis" + i)
                    .call(d3.axisLeft(y).scale(y));

            }
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
                .attr("height", this.height)
                .attr("width", this.width)
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

            g.append("text")
                .attr("x", xScale(record.quartile[0]))
                .attr("y", height / 2 + 15 + barWidth / 2)
                .text(record.quartile[0].toFixed(2))
                .attr("style", "text-anchor: middle;");
            g.append("text")
                .attr("x", xScale(record.quartile[1]))
                .attr("y", height / 2 + 15 + barWidth / 2)
                .text(record.quartile[1].toFixed(2))
                .attr("style", "text-anchor: middle;");
            g.append("text")
                .attr("x", xScale(record.quartile[2]))
                .attr("y", height / 2 + 15 + barWidth / 2)
                .text(record.quartile[2].toFixed(2))
                .attr("style", "text-anchor: middle;");
            g.append("text")
                .attr("x", xScale(record.whiskers[1]))
                .attr("y", height / 2 + 15)
                .text(record.whiskers[1].toFixed(2))
                .attr("style", "text-anchor: middle;");
            g.append("text")
                .attr("x", xScale(record.whiskers[0]))
                .attr("y", height / 2 + 15)
                .text(record.whiskers[0].toFixed(2))
                .attr("style", "text-anchor: middle;");


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
            let curData = [];
            for (let j = 0; j < datarow; j++) {
                curData.push(parseFloat(data[j][attr[i]]));
            }
            let value = function (d) {
                return d;
            };

            let minVal = d3.min(curData, value);
            let maxVal = d3.max(curData, value);

            let x = d3.scaleLinear()
                .domain([minVal, maxVal])
                .rangeRound([0, width])
            let y = d3.scaleLinear()
                .range([height, 0]);

            let tickrange = d3.range(minVal, maxVal, (maxVal - minVal) / 10);

            let histogram = d3.histogram()
                .value(function (d) {
                    return d;
                })
                .domain(x.domain())
                .thresholds(tickrange);

            let bins = histogram(curData);

            y.domain([0, d3.max(bins, function (d) {
                return d.length;
            })]);

            let svg = newplot.append("svg")
                .attr("height", this.height)
                .attr("width", this.width)
                .append('g')
                .attr('id', "boxPlot" + i)
                .attr("transform", "translate(" + [margin.left, margin.top] + ")");

            svg.selectAll("rect")
                .data(bins)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", 0)
                .attr("transform", function (d) {
                    return "translate(" + x(d.x0) + "," + y(d.length) + ")";
                })
                .attr("width", function (d) {
                    return x(d.x1) - x(d.x0);
                })
                .attr("height", function (d) {
                    return height - y(d.length);
                })
                .style("fill", "blue")
                .style("stroke", "white")
                .style("stroke-width", 1);

            svg
                .append('g')
                .attr('id', "xAxis" + i)
                .call(d3.axisBottom(x).tickValues(tickrange))
                .attr("transform", "translate(" + [0, height] + ")");//.attr("class","label");;
            svg
                .append('g')
                .attr('id', "yAxis" + i)
                .call(d3.axisLeft(y))
            //.attr("transform", "translate(" + [margin.left, margin.top] + ")");//.attr("class","label");;

        }
    }
}

function printPlots() {
    window.plots.printPlots()
}