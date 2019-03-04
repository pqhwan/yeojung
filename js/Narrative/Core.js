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

        var mazeActivityLevelThreshold = 300;
        var gardenActivityLevelThreshold = 300;

        function markLoaded() {
            console.log((bufferCount - 1) + " buffers left to load...");
            if (--bufferCount == 0) {
                document.getElementById("init").value = "Initialized.";
                document.getElementById("init").disabled = true;
                enable("start", true);
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

        function kill() {
            console.log("narrative offline");

            if (!isEnabled('kill')) {
                return;
            }

            if (droneNode) {
                fadeout(droneNode, droneGain);
            } else {
                console.log("drone not playing.")
            }

            if (pluckNode) {
                fadeout(pluckNode, pluckGain);
            } else {
                console.log("pluck not playing.")
            }

            enable("start", true);
            enable("enter-maze",false);
            enable("enter-garden", false);
            enable("kill", false);
            markTriggered('kill');
        }

        function start() {
            console.log("narrative online");

            if (!isEnabled('start')) {
                return;
            }

            if (!droneBuffer) {
                console.log("illegal state - drone buffer not loaded");
                return;
            }
            let droneNodes = play(droneBuffer, 0.4);
            droneNode = droneNodes[0];
            droneGain = droneNodes[1];

            enable("kill", true);
            enable('enter-maze', true);
            enable('start', false);
            markTriggered('start');
        }

        function enterMaze(activity) {
            if (activity == 0 || activity < mazeActivityLevelThreshold) {
                return
            }

            if (!isEnabled('enter-maze')) {
                return;
            }

            console.log("maze entry triggered");

            if (!pluckBuffer) {
                console.log("illegal state - pluck buffer not loaded");
                return
            }

            let pluckNodes = play(pluckBuffer, 0.8);

            pluckNode = pluckNodes[0];
            pluckGain = pluckNodes[1];

            enable('enter-maze', false);
            enable('enter-garden', true);
            enable('start', false);
            markTriggered('enter-maze');
        }

        function enterGarden(activity) {
            if (activity == 0 || activity < gardenActivityLevelThreshold) {
                return
            }
            if (!isEnabled('enter-garden')) {
                return;
            }

            console.log("garden entry triggered");

            fadeout(pluckNode, pluckGain);

            enable('enter-garden', false);
            enable('enter-maze', true);
            markTriggered('enter-garden');
        }

        function enterMazes(activity) {
            if (activity == 0 || activity < 300) {
                return
            }

            if (document.getElementById("enter-maze-trigger").disabled) {
                console.log("maze entry trigger disabled.");
                return
            }
            document.getElementById("enter-maze-trigger").disabled = true;

            console.log("Maze entry detected.");
            if (!pluckBuffer) {
                console.log("Illegal state -- pluck buffer not loaded");
                return
            }
            let pluckNodes = play(pluckBuffer);

            pluckNode = pluckNodes[0];
            pluckGain = pluckNodes[1];
            document.getElementById("enter-garden-trigger").disabled = false;
        }

        function enterGardens(activity) {
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

        function play(buffer, gain=1) {
            let source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            let gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            source.start(0, Math.random() * buffer.duration);
            gainNode.gain.exponentialRampToValueAtTime(gain, audioContext.currentTime + 10);
            return [source, gainNode];
        }

        function enable(eventName, enabled) {
            document.getElementById(eventName + "-trigger").disabled = !enabled;
        }

        function isEnabled(eventName) {
            return !document.getElementById(eventName + "-trigger").disabled;
        }

        function setMazeActivityLevelThreshold(threshold) {
            mazeActivityLevelThreshold = threshold;
        }

        function setGardenActivityLevelThreshold(threshold) {
            gardenActivityLevelThreshold = threshold;
        }

        function markTriggered(eventName) {
            document.getElementById("kill-triggered").textContent=""
            document.getElementById("start-triggered").textContent=""
            document.getElementById("enter-maze-triggered").textContent=""
            document.getElementById("enter-garden-triggered").textContent=""
            document.getElementById(eventName + "-triggered").textContent="✔"
        }

		return {
            droneLoaded: droneLoaded,
            pluckLoaded: pluckLoaded,
		    kill: kill,
            start: start,
            enterMaze: enterMaze,
            enterGarden: enterGarden,
            setGardenActivityLevelThreshold, setGardenActivityLevelThreshold,
            setMazeActivityLevelThreshold, setMazeActivityLevelThreshold
		}
	};
})(Narrative);
