function graduationFaculty(facultyId = GAME_CONFIG.player.faculty) {
  return FACULTIES[facultyId] || FACULTIES.economics || Object.values(FACULTIES)[0];
}
function graduationMajor(facultyId = GAME_CONFIG.player.faculty, majorId = GAME_CONFIG.player.major) {
  const f = graduationFaculty(facultyId);
  return f.majors?.find(m => m.id === majorId) || f.majors?.[0] || { name:'Jurusan', level:'', degree:'' };
}
function degreeForGraduationFaculty(facultyId) { return graduationMajor(facultyId).degree || GAME_CONFIG.player.degree || ''; }
function graduationNickname() { return GAME_CONFIG.player.nickname || GAME_CONFIG.player.firstName || GAME_CONFIG.player.fullName?.split(/\s+/)[0] || 'Graduate'; }
function graduationDisplayName(facultyId) {
  const degree = degreeForGraduationFaculty(facultyId);
  return degree ? `${GAME_CONFIG.player.fullName}, ${degree}` : GAME_CONFIG.player.fullName;
}
function resolveGraduationCopy(text = '', facultyId = GAME_CONFIG.player.faculty) {
  const faculty = graduationFaculty(facultyId), major = graduationMajor(facultyId);
  return String(text)
    .replaceAll('{{playerName}}', graduationNickname()).replaceAll('{{nickname}}', graduationNickname())
    .replaceAll('{{fullName}}', GAME_CONFIG.player.fullName).replaceAll('{{graduateName}}', graduationDisplayName(facultyId))
    .replaceAll('{{degree}}', degreeForGraduationFaculty(facultyId)).replaceAll('{{faculty}}', faculty.name)
    .replaceAll('{{facultyShort}}', faculty.shortName).replaceAll('{{major}}', major.name).replaceAll('{{level}}', major.level)
    .replaceAll('{{facultyWish}}', GAME_CONFIG.graduation.facultyMessages?.[facultyId] || '').replaceAll('{{university}}', GAME_CONFIG.university.name);
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 8) {
  const words = String(text || '').split(/\s+/).filter(Boolean); let line = '', lineNo = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) { ctx.fillText(line, x, y + lineNo * lineHeight); line = word; lineNo++; if (lineNo >= maxLines) return y + lineNo * lineHeight; }
    else line = test;
  }
  if (line && lineNo < maxLines) { ctx.fillText(line, x, y + lineNo * lineHeight); lineNo++; }
  return y + lineNo * lineHeight;
}
function fitFont(ctx, text, maxWidth, startSize, minSize, weight = 900, family = 'system-ui') {
  let size = startSize; while (size > minSize) { ctx.font = `${weight} ${size}px ${family}`; if (ctx.measureText(text).width <= maxWidth) break; size -= 2; } return size;
}
function loadImage(url) { return new Promise(resolve => { if (!url) return resolve(null); const img = new Image(); const timer=setTimeout(()=>resolve(null),2400); img.onload=()=>{clearTimeout(timer);resolve(img)}; img.onerror=()=>{clearTimeout(timer);resolve(null)}; img.src=url; }); }
function drawCover(ctx,img,x,y,w,h,alpha=1){ if(!img)return; const scale=Math.max(w/img.width,h/img.height), sw=w/scale, sh=h/scale, sx=(img.width-sw)/2, sy=(img.height-sh)/2; ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);ctx.restore(); }
function roundRect(ctx,x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();}

async function createGraduationCard(facultyId, summary = {}) {
  const faculty=graduationFaculty(facultyId), major=graduationMajor(facultyId);
  const canvas=document.createElement('canvas'); canvas.width=1080; canvas.height=1350; const c=canvas.getContext('2d');
  const [campus,toga,m1,m2,m3,logo]=await Promise.all([
    loadImage('assets/backgrounds/graduation_stage.webp'),
    loadImage(`assets/generated/player_toga_${facultyId}.png`),
    loadImage('assets/backgrounds/campus_day.webp'),
    loadImage('assets/backgrounds/interior_library.webp'),
    loadImage('assets/backgrounds/interior_corridor_pixel.webp'),
    loadImage(GAME_CONFIG.university.logo)
  ]);

  c.fillStyle='#160f0b';c.fillRect(0,0,1080,1350); drawCover(c,campus,0,0,1080,670,.44);
  const shade=c.createLinearGradient(0,0,0,760);shade.addColorStop(0,'rgba(22,15,11,.08)');shade.addColorStop(.6,'rgba(22,15,11,.48)');shade.addColorStop(1,'#160f0b');c.fillStyle=shade;c.fillRect(0,0,1080,800);
  c.fillStyle=faculty.color;c.fillRect(0,0,1080,16); c.fillStyle='#d7ae68';c.fillRect(76,86,928,2);

  if(logo){c.save();roundRect(c,76,38,72,72,18);c.clip();drawCover(c,logo,76,38,72,72,1);c.restore()} else {c.fillStyle='#f4e3c2';c.font='800 38px system-ui';c.fillText(GAME_CONFIG.university.shortName.slice(0,1),96,88)}
  c.textAlign='left';c.fillStyle='#f4e3c2';c.font='700 22px system-ui';c.fillText(GAME_CONFIG.university.name.toUpperCase(),170,66);c.fillStyle='rgba(244,227,194,.65)';c.font='600 18px system-ui';c.fillText("SCHOLAR'S JOURNEY · GRADUATION KEEPSAKE",170,96);

  if(toga){const scale=Math.min(430/toga.width,500/toga.height);const w=toga.width*scale,h=toga.height*scale;c.drawImage(toga,540-w/2,160,w,h)}
  c.textAlign='center';c.fillStyle='#d7ae68';c.font='700 20px system-ui';c.fillText('JOURNEY COMPLETED · 8 SEMESTER',540,690);
  c.fillStyle='#fff8e9';const nm=graduationDisplayName(facultyId);const ns=fitFont(c,nm,900,54,34,850);c.font=`850 ${ns}px system-ui`;c.fillText(nm,540,750);
  c.fillStyle='#f0d6a8';c.font='700 28px system-ui';c.fillText(`${major.name} · ${major.level}`,540,795);c.fillStyle='rgba(240,214,168,.76)';c.font='600 22px system-ui';c.fillText(faculty.name,540,830);

  const stripY=875, stripW=282, stripH=150, gap=18, startX=90; [m1,m2,m3].forEach((img,i)=>{const x=startX+i*(stripW+gap);c.save();roundRect(c,x,stripY,stripW,stripH,20);c.clip();drawCover(c,img,x,stripY,stripW,stripH,.92);c.restore();c.strokeStyle='rgba(215,174,104,.55)';c.lineWidth=2;roundRect(c,x,stripY,stripW,stripH,20);c.stroke()});
  c.fillStyle='rgba(255,248,233,.66)';c.font='600 15px system-ui';c.fillText('BERSAMA TEMAN',231,1047);c.fillText('TUGAS & PERJUANGAN',531,1047);c.fillText('BELAJAR & BERTUMBUH',831,1047);

  c.fillStyle='#fff8e9';c.font='italic 500 24px Georgia';wrapText(c,`“${resolveGraduationCopy(GAME_CONFIG.graduation.quote,facultyId)}”`,540,1105,860,34,3);
  c.fillStyle='#d7ae68';c.font='700 17px system-ui';c.fillText('8 SEMESTER  ·  1 PERJALANAN  ·  BANYAK CERITA',540,1212);
  const senders=GAME_CONFIG.graduation.senderLines||[];c.fillStyle='rgba(255,248,233,.58)';c.font='600 15px system-ui';c.fillText(resolveGraduationCopy(GAME_CONFIG.graduation.senderPrefix,facultyId).toUpperCase(),540,1254);c.fillStyle='#fff8e9';c.font='700 19px system-ui';c.fillText(senders.map(x=>resolveGraduationCopy(x,facultyId)).join('  ·  '),540,1285);
  c.fillStyle='rgba(255,255,255,.28)';c.font='600 13px system-ui';c.fillText('A LITTLE JOURNEY MADE ESPECIALLY FOR YOU',540,1325);
  return await new Promise(resolve=>canvas.toBlob(resolve,'image/png',.96));
}
async function shareGraduationCard(facultyId, summary = {}) {
  const blob=await createGraduationCard(facultyId,summary); if(!blob)return;
  const file=new File([blob],'graduation-keepsake.png',{type:'image/png'});
  if(navigator.share&&navigator.canShare?.({files:[file]})){try{await navigator.share({title:"Scholar's Journey",text:`🎓 ${graduationDisplayName(facultyId)} · ${graduationMajor(facultyId).name} · ${graduationFaculty(facultyId).shortName}`,files:[file]});return}catch(e){if(e?.name==='AbortError')return}}
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='graduation-keepsake.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
}
async function downloadGraduationCard(facultyId, summary = {}) {
  const blob=await createGraduationCard(facultyId,summary);if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');const safe=String(GAME_CONFIG.player.fullName||'graduate').toLowerCase().replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'');a.href=url;a.download=`graduation-keepsake-${safe||'graduate'}.png`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
