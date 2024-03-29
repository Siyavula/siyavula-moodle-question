define(["jquery", "core/ajax"], function ($, Ajax) {
  return {
    init: function (chktrue, chkfalse, questionId) {
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

      $("form").on("submit", function (e) {
        const { activityId, responseId } = window.state;

        var submitresponse = Ajax.call([
          {
            methodname: "filter_siyavula_save_activity_data",
            args: {
              questionid: questionId,
              activityid: activityId,
              responseid: responseId,
            },
          },
        ]);

        submitresponse[0]
          .done(function (response) {
            console.log(response);
          })
          .fail(function (ex) {
            console.log(ex);
          });
      });
    },
  };
});
