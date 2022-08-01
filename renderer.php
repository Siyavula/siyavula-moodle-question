<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * True-false question renderer class.
 *
 * @package    qtype
 * @subpackage siyavulaqt
 * @copyright  2009 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/filter/siyavula/lib.php');
use filter_siyavula\renderables\get_activity_renderable;
use filter_siyavula\renderables\standalone_activity_renderable;

/**
 * Generates the output for true-false questions.
 *
 * @copyright  2009 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_siyavulaqt_renderer extends qtype_renderer {
    public function formulation_and_controls(question_attempt $qa,
            question_display_options $options) {
        global $PAGE;
        global $DB;

        $nextqt = optional_param('nextqr', '', PARAM_INT);
        $question = $qa->get_question();
        $response = $qa->get_last_qt_var('answer', '');
        $inputname = $qa->get_qt_field_name('answer');
        $trueattributes = array(
            'type' => 'radio',
            'name' => $inputname,
            'value' => 1,
            'id' => $inputname . 'true',
        );
        $falseattributes = array(
            'type' => 'radio',
            'name' => $inputname,
            'value' => 0,
            'id' => $inputname . 'false',
        );
        if ($options->readonly) {
            $trueattributes['disabled'] = 'disabled';
            $falseattributes['disabled'] = 'disabled';
        }

        // Work out which radio button to select (if any).
        $truechecked = false;
        $falsechecked = false;
        $responsearray = array();
        if ($response) {
            $truechecked = true;
            $responsearray = array('answer' => 1);
        } else if ($response !== '') {
            $falsechecked = true;
            $responsearray = array('answer' => 1);
        }

        // Work out visual feedback for answer correctness.
        $trueclass = '';
        $falseclass = '';
        $truefeedbackimg = '';
        $falsefeedbackimg = '';
        if ($options->correctness) {
            if ($truechecked) {
                $trueclass = ' ' . $this->feedback_class((int) $question->rightanswer);
                $truefeedbackimg = $this->feedback_image((int) $question->rightanswer);
            } else if ($falsechecked) {
                $falseclass = ' ' . $this->feedback_class((int) (!$question->rightanswer));
                $falsefeedbackimg = $this->feedback_image((int) (!$question->rightanswer));
            }
        }

        $radiotrue = html_writer::empty_tag('input', $trueattributes) .
                html_writer::tag('label', get_string('true', 'qtype_siyavulaqt'),
                array('for' => $trueattributes['id'], 'class' => 'ml-1'));
        $radiofalse = html_writer::empty_tag('input', $falseattributes) .
                html_writer::tag('label', get_string('false', 'qtype_siyavulaqt'),
                array('for' => $falseattributes['id'], 'class' => 'ml-1'));

        // Determine if we're on the feedback page.
        $url = $_SERVER["REQUEST_URI"];
        $findme  = '/mod/quiz/review.php';
        $pos = strpos($url, $findme);

        if ($pos === false) {
            $isfeedback = false;
        } else {
            $isfeedback = true;
        }

        $result = '';

        // Get the standalone.mustache.
        $standalonepage = $question->format_questiontext($qa);

        // Strip all tags of the mustache, only left the text inside <script>.
        $standalonestrip = strip_tags($standalonepage);

        $standalonestrip = str_replace("sy-", ' ', $standalonestrip);

        // If we detect a "," then we will use [0] for the question ID, and [1] for the seed.
        $standalonestrip = explode('|', $standalonestrip);

        if (isset($standalonestrip[1])) {
            $seed = (int) $standalonestrip[1];
            $standalonestrip = $standalonestrip[0];
        } else {
            $standalonestrip = $standalonestrip[0];
        }

        $randomseed = (isset($seed) ? $seed : rand(1, 99999));

        $clientip = $_SERVER['REMOTE_ADDR'];
        $siyavulaconfig = get_config('filter_siyavula');
        $baseurl = $siyavulaconfig->url_base;
        $token = siyavula_get_user_token($siyavulaconfig, $clientip);
        $usertoken = siyavula_get_external_user_token($siyavulaconfig, $clientip, $token);
        $activitytype = 'standalone';
        $templateid = $standalonestrip;

        $PAGE->requires->js_call_amd('filter_siyavula/initmathjax', 'init');
        $PAGE->requires->js_call_amd('qtype_siyavulaqt/siyavulaqt', 'init', ['chktrue' =>
            $trueattributes, 'chkfalse' => $falseattributes, 'questionId' => $question->id]);

        $renderer = $PAGE->get_renderer('filter_siyavula');
        if (!$isfeedback) {
            $activityrenderable = new standalone_activity_renderable();
            $activityrenderable->baseurl = $baseurl;
            $activityrenderable->token = $token;
            $activityrenderable->usertoken = $usertoken->token;
            $activityrenderable->activitytype = $activitytype;
            $activityrenderable->templateid = $templateid;
            $activityrenderable->randomseed = $randomseed;
            $result .= $renderer->render_standalone_activity($activityrenderable);
        } else {
            $activityid = $DB->get_field(
                'question_siyavulaqt', 'activityid', array('question' => $question->id)
            );
            $responseid = $DB->get_field(
                'question_siyavulaqt', 'responseid', array('question' => $question->id)
            );

            $result = get_activity_response($token, $usertoken, $baseurl, $activityid, $responseid);
            return $result->response->question_html;
        }

        $result .= html_writer::start_tag('div', array('class' => 'ablock', 'style' => 'display: none;'));
        $result .= html_writer::tag('div', get_string('selectone', 'qtype_siyavulaqt'),
                array('class' => 'prompt'));

        $result .= html_writer::start_tag('div', array('class' => 'answer'));
        $result .= html_writer::tag('div', $radiotrue . ' ' . $truefeedbackimg,
                array('class' => 'r0' . $trueclass));
        $result .= html_writer::tag('div', $radiofalse . ' ' . $falsefeedbackimg,
                array('class' => 'r1' . $falseclass));
        $result .= html_writer::end_tag('div'); // Answer.

        $result .= html_writer::end_tag('div'); // Ablock.

        if ($qa->get_state() == question_state::$invalid) {
            $result .= html_writer::nonempty_tag('div',
                    $question->get_validation_error($responsearray),
                    array('class' => 'validationerror'));
        }
        return $result;
    }

    public function specific_feedback(question_attempt $qa) {

        $question = $qa->get_question();
        $response = $qa->get_last_qt_var('answer', '');

        if ($response) {
            return $question->format_text($question->truefeedback, $question->truefeedbackformat,
                    $qa, 'question', 'answerfeedback', $question->trueanswerid);
        } else if ($response !== '') {
            return $question->format_text($question->falsefeedback, $question->falsefeedbackformat,
                    $qa, 'question', 'answerfeedback', $question->falseanswerid);
        }
    }

    // LC: Feedback has been removed, if required again, uncomment this.
    // public function correct_response(question_attempt $qa) {
    // $question = $qa->get_question();

    // if ($question->rightanswer) {
    // return get_string('correctanswertrue', 'qtype_siyavulaqt');
    // } else {
    // return get_string('correctanswerfalse', 'qtype_siyavulaqt');
    // }
    // }
}
