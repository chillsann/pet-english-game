// PET英语学习游戏 - 发音系统（已修复 Chrome 无声问题）
document.addEventListener('DOMContentLoaded', function () {

    // ===== 新增：必须用户先点击页面，才能解锁声音 =====
    let userInteracted = false;

    document.body.addEventListener('click', function unlockAudio() {
        userInteracted = true;
        if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
        document.body.removeEventListener('click', unlockAudio);
    }, { once: true });

    // 语音识别
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isRecording = false;
    let mediaRecorder = null;
    let audioChunks = [];

    // 初始化语音识别
    function initSpeechRecognition() {
        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = function (event) {
                const speechResult = event.results[0][0].transcript;
                const input = document.getElementById('pronunciationInput');
                if (input) input.value = speechResult;

                const voiceStatus = document.getElementById('voiceStatus');
                if (voiceStatus) {
                    voiceStatus.textContent = `识别结果: "${speechResult}"`;
                    voiceStatus.style.color = "#06D6A0";
                }
            };

            recognition.onerror = function (event) {
                console.error('语音识别错误:', event.error);
                const voiceStatus = document.getElementById('voiceStatus');
                if (voiceStatus) {
                    voiceStatus.textContent = `识别错误: ${event.error}`;
                    voiceStatus.style.color = "#EF476F";
                }
            };

            recognition.onend = function () {
                isRecording = false;
                updateRecordingUI();
            };
        }
    }

    // 初始化录音
    async function initAudioRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = function (event) {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = function () {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);

                const playbackBtn = document.getElementById('playbackBtn');
                if (playbackBtn) {
                    playbackBtn.onclick = function () {
                        const audio = new Audio(audioUrl);
                        audio.play();
                    };
                    playbackBtn.classList.remove('disabled');
                    playbackBtn.disabled = false;
                }

                const speakingFeedback = document.getElementById('speakingFeedback');
                if (speakingFeedback) {
                    speakingFeedback.innerHTML = `
                        <p>录音完成！点击播放按钮回听你的发音。</p>
                        <p>将你的发音与范例发音进行比较，然后尝试再次录音。</p>
                    `;
                }

                const gameState = window.gameState || { learning: { speaking: { practiceCount: 0 } } };
                gameState.learning.speaking
