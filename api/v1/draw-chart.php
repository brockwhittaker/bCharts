<?php
require("construct-nodes.php");
require("process-data.php");
require("build-dom.php");

class Chart Extends ProcessData {
  public function init ($settings) {
    $this->padding = $settings["padding"];
    $this->dimensions = $settings["dimensions"];
    $this->settings = $settings;

    $this->bounds = array(
      "upper" => $this->padding["top"],
      "lower" => $this->dimensions["height"] - $this->padding["bottom"],
      "left" => $this->padding["left"],
      "right" => $this->dimensions["width"] - $this->padding["right"]
    );

    $this->width = $settings["dimensions"]["width"];
    $this->height = $settings["dimensions"]["height"];

    $this->adjusted_width = $settings["dimensions"]["width"] - ($settings["padding"]["left"] + $settings["padding"]["right"]);
    $this->adjusted_height = $settings["dimensions"]["height"] - ($settings["padding"]["top"] + $settings["padding"]["bottom"]);


    $this->relativeArrays(TRUE);
  }

  private function __lineColor ($index, $opacity = 1) {
    $COLORS = $this->settings["line"]["color"];
    $AREA_COLORS = $this->settings["area"]["fill"];

    $color = $COLORS[$index % count($COLORS)];

    if (is_string($color)) {
      return $color;
    } else {
      return "rgba(" . implode(",", $color) . "," . ((is_string($opacity)) ? !!$opacity : $opacity) . ")";
    }
  }

  private function __setTickSize () {
    $tick_size = pow(10, round(log10($this->range["range"])));
    $num_ticks = $this->range["range"] / $tick_size;
    $acceptable_ticks = array(0.01, 0.02, 0.05, 0.10, 0.20, 0.25, 0.40, 0.50, 1, 2, 4, 5, 10, 20, 50, 100);
    $DESIRED_TICKS = 10;
    $closest_index = 0;
    $closest_resid = INF;

    $index = 0;
    foreach ($acceptable_ticks as $x) {
      if (abs($num_ticks * $x - $DESIRED_TICKS) < $closest_resid) {
        $closest_resid = abs($num_ticks * $x - $DESIRED_TICKS);
        $closest_index = $index;
      }
      $index++;
    }

    return $tick_size / $acceptable_ticks[$closest_index];
  }

  private function __setModMin ($tick_size) {
    $mod_min = round($this->range["min"] / $tick_size) * $tick_size;

    if ($mod_min < $this->range["min"]) {
      $mod_min += $tick_size;
    }

    return $mod_min;
  }

  private function __getY ($y) {
    return $this->adjusted_height - (($y - $this->range["min"]) / $this->range["range"]) * $this->adjusted_height + $this->padding["top"];
  }

  public function axis ($settings) {
    $tick_size = $this->__setTickSize();
    $mod_min = $this->__setModMin($tick_size);

    $texts = array();
    $lines = array();

    for ($x = $mod_min; $x <= $this->range["max"]; $x += $tick_size) {
      $curr_y = $this->__getY($x);

      if ($curr_y > $this->bounds["upper"] && $curr_y < $this->bounds["lower"]) {
        if ($settings["draw"]["axis"]["y"]) {
          $svg = new SVGRender();
          $text = $svg->text(
              number_format($x, $settings["axis"]["rounding"]),
              10,
              $curr_y,
              $settings["axis"]["font"]["family"],
              $settings["axis"]["font"]["weight"],
              $settings["axis"]["font"]["size"]
          );

          array_push($texts, $text);
        }

        if ($settings["draw"]["axis"]["lines"]) {
          $svg = new SVGRender();
          $svg->setHTML($x . "");
          $line = $svg->line(
              $settings["padding"]["left"],
              $settings["dimensions"]["width"] - $settings["padding"]["right"],
              $curr_y,
              $curr_y,
              $settings["axis"]["lineColor"],
              1
          );
          array_push($lines, $line);
        }
      }
    }

    return implode("", $texts) . implode("", $lines);
  }

  public function drawLines ($settings) {
    $zero = $settings["dimensions"]["height"];

    $paths = array();
    $circles = array();

    $index = 0;
    foreach ($this->relative as $arr) {
      $path_d = "";

      for ($x = 0; $x < count($arr); $x++) {
        if ($x == 0) {
          $path_d .= "M" . $arr[$x]["x"] . " " . $arr[$x]["y"] . " ";
        } else {
          $path_d .= "L" . $arr[$x]["x"] . " " . $arr[$x]["y"] . " ";
        }

        if ($settings["draw"]["circles"]) {
          $svg = new SVGRender();
          $circle = $svg->circle(
              $arr[$x]["x"],
              $arr[$x]["y"],
              $settings["circle"]["radius"],
              $this->__lineColor($index, $settings["draw"]["circles"]),
              $settings["circle"]["radius"],
              "transparent"
          );
          array_push($circles, $circle);
        }
      }

      $path = new SVGRender();
      $path = $path->path($path_d, $this->__lineColor($index, $settings["draw"]["lines"]), $settings["line"]["width"]);
      array_push($paths, $path);

      $index++;
    }

    return implode("", $paths) . implode("", $circles);
  }

  public function drawArea ($settings) {
    $paths = array();
    $zero = $settings["dimensions"]["height"];

    $index = 0;
    foreach ($this->relative as $arr) {
      $far_right = max($this->bounds["left"], $arr[0]["x"]);
      $zero = max(
                min($this->bounds["lower"], $this->__getY(0)),
                $this->bounds["upper"]
              );
      for ($x = 0; $x < count($arr); $x++) {
        if ($x == 0) {
          $path_d = "M" . $far_right . " " . $arr[$x]["y"] . " ";
          $path_d .= "L" . $arr[$x]["x"] . " " . $arr[$x]["y"] . " ";
        } else {
          $path_d .= "L" . $arr[$x]["x"] . " " . $arr[$x]["y"] . " ";
        }
      }

      $path_d .= "L" . $this->bounds["right"] . " " . $zero . " L" . $far_right . " " . $zero . " Z";

      $path = new SVGRender();
      $path = $path->path($path_d, "transparent", 0, $this->__lineColor($index, 0.2));
      array_push($paths, $path);

      $index++;
    }

    return implode("", $paths);
  }

  public function drawDataBox () {
    return "<div id='bcharts-data-box'></div>";
  }

  public function draw ($settings) {
    $html = $this->axis($settings);
    $html .= $this->drawArea($settings);
    $html .= $this->drawLines($settings);

    $svg = new SVGRender();
    $svg->setHTML($html);

    $output = $this->drawDataBox();
    $output .= $svg->svg($this->width, $this->height);

    return $output;
  }

  public function construct ($settings) {
    $svg = $this->draw($settings);

    $RANGE = $this->range["range"];
    $MIN = $this->range["min"];

    $page = new PageAssembler();
    $page->addJSFile("js/tools.js", NULL);
    $page->addJSFile("js/events.js", array(
      "RANGE" => $this->range["range"],
      "MIN" => $this->range["min"],
      "ADJ_HEIGHT" => $this->adjusted_height,
      "PADDING_TOP" => $this->padding["top"]
    ));
    $page->addCSSFile("css/main.css");

    return array(
      "html" => $svg,
      "scripts" => $page->getScripts(),
      "css" => $page->getCSS()
    );
  }
}

?>
