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
      "ticks" => true,
      "lines" => true,
      "lineColor" => "rgb(0,0,0,0.2)"
    )
  ),
  "line" => array(
    "fill" => array(array(100,169,197), array(230,106,124), array(151,110,201), array(169,201,110), array(230,176,99))
  ),
  "area" => array(
    "fill" => array(array(100,169,197), array(230,106,124), array(151,110,201), array(169,201,110), array(230,176,99)),
  ),
  "lineWidth" => 1,
  "circleRadius" => 2,
  "font" => array(
    "family" => "Lato",
    "weight" => 300,
    "size" => "12pt"
  ),
  "padding" => array(
    "left" => 50,
    "top" => 10,
    "bottom" => 10,
    "right" => 10
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

$DIM = $settings["dimensions"];
$PADDING = $settings["padding"];


for ($x = 0; $x < count($POST["data"]); $x++) {
  $data->addData($POST["data"][$x]);
}

$data->init($settings);

echo json_encode($data->construct($settings));
?>
