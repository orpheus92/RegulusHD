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
    pInter = 0.5;
    sizeInter = 20;
    d3.json('data/Tree_Data.json', function (error, data) {
        if (error) throw error;
        //will be updated later
        tree = new Tree();
        loaddata = new Load();
        loaddata.create(data,rawdata,pInter,sizeInter);
        partition = new Partition();

        partition.initialPartition(data);

        d3.csv('data/Tree_Merge.csv', function (error, treedata){
            d3.json('data/Base_Partition.json', function (error, basedata) {
                //console.log(rawdata);
                treenode = tree.create(treedata, partition.pers, basedata);
                tree.updateTree(pInter,sizeInter);

                d3.select('#increase')
                    .on('click', () => {
                        pInter = tree.increasePersistence();
                        loaddata.update(pInter,sizeInter);
                    });
                d3.select('#decrease')
                    .on('click', () =>  {
                        pInter = tree.decreasePersistence()
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

                treenode.on('click', (nodeinfo)=>{

                    window.plots.update(nodeinfo);
                    loaddata.select(nodeinfo);
                });



                //this._node.on('click', (nodeinfo)=>plots.update(nodeinfo));


            });
        });

    })
});


function updateDataInfo(){}







