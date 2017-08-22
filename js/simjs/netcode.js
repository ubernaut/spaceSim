var socket = io('http://localhost:1137');
socket.on('keypress', function (data) {
  console.log(data);
  document.body.innerHTML = `
    <pre>${JSON.stringify(data, null, 2)}</pre>
    <br/>
  ` + document.body.innerHTML
});
window.addEventListener('keydown', event => {
  socket.emit('keypress', { keyCode: event.keyCode })
})
