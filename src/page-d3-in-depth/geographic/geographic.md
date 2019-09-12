Geographic
This chapter looks at D3’s approach to rendering geographic information. For example:


View source | Edit in GistRun
D3’s approach differs to so called raster methods such as Leaflet and Google Maps. These pre-render map features as image tiles and these are served up and pieced together in the browser to form a map. Typically D3 requests vector geographic information in the form of GeoJSON and renders this to SVG or Canvas in the browser.

Raster maps often look more like traditional print maps where a lot of detail (e.g. place names, roads, rivers etc.) can be shown without an impact on performance. However, dynamic content such as animation and interaction is more easily implemented using a vector approach. (It’s also quite common to combine the two approaches.)

D3 mapping concepts
The 3 concepts that are key to understanding map creation using D3 are:

GeoJSON (a JSON-based format for specifying geographic data)
projections (functions that convert from latitude/longitude co-ordinates to x & y co-ordinates)
geographic path generators (functions that convert GeoJSON shapes into SVG or Canvas paths)
Let’s look at these one by one.

GeoJSON
GeoJSON is a standard for representing geographic data using the JSON format and the full specification is at geojson.org.

It’s fairly straightforward to get the hang of and the example below shows a typical GeoJSON object:

{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Africa"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-6, 36], [33, 30], ... , [-6, 36]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Australia"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[143, -11], [153, -28], ... , [143, -11]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Timbuktu"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-3.0026, 16.7666]
      }
    }
  ]
}
In the above example we have a FeatureCollection containing an array of 3 features:

Africa
Australia
the city of Timbuktu
Each feature consists of geometry (simple polygons in the case of the countries and a point for Timbuktu) and properties.

Properties can contain any information about the feature such as name, id, and other data such as population, GDP etc.

As we’ll see later, D3 takes care of most of the detail when rendering GeoJSON so you only need a basic understanding of GeoJSON to get started with D3 mapping.

Projections
A projection function takes a longitude and latitude co-ordinate (in the form of an array [lon, lat]) and transforms it into an x and y co-ordinate:

function projection( lonLat ) {
  var x = ... // some formula here to calculate x
  var y = ... // some formula here to calculate y
  return [x, y];
}

projection( [-3.0026, 16.7666] )
// returns [474.7594743879618, 220.7367625635119]
Projection mathematics can get quite complex but fortunately D3 provides a large number of projection functions.

For example we can create an equi-rectangular projection function using:

var projection = d3.geoEquirectangular();

projection( [-3.0026, 16.7666] )
// returns [474.7594743879618, 220.7367625635119]
We’ll look at projections in much more detail later.

Geographic path generators
A geographic path generator is a function that takes a GeoJSON object and converts it into an SVG path string. (In fact, it’s just another type of shape generator.)

We create a generator using the method .geoPath() and configure it with a projection function:

var projection = d3.geoEquirectangular();

var geoGenerator = d3.geoPath()
  .projection(projection);

var geoJson = {
  "type": "Feature",
  "properties": {
    "name": "Africa"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[-6, 36], [33, 30], ... , [-6, 36]]]
  }
}

geoGenerator(geoJson);
// returns "M464.0166237760863,154.09974265651798L491.1506253268278,154.8895088551978 ... L448.03311471280136,183.1346693994119Z"
As usual with shape generators the generated path string is used to set the d attribute on an SVG path element.

Putting it all together
Once we have some GeoJSON, a projection function and a geographic path generator we can use them together to create a basic map:

var geoJson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Africa"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-6, 36], [33, 30], ... , [-6, 36]]]
      }
    },
    ...
  ]
}

var projection = d3.geoEquirectangular();

var geoGenerator = d3.geoPath()
  .projection(projection);

// Join the FeatureCollection's features array to path elements
var u = d3.select('#content g.map')
  .selectAll('path')
  .data(geojson.features);

// Create path elements and update the d attribute using the geo generator
u.enter()
  .append('path')
  .attr('d', geoGenerator);

View source | Edit in GistRun
(Note that to keep things simple the GeoJSON in the above example uses just a few co-ordinates to define the country boundaries.)

The above example shows the essence of creating maps using D3 and I recommend spending time to understand each concept (GeoJSON, projections and geo generators) and how they fit together.

Now that we’ve covered the basics we’ll look at each concept in more detail.

GeoJSON
GeoJSON is a JSON-based structure for specifying geographic data. More often than not it’s converted from shapefile data (a geospatial vector data format widely used in the GIS field) using tools such as mapshaper, ogr2ogr, shp2json or QGIS.

A popular source of world map shapefiles is Natural Earth and if starting out I recommend trying out mapshaper for importing shapefiles and exporting as GeoJSON. It can also filter by properties (e.g. if you wanted to filter countries by continent). For a more in depth look at conversion look at Mike Bostock’s Let’s Make a Map tutorial.

You can create maps without understanding the GeoJSON specification in minute detail because tools such as mapshaper and D3 do such a good job of abstracting away the detail. However, if you did want to understand GeoJSON in greater depth I recommend checking out the official specification.

So far we’ve embedded a GeoJSON object in our example files. In practice the GeoJSON would be in a separate file and loaded using an ajax request. We cover requests in more detail in the requests chapter but for the remainder of this chapter we’ll load a GeoJSON file using:

d3.json('ne_110m_land.json', function(err, json) {
  createMap(json);
})
It’s worth mentioning TopoJSON which is another JSON based standard for describing geographic data and tends to result in significantly smaller file sizes. It requires a bit more work to use, and we don’t cover it in this chapter. However for further information check out the documentation.

Projections
There are numerous (if not infinite) ways of converting (or ‘projecting’) a point on a sphere (e.g. the earth) to a point on a flat surface (e.g. a screen) and people have written countless articles (such as this one) on the pros and cons of different projections.

In short there is no perfect projection as every projection will distort shape, area, distance and/or direction. Choosing a projection is a case of choosing which property you don’t want to be distorted and accepting that there’ll be distortion in the other properties (or choose a projection that strives for a balanced approach). For example, if it’s important that the size of countries are represented accurately then choose a projection that strives to preserve area (probably to the cost of shape, distance and direction).

D3 has a number of core projections that should cover most use cases:

geoAzimuthalEqualArea
geoAzimuthalEquidistant
geoGnomonic
geoOrthographic
geoStereographic
geoAlbers
geoConicConformal
geoConicEqualArea
geoConicEquidistant
geoEquirectangular
geoMercator
geoTransverseMercator
Some projections preserve area (e.g. geoAzimuthalEqualArea & geoConicEqualArea), others distance (e.g. geoAzimuthalEquidistant & geoConicEquidistant) and others relative angles (e.g. geoEquirectangular & geoMercator). For a more in depth discussion of the pros and cons of each projection try resources such as Carlos A. Furuti’s Map Projection Pages.

The grid below shows each core projection on a world map together with a longitude/latitude grid and equal radius circles.


View source | Edit in GistRun
Projection functions
A projection function takes input [longitude, latitude] and outputs a pixel co-ordinate [x, y].

You’re free to write your own projection functions but much easier is to ask D3 to make one for you. To do this choose a projection method (e.g. d3.geoAzimuthalEqualArea), call it and it’ll return a projection function:

var projection = d3.geoAzimuthalEqualArea();

projection( [-3.0026, 16.7666] );
// returns [473.67353385539417, 213.6120079887163]
The core projections have configuration functions for setting the following parameters:

scale	Scale factor of the projection
center	Projection center [longitude, latitude]
translate	Pixel [x,y] location of the projection center
rotate	Rotation of the projection [lambda, phi, gamma] (or [yaw, pitch, roll])
The precise meaning of each parameter is dependent on the mathematics behind each projection but broadly speaking:

scale specifies the scale factor of the projection. The higher the number the larger the map.
center specifies the center of projection (with a [lon, lat] array)
translate specifies where the center of projection is located on the screen (with a [x, y] array)
rotate specifies the rotation of the projection (with a [λ, φ, γ] array) where the parameters correspond to yaw, pitch and roll, respectively:


For example we might create and configure a projection function such that Timbuktu is centred in a 960x500 map using:

var projection = d3.geoAzimuthalEqualArea()
  .scale(300)
  .center([-3.0026, 16.7666])
  .translate([480, 250]);
To get a feel for how each parameter behaves use the projection explorer below. The (equal radius) circles and grid allow you to assess the projection’s distortion of area and angle.


View source | Edit in GistRun
.invert()
We can convert from a pixel co-ordinate [x, y] back to [longitude, latitude] using the projection’s .invert() method:

var projection = d3.geoAzimuthalEqualArea();

projection( [-3.0026, 16.7666] )
// returns [473.67353385539417, 213.6120079887163]

projection.invert( [473.67353385539417, 213.6120079887163] )
// returns [-3.0026, 16.766]
Fitting
Given a GeoJSON object, a projection’s .fitExtent() method sets the projection’s scale and translate such that the geometry fits within a given bounding box:

projection.fitExtent([[0, 0], [900, 500]], geojson);
In the example below the canvas element has a light grey background and the bounding box into which we’re fitting the geoJSON is shown as a dotted outline:


View source | Edit in GistRun
If our bounding box’s top left corner is at [0, 0] we can use the shorthand:

projection.fitSize([900, 500], geojson);
Geographic path generators
A geographic path generator is a function that transforms GeoJSON into an SVG path string (or into canvas element calls):

geoGenerator(geoJson);
// e.g. returns a SVG path string "M464.01,154.09L491.15,154.88 ... L448.03,183.13Z"
We create the generator using d3.geoPath() and usually configure it’s projection type:

var projection = d3.geoEquirectangular();

var geoGenerator = d3.geoPath()
  .projection(projection);
We can now use the generator to help us create an SVG or canvas map. The SVG option is a bit easier to implement, especially when it comes to user interaction as event handlers and hover states can be added. The canvas approach requires a bit more work, but is typically quicker (and more memory efficient) to render.

Rendering SVG
To render SVG we typically join a GeoJSON features array to SVG path elements and update the d attribute using the geographic path generator:

var geoJson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Africa"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-6, 36], [33, 30], ... , [-6, 36]]]
      }
    },
    ...
  ]
}

var projection = d3.geoEquirectangular();

var geoGenerator = d3.geoPath()
  .projection(projection);

// Join the FeatureCollection's features array to path elements
var u = d3.select('#content g.map')
  .selectAll('path')
  .data(geojson.features);

// Create path elements and update the d attribute using the geo generator
u.enter()
  .append('path')
  .attr('d', geoGenerator);

View source | Edit in GistRun
Rendering to canvas
To render to a canvas element we need to configure the context of the geo generator with the canvas’s element:

var context = d3.select('#content canvas')
  .node()
  .getContext('2d');

var geoGenerator = d3.geoPath()
  .projection(projection)
  .context(context);
We can then begin a canvas path and call geoGenerator which will produce the necessary canvas calls for us:

context.beginPath();
geoGenerator({type: 'FeatureCollection', features: geojson.features})
context.stroke();

View source | Edit in GistRun
Lines and arcs
The geographic path generator is clever enough to distinguish between polygonal (typically for geographic areas) and point (typically for lon/lat locations) features. As can be seen in the above examples it renders polygons as line segments and points as arcs.

We can set the radius of the circles using .pointRadius():

var geoGenerator = d3.geoPath()
  .pointRadius(5)
  .projection(projection);
Path geometry
The geographic path generator can also be used to compute the area (in pixels), centroid, bounding box and path length (in pixels) of a projected GeoJSON feature:

var feature = geojson.features[0];

// Compute the feature's area (in pixels)
geoGenerator.area(feature);
// returns 30324.86518469876

// Compute the feature's centroid (in pixel co-ordinates)
geoGenerator.centroid(feature);
// returns [266.9510120424504, 127.35819206325564]

// Compute the feature's centroid (in pixel co-ordinates)
geoGenerator.bounds(feature);
// returns [[140.6588054321928, 24.336293856408275], [378.02358370342165, 272.17304763960306]]

// Compute the path length (in pixels)
geoGenerator.measure(feature);
// returns 775.7895349902461

View source | Edit in GistRun
Shapes
If we need to add lines and/or circles to a map we can achieve it by adding features to our GeoJSON.

Lines can be added as a LineString feature and will be projected into great-arcs (i.e. the shortest distance across the surface of the globe). Here’s an example where we add a line between London and New York:

geoGenerator({
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [[0.1278, 51.5074], [-74.0059, 40.7128]]
  }
});
Circle features can be generated using d3.geoCircle(). Typically the center ([lon, lat]) and the angle (degrees) between the points are set:

var circle = d3.geoCircle()
  .center([0.1278, 51.5074])
  .radius(5);

circle();
// returns a GeoJSON object representing a circle

geoGenerator(circle());
// returns a path string representing the projected circle
A GeoJSON grid of longitude and latitude lines (known as a graticule) can be generated using d3.graticule():

var graticule = d3.geoGraticule();

graticule();
// returns a GeoJSON object representing the graticule

geoGenerator(graticule());
// returns a path string representing the projected graticule
(See the official documentation for detailed information on graticule configuration.)

Here’s an example using all three shapes:


View source | Edit in GistRun
Spherical geometry
There’s a handful of D3 methods that may come in useful from time to time. The first of these .geoArea(), .geoBounds(), .geoCentroid(), .geoDistance() and geoLength() are similar to the path geometry methods described above but operate in spherical space.

Interpolation
The d3.geoInterpolate() method creates a function that accepts input between 0 and 1 and interpolates between two [lon, lat] locations:

var londonLonLat = [0.1278, 51.5074];
var newYorkLonLat = [-74.0059, 40.7128];
var geoInterpolator = d3.geoInterpolate(londonLonLat, newYorkLonLat);

geoInterpolator(0);
// returns [0.1278, 51.5074]

geoInterpolator(0.5);
// returns [-41.182023242967695, 52.41428456719971] (halfway between the two locations)

View source | Edit in GistRun
geoContains
If we’re using the canvas element to render our geometry we don’t have the luxury of being able to add event handlers onto path objects. Instead we need to check whether mouse or touch events occur inside the boundary of a feature. We can do this using d3.geoContains which accepts a GeoJSON feature and a [lon, lat] array and returns a boolean:

d3.geoContains(ukFeature, [0.1278, 51.5074]);
// returns true

View source | Edit in GistRun