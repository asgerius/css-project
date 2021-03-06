The Stack Overflow data can naturally be understood as a network in which the individual users are nodes, linked by the interactions they make.  
The data can hereby be modelled as a directed, weighted graph, in which each node is a unique user on Stack Overflow, and each edge is an interaction between a pair of users, this being a user answering a question asked by another user,or commenting on either a question or an answer by another user. 
The associated weight is the number of times these users have interacted.

The graph-making process can be further inspected in the notebook, where we use Networkx to model the Stack Overflow data as a DiGraph.

This graph can be partitioned into 16 subgraphs, ie. the 16 different programming languages, and as each user is not bound to interact on just one og these languages, we devide the nodes (users) into partitions based on which programming language they are most heavily weighted and therefor interacted most on.  
Below we see the number of nodes, edges and density of each partition and entire Stack Overflow network graph.


>>>>>>>>>>>>>>>>>>VIS BASIC STATISTICS MED # NODES, EDGES & DENSITY


As is clear on the above table, the number of nodes and edges varies quite a bit for the different programming languages. 
The data collection process did not intentionally bias on the basis of any percieved programming popularity, or the included belovedness scores, but did in fact collect different amounts of data based on availability for each programming language, and this is what mainly causes the size difference.

We see that the graph densities are very low, which is no suprise given the very large number of nodes. Recall density is given by:
\begin{equation*}
    density(G) = \frac{m}{n \cdot (n-1)}
\end{equation*}
In which n is the number of nodes and m is number of edges, ie. we would need $m = n \cdot (n-1)$ edges for a complete graph with density 1, around 50 billion (9 zeros) for the big Stack Overflow Network graph.

Below, we show in- and out-degrees of the subgraphs and the big Stach Overflow network graph in a table table.


>>>>>>>>>>>>>>>>>>VIS IN- OUT-DEGREE TABLE


The degree table and histograms above showcase som key insights in the data:
 - The max in and out-degrees are significantly larger for several of the programming languages which featured a smaller number of nodes and edges, which indicates that there are less widespread knowledge of the programming language and fewer, bigger players who help the community. This is especially true at Rust, which has one user whose outgoing edges accounted for around 15% of the total number of edges. 
 - The mode out suggests, that for all programming language partitions, as well as the big graph, around half of users come to Stack Overflow, leave one answer or comment and then leaves. 
 
The above degree-data is plotted as histograms below:
 
 
>>>>>>>>>>>>>>>>>>VIS IN- OUT-DEGREE HISTOGRAM FOR STOR SO GRAF

>>>>>>>>>>>>>>>>>>VIS IN- OUT-DEGREE HISTOGRAMS FOR 16 PARTITION GRAFER

From the degree plots, we see that the different programming language partitions are very similar, though still importantly resemble real, non-random networks.


We now want to investigate whether the network we have graphed from the Stack Overflow data is in fact random or not.
By having partitioned the Stack Overflow network graph based on the different programming languages, we can compute the modularity of the graph and answer this question.

Modularity is loosely speaking a measure of how good a given partitioning of a graph is, with higher modularity implying better partitioning. 
Specifically, modularity measures how much edge densities in each partition vary from the global edge density. 
In random networks, no systematic differences exist, and the modularity should be expected to be distributed with a mean of 0. 
This provides a way to determine if a given partitioning is a result of chance or not.

Using Networkx, we find that the modularity of the Stack Overflow network graph is $modularity(so_graph) = 0.7366$, which indicates the graph with it's partitions is not random.

To further confirm this, we use a configuration model for generating random variations of the Stack overflow network graph, which show a modularity naturally distributed, *very* closely around 0.


>>>>>>>>>>>>>>>>>>VIS DIST PLOT FOR CONF-MODEL MODULARITET


It seems the partitioning of the different programming languages is very good.

Running the Louvain algorithm to end this partitioning investigation, yields a modularity of $0.761$ with 5982 partitions.  
The Louvain algorithm thus found a higher modularity than with the programming language specific partitioning. 
This shows that it is possible to divide the graph into components that are even stronger internally connected according to the modularity measure.


Lastly, we use Netwulf to show the Stack Overflow network graph, each porgamming language having the color seen in the table to the right.  
Looking at the network like this, seemingly indicates that users who belong to the programming languages Python and Javascript mix quite a bit, and gravitate toward the middle of the graph, meaning they presumably interact more or less with all the other partitions, and telling the story of users who come to Stack Overflow, mainly having problems related to the two languages, but also related others.
These two are starkly contrasted by the users partitioned to the programming languages Haskell, objective-c, go, dart, ruby, vba and perl which all group closely together, telling the story of users coming to Stack Overflow with problems only related to one of these programming languages.


>>>>>>>>>>>>>>>>>>VIS BILLEDE AF NETV??RKET

