define(["jquery", "core/ajax"], function ($, Ajax) {
  return {
    init: function (chktrue, chkfalse) {
      window.setInterval(function () {
        const $incorrect = $(".feedback--incorrect").length;
        const $correct = $(".feedback--correct").length;
        const $partiallyCorrect = $(".feedback--partly-correct").length;

        if ($incorrect) {
          $("[id='" + chkfalse.id + "']").prop("checked", "checked");
        } else if ($correct || $partiallyCorrect) {
          $("[id='" + chktrue.id + "']").prop("checked", "checked");
        }
      }, 1000);
    },
  };
});
