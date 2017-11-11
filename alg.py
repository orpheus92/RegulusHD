import numpy as np
import json
maxmerge = np.genfromtxt('max_merge.csv', delimiter=",")
minmerge = np.genfromtxt('min_merge.csv', delimiter=",")

print(maxmerge)
print(minmerge)
with open('persistence3.json') as data_file:
    data = json.load(data_file)
print(data)
