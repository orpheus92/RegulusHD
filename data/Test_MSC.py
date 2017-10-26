#For future compatibility with Python 3
#from __future__ import division, print_function, absolute_import
#import warnings
#warnings.simplefilter('default',DeprecationWarning)
#End compatibility block for Python 3

import sys
import os
from Topolib.MSC.connect.method import myObj
from qtpy import QtWidgets as qtw

#myPath = os.path.dirname(os.path.realpath(__file__))
#sys.path.insert(0,myPath)


## Main Function for Test

if __name__ == '__main__':
  app = qtw.QApplication(sys.argv)

  X = None
  Y = None
  # if len(sys.argv) > 1:
  #   print('\tYou probably want me to load a file...')
  #   print('\tThe Maker has not included this in my programming.')


  main = myObj(X,Y,debug=True)
  #main.loadData()
  main.loadData('Pu_TOT.csv')

  #main.show()
  #main.addNewView('TopologyMapView')
  #main.addNewView('ScatterView2D')
  #main.addNewView('SensitivityView')
  #main.addNewView('FitnessView')
  #sys.exit(app.exec_())
