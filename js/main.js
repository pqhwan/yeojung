var modecA;
var modecB;

function fuckChrome() {
    defaultSensitivity = document.getElementById("modecA-sensitivity").value;
    modecA = new MotionDetector.Core("A", "FaceTime HD Camera", 
            defaultSensitivity, function(activityLevel) {
                narrativeCore.enterMaze(activityLevel);
            });
}
function fuckChromeHard() {
    defaultSensitivity = document.getElementById("modecB-sensitivity").value;
    modecB = new MotionDetector.Core("B", "USB2.0 PC CAMERA (1908:2310)", 
            defaultSensitivity, function(activityLevel){
                narrativeCore.enterGarden(activityLevel);
            });
}
var narrativeCore = new Narrative.Core();

let audioContext;

document.getElementById("modecA-sensitivity").oninput = function() {
    document.getElementById("modecA-sensitivity-display").textContent = this.value;
    modecA.setSensitivity(this.value);
}
document.getElementById("modecB-sensitivity").oninput = function() {
    document.getElementById("modecB-sensitivity-display").textContent = this.value;
    modecB.setSensitivity(this.value);
}

document.getElementById("modecA-activitylevel-threshold").oninput = function() {
    document.getElementById("modecA-activitylevel-threshold-display").textContent = this.value;
    narrativeCore.setMazeActivityLevelThreshold(this.value);
}
document.getElementById("modecB-activitylevel-threshold").oninput = function() {
    document.getElementById("modecB-activitylevel-threshold-display").textContent = this.value;
    modecB.setGardenActivityLevelThreshold(this.value);
}

function initialize() {
    audioContext = new AudioContext();
    document.getElementById("init").value = "Initializing...";
    loadAudio("drone.mp3", buffer => { 
        narrativeCore.droneLoaded(buffer);
    });
    loadAudio("pluck.mp3", buffer => { 
        narrativeCore.pluckLoaded(buffer);
    });
}

function loadAudio(name, bufferInserter) {
    fetch(name) 
        .then(response => response.arrayBuffer()) // get buffer 
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // decode data
        .then(audioBuffer => {  // store decoded buffer
            console.log('Decoded', audioBuffer);
            bufferInserter(audioBuffer);
        }).catch(e => console.error(e));
}

function armMoDec(which) {
    if (which == "A") {
        modecA.armMoDec();
    } else { 
        modecB.armMoDec(); 
    }
    console.log("MoDec armed."); 
    document.getElementById("modec-" + which + "-status").textContent = "RUNNING...";
    document.getElementById("modec-" + which + "-status").style.color = "green";
    document.getElementById("modec-" + which + "-status").className = "running";
}

function disarmMoDec(which) {
    if (which == "A") {
        modecA.disarmMoDec();
    } else { 
        modecB.disarmMoDec();
    }
    console.log("MoDec disarmed."); 
    document.getElementById("modec-" + which + "-status").textContent = "NOT running";
    document.getElementById("modec-" + which + "-status").style.color = "red";
    document.getElementById("modec-" + which + "-status").className = "";
 
    document.getElementById('movement' + which).style.top = '0px'
    document.getElementById('movement' + which).style.left = '0px'
    document.getElementById('movement' + which).style.width = '0px'
    document.getElementById('movement' + which).style.height = '0px'
}

