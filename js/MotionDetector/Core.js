;(function(App) {

	"use strict";
	
	/*
	 * The core motion detector. Does all the work.
	 *
	 * @return <Object> The initalized object.
	 */
	App.Core = function(which, deviceName, defaultSensitivity, eventFunc) {

        var moDecArmed = false;

		var width = 64;
		var height = 48;

		var webCam = null;
		var imageCompare = null;

		var currentImage = null;
		var oldImage = null;

		var topLeft = [Infinity,Infinity];
		var bottomRight = [0,0];

        var flushTimer;

		var raf = (function(){
			return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
			function( callback ){ // not called in chrome
				window.setTimeout(callback, 1000/60);
			};
		})();

		/*
		 * Initializes the object.
		 * @return void.
		 */
		function initialize(which) {
			imageCompare = new App.ImageCompare(defaultSensitivity, which, eventFunc);
			webCam = new App.WebCamCapture(document.getElementById('webCam' + which), deviceName);

			main();
		}

		/*
		 * Compares to images and updates the position
		 * of the motion div.
		 *
		 * @return void.
		 */
		function render(which) {
			oldImage = currentImage;
			currentImage = webCam.captureImage(false);

			if (!oldImage || !currentImage) {
				return;
			}

			var vals = imageCompare.compare(currentImage, oldImage, width, height);
            drawMovement(which, vals);
		}

        function drawMovement(which, vals) {
			topLeft[0] = vals.topLeft[0] * 10;
			topLeft[1] = vals.topLeft[1] * 10;

			bottomRight[0] = vals.bottomRight[0] * 10;
			bottomRight[1] = vals.bottomRight[1] * 10;

			document.getElementById('movement' + which).style.top = topLeft[1] + 'px';
			document.getElementById('movement' + which).style.left = topLeft[0] + 'px';
			document.getElementById('movement' + which).style.width = (bottomRight[0] - topLeft[0]) + 'px';
			document.getElementById('movement' + which).style.height = (bottomRight[1] - topLeft[1]) + 'px';

			topLeft = [Infinity,Infinity];
			bottomRight = [0,0]
        }

		/*
		 * The main rendering loop.
		 *
		 * @return void.
		 *
		 */
		function main() {
			try {
                if (moDecArmed) {
                    render(which);
                }
			} catch(e) {
				console.log(e);
				return;
			}

            // asks browser to call this function on  
            // new animation frame. 
            raf(main.bind(this));
		}

        function armMoDec() {
            flushTimer = setInterval(imageCompare.triggerFlush, 2500);
            moDecArmed = true;
        }

        function disarmMoDec() {
            if (flushTimer)  {
                clearInterval(flushTimer); 
            }
            document.getElementById("modec-" + which + "-activity").textContent = "NOT measuring";
            moDecArmed = false;
        }

        function setSensitivity(val) {
            imageCompare.setSensitivity(val); 
        }
		initialize(which);
		return {
			armMoDec: armMoDec,
			disarmMoDec: disarmMoDec,
            setSensitivity: setSensitivity
		}
	};
})(MotionDetector);
