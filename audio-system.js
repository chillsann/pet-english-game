// PET英语学习游戏 - 发音系统
document.addEventListener('DOMContentLoaded', function() {
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
            
            recognition.onresult = function(event) {
                const speechResult = event.results[0][0].transcript;
                document.getElementById('pronunciationInput').value = speechResult;
                
                const voiceStatus = document.getElementById('voiceStatus');
                voiceStatus.textContent = `识别结果: "${speechResult}"`;
                voiceStatus.style.color = "#06D6A0";
            };
            
            recognition.onerror = function(event) {
                console.error('语音识别错误:', event.error);
                const voiceStatus = document.getElementById('voiceStatus');
                voiceStatus.textContent = `识别错误: ${event.error}`;
                voiceStatus.style.color = "#EF476F";
            };
            
            recognition.onend = function() {
                isRecording = false;
                updateRecordingUI();
            };
        } else {
            console.warn('您的浏览器不支持语音识别');
        }
    }
    
    // 初始化录音
    async function initAudioRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = function(event) {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };
            
            mediaRecorder.onstop = function() {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // 设置播放按钮
                const playbackBtn = document.getElementById('playbackBtn');
                playbackBtn.onclick = function() {
                    const audio = new Audio(audioUrl);
                    audio.play();
                };
                
                playbackBtn.classList.remove('disabled');
                playbackBtn.disabled = false;
                
                // 提供反馈
                const speakingFeedback = document.getElementById('speakingFeedback');
                speakingFeedback.innerHTML = `
                    <p>录音完成！点击播放按钮回听你的发音。</p>
                    <p>将你的发音与范例发音进行比较，然后尝试再次录音。</p>
                `;
                
                // 更新练习次数
                const gameState = window.gameState || { learning: { speaking: { practiceCount: 0 } } };
                gameState.learning.speaking.practiceCount++;
                
                // 更新UI
                if (window.updateProgressStats) {
                    window.updateProgressStats();
                }
                
                // 添加消息
                if (window.addMessage) {
                    window.addMessage("口语练习已完成！继续努力！", "info");
                }
                
                // 重置
                audioChunks = [];
            };
        } catch (err) {
            console.error('无法访问麦克风:', err);
            const voiceStatus = document.getElementById('voiceStatus');
            voiceStatus.textContent = "无法访问麦克风，请检查权限设置";
            voiceStatus.style.color = "#EF476F";
        }
    }
    
    // 更新录音UI
    function updateRecordingUI() {
        const recordBtn = document.getElementById('recordBtn');
        const stopBtn = document.getElementById('stopBtn');
        
        if (isRecording) {
            recordBtn.innerHTML = '<i class="fas fa-microphone"></i> 录音中...';
            recordBtn.classList.add('recording');
            stopBtn.classList.remove('disabled');
            stopBtn.disabled = false;
            
            const speakingFeedback = document.getElementById('speakingFeedback');
            speakingFeedback.innerHTML = '<p>正在录音...请朗读上面的句子。</p>';
        } else {
            recordBtn.innerHTML = '<i class="fas fa-microphone"></i> 开始录音';
            recordBtn.classList.remove('recording');
            stopBtn.classList.add('disabled');
            stopBtn.disabled = true;
        }
    }
    
    // 加载可用的语音
    function loadVoices() {
        // 等待语音加载完成
        setTimeout(() => {
            const voices = speechSynthesis.getVoices();
            const voiceSelect = document.getElementById('voiceSelect');
            
            // 清空选项
            voiceSelect.innerHTML = '<option value="">系统默认</option>';
            
            // 添加英语语音
            voices.forEach(voice => {
                if (voice.lang.startsWith('en')) {
                    const option = document.createElement('option');
                    option.value = voice.voiceURI;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    voiceSelect.appendChild(option);
                }
            });
        }, 100);
    }
    
    // 初始化事件监听器
    function initEventListeners() {
        // 录音按钮
        const recordBtn = document.getElementById('recordBtn');
        if (recordBtn) {
            recordBtn.addEventListener('click', function() {
                if (!isRecording) {
                    // 开始语音识别
                    if (recognition) {
                        recognition.start();
                    }
                    
                    // 开始录音
                    if (mediaRecorder && mediaRecorder.state === 'inactive') {
                        mediaRecorder.start();
                        isRecording = true;
                        updateRecordingUI();
                        
                        const voiceStatus = document.getElementById('voiceStatus');
                        voiceStatus.textContent = "正在录音...请说话";
                        voiceStatus.style.color = "#118AB2";
                    }
                }
            });
        }
        
        // 停止按钮
        const stopBtn = document.getElementById('stopBtn');
        if (stopBtn) {
            stopBtn.addEventListener('click', function() {
                if (isRecording) {
                    // 停止语音识别
                    if (recognition) {
                        recognition.stop();
                    }
                    
                    // 停止录音
                    if (mediaRecorder && mediaRecorder.state === 'recording') {
                        mediaRecorder.stop();
                        isRecording = false;
                        updateRecordingUI();
                        
                        const voiceStatus = document.getElementById('voiceStatus');
                        voiceStatus.textContent = "录音已停止";
                        voiceStatus.style.color = "#06D6A0";
                    }
                }
            });
        }
        
        // 测试发音按钮
        const testVoiceBtn = document.getElementById('testVoiceBtn');
        if (testVoiceBtn) {
            testVoiceBtn.addEventListener('click', function() {
                if ('speechSynthesis' in window) {
                    const testText = "Welcome to the PET English Learning Game! Let's practice English together.";
                    const utterance = new SpeechSynthesisUtterance(testText);
                    
                    // 设置语音参数
                    const voiceSelect = document.getElementById('voiceSelect');
                    const rateSelect = document.getElementById('rateSelect');
                    
                    if (voiceSelect.value) {
                        const voices = speechSynthesis.getVoices();
                        const selectedVoice = voices.find(voice => voice.voiceURI === voiceSelect.value);
                        if (selectedVoice) {
                            utterance.voice = selectedVoice;
                        }
                    }
                    
                    utterance.rate = parseFloat(rateSelect.value);
                    utterance.lang = 'en-US';
                    
                    // 显示状态
                    const voiceStatus = document.getElementById('voiceStatus');
                    voiceStatus.textContent = "正在测试发音...";
                    voiceStatus.style.color = "#118AB2";
                    
                    utterance.onend = function() {
                        voiceStatus.textContent = "发音测试完成！";
                        setTimeout(() => {
                            voiceStatus.textContent = "";
                        }, 2000);
                    };
                    
                    speechSynthesis.speak(utterance);
                } else {
                    alert("您的浏览器不支持语音合成功能。");
                }
            });
        }
        
        // 语音变化时重新加载
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // 初始化发音系统
    function initAudioSystem() {
        // 检查浏览器支持
        if (!('speechSynthesis' in window)) {
            alert("您的浏览器不支持语音合成功能，部分功能可能无法使用。");
        }
        
        // 初始化语音识别
        initSpeechRecognition();
        
        // 初始化录音
        initAudioRecording();
        
        // 加载可用的语音
        loadVoices();
        
        // 设置事件监听器
        initEventListeners();
        
        console.log("发音系统初始化完成");
    }
    
    // 初始化
    initAudioSystem();
});
