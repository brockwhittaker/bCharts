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
  var value = (600 - $(this).attr("cy")) / 600 * {{RANGE}} + {{MIN}};

  $("#bcharts-data-box")
    .attr("data-hover", true)
    .attr("data-display", $.time("U"));

  $(this).attr("r", $(this).attr("r") * 1.5);

  $container
    .addClass("bcharts-display")
    .css({
      left: (e.layerX - $container.width() / 2) + "px",
      top: (e.layerY - $container.height() - 10) + "px"
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
