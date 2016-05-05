<?php
class NodeConstructor {
  private $HTML;
  private $properties = array();
  private $tag_name;
  private $node;

  public function setTagName ($tag_name) {
    $this->tag_name = $tag_name;
  }

  public function setProperty ($property_name, $property_value) {
    $this->properties[$property_name] = $property_value;
  }

  public function setHTML ($html) {
    $this->HTML = $html;
  }

  private function __constructProperties () {
    $keys = array_keys($this->properties);
    $vals = array_values($this->properties);

    $prop_string = "";
    for ($x = 0; $x < count($keys); $x++) {
      $prop_string .= $keys[$x] . "='" . $vals[$x] . "' ";
    }

    return $prop_string;
  }

  public function buildNode () {
    return "<" . $this->tag_name . " " . $this->__constructProperties() . ">" .
           $this->HTML . "</" . $this->tag_name . ">";
  }
}

class SVGRender Extends NodeConstructor {
  public function line ($x1, $x2, $y1, $y2, $stroke, $stroke_width) {
    $this->setTagName("line");

    $this->setProperty("x1", $x1);
    $this->setProperty("x2", $x2);
    $this->setProperty("y1", $y1);
    $this->setProperty("y2", $y2);
    $this->setProperty("stroke", $stroke);
    $this->setProperty("stroke-width", $stroke_width);

    return $this->buildNode();
  }

  public function path ($d, $stroke, $stroke_width, $fill = "transparent") {
    $this->setTagName("path");

    $this->setProperty("d", $d);
    $this->setProperty("stroke", $stroke);
    $this->setProperty("stroke-width", $stroke_width);
    $this->setProperty("fill", $fill);

    return $this->buildNode();
  }

  public function circle ($cx, $cy, $r, $fill, $stroke_width, $stroke) {
    $this->setTagName("circle");

    $this->setProperty("cx", $cx);
    $this->setProperty("cy", $cy);
    $this->setProperty("r", $r);
    $this->setProperty("fill", $fill);
    $this->setProperty("stroke-width", $stroke_width);
    $this->setProperty("stroke", $stroke);

    return $this->buildNode();
  }

  public function text($html, $x, $y, $font_family = false, $font_weight = false, $font_size = false) {
    $this->setTagName("text");

    $this->setHTML($html);

    $this->setProperty("x", $x);
    $this->setProperty("y", $y);

    if ($font_family) {
      $this->setProperty("font-family", $font_family);
      $this->setProperty("font-weight", $font_weight);
      $this->setProperty("font-size", $font_size);
      $this->setProperty("dominant-baseline", "middle");
    }

    return $this->buildNode();
  }

  public function svg ($width, $height) {
    $this->setTagName("svg");

    $this->setProperty("width", $width);
    $this->setProperty("height", $height);
    $this->setProperty("viewBox", "0 0 " . $width . " " . $height);

    $this->setProperty("version", 1.1);
    $this->setProperty("xmlns", "http://www.w3.org/2000/svg");

    return $this->buildNode();
  }
}
?>
