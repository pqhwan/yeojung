;(function(App) {

	"use strict";
	
	/*
	 * The core motion detector. Does all the work.
	 *
	 * @return <Object> The initalized object.
	 */
	App.Core = function() {
        function reset() {
            // fade both out quickly
            console.log("reset");
        }

        function enterMaze() {
            // start both 
            console.log("entered maze");
            if (buffer) {
                play(buffer);
            }
        }

        function enterGarden() {
            // kill pluck, violently?
        }

        function exit() {
            // fade out drone
            // shouldn't
        }

        function play(buffer, panItup=0, rate=1) {
            let source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.loop = false;
            //source.loopStart = 2;
            //source.loopEnd = 3;
            source.playbackRate.value = rate;

            let pannerNode = audioContext.createStereoPanner();
            pannerNode.pan.value = panItup;
            source.connect(pannerNode);
            pannerNode.connect(audioContext.destination); 
            source.start(0, 0);
        }

		return {
		    reset : reset,
            enterMaze: enterMaze
		}
	};
})(Narrative);
