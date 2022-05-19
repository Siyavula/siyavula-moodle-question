define(["jquery", "core/ajax"], function ($, Ajax) {
  return {
    init: function (
      baseUrl,
      token,
      externalToken,
      activityId,
      responseId,
      idSq,
      currentUrl,
      nextId,
      siyavulaActivityId
    ) {
      $(document).ready(function () {
        // Expose showHideSolution to global window object
        window.show_hide_solution = showHideSolution;

        // Initialise MathJax typesetting
        var nodes = Y.all(".latex-math");
        Y.fire(M.core.event.FILTER_CONTENT_UPDATED, { nodes: nodes });

        $(".question-content").on("click", function (e) {
          const responseId = e.currentTarget.dataset.response;
          const activityId = e.currentTarget.id;

          if (
            e.target.className ===
            "sv-button sv-button--primary check-answer-button"
          ) {
            e.preventDefault();

            // Get all Siyavula inputs that have not been marked "readonly"
            var formData = $(".response-query-input")
              .not('[name*="|readonly"]')
              .serialize();

            var submitresponse = Ajax.call([
              {
                methodname: "filter_siyavula_submit_answers_siyavula",
                args: {
                  baseurl: baseUrl,
                  token: token,
                  external_token: externalToken,
                  activityid: activityId,
                  responseid: responseId,
                  data: formData,
                },
              },
            ]);

            submitresponse[0]
              .done(function (response) {
                var responseData = JSON.parse(response.response);
                var html = responseData.response.question_html;
                // Replace question HTML with marked HTML returned from the API
                $(".question-content").html(html);

                // Hide nav buttons (Try exercise again/Go to next exercise)
                $("#nav-buttons").css("display", "none");

                // Typeset new HTML content
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
              })
              .fail(function (ex) {
                console.log(ex);
              });
          }
        });
      });

      function showHideSolution(button) {
        const $button = jQuery(button);

        // Toggle solution visibility
        $button.parent().next().slideToggle("slow");

        // Toggle button text
        const previousValue = $button.attr("value");
        const nextValue = $button.attr("data-alt-value");
        $button.attr("value", nextValue).attr("data-alt-value", previousValue);
      }
    },
  };
});
