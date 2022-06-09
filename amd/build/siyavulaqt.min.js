define("qtype_siyavulaqt/siyavulaqt", ["exports"], function (a) {
  "use strict";
  Object.defineProperty(a, "__esModule", { value: !0 });
  a.init = void 0;
  a.init = function init(chktrue, chkfalse) {
    window.setInterval(function () {
      var height = $(".question-content")
        .contents()
        .find(".sv-region-main")
        .height();

      var qtvalue = $(".question-content").contents().find(".sv-form__actions");
      if (qtvalue.length) {
        $(".question-content").contents().find(".sv-form__actions").remove();
      }

      $(".question-content").height(height + 40);

      if (
        $(".question-content").contents().find(".feedback--incorrect").length >
        0
      ) {
        $("[id='" + chkfalse.id + "']").prop("checked", "checked");
      }
      if (
        $(".question-content").contents().find(".feedback--correct").length > 0
      ) {
        $("[id='" + chktrue.id + "']").prop("checked", "checked");
      }
      if (
        $(".question-content").contents().find(".feedback--partly-correct")
          .length > 0
      ) {
        $("[id='" + chktrue.id + "']").prop("checked", "checked");
      }
    }, 1000);
  };
});
