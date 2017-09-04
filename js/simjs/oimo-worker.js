let minfo
let fps = 0
let f = [ 0, 0, 0 ]
let body = []
self.onmessage = function (e) {
  if (e.data.oimoUrl && !Void.world) {
       // Load oimo.js
    importScripts(e.data.oimoUrl)
       // Init physics
    Void.world = new OIMO.World({ timestep: e.data.dt, iterations: 8, broadphase: 2, worldscale: 1, random: true, info: false })
       // Ground plane
    let ground = Void.world.add({ size: [ 200, 20, 200 ], pos: [ 0, -10, 0 ] })

    let N = e.data.N
    minfo = new Float32Array(N * 8)
    let x, z
    for (let i = 0; i !== N; i++) {
      x = -2 + Math.random() * 4
      z = -2 + Math.random() * 4
      body[i] = Void.world.add({ type: 'sphere', size: [ 0.25 ], pos: [ x, (0.5 * i) + 0.5, z ], move: true })
           // else body[i] = Void.world.add({type:'box', size:[0.5,0.5,0.5], pos:[x,((0.5*i)+0.5),z], move:true});
    }
    setInterval(update, e.data.dt * 1000)
  }
}
let update = function () {
   // Step the world
  Void.world.step()
  let n
  body.forEach((b, id) => {
    n = 8 * id
    if (b.sleeeping) {
      minfo[ n + 7 ] = 1
    } else {
      minfo[ n + 7 ] = 0
      b.getPosition().toArray(minfo, n)
      b.getQuaternion().toArray(minfo, n + 3)
    }
  })
  f[1] = Date.now()
  if (f[1] - 1000 > f[0]) { f[0] = f[1]; fps = f[2]; f[2] = 0 } f[2]++
  self.postMessage({ perf: fps, minfo: minfo })
}
