function randomuniform(min, max) {
    return Math.random() * (max - min) + min;
}

const onProgress = function(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log(Math.round(percentComplete, 2) + '% downloaded');
  }
};

const onError = function(xhr) {};

export { onProgress, onError, randomuniform }
