(function () {
  var $ = _;

  var Util = {
    highlightSection: function (container) {
      $(container).each(function () {
        hljs.highlightBlock(this);
      });
    },
    renderCodeBlock: function (settings) {
      $("#code_container h3").css("display", "none");

      $("#code").html(JSON.stringify(settings, undefined, 2).replace(/(\[+[^\[]+\])/g, function (match) {
        return match.replace(/\n|\r|(\s)+/g, "");
      }));
    }
  };

  var deleteNullProps = function (test, recurse) {
      for (var i in test) {
          if (!test[i] && test[i] !== false && test[i] !== 0) {
              delete test[i];
              console.log(true);
          } else if (recurse && typeof test[i] === 'object') {
              deleteNullProps(test[i], recurse);
          }
      }
  };

  var Builder = {
    constructObject: function () {
      var chart = {
        data: JSON.parse("[" + $("#data").val() + "]"),
        settings: {
          draw: {
            circles: JSON.parse($("#plot_points").data("checked")),
            lines: JSON.parse($("#plot_lines").data("checked")),
            axis: {
              y: JSON.parse($("#y_axis").data("checked")),
              lines: JSON.parse($("#y_axis_lines").data("checked"))
            }
          },
          area: {
            color: $("#area_colors").val() ? $("#area_colors").val().split(/,/) : null
          },
          axis: {
            lineColor: $("#axis_line_color").val(),
            rounding: $("#axis_rounding").val(),
            font: {
              family: $("#axis_font_family").val(),
              size: $("#axis_font_size").val(),
              weight: $("#axis_font_weight").val()
            }
          },
          circle: {
            radius: $("#point_radius").val()
          },
          line: {
            color: $("#line_color").val() ? $("#line_color").val().split(/,/) : null,
            width: $("#line_width").val()
          },
          padding: {
            top: $("#padding_top").val(),
            bottom: $("#padding_bottom").val(),
            left: $("#padding_left").val(),
            right: $("#padding_right").val(),
          },
          dimensions: {
            width: $("#chart_width").val(),
            height: $("#chart_height").val()
          }
        }
      };

      deleteNullProps(chart, true);

      return chart;
    },

    timesGenerated: 0
  };


  $(".checkbox").click(function () {
    var checked = ($(this).data("checked") == "true");

    $(this)
      .toggleClass("checked")
      .data("checked", !checked);
  });

  $("label").click(function () {
    var for_elem = $(this).attr("for");
    $("#" + for_elem).click();
  });

  $("#code_container #exit").click(function () {
    $("#code_container").removeClass("show");
  });

  $("#get_code").click(function () {
    $("#code_container").addClass("show");

    Util.highlightSection("#code");
  });

  $("button#generate_button").click(function () {
    var settings = Builder.constructObject();
    Util.renderCodeBlock(settings);
    $("#get_code, .container").each(function () {
      $(this).addClass("show");
    });

    $.ajax({
      type: "POST",
      url: "../api/v1/",
      data: {
        chart: settings
      },
      callback: function (response, err) {
        try {
          response = JSON.parse(response);
        } catch (error) {
          $(".container").html(response);
          return;
        }

        // append SVG HTML to the container
        $(".container")
          .html("")
          .html(response.html, true);

        if ($("#script_0, #script_1")[0]) {
          $("#script_0, #script_1").each(function () {
            $(this).remove();
          });
        }

          // for each script, append to the DOM
          response.scripts.forEach(function (o, i) {
            var script = document.createElement("script");
            script.id = "script_" + i;
            script.innerHTML = o;
            document.body.appendChild(script);
          });

          if (Builder.timesGenerated === 0) {
            // for each stylesheet, append to the HEAD
            response.css.forEach(function (o, i) {
              var style = document.createElement("style");
              style.innerHTML = o;
              style.id = "style_" + i;
              document.head.appendChild(style);
            });
          }

        Builder.timesGenerated++;
      },
      dataType: null //"json"
    });
  });
})();
