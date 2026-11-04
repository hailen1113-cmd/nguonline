export function forwardLiveEvents(live, events, send) {
 for (const [key,type] of Object.entries({MEMBER:'join',CHAT:'comment',LIKE:'like',GIFT:'gift',FOLLOW:'follow',SHARE:'share'})) {
  live.on(events[key], e => {
   const id=e.user?.id || e.user?.displayId;
   if (!id) return;
   send({type,userId:String(id),username:e.user?.nickname || e.user?.displayId || 'Người xem',comment:type==='comment'?String(e.content||''):undefined});
  });
 }
}
