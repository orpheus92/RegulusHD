/** Class implementing the tree view. */
//export {Tree} from './Tree.js';
class Treeold{
    /**
     * Creates a Tree Object
     */

    constructor() {
        //this._plot = plot;
        //this._rawdata = rawdata;
        //this.dispatch = d3.dispatch(["selectNode","updateP"]);
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */

    create(treeCSV,pers,basedata) {
        this.pInter = pInter;
        this.sizeInter = sizeInter;
        treeCSV.forEach(function (d) {//console.log(d);

                d.id = d.C1+ ", "+d.C2+", "+d.Ci;
                d.index = d.C1+ ", "+d.C2;
                d.par = d.P1+ ", "+d.P2+", "+d.Pi;
                d.persistence = pers[d.Ci];

            });

        //Construct the tree
        this._treefunc = d3.tree()
            .size([670,330]);
            /*
            let baseroot = d3.stratify()
                .id(d => d.id)
                .parentId(d => d.par === ", , 0" ? '' : d.par)//d.ParentGame ? treeData[d.ParentGame].id : '')
                (treeCSV);
            */

        this._root = d3.stratify()
            .id(d => d.id)
            .parentId(d => d.par === ", , 0" ? '' : d.par)//d.ParentGame ? treeData[d.ParentGame].id : '')
            (treeCSV);
        console.time('create1');
        this._treefunc(this._root);
        console.timeEnd('create1');

        //this._root = root;

        //console.time('create2');
        let accum;

        this._root.descendants().forEach(d=>{//console.log(d);
            accum = [];
            accum = getbaselevelInd2(d, accum);
            d.data._baselevel = new Set(accum);
            d.data._total = new Set();
            d.data._baselevel.forEach(dd=> {
                //console.log(dd);
                if (basedata[dd] != null) {
                    //console.log(basedata[dd]);
                    basedata[dd].forEach(ddd=>{
                        //console.log(basedata[dd]);
                        //console.log(ind);
                        if (!d.data._total.has(ddd))
                            d.data._total.add(ddd);
                    })
                    //console.log(d.data._total);
                    //d.data._total = d.data._totalnumber + basedata[dd].length;
                }
                    });
            //d.data._baselevel
        });
        //console.timeEnd('create2');

       // console.log(root);
        //getbaselevelInd2(root, accum);
        //console.log(accum);

        //this.plot = d3.select("#hdPlot");

        let g = d3.select("#tree").attr("transform", "translate(15,40)");
        //console.time('create3');
        this._link = g.selectAll(".link")
            .data(this._root.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function (d) {
                return "M" + d.x + "," + d.y
                    //+ "C" + d.x  + "," + d.y+10
                    //+ " " + d.parent.x  + "," + d.parent.y+10
                    +"L" + d.parent.x + "," + d.parent.y;
                });
        //console.timeEnd('create3');

        //console.time('create4');
        this._node = g.selectAll(".node")
            .data(this._root.descendants())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });//.append("circle").attr("r", Math.sqrt(2));
        //console.timeEnd('create4');
        this.xmax = d3.max(d3.selectAll(".node").data(), d => d.x);
        this.ymax = d3.max(d3.selectAll(".node").data(), d => d.y);

        //console.log(node);
        //this._node.append("circle")
        //    .attr("r", 1);
        /*
        node.append("text")
            .attr("dy", 5)
            .attr("x", (d) => d.children ? -8 : 8)
            .style("text-anchor", d => d.children ? "end" : "start")
            .text((d) => d.data.Team);
        */
        //console.time('create5');
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0,0];
            })
            .html((d)=>{//console.log(d);
                let tooltip_data = d.data;

                return this.tooltip_render(tooltip_data);

                return ;
            });
        this._node.call(tip);
        //console.log(this._node);
        this._node.on('mouseover', tip.show)
            .on('mouseout', tip.hide);
        //Need some change later to fix this design
        this._alldata = treeCSV;
        return(this._node);
        //this._node.on('click', (nodeinfo)=>this._plot.update(nodeinfo));



       // console.timeEnd('create5');
    };

    tooltip_render(tooltip_data) {
        //console.log(tooltip_data);
        //let text = "";

        let text =  "<li>"+"Partition Extrema: " + tooltip_data.index;
        text += "<li>";
        text +=  "Partition Persistence: " + tooltip_data.persistence;
        text += "<li>";
        text +=  "Number of Points: " + tooltip_data._total.size;

        return text;
    }

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(pInter,sizeInter) {
        // return tree back to original
        //d3.selectAll("circle").remove();
        //console.log(this._alldata);
        this.pInter = pInter;
        this.sizeInter = sizeInter;
        this._node.classed("node", true);
        this._link.classed("link", true);
        //console.log(d3.selectAll("circle"));
        let linkSelection, nodeSelection;
        /*
        this._root.descendants().forEach(function(d){
            if(d.data.persistence<pInter && d.data.persistence != -1)
            {d._children = d.children;
            d.children = null;
            }
        });
        */
      //  console.time('someFunction');
        //let ymin = 0;
        let ymax = 0;
        //let xmin = 0;
        let xmax = 0;
        d3.selectAll(".link")
            .classed("link",d=>{
                return pfilter2(d,pInter)&&sizefilter2(d,sizeInter);});
            //.filter(function (d) {//console.log(d);
            //    return d.data.persistence<pInter && d.data.persistence != -1;
            //});
        d3.selectAll(".node")
            .classed("node",d=>{
                //console.log(d);
                //console.log(sizefilter2(d,20));
                return pfilter2(d,pInter)&&sizefilter2(d,sizeInter);});
        d3.selectAll(".node").each(d=>{
            ymax = (ymax>d.y)? ymax : d.y;
            xmax = (xmax>d.x)? xmax : d.x;
        })

        //console.log(d3.selectAll(".link"));
        //console.log(ymin,ymax,xmin,xmax);
        let xscale = (xmax!=0)?this.xmax/xmax:100;
        let yscale = (ymax!=0)?this.ymax/ymax:100;

        //console.timeEnd('someFunction');



        //Now only the selected nodes/links are classed
        //Need to place them in right position
        /*
        let scaleX = (x=>{
            let x2 = d3.max(d3.selectAll(".node").data(), d => d.x);
            let x1 = d3.max(this._node.data(), d => d.x);
            return x*x1/x2;
        });

        let scaleY = (y=>{
            let y2 = d3.max(d3.selectAll(".node").data(), d => d.y);
            let y1 = d3.max(this._node.data(), d => d.y);
            return y*y1/y2;
        });
        */
        //reposition/scale current tree
       // console.time('someFunction2');

        d3.selectAll(".nodecircle")
            //.transition()
            //.duration(500)
            .remove();

        d3.selectAll(".node").attr("transform", d=> { //console.log(d.x);
            return "translate(" + xscale*(d.x) + "," + yscale*(d.y) + ")";
            //return "translate(" + d.x + "," + d.y + ")";
        }).append("circle").attr("r", Math.sqrt(yscale*(1))).attr("class","nodecircle");//.enter().merge();
      //  console.timeEnd('someFunction2');

            //.attr("r", Math.sqrt(scaleY(1)));
      //  console.time('someFunction3');
        //console.log(d3.selectAll(".link"));
        //d3.selectAll(".link")
        console.time("treeupdate");
            //this._link
        d3.selectAll(".link")
            .transition()
            .duration(500)
            .attr("d", d=> {
            //return "M" + d.x + "," + d.y
            return "M" + xscale*(d.x) + "," + yscale*(d.y)
            //    + "C" +  xscale*(d.x)  + "," + yscale*((d.y+d.parent.y))/2
            //    + "" + xscale*(d.parent.x)  + "," + yscale*((d.y+d.parent.y))/2
                + "L" + xscale*(d.parent.x) + "," + yscale*(d.parent.y);
            //+"L" + d.parent.x + "," + d.parent.y;

        });
        console.timeEnd("treeupdate");

        //  console.timeEnd('someFunction3');

    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops!
        this._node.classed(".node", true);
        this._link.classed(".link", true);
        //d3.selectAll(".node").selectAll("text").classed("selectedLabel",false);

    }
    increasePersistence(){
        let pers =[];
        partition.pers.map(function(item) {
            pers.push(parseFloat(item));
        });
        for (let i=pers.length-1; i>=0; i--) {
            if(pers[i]>this.pInter){
                this.pInter = pers[i];
                break;
            }
        }
        //console.log(this.pInter);
        this.updateTree(this.pInter,this.sizeInter);
        return this.pInter;

    }
    decreasePersistence(){
        let pers =[];
        partition.pers.map(function(item) {
            pers.push(parseFloat(item));
        });
        for (let i=1; i<pers.length; i++) {
            //console.log(i);
            if(pers[i]<this.pInter){
                this.pInter = pers[i];
                break;
            }
        }
        //console.log(this.pInter);
        this.updateTree(this.pInter,this.sizeInter);
        return this.pInter;

    }

    increaseSize(){
        this.sizeInter = this.sizeInter + 1;
        this.updateTree(this.pInter,this.sizeInter);
        return this.sizeInter;

    }
    decreaseSize(){
        this.sizeInter = this.sizeInter - 1;
        this.updateTree(this.pInter,this.sizeInter);
        return this.sizeInter;

    }
/*
    reshape(nodeclick){
        let ymax = 0;
        let xmax = 0;

        d3.selectAll(".node").each(d=>{
            xmax = (xmax>d.x)? xmax : d.x;
            ymax = (ymax>d.y)? ymax : d.y;
        });

        let xscale = (xmax!=0)?this.xmax/xmax:100;
        let yscale = (ymax!=0)?this.ymax/ymax:100;

        //console.log("double click");
        //console.log(nodeclick);
        //nodeclick.classed(".node",true);

        d3.selectAll(".node").each(d=>{
            ymax = (ymax>d.y)? ymax : d.y;
            xmax = (xmax>d.x)? xmax : d.x;
        })

    }
*/
}
function getbaselevelInd2(node, accum) {
    let i;
    //console.log(node.children);
    if (node.children != null) {
        accum = accum || [];
        for (i = 0; i < node.children.length; i++) {
            accum.push(node.children[i].data.index)
            getbaselevelInd2(node.children[i], accum);
        }
    }
    else
        accum.push(node.data.index);

    return accum;
}
/*
function collapse(d) {
    if(d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
    }
}

function update(source) {

    // Assigns the x and y position for the nodes
    let treeData = treemap(root);

    // Compute the new tree layout.
    let nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function(d){ d.y = d.depth * 180});

    // ****************** Nodes section ***************************

    // Update the nodes...
    let node = svg.selectAll('g.node')
        .data(nodes, function(d) {return d.id || (d.id = ++i); });

    // Enter any new modes at the parent's previous position.
    let nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);

    // Add Circle for the nodes
    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

    // Add labels for the nodes
    nodeEnter.append('text')
        .attr("dy", ".35em")
        .attr("x", function(d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) { return d.data.name; });

    // UPDATE
    let nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .attr('cursor', 'pointer');


    // Remove any exiting nodes
    let nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
        .attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
        .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    let link = svg.selectAll('path.link')
        .data(links, function(d) { return d.id; });

    // Enter any new links at the parent's previous position.
    let linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function(d){
            var o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
        });

    // UPDATE
    let linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
        .duration(duration)
        .attr('d', function(d){ return diagonal(d, d.parent) });

    // Remove any exiting links
    let linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
        })
        .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d){
        d.x0 = d.x;
        d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {

        path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

        return path
    }

    // Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}
*/

function pfilter2(mydata,pInter){
    return (mydata.data.persistence<=pInter && mydata.data.persistence != -1)? false : true;
}
function sizefilter2(mydata,sizeInter){
    return (mydata.data._total.size<sizeInter)? false : true;

}