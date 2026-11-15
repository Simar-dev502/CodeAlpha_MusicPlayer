
const albumData = [
  { name: 'Party Hits', cover: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=600&q=85', tracks: [
    { title: '9:45', artist: 'Prabh Singh', src: 'music/9 45 - Prabh (pagalall.com).mp3' },
    { title: 'Sadi Sun', artist: 'Harsh Nussi', src: 'music/Sadi Sun - HARSH NUSSI.mp3' },
    { title: 'The Beast', artist: 'Cheema Y', src: 'music/The_Beast.mp3' },
    { title: 'Shararat Dhurandhar', artist: 'Jasmine Sandlas', src: 'music/Shararat Dhurandhar 128 kbps.mp3' },
    { title: 'STFU', artist: 'Parmish Verma', src: 'music/STFU_1.mp3' },
    { title: 'Yeh Baby', artist: 'Garry Sandhu', src: 'music/Yeh_Baby_1.mp3' },
    { title: 'Lak 28 kudi Da', artist: 'Diljit Dosanjh', src: 'music/Lak_28_kudi_Da_4.mp3' },
    { title: 'Boyfriend', artist: 'Karan Aujla', src: 'music/Boyfriend-Karan Aujla.mp3' },
    { title: 'Rubicon', artist: 'Laddi Chahal', src: 'music/Rubicon_Dril.mp3' },
    { title: 'Player', artist: 'Badshah', src: 'music/Player-Badshah.mp3' }
  ]},
  { name: 'Old is Gold', cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=85', tracks: [
    { title: 'Likhe Jo Khat Tujhe', artist: '', src: 'music/Likhe Jo Khat Tujhe Kanyadaan 128 Kbps.mp3' },
    { title: 'Mere Dil Ke Chain', artist: '', src: 'music/O Mere Dil Ke Chain Mere Jeevan Saathi 128 Kbps.mp3' },
    { title: 'Bheegi Bheegi Raaton Mein', artist: '', src: 'music/Bheegi Bheegi Raaton Mein Ajanabee 128 Kbps.mp3' },
    { title: 'Uden Jab jab Zulfen Teri', artist: '', src: 'music/Uden Jab Jab Zulfen Teri Naya Daur (1957) 128 Kbps.mp3' },
    { title: 'Yeh Sham Mastani', artist: '', src: 'music/Yeh Sham Mastani And Dialogue Kati Patang 128 Kbps.mp3' },
    { title: 'Barsaat ke Mausam Mein', artist: '', src: 'music/Barsaat Ke Mausam Mein Naajayaz 128 Kbps.mp3' },
    { title: 'Baahon Men Chale aao', artist: 'Lata Mangeshkar', src: 'music/Baahon-Men-Chale-Aao-4K-Lata-Mangeshkar-Romantic-Song-Sanjeev-Kumar-Jaya-Bachchan-Anamika.mp3' },
    { title: 'Ajib Dastan Hai Yeh', artist: 'Lata Mangeshkar', src: 'music/Ajib-Dastan-Hai-Yeh-Video-Song-Dil-Apna-Aur-Preet-Parai-Raaj-Kumar-Meena-K-Lata-Mangeshkar.mp3' }
  ]},
  { name: 'Honey Singh', cover: 'https://images.unsplash.com/photo-1529909833061-5b63d5c2a1b3?auto=format&fit=crop&w=600&q=85', tracks: [
    { title: 'Desi Kalakaar', artist: 'Honey Singh', src: 'music/Desi Kalakaar Yo Yo Honey Singh 128 Kbps.mp3' },
    { title: 'Dope Shope', artist: 'Honey Singh', src: 'music/Dope Shope International Villager 128 Kbps.mp3' },
    { title: 'One Bottle Down', artist: 'Honey Singh', src: 'music/One Bottle Down Yo Yo Honey Singh 128 Kbps.mp3' },
    { title: 'Im your Dj Tonight', artist: 'Honey Singh', src: 'music/Im Your Dj Tonight Desi Kalakaar 128 Kbps.mp3' },
    { title: 'Love Dose', artist: 'Honey Singh', src: 'music/Love Dose Desi Kalakaar 128 Kbps.mp3' },
    { title: 'Brown Rang', artist: 'Honey Singh', src: 'music/Brown Rang International Villager 128 Kbps.mp3' },
    { title: 'Bonita', artist: 'Honey Singh', src: 'music/Bonita - Yo Yo Honey Singh.mp3' },
    { title: 'Angreji Beat', artist: 'Honey Singh', src: 'music/Angreji Beat International Villager 128 Kbps.mp3' },
    { title: 'Raat Jashan di', artist: 'Honey Singh', src: 'music/Raat_Jashan_Di_1.mp3' }
  ]}
];

const audio = new Audio();
audio.preload = 'metadata';
const state = {
  albumIndex: 0, trackIndex: 0, isShuffle: false, repeatMode: 'none',
  favorites: loadStore('melodify-favorites', []),
  recent: loadStore('melodify-recent', []),
  playlists: loadStore('melodify-playlists', []),
  queue: [], activeView: 'home', activePlaylistId: null, search: '', toastTimer: null
};
const $ = id => document.getElementById(id);
const allTracks = () => albumData.flatMap((album, albumIndex) => album.tracks.map((track, trackIndex) => ({...track, album: album.name, albumIndex, trackIndex, cover: album.cover, id: `${albumIndex}:${trackIndex}`})));
const currentTrack = () => albumData[state.albumIndex]?.tracks[state.trackIndex];
const currentAlbum = () => albumData[state.albumIndex];
function loadStore(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function saveStore() {
  localStorage.setItem('melodify-favorites', JSON.stringify(state.favorites));
  localStorage.setItem('melodify-recent', JSON.stringify(state.recent.slice(0, 30)));
  localStorage.setItem('melodify-playlists', JSON.stringify(state.playlists));
}
function escapeHTML(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function formatTime(seconds) { if (!Number.isFinite(seconds)) return '0:00'; return `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`; }
function trackById(id) { return allTracks().find(track => track.id === id); }
function showToast(message) { const toast = $('toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(state.toastTimer); state.toastTimer = setTimeout(() => toast.classList.remove('show'), 2300); }

function setTrack(track, autoplay = true) {
  if (!track) return;
  state.albumIndex = track.albumIndex; state.trackIndex = track.trackIndex;
  audio.src = track.src; audio.load();
  $('miniTitle').textContent = track.title; $('miniArtist').textContent = track.artist || track.album;
  $('miniCover').innerHTML = `<img src="${escapeHTML(track.cover)}" alt="">`;
  addRecent(track.id); updateLikeButton(); updateQueue(); renderActiveRows();
  if (autoplay) play();
}
function play() {
  if (!audio.src && allTracks().length) setTrack(allTracks()[0], false);
  audio.play().then(() => $('playBtn').innerHTML = '<i class="fa-solid fa-pause"></i>').catch(() => {
    $('playBtn').innerHTML = '<i class="fa-solid fa-play"></i>';
    showToast('Could not play this track. Check the MP3 file path.');
  });
}
function pause() { audio.pause(); $('playBtn').innerHTML = '<i class="fa-solid fa-play"></i>'; }
function togglePlay() { audio.paused ? play() : pause(); }
function addRecent(id) { state.recent = [id, ...state.recent.filter(item => item !== id)].slice(0, 30); saveStore(); renderRecent(); }
function playNext() {
  if (state.queue.length) { const next = trackById(state.queue.shift()); updateQueue(); if (next) return setTrack(next); }
  const tracks = allTracks(); let next;
  if (state.isShuffle && tracks.length > 1) { const options = tracks.filter(t => t.id !== `${state.albumIndex}:${state.trackIndex}`); next = options[Math.floor(Math.random()*options.length)]; }
  else {
    let index = tracks.findIndex(t => t.id === `${state.albumIndex}:${state.trackIndex}`) + 1;
    if (index >= tracks.length) { if (state.repeatMode === 'all') index = 0; else { pause(); return; } }
    next = tracks[index];
  }
  setTrack(next);
}
function playPrevious() {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  const tracks = allTracks(); let index = tracks.findIndex(t => t.id === `${state.albumIndex}:${state.trackIndex}`) - 1;
  if (index < 0) index = tracks.length - 1;
  setTrack(tracks[index]);
}
function toggleFavorite(id) {
  state.favorites = state.favorites.includes(id) ? state.favorites.filter(item => item !== id) : [...state.favorites, id];
  saveStore(); renderFavorites(); renderActiveRows(); updateLikeButton();
  showToast(state.favorites.includes(id) ? 'Added to favorites' : 'Removed from favorites');
}
function updateLikeButton() {
  const liked = state.favorites.includes(`${state.albumIndex}:${state.trackIndex}`);
  $('likeCurrentBtn').classList.toggle('liked', liked);
  $('likeCurrentBtn').innerHTML = `<i class="${liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;
}
function trackRow(track, index, options={}) {
  const active = track.id === `${state.albumIndex}:${state.trackIndex}`;
  const liked = state.favorites.includes(track.id);
  return `<article class="track-row ${active ? 'playing' : ''}" data-track-id="${track.id}">
    <button class="track-play" data-action="play" data-id="${track.id}" aria-label="Play ${escapeHTML(track.title)}">${active && !audio.paused ? '<i class="fa-solid fa-volume-high"></i>' : `<span>${String(index+1).padStart(2,'0')}</span>`}</button>
    <div class="row-cover"><img src="${escapeHTML(track.cover)}" alt=""></div>
    <button class="row-title" data-action="play" data-id="${track.id}"><strong>${escapeHTML(track.title)}</strong><span>${escapeHTML(track.artist || track.album)}</span></button>
    <span class="row-album">${escapeHTML(track.album)}</span>
    <button class="icon-button row-like ${liked ? 'liked' : ''}" data-action="like" data-id="${track.id}" aria-label="Favorite"><i class="${liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i></button>
    <button class="icon-button row-more" data-action="queue" data-id="${track.id}" aria-label="Add to queue"><i class="fa-solid fa-plus"></i></button>
  </article>`;
}
function renderTrackList(container, tracks, emptyText='No tracks here yet.') {
  $(container).innerHTML = tracks.length ? tracks.map((track, i) => trackRow(track, i)).join('') : `<div class="empty-state"><i class="fa-solid fa-music"></i><p>${emptyText}</p></div>`;
}
function renderAlbums() {
  $('albumGrid').innerHTML = albumData.map((album, index) => `<button class="album-card" data-album="${index}"><span class="album-cover"><img src="${escapeHTML(album.cover)}" alt=""><span class="album-play"><i class="fa-solid fa-play"></i></span></span><span class="album-card-title">${escapeHTML(album.name)}</span><span class="album-card-sub">${album.tracks.length} tracks · Album collection</span></button>`).join('');
  $('albumFilters').innerHTML = `<button class="filter-chip active" data-filter="all">All tracks</button>` + albumData.map((a,i)=>`<button class="filter-chip" data-filter="${i}">${escapeHTML(a.name)}</button>`).join('');
  renderExplore('all');
}
function renderExplore(filter='all') {
  const tracks = allTracks().filter(t => filter === 'all' || t.albumIndex === Number(filter));
  renderTrackList('exploreTracks', tracks, 'No tracks found in this collection.');
}
function renderFavorites() { renderTrackList('favoriteTracks', state.favorites.map(trackById).filter(Boolean), 'Songs you like will appear here.'); }
function renderRecent() {
  const recent = state.recent.map(trackById).filter(Boolean);
  renderTrackList('recentTracks', recent, 'Your recently played songs will appear here.');
  renderTrackList('homeRecent', recent.slice(0,4), 'Play a song and it will show up here.');
}
function renderLibrary() {
  $('libraryPlaylists').innerHTML = state.playlists.length ? state.playlists.map(p=>`<button class="library-item" data-playlist="${p.id}"><i class="fa-solid fa-list-music"></i><span>${escapeHTML(p.name)}</span></button>`).join('') : '<p class="library-empty">Your playlists will show here.</p>';
}
function renderCustomPlaylist(id) {
  const playlist = state.playlists.find(p=>p.id===id); if (!playlist) return;
  state.activePlaylistId = id; $('playlistViewTitle').innerHTML = `${escapeHTML(playlist.name)}<span>.</span>`;
  $('playlistViewSubtitle').textContent = `${playlist.tracks.length} saved tracks · Made by you`;
  renderTrackList('customPlaylistTracks', playlist.tracks.map(trackById).filter(Boolean), 'Add songs with the + button to build this playlist.');
  showView('playlist');
}
function renderSearch(query) {
  const q = query.trim().toLowerCase();
  const results = q ? allTracks().filter(t => `${t.title} ${t.artist} ${t.album}`.toLowerCase().includes(q)) : [];
  $('searchSummary').textContent = `${results.length} result${results.length===1?'':'s'} for “${query}”`;
  renderTrackList('searchResults', results, 'No matching tracks. Try another search.');
}
function renderActiveRows() {
  document.querySelectorAll('.track-row').forEach(row => {
    const track = trackById(row.dataset.trackId); if (!track) return;
    const active = track.id === `${state.albumIndex}:${state.trackIndex}`;
    row.classList.toggle('playing', active);
    const playBtn = row.querySelector('.track-play');
    if (playBtn) playBtn.innerHTML = active && !audio.paused ? '<i class="fa-solid fa-volume-high"></i>' : `<span>${String([...row.parentElement.children].indexOf(row)+1).padStart(2,'0')}</span>`;
    const like = row.querySelector('.row-like'); if (like) { const liked=state.favorites.includes(track.id); like.classList.toggle('liked',liked); like.innerHTML=`<i class="${liked?'fa-solid':'fa-regular'} fa-heart"></i>`; }
  });
}
function updateQueue() {
  const current = currentTrack();
  $('queueCurrent').innerHTML = current ? `<img src="${escapeHTML(currentAlbum().cover)}" alt=""><div><strong>${escapeHTML(current.title)}</strong><span>${escapeHTML(current.artist || currentAlbum().name)}</span></div>` : '<span>Nothing playing</span>';
  $('queueTracks').innerHTML = state.queue.map((id,i)=>{const t=trackById(id);return t?`<div class="queue-row"><span>${i+1}</span><div><strong>${escapeHTML(t.title)}</strong><small>${escapeHTML(t.artist || t.album)}</small></div><button class="icon-button" data-remove-queue="${id}" aria-label="Remove"><i class="fa-solid fa-xmark"></i></button></div>`:''}).join('');
  $('queueEmpty').classList.toggle('hidden', state.queue.length>0);
}
function showView(view) {
  state.activeView = view;
  document.querySelectorAll('.content-view').forEach(el=>el.classList.add('hidden'));
  const target = $(`${view}View`); if (target) target.classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===view));
  document.querySelector('.main-content').scrollTo({top:0,behavior:'smooth'});
}
function addToQueue(id) { if (id !== `${state.albumIndex}:${state.trackIndex}`) { state.queue.push(id); updateQueue(); showToast('Added to queue'); } }
function createPlaylist(name) {
  const playlist = {id: `playlist-${Date.now()}`, name, tracks: []};
  state.playlists.push(playlist); saveStore(); renderLibrary(); renderCustomPlaylist(playlist.id); showToast('Playlist created');
}
function addTrackToPlaylist(id) {
  if (!state.playlists.length) { $('playlistDialog').showModal(); showToast('Create a playlist first'); return; }
  const target = state.playlists.find(p=>p.id===state.activePlaylistId) || state.playlists[0];
  if (!target.tracks.includes(id)) { target.tracks.push(id); saveStore(); renderLibrary(); if (state.activePlaylistId===target.id) renderCustomPlaylist(target.id); showToast(`Added to ${target.name}`); }
  else showToast('Already in this playlist');
}
function initEvents() {
  $('playBtn').addEventListener('click',togglePlay); $('nextBtn').addEventListener('click',playNext); $('prevBtn').addEventListener('click',playPrevious);
  $('shuffleBtn').addEventListener('click',()=>{state.isShuffle=!state.isShuffle;$('shuffleBtn').classList.toggle('active',state.isShuffle);showToast(state.isShuffle?'Shuffle on':'Shuffle off');});
  $('repeatBtn').addEventListener('click',()=>{state.repeatMode=state.repeatMode==='none'?'all':state.repeatMode==='all'?'one':'none';$('repeatBtn').classList.toggle('active',state.repeatMode!=='none');$('repeatBtn').dataset.mode=state.repeatMode;showToast(`Repeat: ${state.repeatMode}`);});
  $('likeCurrentBtn').addEventListener('click',()=>toggleFavorite(`${state.albumIndex}:${state.trackIndex}`));
  $('volumeSlider').addEventListener('input',e=>audio.volume=Number(e.target.value)); audio.volume=.65;
  $('progressBar').addEventListener('click',e=>{if(Number.isFinite(audio.duration)){const r=e.currentTarget.getBoundingClientRect();audio.currentTime=((e.clientX-r.left)/r.width)*audio.duration;}});
  $('progressBar').addEventListener('keydown',e=>{if(!Number.isFinite(audio.duration))return;if(e.key==='ArrowRight')audio.currentTime=Math.min(audio.duration,audio.currentTime+5);if(e.key==='ArrowLeft')audio.currentTime=Math.max(0,audio.currentTime-5);});
  $('queueBtn').addEventListener('click',()=>$('queuePanel').classList.toggle('open')); $('closeQueueBtn').addEventListener('click',()=>$('queuePanel').classList.remove('open'));
  $('clearQueueBtn').addEventListener('click',()=>{state.queue=[];updateQueue();});
  $('createPlaylistBtn').addEventListener('click',()=>$('playlistDialog').showModal());
  $('playlistForm').addEventListener('submit',e=>{e.preventDefault();const name=$('playlistName').value.trim();if(name){createPlaylist(name);$('playlistDialog').close();$('playlistName').value='';}});
  $('searchInput').addEventListener('input',e=>{const q=e.target.value; if(q.trim()){renderSearch(q);showView('search');}else showView('home');});
  $('featuredPlayBtn').addEventListener('click',()=>setTrack(allTracks()[0]));
  $('settingsBtn').addEventListener('click',()=>showToast('Settings are coming in a future update.'));
  $('backBtn').addEventListener('click',()=>showView('home')); $('forwardBtn').addEventListener('click',()=>showView('explore'));
  document.addEventListener('click',e=>{
    const action=e.target.closest('[data-action]'); if(action){const id=action.dataset.id; if(action.dataset.action==='play')setTrack(trackById(id)); if(action.dataset.action==='like')toggleFavorite(id); if(action.dataset.action==='queue'){if(state.activeView==='playlist')addTrackToPlaylist(id);else addToQueue(id);}return;}
    const album=e.target.closest('[data-album]'); if(album){const first=albumData[Number(album.dataset.album)].tracks[0];setTrack({...first,albumIndex:Number(album.dataset.album),trackIndex:0,cover:albumData[Number(album.dataset.album)].cover});showView('explore');$('albumFilters').querySelectorAll('.filter-chip').forEach(b=>b.classList.toggle('active',b.dataset.filter===album.dataset.album));renderExplore(album.dataset.album);return;}
    const filter=e.target.closest('[data-filter]'); if(filter){$('albumFilters').querySelectorAll('.filter-chip').forEach(b=>b.classList.toggle('active',b===filter));renderExplore(filter.dataset.filter);return;}
    const nav=e.target.closest('[data-view]'); if(nav){showView(nav.dataset.view);return;}
    const link=e.target.closest('[data-view-link]'); if(link){showView(link.dataset.viewLink);return;}
    const playlist=e.target.closest('[data-playlist]'); if(playlist){renderCustomPlaylist(playlist.dataset.playlist);return;}
    const remove=e.target.closest('[data-remove-queue]'); if(remove){state.queue=state.queue.filter(id=>id!==remove.dataset.removeQueue);updateQueue();}
  });
  audio.addEventListener('timeupdate',()=>{const pct=audio.duration?audio.currentTime/audio.duration*100:0;$('progressFill').style.width=`${pct}%`;$('currentTime').textContent=formatTime(audio.currentTime);$('durationTime').textContent=formatTime(audio.duration);$('progressBar').setAttribute('aria-valuenow',Math.round(pct));});
  audio.addEventListener('loadedmetadata',()=>$('durationTime').textContent=formatTime(audio.duration));
  audio.addEventListener('play',()=>{$('playBtn').innerHTML='<i class="fa-solid fa-pause"></i>';$('visualizer').classList.add('playing');renderActiveRows();});
  audio.addEventListener('pause',()=>{$('playBtn').innerHTML='<i class="fa-solid fa-play"></i>';$('visualizer').classList.remove('playing');renderActiveRows();});
  audio.addEventListener('ended',()=>{if(state.repeatMode==='one'){audio.currentTime=0;play();}else playNext();});
  audio.addEventListener('error',()=>showToast('Audio file not found. Check the music/ folder and filename.'));
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('searchInput').focus();}if(e.code==='Space'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();togglePlay();}});
}
function init() {
  renderAlbums(); renderFavorites(); renderRecent(); renderLibrary(); updateQueue(); initEvents();
  const first=allTracks()[0]; if(first){state.albumIndex=first.albumIndex;state.trackIndex=first.trackIndex;audio.src=first.src;$('miniTitle').textContent=first.title;$('miniArtist').textContent=first.artist;$('miniCover').innerHTML=`<img src="${escapeHTML(first.cover)}" alt="">`;}
}
init();
