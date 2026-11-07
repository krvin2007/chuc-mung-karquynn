/* ========================================================
   🌸 JAVASCRIPT TƯƠNG TÁC CHO TRANG CHÚC MỪNG KARQUYNN 🌸
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. HIỆU ỨNG CÁNH HOA ĐÀO RƠI (CANVAS PETALS) ---
  const canvas = document.getElementById('petal-canvas');
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const TOTAL_PETALS = 35;
  const petalColors = ['#FFCCD5', '#FFE5EC', '#FFB3C6', '#FDE2E4', '#FFF0F3'];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 9 + 7;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.5;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.opacity = Math.random() * 0.5 + 0.4;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      this.swayAngle += this.swaySpeed;
      this.x += this.speedX + Math.sin(this.swayAngle) * 0.7;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, -this.size / 4, this.size, 0);
      ctx.bezierCurveTo(this.size, this.size / 2, this.size / 2, this.size, 0, this.size);
      ctx.bezierCurveTo(-this.size / 2, this.size / 2, -this.size / 4, 0, 0, 0);
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_PETALS; i++) {
    petals.push(new Petal());
  }

  function animatePetals() {
    ctx.clearRect(0, 0, width, height);
    for (let petal of petals) {
      petal.update();
      petal.draw();
    }
    requestAnimationFrame(animatePetals);
  }
  animatePetals();


  // --- 2. HỘP NHẠC TỔNG HỢP WEB AUDIO API (GENTLE MUSIC BOX) ---
  let audioCtx = null;
  let isPlaying = false;
  let musicTimer = null;
  const musicController = document.getElementById('musicController');
  const vinylDisc = document.getElementById('vinylDisc');
  const musicLabel = document.getElementById('musicLabel');

  // Giai điệu nhẹ nhàng chúc mừng (nốt nhạc & tần số Hz)
  const notes = [
    523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50 // C5, D5, E5, F5, G5, A5, B5, C6
  ];
  // Chuỗi giai điệu ngọt ngào, trong trẻo
  const melody = [
    { n: 2, d: 400 }, { n: 4, d: 400 }, { n: 5, d: 600 }, { n: 4, d: 400 },
    { n: 2, d: 400 }, { n: 0, d: 600 }, { n: 1, d: 400 }, { n: 2, d: 400 },
    { n: 4, d: 800 }, { n: 3, d: 400 }, { n: 2, d: 400 }, { n: 1, d: 600 },
    { n: 4, d: 400 }, { n: 7, d: 600 }, { n: 5, d: 400 }, { n: 4, d: 800 }
  ];
  let currentNoteIndex = 0;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playMusicBoxChime(freq, duration = 0.8) {
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Giả lập âm thanh hộp nhạc (sine wave với decay mượt)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  function playChimeArpeggio() {
    // Âm thanh ngân vang khi mở thư
    initAudio();
    const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chords.forEach((note, idx) => {
      setTimeout(() => playMusicBoxChime(note, 1.2), idx * 120);
    });
  }

  function playNextMelodyNote() {
    if (!isPlaying) return;
    const item = melody[currentNoteIndex];
    playMusicBoxChime(notes[item.n], 0.9);
    currentNoteIndex = (currentNoteIndex + 1) % melody.length;
    musicTimer = setTimeout(playNextMelodyNote, item.d + 150);
  }

  function toggleMusic() {
    initAudio();
    if (isPlaying) {
      isPlaying = false;
      clearTimeout(musicTimer);
      vinylDisc.classList.remove('playing');
      musicLabel.textContent = "Nhấn để bật nhạc";
    } else {
      isPlaying = true;
      vinylDisc.classList.add('playing');
      musicLabel.textContent = "Đang phát êm dịu 🎵";
      playNextMelodyNote();
    }
  }

  musicController.addEventListener('click', toggleMusic);


  // --- 3. MÀN MỞ THƯ BÍ MẬT (ENVELOPE OPENING) ---
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const envelopeCard = document.getElementById('envelopeCard');
  const waxSeal = document.getElementById('waxSeal');
  const openBtn = document.getElementById('openBtn');

  function openEnvelope() {
    envelopeCard.classList.add('is-opening');
    playChimeArpeggio();

    // Bắn một loạt hoa & tim chúc mừng
    triggerCelebrationBurst(window.innerWidth / 2, window.innerHeight / 2);

    setTimeout(() => {
      envelopeOverlay.classList.add('opened');
      // Tự động bật nhạc nhẹ sau khi mở thư
      if (!isPlaying) {
        toggleMusic();
      }
    }, 1100);
  }

  waxSeal.addEventListener('click', openEnvelope);
  openBtn.addEventListener('click', openEnvelope);


  // --- 4. CHUYỂN ĐỔI BỐ CỤC GHÉP ẢNH (LAYOUT SWITCHER) ---
  const switchBtns = document.querySelectorAll('.switch-btn');
  const photoContainer = document.getElementById('photoContainer');

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const style = btn.getAttribute('data-style');
      photoContainer.className = 'photo-display-container style-' + style;
      
      // Hiệu ứng nhẹ khi đổi style
      photoContainer.style.transform = 'scale(0.98)';
      setTimeout(() => {
        photoContainer.style.transform = 'scale(1)';
      }, 150);
    });
  });


  // --- 5. LIGHTBOX PHÓNG TO ẢNH POLAROID ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  function showLightbox(imgSrc, caption) {
    lightboxImg.src = imgSrc;
    lightboxCaption.textContent = caption;
    lightboxModal.classList.add('active');
  }

  function hideLightbox() {
    lightboxModal.classList.remove('active');
  }

  document.getElementById('cardOne').addEventListener('click', () => {
    showLightbox('photo1.jpg', document.getElementById('captionText1').textContent);
  });

  document.getElementById('cardTwo').addEventListener('click', () => {
    showLightbox('photo2.jpg', document.getElementById('captionText2').textContent);
  });

  lightboxClose.addEventListener('click', hideLightbox);
  lightboxOverlay.addEventListener('click', hideLightbox);


  // --- 6. NÚT THẢ TIM BẮN HOA & THÔNG ĐIỆP NGỌT NGÀO ---
  const heartBlastBtn = document.getElementById('heartBlastBtn');
  const cheerCounter = document.getElementById('cheerCounter');
  const cheerToast = document.getElementById('cheerToast');

  let cheerCount = parseInt(localStorage.getItem('karquynn_cheers') || '999', 10);
  cheerCounter.textContent = cheerCount;

  const compliments = [
    "Karquynn đi làm vui vẻ và suôn sẻ nha! 🌸",
    "Tự hào về Karquynn lắm luôn! 💖",
    "Xinh đẹp, giỏi giang, 10 điểm không có nhưng! ✨",
    "Khởi đầu mới thuận buồm xuôi gió! 🚀",
    "Đồng nghiệp ai cũng quý mến Karquynn! 🌷",
    "Mọi nỗ lực của cậu đều nở hoa rực rỡ! 🎀",
    "Karquynn là cô gái tuyệt vời nhất hôm nay! 👑",
    "Tự tin tỏa sáng trên con đường mới nhé! 💼"
  ];

  function triggerCelebrationBurst(originX, originY) {
    const emojis = ['💖', '🌸', '✨', '🎀', '🌷', '⭐', '💼', '💐'];
    const count = 16;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-heart-particle';
      particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      
      const x = originX + (Math.random() - 0.5) * 80;
      const y = originY + (Math.random() - 0.5) * 40;
      const tx = (Math.random() - 0.5) * 200;
      const rot = (Math.random() - 0.5) * 90;
      const size = Math.random() * 12 + 20;

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.fontSize = `${size}px`;
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--rot', `${rot}deg`);

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 2200);
    }
  }

  let toastTimeout = null;
  function showToastMessage() {
    const randomMsg = compliments[Math.floor(Math.random() * compliments.length)];
    cheerToast.textContent = randomMsg;
    cheerToast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      cheerToast.classList.remove('show');
    }, 2800);
  }

  heartBlastBtn.addEventListener('click', (e) => {
    cheerCount += 1;
    cheerCounter.textContent = cheerCount;
    localStorage.setItem('karquynn_cheers', cheerCount);

    const rect = heartBlastBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    triggerCelebrationBurst(x, y);
    showToastMessage();

    // Âm thanh nốt nhạc lấp lánh khi bấm
    if (audioCtx) {
      playMusicBoxChime(880 + Math.random() * 200, 0.4);
    }
  });


  // --- 7. HIỆU ỨNG CON TRỎ CHUỘT LẤP LÁNH (SPARKLE TRAILS) ---
  let lastSparkleTime = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkleTime > 75) {
      lastSparkleTime = now;
      const sparkle = document.createElement('div');
      sparkle.className = 'cursor-sparkle';
      const sparkIcons = ['✨', '🌸', '💖', '⭐'];
      sparkle.textContent = sparkIcons[Math.floor(Math.random() * sparkIcons.length)];
      sparkle.style.left = `${e.clientX - 8}px`;
      sparkle.style.top = `${e.clientY - 8}px`;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 700);
    }
  });


  // --- 8. TÙY CHỈNH THÔNG TIN TRỰC TIẾP (EDIT MODAL) ---
  const editModal = document.getElementById('editModal');
  const editLetterBtn = document.getElementById('editLetterBtn');
  const closeEditModal = document.getElementById('closeEditModal');
  const saveEditBtn = document.getElementById('saveEditBtn');

  const inputRecipient = document.getElementById('inputRecipient');
  const inputCaption1 = document.getElementById('inputCaption1');
  const inputCaption2 = document.getElementById('inputCaption2');
  const inputTextLetter = document.getElementById('inputTextLetter');
  const inputSender = document.getElementById('inputSender');

  // Load saved custom text if any
  const savedData = JSON.parse(localStorage.getItem('karquynn_celebration_data') || '{}');
  if (savedData.recipient) {
    document.getElementById('recipientName').textContent = savedData.recipient;
  }
  if (savedData.caption1) {
    document.getElementById('captionText1').textContent = savedData.caption1;
  }
  if (savedData.caption2) {
    document.getElementById('captionText2').textContent = savedData.caption2;
  }
  if (savedData.sender) {
    document.getElementById('senderName').textContent = savedData.sender;
  }

  editLetterBtn.addEventListener('click', () => {
    inputRecipient.value = document.getElementById('recipientName').textContent;
    inputCaption1.value = document.getElementById('captionText1').textContent;
    inputCaption2.value = document.getElementById('captionText2').textContent;
    inputSender.value = document.getElementById('senderName').textContent;
    inputTextLetter.value = document.getElementById('letterBodyContent').innerText.trim();
    editModal.classList.add('active');
  });

  closeEditModal.addEventListener('click', () => {
    editModal.classList.remove('active');
  });

  saveEditBtn.addEventListener('click', () => {
    if (inputRecipient.value) {
      document.getElementById('recipientName').textContent = inputRecipient.value;
    }
    if (inputCaption1.value) {
      document.getElementById('captionText1').textContent = inputCaption1.value;
    }
    if (inputCaption2.value) {
      document.getElementById('captionText2').textContent = inputCaption2.value;
    }
    if (inputSender.value) {
      document.getElementById('senderName').textContent = inputSender.value;
    }
    if (inputTextLetter.value) {
      // Split paragraphs
      const paras = inputTextLetter.value.split('\n\n');
      let html = '';
      paras.forEach(p => {
        if (p.trim()) html += `<p>${p.trim()}</p>`;
      });
      document.getElementById('letterBodyContent').innerHTML = html;
    }

    // Save to localStorage
    const toSave = {
      recipient: inputRecipient.value,
      caption1: inputCaption1.value,
      caption2: inputCaption2.value,
      sender: inputSender.value
    };
    localStorage.setItem('karquynn_celebration_data', JSON.stringify(toSave));

    editModal.classList.remove('active');
    triggerCelebrationBurst(window.innerWidth / 2, window.innerHeight / 2);
  });


  // --- 9. TƯƠNG TÁC CHECKLIST HÀNH TRÌNH ---
  const firstDayCheckItem = document.getElementById('firstDayCheckItem');
  const checkIcon = document.getElementById('checkIcon');
  if (firstDayCheckItem && checkIcon) {
    firstDayCheckItem.addEventListener('click', () => {
      if (!firstDayCheckItem.classList.contains('completed')) {
        firstDayCheckItem.classList.add('completed');
        checkIcon.textContent = '✔';
        triggerCelebrationBurst(window.innerWidth / 2, window.innerHeight / 2);
        if (audioCtx) playChimeArpeggio();
      } else {
        firstDayCheckItem.classList.remove('completed');
        checkIcon.textContent = '◻';
      }
    });
  }


  // --- 10. LÁ BÀI MAY MẮN CHO CÔNG VIỆC MỚI (LUCKY CAREER CARD) ---
  const fortuneCardWrapper = document.getElementById('fortuneCardWrapper');
  const fortuneCardInner = document.getElementById('fortuneCardInner');
  const fortuneMessage = document.getElementById('fortuneMessage');
  const drawAgainBtn = document.getElementById('drawAgainBtn');

  const fortuneList = [
    "“Karquynn hãy tự tin nhé! Sự chân thành, thông minh và dịu dàng của cậu sẽ chinh phục tất cả mọi người ở môi trường mới!” 🌸",
    "“Mỗi ngày đi làm là một niềm vui mới. Karquynn sẽ học hỏi nhanh chóng và sớm gặt hái nhiều thành công rực rỡ!” ✨",
    "“Đồng nghiệp mới sẽ cực kỳ quý mến nụ cười và tinh thần nhiệt huyết của Karquynn!” 💖",
    "“Cậu đã rất xuất sắc khi giành được vị trí này, cứ ngẩng cao đầu và vững bước nhé!” 👑",
    "“May mắn và thuận lợi sẽ luôn đồng hành cùng Karquynn trên mọi dự án sắp tới!” 🍀💼"
  ];

  if (fortuneCardInner) {
    fortuneCardInner.addEventListener('click', (e) => {
      if (e.target === drawAgainBtn) return;
      if (!fortuneCardInner.classList.contains('is-flipped')) {
        fortuneCardInner.classList.add('is-flipped');
        if (audioCtx) playMusicBoxChime(1046.50, 0.5);
      }
    });
  }

  if (drawAgainBtn) {
    drawAgainBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const randomMsg = fortuneList[Math.floor(Math.random() * fortuneList.length)];
      fortuneMessage.textContent = randomMsg;
      fortuneCardInner.classList.remove('is-flipped');
      setTimeout(() => {
        fortuneCardInner.classList.add('is-flipped');
        if (audioCtx) playMusicBoxChime(1174.66, 0.5);
      }, 300);
    });
  }


  // --- 11. BẢNG GHI CHÚ LỜI CHÚC DÁN GIẤY (WISHES WALL) ---
  const addWishBtn = document.getElementById('addWishBtn');
  const newWishInput = document.getElementById('newWishInput');
  const newWishAuthor = document.getElementById('newWishAuthor');
  const wishesGrid = document.getElementById('wishesGrid');

  const noteColors = ['note-pink', 'note-yellow', 'note-green', 'note-purple'];

  if (addWishBtn && newWishInput && wishesGrid) {
    addWishBtn.addEventListener('click', () => {
      const text = newWishInput.value.trim();
      const author = newWishAuthor.value.trim() || 'Người bạn giấu tên 🌸';

      if (!text) {
        newWishInput.focus();
        return;
      }

      const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];
      const randomRotate = (Math.random() * 6 - 3).toFixed(1);

      const note = document.createElement('div');
      note.className = `sticky-note ${randomColor}`;
      note.style.transform = `rotate(${randomRotate}deg)`;
      note.innerHTML = `
        <div class="note-pin">📍</div>
        <p class="note-text">“${text}”</p>
        <span class="note-author">— ${author}</span>
      `;

      wishesGrid.appendChild(note);
      newWishInput.value = '';
      newWishAuthor.value = '';

      const rect = note.getBoundingClientRect();
      triggerCelebrationBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
      if (audioCtx) playMusicBoxChime(783.99, 0.4);
    });
  }

});

