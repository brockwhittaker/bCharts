var ch = (function () {
  var util = function (container) {
    util.container = document.querySelectorAll(container)[0];
    return util;
  };

  util._tools = {
    line: function (x1, y1, x2, y2, stroke, stroke_width) {
      var line = document.createElementNS("http://www.w3.org/2000/svg", "line");

      line.setAttribute("x1", x1);
      line.setAttribute("x2", x2);
      line.setAttribute("y1", y1);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", stroke);
      line.setAttribute("stroke-width", stroke_width);

      return line;
    },
    circle: function (cx, cy, r, fill) {
      var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", r);
      circle.setAttribute("fill", fill);

      return circle;
    },
    setNumber: function (a, b) {
      if (typeof a == "number") return a;
      else return b;
    },
    multiRange: function (arr) {
      var mins = arr.map(function (o) {
        return Math.min.apply(null, o);
      });
      var maxs = arr.map(function (o) {
        return Math.max.apply(null, o);
      });

      return {
        mins: mins,
        maxs: maxs
      };
    }
  };

  util.SVG = function (width, height) {
    this.SVGElem = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    this.SVGElem.setAttribute("width", width);
    this.SVGElem.setAttribute("height", height);

    this.SVGElem.setAttribute("viewBox", "-0.1 -0.1 1.2 1.2");

    this.SVGElem.setAttribute("version", "1.1");
    this.SVGElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    return this;
  };

  util.append = function (node, callback) {
    this.container.appendChild(node || this.SVGElem);
    callback();
  };

  util.data = function (data, settings) {
    if (!settings) settings = {};

    var range;
    if (Array.isArray(data[0])) {
      var multi_range = util._tools.multiRange(data);

      range = {
        min: util._tools.setNumber(settings.min, Math.min.apply(null, multi_range.mins)),
        max: util._tools.setNumber(settings.max, Math.max.apply(null, multi_range.maxs))
      };
    } else {
      range = {
        min: util._tools.setNumber(settings.min, Math.min.apply(null, data)),
        max: util._tools.setNumber(settings.max, Math.max.apply(null, data))
      };
    }

    range.range = range.max - range.min;

    return {
      range: range,
      relative: function () {
        if (Array.isArray(data[0])) {
          return data.map(function (o, i) {
            var len = o.length - 1;

            return o.map(function (p, j) {
              return {
                x: j / len,
                y: 1 - ((p - range.min) / range.range)
              };
            });
          });
        } else {
          var len = data.length - 1;

          return [data.map(function (o, i) {
            return {
              x: i / len,
              y: 1 - ((o - range.min) / range.range)
            };
          })];
        }
      }
    };
  };

  util.drawLines = function (data) {
    data.forEach(function (o, i) {
      o.forEach(function (p, j) {
        if (j > 0) {
          util.SVGElem.appendChild(util._tools.line(o[j - 1].x, o[j - 1].y, p.x, p.y, "orange", 0.003));
        }
      });
    });

    return this;
  };

  util.drawDots = function (data) {
    data.forEach(function (o, i) {
      o.forEach(function (p, j) {
        util.SVGElem.appendChild(util._tools.circle(p.x, p.y, 0.003, "grey"));
      });
    });

    return this;
  };

  return util;
})();

function map (count, callback) {
  var arr = new Array(count);
  for (var x = 0; x < arr.length; x++) {
    arr[x] = callback(x, arr[x - 1] || 1);
  }
  return arr;
}

var arr = map(50, function (x, y) { return y + Math.random() - 0.5; });
var arr2 = map(50, function (x, y) { return y + Math.random() - 0.5; });

var data = ch.data([arr, arr2])
    .relative();

ch(".container")
  .SVG(500, 500)
  .drawLines(data)
  .drawDots(data)
  .append(null, function () {
  });