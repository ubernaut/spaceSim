onmessage = function (e) {
  console.log('Message received from main script')

  const newSystem = new System(e.data[0], e.data[1], e.data[2], e.data[3], e.data[4])
  console.log('Posting message back to main script')
  postMessage(newSystem)
}
