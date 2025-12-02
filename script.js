document.addEventListener('DOMContentLoaded', (event) => {
    // --- VARIABEL GLOBAL DAN ELEMEN ---
    const openBtn = document.getElementById('open-invitation-btn');
    const coverPage = document.getElementById('cover-page');
    const mainContent = document.getElementById('main-content');
    const bottomNavbar = document.getElementById('bottom-navbar'); 
    const audio = document.getElementById('background-music');
    const guestNameDisplay = document.getElementById('guest-name-display');
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpMessage = document.getElementById('rsvp-message');
    const guestbookList = document.getElementById('guestbook-list');
    const weddingDate = new Date("Dec 28, 2025 09:00:00").getTime(); 
    
    // VARIABEL KHUSUS MUSIK (BARU)
    const musicControl = document.getElementById('music-control');
    const toggleMusicBtn = document.getElementById('toggle-music-btn');
    const musicIcon = document.getElementById('music-icon');
    let isPlaying = false; 

    // --- DATA UCAPAN (INITIAL & LOCAL STORAGE) ---
    let guestComments = [
        { name: "Mawan & Uut", status: "Pengantin", message: "Kami yang berbahagia menanti kehadiran Anda!" },
        { name: "Keluarga Bapak Samsudin", status: "Hadir", message: "Semoga lancar dan penuh berkah." },
    ];
    
    // --- UTILITY FUNCTIONS ---

    function loadComments() {
        const storedComments = localStorage.getItem('weddingGuestComments');
        if (storedComments) {
            guestComments = JSON.parse(storedComments); 
        }
    }

    function saveComments() {
        localStorage.setItem('weddingGuestComments', JSON.stringify(guestComments));
    }

    function renderComments() {
        if (!guestbookList) return; 

        guestbookList.innerHTML = ''; 
        
        for (let i = guestComments.length - 1; i >= 0; i--) {
            const comment = guestComments[i];
            
            const commentCard = document.createElement('div');
            commentCard.classList.add('comment-card');
            
            let statusText = comment.status;
            let statusClass = '';

            if (comment.status === 'Hadir') {
                statusClass = 'status-hadir';
            } else if (comment.status === 'Tidak Hadir') {
                statusClass = 'status-tidak-hadir';
            } else if (comment.status === 'Pengantin') {
                statusClass = 'status-pengantin'; 
            }
            
            commentCard.innerHTML = `
                <div class="comment-header">
                    <span class="comment-name">${comment.name}</span>
                    <span class="comment-status ${statusClass}">${statusText}</span>
                </div>
                <p class="comment-message">${comment.message}</p>
            `;
            guestbookList.appendChild(commentCard);
        }
        
        if (guestComments.length === 0) {
             guestbookList.innerHTML = '<p class="no-comment">Jadilah tamu pertama yang mengirimkan doa dan ucapan!</p>';
        }
    }


    // --- 1. LOGIC NAMA TAMU & PENGISIAN OTOMATIS FORM ---
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function getGuestNameFromUrl() {
        const guestNameParam = getParameterByName('to') || getParameterByName('invite');
        const nameInput = document.getElementById('name');

        if (guestNameParam) {
            guestNameDisplay.textContent = guestNameParam; 
            
            if (nameInput) {
                 nameInput.value = guestNameParam;
            }
        } 
    }
    
    // --- KONTROL MUSIK: Update Ikon (BARU) ---
    function updateMusicIcon() {
        if (isPlaying) {
            // Ikon Volume (Music On)
            musicIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
        } else {
            // Ikon Mute (Music Off)
            musicIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
        }
    }


    // --- 2. LOGIC BUKA UNDANGAN & MENAMPILKAN KONTROL ---
    openBtn.addEventListener('click', () => {
        coverPage.style.opacity = '0';

        setTimeout(() => {
            coverPage.style.display = 'none';
            mainContent.classList.remove('hidden');
            bottomNavbar.classList.remove('hidden'); 
            musicControl.classList.remove('hidden'); // TAMPILKAN KONTROL MUSIK
            window.scrollTo(0, 0);

            audio.play().catch(error => {
                console.log('Autoplay dicegah oleh browser.');
            });
        }, 1000); 
    });


    // Logic Tombol Play/Pause (BARU)
    if (toggleMusicBtn) {
        toggleMusicBtn.addEventListener('click', function() {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(e => console.log("Gagal Play audio"));
            }
        });
    }

    // Sinkronisasi status Play/Pause (BARU)
    if (audio) {
        audio.addEventListener('play', () => {
            isPlaying = true;
            updateMusicIcon();
        });
        audio.addEventListener('pause', () => {
            isPlaying = false;
            updateMusicIcon();
        });
    }


    // --- 3. LOGIC COUNTDOWN TIMER ---
    const countdownFunction = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (document.getElementById("days")) {
             document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
             document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
             document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
             document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');
        }

        if (distance < 0) {
            clearInterval(countdownFunction);
            if (document.getElementById("timer")) {
                document.getElementById("timer").innerHTML = "<h4>Acara Telah Selesai</h4>";
            }
        }
    }, 1000);


    // --- 4. LOGIC RSVP (TANPA WA - SIMPAN LOKAL) ---
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const name = document.getElementById('name').value;
            const status = document.getElementById('status').value;
            const message = document.getElementById('message').value;
            
            if (status && name.trim() !== '') {
                const newComment = { name: name, status: status, message: message };
                guestComments.push(newComment); 

                saveComments(); 
                renderComments();

                rsvpMessage.style.display = 'block';
                rsvpForm.reset();
                
                document.getElementById('guestbook').scrollIntoView({ behavior: 'smooth' });

                setTimeout(() => {
                    rsvpMessage.style.display = 'none';
                }, 5000);
            } else {
                alert('Mohon lengkapi Nama dan Status kehadiran Anda.');
            }
        });
    }


    // --- INISIALISASI SAAT DOM SIAP ---
    getGuestNameFromUrl(); 
    loadComments();
    renderComments(); 
    updateMusicIcon(); // Panggil updateIcon untuk menampilkan ikon awal yang benar.
});