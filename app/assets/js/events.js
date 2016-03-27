var $ = (function () {
  var events = function (sel) {
    var internal = {
      sel: typeof sel === "string" ? document.querySelectorAll(sel) : sel
    };

    var util = {
      loop: function (callback) {
        for (var x = 0; x < internal.sel.length; x++) {
          callback(internal.sel[x], x);
        }
      }
    };

    var ret = [];

    util.loop(function (o, i) {
      ret[i] = o;
    });

    var prototype = {
      on: function (event, callback) {
        util.loop(function (o, i) {
          o.addEventListener(event, function (e) {
            callback.call(this, e);
          });
        });
      }
    };

    for (var x in prototype) {
      if (prototype.hasOwnProperty(x)) {
        ret[x] = prototype[x];
      }
    }

    return ret;
  };

  return events;
})();
