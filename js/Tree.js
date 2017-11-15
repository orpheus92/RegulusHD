/** Class implementing the tree view. */

class Tree {
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

    createTree(treeData) {

        // ******* TODO: PART VI *******

        // Set the dimensions and margins of the diagram
        let margin = {top: 20, right: 90, bottom: 30, left: 90},
            width = 500 - margin.left - margin.right,
            height = 900 - margin.top - margin.bottom;

        let g = d3.select("#tree")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //Create a tree and give it a size() of 800 by 300.
        let treemap = d3.tree().size([height, width]);

        //Create a root for the tree using d3.stratify();
        let root = d3.stratify()
            .id(function(d) { return d.id; })
            .parentId(function(d) {
                if(treeData[d.ParentGame] != null)
                    return treeData[d.ParentGame].id;
                else
                    return null;
            })
            (treeData);


// Assigns parent, children, height, depth
        // Assigns the x and y position for the nodes
        let treeLayoutData = treemap(root);

        // Compute the new tree layout.
        let nodes = treeLayoutData.descendants(),
            links = treeLayoutData.descendants().slice(1);

        // Normalize for fixed-depth.
        nodes.forEach(function(d){
            let tmp = d.y;
            d.y = d.x
            d.x = tmp;
        });


        //Add nodes and links to the tree.



        let node = g.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", function(d) {
                if(d["data"].Wins == "1")
                    return "node winner";
                else
                    return "node";
            })
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; });

        node.append("circle")
            .attr("r", 10);

        let link = g.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("id", function(d){
                return d["data"].Team;
            })
            .attr("d", function(d) {
                return "M" + d.x + "," + d.y
                    + "C" + d.x + "," + (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," + d.parent.y;
            });

        node.append("text")
            .attr("dy", ".35em")
            .attr("x", function(d) {
                if(d.height == 0)
                    return 10;
                else
                    return -10;
            })
            .attr("id", function(d){
                return d["data"].Team;
            })
            .style("text-anchor", function(d) {
                if(d.height == 0)
                    return "start";
                else
                    return "end";
            })
            .text(function(d) { return d.data["Team"]; });

    };

    makeTree(merge){

    }
    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        if(row["value"].type == "aggregate")
        {
            d3.selectAll("path#"+row.key)
                .attr("class",function(d) {
                    if(d["data"].Wins == 1)
                        return "link selected";
                    else
                        return "link";

                });
            d3.selectAll(".node").selectAll("#"+row.key)
                .attr("class",function(d) {
                    return "selectedLabel";
                });
        }
        else{
            d3.selectAll("path#"+row.key)
                .attr("class",function(d) {
                    if(d["data"].Opponent == row["value"].Opponent)
                        return "link selected";
                    else
                        return "link";
                });
            d3.selectAll("path#"+row["value"].Opponent)
                .attr("class",function(d) {
                    if(d["data"].Opponent == row.key)
                        return "link selected";
                    else
                        return "link";
                });
            d3.selectAll(".node").selectAll("#"+row.key)
                .attr("class",function(d) {
                    if(d["data"].Opponent == row["value"].Opponent)
                        return "selectedLabel";
                });
            d3.selectAll(".node").selectAll("#"+row["value"].Opponent)
                .attr("class",function(d) {
                    if(d["data"].Opponent == row.key)
                        return "selectedLabel";
                });

        }


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
