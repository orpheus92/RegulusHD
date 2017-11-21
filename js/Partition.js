class Partition{
    //constructor for initial partitions
    constructor() {

    }
    initialPartition(Pdata){
        this.data = Pdata;
        //this.merge = Pdata2;
        this.pers = Object.keys(Pdata).sort(function(a,b){return b-a});
        this.pers.unshift(this.pers.pop());
        this.length = this.pers.length;
        //console.log(Pdata);

    }

    update(persistence){
        //let totalarr = this.totalmerge;
        /*
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
        */
        this.curPar = new Object();
        this.curMerge = new Object();
        let mergeobj = new Object();
        this.curPar[this.pers[0]] = this.data[this.pers[0]];
        mergeobj['per'] = this.pers[0];
        mergeobj['parent'] = "";
        mergeobj['id'] = this.data[this.pers[0]];
        this.curMerge[this.data[this.pers[0]]]= mergeobj;//({id:this.data[this.pers[0]], value: mergeobj});
        //this.curMerge[this.data[this.pers[0]]]['per'] = this.pers[0];
        //this.curMerge[this.data[this.pers[0]]]['parent'] = "";
        //this.curMerge[this.data[this.pers[0]]]['id'] = this.data[this.pers[0]];
        for (let i = 1;i<this.length;i++){
            if (parseFloat(this.pers[i])>persistence)
            {this.curPar[this.pers[i]] = this.data[this.pers[i]];
            for(let j = 0;j<this.merge[this.pers[i]].length;j = j+2)
            {
                mergeobj['per'] = this.pers[i];
                mergeobj['parent'] = this.merge[this.pers[i]][j];
                mergeobj['id'] = this.merge[this.pers[i]][j];
                this.curMerge[this.merge[this.pers[i]][j]]= mergeobj;//.push({id:this.data[this.pers[i]], value: mergeobj});

            }



            }
        }
        //et length = this.pers.length;
        //for (let i =0)
    }


}
