const onProgress = xhr => {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100
    Void.log.debug(`${Math.round(percentComplete, 2)}% downloaded`)
  }
}

const onError = xhr => {}

const randomUniform = (min, max) => Math.random() * (max - min) + min



export {
  onProgress,
  onError,
  randomUniform

}
