import numpy as np
import json
import time
import os

def convertind(str):
    str1,str2 = str.split(',')
    return [int(str1),int(str2)]

def convertkey(ind1,ind2):
    return str(ind1)+', '+str(ind2)

def mergemin(c,p,d):
    indpair = list(d.keys())
    indpair2 = np.array([convertind(pair) for pair in indpair ])
    listmax = indpair2[:,1][indpair2[:,0]==int(p)]
    for maxin in listmax:
        if convertkey(int(c),maxin) in indpair:
            temp = d[convertkey(int(c),maxin)]
            d[convertkey(int(p),maxin)]=d[convertkey(int(p),maxin)]+temp
            del d[convertkey(int(c),maxin)]

def mergemax(c,p,d):
    indpair = list(d.keys())
    indpair2 = np.array([convertind(pair) for pair in indpair ])
    listmin = indpair2[:,0][indpair2[:,1]==int(p)]
    for minin in listmin:
        if convertkey(minin,int(c)) in indpair:
            temp = d[convertkey(minin,int(c))]
            d[convertkey(minin,int(p))]=d[convertkey(minin,int(p))]+temp
            del d[convertkey(minin,int(c))]

maxmerge = np.genfromtxt('max_merge.csv', delimiter=",")
minmerge = np.genfromtxt('min_merge.csv', delimiter=",")
# Explain how the partitions merge
# Persistence, saddleIdx, mergedInd, parentInd
maxmerge = np.delete(maxmerge,0,0)
maxmerge[:,1] = 1 # 1 for maxima
minmerge = np.delete(minmerge,0,0)
minmerge[:,1] = 0 # 0 for minima
# sort to avoid wrong merge

totalmerge = np.concatenate((maxmerge, minmerge), axis=0)
#maxmerge2 = maxmerge[np.argsort(maxmerge[:, 0])]
#minmerge2 = minmerge[np.argsort(minmerge[:, 0])]

totalmerge2 = totalmerge[np.argsort(totalmerge[:, 0])]
# Json file that stores the initial partition
# Keys specified as "minInd, maxInd",
# Values store the points that belong to the partition
with open('persistence3.json') as data_file:
    data = json.load(data_file)
#print(data)
# suppose the user input a persistence level, we need an algorithm to update
# the clusters so that the trees show results of specific persistence level

#print("Persistence Levels = ")
#print("[0,"+str(max(max(maxmerge[:,0]),max(minmerge[:,0])))+"]")
#Pinter = float(input('Input Persistence of Interest: '))
Pinter = 2

# minindex to from child to parent
#minchild = minmerge2[minmerge2[:,0]<Pinter][:,2]
#minparent = minmerge2[minmerge2[:,0]<Pinter][:,3]

#maxchild = maxmerge2[maxmerge2[:,0]<Pinter][:,2]
#maxparent = maxmerge2[maxmerge2[:,0]<Pinter][:,3]

child = totalmerge2[totalmerge2[:,0]<Pinter][:,2]
parent = totalmerge2[totalmerge2[:,0]<Pinter][:,3]
tomerge = totalmerge2[totalmerge2[:,0]<Pinter]

newdict = data.copy()
#indpair = list(data.keys())
#indpair2 = np.array([convertind(pair) for pair in indpair ])
[r,c] = tomerge.shape

for i in range(r):
    if tomerge[i,1]==0:
        mergemin(int(child[i]),int(parent[i]),newdict)
    else:
        mergemax(int(child[i]),int(parent[i]),newdict)

print(newdict)
#print(indpair2)
#print(child)