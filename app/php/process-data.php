<?php

class ProcessData {
  protected $range = array(
    "min" => INF,
    "max" => -INF
  );
  protected $data = array();
  protected $relative = array();

  public function addData ($data) {
    array_push($this->data, $data);
  }

  protected function __getRange () {
    foreach ($this->data as $x) {
      $temp_min = min($x);
      $temp_max = max($x);

      if ($this->range["min"] > $temp_min) {
        $this->range["min"] = $temp_min;
      }

      if ($this->range["max"] < $temp_max) {
        $this->range["max"] = $temp_max;
      }
    }

    $this->range["range"] = $this->range["max"] - $this->range["min"];

    // this gets the length of the longest array per PHP spec.
    $this->range["longest"] = count(max($this->data));

    return $this->range;
  }

  public function range () {
    return $this->range;
  }

  public function relativeArrays ($ratio, $stick_to_front) {
    $this->__getRange();

    $longest = $this->range["longest"] - 1;

    for ($x = 0; $x < count($this->data); $x++) {
      $this->data[$x] = $this->data[$x];

      array_push($this->relative, array());

      $offset = ($stick_to_front) ? (($longest + 1) - count($this->data[$x])) / $longest : 0;

      for ($y = 0; $y < count($this->data[$x]); $y++) {
        $this->relative[$x][$y] = array(
          "x" => $this->padding["left"] + $this->adjusted_width * ($y / $longest + $offset),
          "y" => $this->adjusted_height - $this->adjusted_height * ($this->data[$x][$y] - $this->range["min"]) / $this->range["range"] + $this->padding["top"]
        );
      }
    }

    return $this->relative;
  }
}
?>
