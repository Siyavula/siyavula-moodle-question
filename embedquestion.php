<?php
require_once('../../../config.php');
require_once($CFG->dirroot.'/filter/siyavula/lib.php');

$siyavula_activity_id = required_param('templateId', PARAM_RAW);
$param_all_id         = required_param('all_ids', PARAM_RAW);
$client_ip            = $_SERVER['REMOTE_ADDR'];
$siyavula_config      = get_config('filter_siyavula');
$token                = siyavula_get_user_token($siyavula_config, $client_ip);
$user_token           = siyavula_get_external_user_token($siyavula_config, $client_ip, $token);
$all_ids  = explode('|', $param_all_id);
$first_id = $siyavula_activity_id;


$show_id = optional_param('show_id', $first_id, PARAM_INT);// The actual show template id is optional, if not get, put the first id found i paral all_ids
$siyavula_activity_id = $show_id;

$flag = false;
$next_id = false;
foreach($all_ids as $id) {
  if($flag == true) { 
    $next_id = $id;
    break;
  }
  if($id == $siyavula_activity_id) {
    $flag = true;
  }
}

/**
 * The variable $siyavula_activity_id load all content of standalone.mustache without the html tags
 * Then, only load the text inside the <script>
 */

?>
<link rel="stylesheet" href="<?php echo $siyavula_config->url_base; ?>/static/themes/emas/siyavula-api/siyavula-api.min.css"/>
<link rel="stylesheet" href="<?php echo $siyavula_config->url_base; ?>/themes/emas/question-api/question-api.min.css"/>
<script>
    var baseUrl = '<?php echo $siyavula_config->url_base; ?>';
    var token = '<?php echo $token; ?>';
    var userToken = "<?php echo $user_token->token; ?>";
    var activityType = "standalone";
    var templateId = '<?php echo $siyavula_activity_id; ?>';
    var randomSeed = 3527;
</script>
<style type="text/css">
      .icon{
        font-family: 'FontAwesome';
      }
      .progress-bar.bar{
        margin: 0;
      }
      .monassis .icon{
        font-family: 'sv-ui-icon';
      }
      .icon{
        font-family: 'FontAwesome';
      }
</style>
<main class="sv-region-main emas sv">
  <div id="monassis" class="monassis monassis--practice monassis--maths monassis--siyavula-api">
    <div class="question-wrapper">
      <div class="question-content"></div>
    </div>
  </div>
</main>
<script src="<?php echo $siyavula_config->url_base; ?>/static/themes/emas/node_modules/mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML-full"></script>
<script src="<?php echo $siyavula_config->url_base; ?>/static/themes/emas/siyavula-api/siyavula-api.js"></script>
<a href='' id='a_next'><button>Next Question</button></a>
<script>
  function checkQuestion(){
    
    var id =  '<?php echo $siyavula_activity_id; ?>';
    var param = '<?php echo $param_all_id; ?>';
    var next =  '<?php echo $next_id; ?>';
    
    var btn = document.querySelector('#a_next')
    btn.href = `/question/type/siyavulaqt/embedquestion.php?templateId=${id}&all_ids=${param}&show_id=${next}`
    
    if(next == false){
      btn.innerHTML = '';
    }
  }
  checkQuestion()
  
  //Hide buttons controls
  function checkControls(){
            
      var qtvalue = document.getElementsByClassName('sv-form__actions')
      if(qtvalue.length){
          document.getElementsByClassName('sv-form__actions')[0].style.display = "none";
      }else{
          setTimeout( checkControls, 500 );
      }
  }
  checkControls();
</script>