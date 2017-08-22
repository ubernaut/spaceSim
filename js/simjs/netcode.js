var socket = io('http://thedagda.co:1137');
socket.on('keypress', function (data) {
  console.log(data);
  // document.body.innerHTML = `
  //   <pre>${JSON.stringify(data, null, 2)}</pre>
  //   <br/>
  // ` + document.body.innerHTML
});
window.addEventListener('keydown', event => {
  socket.emit('keypress', JSON.stringify(ship.position));
})
