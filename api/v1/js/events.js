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
  var value = ({{ADJ_HEIGHT}} - $(this).attr("cy") + {{PADDING_TOP}}) / {{ADJ_HEIGHT}} * {{RANGE}} + {{MIN}};

  $("#bcharts-data-box")
    .attr("data-hover", true)
    .attr("data-display", $.time("U"));

  $(this).attr("r", $(this).attr("r") * 1.5);

  var coords = e.target.getBoundingClientRect();

  $container
    .addClass("bcharts-display")
    .attr("data-display", $.time("U"))
    .html("y: " + value.toFixed(2));
  $container.css({
    position: "fixed",
    left: (coords.left - $container.width() / 2 + 15) + "px",
    top: (coords.top - 35) + "px"
  });
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
