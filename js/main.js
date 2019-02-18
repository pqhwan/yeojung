var moDecCore = new MotionDetector.Core();
var narrativeCore = new Narrative.Core();

let audioContext;
let buffer;

function initialize() {
    audioContext = new AudioContext();
    document.getElementById("init").value = "Initializing...";
    // load audio
    fetch('1.0.mp3') 
        .then(response => response.arrayBuffer()) // get buffer 
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // decode data
        .then(audioBuffer => {  // store decoded buffer
            console.log('Decoded', audioBuffer);
            //play(audioBuffer, 1, 1.002);
            //play(audioBuffer, -1);
           
            // gotta rig up a switch that enables
            // and disables. when modec signals,
            // this needs to be faded in.
            // after it's faded in, 
            //play(audioBuffer);
            buffer = audioBuffer;

            document.getElementById("init").value = "Initialized.";
            document.getElementById("init").disabled = "disabled";
        }).catch(e => console.error(e));
}

function armMoDec(which) {

    moDecCore.armMoDec();
    console.log("MoDec armed."); 
    document.getElementById("modec-" + which + "-status").textContent = "RUNNING...";
    document.getElementById("modec-" + which + "-status").style.color = "green";
    document.getElementById("modec-" + which + "-status").className = "running";
}

function disarmMoDec(which) {
    moDecCore.disarmMoDec();
    console.log("MoDec disarmed."); 
    document.getElementById("modec-" + which + "-status").textContent = "NOT running";
    document.getElementById("modec-" + which + "-status").style.color = "red";
    document.getElementById("modec-" + which + "-status").className = "";
 
    document.getElementById('movement' + which).style.top = '0px'
    document.getElementById('movement' + which).style.left = '0px'
    document.getElementById('movement' + which).style.width = '0px'
    document.getElementById('movement' + which).style.height = '0px'
}

