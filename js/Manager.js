//import {Tree} from './Tree';
//import {Plots} from './Plot';

//read data;
let pInter;
let sizeInter;
let tree;
let partition;
let loaddata;
let treenode;
d3.csv('data/Pu_TOT.csv', function (error, rawdata) {

    if (error) throw error;
    for (let i = 0; i< rawdata.columns.length; i++)
    {
        d3.selectAll("#y_attr")
            .append("option")
            .attr("value", rawdata.columns[i])
            .text(rawdata.columns[i]);
    }
    let plots = new Plots(rawdata, 600, 200);
    window.plots = plots;
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
        partition.initialPartition(data);

        d3.csv('data/Tree_Merge.csv', function (error, treedata){
            d3.json('data/Base_Partition.json', function (error, basedata) {
                //console.log(rawdata);
                treenode = tree.create(treedata, partition.pers, basedata);
                tree.updateTree(pInter,sizeInter);

                //Slider Event
                let x = d3.scaleLinear()
                    .domain([minp, maxp])
                    .range([0, 150])//size of slider and range of output, put persistence here
                    .clamp(true);
                let event = new Event(d3.select("#treesvg"));
                let slider = event.createslider([minp, maxp]);

                slider.curslide.call(d3.drag()
                    .on("start.interrupt", function() { slider.interrupt(); })
                    .on("start drag", function() {
                        slider.handle.attr("cx", x(x.invert(d3.event.x))); //initial position for the slider

                        pInter = x.invert(d3.event.x);

                        loaddata.update(pInter,sizeInter);
                        tree.updateTree(pInter,sizeInter);

                    }));

                d3.select('#increase')
                    .on('click', () => {
                        pInter = tree.increasePersistence(pInter);
                        slider.handle.attr("cx", x(pInter));
                        loaddata.update(pInter,sizeInter);
                    });
                d3.select('#decrease')
                    .on('click', () =>  {
                        pInter = tree.decreasePersistence(pInter);
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

                let clicks = 0;
                let DELAY = 500;
                //Separate clicking from double clicking
                treenode.on("click", (nodeinfo)=>{
                    clicks++;  //count clicks

                    if(clicks === 1) {

                        timer = setTimeout(function() {
                            window.plots.update(nodeinfo);
                            loaddata.select(nodeinfo);
                            clicks = 0;             //after action performed, reset counter

                        }, DELAY);

                    } else {

                        clearTimeout(timer);    //prevent single-click action
                        tree.reshape(nodeinfo);
                        clicks = 0;             //after action performed, reset counter
                    }

                });



            });
        });

    })
});


function updateDataInfo(){}







