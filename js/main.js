var core = new MotionDetector.Core();

let audioContext = new AudioContext();
let buffer;

function armMoDec(which) {
    core.armMoDec();
    console.log("MoDec armed."); 
    document.getElementById("modec-" + which + "-status").textContent = "RUNNING";
    document.getElementById("modec-" + which + "-status").style.color = "green";
}

function disarmMoDec(which) {
    core.disarmMoDec();
    console.log("MoDec disarmed."); 
    document.getElementById("modec-" + which + "-status").textContent = "NOT running";
    document.getElementById("modec-" + which + "-status").style.color = "red";
}

function play(fuffer, panItup=0, rate=1) {
    let source = audioContext.createBufferSource();
    source.buffer = fuffer;
    source.loop = false;
    //source.loopStart = 2;
    //source.loopEnd = 3;
    source.playbackRate.value = rate;

    let pannerNode = audioContext.createStereoPanner();
    pannerNode.pan.value = panItup;

    source.connect(pannerNode);
    pannerNode.connect(audioContext.destination); 
    source.start(0, 2);
}

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
    }).catch(e => console.error(e));


