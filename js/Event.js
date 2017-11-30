class Event{

constructor(inputsvg){
    this.inputsvg = inputsvg;



}

createslider(range){

    //let svg = d3.select("svg"),
    //console.log("Create Slider");
    //console.log(this.inputsvg);
    //let margin = {right: 50, left: 50},
        //width = +this.inputsvg.attr("width") - margin.left - margin.right,
        //height = +this.inputsvg.attr("height");

    let x = d3.scaleLinear()
    .domain([range[0], range[1]])
    .range([0, 150])//size of slider and range of output, put persistence here
    .clamp(true);

    let slider = this.inputsvg.select("#slider");
        //.attr("class", "slider");
        slider.attr("transform", "translate(" +this.inputsvg.attr("width")*3/4 + "," + 10 + ")");
    //console.log(x.domain(), range[1]);

    //console.log(x.range());
    let curslide = slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay");
    //console.log(x.ticks(5));
    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(x.ticks(5)) //number of points in the slider
        .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d) {return d; });

    slider.handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 8).attr("id","#myhandle");

    slider.curslide = curslide;
    return slider;




    //return slider
}
createbutton(){


}
}
/*
function hue(h) {
    //console.log(h);

    slider.handle.attr("cx", x(h)); //initial position for the slider
    console.log(x(h));
    //console.log(h);
    //svg.style("background-color", d3.hsl(h, 0.8, 0.8));
}
*/