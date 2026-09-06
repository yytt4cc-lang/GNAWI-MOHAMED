// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const linkForm = document.getElementById('linkForm');
const userIdInput = document.getElementById('userIdInput');
const tokenInput = document.getElementById('tokenInput');
const toastContainer = document.getElementById('toastContainer');
const loadingModal = document.getElementById('loadingModal');
const loadingText = document.getElementById('loadingText');
const accountInfo = document.getElementById('accountInfo');
const questsList = document.getElementById('questsList');
const resultsSection = document.getElementById('resultsSection');
const resultsContainer = document.getElementById('resultsContainer');

// Buttons
const unlinkBtn = document.getElementById('unlinkBtn');
const checkTokenBtn = document.getElementById('checkTokenBtn');
const listQuestsBtn = document.getElementById('listQuestsBtn');
const completeQuestBtn = document.getElementById('completeQuestBtn');
const completeAllBtn = document.getElementById('completeAllBtn');

// State
let currentUserId = localStorage.getItem('userId') || `user_${Date.now()}`;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('userId', currentUserId);
    checkTokenValidity();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    linkForm.addEventListener('submit', handleLinkToken);
    unlinkBtn.addEventListener('click', handleUnlink);
    checkTokenBtn.addEventListener('click', handleCheckToken);
    listQuestsBtn.addEventListener('click', handleListQuests);
    completeQuestBtn.addEventListener('click', handleCompleteQuest);
    completeAllBtn.addEventListener('click', handleCompleteAll);
}

// Helper Functions
async function showLoading(text = 'جاري المعالجة...') {
    loadingText.textContent = text;
    loadingModal.classList.remove('hidden');
}

function hideLoading() {
    loadingModal.classList.add('hidden');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function switchSection(show, hide) {
    hide.classList.remove('active');
    show.classList.add('active');
}

async function checkTokenValidity() {
    const userId = localStorage.getItem('userId') || currentUserId;
    
    try {
        const response = await fetch('/api/token-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (data.valid) {
            showDashboard(data.accountName);
        } else {
            showLoginForm();
        }
    } catch (error) {
        console.error('Error checking token:', error);
        showLoginForm();
    }
}

function showLoginForm() {
    switchSection(loginSection, dashboardSection);
}

function showDashboard(accountName) {
    accountInfo.textContent = `👤 مرحباً، ${accountName}`;
    switchSection(dashboardSection, loginSection);
    loadQuests();
}

// API Calls
async function handleLinkToken(e) {
    e.preventDefault();
    
    const userId = userIdInput.value.trim() || currentUserId;
    const token = tokenInput.value.trim();

    if (!token) {
        showToast('❌ يرجى إدخال التوكن', 'error');
        return;
    }

    showLoading('جاري ربط التوكن...');

    try {
        const response = await fetch('/api/link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, token }),
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('userId', userId);
            currentUserId = userId;
            showToast(data.message, 'success');
            linkForm.reset();
            setTimeout(() => showDashboard(data.accountName), 500);
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        console.error('Error linking token:', error);
        showToast('❌ حدث خطأ في الربط', 'error');
    } finally {
        hideLoading();
    }
}

async function handleUnlink() {
    if (!confirm('هل تريد فعلاً فصل التوكن؟')) return;

    showLoading('جاري فصل التوكن...');

    try {
        const response = await fetch('/api/unlink', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUserId }),
        });

        const data = await response.json();

        if (data.success) {
            showToast(data.message, 'success');
            setTimeout(() => showLoginForm(), 500);
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        console.error('Error unlinking token:', error);
        showToast('❌ حدث خطأ في الفصل', 'error');
    } finally {
        hideLoading();
    }
}

async function handleCheckToken() {
    showLoading('جاري التحقق من التوكن...');

    try {
        const response = await fetch('/api/token-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUserId }),
        });

        const data = await response.json();
        showToast(data.message, data.valid ? 'success' : 'error');
    } catch (error) {
        console.error('Error checking token:', error);
        showToast('❌ حدث خطأ في التحقق', 'error');
    } finally {
        hideLoading();
    }
}

async function loadQuests() {
    questsList.innerHTML = '<div class="loading">جاري تحميل المهام...</div>';

    try {
        const response = await fetch(`/api/quest-list?userId=${currentUserId}`);
        const data = await response.json();

        if (data.success && data.quests.length > 0) {
            questsList.innerHTML = data.quests.map(quest => createQuestCard(quest)).join('');
        } else {
            questsList.innerHTML = `<div class="loading">${data.message || '🔍 لا توجد مهام متاحة'}</div>`;
        }
    } catch (error) {
        console.error('Error loading quests:', error);
        questsList.innerHTML = '<div class="loading">❌ حدث خطأ في تحميل المهام</div>';
    }
}

function createQuestCard(quest) {
    const expiresDate = new Date(quest.expiresAt);
    const daysLeft = Math.max(0, Math.ceil((expiresDate - Date.now()) / 86400000));
    
    const rewardsText = quest.rewards
        .map(r => {
            if (r.orbs > 0) return `✦ ${r.orbs} Orbs`;
            if (r.nitro > 0) return `💜 ${r.nitro}d Nitro`;
            return r.name;
        })
        .join(', ');

    return `
        <div class="quest-card">
            <img src="${quest.thumbnail}" alt="${quest.name}" class="quest-thumbnail" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22160%22%3E%3Crect fill=%22%23404249%22 width=%22280%22 height=%22160%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23949BA4%22%3E🎮%3C/text%3E%3C/svg%3E'">
            <div class="quest-content">
                <div class="quest-name">${quest.name}</div>
                <div class="quest-game">🎮 ${quest.game}</div>
                <div class="quest-game">👤 ${quest.publisher}</div>
                <div class="quest-expires">⏳ ${daysLeft} أيام متبقية</div>
                <div class="quest-rewards">🎁 ${rewardsText || 'بدون مكافآت'}</div>
                <div class="quest-actions">
                    <button class="quest-complete-btn" onclick="completeQuestDirect('${quest.id}', '${quest.name.replace(/'/g, "\\'")}')">
                        ✅ إكمال
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function handleListQuests() {
    await loadQuests();
    showToast('📋 تم تحميل قائمة المهام', 'info');
}

async function handleCompleteQuest() {
    const questId = prompt('أدخل معرّف المهمة (Quest ID):');
    if (!questId) return;

    showLoading('جاري إكمال المهمة...');

    try {
        const response = await fetch('/api/quest-complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUserId, questId }),
        });

        const data = await response.json();

        if (data.success) {
            showToast(data.message, 'success');
            showResult([{
                name: data.questName,
                status: '✅ نجح',
                rewards: data.claimedRewards,
            }]);
        } else {
            showToast(data.message, 'warning');
            showResult([{
                name: 'المهمة',
                status: '❌ فشل',
                reason: data.reason,
            }]);
        }
    } catch (error) {
        console.error('Error completing quest:', error);
        showToast('❌ حدث خطأ', 'error');
    } finally {
        hideLoading();
        loadQuests();
    }
}

async function completeQuestDirect(questId, questName) {
    showLoading('جاري إكمال المهمة...');

    try {
        const response = await fetch('/api/quest-complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUserId, questId }),
        });

        const data = await response.json();

        if (data.success) {
            showToast(data.message, 'success');
            showResult([{
                name: questName,
                status: '✅ نجح',
                rewards: data.claimedRewards,
            }]);
        } else {
            showToast(data.message, 'warning');
            showResult([{
                name: questName,
                status: '❌ فشل',
                reason: data.reason,
            }]);
        }
    } catch (error) {
        console.error('Error completing quest:', error);
        showToast('❌ حدث خطأ', 'error');
    } finally {
        hideLoading();
        loadQuests();
    }
}

async function handleCompleteAll() {
    if (!confirm('هل تريد إكمال جميع المهام؟ قد يستغرق هذا بعض الوقت.')) return;

    showLoading('جاري إكمال جميع المهام... ⚡');

    try {
        const response = await fetch('/api/quest-all', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUserId }),
        });

        const data = await response.json();

        if (data.success) {
            showToast(data.message, 'success');
            showResult(data.results);
        } else {
            showToast(data.message, 'warning');
            if (data.results) showResult(data.results);
        }
    } catch (error) {
        console.error('Error completing all quests:', error);
        showToast('❌ حدث خطأ', 'error');
    } finally {
        hideLoading();
        loadQuests();
    }
}

function showResult(results) {
    resultsContainer.innerHTML = results.map(result => `
        <div class="result-item ${result.status.includes('✅') ? 'success' : 'failed'}">
            <div class="result-item-name">${result.name}</div>
            <div class="result-item-status">${result.status}</div>
            ${result.rewards ? `<div class="result-item-rewards">🎁 ${result.rewards} مكافأة</div>` : ''}
            ${result.reason ? `<div class="result-item-rewards" style="color: #ED4245;">⚠️ ${result.reason}</div>` : ''}
        </div>
    `).join('');

    resultsSection.classList.remove('results-hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
