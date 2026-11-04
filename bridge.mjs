import http from 'node:http';
import { forwardLiveEvents } from './live-events.mjs';
import { WebSocketServer, WebSocket } from 'ws';
import { TikTokLiveConnection, WebcastEvent, ControlEvent } from 'tiktok-live-connector';

const username = (process.env.TIKTOK_USERNAME || 'hailen1113').trim().replace(/^@/, '');
const port = Number(process.env.PORT || 8786);
const clients = new Set();
let live = null, retry = null, stopping = false, connecting = false;
function scheduleRetry(){if(stopping||retry)return;liveStatus='retrying';broadcast({type:'bridge',status:liveStatus,username});retry=setTimeout(()=>{retry=null;void connectLive()},30000)}
async function connectLive(){if(stopping||connecting)return;connecting=true;liveStatus='connecting';broadcast({type:'bridge',status:liveStatus,username});try{const state=await live.connect();clearTimeout(retry);retry=null;liveStatus='connected';broadcast({type:'bridge',status:liveStatus,username});console.log('TikTok LIVE room '+state.roomId)}catch(error){console.error('TikTok:',error.message);scheduleRetry()}finally{connecting=false}}
let liveStatus = username ? 'connecting' : 'needs-username';

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true, username, status: liveStatus, clients: clients.size }));
    return;
  }
  res.writeHead(404).end('Not found');
});

const wss = new WebSocketServer({ server, path: '/events' });
wss.on('connection', (socket) => {
  clients.add(socket);
  socket.send(JSON.stringify({ type: 'bridge', status: liveStatus, username }));
  socket.on('close', () => clients.delete(socket));
});

function broadcast(event) {
  const data = JSON.stringify(event);
  for (const client of clients) if (client.readyState === WebSocket.OPEN) client.send(data);
}

server.listen(port, '127.0.0.1', () => {
  console.log(`Ngủ Online bridge: ws://127.0.0.1:${port}/events`);
  if (!username) {
    console.log('Chưa đặt TIKTOK_USERNAME. Game vẫn nhận được sự kiện thử qua WebSocket.');
    console.log('PowerShell: $env:TIKTOK_USERNAME="ten_khong_co_dau"; npm start');
    return;
  }
  live = new TikTokLiveConnection(username, { processInitialData: false });
  live.on(ControlEvent.ERROR, ({ info, exception }) => console.error('[TikTok]', info, exception?.message || ''));
  forwardLiveEvents(live, WebcastEvent, broadcast);
  live.on(ControlEvent.DISCONNECTED, scheduleRetry);
  live.on(WebcastEvent.STREAM_END, scheduleRetry);
  void connectLive();
});

async function shutdown() {
  stopping=true;clearTimeout(retry);
  if (live) await live.disconnect().catch(() => {});
  for (const client of clients) client.close();
  server.close(() => process.exit(0));
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
