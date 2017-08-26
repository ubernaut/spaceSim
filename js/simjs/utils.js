const onProgress = xhr => {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100
    console.log(`${Math.round(percentComplete, 2)}% downloaded`)
  }
}

const onError = xhr => {}

const randomUniform = (min, max) => Math.random() * (max - min) + min

export {
  onProgress,
  onError,
  randomUniform
}
