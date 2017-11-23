//import {Tree} from './Tree';
//import {Plots} from './Plot';

//read data;
let pInter;
let tree;
let partition;
let loaddata;

let dispatch = d3.dispatch("click");
d3.csv('data/Pu_TOT.csv', function (error, rawdata) {

    console.log(dispatch);
    if (error) throw error;
    let plots = new Plots(rawdata, 600, 150);
    window.plots = plots;
    window.plots.histogramPlot();
    //Load data in JS
    pInter = 0.5;

    d3.json('data/Tree_Data.json', function (error, data) {
        if (error) throw error;
        //will be updated later
        tree = new Tree(plots,rawdata);
        loaddata = new Load();
        loaddata.create(data,pInter);
        partition = new Partition();

        window.partition = partition;

        partition.initialPartition(data);

        d3.csv('data/Tree_Merge.csv', function (error, treedata){
            d3.json('data/Base_Partition.json', function (error, basedata) {

                tree.create(treedata, partition.pers, basedata);
                tree.updateTree(pInter);

            });
        });

    })
});


function updateDataInfo(){}







