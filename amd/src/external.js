define(["jquery", "core/ajax"], function ($, Ajax) {
  return {
    init: function (
      baseurl,
      token,
      external_token,
      activityid,
      responseid,
      idsq,
      currenturl,
      next_id,
      $siyavula_activity_id
    ) {
      $("#siyavulaQContainer").on("load", function () {
        $("iframe#siyavulaQContainer")
          .contents()
          .find(".question-content")
          .on("click", function (e) {
            const response = e.currentTarget.dataset.response;
            const targetid = e.currentTarget.id;

            if (
              e.target.className ===
              "sv-button sv-button--primary check-answer-button"
            ) {
              e.preventDefault();
              var formData = $("#siyavulaQContainer")
                .contents()
                .find(`div#${targetid} form[name="questions"]`)
                .serialize();

              var submitresponse = Ajax.call([
                {
                  methodname: "filter_siyavula_submit_answers_siyavula",
                  args: {
                    baseurl: baseurl,
                    token: token,
                    external_token: external_token,
                    activityid: targetid,
                    responseid: response,
                    data: formData,
                  },
                },
              ]);
              submitresponse[0]
                .done(function (response) {
                  const iframeContent = document.querySelector(
                    "#siyavulaQContainer"
                  );
                  if (iframeContent) {
                    console.log(iframeContent.contentWindow.MathJax);
                    delete iframeContent.contentWindow.MathJax;
                  }
                  var dataresponse = JSON.parse(response.response);
                  var html = dataresponse.response.question_html;

                  function insertScript(doc, target, src, callback) {
                    var s = doc.createElement("script");
                    s.type = "text/javascript";
                    if (callback) {
                      if (s.readyState) {
                        //IE
                        s.onreadystatechange = function () {
                          if (
                            s.readyState == "loaded" ||
                            s.readyState == "complete"
                          ) {
                            s.onreadystatechange = null;
                            callback();
                          }
                        };
                      } else {
                        //Others
                        s.onload = function () {
                          callback();
                        };
                      }
                    }
                    s.src = src;
                    target.appendChild(s);
                  }
                  var elFrame = document.getElementById("siyavulaQContainer");
                  var context = elFrame.contentDocument;
                  var frameHead = context.getElementsByTagName("head").item(0);
                  insertScript(
                    context,
                    frameHead,
                    "https://www.siyavula.com/static/themes/emas/node_modules/mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML-full"
                  ); // This is necessary for load script into iframe

                  let timest = Math.floor(Date.now() / 1000);
                  html = html.replaceAll(
                    "sv-button toggle-solution",
                    `sv-button toggle-solution btnsolution-${targetid}-${timest}`
                  );
                  $("#siyavulaQContainer")
                    .contents()
                    .find(`#${targetid}.question-content`)
                    .html(html);
                  $("#siyavulaQContainer")
                    .contents()
                    .find(`div#${targetid} .toggle-solution-checkbox`)
                    .css("visibility", "hidden");

                  const theId = targetid;
                  const escapeID = CSS.escape(theId);

                  //const labelsSolution = $("#siyavulaQContainer").contents().find(`#${escapeID}.question-content .btnsolution-${escapeID}-${timest}`);
                  const labelSolution = $("#siyavulaQContainer")
                    .contents()
                    .find(
                      `#${escapeID}.question-content #show-hide-solution`
                    )[0];
                  const key = 0; // Because in quiz is only one response solution
                  console.log(labelSolution);
                  //labelsSolution.forEach((labelSolution, key) => {
                  labelSolution.innerHTML = "";

                  const newShowSpan = document.createElement("input");
                  newShowSpan.classList.add("sv-button");
                  newShowSpan.value = "Show the full solution";
                  newShowSpan.type = "button";
                  newShowSpan.id = `show${key}`;

                  const newHideSpan = document.createElement("input");
                  newHideSpan.value = "Hide the full solution";
                  newHideSpan.classList.add("sv-button");
                  newHideSpan.type = "button";
                  newHideSpan.id = `hide${key}`;

                  var is_correct = true;
                  const rsElement = labelSolution.nextSibling; // Response information
                  console.log(rsElement, labelSolution);
                  const identificador = `${rsElement.id}-${key}`;
                  rsElement.classList.add(identificador);
                  console.log(rsElement);
                  if (rsElement.id == "correct-solution") {
                    is_correct = true;
                  } else {
                    is_correct = false;
                  }

                  if (is_correct == false) {
                    //$(`div#${targetid} span:contains('Show the full solution')`).css("display", "none");
                    newShowSpan.style.display = "none";
                  } else {
                    //$(`div#${targetid} span:contains('Hide the full solution')`).css("display", "none");
                    newHideSpan.style.display = "none";
                  }
                  labelSolution.append(newShowSpan);
                  labelSolution.append(newHideSpan);

                  $("#siyavulaQContainer")
                    .contents()
                    .find(`div#${targetid} #nav-buttons`)
                    .css("display", "none");

                  const spanShow = labelSolution.querySelector(`#show${key}`);
                  const spanHide = labelSolution.querySelector(`#hide${key}`);
                  const functionClickSolution = (btnE) => {
                    const currentSpan = btnE.target;
                    if (currentSpan.value.includes("Show")) {
                      spanShow.style.display = "none";
                      spanHide.style.display = "initial";
                    } else {
                      spanShow.style.display = "initial";
                      spanHide.style.display = "none";
                    }

                    $("#siyavulaQContainer")
                      .contents()
                      .find(`.${identificador}`)
                      .slideToggle();
                  };
                  spanShow.addEventListener("click", functionClickSolution);
                  spanHide.addEventListener("click", functionClickSolution);

                  //})

                  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                })
                .fail(function (ex) {
                  console.log(ex);
                });
            }
          });
      });
    },
  };
});
