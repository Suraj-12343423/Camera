let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let stream;
let mediaRecorder;
let recordedChunks = [];
let lastImage = null;

// Start Camera
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(s => {
      stream = s;
      video.srcObject = s;
    })
    .catch(err => console.log(err));
}

// Stop Camera
function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
}

// Capture Photo
function capturePhoto() {
  let ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0);

  let imageURL = canvas.toDataURL("image/png");
  lastImage = imageURL;

  // add to gallery
  let img = document.createElement("img");
  img.src = imageURL;
  document.getElementById("gallery").appendChild(img);
}

// Download Photo
function downloadPhoto() {
  if (!lastImage) {
    alert("No photo captured!");
    return;
  }

  let a = document.createElement("a");
  a.href = lastImage;
  a.download = "photo.png";
  a.click();
}

// Start Recording
function startRecording() {
  recordedChunks = [];

  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = e => {
    recordedChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    let blob = new Blob(recordedChunks, { type: "video/webm" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "video.webm";
    a.click();
  };

  mediaRecorder.start();
}

// Stop Recording
function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
}