export const init = (chktrue, chkfalse) => {
  var timer = window.setInterval(() => {
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
      $(".question-content").contents().find(".feedback--incorrect").length > 0
    ) {
      $('[for="' + chkfalse.id + '"]').click();
    }
    if (
      $(".question-content").contents().find(".feedback--correct").length > 0
    ) {
      $('[for="' + chktrue.id + '"]').click();
    }
  }, 1000);
};
