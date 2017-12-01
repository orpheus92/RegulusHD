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

        this._root = d3.stratify()
            .id(d => d.id)
            .parentId(d => d.par === ", , 0" ? '' : d.par)//d.ParentGame ? treeData[d.ParentGame].id : '')
            (treeCSV);

        this._treefunc(this._root);

        let accum;

        this._root.descendants().forEach(d=>{//console.log(d);
            accum = [];
            accum = getbaselevelInd(d, accum);
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
        this._initsize = this._root.descendants().length;

        let g = d3.select("#tree").attr("transform", "translate(15,40)");

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

        this._node = g.selectAll(".node")
            .data(this._root.descendants())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

        //Need some change later to fix this design
        let tip = d3.tip().attr('class', 'd3-tip').attr('id','treetip')
            .direction('se')
            .offset(function() {
                return [0,0];
            })
            .html((d)=>{
                let tooltip_data = d.data;

                return this.tooltip_render(tooltip_data);

                return ;
            });
        this._node.call(tip);
        this._node.on('mouseover', tip.show)
            .on('mouseout', tip.hide);
        this._alldata = treeCSV;
        return(this._node);

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
    updateTree(ppp,sss) {
        this.pInter = ppp;
        this.sizeInter = sss;
        // return tree back to original
        d3.selectAll(".treedis").remove();
        //console.log(this._alldata);
        //console.log(this);
        //Filter on the tree to change children
        //Problem here since it depends on the current tree structure.
        //obj2 = Object.create(obj1)
        //var copy = JSON.parse(JSON.stringify( original ));
        //this._curroot = d3.stratify()
        //    .id(d => d.id)
        //    .parentId(d => d.par === ", , 0" ? '' : d.par)//d.ParentGame ? treeData[d.ParentGame].id : '')
        //    (this._alldata);
        this._curroot = this._root;
        //Update function updated, change all _children back to children
        this._node.data().forEach(d=>{
            if(d["_children"]!=undefined){
                d["children"] = d["_children"];
                delete d["_children"];
            }
        });

        this._curroot.descendants().forEach(d=>{
            if(pfilter(d,this.pInter)||sizefilter(d,this.sizeInter))
            {
                if(d["children"]!=undefined){
                    //console.log(d);
                    d._children = d.children;
                    delete d.children;
                    //d.removeAttribute("children");
                }
            }
            else{
                if(d["_children"]!=undefined){
                    //console.log(d);
                    d.children = d._children;
                    delete d._children;
                    //d.removeAttribute("_children");
                }
            }

        });
        // Rebuild the tree
        this._treefunc(this._curroot);
        let cursize = this._curroot.descendants().length;

        this._node.classed("node", true);
        this._link.classed("link", true);

        d3.selectAll(".link")
            .classed("link",d=>{
                return checknode(d);});

        d3.selectAll(".node")
            .classed("node",d=>{
                return checknode(d);});

        let g = d3.select("#tree").attr("transform", "translate(15,40)");
       g.selectAll(".link")
           .transition()
           .duration(500)
            .attr("d", function (d) {
                return "M" + d.x + "," + d.y
                    //+ "C" + d.x  + "," + d.y+10
                    //+ " " + d.parent.x  + "," + d.parent.y+10
                    +"L" + d.parent.x + "," + d.parent.y;
            });

        g.selectAll(".node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            }).append("circle").attr("r", Math.log(this._initsize/cursize)).attr("class","treedis");

    }
    /*
    updateTree2(ppp,sss) {

        //console.log(ppp);
        this.pInter = ppp;
        this.sizeInter = sss;
        // return tree back to original
        d3.select("#tree").selectAll("circle").remove();

        //this._curroot = this._root;

        this._curroot = d3.stratify()
            .id(d => d.id)
            .parentId(d => d.par === ", , 0" ? '' : d.par)//d.ParentGame ? treeData[d.ParentGame].id : '')
            (this._alldata);

        this._curroot.descendants().forEach(d=>{//console.log(this.pInter);
            if(pfilter(d,this.pInter)||sizefilter(d,this.sizeInter))
            {
                if(d["children"]!=undefined){
                    //console.log(d);
                    d._children = d.children;
                    delete d.children;
                    //d.removeAttribute("children");
                }
            }
            else{
                if(d["_children"]!=undefined){
                    //console.log(d);
                    d.children = d._children;
                    delete d._children;
                    //d.removeAttribute("_children");
                }
            }

        });

        this._treefunc(this._curroot);
        let cursize = this._curroot.descendants().length;
        this._node.classed("node", true);
        this._link.classed("link", true);

        d3.selectAll(".link")
            .classed("link",d=>{
                return checknode(d);});

        d3.selectAll(".node")
            .classed("node",d=>{
                return checknode(d);});

        let g = d3.select("#tree").attr("transform", "translate(15,40)");

        g.selectAll(".link")
            .transition()
            .duration(500)
            .attr("d", function (d) {
                return "M" + d.x + "," + d.y
                    //+ "C" + d.x  + "," + d.y+10
                    //+ " " + d.parent.x  + "," + d.parent.y+10
                    +"L" + d.parent.x + "," + d.parent.y;
            });

        g.selectAll(".node")

            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            }).append("circle").attr("r", Math.log(this._initsize/cursize));
    }
    */

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
    increasePersistence(ppp){
        this.pInter = ppp;
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
        this.updateTree(this.pInter,this.sizeInter);
        return this.pInter;

    }
    decreasePersistence(ppp){
        this.pInter = ppp;
        let pers =[];
        partition.pers.map(function(item) {
            pers.push(parseFloat(item));
        });
        for (let i=1; i<pers.length; i++) {
            if(pers[i]<this.pInter){
                this.pInter = pers[i];
                break;
            }
        }
        this.updateTree(this.pInter,this.sizeInter);
        return this.pInter;

    }

    increaseSize(){
        this.sizeInter = this.sizeInter + 1;
        this.updateTree(this.pInter,this.sizeInter);
        return this.sizeInter;

    }
    decreaseSize() {
        if (this.sizeInter >= 1){
        this.sizeInter = this.sizeInter - 1;
        this.updateTree(this.pInter, this.sizeInter);
        return this.sizeInter;
        }
        else
            return this.sizeInter;
    }
    reshape(curnode){

        d3.select("#tree").selectAll("circle").remove();
        //open
        if(curnode.children[0]._children!=undefined)
        {curnode.descendants().forEach(d=>{
            if(d.id!=curnode.id) {
                if (d._children != undefined) {
                    d.children = d._children;
                    delete d._children;
                }
            }
        });}
        //collapse
            else{
        curnode.descendants().forEach(d=>{
            if(d.id!=curnode.id) {
                if(d.children != undefined) {
                    d._children = d.children;
                    delete d.children;
                }
            }
        });}
        this._treefunc(this._curroot);

        let cursize = this._curroot.descendants().length;

        this._node.classed("node", true);
        this._link.classed("link", true);

        d3.selectAll(".link")
            .classed("link",d=>{
                return checknode(d);});

        d3.selectAll(".node")
            .classed("node",d=>{
                return checknode(d);});

        let g = d3.select("#tree").attr("transform", "translate(15,40)");
        g.selectAll(".link")
            .transition()
            .duration(500)
            .attr("d", function (d) {
                return "M" + d.x + "," + d.y
                    //+ "C" + d.x  + "," + d.y+10
                    //+ " " + d.parent.x  + "," + d.parent.y+10
                    +"L" + d.parent.x + "," + d.parent.y;
            });
        g.selectAll(".node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            }).append("circle").attr("r", Math.log(this._initsize/cursize)).attr("class","treedis");

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

function pfilter(mydata,ppp){
    return (mydata.data.persistence<=ppp && mydata.data.persistence != -1)? true : false;
}
function sizefilter(mydata,sss){
    return (mydata.data._total.size<sss)? true : false;

}
function checknode(curnode){

    if(curnode["_children"]!=undefined){
        return false;
    }
    else if(curnode["children"]==undefined){
        return false;
    }
    else
        return true;
}