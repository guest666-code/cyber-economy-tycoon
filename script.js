let gameData = {
    score: 0,
    cps: 0,
    clickPower: 1,
    upgrades: [
        { id: 'script', name: 'Auto Script Bot', cost: 15, cps: 1, count: 0 },
        { id: 'rig', name: 'Cyber Server Rig', cost: 100, cps: 8, count: 0 },
        { id: 'AI', name: 'Quantum AI Core', cost: 1100, cps: 47, count: 0 }
    ]
};

// Kayıtlı veriyi yükle
if (localStorage.getItem('cyberEconomySave')) {
    const saved = JSON.parse(localStorage.getItem('cyberEconomySave'));
    gameData.score = saved.score || 0;
    gameData.cps = saved.cps || 0;
    gameData.clickPower = saved.clickPower || 1;
    if (saved.upgrades) {
        gameData.upgrades = saved.upgrades;
    }
}

const scoreEl = document.getElementById('score');
const cpsEl = document.getElementById('cps');
const clickerBtn = document.getElementById('clicker-btn');
const upgradesListEl = document.getElementById('upgrades-list');

function updateUI() {
    scoreEl.innerText = Math.floor(gameData.score).toLocaleString();
    cpsEl.innerText = gameData.cps.toLocaleString();
    renderUpgrades();
}

// Tıklama olayı
clickerBtn.addEventListener('click', () => {
    gameData.score += gameData.clickPower;
    updateUI();
});

// Yükseltmeleri listele
function renderUpgrades() {
    upgradesListEl.innerHTML = '';
    gameData.upgrades.forEach((upg, index) => {
        const item = document.createElement('div');
        item.className = 'upgrade-card';
        item.innerHTML = `
            <div class="upgrade-info">
                <h4>${upg.name} (${upg.count})</h4>
                <p>+${upg.cps} CPS | Fiyat: ${Math.floor(upg.cost)} Byte</p>
            </div>
            <button class="buy-btn" onclick="buyUpgrade(${index})" ${gameData.score < upg.cost ? 'disabled' : ''}>Satın Al</button>
        `;
        upgradesListEl.appendChild(item);
    });
}

// Yükseltme satın al
window.buyUpgrade = function(index) {
    let upg = gameData.upgrades[index];
    if (gameData.score >= upg.cost) {
        gameData.score -= upg.cost;
        gameData.cps += upg.cps;
        upg.count++;
        upg.cost *= 1.15; // Fiyat artış oranı
        updateUI();
    }
};

// Saniyede kazanç (Idle Loop)
setInterval(() => {
    if (gameData.cps > 0) {
        gameData.score += gameData.cps / 10;
        updateUI();
    }
}, 100);

// Otomatik Kayıt (Her 5 saniyede bir)
setInterval(() => {
    localStorage.setItem('cyberEconomySave', JSON.stringify(gameData));
}, 5000);

updateUI();
