// Chiptuning oldal specifikus JavaScript funkciók

// Hanglejátszási funkció
let currentAudio = null;

function playAudio(audioId) {
    const audio = document.getElementById(audioId);
    if (!audio) return;
    
    // Ha ugyanaz a hang van kiválasztva és éppen játszik, megállítjuk
    if (currentAudio && currentAudio.id === audioId && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        updatePlayButton(audioId, false);
        currentAudio = null;
        return;
    }
    
    // Megállítjuk az aktuálisan lejátszott hangot, ha van és más
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        updatePlayButton(currentAudio.id, false);
    }
    
    // Új hang lejátszása
    currentAudio = audio;
    updatePlayButton(audioId, true);
    
    audio.play().then(() => {
        console.log('Audio playing:', audioId);
    }).catch(error => {
        console.error('Error playing audio:', error);
        updatePlayButton(audioId, false);
        currentAudio = null;
    });
    
    // Eseménykezelők beállítása (csak egyszer)
    if (!audio.hasEventListeners) {
        audio.addEventListener('ended', function() {
            updatePlayButton(audioId, false);
            currentAudio = null;
        });
        
        audio.addEventListener('pause', function() {
            updatePlayButton(audioId, false);
        });
        
        audio.hasEventListeners = true;
    }
}

function updatePlayButton(audioId, isPlaying) {
    const button = document.querySelector(`button[onclick="playAudio('${audioId}')"]`);
    if (button) {
        const icon = button.querySelector('i');
        if (icon) {
            if (isPlaying) {
                icon.className = 'fas fa-pause text-sm';
                button.classList.add('bg-green-600', 'hover:bg-green-700');
                button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            } else {
                icon.className = 'fas fa-play text-sm';
                button.classList.add('bg-blue-600', 'hover:bg-blue-700');
                button.classList.remove('bg-green-600', 'hover:bg-green-700');
            }
        }
    }
}