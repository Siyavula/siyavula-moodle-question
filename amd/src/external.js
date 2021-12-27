define(['jquery','core/ajax'], function ($,Ajax) {
          return {
            init: function(baseurl,token,external_token,activityid,responseid,idsq,currenturl,next_id,$siyavula_activity_id) {
                
                $('#siyavulaQContainer').on("load", function() {
                    $('iframe#siyavulaQContainer').contents().find(".question-content").on('click',function(e){
                        const response = e.currentTarget.dataset.response
                        const targetid = e.currentTarget.id

                        if(e.target.className === 'sv-button sv-button--primary check-answer-button'){
                            e.preventDefault();
                            var formData = $("#siyavulaQContainer").contents().find(`div#${targetid} form[name="questions"]`).serialize()
                 
                            var submitresponse = Ajax.call(
                            [{ 
                                methodname: 'filter_siyavula_submit_answers_siyavula', 
                                args: { 
                                    baseurl: baseurl,
                                    token: token,
                                    external_token: external_token,
                                    activityid: targetid,
                                    responseid: response,
                                    data:  formData,
                                }
                            }]);
                            submitresponse[0].done(function (response) {
                                var dataresponse = JSON.parse(response.response);
                                var html = dataresponse.response.question_html
                                let timest = Math.floor(Date.now() / 1000);
                                html = html.replaceAll('sv-button toggle-solution', `sv-button toggle-solution btnsolution-${targetid}-${timest}`);
                                $("#siyavulaQContainer").contents().find(`#${targetid}.question-content`).html(html);    
                                $("#siyavulaQContainer").contents().find(`div#${targetid} .toggle-solution-checkbox`).css("visibility", "hidden");
                                
                                const theId = targetid;
                                const escapeID = CSS.escape(theId)
   
                                //const labelsSolution = $("#siyavulaQContainer").contents().find(`#${escapeID}.question-content .btnsolution-${escapeID}-${timest}`);
                                const labelsSolution = $("#siyavulaQContainer").contents().find(`#${escapeID}.question-content .response`)[0].childNodes;

                                labelsSolution.forEach(labelSolution => {
                                    if(labelSolution.nodeName === "LABEL"){
                                        labelSolution.innerHTML = '';
    
                                        var btntarget = labelSolution.getAttribute('for')
                                        const currentTargeId = btntarget.replace('toggle-', '');
         
                                        const newShowSpan = document.createElement('span')
                                        newShowSpan.append('Show the full solution');
                                        newShowSpan.id = 'show';
                                        
                                        const newHideSpan = document.createElement('span')
                                        newHideSpan.append('Hide the full solution');
                                        newHideSpan.id = 'hide';
                                        
                                        const response_solution = $("#siyavulaQContainer").contents().find(`#${escapeID}.question-content .response-solution`);
    
                                        var is_correct = true;
                                        const rsElement = response_solution[currentTargeId]
    
                                        if(rsElement.id == 'correct-solution') {
                                            is_correct = true;
                                        }
                                        else {
                                            is_correct = false;
                                        }
                                         
                                        if(is_correct == false){
                                            //$(`div#${targetid} span:contains('Show the full solution')`).css("display", "none");
                                            newShowSpan.style.display = 'none';
                                        }else{
                                            //$(`div#${targetid} span:contains('Hide the full solution')`).css("display", "none");
                                            newHideSpan.style.display = 'none';
                                        }
                                        labelSolution.append(newShowSpan);
                                        labelSolution.append(newHideSpan);
                                        
                                        $("#siyavulaQContainer").contents().find(`div#${targetid} #nav-buttons`).css("display","none")
                                        
                                        const spanShow = labelSolution.querySelector("span#show");
                                        const spanHide = labelSolution.querySelector("span#hide");
                                        const functionClickSolution = btnE => {
                                            const currentSpan = btnE.target;
                                            if(currentSpan.innerHTML.includes('Show')) {
                                                spanShow.style.display = 'none';
                                                spanHide.style.display = 'inherit';
                                            }
                                            else {
                                                spanShow.style.display = 'inherit';
                                                spanHide.style.display = 'none';
                                            }
                                            
                                            $("#siyavulaQContainer").contents().find(`div#${targetid} label[for="${btntarget}"]+.response-solution`).slideToggle();
                                            
                                        }
                                        spanShow.addEventListener('click', functionClickSolution);
                                        spanHide.addEventListener('click', functionClickSolution);
                                    }
                                })

                            }).fail(function (ex) {
                                console.log(ex);
                            });
                        }
                        
                    })
                });
            }
        };
    });
