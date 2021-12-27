<?php
require_once('../../../config.php');
require_once($CFG->dirroot.'/filter/siyavula/lib.php');
require_once($CFG->dirroot.'/question/type/siyavulaqt/lib.php');

  global $OUTPUT, $USER, $PAGE, $CFG, $DB;
 
  $siyavula_activity_id = required_param('questionid', PARAM_RAW);
  $random_seed          = required_param('random_seed', PARAM_RAW);
  
  $client_ip       = $_SERVER['REMOTE_ADDR'];
  $siyavula_config = get_config('filter_siyavula');

  $token       = siyavula_get_user_token($siyavula_config, $client_ip);
 
  $user_token  = siyavula_get_external_user_token($siyavula_config, $client_ip, $token);
  
  $questionapi = get_activity_standalone($siyavula_activity_id,$token, $user_token->token,$siyavula_config->url_base,$random_seed);

  $activityid  = $questionapi->activity->id;
  $responseid  = $questionapi->response->id;
        
  $htmlquestion = get_html_question_standalone($questionapi->response->question_html,$activityid,$responseid);

  echo $htmlquestion;

?>
