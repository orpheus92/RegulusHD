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
let pInter = 1;
let tree;
console.log("sdasda");
d3.json('data/treedata.json', function (error, data) {
    if (error) throw error;
    tree = new Tree();

    partition = new Partition();

    window.partition = partition;

        partition.initialPartition(data);

    d3.csv('data/modifiedmerge.csv', function (error, treedata){
        tree.createTree(treedata,partition.pers,pInter);
    });
    console.log(partition);
    //let pers = 2;
    //partition.update(pers);


    /*
    d3.csv('data/total.csv', function (error, data) {
        partition.initialmerge(data);
        //partition.update(pers);
        partition.update(pers);

    });
    /*
    /*
    let p1 = new Promise(function(resolve, reject) {
        d3.csv('data/max_merge.csv', function (error, data) {
            partition.initialmaxmerge(data);
        });
        if (){
            resolve(value);
        } else {
            reject(error);
        }
    });
*/
    /*
    let p1 = function() {
        return new Promise(function(resolve,reject){
            resolve(d3.csv('data/max_merge.csv', function (error, data) {
                partition.initialmaxmerge(data);
            }))
            //resolve
        })
    };

    let p2 = function() {
        return new Promise(function(resolve,reject){
            resolve(d3.csv('data/min_merge.csv', function (error, data) {
                partition.initialminmerge(data);
            }))
            //resolve
        })
    };

    let p3 = function() {
        return new Promise(function(resolve,reject){
            resolve(partition.process());
            //resolve
        })
    };
*/
    /*  let p2 = new Promise((resolve, reject) =>
        {d3.csv('data/min_merge.csv', function (error, data) {
            partition.initialminmerge(data);

        });
        });
  */
    /*
    let p3 = new Promise((resolve, reject) =>
    {
        partition.process();
    });
    */
    /*
    p1().then(function(){return p2()}).then(function(){
        return p3();
    });
   */

})

