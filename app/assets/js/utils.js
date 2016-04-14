var ch = (function () {
  var util = function (container) {
    util.container = document.querySelectorAll(container)[0];
    return util;
  };

  util._tools = {
    lineColor: function (index, formatted) {
      var COLORS = [[100,169,197], [230,106,124], [151,110,201], [169,201,110], [230,176,99]];

      var selection = COLORS[index % COLORS.length];
      if (formatted) return "rgb(" + selection.join(",") + ")";
      else return COLORS[index % COLORS.length];
    },

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
      circle.setAttribute("stroke-width", 0.03);
      circle.setAttribute("stroke", "transparent");

      return circle;
    },
    text: function (text, x, y, font_family, font_size) {
      var node = document.createElementNS("http://www.w3.org/2000/svg", "text");

      node.setAttribute("x", x);
      node.setAttribute("y", y);
      node.setAttribute("font-family", font_family || "Helvetica Neue");
      node.setAttribute("font-weight", font_family || "200");
      node.setAttribute("font-size", font_size || "0.020pt");

      node.innerHTML = text;

      return node;
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
    },
    getY: function (num, range) {
      return 1 - (num - range.min) / range.range;
    },
    setTickSize: function (range) {
      var tick_size = Math.pow(10, Math.round(Math.log10(range.range)));
      var num_ticks = range.range / tick_size;
      var acceptable_ticks = [0.01, 0.02, 0.05, 0.10, 0.20, 0.25, 0.40, 0.50, 1, 2, 4, 5, 10, 20, 50, 100];
      var DESIRED_TICKS = 10;
      var closest_index = 0,
          closest_resid = Infinity;

      acceptable_ticks.forEach(function (o, i) {
        if (Math.abs(num_ticks * o - DESIRED_TICKS) < closest_resid) {
          closest_resid = Math.abs(num_ticks * o - DESIRED_TICKS);
          closest_index = i;
        }
      });

      console.log("closest_index", acceptable_ticks[closest_index]);
      return tick_size / acceptable_ticks[closest_index];
    },
    setModMin: function (range, tick_size) {
      var mod_min = Math.round(range.min / tick_size) * tick_size;

      if (mod_min < range.min) {
        mod_min += tick_size;
      }

      return mod_min;
    }
  };

  util.SVG = function (width, height) {
    this.SVGElem = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    this.SVGElem.setAttribute("width", width);
    this.SVGElem.setAttribute("height", height);

    this.SVGElem.setAttribute("viewBox", "-0.1 0 " + (width / height + 0.2) + " 1");

    this.SVGElem.setAttribute("version", "1.1");
    this.SVGElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    return this;
  };

  util.dataBox = function () {
    var node = document.createElement("div");
    node.id = "bcharts-data-box";

    return node;
  };

  util.append = function (node, callback) {
    this.container.appendChild(node || this.SVGElem);
    this.container.appendChild(this.dataBox());
    callback();
  };

  util.data = function (data, settings) {
    var $this = this;

    this.width = settings.width || 500;
    this.height = settings.height || 300;

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

    this.range = range;

    range.range = range.max - range.min;

    return {
      range: range,
      relative: function () {
        if (Array.isArray(data[0])) {
          return data.map(function (o, i) {
            var len = o.length - 1;
            return o.map(function (p, j) {
              return {
                x: $this.width / $this.height * j / len,
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
          util.SVGElem.appendChild(util._tools.line(o[j - 1].x, o[j - 1].y, p.x, p.y, util._tools.lineColor(i, true), 0.003));
        }
      });
    });

    return this;
  };

  util.drawDots = function (data) {
    data.forEach(function (o, i) {
      o.forEach(function (p, j) {
        util.SVGElem.appendChild(util._tools.circle(p.x, p.y, 0.007, util._tools.lineColor(i, true)));
      });
    });

    return this;
  };

  util.xAxis = function (range, formatter) {
    var tick_size = util._tools.setTickSize(range);
    var mod_min = util._tools.setModMin(range, tick_size);

    console.log(tick_size, mod_min);

    var y = 10;
    for (var x = mod_min; x <= range.max; x += tick_size) {
      util.SVGElem.appendChild(util._tools.text((formatter) ? formatter(x) : x, -0.08, util._tools.getY(x, range)));
      y--;
    }

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

var arr = map(50, function (x, y) { return y + Math.random() * 20 - 10; });
var arr2 = map(50, function (x, y) { return y + Math.random() * 20 - 10; });

var dataObj = ch.data([arr, arr2], {
  width: 500,
  height: 300
});
var relative = dataObj.relative();
var range = dataObj.range;

ch(".container")
  .SVG(1000, 600)
  .drawLines(relative)
  .drawDots(relative)
  .xAxis(range, function (x) {
    return x.toFixed(2);
  })
  .append(null, function () {
    function onLeave () {
      var duration = 500;

      setTimeout(function () {
        var timeSinceAction = $("#bcharts-data-box").attr("data-display") - $.time("U"),
            currentlyHovering = $("#bcharts-data-box").attr("data-hover");

        if (timeSinceAction <= -duration && currentlyHovering == "false") {
          $("#bcharts-data-box").removeClass("bcharts-display");
        }
      }, duration);
    }

    $("svg circle").on("mouseenter", function (e) {
      var $container = $("#bcharts-data-box");
      var value = (1 - $(this).attr("cy")) * ch.range.range + ch.range.min;

      $("#bcharts-data-box")
        .attr("data-hover", true)
        .attr("data-display", $.time("U"));

      var coords = e.target.getBoundingClientRect();


      $(this).attr("r", $(this).attr("r") * 1.5);

      $container
        .addClass("bcharts-display")
        .css({
          left: (coords.left - $container.width() / 2 + 4) + "px",
          top: (coords.top - $container.height() - 10) + "px"
        })
        .attr("data-display", $.time("U"))
        .html("y: " + value.toFixed(2));
    });

    $("svg circle").on("mouseleave", function () {
      $("#bcharts-data-box").attr("data-hover", false);
      $(this).attr("data-display", $.time("U"));
      $(this).attr("r", $(this).attr("r") * (1 / 1.5));

      onLeave();
    });

    $("#bcharts-data-box").on("mouseenter", function () {
      $("#bcharts-data-box").attr("data-hover", true);
      $(this).attr("data-display", $.time("U"));
    });

    $("#bcharts-data-box").on("mouseleave", function () {
      $(this).attr("data-display", $.time("U"));
      $("#bcharts-data-box").attr("data-hover", false);
      onLeave();
    });
  });
