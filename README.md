# Homepage for the Project of Visualization for data science

## Multivariate data visualization

### Author: Di Wang, Shenruoyang Na 

One important application of information visualization is that it helps domain experts
understand multivariate data, which is hard to visualize in conventional ways. Dimension
reduction method such as PCA can help visualize the data, but some features of the high
dimension space are lost through the dimension reduction process. The main inspiration of
this project is the previous work Visual Exploration of High Dimensional Scalar Functions by
Samuel Gerber. In this paper, a method that involves computation of Morse Smale Complex
is used to cluster high dimensional data. Different persistence levels are calculated for each
partition to measure the significance level of features in each partition. Then an inverse
kernel regression method is used to show the behavior of the point clouds along each
attribute. The existing tool that uses this algorithm is written in C++ and python, which does
not provide powerful interaction as what javascript and d3 does in frontend. Designing such
interface will help users or domain experts do better analysis on multivariate data and
understand the high dimension space.

The main goal of this project is to create a tool for the users to analyze specific dataset of
user’s interest. Such tool provides the ability for the users to understand the high
dimensional space (high dimension data is used here instead of multivariate data just to be
consistent with the original paper, but it is the same idea). Depending on the persistence
level, which is a measure of the significance of the feature, the tool displays how the overall
dataset splits into different clusters, shown as a tree structure. It is also able to filter out the
outliers. The outliers here are partition of certain size. However, this depends on the user’s
interest because the user knows whether he/she is interested in partition of certain size. It
show also be able to show different plots of the partition that the users are interested in. The
interactions between these visualizations would help the users understand more about the
high dimensional data.

The dataset used for this visualization is not limited to any single dataset. The first dataset
that is going to be analyzed is related to nuclear simulation are obtained from Nuclear
Energy University Program. Other multivariate datasets of users’ interests from different
fields can also be used for this visualization. We got some good feedbacks from through the
peer review session about the size of the data to visualize. When the size of the dataset is
too large, we would have a function that only selects certain samples from the whole dataset
to visualize.

[Project Website](https://orpheus92.github.io/RegulusHD/)

[Project Process Book](https://github.com/orpheus92/RegulusHD/blob/master/Final%20Process%20Book.pdf)

[Project Video](https://www.youtube.com/watch?v=Be3EEkM_OZ0)
