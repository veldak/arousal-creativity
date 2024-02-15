/* create timeline */
    var timeline = [];

    /* define instructions trial */
    var instruction_block = {
      type: "instructions",
      pages: [
      'In this task, you will be asked to enter as many creative, alternate uses for a common household object that you can come up with in sixty seconds.',
      'Press enter after each new idea to submit.',
      'There will be music playing in the background, which should be adjusted to a comfortable volume. Although the music will be playing, you do not need to focus on it as you will not be asked any particular questions about it.',
      'Music will begin playing for 15 seconds prior to the first-word prompt.'
       ],
    button_label_next: "Continue",
    button_label_previous: "Back",
    show_clickable_nav: true
    };
    timeline.push(instruction_block);