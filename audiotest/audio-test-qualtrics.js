Qualtrics.SurveyEngine.addOnload(function () {

    /*Place your JavaScript here to run when the page loads*/

    /* PLEASE CHECK:
        TO RUN THIS SCRIPT PROPERLY, THE EMBEDDED VARIABLES 
            *** audio_test_rt, audio_test_order ***
        MUST BE DEFINED.
    /*

    /* Change 1: Hiding the Next button */
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons
    qthis.hideNextButton();

    /* Change 2: Defining and load required resources */
    // task-related variables
    var audio_test_rt = [];
    var audio_test_order = [];

    // requiredResources must include all the required JS files
    var task_github = "https://kywch.github.io/Mood-Induction_jsPsych/"; // https://<your-github-username>.github.io/<your-experiment-name>
    var requiredResources = [
        task_github + "jspsych-6.1.0/jspsych.js",
        task_github + "jspsych-6.1.0/plugins/jspsych-fullscreen.js",
        task_github + "jspsych-audio-keyboard-with-replay.js"
    ];

    function loadScript(idx) {
        console.log("Loading ", requiredResources[idx]);
        jQuery.getScript(requiredResources[idx], function () {
            if ((idx + 1) < requiredResources.length) {
                loadScript(idx + 1);
            } else {
                initExp();
            }
        });
    }

    if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
        loadScript(0);
    }

    /* Change 3: Appending the display_stage Div using jQuery */
    // jQuery is loaded in Qualtrics by default
    jQuery("<div id = 'display_stage_background'></div>").appendTo('body');
    jQuery("<div id = 'display_stage'></div>").appendTo('body');

    /* Change 4: Adding resouces, scripts, and helper functions */
    var audio_url = 'https://kywch.github.io/Mood-Induction_jsPsych/audiotest/';
    var audio_seed = ['c', 'd', 'g', 'k', 'p', 'q', 't'];

    // WARNING: YOU SHOULD MAKE SURE THE OUTPUT URLS ARE CORRECT
    function get_audio_url(audio_url, file_name, file_ext = 'mp3') {
        return audio_url + file_name + '.' + file_ext;
    }

    // generate audiotest trials
    function generate_audiotest_block(audio_url, audio_seed) {

        audio_test_order = jsPsych.randomization.shuffle(audio_seed);
        let block_audiotest = [];
        let enter_audiotest_page = {
            type: 'audio-keyboard-with-replay',
            prompt: "<div id=centerbox><p>" +
                "The task you are about to do requires listening to sounds. Please adjust your sound setting.<br> " +
                "<p>We will do a simple task to make sure you can hear the sounds. </p>" +
                "<p>In the next pages, press the alphabet key associated with the played sound to proceed. </p> " +
                "<br><p>If you are ready, press the <strong>'n'</strong> key to proceed.</p>" +
                "<p>If the key doesn't work, please click the screen and press again.</p></div>",
            choices: ['n'],
        };
        block_audiotest.push(enter_audiotest_page);

        for (let ii = 0; ii < audio_test_order.length; ii++) {
            let audiotest_trial = {
                type: 'audio-keyboard-with-replay',
                stimulus: get_audio_url(audio_url, audio_test_order[ii]),
                prompt: "<div id=centerbox><p>" +
                    "Trial " + (ii + 1) + " / " + audio_test_order.length + " : " +
                    "Please press the alphabet key you just heard.</p>" +
                    "<br><p>To replay, press the <strong>'r'</strong> key. </p></div>",
                choices: [audio_test_order[ii]],
                on_finish: function (data) {
                    audio_test_rt.push(data.rt)
                }
            }
            block_audiotest.push(audiotest_trial);
        }
        return {
            timeline: block_audiotest
        };
    }


    /* Change 5: Wrapping jsPsych.init() in a function */
    function initExp() {

        // push all the procedures, which are defined in stop-it_main.js to the overall timeline
        var timeline = []; // this array stores the events we want to run in the experiment

        // use the full screen
        // also playing sound only works after an interaction with user, like button press
        timeline.push({
            type: 'fullscreen',
            message: '<p>Audio test will start to play when you press the button below.</p><br>',
            fullscreen_mode: true
        });

        timeline.push(generate_audiotest_block(audio_url, audio_seed));

        timeline.push({
            type: 'fullscreen',
            fullscreen_mode: false
        });
    
        jsPsych.init({
            display_element: 'display_stage',
            timeline: timeline,

            on_finish: function () {

                /* Change 6: Adding the clean up and continue functions.*/

                // save the induction-related data to Qualtrics
                Qualtrics.SurveyEngine.setEmbeddedData("audio_test_rt", audio_test_rt.toString().replace(/,/g, ';'));
                Qualtrics.SurveyEngine.setEmbeddedData("audio_test_order", audio_test_order.toString().replace(/,/g, ';'));
            
                // clear the stage
                jQuery('#display_stage').remove();
                jQuery('#display_stage_background').remove();

                // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
                qthis.clickNextButton();
            }
        });
    }
});

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/

});
