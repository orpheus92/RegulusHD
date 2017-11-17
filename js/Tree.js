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

    createTree(treeCSV,pers, curP) {

        let newtree = [];

        treeCSV.forEach(function (d) {

                d.id = d.C1+ ", "+d.C2+", "+d.Ci;
                d.index = d.C1+ ", "+d.C2;
                d.par = d.P1+ ", "+d.P2+", "+d.Pi;
                d.persistence = pers[d.Ci]
                if (d.persistence > curP)
                    newtree.push(d);
            });
        newtree.push(treeCSV[0]);

        console.log(newtree);


            let totalsize = treeCSV.length;

            let currentsize = newtree.length;
            console.log(totalsize);
            let tree = d3.tree()
                .size([5*currentsize,5*currentsize]);
            let root = d3.stratify()
                .id(d => d.id)
                .parentId(d => d.par === ", , 0" ? '' : d.par)//d.ParentGame ? treeData[d.ParentGame].id : '')
                (newtree);
            tree(root);
            console.log(root);

            this.plot = d3.select("#hdPlot");

            let g = d3.select("#tree").attr("transform", "translate(20,20)");

            console.log(g);
            let link = g.selectAll(".link")
                .data(root.descendants().slice(1))
                .enter().append("path")
                .attr("class", "link")
                .attr("d", function (d) {
                    return "M" + d.x + "," + d.y
                        //+ "C" + d.x  + "," + d.y+10
                        //+ " " + d.parent.x  + "," + d.parent.y+10
                        +" " + d.parent.x + "," + d.parent.y;
                });

            let node = g.selectAll(".node")
                .data(root.descendants())
                .enter().append("g")
                //.attr("class", function (d) {
                //    return "node" + (d.data.Wins === "1" ? " winner" : " loser");
                //})
                .attr("class", "node winner")
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            node.append("circle")
                .attr("r", Math.sqrt(totalsize/currentsize/20));

            node.append("text")
                .attr("dy", 5)
                .attr("x", (d) => d.children ? -8 : 8)
                .style("text-anchor", d => d.children ? "end" : "start")
                .text((d) => d.data.Team);
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0,0];
            })
            .html((d)=>{console.log(d);
                let tooltip_data = d.data;

                return this.tooltip_render(tooltip_data);
                /* populate data in the following format
                 * tooltip_data = {
                 * "state": State,
                 * "winner":d.State_Winner
                 * "electoralVotes" : Total_EV
                 * "result":[
                 * {"nominee": D_Nominee_prop,"votecount": D_Votes,"percentage": D_Percentage,"party":"D"} ,
                 * {"nominee": R_Nominee_prop,"votecount": R_Votes,"percentage": R_Percentage,"party":"R"} ,
                 * {"nominee": I_Nominee_prop,"votecount": I_Votes,"percentage": I_Percentage,"party":"I"}
                 * ]
                 * }
                 * pass this as an argument to the tooltip_render function then,
                 * return the HTML content returned from that method.
                 * */
                return ;
            });
        console.log(node);
        node.call(tip);
        node.on('mouseover', tip.show)
            .on('mouseout', tip.hide);

    };

    tooltip_render(tooltip_data) {
        console.log(tooltip_data);
        //let text = "";

        let text =  "Partition Extrema: " + tooltip_data.index;
        text += "<ul>"
        text +=  "Partition Persistence: " + tooltip_data.persistence;
        text += "</ul>";

        return text;
    }

    makeTree(merge){

    }
    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {

        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0,0];
            })
            .html((d)=>{
                let tooltip_data = {
                    "Current Partition": d};

                return this.tooltip_render(tooltip_data);
                /* populate data in the following format
                 * tooltip_data = {
                 * "state": State,
                 * "winner":d.State_Winner
                 * "electoralVotes" : Total_EV
                 * "result":[
                 * {"nominee": D_Nominee_prop,"votecount": D_Votes,"percentage": D_Percentage,"party":"D"} ,
                 * {"nominee": R_Nominee_prop,"votecount": R_Votes,"percentage": R_Percentage,"party":"R"} ,
                 * {"nominee": I_Nominee_prop,"votecount": I_Votes,"percentage": I_Percentage,"party":"I"}
                 * ]
                 * }
                 * pass this as an argument to the tooltip_render function then,
                 * return the HTML content returned from that method.
                 * */
                return ;
            });
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
