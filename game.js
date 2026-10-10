import { initAuth } from "./auth.js";

// --- SES EFEKTLERİ (Web Audio API Synthesizer) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
export function playSound(type) {
    if (gameData.settings.soundMuted) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    
    if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'buy') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(600, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
    } else if (type === 'vip') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    }
}

// --- DİL ÇEVİRİLERİ (6 Dil) ---
const translations = {
    tr: { title: "CYBER ECONOMY TYCOON", bytecoin: "ByteCoin:", cps: "CPS:", upgrades: "Yükseltmeler", market: "Normal Market", vipMarket: "VIP Market", settings: "Ayarlar", clickBtn: "HACKLE", buy: "Satın Al", vipActive: "VIP AKTİF!" },
    en: { title: "CYBER ECONOMY TYCOON", bytecoin: "ByteCoin:", cps: "CPS:", upgrades: "Upgrades", market: "Normal Market", vipMarket: "VIP Market", settings: "Settings", clickBtn: "HACK", buy: "Buy", vipActive: "VIP ACTIVE!" },
    de: { title: "CYBER ECONOMY TYCOON", bytecoin: "ByteCoin:", cps: "CPS:", upgrades: "Upgrades", market: "Markt", vipMarket: "VIP Markt", settings: "Einstellungen", clickBtn: "HACKEN", buy: "Kaufen", vipActive: "VIP AKTIV!" },
    es: { title: "CYBER ECONOMY TYCOON", bytecoin: "ByteCoin:", cps: "CPS:", upgrades: "Mejoras", market: "Mercado", vipMarket: "VIP Mercado", settings: "Ajustes", clickBtn: "HACKEAR", buy: "Comprar", vipActive: "VIP ACTIVO!" },
    fr: { title: "CYBER ECONOMY TYCOON", bytecoin: "ByteCoin:", cps: "CPS:", upgrades: "Améliorations", market: "Marché", vipMarket: "VIP Marché", settings: "Paramètres", clickBtn: "PIRATER", buy: "Acheter", vipActive: "VIP ACTIF!" },
    ru: { title: "CYBER ECONOMY TYCOON", bytecoin: "ByteCoin:", cps: "CPS:", upgrades: "Улучшения", market: "Рынок", vipMarket: "VIP Рынок", settings: "Настройки", clickBtn: "ВЗЛОМ", buy: "Купить", vipActive: "VIP АКТИВЕН!" }
};

// --- 10 FARKLI RENK TEMASI ---
const themes = {
    cyberpunk: { bg: "#0b0b16", panel: "rgba(18, 18, 35, 0.85)", primary: "#ff007f", accent: "#00ffcc" },
    matrix: { bg: "#020f02", panel: "rgba(2, 20, 2, 0.9)", primary: "#00ff33", accent: "#008822" },
    neonRed: { bg: "#160b0b", panel: "rgba(35, 18, 18, 0.85)", primary: "#ff2222", accent: "#ff9900" },
    electricBlue: { bg: "#0b0e16", panel: "rgba(18, 25, 35, 0.85)", primary: "#00aaff", accent: "#00ffff" },
    toxicYellow: { bg: "#16160b", panel: "rgba(35, 35, 18, 0.85)", primary: "#ccff00", accent: "#ffaa00" },
    royalPurple: { bg: "#120b16", panel: "rgba(25, 18, 35, 0.85)", primary: "#9900ff", accent: "#ff00ff" },
    sunsetOrange: { bg: "#160f0b", panel: "rgba(35, 22, 18, 0.85)", primary: "#ff5500", accent: "#ffcc00" },
    arcticWhite: { bg: "#101015", panel: "rgba(25, 25, 30, 0.85)", primary: "#ffffff", accent: "#88ccff" },
    darkEmerald: { bg: "#061410", panel: "rgba(10, 30, 25, 0.85)", primary: "#00ffa3", accent: "#00b386" },
    cyberPink: { bg: "#160b13", panel: "rgba(35, 18, 30, 0.85)", primary: "#ff00aa", accent: "#ff66cc" }
};

// --- OYUN VERİLERİ & 20 YÜKSELTME ---
let gameData = {
    score: 0,
    cps: 0,
    clickPower: 1,
    isVip: false,
    settings: { lang: 'tr', theme: 'cyberpunk', soundMuted: false },
    upgrades: [
        { id: 1, name: "Script Bot", cost: 15, cps: 1, count: 0 },
        { id: 2, name: "Keylogger", cost: 100, cps: 5, count: 0 },
        { id: 3, name: "Proxy Server", cost: 500, cps: 20, count: 0 },
        { id: 4, name: "Botnet Network", cost: 2000, cps: 80, count: 0 },
        { id: 5, name: "AI Worm", cost: 10000, cps: 350, count: 0 },
        { id: 6, name: "Quantum Rig", cost: 40000, cps: 1400, count: 0 },
        { id: 7, name: "DarkWeb Node", cost: 150000, cps: 6000, count: 0 },
        { id: 8, name: "Neural Exploit", cost: 600000, cps: 25000, count: 0 },
        { id: 9, name: "Cyber Drone", cost: 2500000, cps: 100000, count: 0 },
        { id: 10, name: "AI Core V2", cost: 10000000, cps: 400000, count: 0 },
        { id: 11, name: "Satellite Hack", cost: 40000000, cps: 1600000, count: 0 },
        { id: 12, name: "Nano Exploit", cost: 150000000, cps: 6500000, count: 0 },
        { id: 13, name: "Quantum Matrix", cost: 600000000, cps: 25000000, count: 0 },
        { id: 14, name: "Cyber Overlord", cost: 2500000000, cps: 100000000, count: 0 },
        { id: 15, name: "DeepNet AI", cost: 10000000000, cps: 400000000, count: 0 },
        { id: 16, name: "Solaris Node", cost: 40000000000, cps: 1600000000, count: 0 },
        { id: 17, name: "Galaxy Hack Grid", cost: 150000000000, cps: 6500000000, count: 0 },
        { id: 18, name: "Universal AI", cost: 600000000000, cps: 25000000000, count: 0 },
        { id: 19, name: "Singularity Core", cost: 2500000000000, cps: 100000000000, count: 0 },
        { id: 20, name: "God-Mode System", cost: 10000000000000, cps: 500000000000, count: 0 }
    ]
};

if (localStorage.getItem('cyberEconomySaveV2')) {
    const saved = JSON.parse(localStorage.getItem('cyberEconomySaveV2'));
    gameData.score = saved.score || 0;
    gameData.cps = saved.cps || 0;
    gameData.clickPower = saved.clickPower || 1;
    gameData.isVip = saved.isVip || false;
    if (saved.settings) gameData.settings = saved.settings;
    if (saved.upgrades) gameData.upgrades = saved.upgrades;
}

const scoreEl = document.getElementById('score');
const cpsEl = document.getElementById('cps');
const clickerBtn = document.getElementById('clicker-btn');
const upgradesListEl = document.getElementById('upgrades-list');

function applyThemeAndLang() {
    const t = themes[gameData.settings.theme] || themes.cyberpunk;
    document.documentElement.style.setProperty('--bg-color', t.bg);
    document.documentElement.style.setProperty('--panel-bg', t.panel);
    document.documentElement.style.setProperty('--primary-color', t.primary);
    document.documentElement.style.setProperty('--accent-color', t.accent);
}

function updateUI() {
    scoreEl.innerText = Math.floor(gameData.score).toLocaleString();
    cpsEl.innerText = gameData.cps.toLocaleString();
    renderUpgrades();
}

clickerBtn.addEventListener('click', () => {
    playSound('click');
    const multiplier = gameData.isVip ? 500 : 1;
    gameData.score += gameData.clickPower * multiplier;
    updateUI();
});

function renderUpgrades() {
    upgradesListEl.innerHTML = '';
    gameData.upgrades.forEach((upg, index) => {
        const item = document.createElement('div');
        item.className = 'upgrade-card';
        item.innerHTML = `
            <div class="upgrade-info">
                <h4>${upg.name} (${upg.count})</h4>
                <p>+${upg.cps.toLocaleString()} CPS | ${Math.floor(upg.cost).toLocaleString()} Byte</p>
            </div>
            <button class="buy-btn" data-index="${index}" ${gameData.score < upg.cost ? 'disabled' : ''}>Satın Al</button>
        `;
        upgradesListEl.appendChild(item);
    });

    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            buyUpgrade(index);
        });
    });
}

function buyUpgrade(index) {
    let upg = gameData.upgrades[index];
    if (gameData.score >= upg.cost) {
        playSound('buy');
        gameData.score -= upg.cost;
        gameData.cps += upg.cps;
        upg.count++;
        upg.cost *= 1.15;
        updateUI();
    }
}

// VIP Satın Alım Mantığı (Global fonksiyon)
window.buyVipStatus = function() {
    if (gameData.score >= 500000 && !gameData.isVip) {
        playSound('vip');
        gameData.score -= 500000;
        gameData.isVip = true;
        gameData.clickPower *= 500;
        gameData.cps *= 250;
        alert("VIP SİSTEMİ AKTİFLEŞTİ! 500x Tıklama ve 250x CPS Gücü Kazandın!");
        updateUI();
    } else if (gameData.isVip) {
        alert("Zaten VIP durumdasın!");
    } else {
        alert("Yetersiz ByteCoin! VIP için 500.000 Byte gerekiyor.");
    }
};

// Saniyede kazanç (Idle Loop)
setInterval(() => {
    if (gameData.cps > 0) {
        gameData.score += gameData.cps / 10;
        updateUI();
    }
}, 100);

// Otomatik Kayıt
setInterval(() => {
    localStorage.setItem('cyberEconomySaveV2', JSON.stringify(gameData));
}, 5000);

applyThemeAndLang();
initAuth();
updateUI();
