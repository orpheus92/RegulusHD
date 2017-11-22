//import {Tree} from './Tree';
//import {Plots} from './Plot';

//read data;
let pInter;
let tree;
let partition;

d3.csv('data/Pu_TOT.csv', function (error, rawdata) {
    d3.select('#increase')
        .on('click', () =>  increasePersistence());
    d3.select('#decrease')
        .on('click', () =>  decreasePersistence());

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
function increasePersistence(){
    let pers =[];
    partition.pers.map(function(item) {
        pers.push(parseFloat(item));
    });
    for (let i=pers.length-1; i>=0; i--) {
        if(pers[i]>pInter){
            pInter = pers[i];
            break;
        }
    }
    console.log(pInter);

    tree.updateTree(pInter);

}

function decreasePersistence(){
    let pers =[];
    partition.pers.map(function(item) {
        pers.push(parseFloat(item));
    });
    for (let i=1; i<pers.length; i++) {
        //console.log(i);
        if(pers[i]<pInter){
            pInter = pers[i];
            break;
        }
    }
    console.log(pInter);
    //tree.clearTree();
    tree.updateTree(pInter);

}







