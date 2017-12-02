//export {Plots} from './Plot';
class Plots {

    constructor(data, widht, height) {
        this._rawdata = data;
        this._data = data;
        this._margin = {top: 20, right: 30, bottom: 50, left: 60};
        this._width = widht;
        this._height = height;
        this._plot = d3.select("#hdPlot");
        this._y_attr = document.getElementById('y_attr').value;
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

    //pairwisePlot
    PairwisePlot() {
        d3.selectAll('#plottip').remove();
        let data = this._data;
        let margin = this._margin;
        let height = this._height - margin.top - margin.bottom;
        let width = this._width - margin.left - margin.right;
        let newplot = this._plot;

        //load data as array
        let attr = data.columns;
        let datacol = attr.length;
        let datarow = data.length;


        for (let i = 0; i < datacol; i++) {
            for (let i_2 = i + 1; i_2 < datacol; i_2++) {
                if(attr[i] != this._y_attr && attr[i_2] != this._y_attr){
                    let curData = [];
                    for (let j = 0; j < datarow; j++) {
                        let curPoint = {};
                        curPoint.x = parseFloat(data[j][attr[i]]);
                        curPoint.y = parseFloat(data[j][attr[i_2]]);
                        curPoint.z = parseFloat(data[j][this._y_attr]);
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
                    let z_minVal = d3.min(curData, function (d) {
                        return d.z;
                    });
                    let z_maxVal = d3.max(curData, function (d) {
                        return d.z;
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
                        .domain([z_minVal, z_maxVal]);

                    let svg = newplot.append("svg")
                        .attr("height", this._height)
                        .attr("width", this._width);
                    let g = svg
                        .append('g')
                        .attr('id', "pairwisePlot" + i)
                        .attr("transform", "translate(" + [margin.left, margin.top] + ")");

                    g.selectAll("circle")
                        .data(curData)
                        .enter()
                        .append("circle")
                        .attr("r",2)
                        .attr("cx", function (d) {
                            return x(d.x);
                        })
                        .attr("cy", function (d) {
                            return y(d.y);
                        })
                        .attr('fill', function (d) {
                            return colorScale(d.z);
                        }).attr("class", "scattercolor");

                    let tip = d3.tip().attr('class', 'd3-tip').attr('id','plottip')
                        .direction('se')
                        .offset(function() {
                            return [0,0];
                        })
                        .html((d,ind)=>{
                            return this.tooltip_render(d,ind);

                        });
                    //console.log(curscatter);
                    //this._curscatter = curscatter;
                    g.selectAll("circle").call(tip)
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide);

                    g
                        .append('g')
                        .attr('id', "xAxis" + i)
                        .call( d3.axisBottom(x).scale(x))
                        .attr("transform", "translate(" + [0, height] + ")");//.attr("class","label");;
                    g
                        .append('g')
                        .attr('id', "yAxis" + i)
                        .call(d3.axisLeft(y).scale(y));

                    svg
                        .append("text")
                        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                        .attr("transform", "translate("+ (this._width/2) +","+(this._height-margin.bottom/3)+")")  // centre below axis
                        .text(attr[i]);
                    svg
                        .append("text")
                        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                        .attr("transform", "translate("+ (margin.left/3) +","+(this._height/2)+")rotate(-90)")
                        .text(attr[i_2]);
                }



            }
        }
    }

    tooltip_render(d,ind) {
        let text = "";
        for (let i = 0;i<this._attr.length;i++){
            //console.log(d3.select("#plot" + i).selectAll("circle"));
            text +=  "<li>"+ this._attr[i]+ ": "+ this._obj[this._attr[i]][ind];
        }
        return text;
    }
    //rawDataPlot
    rawDataPlot() {
        d3.selectAll('#plottip').remove();
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
        //this._obj = obj;
        //this._attr = attr;
        let value = function (d) {
            return d;
        }; // data -> value

        let minVal = d3.min(obj[this._y_attr], value);
        let maxVal = d3.max(obj[this._y_attr], value);

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

        for (let i = 0; i < datacol; i++) {
            if(attr[i] != this._y_attr){
                yScale.domain([d3.min(obj[attr[i]], value), d3.max(obj[attr[i]], value)]);
                newplot.append("svg")
                    .attr('id', "plot" + i);
                curplot = d3.select("#plot" + i).data([{
                    x: obj[this._y_attr],//d3.range(n).map(function(i) { return i / n; }),
                    y: obj[attr[i]]//d3.range(n).map(function(i) { return Math.sin(4 * i * Math.PI / n) + (Math.random() - .5) / 5; })
                }]);

                curplot.attr("height", height)
                    .attr("width", width);

                curplot.append('g').attr('id', "xAxis" + i);
                curplot.append('g').attr('id', "yAxis" + i);
                //d3.selectAll("#plottip").remove();
                let curscatter = curplot.selectAll("circle")
                //.data(obj[attr[i]])
                    .data(function(d) {
                        return d3.zip(d.x, d.y); })
                    .enter()
                    .append("circle")
                    .attr("r", 2)
                    .attr("cx", function(d) { return xScale(d[0]); })
                    .attr("cy", function(d) { return yScale(d[1]); })
                    .attr("transform", "translate(" + [margin.left, height - margin.bottom] + ")")
                    .attr("transform", "translate(" + [margin.left, margin.top] + ")")
                    .attr('fill', function (d) {
                        return colorScale(d[0]);
                    }).attr("class", "scattercolor");

                let tip = d3.tip().attr('class', 'd3-tip').attr('id','plottip')
                    .direction('se')
                    .offset(function() {
                        return [0,0];
                    })
                    .html((d,ind)=>{
                        return this.tooltip_render(d,ind);

                    });
                //console.log(curscatter);
                //this._curscatter = curscatter;
                curscatter.call(tip);
                //console.log(this._node);
                //console.log(curscatter.on('mouseover', tip.show));
                curscatter.on('mouseover', tip.show)//.attr('class',d=>{
                //console.log("Mouse Over");
                //return "highlighted";})
                    .on('mouseout', tip.hide);//.attr('fill', function (d) {
                //return colorScale(d[0]);
                //});

                //.on("mouseover", function(d,ind){tipMouseover(d,ind,attr,obj);})
                //.on("mouseout", tipMouseout);

                xAxis.scale(xScale);
                yAxis.scale(yScale);

                curplot.select("#xAxis" + i)
                    .call(xAxis)
                    .attr("transform", "translate(" + [margin.left, height - margin.bottom] + ")");//.attr("class","label");
                //Translate for y_val will be modified later
                curplot.select("#yAxis" + i)
                    .call(yAxis)
                    .attr("transform", "translate(" + [margin.left, margin.top] + ")");

                curplot
                    .append("text")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("transform", "translate("+ (width/2) +","+(height-margin.bottom/3)+")")  // centre below axis
                    .text(this._y_attr);
                curplot
                    .append("text")
                    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("transform", "translate("+ (margin.left/2) +","+(height/2)+")rotate(-90)")
                    .text(attr[i]);



                /*
                .append("text")
                .classed("label", true)
                .attr("transform", "rotate(-90)")
                .attr("y", margin.left)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Ylabel");//.attr("class","label");
                */
            }


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

        for (let i = 0; i < datacol ; i++) {
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

            let svg = newplot.append("svg")
                .attr("height", this._height)
                .attr("width", this._width);
            let g = svg
                .append('g')
                .attr('id', "boxPlot" + i)
                .attr("transform", "translate(" + [margin.left, margin.top] + ")");

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

            svg
                .append("text")
                .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr("transform", "translate("+ (this._width/2) +","+(this._height-margin.bottom/3)+")")  // centre below axis
                .text(attr[i]);



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

        for (let i = 0; i < datacol; i++) {
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
                .attr("width", this._width);

            let g = svg.append('g')
                .attr('id', "boxPlot" + i)
                .attr("transform", "translate(" + [margin.left, margin.top] + ")");

            g.selectAll("rect")
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

            g
                .append('g')
                .attr('id', "xAxis" + i)
                .call(d3.axisBottom(x).tickValues(tickrange))
                .attr("transform", "translate(" + [0, height] + ")");

            g
                .append('g')
                .attr('id', "yAxis" + i)
                .call(d3.axisLeft(y))

            svg
                .append("text")
                .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr("transform", "translate("+ (this._width/2) +","+(this._height-margin.bottom/3)+")")  // centre below axis
                .text(attr[i]);
            // svg
            //     .append("text")
            //     .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            //     .attr("transform", "translate("+ (margin.left/2) +","+(this._height/2)+")rotate(-90)")
            //     .text("Value");
            //.attr("transform", "translate(" + [margin.left, margin.top] + ")");//.attr("class","label");;


        }
    }

    update(nodeinfo){
        let selectdata = [];
        nodeinfo.data._total.forEach(d=>{
            selectdata.push(this._rawdata[d]);
        });
        this._data = selectdata;
        this._data.columns = this._rawdata.columns;

        let attr = this._data.columns;
        let datacol = attr.length;
        let datarow = this._data.length;
        let obj = {};
        for (let j = 0; j < datacol; j++)
            obj[attr[j]] = [];
        for (let i = 0; i < datarow; i++) {
            for (let j = 0; j < datacol; j++) {
                obj[attr[j]].push(parseFloat(this._data[i][attr[j]]));
            }
        }
        this._obj = obj;
        this._attr = attr;
        this.printPlots();

    }

    updateAttribute(){
        this._y_attr = document.getElementById('y_attr').value;
        this.printPlots();
    }
}

function printPlots() {
    window.plots.printPlots()
}

function updateAttribute(){
    window.plots.updateAttribute()

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
/*
function tipMouseover(d,ind,attr,obj){
    console.log("Mouseover scatter");
    console.log("data: "+ d);

    //console.log(d2)
    console.log("Index: "+ ind);
    console.log(obj);
}

function tipMouseout(){
    //console.log("Mouseout scatter");

}
*/