// PET英语学习游戏 - 主逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 游戏状态
    const gameState = {
        pet: {
            name: "Paws",
            happiness: 85,
            knowledge: 60,
            energy: 75,
            level: 3,
            points: 1250
        },
        learning: {
            vocabulary: {
                learned: 24,
                categories: {
                    animals: 5,
                    food: 8,
                    travel: 6,
                    hobbies: 5
                }
            },
            grammar: {
                correct: 12,
                total: 20,
                accuracy: 60
            },
            speaking: {
                practiceCount: 8,
                lastScore: 75
            }
        },
        achievements: [
            "新手学习者"
        ]
    };

    // PET考试词汇数据
    const vocabularyData = {
        animals: [
            { word: "elephant", meaning: "大象", example: "The elephant is the largest land animal.", pronunciation: "ˈɛlɪfənt" },
            { word: "giraffe", meaning: "长颈鹿", example: "The giraffe has a very long neck.", pronunciation: "dʒɪˈrɑːf" },
            { word: "kangaroo", meaning: "袋鼠", example: "Kangaroos are native to Australia.", pronunciation: "ˌkæŋɡəˈruː" },
            { word: "penguin", meaning: "企鹅", example: "Penguins cannot fly but they are excellent swimmers.", pronunciation: "ˈpɛŋɡwɪn" },
            { word: "dolphin", meaning: "海豚", example: "Dolphins are known for their intelligence.", pronunciation: "ˈdɒlfɪn" }
        ],
        food: [
            { word: "restaurant", meaning: "餐厅", example: "We had dinner at an Italian restaurant.", pronunciation: "ˈrɛstrɒnt" },
            { word: "delicious", meaning: "美味的", example: "The cake was absolutely delicious.", pronunciation: "dɪˈlɪʃəs" },
            { word: "ingredients", meaning: "食材", example: "We need to buy all the ingredients for the recipe.", pronunciation: "ɪnˈɡriːdiənts" },
            { word: "vegetarian", meaning: "素食者", example: "My sister is a vegetarian.", pronunciation: "ˌvɛdʒɪˈteəriən" },
            { word: "breakfast", meaning: "早餐", example: "I usually have cereal for breakfast.", pronunciation: "ˈbrɛkfəst" }
        ],
        travel: [
            { word: "passport", meaning: "护照", example: "Don't forget to bring your passport when traveling abroad.", pronunciation: "ˈpɑːspɔːt" },
            { word: "luggage", meaning: "行李", example: "My luggage was lost at the airport.", pronunciation: "ˈlʌɡɪdʒ" },
            { word: "destination", meaning: "目的地", example: "Our destination is Paris.", pronunciation: "ˌdɛstɪˈneɪʃən" },
            { word: "journey", meaning: "旅程", example: "The journey took about three hours.", pronunciation: "ˈdʒɜːni" },
            { word: "accommodation", meaning: "住宿", example: "We need to book accommodation for our trip.", pronunciation: "əˌkɒməˈdeɪʃən" }
        ],
        hobbies: [
            { word: "photography", meaning: "摄影", example: "Photography is my favorite hobby.", pronunciation: "fəˈtɒɡrəfi" },
            { word: "gardening", meaning: "园艺", example: "My grandmother enjoys gardening.", pronunciation: "ˈɡɑːdnɪŋ" },
            { word: "cycling", meaning: "骑自行车", example: "We go cycling in the park every Sunday.", pronunciation: "ˈsaɪklɪŋ" },
            { word: "painting", meaning: "绘画", example: "She is very good at painting landscapes.", pronunciation: "ˈpeɪntɪŋ" },
            { word: "hiking", meaning: "远足", example: "We plan to go hiking in the mountains.", pronunciation: "ˈhaɪkɪŋ" }
        ]
    };

    // PET语法练习数据
    const grammarData = [
        {
            question: "Choose the correct option: If I ___ enough money, I would buy a new car.",
            options: ["have", "had", "will have", "would have"],
            correct: 1,
            explanation: "The correct answer is 'had' because this is a second conditional sentence."
        },
        {
            question: "Choose the correct option: She ___ to the cinema every Saturday.",
            options: ["go", "goes", "is going", "went"],
            correct: 1,
            explanation: "The correct answer is 'goes' because it's a regular habit (present simple)."
        },
        {
            question: "Choose the correct option: This is the ___ book I have ever read.",
            options: ["interesting", "more interesting", "most interesting", "interestinger"],
            correct: 2,
            explanation: "The correct answer is 'most interesting' because it's a superlative form."
        },
        {
            question: "Choose the correct option: They ___ football when it started to rain.",
            options: ["played", "were playing", "have played", "play"],
            correct: 1,
            explanation: "The correct answer is 'were playing' because it's an interrupted action in the past."
        },
        {
            question: "Choose the correct option: I wish I ___ speak French fluently.",
            options: ["can", "could", "will", "am"],
            correct: 1,
            explanation: "The correct answer is 'could' because it's a wish about a present ability."
        }
    ];

    // 口语练习数据
    const speakingData = [
        "Hello, my name is Alex and I'm from London.",
        "I usually get up at seven o'clock in the morning.",
        "My favorite hobby is playing the guitar and reading books.",
        "Last summer, I went to Spain with my family.",
        "In the future, I would like to become a teacher.",
        "The weather today is sunny and warm.",
        "I enjoy watching movies, especially comedies.",
        "My best friend is very kind and funny.",
        "If I could travel anywhere, I would go to Japan.",
        "I think learning English is important for my career."
    ];

    // 当前练习索引
    let currentGrammarIndex = 0;
    let currentSpeakingIndex = 0;
    let currentVocabCategory = null;
    let currentVocabIndex = 0;

    // 初始化
    function init() {
        updatePetStatus();
        setupEventListeners();
        setupTabs();
        loadVocabCategories();
        loadGrammarExercise();
        loadSpeakingExercise();
        updateProgressStats();
        addMessage("欢迎来到宠物英语学院！通过完成学习任务来照顾你的宠物吧！", "success");
        
        // 初始化图表
        initProgressChart();
    }

    // 更新宠物状态显示
    function updatePetStatus() {
        document.getElementById('petName').textContent = gameState.pet.name;
        document.getElementById('happinessBar').style.width = `${gameState.pet.happiness}%`;
        document.getElementById('happinessValue').textContent = `${gameState.pet.happiness}%`;
        document.getElementById('knowledgeBar').style.width = `${gameState.pet.knowledge}%`;
        document.getElementById('knowledgeValue').textContent = `${gameState.pet.knowledge}%`;
        document.getElementById('energyBar').style.width = `${gameState.pet.energy}%`;
        document.getElementById('energyValue').textContent = `${gameState.pet.energy}%`;
        document.getElementById('petLevel').textContent = gameState.pet.level;
        document.getElementById('points').textContent = gameState.pet.points;
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 宠物动作按钮
        document.getElementById('feedBtn').addEventListener('click', function() {
            if (gameState.pet.energy >= 10) {
                gameState.pet.happiness = Math.min(100, gameState.pet.happiness + 5);
                gameState.pet.knowledge = Math.min(100, gameState.pet.knowledge + 3);
                gameState.pet.energy = Math.max(0, gameState.pet.energy - 10);
                gameState.pet.points += 50;
                
                updatePetStatus();
                switchToTab('vocabulary');
                addMessage("你喂了宠物并学习了新词汇！幸福度+5，知识值+3，能量值-10", "success");
                checkLevelUp();
            } else {
                addMessage("能量值不足，无法学习！让宠物休息一下。", "warning");
            }
        });

        document.getElementById('playBtn').addEventListener('click', function() {
            if (gameState.pet.energy >= 15) {
                gameState.pet.happiness = Math.min(100, gameState.pet.happiness + 10);
                gameState.pet.energy = Math.max(0, gameState.pet.energy - 15);
                gameState.pet.points += 30;
                
                updatePetStatus();
                switchToTab('grammar');
                addMessage("你和宠物玩耍并练习了语法！幸福度+10，能量值-15", "success");
                checkLevelUp();
            } else {
                addMessage("能量值不足，无法玩耍！让宠物休息一下。", "warning");
            }
        });

        document.getElementById('trainBtn').addEventListener('click', function() {
            if (gameState.pet.energy >= 20) {
                gameState.pet.knowledge = Math.min(100, gameState.pet.knowledge + 8);
                gameState.pet.energy = Math.max(0, gameState.pet.energy - 20);
                gameState.pet.points += 80;
                
                updatePetStatus();
                switchToTab('speaking');
                addMessage("你训练了宠物并练习了口语！知识值+8，能量值-20", "success");
                checkLevelUp();
            } else {
                addMessage("能量值不足，无法训练！让宠物休息一下。", "warning");
            }
        });

        document.getElementById('restBtn').addEventListener('click', function() {
            gameState.pet.energy = Math.min(100, gameState.pet.energy + 25);
            gameState.pet.happiness = Math.min(100, gameState.pet.happiness + 2);
            
            updatePetStatus();
            addMessage("宠物休息了一会儿，能量值+25，幸福度+2", "info");
        });

        // 下一题按钮
        document.getElementById('nextGrammarBtn').addEventListener('click', loadGrammarExercise);
    }

    // 设置标签页
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // 移除所有按钮的活动状态
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // 添加当前按钮的活动状态
                this.classList.add('active');
                
                // 隐藏所有内容
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // 显示当前内容
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // 切换到指定标签页
    function switchToTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
    }

    // 加载词汇分类
    function loadVocabCategories() {
        const categoriesContainer = document.getElementById('vocabCategories');
        categoriesContainer.innerHTML = '';
        
        Object.keys(vocabularyData).forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-btn';
            button.textContent = getCategoryName(category);
            button.addEventListener('click', () => loadVocabExercise(category));
            categoriesContainer.appendChild(button);
        });
    }

    // 获取分类名称
    function getCategoryName(key) {
        const names = {
            animals: "动物",
            food: "食物与餐饮",
            travel: "旅行与交通",
            hobbies: "爱好与活动"
        };
        return names[key] || key;
    }

    // 加载词汇练习
    function loadVocabExercise(category) {
        currentVocabCategory = category;
        currentVocabIndex = 0;
        
        // 更新分类按钮状态
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // 显示第一个单词
        displayVocabWord();
        
        // 显示音频控制
        document.getElementById('vocabAudioControls').style.display = 'block';
        
        // 添加消息
        addMessage(`开始学习${getCategoryName(category)}类词汇！`, "info");
    }

    // 显示词汇单词
    function displayVocabWord() {
        if (!currentVocabCategory) return;
        
        const words = vocabularyData[currentVocabCategory];
        if (currentVocabIndex >= words.length) {
            currentVocabIndex = 0;
        }
        
        const word = words[currentVocabIndex];
        const exerciseContainer = document.getElementById('vocabExercise');
        
        exerciseContainer.innerHTML = `
            <div class="vocab-word">${word.word}</div>
            <div class="vocab-meaning"><strong>意思:</strong> ${word.meaning}</div>
            <div class="vocab-example"><strong>例句:</strong> ${word.example}</div>
            <div class="vocab-pronunciation"><strong>发音:</strong> /${word.pronunciation}/</div>
        `;
        
        // 设置发音按钮
        document.getElementById('speakWordBtn').onclick = () => speakText(word.word);
        
        // 设置检查发音按钮
        document.getElementById('checkPronunciationBtn').onclick = () => {
            const userInput = document.getElementById('pronunciationInput').value.trim().toLowerCase();
            if (userInput === word.word.toLowerCase()) {
                addMessage(`发音正确！ "${word.word}" 读作 /${word.pronunciation}/`, "success");
                gameState.learning.vocabulary.learned++;
                gameState.pet.knowledge = Math.min(100, gameState.pet.knowledge + 2);
                gameState.pet.points += 20;
                updatePetStatus();
                updateProgressStats();
                
                // 移动到下一个单词
                currentVocabIndex = (currentVocabIndex + 1) % words.length;
                setTimeout(displayVocabWord, 1000);
            } else {
                addMessage(`再试一次！你输入的是"${userInput}"，但正确单词是"${word.word}"`, "warning");
            }
        };
    }

    // 加载语法练习
    function loadGrammarExercise() {
        const exercise = grammarData[currentGrammarIndex];
        const optionsContainer = document.getElementById('grammarOptions');
        const feedbackContainer = document.getElementById('grammarFeedback');
        
        // 更新问题
        document.getElementById('grammarQuestion').textContent = exercise.question;
        
        // 清空选项
        optionsContainer.innerHTML = '';
        feedbackContainer.innerHTML = '';
        feedbackContainer.className = 'feedback';
        
        // 添加选项
        exercise.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
            optionElement.addEventListener('click', () => checkGrammarAnswer(index, exercise.correct, exercise.explanation));
            optionsContainer.appendChild(optionElement);
        });
        
        // 更新索引
        currentGrammarIndex = (currentGrammarIndex + 1) % grammarData.length;
    }

    // 检查语法答案
    function checkGrammarAnswer(selected, correct, explanation) {
        const options = document.querySelectorAll('.grammar-exercise .option');
        const feedbackContainer = document.getElementById('grammarFeedback');
        
        // 移除所有选项的点击事件
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        // 标记正确和错误答案
        options.forEach((option, index) => {
            if (index === correct) {
                option.classList.add('correct');
            } else if (index === selected) {
                option.classList.add('incorrect');
            }
        });
        
        // 显示反馈
        if (selected === correct) {
            feedbackContainer.textContent = `正确！${explanation}`;
            feedbackContainer.classList.add('correct');
            
            // 更新游戏状态
            gameState.learning.grammar.correct++;
            gameState.learning.grammar.total++;
            gameState.learning.grammar.accuracy = Math.round((gameState.learning.grammar.correct / gameState.learning.grammar.total) * 100);
            gameState.pet.knowledge = Math.min(100, gameState.pet.knowledge + 5);
            gameState.pet.points += 30;
            updatePetStatus();
            updateProgressStats();
            
            addMessage("语法练习回答正确！知识值+5", "success");
        } else {
            feedbackContainer.textContent = `错误。正确答案是选项${String.fromCharCode(65 + correct)}。${explanation}`;
            feedbackContainer.classList.add('incorrect');
            
            // 更新游戏状态
            gameState.learning.grammar.total++;
            gameState.learning.grammar.accuracy = Math.round((gameState.learning.grammar.correct / gameState.learning.grammar.total) * 100);
            updateProgressStats();
            
            addMessage("语法练习回答错误，再试一次！", "warning");
        }
    }

    // 加载口语练习
    function loadSpeakingExercise() {
        const sentence = speakingData[currentSpeakingIndex];
        document.getElementById('sentenceToRead').textContent = sentence;
        
        // 更新消息
        document.getElementById('speakingPrompt').textContent = "点击开始录音按钮，然后朗读下面的句子";
        
        // 清除反馈
        document.getElementById('speakingFeedback').innerHTML = '';
        
        // 设置范例发音按钮
        document.getElementById('sampleAudioBtn').onclick = () => speakText(sentence);
        
        // 更新索引
        currentSpeakingIndex = (currentSpeakingIndex + 1) % speakingData.length;
    }

    // 更新进度统计
    function updateProgressStats() {
        document.getElementById('vocabLearned').textContent = gameState.learning.vocabulary.learned;
        document.getElementById('grammarAccuracy').textContent = `${gameState.learning.grammar.accuracy}%`;
        document.getElementById('speakingPractice').textContent = gameState.learning.speaking.practiceCount;
        
        // 根据知识值评估PET等级
        let petLevel = "A1";
        if (gameState.pet.knowledge >= 80) petLevel = "B2";
        else if (gameState.pet.knowledge >= 60) petLevel = "B1";
        else if (gameState.pet.knowledge >= 40) petLevel = "A2";
        
        document.getElementById('petLevelAssessment').textContent = petLevel;
        
        // 更新成就
        updateAchievements();
    }

    // 更新成就
    function updateAchievements() {
        const badgesContainer = document.getElementById('badgesContainer');
        badgesContainer.innerHTML = '';
        
        // 添加基本成就
        gameState.achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = 'badge';
            badge.innerHTML = `<i class="fas fa-star"></i> ${achievement}`;
            badgesContainer.appendChild(badge);
        });
        
        // 根据条件添加新成就
        if (gameState.learning.vocabulary.learned >= 20 && !gameState.achievements.includes("词汇大师")) {
            gameState.achievements.push("词汇大师");
            addMessage("恭喜你解锁了新成就：词汇大师！", "success");
        }
        
        if (gameState.learning.grammar.accuracy >= 80 && !gameState.achievements.includes("语法专家")) {
            gameState.achievements.push("语法专家");
            addMessage("恭喜你解锁了新成就：语法专家！", "success");
        }
        
        if (gameState.learning.speaking.practiceCount >= 10 && !gameState.achievements.includes("口语达人")) {
            gameState.achievements.push("口语达人");
            addMessage("恭喜你解锁了新成就：口语达人！", "success");
        }
        
        if (gameState.pet.level >= 5 && !gameState.achievements.includes("高级训练师")) {
            gameState.achievements.push("高级训练师");
            addMessage("恭喜你解锁了新成就：高级训练师！", "success");
        }
    }

    // 检查升级
    function checkLevelUp() {
        const oldLevel = gameState.pet.level;
        const newLevel = Math.floor(gameState.pet.points / 500) + 1;
        
        if (newLevel > oldLevel) {
            gameState.pet.level = newLevel;
            addMessage(`恭喜！你的宠物升级了！现在是等级 ${newLevel}！`, "success");
            updatePetStatus();
        }
    }

    // 添加消息
    function addMessage(text, type) {
        const messagesContainer = document.getElementById('messagesContainer');
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        messagesContainer.prepend(message);
        
        // 限制消息数量
        if (messagesContainer.children.length > 5) {
            messagesContainer.removeChild(messagesContainer.lastChild);
        }
    }

    // 初始化进度图表
    function initProgressChart() {
        const ctx = document.getElementById('progressChart').getContext('2d');
        
        // 创建初始数据
        const progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['第1天', '第2天', '第3天', '第4天', '第5天', '第6天', '第7天'],
                datasets: [
                    {
                        label: '词汇量',
                        data: [5, 8, 12, 15, 18, 21, 24],
                        borderColor: '#6a11cb',
                        backgroundColor: 'rgba(106, 17, 203, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: '语法正确率',
                        data: [30, 40, 45, 50, 55, 58, 60],
                        borderColor: '#06D6A0',
                        backgroundColor: 'rgba(6, 214, 160, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: '口语练习',
                        data: [1, 2, 3, 4, 5, 6, 8],
                        borderColor: '#EF476F',
                        backgroundColor: 'rgba(239, 71, 111, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '7天学习进度'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
        
        // 存储图表引用以便更新
        window.progressChart = progressChart;
    }

    // 文本转语音
    function speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            
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
            voiceStatus.textContent = `正在发音: "${text}"`;
            voiceStatus.style.color = "#06D6A0";
            
            // 发音结束后的处理
            utterance.onend = function() {
                voiceStatus.textContent = "发音完成";
                setTimeout(() => {
                    voiceStatus.textContent = "";
                }, 2000);
            };
            
            speechSynthesis.speak(utterance);
        } else {
            alert("您的浏览器不支持语音合成功能，请使用Chrome或Edge浏览器。");
        }
    }

    // 初始化游戏
    init();
});
