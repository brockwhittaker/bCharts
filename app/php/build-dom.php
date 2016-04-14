<?php

require("compression.php");

class PageAssembler {
  private $js = array();
  private $css = array();

  public function addCSSFile ($path) {
    $contents = file_get_contents($path);
    array_push($this->css, minify_css($contents));
  }

  public function addJSFile ($path, $replacements) {
    $contents = file_get_contents($path);

    $contents = preg_replace_callback("/{{[^}]+}}/", function ($matches) use ($replacements) {
      $match = preg_replace("/{|}/", "", $matches[0]);
      return $replacements[$match];
    }, $contents);

    $sqeeze = new JSqueeze();
    $minified = $sqeeze->squeeze($contents, true, false);

    array_push($this->js, $minified);
  }

  public function getCSS () {
    return $this->css;
  }

  public function getScripts () {
    return $this->js;
  }
}

?>
