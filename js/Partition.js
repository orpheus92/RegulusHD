class Partition{
    //constructor for initial partitions
    constructor() {

    }
    initialPartition(Pdata){
        this.data = Pdata;

    }
    /*
    initialminmerge(mindata){

        this.minmerge = mindata;
        console.log(this);
    }
    initialmaxmerge(maxdata){
        this.maxmerge = maxdata;
        console.log(this)
    }
    process(){
        console.log(this);

        this.totalmerge = Object.assign({},this.minmerge, this.maxmerge)
            //= this.minmerge.concat(this.maxmerge);
    }
    */
    initialmerge(mdata){
        //this.totalmerge = mdata;
        this.attr = mdata.columns;
        this.row = mdata.length-1;
        this.col = mdata.columns.length;
        let obj = {};
        for (let j = 0; j < this.col; j++)
            obj[mdata.columns[j]] = [];

        for (let i = 0; i < this.col; i++) {
            for (let j= 0; j < this.row; j++) {
                obj[mdata.columns[i]].push(parseFloat(mdata[j][mdata.columns[i]]));
            }
        }
        this.totalmerge = obj;
        //console.log(this);
    }
    update(persistence){
        //let totalarr = this.totalmerge;
        let updated = this.data;
        let pers = this.totalmerge.pers;
        let child = this.totalmerge.merged;
        let parent = this.totalmerge.parent;
        let mind = this.totalmerge.saddleIdx;
        for(let i = 0;i<this.row;i++){
            if(pers[i]<persistence){
                if(mind[i]===0)
                    mergemin(child[i],parent[i],updated);
                else
                    mergemax(child[i],parent[i],updated);
            }
            else
                break;
        }
        console.log(updated);
    }


}
function mergemin(c,p,updated){
    //let keys = Object.keys(updated);
    let values = Object.values(updated);
    let listmin = values[values]
    console.log(values);
}
function mergemax(c,p,updated){



}

function convt(oldk){
    let newk;
    for (let i in oldk){
        console.log(parseInt(i));
    }

}