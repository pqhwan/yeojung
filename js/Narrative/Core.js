;(function(App) {

	"use strict";
	
	/*
	 * The core motion detector. Does all the work.
	 *
	 * @return <Object> The initalized object.
	 */
	App.Core = function() {
        var droneBuffer;
        var pluckBuffer;
        let bufferCount = 2;

        var droneNode;
        var pluckNode;

        function markLoaded() {
            console.log((bufferCount - 1) + " buffers left to load...");
            if (--bufferCount == 0) {
                document.getElementById("init").value = "Initialized.";
                document.getElementById("init").disabled = true;
                document.getElementById("1_trigger").disabled = false;
            }
        }

        function droneLoaded(buffer) {
            droneBuffer = buffer;
            markLoaded(); 
        }

        function pluckLoaded(buffer) {
            pluckBuffer = buffer;
            markLoaded(); 
        }

        function reset() {
            console.log("reset");
            // fade both out quickly
            fadeout(droneNode);
            fadeout(pluckNode);
            document.getElementById("1_trigger").disabled = false;
            document.getElementById("2_trigger").disabled = true;
            document.getElementById("3_trigger").disabled = true;
            document.getElementById("1_triggered").textContent=""
            document.getElementById("2_triggered").textContent=""
            document.getElementById("3_triggered").textContent=""
            document.getElementById("4_triggered").textContent="✔"
        }

        function enterMaze(activity) {
            if (activity == 0 || activity < 300) {
                return
            }

            if (document.getElementById("1_trigger").disabled) {
                console.log("Event disabled.");
                return
            }

            // start both 
            console.log("Maze entry detected.");
            if (!droneBuffer || !pluckBuffer) {
                console.log("Illegal state -- Buffers must be loaded first!");
                return
            }
            droneNode = play(droneBuffer);
            pluckNode = play(pluckBuffer);
            document.getElementById("1_trigger").disabled = true;
            document.getElementById("2_trigger").disabled = false;
            document.getElementById("1_triggered").textContent="✔"
        }

        function enterGarden(activity) {
            if (activity == 0 || activity < 300) {
                return
            }
            if (document.getElementById("2_trigger").disabled) {
                console.log("Event disabled.");
                return
            }

            // kill pluck, violently?
            console.log("Garden entry detected.");

            fadeout(pluckNode);

            document.getElementById("3_trigger").disabled = false;
            document.getElementById("2_trigger").disabled = true;
            document.getElementById("2_triggered").textContent="✔"
        }

        function exit() {
            // fade out drone
            console.log("exit");
            fadeout(droneNode);
            document.getElementById("3_trigger").disabled = true;
            document.getElementById("1_trigger").disabled = false;
            document.getElementById("3_triggered").textContent="✔"
        }

        function fadeout(node, duration=0) {
            node.stop(audioContext.currentTime + 1);
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
            return source;
        }

		return {
            droneLoaded: droneLoaded,
            pluckLoaded: pluckLoaded,
		    reset : reset,
            enterMaze: enterMaze,
            enterGarden: enterGarden,
            exit: exit
		}
	};
})(Narrative);
