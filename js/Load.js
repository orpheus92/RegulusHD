class Load {

    constructor() {
        this.raw = d3.select("#raw");//.text("rawdata");
        this.persistence = d3.select("#persistence");//.text("rawdata");
        this.selectedMSC = d3.select("#selected");//.text("rawdata");
        this.cper = d3.select("#cper");//.text("rawdata");

    }
    create(data,pInter){
        //console.log(data);
        let totalper = Object.keys(data).sort(function(b,a){return b-a});
        //console.log(totalper);
        this.persistence.append("li")
            .attr("dy", 0)
            .attr("x",0)
            .text("Maximum Persistence: "+ totalper.slice(-1)[0]);
        this.persistence.append("li")
            .attr("dy", "1.2em") // offest by 1.2 em
            .attr("x",0)
            .text("Minimum Persistence: " + totalper[1]);
        this.cper.text("Current Persistence: "+ pInter);

    }

    update(pInter){
    }
}

