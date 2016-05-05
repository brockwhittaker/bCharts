<?php
header('Access-Control-Allow-Origin: *');

require("draw-chart.php");


function assign (&$settings, $attr, $value) {
  if (!isset($settings[$attr])) {
    $settings[$attr] = $value;
  }

  return $settings;
}

$internal = array(
  "draw" => array(
    "lines" => true,
    "circles" => true,
    "axis" => array(
      "y" => true,
      "lines" => true
    )
  ),
  "axis" => array(
    "lineColor" => "rgba(0,0,0,0.2)",
    "rounding" => 2,
    "font" => array(
      "family" => "inherit",
      "weight" => "inherit",
      "size" => "12pt"
    )
  ),
  "line" => array(
    "color" => array(array(100,169,197), array(230,106,124), array(151,110,201), array(169,201,110), array(230,176,99)),
    "width" => 5
  ),
  "area" => array(
    "fill" => array("transparent"),
  ),
  "circle" => array(
    "radius" => 8
  ),
  "padding" => array(
    "left" => 100,
    "top" => 20,
    "bottom" => 20,
    "right" => 20
  ),
  "dimensions" => array(
    "width" => 1000,
    "height" => 600
  )
);

$data = new Chart();

$POST = json_decode($_POST["chart"], true);

$settings = (isset($POST["settings"])) ? $POST["settings"] : array();
$settings = array_replace_recursive($internal, $settings);

//print_r($settings["dimensions"]);

$DIM = $settings["dimensions"];
$PADDING = $settings["padding"];


for ($x = 0; $x < count($POST["data"]); $x++) {
  $data->addData($POST["data"][$x]);
}

$data->init($settings);

echo json_encode($data->construct($settings));
?>
