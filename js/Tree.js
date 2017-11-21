/** Class implementing the tree view. */
//export {Tree} from './Tree.js';
class Tree{
    /**
     * Creates a Tree Object
     */
    constructor() {

    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */

    create(treeCSV,pers/*, curP*/) {
        //console.log(pers);
        //console.log(treeCSV);
        //let newtree = [];
        //console.log(treeCSV);
        treeCSV.forEach(function (d) {//console.log(d.Ci);

                d.id = d.C1+ ", "+d.C2+", "+d.Ci;
                d.index = d.C1+ ", "+d.C2;
                d.par = d.P1+ ", "+d.P2+", "+d.Pi;
                d.persistence = pers[d.Ci];
                //if (d.persistence > curP)
                    //newtree.push(d);
            });
        //newtree.push(treeCSV[0]);

            //let currentsize = newtree.length;
            // console.log(totalsize);
        let tree = d3.tree()
            .size([400,160]);
            /*
            let baseroot = d3.stratify()
                .id(d => d.id)
                .parentId(d => d.par === ", , 0" ? '' : d.par)//d.ParentGame ? treeData[d.ParentGame].id : '')
                (treeCSV);
            */
        let root = d3.stratify()
            .id(d => d.id)
            .parentId(d => d.par === ", , 0" ? '' : d.par)//d.ParentGame ? treeData[d.ParentGame].id : '')
            (treeCSV);
        tree(root);
        this._root = root;

        this.plot = d3.select("#hdPlot");

        let g = d3.select("#tree").attr("transform", "translate(20,20)");
        let link = g.selectAll(".link")
            .data(root.descendants().slice(1))
            .enter().append("path")
            //.attr("id", "#linkid")
            .attr("class", "link")
            .attr("d", function (d) {
                return "M" + d.x + "," + d.y
                    //+ "C" + d.x  + "," + d.y+10
                    //+ " " + d.parent.x  + "," + d.parent.y+10
                    +"L" + d.parent.x + "," + d.parent.y;
                });
        console.log(link);
        let node = g.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
                //.attr("class", function (d) {
                //    return "node" + (d.data.Wins === "1" ? " winner" : " loser");
                //})
            .attr("class", "node")
            .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

                   //Math.sqrt(totalsize/currentsize/10)
        console.log(node);
        node.append("circle")
            .attr("r", 1);
        /*
        node.append("text")
            .attr("dy", 5)
            .attr("x", (d) => d.children ? -8 : 8)
            .style("text-anchor", d => d.children ? "end" : "start")
            .text((d) => d.data.Team);
        */
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
        node.call(tip);
        node.on('mouseover', tip.show)
            .on('mouseout', tip.hide);


    };

    tooltip_render(tooltip_data) {
        //console.log(tooltip_data);
        //let text = "";

        let text =  "Partition Extrema: " + tooltip_data.index;
        text += "<ul>"
        text +=  "Partition Persistence: " + tooltip_data.persistence;
        text += "</ul>";

        return text;
    }

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(pInter) {
        //console.log(pInter);

        let linkSelection, nodeSelection;
        /*
        this._root.descendants().forEach(function(d){
            if(d.data.persistence<pInter && d.data.persistence != -1)
            {d._children = d.children;
            d.children = null;
            }
        });
        */
        linkSelection = d3.selectAll(".link")
            .filter(function (d) {//console.log(d);
                return d.data.persistence<pInter && d.data.persistence != -1;
            });
        nodeSelection = d3.selectAll(".node")
            .filter(function (d) {//console.log(d);
                return d.data.persistence<pInter && d.data.persistence != -1;
            });
        linkSelection.classed("link", false);
        nodeSelection.classed("node", false).remove("circle");
        d3.selectAll(".link").scale
        //Now only the selected nodes/links are classed
        //Need to place them in right position


        //let g = d3.select("#tree").attr("transform", "translate(20,20)");
        /*
        let link = g.selectAll(".link")
            .data(this._root.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function (d) {
                return "M" + d.x + "," + d.y
                    //+ "C" + d.x  + "," + d.y+10
                    //+ " " + d.parent.x  + "," + d.parent.y+10
                    +"L" + d.parent.x + "," + d.parent.y;
            });
        */
        /*
        nodeSelection.attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        */
        //console.log(node);
        //Math.sqrt(totalsize/currentsize/10)
        /*
        nodeSelection.append("circle")
            .attr("r", 1);
        */
        /*
        nodeSelection.append("text")
            .attr("dy", 5)
            .attr("x", (d) => d.children ? -8 : 8)
            .style("text-anchor", d => d.children ? "end" : "start")
            .text((d) => d.data.Team);
        */
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
        //console.log(node);
        //node.call(tip);
        //node.on('mouseover', tip.show)
        //    .on('mouseout', tip.hide);

        console.log(this._root);
        /*
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0,0];
            })
            .html((d)=>{
                let tooltip_data = {
                    "Current Partition": d};

                return this.tooltip_render(tooltip_data);

                return ;
            });
        */

        }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops!
        d3.selectAll("path").attr("class","link");
        d3.selectAll(".node").selectAll("text")
            .classed("selectedLabel",false);
    }
}
function getbaselevelInd(node, accum) {
    let i;
    //console.log(node.children);
    if (node.children != null) {
        accum = accum || [];
        for (i = 0; i < node.children.length; i++) {
            accum.push(node.children[i].data.index)
            getbaselevelInd(node.children[i], accum);
        }
    }
    else
        accum.push(node.data.index);

    return accum;
}



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