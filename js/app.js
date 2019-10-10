URL = window.URL || window.webkitURL;

let gumStream; 						
let rec; 							
let input; 							

let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext 

let recordButton = document.getElementById("recordButton");
let stopButton = document.getElementById("stopButton");
let pauseButton = document.getElementById("pauseButton");

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
	// console.log("recordButton clicked");

    
    let constraints = { audio: true, video:false }


	recordButton.disabled = true;
	stopButton.disabled = false;
	pauseButton.disabled = false


	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		// console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		audioContext = new AudioContext();
		
		gumStream = stream;
		
		input = audioContext.createMediaStreamSource(stream);


		rec = new Recorder(input,{numChannels:1})

		rec.record()

		// console.log("Recording started");

	}).catch(function(err) {
    	recordButton.disabled = false;
    	stopButton.disabled = true;
    	pauseButton.disabled = true
	});
}

function pauseRecording(){
	// console.log("pauseButton clicked rec.recording=",rec.recording );
	if (rec.recording){
		rec.stop();
		pauseButton.innerHTML="Resume";
	}else{
		rec.record()
		pauseButton.innerHTML="Pause";

	}
}

function stopRecording() {
	// console.log("stopButton clicked");

	stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;

	pauseButton.innerHTML="Pause";
	
	rec.stop();

	gumStream.getAudioTracks()[0].stop();

	rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
	
	let url = URL.createObjectURL(blob);
	let au = document.createElement('audio');
	let li = document.createElement('li');

	let filename = new Date().toISOString();

	au.controls = true;
	au.src = url;

	li.appendChild(au);
	
	let upload = document.createElement('button');
	upload.href="#";
	upload.innerHTML = "Upload";
	
	$.ajax({
		url: 'save.php',
		data: formData,
		cache: false,
		contentType: false,
		processData: false,
		type: 'POST',
		success: function(response) {
			if (response === 'success') {
				alert('successfully uploaded recorded blob');
			} else {
				alert(response);
			}
		}
	});
	document.getElementById('controls').appendChild(upload)//add the upload link to li

	recordingsList.appendChild(li);
}