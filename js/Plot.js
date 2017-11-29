//export {Plots} from './Plot';
class Plots {

    constructor(data, widht, height) {
        this._rawdata = data;
        this._data = data;
        this._margin = {top: 20, right: 30, bottom: 20, left: 40};
        this._width = widht;
        this._height = height;

        this._plot = d3.select("#hdPlot");
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
        let data = this._data;
        let margin = this._margin;
        let height = this._height - margin.top - margin.bottom;
        let width = this._width - margin.left - margin.right;
        let newplot = this._plot;

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

                let colorScale = d3.scaleLinear()
                    .range(['blue', 'red'])
                    .domain([y_minVal, y_maxVal]);

                let svg = newplot.append("svg")
                    .attr("height", this._height)
                    .attr("width", this._width)
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

        let data = this._data;
        let margin = this._margin;
        let height = this._height;
        let width = this._width;
        let newplot = this._plot;

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

        let value = function (d) {
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
        let colorScale = d3.scaleLinear()
            .range(['blue', 'red'])
            .domain([minVal, maxVal]);


        let curplot;
        for (let i = 0; i < datacol - 1; i++) {

            yScale.domain([d3.min(obj[attr[i]], value), d3.max(obj[attr[i]], value)]);
            newplot.append("svg")
                .attr('id', "plot" + i);
            //console.log(obj[attr[datacol - 1]]);
            //console.log(obj[attr[i]]);
            curplot = d3.select("#plot" + i).data([{
                x: obj[attr[datacol - 1]],//d3.range(n).map(function(i) { return i / n; }),
                y: obj[attr[i]]//d3.range(n).map(function(i) { return Math.sin(4 * i * Math.PI / n) + (Math.random() - .5) / 5; })
            }]);

            //console.log(curplot);

            curplot.attr("height", height)
                .attr("width", width);
            //.attr()
            curplot.append('g').attr('id', "xAxis" + i);
            curplot.append('g').attr('id', "yAxis" + i);

            //let loess = science.stats.loess().bandwidth(.2),
            //    line = d3.line()
            //        .x(function(d) { return xScale(d[0]); })
            //        .y(function(d,ind) { return yScale(obj[attr[i]][ind]); });

            curplot.selectAll("circle")
                //.data(obj[attr[i]])
                .data(function(d) {
                    //console.log(d.x);
                    //console.log(d.y);
                    return d3.zip(d.x, d.y); })
                .enter()
                .append("circle")
                .attr("r", 1)
                .attr("cx", function(d) { return xScale(d[0]); })
                .attr("cy", function(d) { return yScale(d[1]); })
                //.attr("cx", function (d, i) {
                //    return xScale(obj[attr[datacol - 1]][i]);
                //})
                .attr("transform", "translate(" + [margin.left, height - margin.bottom] + ")")
                //.attr("cy", function (d) {
                //    return yScale(d);
                //})
                .attr("transform", "translate(" + [margin.left, margin.top] + ")")
                .attr('fill', function (d) {
                    return colorScale(d[0]);
                });
                /*
                let faithful = obj[attr[datacol - 1]];
                console.log(faithful);
                let density = kernelDensityEstimator(kernelEpanechnikov(7), xScale.ticks(40))(faithful);
            //console.log(loess(1,2));
                console.log(density);
                curplot.selectAll("path")
                //.data(function(d) {
                //    return d3.zip(d.x, d.y); })
                    .datum(density)
                    .enter()
                    .append("path")
                    .attr("fill", "none")
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1.5)
                    .attr("stroke-linejoin", "round")
                    .attr("d",  d3.line()
                        .curve(d3.curveBasis)
                        .x(function(d) { return x(d[0]); })
                        .y(function(d) { return y(d[1]); }));
                        */
            /*
            curplot.selectAll("path")
                .data(function(d) {
                console.log(d.x);
                console.log(d.y);
                console.log(loess(d.x, d.y));
                    return [d3.zip(d.x, loess(d.x, d.y))];//[d3.zip(obj[attr[datacol - 1]][i], loess(obj[attr[datacol - 1]][i], d))];
                })
                .enter().append("path")
                .attr("d", line);
            */

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
        let data = this._data;
        let margin = this._margin;
        let height = this._height - margin.top - margin.bottom;
        let width = this._width - margin.left - margin.right;
        let newplot = this._plot;
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
                .attr("height", this._height)
                .attr("width", this._width)
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
        let data = this._data;
        let margin = this._margin;
        let height = this._height - margin.top - margin.bottom;
        let width = this._width - margin.left - margin.right;
        let newplot = this._plot;
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
                .attr("height", this._height)
                .attr("width", this._width)
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

    update(nodeinfo){
        let selectdata = [];
        //console.log(typeof(this._rawdata));
        nodeinfo.data._total.forEach(d=>{
            //console.log(this._rawdata[d]);
            selectdata.push(this._rawdata[d]);

        });
        //console.log(this._rawdata);
        this._data = selectdata;
        this._data.columns = this._rawdata.columns;
        //console.log(this._data);
        //console.log("Update Plot");
        this.printPlots();
        //window.plots.printPlots();
        //console.log(this._rawdata);
        //console.log(selectdata);
        //this._rawdata
        //console.log(nodeinfo);
        //console.log("Update");
    }

}

function printPlots() {
    window.plots.printPlots()
}

function kernelDensityEstimator(kernel, X) {
    return function(V) {
        return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
    };
}

function kernelEpanechnikov(k) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}