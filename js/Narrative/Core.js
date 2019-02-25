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
        var droneGain;
        var pluckNode;
        var pluckGain;

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
            fadeout(droneNode, droneGain);
            fadeout(pluckNode, pluckGain);
            document.getElementById("1_trigger").disabled = false;
            document.getElementById("2_trigger").disabled = true;
            document.getElementById("3_trigger").disabled = true;
            document.getElementById("1_triggered").textContent=""
            document.getElementById("2_triggered").textContent=""
            document.getElementById("3_triggered").textContent=""
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
            let droneNodes = play(droneBuffer);
            let pluckNodes = play(pluckBuffer);

            droneNode = droneNodes[0];
            droneGain = droneNodes[1];
            pluckNode = pluckNodes[0];
            pluckGain = pluckNodes[1];
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

            fadeout(pluckNode, pluckGain);

            document.getElementById("3_trigger").disabled = false;
            document.getElementById("2_trigger").disabled = true;
            document.getElementById("2_triggered").textContent="✔"
        }

        function exit() {
            // fade out drone
            console.log("exit");
            fadeout(droneNode, droneGain);
            document.getElementById("3_trigger").disabled = true;
            document.getElementById("1_trigger").disabled = false;
            document.getElementById("3_triggered").textContent="✔"
        }

        function fadeout(node, gainNode, duration=0) {
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 10);
            //node.stop(audioContext.currentTime + 1);
        }

        function play(buffer, panItup=0, rate=1) {
            let source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.loop = true;
            source.playbackRate.value = rate;

            let gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            source.start(0, Math.random() * buffer.duration);
            gainNode.gain.exponentialRampToValueAtTime(1 , audioContext.currentTime + 10);
            return [source, gainNode];
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
