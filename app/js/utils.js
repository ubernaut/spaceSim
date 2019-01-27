const onProgress = xhr => {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100
    console.log(`${Math.round(percentComplete, 2)}% downloaded`)
  }
}

const onError = xhr => {}

const randomUniform = (min, max) => Math.random() * (max - min) + min

const s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

const guid = () => [ s4() + s4(), s4(), s4(), s4(), s4() + s4() + s4() ].join('-')

const rgb2hex = rgb => {
  return parseInt('0x' + rgb.map(x => parseInt(x).toString(16)).join(''), 16)
}

const pickRand = items => items[Math.round(randomUniform(1, items.length)) - 1]

export { onProgress, onError, randomUniform, guid, rgb2hex, pickRand }
