#bCharts Documentation

##ch
The `ch` function is either a callback that accepts the `container` argument, or it is an object for charting tools.

##ch.SVG
The `SVG` property creates a new SVG Element with a given width and height.

##ch.data
The `data` property creates a range for a dataset and allows for access to the `data.relative` property that will return an array of adjusted values.

##ch.drawLines
The `drawLines` property accepts a data object that is formed with the `data.relative` property.


#Basic Chart Deployment
var data = ch.data([1,3,5,7,8,4,3,1,4])
    .relative();

ch(".container")
  .SVG(500, 500)
  .drawLines(data)
  .drawDots(data)
  .append();
