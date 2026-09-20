/* =====================================
   MANGOTIME ADDON SCRIPT
   F DASH + ACCOUNT SYSTEM
===================================== */

// -------------------------
// DASH SETTINGS
// -------------------------

const DASH_DISTANCE = 120;
const DASH_COOLDOWN = 1000; // 1 second
let lastDashTime = 0;

// Add extra dash values to player after game loads
window.addEventListener("load", () => {

    if (typeof player !== "undefined") {

        player.dashing = false;
        player.dashTimer = 0;

    }

});

// -------------------------
// DASH KEY (F)
// -------------------------

window.addEventListener("keydown", (e) => {

    if (e.code !== "KeyF") return;

    if (typeof player === "undefined") return;

    const now = Date.now();

    if (now - lastDashTime < DASH_COOLDOWN)
        return;

    lastDashTime = now;

    let direction = 1;

    if (keys.left)
        direction = -1;

    player.x += DASH_DISTANCE * direction;

    if (player.x < 10)
        player.x = 10;

    if (player.x > CANVAS_WIDTH - player.width - 10)
        player.x = CANVAS_WIDTH - player.width - 10;

    if (typeof spawnParticles === "function") {

        spawnParticles(
            player.x + player.width / 2,
            player.y + player.height / 2,
            "#00ffff",
            25,
            2
        );

    }

});


// =========================
// ACCOUNT SYSTEM
// =========================

const ACCOUNTS_KEY = "mangotime_accounts";
const CURRENT_USER_KEY = "mangotime_current_user";

function getAccounts() {

    return JSON.parse(
        localStorage.getItem(ACCOUNTS_KEY) || "{}"
    );

}

function saveAccounts(accounts) {

    localStorage.setItem(
        ACCOUNTS_KEY,
        JSON.stringify(accounts)
    );

}

function signup(username, password) {

    username = username.trim();

    const accounts = getAccounts();

    if (accounts[username]) {

        alert("Username already exists.");
        return;

    }

    accounts[username] = {

        password: password,
        wins: 0

    };

    saveAccounts(accounts);

    alert("Account created!");

}

function login(username, password) {

    const accounts = getAccounts();

    if (
        !accounts[username] ||
        accounts[username].password !== password
    ) {

        alert("Wrong username or password.");
        return;

    }

    localStorage.setItem(
        CURRENT_USER_KEY,
        username
    );

    updateAccountPanel();

}

function logout() {

    localStorage.removeItem(
        CURRENT_USER_KEY
    );

    updateAccountPanel();

}

function addWin() {

    const currentUser =
        localStorage.getItem(
            CURRENT_USER_KEY
        );

    if (!currentUser)
        return;

    const accounts = getAccounts();

    accounts[currentUser].wins++;

    saveAccounts(accounts);

    updateAccountPanel();

}

function updateAccountPanel() {

    const stats =
        document.getElementById(
            "accountStats"
        );

    if (!stats)
        return;

    const currentUser =
        localStorage.getItem(
            CURRENT_USER_KEY
        );

    if (!currentUser) {

        stats.innerHTML =
            "Guest Mode";

        return;

    }

    const accounts = getAccounts();

    stats.innerHTML =
        "User: <b>" +
        currentUser +
        "</b><br>Wins: <b>" +
        accounts[currentUser].wins +
        "</b>";

}

// =========================
// ACCOUNT MENU
// =========================

function createAccountUI() {

    const panel =
        document.createElement("div");

    panel.innerHTML = `
    <div id="accountPanel"
    style="
        position:fixed;
        top:20px;
        right:20px;
        z-index:99999;
        background:rgba(0,0,0,.8);
        padding:15px;
        border-radius:12px;
        color:white;
        border:2px solid #00ffff;
        backdrop-filter:blur(8px);
    ">
        <h3>MangoTime Account</h3>

        <div id="accountStats">
        Guest Mode
        </div>

        <br>

        <input
            id="userInput"
            placeholder="Username">

        <br><br>

        <input
            id="passInput"
            type="password"
            placeholder="Password">

        <br><br>

        <button onclick="
            signup(
                document.getElementById('userInput').value,
                document.getElementById('passInput').value
            )
        ">
        Sign Up
        </button>

        <button onclick="
            login(
                document.getElementById('userInput').value,
                document.getElementById('passInput').value
            )
        ">
        Login
        </button>

        <button onclick="logout()">
        Logout
        </button>

    </div>
    `;

    document.body.appendChild(panel);

    updateAccountPanel();

}

// =========================
// WIN TRACKING
// =========================

const originalVictory =
    typeof checkBossPhaseAndDefeat === "function"
        ? checkBossPhaseAndDefeat
        : null;

if (originalVictory) {

    checkBossPhaseAndDefeat =
        function () {

            const oldHP = boss.hp;

            originalVictory();

            if (
                oldHP > 0 &&
                boss.hp <= 0
            ) {

                addWin();

            }

        };

}

// =========================
// COOL WEBSITE BACKGROUND
// =========================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        document.body.style.backgroundImage =
            "url('minecraftgrass.gif')";

        document.body.style.backgroundRepeat =
            "repeat";

        document.body.style.backgroundSize =
            "400px auto";

        createAccountUI();

    }
);