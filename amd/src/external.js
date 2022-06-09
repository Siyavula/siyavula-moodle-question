// define(["jquery", "core/ajax"], function ($, Ajax) {
//   return {
//     init: function (
//       baseUrl,
//       token,
//       externalToken,
//       activityId,
//       responseId,
//       idSq,
//       currentUrl,
//       nextId,
//       siyavulaActivityId
//     ) {
//       $(document).ready(function () {
//         // Expose showHideSolution to global window object
//         window.show_hide_solution = showHideSolution;

//         // Initialise MathJax typesetting
//         var nodes = Y.all(".latex-math");
//         Y.fire(M.core.event.FILTER_CONTENT_UPDATED, { nodes: nodes });

//         $(document).on("click", ".check-answer-button", function (e) {
//           e.preventDefault();
//           submitResponse();
//         });
//       });

//       function submitResponse() {
//         // Get all Siyavula inputs that have not been marked "readonly"
//         var formData = $(".response-query input, .response-query select")
//           .not('[name*="|readonly"]')
//           .serialize();

//         var promises = Ajax.call([
//           {
//             methodname: "filter_siyavula_submit_answers_siyavula",
//             args: {
//               baseurl: baseUrl,
//               token: token,
//               external_token: externalToken,
//               activityid: activityId,
//               responseid: responseId,
//               data: formData,
//             },
//           },
//         ]);

//         promises[0]
//           .done(function (response) {
//             var responseData = JSON.parse(response.response);
//             updateHtml(responseData.response.question_html);
//           })
//           .fail(function (e) {
//             console.log(e);
//           });
//       }

//       function updateHtml(html) {
//         // Replace question HTML with marked HTML returned from the API
//         $(".question-content").html(html);

//         // Hide nav buttons (Try exercise again/Go to next exercise)
//         $("#nav-buttons").css("display", "none");

//         // Typeset new HTML content
//         MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
//       }

//       function showHideSolution(button) {
//         const $button = jQuery(button);

//         // Toggle solution visibility
//         $button.parent().next().slideToggle("slow");

//         // Toggle button text
//         const previousValue = $button.attr("value");
//         const nextValue = $button.attr("data-alt-value");
//         $button.attr("value", nextValue).attr("data-alt-value", previousValue);
//       }
//     },
//   };
// });
