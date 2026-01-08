// Inisialisasi variabel global
let queueHistory = [];
let currentQueueNumber = 1;
let currentQueueType = 'A';
let operators = [
    { id: 1, name: "Operator 1", room: "Ruang A1", status: "available", currentQueue: null },
    { id: 2, name: "Operator 2", room: "Ruang A2", status: "available", currentQueue: null },
    { id: 3, name: "Operator 3", room: "Ruang B1", status: "available", currentQueue: null },
    { id: 4, name: "Operator 4", room: "Ruang B2", status: "available", currentQueue: null },
    { id: 5, name: "Operator 5", room: "Ruang C1", status: "available", currentQueue: null },
    { id: 6, name: "Operator 6", room: "Ruang C2", status: "available", currentQueue: null },
    { id: 7, name: "Operator 7", room: "Ruang D1", status: "available", currentQueue: null },
    { id: 8, name: "Operator 8", room: "Ruang D2", status: "available", currentQueue: null }
];

// Inisialisasi Web Speech API
let speechSynthesis = window.speechSynthesis;
let voices = [];
let indonesianVoice = null;

// Variabel untuk audio
let announcementAudio;
let isAudioInitialized = false;

// Fungsi untuk mengatur tanggal dan waktu
function updateDateTime() {
    const now = new Date();
    
    // Format tanggal: Hari, Tanggal Bulan Tahun
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('id-ID', optionsDate);
    document.getElementById('current-date').textContent = formattedDate;
    
    // Format waktu: HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('current-time').textContent = `${hours}:${minutes}:${seconds}`;
    
    // Update tahun di footer
    document.getElementById('current-year').textContent = now.getFullYear();
}

// Fungsi untuk inisialisasi audio
function initializeAudio() {
    // Buat elemen audio secara dinamis
    announcementAudio = new Audio();
    
    // URL suara panggilan bandara (alternatif yang lebih reliable)
    const audioUrls = [
        "https://assets.mixkit.co/sfx/preview/mixkit-airport-announcement-1135.mp3",
        "https://www.soundjay.com/buttons/beep-07.wav", // fallback
        "https://www.soundjay.com/communication/telephone-ring-03a.wav" // fallback kedua
    ];
    
    announcementAudio.src = audioUrls[0];
    announcementAudio.preload = "auto";
    announcementAudio.volume = 1.0;
    
    // Coba preload audio
    announcementAudio.load();
    
    isAudioInitialized = true;
    console.log("Audio initialized successfully");
}

// Fungsi untuk memuat suara yang tersedia
function loadVoices() {
    voices = speechSynthesis.getVoices();
    
    console.log("Available voices:", voices.length);
    
    // Cari suara perempuan bahasa Indonesia
    indonesianVoice = voices.find(voice => 
        voice.lang === 'id-ID' && voice.name.toLowerCase().includes('female')
    );
    
    // Jika tidak ditemukan suara Indonesia, cari suara Indonesia umum
    if (!indonesianVoice) {
        indonesianVoice = voices.find(voice => voice.lang === 'id-ID');
    }
    
    // Jika tidak ditemukan suara Indonesia, gunakan suara Inggris perempuan
    if (!indonesianVoice) {
        indonesianVoice = voices.find(voice => 
            voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
        );
    }
    
    // Jika tidak ditemukan suara Inggris perempuan, cari suara Inggris
    if (!indonesianVoice) {
        indonesianVoice = voices.find(voice => voice.lang.startsWith('en'));
    }
    
    // Jika tetap tidak ditemukan, gunakan suara pertama yang tersedia
    if (!indonesianVoice && voices.length > 0) {
        indonesianVoice = voices[0];
    }
    
    console.log("Selected voice:", indonesianVoice ? indonesianVoice.name : "No voice available");
}

// Fungsi untuk memanggil antrian dengan suara
function callQueueWithVoice(queueNumber, operatorName) {
    console.log(`Calling queue: ${queueNumber} for ${operatorName}`);
    
    // Hentikan suara yang sedang berlangsung
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        console.log("Cancelled previous speech");
    }
    
    // Mainkan suara panggilan bandara terlebih dahulu
    const playAnnouncement = () => {
        if (!isAudioInitialized) {
            initializeAudio();
        }
        
        announcementAudio.currentTime = 0;
        announcementAudio.play().then(() => {
            console.log("Announcement sound playing");
            
            // Setelah suara bandara selesai, ucapkan nomor antrian
            announcementAudio.onended = () => {
                console.log("Announcement sound ended, starting speech");
                speakQueueNumber(queueNumber, operatorName);
            };
            
        }).catch(error => {
            console.log("Announcement audio error:", error);
            // Jika audio gagal, langsung ucapkan nomor antrian
            speakQueueNumber(queueNumber, operatorName);
        });
    };
    
    // Fungsi untuk mengucapkan nomor antrian
    const speakQueueNumber = (queueNum, operator) => {
        // Format nomor antrian untuk pengucapan (misal: A001 menjadi "A nol nol satu")
        const queueForSpeech = queueNum.replace(/(\d)/g, ' $1 ').replace(/ 0/g, ' nol');
        
        // Buat teks untuk diucapkan
        const speechText = `Nomor antrian ${queueForSpeech
    
    // Validasi nomor antrian
    if (isNaN(queueNumber) || queueNumber < 1) {
        alert('Nomor antrian tidak valid!');
        return;
    }
    
    // Format nomor antrian (contoh: A001)
    const formattedQueueNumber = `${queueType}${queueNumber.toString().padStart(3, '0')}`;
    
    // Temukan operator yang dipilih
    const selectedOperator = operators.find(op => op.id === operatorId);
    
    if (!selectedOperator) {
        alert('Operator tidak ditemukan!');
        return;
    }
    
    // Update status operator menjadi sibuk
    selectedOperator.status = "busy";
    selectedOperator.currentQueue = formattedQueueNumber;
    
    // Update tampilan antrian saat ini
    document.getElementById('display-queue-number').textContent = formattedQueueNumber;
    document.getElementById('display-operator').textContent = `${selectedOperator.name} - ${selectedOperator.room}`;
    
    const now = new Date();
    const callTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    document.getElementById('display-time').textContent = `Dipanggil: ${callTime}`;
    
    // Tambahkan ke riwayat pemanggilan
    const historyItem = {
        queue: formattedQueueNumber,
        operator: `${selectedOperator.name} - ${selectedOperator.room}`,
        time: callTime,
        timestamp: now.getTime()
    };
    
    queueHistory.unshift(historyItem); // Tambahkan di awal array
    updateHistoryDisplay();
    
    // Update tampilan operator
    updateOperatorsDisplay();
    
    // Panggil antrian dengan suara
    callQueueWithVoice(formattedQueueNumber, `${selectedOperator.name} - ${selectedOperator.room}`);
    
    // Auto-increment untuk antrian berikutnya
    document.getElementById('queue-number').value = queueNumber + 1;
}

// Fungsi untuk antrian berikutnya
function nextQueue() {
    // Reset operator yang sibuk
    const busyOperators = operators.filter(op => op.status === "busy");
    
    if (busyOperators.length > 0) {
        // Reset operator pertama yang sibuk (bisa disesuaikan dengan logika yang lebih kompleks)
        busyOperators[0].status = "available";
        busyOperators[0].currentQueue = null;
        
        // Update tampilan operator
        updateOperatorsDisplay();
        
        // Reset tampilan antrian saat ini jika operator ini yang sedang ditampilkan
        const currentDisplay = document.getElementById('display-operator').textContent;
        if (currentDisplay.includes(busyOperators[0].name)) {
            document.getElementById('display-queue-number').textContent = "A001";
            document.getElementById('display-operator').textContent = "Operator 1 - Ruang A1";
            document.getElementById('display-time').textContent = "Dipanggil: 00:00:00";
        }
    } else {
        alert("Tidak ada operator yang sedang sibuk.");
    }
}

// Fungsi untuk reset antrian
function resetQueue() {
    if (confirm("Apakah Anda yakin ingin mereset seluruh sistem antrian? Riwayat akan dihapus.")) {
        // Reset semua operator
        operators.forEach(op => {
            op.status = "available";
            op.currentQueue = null;
        });
        
        // Reset riwayat
        queueHistory = [];
        
        // Reset tampilan
        document.getElementById('display-queue-number').textContent = "A001";
        document.getElementById('display-operator').textContent = "Operator 1 - Ruang A1";
        document.getElementById('display-time').textContent = "Dipanggil: 00:00:00";
        
        document.getElementById('queue-number').value = 1;
        document.getElementById('queue-type').value = "A";
        document.getElementById('operator').value = "1";
        
        // Update tampilan
        updateHistoryDisplay();
        updateOperatorsDisplay();
        
        // Hentikan suara yang sedang berlangsung
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        
        alert("Sistem antrian telah direset.");
    }
}

// Fungsi untuk memperbarui tampilan riwayat
function updateHistoryDisplay() {
    const historyContainer = document.getElementById('history-container');
    
    if (queueHistory.length === 0) {
        historyContainer.innerHTML = '<p class="empty-history">Belum ada riwayat pemanggilan</p>';
        return;
    }
    
    let historyHTML = '';
    
    queueHistory.slice(0, 10).forEach(item => { // Tampilkan hanya 10 riwayat terbaru
        historyHTML += `
            <div class="history-item">
                <div class="history-queue">${item.queue}</div>
                <div class="history-operator">${item.operator}</div>
                <div class="history-time">${item.time}</div>
            </div>
        `;
    });
    
    historyContainer.innerHTML = historyHTML;
}

// Fungsi untuk memperbarui tampilan status operator
function updateOperatorsDisplay() {
    const operatorsGrid = document.getElementById('operators-grid');
    
    let operatorsHTML = '';
    
    operators.forEach(operator => {
        const statusClass = operator.status === "available" ? "available" : "busy";
        const statusText = operator.status === "available" ? "Tersedia" : "Sibuk";
        const currentQueueInfo = operator.currentQueue ? `Antrian: ${operator.currentQueue}` : "Tidak ada antrian";
        
        operatorsHTML += `
            <div class="operator-card ${statusClass}">
                <div class="operator-icon">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div class="operator-info">
                    <h4>${operator.name}</h4>
                    <div class="operator-status ${statusClass}">${statusText}</div>
                    <div class="operator-current">${currentQueueInfo}</div>
                    <div class="operator-room">${operator.room}</div>
                </div>
            </div>
        `;
    });
    
    operatorsGrid.innerHTML = operatorsHTML;
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Update tanggal dan waktu setiap detik
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Inisialisasi suara
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Load voices awal
    loadVoices();
    
    // Setup tombol
    document.getElementById('call-btn').addEventListener('click', callQueue);
    document.getElementById('next-btn').addEventListener('click', nextQueue);
    document.getElementById('reset-btn').addEventListener('click', resetQueue);
    
    // Setup event untuk memanggil antrian dengan Enter pada input nomor
    document.getElementById('queue-number').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            callQueue();
        }
    });
    
    // Inisialisasi tampilan operator
    updateOperatorsDisplay();
    
    // Inisialisasi riwayat
    updateHistoryDisplay();
    
    // Tambahkan data riwayat contoh untuk demonstrasi
    const exampleTime = new Date();
    exampleTime.setMinutes(exampleTime.getMinutes() - 5);
    const exampleTimeStr = `${exampleTime.getHours().toString().padStart(2, '0')}:${exampleTime.getMinutes().toString().padStart(2, '0')}:${exampleTime.getSeconds().toString().padStart(2, '0')}`;
    
    queueHistory.push({
        queue: "A001",
        operator: "Operator 1 - Ruang A1",
        time: exampleTimeStr,
        timestamp: exampleTime.getTime()
    });
    
    updateHistoryDisplay();
});