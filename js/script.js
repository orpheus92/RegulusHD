//import {Tree} from './Tree';
//import {Plots} from './Plot';

//read data;
d3.csv('data/Pu_TOT.csv', function (error, data) {
    if (error) throw error;
    let plots = new Plots(data, 600, 150);
    window.plots = plots;
    window.plots.histogramPlot();
});

//Load data in JS
let partition;
let pInter = 3;
let tree;
//console.log("sdasda");
d3.json('data/treedata.json', function (error, data) {
    if (error) throw error;
    tree = new Tree();

    partition = new Partition();

    window.partition = partition;

    partition.initialPartition(data);

    d3.csv('data/modifiedmerge.csv', function (error, treedata){
        d3.json('data/persistence3.json', function (error, basedata) {

            tree.create(treedata, partition.pers, basedata);
            tree.updateTree(pInter);
        });
    });
    //console.log(partition);


})

