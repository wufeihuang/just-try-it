Force layout
D3’s force layout uses a physics based simulator for positioning visual elements. Forces can be set up between elements, for example:

all elements repel one another
elements are attracted to center(s) of gravity
linked elements (e.g. friendship) are a fixed distance apart (network visualisation)
elements may not overlap (collision detection)
The force layout allows us to position elements in a way that would be difficult to achieve using other means.

As an example we have a number of circles (each of which has a category A, B or C) and add the following forces:

all circles attract one another (to clump circles together)
collision detection (to stop circles overlapping)
circles are attracted to one of three centers, depending on their category

The force layout requires a larger amount of computation (typically requiring a few seconds of time) than other D3 layouts and and the solution is calculated in a step by step (iterative) manner. Usually the positions of the SVG/HTML elements are updated as the simulation iterates, which is why we see the circles jostling into position.

Setting up a force simulation
Broadly speaking there are 4 steps to setting up a force simulation:

create an array of objects
call forceSimulation, passing in the array of objects
add one or more force functions (e.g. forceManyBody, forceCenter, forceCollide) to the system
set up a callback function to update the element positions after each tick
Let’s start with a minimal example:

var width = 300, height = 300
var nodes = [{}, {}, {}, {}, {}]

var simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody())
  .force('center', d3.forceCenter(width / 2, height / 2))
  .on('tick', ticked);
Here we’ve created a simple array of 5 objects and have added two force functions forceManyBody and forceCenter to the system. (The first of these makes the elements repel each other while the second attracts the elements towards a centre point.)

Each time the simulation iterates the function ticked will be called. This function joins the nodes array to circle elements and updates their positions:

function ticked() {
  var u = d3.select('svg')
    .selectAll('circle')
    .data(nodes)

  u.enter()
    .append('circle')
    .attr('r', 5)
    .merge(u)
    .attr('cx', function(d) {
      return d.x
    })
    .attr('cy', function(d) {
      return d.y
    })

  u.exit().remove()
}

View source | Edit in GistRun
The power and flexibility of the force simulation is centred around force functions which adjust the position and velocity of elements to achieve a number of effects such as attraction, repulstion and collision detection. We can define our own force functions but D3 comes with a number of useful ones built in:

forceCenter (for setting the center of gravity of the system)
forceManyBody (for making elements attract or repel one another)
forceCollide (for preventing elements overlapping)
forceX and forceY (for attracting elements to a given point)
forceLink (for creating a fixed distance between connected elements)
Force functions are added to the simulation using .force() where the first argument is a user defined id and the second argument the force function:

simulation.force('charge', d3.forceManyBody())
Let’s look at the inbuilt force functions one by one.

forceCenter
forceCenter is useful (if not essential) for centering your elements as a whole about a center point. (Without it elements might disappear off the page.)

It can either be initialised with a center position:

d3.forceCenter(100, 100)
or using the configuration functions .x() and .y():

d3.forceCenter().x(100).y(100)
We add it to the system using:

simulation.force('center', d3.forceCenter(100, 100))
See below for usage examples.

forceManyBody
forceManyBody causes all elements to attract or repel one another. The strength of the attraction or repulsion can be set using .strength() where a positive value will cause elements to attract one another while a negative value causes elements to repel each other. The default value is -30.

simulation.force('charge', d3.forceManyBody().strength(-20))

View source | Edit in GistRun
As a rule of thumb, when creating network diagrams we want the elements to repel one another while for visualisations where we’re clumping elements together, attractive forces are necessary.

forceCollide
forceCollide is used to stop elements overlapping and is particularly useful when ‘clumping’ circles together.

We must specify the radius of the elements using .radius():

var numNodes = 100
var nodes = d3.range(numNodes).map(function(d) {
  return {radius: Math.random() * 25}
})

var simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(5))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide().radius(function(d) {
    return d.radius
  }))

View source | Edit in GistRun
forceX and forceY
forceX and forceY cause elements to be attracted towards specified position(s). We can use a single center for all elements or apply the force on a per-element basis. The strength of attraction can be configured using .strength().

As an example suppose we have a number of elements, each of which has a category 0, 1 or 2. We can add a forceX force function to attract the elements to an x-coordinate 100, 300 or 500 based on the element’s category:

simulation.force('x', d3.forceX().x(function(d) {
  return xCenter[d.category];
}))

View source | Edit in GistRun
Note the above example also uses forceCollide.

If our data has a numeric dimension we can use forceX or forceY to position elements along an axis:

simulation.force('x', d3.forceX().x(function(d) {
  return xScale(d.value);
}))
.force('y', d3.forceY().y(function(d) {
  return 0;
}))

View source | Edit in GistRun
Do use the above with caution as the x position of the elements is only approximate.

forceLink
forceLink pushes linked elements to be a fixed distance apart. It requires an array of links that specify which elements we want to link together. Each link object specifies a source and target element, where the value is the element’s array index:

var links = [
  {source: 0, target: 1},
  {source: 0, target: 2},
  {source: 0, target: 3},
  {source: 1, target: 6},
  {source: 3, target: 4},
  {source: 3, target: 7},
  {source: 4, target: 5},
  {source: 4, target: 7}
]
We can then pass our links array into the forceLink function using .links():

simulation.force('link', d3.forceLink().links(links))

View source | Edit in GistRun
The distance and strength of the linked elements can be configured using .distance() (default value is 30) and .strength().