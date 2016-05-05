var $ = _;

var Info = {
  savedLocation: function () {
    var hash = window.location.hash.substring(1);
    if (hash) this.loadSection(hash, "#main_body");
    else this.loadSection("basic-usage", "#main_body");
  },

  getSection: function (section_name) {
    return (metadata[section_name]) ? metadata[section_name] : this.throwErrorPage();
  },

  loadSection: function (section_name, container) {
    var info = this.getSection(section_name);
    window.location.hash = section_name;

    $.get("content/" + info.html, function (response) {
      $(container).html(
        "<h1>" + info.title + "</h1>" +
        "<div class='main'>" + response + "</div>"
      );
      Util.highlightSection("#main_body");
    });
  },

  throwErrorPage: function () {
    console.log("Error!");
    return metadata.error;
  }
};

var Util = {
  highlightSection: function (container) {
    $(container + ' pre code').each(function () {
      hljs.highlightBlock(this);
    });
  }
};

(function () {
  Info.savedLocation();

  $(".info-ind").click(function () {
    var section = $(this).data("section");
    Info.loadSection(section, "#main_body");
  });
})();
