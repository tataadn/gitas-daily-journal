// ===== Buku Harianku — data disimpan di localStorage =====
const MOODS = ['😊','🥰','😌','😴','😢','😡','🤩'];
const KEY = 'buku-harianku-v1';
let entries = [], cur = null, mood = '';

const $ = id => document.getElementById(id);

// ---------- Penyimpanan ----------
function load(){
  try { entries = JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch(e){ entries = []; }
}
function save(){
  try { localStorage.setItem(KEY, JSON.stringify(entries)); }
  catch(e){ $('status').textContent = 'Gagal menyimpan di browser. Coba Backup dulu.'; }
}

// ---------- Helper ----------
function today(){
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function fmt(t){
  return new Date(t + 'T00:00').toLocaleDateString('id-ID',
    {weekday:'long', day:'numeric', month:'long', year:'numeric'});
}
function ytId(u){
  const m = (u || '').match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}
function flip(){
  const r = $('rpage');
  r.classList.remove('flip'); void r.offsetWidth; r.classList.add('flip');
}
// ganti tampilan (khusus layar kecil)
function setView(v){
  $('spread').dataset.view = v;
  document.querySelectorAll('#mobileTabs .nav-link')
    .forEach(b => b.classList.toggle('active', b.dataset.view === v));
}

// ---------- Mood ----------
function renderMoods(){
  $('moods').innerHTML = MOODS.map(m =>
    `<button type="button" data-m="${m}" class="${m === mood ? 'on' : ''}">${m}</button>`).join('');
}
$('moods').addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b) return;
  mood = (mood === b.dataset.m) ? '' : b.dataset.m;
  renderMoods();
});

// ---------- Daftar isi ----------
function renderList(){
  const q = $('cari').value.toLowerCase();
  const rows = [...entries]
    .sort((a,b) => b.tgl.localeCompare(a.tgl))
    .filter(e => (e.judul + e.isi).toLowerCase().includes(q));

  const list = $('list');
  list.innerHTML = rows.length ? '' : '<p class="form-text">Belum ada halaman. Mulai menulis yuk ✨</p>';

  rows.forEach(e => {
    const item = document.createElement('div');
    item.className = 'list-group-item' + (e.id === cur ? ' active-item' : '');
    const b = document.createElement('b');
    const s = document.createElement('small');
    b.textContent = (e.mood ? e.mood + ' ' : '') + (e.judul || 'Tanpa judul');
    s.textContent = fmt(e.tgl) + (e.lagu ? ' 🎵' : '');
    item.append(b, document.createElement('br'), s);
    item.onclick = () => openEntry(e.id);
    list.appendChild(item);
  });
}

// ---------- Lagu YouTube (hanya audio) ----------
// Pakai YouTube IFrame Player API. Video-nya disembunyikan di luar layar,
// yang tampil hanya kontrol musik buatan sendiri.
let yt = null, ytReady = false, songId = null, tick = null;

function loadYTApi(){
  return new Promise(res => {
    if(window.YT && YT.Player) return res(true);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if(prev) prev(); res(true); };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = () => res(false);
    document.head.appendChild(s);
  });
}
function mmss(s){
  s = Math.max(0, Math.floor(s || 0));
  return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0');
}
function songError(msg){ $('songmsg').textContent = msg; }

function onYtError(e){
  const m = {
    2:'Invalid YouTube link.',
    5:'Player failed to load. Please try again.',
    100:'Video not found or marked as private.',
    101:'Video owner has restricted playback outside of YouTube. Please try another link.',
    150:'Video owner has restricted playback outside of YouTube. Please try another link.',
    153:'Page must be opened via http (live server/hosting), not file://.'
  };
  songError(m[e.data] || 'Song cannot be played (error code ' + e.data + ').');
  $('playBtn').disabled = true;
}
function onYtState(e){
  const playing = e.data === YT.PlayerState.PLAYING;
  $('playBtn').textContent = playing ? '⏸ Pause' : '▶ Play';
  if(e.data === YT.PlayerState.ENDED){ $('seek').value = 0; $('tNow').textContent = '0:00'; }
  const d = yt.getVideoData && yt.getVideoData();
  if(d && d.title) $('songTitle').textContent = d.title;
  $('tAll').textContent = mmss(yt.getDuration());
  clearInterval(tick);
  if(playing) tick = setInterval(() => {
    const t = yt.getCurrentTime(), d2 = yt.getDuration();
    $('tNow').textContent = mmss(t);
    if(d2) $('seek').value = (t / d2) * 100;
  }, 400);
}
async function buildPlayer(id){
  const ok = await loadYTApi();
  if(!ok){ songError('Gagal memuat YouTube. Cek koneksi internet.'); return; }
  if(yt){ yt.cueVideoById(id); $('playBtn').disabled = false; return; }
  yt = new YT.Player('ytHolder', {
    width: 200, height: 200, videoId: id,
    playerVars: { controls:0, disablekb:1, playsinline:1, rel:0,
                  origin: location.protocol.startsWith('http') ? location.origin : undefined },
    events: {
      onReady: () => { ytReady = true; yt.setVolume($('vol').value);
        $('playBtn').disabled = false;
        const d = yt.getVideoData(); if(d && d.title) $('songTitle').textContent = d.title;
        $('tAll').textContent = mmss(yt.getDuration()); },
      onStateChange: onYtState,
      onError: onYtError
    }
  });
}
function showSong(){
  const id = ytId($('lagu').value);
  $('songmsg').textContent = ($('lagu').value && !id) ? 'Invalid YouTube link.' : '';
  if(id === songId) return;           // lagu sama, jangan dimuat ulang
  songId = id;
  clearInterval(tick);
  $('seek').value = 0; $('tNow').textContent = '0:00'; $('tAll').textContent = '0:00';
  $('playBtn').textContent = '▶ Play';
  if(!id){
    $('player').classList.add('d-none');
    if(yt && yt.stopVideo) yt.stopVideo();
    return;
  }
  $('player').classList.remove('d-none');
  $('cover-img').src = 'https://i.ytimg.com/vi/' + id + '/mqdefault.jpg';
  $('songTitle').textContent = 'Loading the song…';
  $('playBtn').disabled = true;
  buildPlayer(id);
}
$('playBtn').onclick = () => {
  if(!yt) return;
  const s = yt.getPlayerState();
  if(s === YT.PlayerState.PLAYING) yt.pauseVideo(); else yt.playVideo();
};
$('seek').addEventListener('input', e => {
  if(yt && yt.getDuration) yt.seekTo(yt.getDuration() * e.target.value / 100, true);
});
$('vol').addEventListener('input', e => { if(yt && yt.setVolume) yt.setVolume(e.target.value); });

// ---------- CRUD ----------
function openEntry(id){
  const e = entries.find(x => x.id === id); if(!e) return;
  cur = id;
  $('tgl').value = e.tgl; $('judul').value = e.judul;
  $('isi').value = e.isi; $('lagu').value = e.lagu || '';
  mood = e.mood || '';
  renderMoods(); showSong(); renderList();
  $('status').textContent = '';
  flip(); setView('write');
}
function newEntry(){
  cur = null;
  $('tgl').value = today(); $('judul').value = '';
  $('isi').value = ''; $('lagu').value = ''; mood = '';
  renderMoods(); showSong(); renderList();
  $('status').textContent = '';
  flip(); setView('write');
}
$('simpan').onclick = () => {
  const data = {
    tgl: $('tgl').value || today(),
    judul: $('judul').value.trim(),
    isi: $('isi').value,
    lagu: $('lagu').value.trim(),
    mood
  };
  if(!data.judul && !data.isi){ $('status').textContent = 'Write something first ✍️'; return; }

  if(cur){ Object.assign(entries.find(x => x.id === cur), data); }
  else { cur = 'e' + Date.now(); entries.push({id: cur, ...data}); }
  save(); renderList();
  $('status').textContent = 'Saved ✓';
};
$('hapus').onclick = () => {
  if(cur && confirm('Delete this page?')){
    entries = entries.filter(x => x.id !== cur);
    save(); newEntry();
  }
};

// ---------- Event lain ----------
$('baru').onclick = newEntry;
$('cari').oninput = renderList;
$('lagu').addEventListener('change', showSong);
$('lagu').addEventListener('blur', showSong);
document.querySelectorAll('#mobileTabs .nav-link')
  .forEach(b => b.onclick = () => setView(b.dataset.view));

// ---------- Backup / Restore ----------
$('exp').onclick = () => {
  const blob = new Blob([JSON.stringify(entries, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'diary-backup-' + today() + '.json';
  a.click();
};
$('imp').onclick = () => $('file').click();
$('file').onchange = async ev => {
  try{
    const arr = JSON.parse(await ev.target.files[0].text());
    if(!Array.isArray(arr)) throw 0;
    const ids = new Set(entries.map(e => e.id));
    arr.forEach(e => { if(e && e.id && !ids.has(e.id)) entries.push(e); });
    save(); renderList();
    $('status').textContent = 'Restore successful ✓';
  }catch(e){
    $('status').textContent = 'Invalid backup file.';
  }
  ev.target.value = '';
};

// ---------- Tema terang/gelap ----------
const root = document.documentElement;
const savedTheme = (() => { try { return localStorage.getItem('diary-theme'); } catch(e){ return null; } })();
function applyTheme(t){
  root.setAttribute('data-bs-theme', t);
  document.querySelectorAll('.theme-btn').forEach(b => b.textContent = t === 'dark' ? '☀️' : '🌙');
}
applyTheme(savedTheme || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'));
document.querySelectorAll('.theme-btn').forEach(b => b.onclick = () => {
  const next = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('diary-theme', next); } catch(e){}
});

// ---------- Sampul: buka & tutup buku ----------
const coverEl = $('cover'), appEl = $('app'), coverBook = $('coverBook');
function openDiary(){
  const done = () => {
    coverEl.classList.add('d-none');
    coverBook.classList.remove('opening');
    appEl.classList.remove('d-none');
    appEl.classList.add('fade-in');
    flip();
  };
  coverBook.classList.add('opening');
  if(matchMedia('(prefers-reduced-motion:reduce)').matches) done(); else setTimeout(done, 880);
}
function closeDiary(){
  if(yt && yt.pauseVideo) yt.pauseVideo();   // hentikan musik saat buku ditutup
  appEl.classList.add('d-none');
  appEl.classList.remove('fade-in');
  coverEl.classList.remove('d-none');
}
$('openBtn').onclick = openDiary;
$('closeBtn').onclick = closeDiary;

// ---------- Mulai ----------
load();
newEntry();