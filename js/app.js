let recordButton = document.getElementById("recordButton");
let stopButton = document.getElementById("stopButton");
let pauseButton = document.getElementById("pauseButton");


if (navigator.mediaDevices) {
    console.log('getUserMedia supported.');

    let constraints = {audio: true};
    let chunks = [];

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {

            let mediaRecorder = new MediaRecorder(stream);

            recordButton.onclick = function () {
                mediaRecorder.start();
                recordButton.disabled = true;
                stopButton.disabled = false;
                pauseButton.disabled = false;
                console.log(mediaRecorder.state);
            }

            pauseButton.onclick = function () {
                if (mediaRecorder.state === "recording") {
                    mediaRecorder.pause();
                    recordButton.disabled = true;
                    stopButton.disabled = false;
                    pauseButton.disabled = false;
                    pauseButton.innerHTML = "Resume";
                    console.log(mediaRecorder.state);
                } else if (mediaRecorder.state === "paused") {
                    mediaRecorder.resume();
                    recordButton.disabled = true;
                    stopButton.disabled = false;
                    pauseButton.disabled = false;
                    pauseButton.innerHTML = "Pause";
                    console.log(mediaRecorder.state);
                }
            }

            stopButton.onclick = function () {
                mediaRecorder.stop();
                stopButton.disabled = true;
                recordButton.disabled = false;
                pauseButton.disabled = true;
                pauseButton.innerHTML = "Pause";


                console.log(mediaRecorder.state);
            }

            mediaRecorder.onstop = function(e) {
                console.log("data available after MediaRecorder.stop() called.");

                let audio = document.createElement('audio');
                audio.controls = true;
                let blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'});
                let audioURL = window.URL.createObjectURL(blob);
                audio.src = audioURL;
                console.log(audio);

                let filename = new Date().toISOString();

                let upload = document.createElement('button');
                upload.innerHTML = "Upload";
                upload.addEventListener("click", function (event) {
                    let xhr = new XMLHttpRequest();
                    xhr.onload = function (e) {
                        if (this.readyState === 4) {
                            console.log("Server returned: ", e.target.responseText);
                        }
                    };
                    let fd = new FormData();
                    fd.append("audio_data", blob, filename);
                    xhr.open("POST", "save.php", true);
                    xhr.send(fd);
                })
                document.getElementById('controls').appendChild(upload);
            }
            mediaRecorder.ondataavailable = function(e) {
                chunks.push(e.data);
            }
        })
        .catch(function (err) {
            console.log('The following error occurred: ' + err);
        })
}