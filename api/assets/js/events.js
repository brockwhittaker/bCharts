var $ = (function () {
  var events = function (sel) {
    var internal = {
      sel: typeof sel === "string" ? document.querySelectorAll(sel) : [sel]
    };

    var util = {
      loop: function (callback) {
        for (var x = 0; x < internal.sel.length; x++) {
          callback(internal.sel[x], x);
        }
      },
      first: function () {
        return internal.sel[0];
      }
    };

    var ret = [];

    util.loop(function (o, i) {
      ret[i] = o;
    });

    var prototype = {
      addClass: function (className) {
        var classes = util.first().className.split(/ /);

        if (classes.indexOf(className) === -1) {
          classes.push(className);
          util.first().className = classes.join(" ");
        }

        return this;
      },
      attr: function (attr, value) {
        if (typeof value === "undefined" || value === null) {
          return util.first().getAttribute(attr);
        } else {
          util.first().setAttribute(attr, value);
        }

        return this;
      },
      css: function (attr, value) {
        if (typeof attr === "object") {

          util.loop(function (o, i) {
            for (var x in attr) {
              if (attr.hasOwnProperty(x)) {
                o.style[x] = attr[x];
              }
            }
          });
        } else if ((typeof attr) === (typeof value)) {
          util.loop(function (o, i) {
            o.style[attr] = value;
          });
        }

        return this;
      },
      height: function () {
        return util.first().clientHeight;
      },
      html: function (html) {
        if (typeof html !== "undefined" && html !== null) {
          util.loop(function (o, i) {
            o.innerHTML = html;
          });
        } else return util.first().innerHTML;
      },
      removeClass: function (className) {
        var classes = util.first().className.split(/ /);
        var index = classes.indexOf(className);

        if (index !== -1) {
          classes.splice(index, 1);
          util.first().className = classes.join(" ");
        }

        return this;
      },
      on: function (event, callback) {
        util.loop(function (o, i) {
          o.addEventListener(event, function (e) {
            callback.call(this, e);
          });
        });

        return this;
      },
      width: function () {
        return util.first().clientWidth;
      }
    };

    for (var x in prototype) {
      if (prototype.hasOwnProperty(x)) {
        ret[x] = prototype[x];
      }
    }

    return ret;
  };

  events.time = function (type) {
    var date = new Date();
    var obj = {
      "U": date * 1
    };

    return obj[type] || date;
  };

  return events;
})();
