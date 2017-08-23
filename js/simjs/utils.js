function randomuniform(min, max) {
    return Math.random() * (max - min) + min;
}

var onProgress = function(xhr) {
  if (xhr.lengthComputable) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    console.log(Math.round(percentComplete, 2) + '% downloaded');
  }
};

var onError = function(xhr) {};

export { onProgress, onError }
