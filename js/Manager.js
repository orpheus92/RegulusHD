//import {Tree} from './Tree';
//import {Plots} from './Plot';

//read data;
let pInter;
let sizeInter;
let tree;
let partition;
let loaddata;
let treenode;
//let dispatch = d3.dispatch("click");
d3.csv('data/Pu_TOT.csv', function (error, rawdata) {

    //console.log(dispatch);
    if (error) throw error;
    let plots = new Plots(rawdata, 600, 150);
    window.plots = plots;
    //window.plots.rawDataPlot();
    //Load data in JS
    pInter = 2;
    sizeInter = 20;
    d3.json('data/Tree_Data.json', function (error, data) {
        if (error) throw error;
        //will be updated later
        tree = new Tree();
        loaddata = new Load();
        let[maxp,minp] = loaddata.create(data,rawdata,pInter,sizeInter);
        partition = new Partition();
        //console.log(minp);
        partition.initialPartition(data);

        d3.csv('data/Tree_Merge.csv', function (error, treedata){
            d3.json('data/Base_Partition.json', function (error, basedata) {
                //console.log(rawdata);
                treenode = tree.create(treedata, partition.pers, basedata);
                tree.updateTree(pInter,sizeInter);
                //console.log(treenode);
                //console.log(d3.select("#Maxp"));
                //Slider Event
                let x = d3.scaleLinear()
                    .domain([minp, maxp])
                    .range([0, 150])//size of slider and range of output, put persistence here
                    .clamp(true);
                //console.log(maxp);
                let event = new Event(d3.select("#treesvg"));
                let slider = event.createslider([minp, maxp]);

                slider.curslide.call(d3.drag()
                    .on("start.interrupt", function() { slider.interrupt(); })
                    .on("start drag", function() {
                        slider.handle.attr("cx", x(x.invert(d3.event.x))); //initial position for the slider
                        //console.log(x(x.invert(d3.event.x)));//convert value to values in range
                        //console.log(d3.event.x);
                        //hue(x.invert(d3.event.x));
                        //console.log(x.invert(d3.event.x));
                        pInter = x.invert(d3.event.x);
                        loaddata.update(pInter,sizeInter);
                        tree.updateTree(pInter,sizeInter);
                    }));
                //document.getElementById("#myhandle").onclick = function(){
                //    console.log("Handle clicked");

                //};
                //let slider = d3.slider().axis(true);
                //d3.select("#treesvg").append(slider);
                //let pos = 0;
                //d3.select('#slider-button').on('click', function() { slider.slide_to(++pos); });
                //d3.select("#treesvg").call(d3.drag()).on("change",function(){console.log("changed")});

                //slider.call(d3.drag()
                //    .on("start.interrupt", function() { slider.interrupt(); })
                //    .on("start drag", fd3.select("#treesvg")unction() {slider.handle.attr("cx", d3.event.x);  console.log(d3.event.x); }));

                d3.select('#increase')
                    .on('click', () => {
                        pInter = tree.increasePersistence();
                        slider.handle.attr("cx", x(pInter));
                        loaddata.update(pInter,sizeInter);
                    });
                d3.select('#decrease')
                    .on('click', () =>  {
                        pInter = tree.decreasePersistence();
                        //console.log(pInter);
                        //console.log(treenode);
                        slider.handle.attr("cx", x( pInter));
                        loaddata.update(pInter,sizeInter);
                    });
                d3.select('#increaseS')
                    .on('click', () =>  {
                        sizeInter = tree.increaseSize();
                        loaddata.update(pInter,sizeInter);
                    });
                d3.select('#decreaseS')
                    .on('click', () =>  {
                        sizeInter = tree.decreaseSize();
                        loaddata.update(pInter,sizeInter);
                    });
                //console.log(d3.select('#tree'));

                //console.log(d3.selectAll(".node"));

                treenode.on('dblclick', (nodeinfo)=>{

                    window.plots.update(nodeinfo);
                    loaddata.select(nodeinfo);
                });


                treenode.on('click', (nodeinfo)=> {
                   //d3.select('#map').text(d3.select('#map').text() + 'dblclick, ');
                    tree.reshape(nodeinfo);
                });



                //this._node.on('click', (nodeinfo)=>plots.update(nodeinfo));


            });
        });

    })
});


function updateDataInfo(){}







