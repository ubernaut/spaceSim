import './globals'

import * as netcode from './simjs/netcode'
import * as sim from './simjs/sim'
import * as utils from './simjs/utils'

window.addEventListener('keydown', event => {
  netcode.broadcastUpdate();
});
window.addEventListener('keyup', event => {
  netcode.broadcastUpdate();
});
document.body.addEventListener('mousedown', netcode.broadcastUpdate, false);
document.body.addEventListener('mouseup', netcode.broadcastUpdate, false);

sim.init();
sim.animate();
