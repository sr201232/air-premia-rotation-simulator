const Rotation = (() => {
  const W = 10080;
  function check(trips, assignments, count, turn=60) {
    const conflicts=[], links=[];
    for(let tail=1;tail<=count;tail++) {
      const row=trips.filter(t=>assignments[t.id]===tail).sort((a,b)=>a.start-b.start);
      for(let i=0;i<row.length;i++) {
        const a=row[i], b=row[(i+1)%row.length], wrap=i===row.length-1;
        const next=b.start+(wrap?W:0), gap=next-a.end;
        links.push({tail,a:a.id,b:b.id,gap,wrap,next,end:a.end});
      }
      for(let i=0;i<row.length;i++) for(let j=i+1;j<row.length;j++) {
        const a=row[i], b=row[j];
        for(const shift of [-W,0,W]) {
          if(Math.max(a.start,b.start+shift)<Math.min(a.end+turn,b.end+shift+turn)) {
            const first=a.start<=b.start+shift?a:b;
            const second=first===a?b:a;
            const gap=first===a?b.start+shift-a.end:a.start-(b.end+shift);
            conflicts.push({tail,a:first.id,b:second.id,gap,shortage:turn-gap,wrap:shift!==0,kind:gap<0?'운항 겹침':'인천 대기 부족'});
          }
        }
      }
    }
    return {conflicts,links,unassigned:trips.filter(t=>!assignments[t.id]).map(t=>t.id)};
  }
  function validateSave(raw,trips) {
    if(raw.version!==2 || !Number.isInteger(raw.count) || raw.count<1 || raw.count>12 || !raw.assignments || typeof raw.assignments!=='object') throw Error('지원하는 시뮬레이터 저장 파일이 아닙니다.');
    const ids=trips.map(t=>t.id);
    if(Object.keys(raw.assignments).length!==ids.length || ids.some(id=>!Number.isInteger(raw.assignments[id]) || raw.assignments[id]<0 || raw.assignments[id]>raw.count)) throw Error('편명 또는 기체 배정이 올바르지 않습니다.');
    return {count:raw.count,assignments:Object.fromEntries(ids.map(id=>[id,raw.assignments[id]]))};
  }
  return {W,check,validateSave};
})();
if(typeof module!=='undefined') module.exports=Rotation;
