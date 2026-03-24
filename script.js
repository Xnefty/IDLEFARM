const gameState = {
    money: 100000000000000000000000000000,
    activeTab: 'crops',
    animalFarmUnlocked: false,
    animalFarmCost: 5000,

    farms: {
        crops: {
            fields: 4,
            fieldCost: 50,
            selectedSeed: 'potato',
            plots: []
        },
        animals: {
            fields: 4,
            fieldCost: 50,
            selectedSeed: 'chicken',
            plots: []
        }
    },

    data: {
        crops: {
            potato: { id: 'potato', name: 'Potato', cost: 0, sell: 2, time: 2, icon: '🥔' },
            wheat: { id: 'wheat', name: 'Wheat', cost: 2, sell: 5, time: 3, icon: '🌾' },
            carrot: { id: 'carrot', name: 'Carrot', cost: 10, sell: 25, time: 10, icon: '🥕' },
            corn: { id: 'corn', name: 'Corn', cost: 25, sell: 70, time: 20, icon: '🌽' },
            bellpepper: { id: 'bellpepper', name: 'Bell Pepper', cost: 50, sell: 150, time: 30, icon: '🫑' },
            strawberry: { id: 'strawberry', name: 'Strawberry', cost: 100, sell: 300, time: 45, icon: '🍓' },
            pumpkin: { id: 'pumpkin', name: 'Pumpkin', cost: 200, sell: 600, time: 60, icon: '🎃' },
            watermelon: { id: 'watermelon', name: 'Watermelon', cost: 500, sell: 1500, time: 90, icon: '🍉' },
            dragonfruit: { id: 'dragonfruit', name: 'Dragon Fruit', cost: 1000, sell: 3000, time: 120, icon: '🐉' },
            goldencabbage: { id: 'goldencabbage', name: 'Golden Cabbage', cost: 5000, sell: 15000, time: 180, icon: '🥬' },
            rainbowcarrot: { id: 'rainbowcarrot', name: 'Rainbow Carrot', cost: 10000, sell: 30000, time: 240, icon: '🥕' },
            magicbean: { id: 'magicbean', name: 'Magic Bean', cost: 50000, sell: 150000, time: 300, icon: '🌱' },
            starlightmelon: { id: 'starlightmelon', name: 'Starlight Melon', cost: 100000, sell: 300000, time: 360, icon: '🍉' },
            phoenixpepper: { id: 'phoenixpepper', name: 'Phoenix Pepper', cost: 500000, sell: 1500000, time: 420, icon: '🌶️​' },
            diamondcorn: { id: 'diamondcorn', name: 'Diamond Corn', cost: 1000000, sell: 3000000, time: 480, icon: '🌽' },
            titanwheat: { id: 'titanwheat', name: 'Titan Wheat', cost: 5000000, sell: 15000000, time: 540, icon: '🌾' },
            cosmicpotato: { id: 'cosmicpotato', name: 'Cosmic Potato', cost: 10000000, sell: 30000000, time: 600, icon: '🧆' }
        },
        animals: {
            chicken: { id: 'chicken', name: 'Chicken', cost: 0, sell: 5, time: 3, icon: '🐔' },
            pig: { id: 'pig', name: 'Pig', cost: 50, sell: 150, time: 15, icon: '🐷' },
            sheep: { id: 'sheep', name: 'Sheep', cost: 200, sell: 600, time: 30, icon: '🐑' },
            cow: { id: 'cow', name: 'Cow', cost: 1000, sell: 3000, time: 60, icon: '🐮' },
            horse: { id: 'horse', name: 'Horse', cost: 5000, sell: 15000, time: 120, icon: '🐴' },
            duck: { id: 'duck', name: 'Duck', cost: 20000, sell: 60000, time: 240, icon: '🦆' },
            goat: { id: 'goat', name: 'Goat', cost: 100000, sell: 300000, time: 360, icon: '🐐' },
            dragon: { id: 'dragon', name: 'Dragon', cost: 500000, sell: 1500000, time: 500, icon: '🐉' },
            unicorn: { id: 'unicorn', name: 'Unicorn', cost: 2000000, sell: 6000000, time: 720, icon: '🦄' }
        }
    }
};

const dom = {};
let isMouseDown = false;
let pendingPrestige = null;
let lastSaveTime = 0;

function init() {
    document.addEventListener('mousedown', (e) => { if (e.button === 0) isMouseDown = true; });
    document.addEventListener('mouseup', (e) => { if (e.button === 0) isMouseDown = false; });
    document.addEventListener('mouseleave', () => isMouseDown = false);
    dom.moneyDisplay = document.getElementById('money-display');
    dom.unlockAnimalBtn = document.getElementById('unlock-animal-btn');
    dom.tabNav = document.getElementById('tab-navigation');
    dom.cropsBtn = document.getElementById('tab-crops-btn');
    dom.animalsBtn = document.getElementById('tab-animals-btn');
    dom.unlockModal = document.getElementById('unlock-modal');

    dom.farms = {
        crops: {
            view: document.getElementById('crops-view'),
            grid: document.getElementById('crop-grid'),
            shop: document.getElementById('crop-shop'),
            buyBtn: document.getElementById('buy-crop-field-btn'),
            costDisplay: document.getElementById('crop-field-cost-display'),
            prestigeBtnContainer: document.getElementById('crop-prestige-container')
        },
        animals: {
            view: document.getElementById('animals-view'),
            grid: document.getElementById('animal-grid'),
            shop: document.getElementById('animal-shop'),
            buyBtn: document.getElementById('buy-animal-field-btn'),
            costDisplay: document.getElementById('animal-field-cost-display'),
            prestigeBtnContainer: document.getElementById('animal-prestige-container')
        }
    };
    dom.prestigeModal = document.getElementById('prestige-modal');
    dom.prestigeModalTitle = document.getElementById('prestige-modal-title');
    dom.prestigeModalDesc = document.getElementById('prestige-modal-desc');

    dom.farms.crops.buyBtn.onclick = () => buyField('crops');
    dom.farms.animals.buyBtn.onclick = () => buyField('animals');

    renderShop('crops');
    renderShop('animals');

    if (!loadGame()) {
        createFields('crops', gameState.farms.crops.fields);
        createFields('animals', gameState.farms.animals.fields);
    }

    renderGrids();
    switchTab(gameState.activeTab);
    updateUI();
    requestAnimationFrame(gameLoop);
}

function openUnlockModal() {
    dom.unlockModal.style.display = 'flex';
}

function closeUnlockModal() {
    dom.unlockModal.style.display = 'none';
}

function buyAnimalFarm() {
    if (gameState.money >= gameState.animalFarmCost && !gameState.animalFarmUnlocked) {
        gameState.money -= gameState.animalFarmCost;
        gameState.animalFarmUnlocked = true;
        closeUnlockModal();
        switchTab('animals');
        updateUI();
    }
}

function switchTab(tabId) {
    gameState.activeTab = tabId;
    dom.farms.crops.view.style.display = (tabId === 'crops') ? 'flex' : 'none';
    dom.farms.animals.view.style.display = (tabId === 'animals') ? 'flex' : 'none';

    dom.cropsBtn.classList.toggle('active', tabId === 'crops');
    dom.animalsBtn.classList.toggle('active', tabId === 'animals');
    updateUI();
}



function renderShop(farmType) {
    const shopContainer = dom.farms[farmType].shop;
    const items = gameState.data[farmType];
    shopContainer.innerHTML = '';

    Object.values(items).forEach(item => {
        const btn = document.createElement('button');
        btn.className = `shop-btn ${gameState.farms[farmType].selectedSeed === item.id ? 'selected' : ''}`;
        btn.dataset.itemId = item.id;
        btn.innerHTML = `
            <span class="btn-icon">${item.icon}</span>
            <div class="btn-info">
                <span class="btn-name">${item.name} (Sell: 🪙${item.sell})</span>
                <span class="btn-cost">Cost: 🪙${item.cost} | ${item.time}s</span>
            </div>
        `;
        btn.onclick = () => selectItem(farmType, item.id, btn);
        shopContainer.appendChild(btn);
    });
}

function selectItem(farmType, id, btnElement) {
    gameState.farms[farmType].selectedSeed = id;
    const shopContainer = dom.farms[farmType].shop;
    shopContainer.querySelectorAll('.shop-btn').forEach(btn => btn.classList.remove('selected'));
    btnElement.classList.add('selected');
    updateUI();
}

function getFieldCost(farmType) {
    const tier1Count = gameState.farms[farmType].plots.filter(p => p.tier === 1).length;
    return Math.floor(50 * Math.pow(1.5, tier1Count));
}

function createFields(farmType, count) {
    gameState.farms[farmType].plots = [];
    for (let i = 0; i < count; i++) {
        addField(farmType, 1);
    }
}

function addField(farmType, tier = 1) {
    const fieldEl = document.createElement('div');
    fieldEl.className = 'field empty';

    let innerHtml = `
        <span class="crop-icon"></span>
        <div class="progress-bar-container">
            <div class="progress-bar"></div>
        </div>
    `;

    fieldEl.innerHTML = innerHtml;

    const plot = {
        state: 'empty',
        crop: null,
        timeStarted: 0,
        tier: tier,
        el: fieldEl
    };

    gameState.farms[farmType].plots.push(plot);

    fieldEl.onmousedown = (e) => {
        if (e.button === 0) interactField(farmType, plot);
    };
    fieldEl.onmouseenter = () => {
        if (isMouseDown) interactField(farmType, plot);
    };
    fieldEl.ondragstart = (e) => e.preventDefault();
}

function buyField(farmType) {
    const cost = getFieldCost(farmType);

    if (gameState.money >= cost) {
        gameState.money -= cost;
        gameState.farms[farmType].fields++;
        addField(farmType, 1);
        renderGrids();
        updateUI();
    }
}

function renderGrids() {
    ['crops', 'animals'].forEach(farmType => {
        const farm = gameState.farms[farmType];
        const gridContainer = dom.farms[farmType].grid;
        gridContainer.innerHTML = '';

        const plotsByTier = {};
        farm.plots.forEach(plot => {
            if (!plotsByTier[plot.tier]) plotsByTier[plot.tier] = [];
            plotsByTier[plot.tier].push(plot);
        });

        const tiers = Object.keys(plotsByTier).map(Number).sort((a, b) => b - a); // Highest tier first

        tiers.forEach(tier => {
            if (tier > 1) {
                const header = document.createElement('h3');
                header.textContent = `Tier ${tier} Prestiged ${farmType === 'crops' ? 'Fields' : 'Pens'}`;
                header.className = 'tier-header';
                gridContainer.appendChild(header);
            }

            const tierGrid = document.createElement('div');
            tierGrid.className = 'tier-grid';

            plotsByTier[tier].forEach(plot => {
                tierGrid.appendChild(plot.el);

                // Update styling based on tier
                if (tier > 1) {
                    plot.el.classList.add('prestige-field');
                    const hue = (tier * 60) % 360;
                    plot.el.style.setProperty('--field-empty', `hsl(${hue}, 40%, 80%)`);
                    plot.el.style.setProperty('--field-planted', `hsl(${hue}, 40%, 60%)`);
                    plot.el.style.setProperty('--glow-color', `hsla(${hue}, 80%, 50%, 0.6)`);

                    if (!plot.el.querySelector('.circular-glow')) {
                        const glow = document.createElement('div');
                        glow.className = 'circular-glow';
                        plot.el.insertBefore(glow, plot.el.firstChild);
                    }
                    if (!plot.el.querySelector('.tier-indicator')) {
                        const ind = document.createElement('div');
                        ind.className = 'tier-indicator';
                        ind.textContent = `x${Math.pow(1.5, tier - 1).toFixed(2)}`;
                        plot.el.appendChild(ind);
                    }
                }
            });
            gridContainer.appendChild(tierGrid);
        });
    });
}

function openPrestigeModal(farmType, tier) {
    pendingPrestige = { farmType, tier };
    dom.prestigeModalTitle.textContent = `Prestige Tier ${tier}?`;
    dom.prestigeModalDesc.textContent = `Are you sure you want to merge 9 Tier ${tier} fields into 1 Tier ${tier + 1} field? This cannot be undone.`;
    dom.prestigeModal.style.display = 'flex';
}

function closePrestigeModal() {
    dom.prestigeModal.style.display = 'none';
    pendingPrestige = null;
}

function confirmPrestige() {
    if (!pendingPrestige) return;
    const { farmType, tier } = pendingPrestige;
    const farm = gameState.farms[farmType];

    let removed = 0;
    farm.plots = farm.plots.filter(plot => {
        if (plot.tier === tier && removed < 9) {
            removed++;
            return false;
        }
        return true;
    });

    if (removed === 9) {
        addField(farmType, tier + 1);
        renderGrids();
        updateUI();
    }

    closePrestigeModal();
}

function saveGame() {
    const saveData = {
        money: gameState.money,
        activeTab: gameState.activeTab,
        animalFarmUnlocked: gameState.animalFarmUnlocked,
        farms: {
            crops: {
                fields: gameState.farms.crops.fields,
                plots: gameState.farms.crops.plots.map(p => ({
                    state: p.state,
                    crop: p.crop,
                    timeStarted: p.timeStarted,
                    tier: p.tier
                }))
            },
            animals: {
                fields: gameState.farms.animals.fields,
                plots: gameState.farms.animals.plots.map(p => ({
                    state: p.state,
                    crop: p.crop,
                    timeStarted: p.timeStarted,
                    tier: p.tier
                }))
            }
        }
    };
    localStorage.setItem('idleFarmerSave', JSON.stringify(saveData));
}

function loadGame() {
    const saveData = localStorage.getItem('idleFarmerSave');
    if (!saveData) return false;

    try {
        const parsed = JSON.parse(saveData);
        gameState.money = parsed.money;
        gameState.activeTab = parsed.activeTab || 'crops';
        gameState.animalFarmUnlocked = parsed.animalFarmUnlocked || false;

        ['crops', 'animals'].forEach(farmType => {
            if (parsed.farms && parsed.farms[farmType]) {
                const savedFarm = parsed.farms[farmType];
                gameState.farms[farmType].fields = savedFarm.fields || 4;
                gameState.farms[farmType].plots = [];

                (savedFarm.plots || []).forEach(savedPlot => {
                    const plot = {
                        state: savedPlot.state,
                        crop: savedPlot.crop,
                        timeStarted: savedPlot.timeStarted,
                        tier: savedPlot.tier || 1
                    };

                    const fieldEl = document.createElement('div');
                    fieldEl.className = `field ${plot.state}`;

                    let iconStr = '';
                    if (plot.crop && gameState.data[farmType][plot.crop]) {
                        iconStr = gameState.data[farmType][plot.crop].icon;
                    }

                    const barWidth = plot.state === 'ready' ? '100%' : '0%';

                    let innerHtml = `
                        <span class="crop-icon">${iconStr}</span>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${barWidth}"></div>
                        </div>
                    `;

                    fieldEl.innerHTML = innerHtml;
                    plot.el = fieldEl;

                    fieldEl.onmousedown = (e) => {
                        if (e.button === 0) interactField(farmType, plot);
                    };
                    fieldEl.onmouseenter = () => {
                        if (isMouseDown) interactField(farmType, plot);
                    };
                    fieldEl.ondragstart = (e) => e.preventDefault();

                    gameState.farms[farmType].plots.push(plot);
                });
            }
        });
        return true;
    } catch (e) {
        console.error("Failed to load save:", e);
        return false;
    }
}

function wipeSave() {
    if (confirm("Are you sure you want to completely wipe your save game? This cannot be undone!")) {
        localStorage.removeItem('idleFarmerSave');
        location.reload();
    }
}

function showFloatingText(element, text, color = '#15803d') {
    const floating = document.createElement('div');
    floating.className = 'floating-text';
    floating.textContent = text;
    floating.style.color = color;
    const offsetLeft = Math.random() * 40 - 20;
    floating.style.left = `calc(50% + ${offsetLeft}px)`;
    floating.style.top = '20%';
    element.appendChild(floating);
    setTimeout(() => floating.remove(), 1000);
}

function interactField(farmType, plot) {
    const farm = gameState.farms[farmType];

    if (plot.state === 'ready') {
        // Harvest
        const itemData = gameState.data[farmType][plot.crop];

        const tierMultiplier = plot.tier ? Math.pow(1.5, plot.tier - 1) : 1;
        const totalSell = Math.floor(itemData.sell * tierMultiplier);

        gameState.money += totalSell;
        showFloatingText(plot.el, `+🪙${totalSell}`);
        plot.state = 'empty';
        plot.crop = null;
        updateUI();
    } else if (plot.state === 'empty') {
        const itemData = gameState.data[farmType][farm.selectedSeed];
        if (gameState.money >= itemData.cost) {
            gameState.money -= itemData.cost;
            plot.state = 'planted';
            plot.crop = farm.selectedSeed;
            plot.timeStarted = Date.now();
            updateUI();
        } else {
            const moneyIcon = document.querySelector('.stat-box');
            moneyIcon.style.animation = 'none';
            void moneyIcon.offsetWidth;
            moneyIcon.style.animation = 'pulseError 0.3s 2';
        }
    }
}

function updateUI() {
    dom.moneyDisplay.textContent = gameState.money;

    const inventoryBar = document.getElementById('inventory-bar');
    if (gameState.animalFarmUnlocked) {
        dom.unlockAnimalBtn.style.display = 'none';
        dom.tabNav.style.display = 'flex';
    } else {
        dom.unlockAnimalBtn.style.display = 'block';
        dom.unlockAnimalBtn.disabled = gameState.money < gameState.animalFarmCost;
        dom.tabNav.style.display = 'none';
    }

    ['crops', 'animals'].forEach(farmType => {
        const farm = gameState.farms[farmType];
        const ui = dom.farms[farmType];

        const currentCost = getFieldCost(farmType);
        const actionWord = farmType === 'crops' ? 'Field' : 'Pen';
        ui.buyBtn.querySelector('.btn-name').textContent = `Buy ${actionWord}`;
        ui.costDisplay.textContent = `🪙 ${currentCost}`;
        ui.buyBtn.disabled = gameState.money < currentCost;

        ui.buyBtn.style.background = '';
        ui.buyBtn.style.borderColor = 'transparent';

        // Check for prestige options
        ui.prestigeBtnContainer.innerHTML = '';
        const countsByTier = {};
        farm.plots.forEach(p => {
            countsByTier[p.tier] = (countsByTier[p.tier] || 0) + 1;
        });
        Object.keys(countsByTier).sort((a, b) => a - b).forEach(tier => {
            if (countsByTier[tier] >= 9) {
                const btn = document.createElement('button');
                btn.className = 'btn-prestige';
                btn.textContent = `⭐ Prestige Tier ${tier}`;
                btn.onclick = () => openPrestigeModal(farmType, Number(tier));
                ui.prestigeBtnContainer.appendChild(btn);
            }
        });

        const shopBtns = ui.shop.querySelectorAll('.shop-btn');
        Object.values(gameState.data[farmType]).forEach((itemData, index) => {
            const btn = shopBtns[index];
            const costSpan = btn.querySelector('.btn-cost');
            if (gameState.money < itemData.cost) {
                costSpan.style.color = '#ef4444';
            } else {
                costSpan.style.color = '#65a30d';
            }
        });

        farm.plots.forEach((plot) => {
            plot.el.className = `field ${plot.state}`;
            const iconSpan = plot.el.querySelector('.crop-icon');
            if (plot.state === 'empty') {
                iconSpan.textContent = '';
            } else {
                iconSpan.textContent = gameState.data[farmType][plot.crop].icon;
            }
        });
    });
}

function gameLoop() {
    const now = Date.now();
    let uiNeedsUpdate = false;

    if (now - lastSaveTime > 10000) {
        saveGame();
        lastSaveTime = now;
    }

    ['crops', 'animals'].forEach(farmType => {
        const farm = gameState.farms[farmType];
        farm.plots.forEach(plot => {
            if (plot.state === 'planted') {
                const itemData = gameState.data[farmType][plot.crop];
                const tierMultiplier = plot.tier ? Math.pow(1.5, plot.tier - 1) : 1;
                const speedMult = tierMultiplier;
                const elapsed = (now - plot.timeStarted) / 1000;
                const progress = Math.min(elapsed / (itemData.time / speedMult), 1);

                plot.el.querySelector('.progress-bar').style.width = `${progress * 100}%`;

                if (progress >= 1) {
                    plot.state = 'ready';
                    uiNeedsUpdate = true;
                }
            }
        });
    });

    if (uiNeedsUpdate) {
        updateUI();
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', init);
