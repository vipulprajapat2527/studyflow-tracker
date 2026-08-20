// ===== LIFEFLOW CORE MODULE ROUTER & THEME ENGINE =====
const MODULE_CONFIG = {
  study: { name: "Study Tracker", icon: "📚", defaultView: "dashboard" },
  habit: { name: "Habit Tracker", icon: "🔁", defaultView: "habits-dashboard" },
  goal: { name: "Goal Tracker", icon: "🎯", defaultView: "goals-dashboard" },
  expense: {
    name: "Expense Tracker",
    icon: "💳",
    defaultView: "expense-dashboard",
  },
  workout: {
    name: "Workout Tracker",
    icon: "🏋️",
    defaultView: "workout-dashboard",
  },
  sleep: { name: "Sleep Tracker", icon: "🌙", defaultView: "sleep-dashboard" },
  water: { name: "Water Tracker", icon: "💧", defaultView: "water-dashboard" },
  step: { name: "Step Tracker", icon: "👟", defaultView: "step-dashboard" },
};

let currentAppModule =
  localStorage.getItem("lifeflow_active_module") || "study";
let currentAppTheme = localStorage.getItem("lifeflow_theme") || "purple";

document.addEventListener("DOMContentLoaded", () => {
  switchLifeFlowModule(currentAppModule);
  applyLifeFlowTheme(currentAppTheme);

  // System Switcher click listener
  document
    .getElementById("systemSwitcherGrid")
    ?.addEventListener("click", (e) => {
      const card = e.target.closest(".system-card");
      if (card) {
        const moduleKey = card.getAttribute("data-app-module");
        if (moduleKey) switchLifeFlowModule(moduleKey);
      }
    });

  // Theme Picker click listener
  document.getElementById("themePickerGrid")?.addEventListener("click", (e) => {
    const swatch = e.target.closest(".theme-swatch");
    if (swatch) {
      const themeName = swatch.getAttribute("data-theme-name");
      if (themeName) applyLifeFlowTheme(themeName);
    }
  });
});

function switchLifeFlowModule(moduleKey) {
  if (!MODULE_CONFIG[moduleKey]) moduleKey = "study";
  currentAppModule = moduleKey;
  localStorage.setItem("lifeflow_active_module", moduleKey);

  // Update body tag for CSS module isolation rules
  document.body.setAttribute("data-active-module", moduleKey);

  // Update Settings system cards UI
  document.querySelectorAll(".system-card").forEach((card) => {
    if (card.getAttribute("data-app-module") === moduleKey) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });

  // Open default view for the selected module
  const targetView = MODULE_CONFIG[moduleKey].defaultView;
  openView(targetView);
}

function applyLifeFlowTheme(themeName) {
  currentAppTheme = themeName || "purple";
  localStorage.setItem("lifeflow_theme", currentAppTheme);
  document.body.setAttribute("data-color-theme", currentAppTheme);

  // Update theme swatch active state
  document.querySelectorAll(".theme-swatch").forEach((swatch) => {
    if (swatch.getAttribute("data-theme-name") === currentAppTheme) {
      swatch.classList.add("active");
    } else {
      swatch.classList.remove("active");
    }
  });
}

function openView(viewName) {
  if (!viewName) return;

  // Deactivate all views
  document.querySelectorAll(".view").forEach((v) => {
    v.style.display = "none";
    v.classList.remove("active");
  });

  // Deactivate all nav items
  document
    .querySelectorAll(".nav-item")
    .forEach((b) => b.classList.remove("active"));

  // Target view
  const target = document.getElementById("view-" + viewName);
  if (target) {
    target.style.display = "block";
    target.classList.add("active");
  }

  // Highlight active nav item matching viewName
  document
    .querySelectorAll(`.nav-item[data-view="${viewName}"]`)
    .forEach((btn) => {
      btn.classList.add("active");
    });
}

// Global Nav & View Click Handler
document.addEventListener("click", (e) => {
  const navButton = e.target.closest(".nav-item");
  if (navButton) {
    const view = navButton.getAttribute("data-view");
    if (view) openView(view);
  }
});

// 2. Temporary Check: Kya user pehle se logged in hai?
const authScreen = document.getElementById("authScreen");
if (localStorage.getItem("userLoggedIn") === "true") {
  if (authScreen) authScreen.style.setProperty("display", "none", "important");
} else {
  if (authScreen) authScreen.style.setProperty("display", "flex", "important");
}
const STORAGE_KEY = "studyTrackerData";
const POMO_STUDY = 0;
const POMO_BREAK = 0;
const RING_CIRCUMFERENCE = 2 * Math.PI * 90;

const SUBJECT_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
];

const QUOTES = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
  },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
  },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown",
  },
];

const RANKS = [
  { id: "beginner", name: "Beginner", icon: "🌱", minHours: 0, maxHours: 10 },
  { id: "warrior", name: "Warrior", icon: "⚔️", minHours: 10, maxHours: 50 },
  {
    id: "master",
    name: "Master",
    icon: "👑",
    minHours: 50,
    maxHours: Infinity,
  },
];

const ACHIEVEMENTS = [
  {
    id: "first_session",
    name: "First Steps",
    icon: "🚀",
    desc: "Complete your first study session",
  },
  { id: "streak_3", name: "On Fire", icon: "🔥", desc: "Reach a 3-day streak" },
  {
    id: "streak_7",
    name: "Unstoppable",
    icon: "💪",
    desc: "Reach a 7-day streak",
  },
  {
    id: "goal_met",
    name: "Goal Crusher",
    icon: "🎯",
    desc: "Meet your daily study goal",
  },
  {
    id: "pomodoro_5",
    name: "Pomodoro Pro",
    icon: "🍅",
    desc: "Complete 5 pomodoro sessions",
  },
  {
    id: "hours_10",
    name: "Dedicated",
    icon: "📖",
    desc: "Study for 10 total hours",
  },
  {
    id: "hours_50",
    name: "Scholar",
    icon: "🎓",
    desc: "Study for 50 total hours",
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    icon: "🏆",
    desc: "Study every day for a week",
  },
];

let state = loadState();
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let activeSubjectId = null;

let pomoInterval = null;
let pomoSeconds = POMO_STUDY;
let pomoRunning = false;
let pomoPhase = "study";
let pomoSubjectId = null;
let pomoSessionsToday = 0;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const els = {
  greeting: $("#greeting"),
  currentDate: $("#currentDate"),
  themeToggle: $("#themeToggle"),
  menuToggle: $("#menuToggle"),
  sidebar: $("#sidebar"),
  streakCount: $("#streakCount"),
  todayTotal: $("#todayTotal"),
  goalDisplay: $("#goalDisplay"),
  allTimeTotal: $("#allTimeTotal"),
  progressPercent: $("#progressPercent"),
  progressFill: $("#progressFill"),
  progressSubtext: $("#progressSubtext"),
  motivationalQuote: $("#motivationalQuote"),
  quoteAuthor: $("#quoteAuthor"),
  examCountdown: $("#examCountdown"),
  dailyAnalytics: $("#dailyAnalytics"),
  timerDisplay: $("#timerDisplay"),
  timerSubject: $("#timerSubject"),
  startBtn: $("#startBtn"),
  pauseBtn: $("#pauseBtn"),
  stopBtn: $("#stopBtn"),
  timerStatus: $("#timerStatus"),
  timerCard: $("#freeTimerPanel"),
  freeRingProgress: $("#freeRingProgress"),
  pomodoroDisplay: $("#pomodoroDisplay"),
  pomodoroSubject: $("#pomodoroSubject"),
  pomoStartBtn: $("#pomoStartBtn"),
  pomoPauseBtn: $("#pomoPauseBtn"),
  pomoSkipBtn: $("#pomoSkipBtn"),
  pomodoroStatus: $("#pomodoroStatus"),
  pomodoroPhase: $("#pomodoroPhase"),
  pomoRingProgress: $("#pomoRingProgress"),
  pomodoroToday: $("#pomodoroToday"),
  pomodoroTotal: $("#pomodoroTotal"),
  subjectList: $("#subjectList"),
  emptySubjects: $("#emptySubjects"),
  weeklyChart: $("#weeklyChart"),
  weekTotal: $("#weekTotal"),
  weekAverage: $("#weekAverage"),
  dailyGoal: $("#dailyGoal"),
  saveGoalBtn: $("#saveGoalBtn"),
  examName: $("#examName"),
  examDate: $("#examDate"),
  saveExamBtn: $("#saveExamBtn"),
  soundToggle: $("#soundToggle"),
  addSubjectBtn: $("#addSubjectBtn"),
  subjectModal: $("#subjectModal"),
  closeModal: $("#closeModal"),
  cancelModal: $("#cancelModal"),
  subjectForm: $("#subjectForm"),
  subjectName: $("#subjectName"),
  colorPicker: $("#colorPicker"),
  rankBadge: $("#rankBadge"),
  rankTitle: $("#rankTitle"),
  rankXP: $("#rankXP"),
  badgePreview: $("#badgePreview"),
  badgeGrid: $("#badgeGrid"),
  badgeCount: $("#badgeCount"),
  badgeTotal: $("#badgeTotal"),
  rankShowcase: $("#rankShowcase"),
  bestDay: $("#bestDay"),
  weekComparison: $("#weekComparison"),
  activeSubjects: $("#activeSubjects"),
  dailyBreakdown: $("#dailyBreakdown"),
  weeklyBreakdown: $("#weeklyBreakdown"),
  subjectChart: $("#subjectChart"),
  studyHeatmap: $("#studyHeatmap"),
  achievementToast: $("#achievementToast"),
  achievementToastIcon: $("#achievementToastIcon"),
  achievementToastName: $("#achievementToastName"),
};

function defaultState() {
  return {
    subjects: [],
    sessions: [],
    settings: {
      dailyGoalMinutes: 120,
      darkMode: false,
      soundEnabled: true,
      examName: "",
      examDate: null,
    },
    streak: { current: 0, lastStudyDate: null },
    achievements: [],
    pomodoro: { totalSessions: 0, todayDate: null, todaySessions: 0 },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const def = defaultState();
    return {
      ...def,
      ...parsed,
      settings: { ...def.settings, ...parsed.settings },
      streak: { ...def.streak, ...parsed.streak },
      achievements: parsed.achievements || [],
      pomodoro: { ...def.pomodoro, ...parsed.pomodoro },
    };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return "0m";
}

function formatTimer(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

function formatPomodoro(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getTotalSeconds() {
  return state.sessions.reduce((sum, s) => sum + s.seconds, 0);
}

function getSessionsForDate(dateStr) {
  return state.sessions.filter((s) => s.date === dateStr);
}

function getTotalSecondsForDate(dateStr) {
  return getSessionsForDate(dateStr).reduce((sum, s) => sum + s.seconds, 0);
}

function getSubjectSeconds(subjectId, dateStr) {
  return state.sessions
    .filter(
      (s) => s.subjectId === subjectId && (!dateStr || s.date === dateStr),
    )
    .reduce((sum, s) => sum + s.seconds, 0);
}

function getWeekDates(offsetWeeks = 0) {
  const dates = [];
  const today = new Date();
  const startOffset = offsetWeeks * 7;
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i - startOffset);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

function getRank() {
  const hours = getTotalSeconds() / 3600;
  if (hours >= 50) return RANKS[2];
  if (hours >= 10) return RANKS[1];
  return RANKS[0];
}

function getNextRank() {
  const rank = getRank();
  const idx = RANKS.indexOf(rank);
  return idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
}

function updateStreak() {
  const today = todayStr();
  const todaySeconds = getTotalSecondsForDate(today);
  const goalSeconds = state.settings.dailyGoalMinutes * 60;
  const metGoal = todaySeconds >= goalSeconds;
  const { lastStudyDate, current } = state.streak;

  if (metGoal && lastStudyDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    state.streak.current = lastStudyDate === yesterdayStr ? current + 1 : 1;
    state.streak.lastStudyDate = today;
  }
}

function checkAchievements() {
  const unlocked = new Set(state.achievements);
  const totalSeconds = getTotalSeconds();
  const totalHours = totalSeconds / 3600;
  const today = todayStr();
  const todaySeconds = getTotalSecondsForDate(today);
  const goalSeconds = state.settings.dailyGoalMinutes * 60;

  const checks = {
    first_session: totalSeconds > 0,
    streak_3: state.streak.current >= 3,
    streak_7: state.streak.current >= 7,
    goal_met: todaySeconds >= goalSeconds,
    pomodoro_5: state.pomodoro.totalSessions >= 5,
    hours_10: totalHours >= 10,
    hours_50: totalHours >= 50,
    week_warrior: getWeekDates().every((d) => getTotalSecondsForDate(d) > 0),
  };

  ACHIEVEMENTS.forEach((a) => {
    if (!unlocked.has(a.id) && checks[a.id]) {
      state.achievements.push(a.id);
      showAchievementToast(a);
    }
  });
}

function showAchievementToast(achievement) {
  els.achievementToastIcon.textContent = achievement.icon;
  els.achievementToastName.textContent = achievement.name;
  els.achievementToast.hidden = false;
  playSound("achievement");
  setTimeout(() => {
    els.achievementToast.hidden = true;
  }, 4000);
}

let audioCtx = null;

function playSound(type) {
  if (!state.settings.soundEnabled) return;
  try {
    if (!audioCtx)
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtx;
    const now = ctx.currentTime;

    if (type === "timer") {
      [0, 0.15, 0.3].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880 - i * 110;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.3, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.2);
        osc.start(now + delay);
        osc.stop(now + delay + 0.2);
      });
    } else if (type === "achievement") {
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.2, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.15);
      });
    }
  } catch {
    /* audio not available */
  }
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove("show"), 2500);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function applyTheme() {
  document.documentElement.setAttribute(
    "data-theme",
    state.settings.darkMode ? "dark" : "light",
  );
}

function setRingProgress(el, current, total) {
  if (!el) return;
  const offset = RING_CIRCUMFERENCE - (current / total) * RING_CIRCUMFERENCE;
  el.style.strokeDashoffset = Math.max(0, offset);
}

function navigateTo(view) {
  $$(".view").forEach((v) => v.classList.remove("view--active"));
  $$(".nav-item, .mobile-nav__item").forEach((n) =>
    n.classList.remove("active"),
  );
  const target = $(`#view-${view}`);
  if (target) target.classList.add("view--active");
  $$(`[data-view="${view}"]`).forEach((n) => n.classList.add("active"));
  els.sidebar.classList.remove("open");
  document.getElementById("sidebarOverlay")?.classList.remove("active");
  document.body.classList.remove("sidebar-open");
}

function renderGreeting() {
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";
  els.greeting.textContent = greeting;

  els.currentDate.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderQuote() {
  const dayIndex = Math.floor(Date.now() / 86400000) % QUOTES.length;
  const q = QUOTES[dayIndex];
  els.motivationalQuote.textContent = q.text;
  els.quoteAuthor.textContent = `— ${q.author}`;
}

function renderExamCountdown() {
  const { examName, examDate } = state.settings;
  if (!examDate) {
    els.examCountdown.innerHTML =
      '<div class="exam-countdown exam-countdown--empty"><span>Set an exam date in Settings to start countdown</span></div>';
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate + "T00:00:00");
  const diff = Math.ceil((exam - today) / 86400000);

  if (diff < 0) {
    els.examCountdown.innerHTML = `<div class="exam-countdown"><p class="exam-countdown__name">${escapeHtml(examName || "Exam")}</p><p class="exam-countdown__days">Done!</p><p class="exam-countdown__label">Exam has passed</p></div>`;
    return;
  }

  els.examCountdown.innerHTML = `
      <div class="exam-countdown">
        <p class="exam-countdown__name">${escapeHtml(examName || "Upcoming Exam")}</p>
        <p class="exam-countdown__days">${diff}</p>
        <p class="exam-countdown__label">${diff === 1 ? "day left" : "days left"}</p>
        <p class="exam-countdown__date">${exam.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
      </div>`;
}

function renderRank() {
  const rank = getRank();
  const next = getNextRank();
  const hours = getTotalSeconds() / 3600;

  els.rankBadge.className = `rank-badge rank-badge--${rank.id}`;
  els.rankTitle.textContent = rank.name;
  els.rankXP.textContent = `${formatDuration(getTotalSeconds())} studied`;

  const progressToNext = next
    ? ((hours - rank.minHours) / (next.minHours - rank.minHours)) * 100
    : 100;

  els.rankShowcase.innerHTML = `
      <div class="rank-showcase__icon">${rank.icon}</div>
      <p class="rank-showcase__title">${rank.name}</p>
      <p class="rank-showcase__desc">${formatDuration(getTotalSeconds())} total study time</p>
      ${
        next
          ? `
        <div class="rank-showcase__progress"><div class="rank-showcase__progress-fill" style="width:${Math.min(100, progressToNext)}%"></div></div>
        <p class="rank-showcase__next">${formatDuration((next.minHours - hours) * 3600)} until ${next.icon} ${next.name}</p>
      `
          : '<p class="rank-showcase__next">You\'ve reached the highest rank!</p>'
      }`;
}

function renderStats() {
  const todaySeconds = getTotalSecondsForDate(todayStr());
  const goalSeconds = state.settings.dailyGoalMinutes * 60;
  const percent =
    goalSeconds > 0
      ? Math.min(100, Math.round((todaySeconds / goalSeconds) * 100))
      : 0;

  els.streakCount.textContent = `${state.streak.current} day${state.streak.current !== 1 ? "s" : ""}`;
  els.todayTotal.textContent = formatDuration(todaySeconds);
  els.goalDisplay.textContent = formatDuration(goalSeconds);
  els.allTimeTotal.textContent = formatDuration(getTotalSeconds());
  els.progressPercent.textContent = `${percent}%`;
  els.progressFill.style.width = `${percent}%`;
  els.progressSubtext.textContent = `${formatDuration(todaySeconds)} of ${formatDuration(goalSeconds)} studied today`;
  els.progressFill.style.background =
    percent >= 100
      ? "linear-gradient(90deg, var(--success), #34d399)"
      : "linear-gradient(90deg, var(--primary), var(--accent))";
}

function renderDailyAnalytics() {
  const today = todayStr();
  const todaySeconds = getTotalSecondsForDate(today);
  const goalSeconds = state.settings.dailyGoalMinutes * 60;
  const subjectsToday = state.subjects.filter(
    (s) => getSubjectSeconds(s.id, today) > 0,
  ).length;
  const pomoToday =
    state.pomodoro.todayDate === today ? state.pomodoro.todaySessions : 0;

  els.dailyAnalytics.innerHTML = `
      <div class="analytics-item"><span class="analytics-item__label">Goal Progress</span><span class="analytics-item__value">${goalSeconds > 0 ? Math.round((todaySeconds / goalSeconds) * 100) : 0}%</span></div>
      <div class="analytics-item"><span class="analytics-item__label">Subjects Today</span><span class="analytics-item__value">${subjectsToday}</span></div>
      <div class="analytics-item"><span class="analytics-item__label">Pomodoros</span><span class="analytics-item__value">${pomoToday}</span></div>
      <div class="analytics-item"><span class="analytics-item__label">Sessions</span><span class="analytics-item__value">${getSessionsForDate(today).length}</span></div>`;
}

function renderSubjectSelects() {
  [els.timerSubject, els.pomodoroSubject].forEach((select) => {
    const current = select.value;
    select.innerHTML = '<option value="">Select a subject</option>';
    state.subjects.forEach((sub) => {
      const opt = document.createElement("option");
      opt.value = sub.id;
      opt.textContent = sub.name;
      select.appendChild(opt);
    });
    if (current && state.subjects.some((s) => s.id === current))
      select.value = current;
  });
}

function renderSubjects() {
  renderSubjectSelects();
  els.subjectList
    .querySelectorAll(".subject-item")
    .forEach((el) => el.remove());

  if (state.subjects.length === 0) {
    els.emptySubjects.hidden = false;
    return;
  }
  els.emptySubjects.hidden = true;

  const maxSubjectSeconds = Math.max(
    ...state.subjects.map((s) => getSubjectSeconds(s.id, todayStr())),
    1,
  );

  state.subjects.forEach((sub) => {
    const totalAll = getSubjectSeconds(sub.id);
    const totalToday = getSubjectSeconds(sub.id, todayStr());
    const barPercent = (totalToday / maxSubjectSeconds) * 100;

    const li = document.createElement("li");
    li.className = "subject-item";
    li.innerHTML = `
        <span class="subject-item__dot" style="background:${sub.color}"></span>
        <div class="subject-item__info">
          <p class="subject-item__name">${escapeHtml(sub.name)}</p>
          <p class="subject-item__time">${formatDuration(totalToday)} today · ${formatDuration(totalAll)} total</p>
        </div>
        <div class="subject-item__bar"><div class="subject-item__bar-fill" style="width:${barPercent}%;background:${sub.color}"></div></div>
        <button class="btn btn--danger btn-icon btn-icon--sm subject-item__delete" aria-label="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>`;
    li.querySelector(".subject-item__delete").addEventListener("click", () =>
      deleteSubject(sub.id),
    );
    els.subjectList.appendChild(li);
  });
}

function renderWeeklyChart() {
  const dates = getWeekDates();
  const today = todayStr();
  const maxSeconds = Math.max(...dates.map(getTotalSecondsForDate), 1);
  let weekTotalSeconds = 0;

  els.weeklyChart.innerHTML = "";
  dates.forEach((dateStr, i) => {
    const seconds = getTotalSecondsForDate(dateStr);
    weekTotalSeconds += seconds;
    const heightPercent = (seconds / maxSeconds) * 100;
    const d = new Date(dateStr + "T12:00:00");
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
    const isToday = dateStr === today;

    const group = document.createElement("div");
    group.className = "chart-bar-group";
    group.innerHTML = `
        <div class="chart-bar-wrapper">
          <div class="chart-bar" style="height:${Math.max(heightPercent, seconds > 0 ? 8 : 4)}%;animation-delay:${i * 0.05}s">
            <span class="chart-bar__tooltip">${formatDuration(seconds)}</span>
          </div>
        </div>
        <span class="chart-bar__label${isToday ? " chart-bar__label--today" : ""}">${dayLabel}</span>`;
    els.weeklyChart.appendChild(group);
  });

  const daysWithStudy =
    dates.filter((d) => getTotalSecondsForDate(d) > 0).length || 1;
  els.weekTotal.textContent = formatDuration(weekTotalSeconds);
  els.weekAverage.textContent = formatDuration(
    Math.round(weekTotalSeconds / daysWithStudy),
  );
}

function renderAnalytics() {
  const thisWeek = getWeekDates(0);
  const lastWeek = getWeekDates(1);

  const thisWeekTotal = thisWeek.reduce(
    (s, d) => s + getTotalSecondsForDate(d),
    0,
  );
  const lastWeekTotal = lastWeek.reduce(
    (s, d) => s + getTotalSecondsForDate(d),
    0,
  );

  let bestDay = "—";
  let bestSeconds = 0;
  thisWeek.forEach((d) => {
    const sec = getTotalSecondsForDate(d);
    if (sec > bestSeconds) {
      bestSeconds = sec;
      bestDay = new Date(d + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "short",
      });
    }
  });
  els.bestDay.textContent =
    bestSeconds > 0 ? `${bestDay} (${formatDuration(bestSeconds)})` : "—";

  if (lastWeekTotal > 0) {
    const change = Math.round(
      ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100,
    );
    const sign = change >= 0 ? "+" : "";
    els.weekComparison.textContent = `${sign}${change}%`;
    els.weekComparison.className = `stat-card__value ${change >= 0 ? "stat-card__value--up" : "stat-card__value--down"}`;
  } else {
    els.weekComparison.textContent = thisWeekTotal > 0 ? "New!" : "—";
    els.weekComparison.className = "stat-card__value";
  }

  const today = todayStr();
  els.activeSubjects.textContent = state.subjects.filter(
    (s) => getSubjectSeconds(s.id, today) > 0 || getSubjectSeconds(s.id) > 0,
  ).length;

  const todaySeconds = getTotalSecondsForDate(today);
  const goalSeconds = state.settings.dailyGoalMinutes * 60;
  els.dailyBreakdown.innerHTML = `
      <div class="analytics-row"><span class="analytics-row__label">Total studied</span><span class="analytics-row__value">${formatDuration(todaySeconds)}</span></div>
      <div class="analytics-row"><span class="analytics-row__label">Goal remaining</span><span class="analytics-row__value">${formatDuration(Math.max(0, goalSeconds - todaySeconds))}</span></div>
      <div class="analytics-row"><span class="analytics-row__label">Completion</span><span class="analytics-row__value">${goalSeconds > 0 ? Math.round((todaySeconds / goalSeconds) * 100) : 0}%</span></div>
      <div class="analytics-row"><span class="analytics-row__label">Current streak</span><span class="analytics-row__value">${state.streak.current} days</span></div>`;

  els.weeklyBreakdown.innerHTML = `
      <div class="analytics-row"><span class="analytics-row__label">This week total</span><span class="analytics-row__value">${formatDuration(thisWeekTotal)}</span></div>
      <div class="analytics-row"><span class="analytics-row__label">Last week total</span><span class="analytics-row__value">${formatDuration(lastWeekTotal)}</span></div>
      <div class="analytics-row"><span class="analytics-row__label">Best day</span><span class="analytics-row__value">${bestDay}</span></div>
      <div class="analytics-row"><span class="analytics-row__label">Pomodoro sessions</span><span class="analytics-row__value">${state.pomodoro.totalSessions}</span></div>`;

  renderSubjectChart();
  renderHeatmap();
}

function renderSubjectChart() {
  if (state.subjects.length === 0) {
    els.subjectChart.innerHTML =
      '<p class="subject-chart__empty">Add subjects and start studying to see progress</p>';
    return;
  }

  const totals = state.subjects
    .map((s) => ({
      ...s,
      seconds: getSubjectSeconds(s.id),
    }))
    .filter((s) => s.seconds > 0)
    .sort((a, b) => b.seconds - a.seconds);

  if (totals.length === 0) {
    els.subjectChart.innerHTML =
      '<p class="subject-chart__empty">No study data yet</p>';
    return;
  }

  const max = totals[0].seconds;
  els.subjectChart.innerHTML = totals
    .map(
      (s, i) => `
      <div class="subject-chart__row">
        <span class="subject-chart__label" style="color:${s.color}">${escapeHtml(s.name)}</span>
        <div class="subject-chart__bar-wrap">
          <div class="subject-chart__bar" style="width:${(s.seconds / max) * 100}%;background:${s.color};animation-delay:${i * 0.08}s">
            <span>${formatDuration(s.seconds)}</span>
          </div>
        </div>
      </div>`,
    )
    .join("");
}

function renderHeatmap() {
  const weeks = 12;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (weeks * 7 - 1));
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const allDays = [];
  const endDate = new Date(today);
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    allDays.push(new Date(d));
  }

  const maxSeconds = Math.max(
    ...allDays.map((d) =>
      getTotalSecondsForDate(d.toISOString().split("T")[0]),
    ),
    1,
  );

  function getLevel(seconds) {
    if (seconds === 0) return 0;
    const ratio = seconds / maxSeconds;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  }

  const weekCols = [];
  let currentWeek = [];
  allDays.forEach((d, i) => {
    currentWeek.push(d);
    if (d.getDay() === 6 || i === allDays.length - 1) {
      weekCols.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const months = [];
  let lastMonth = -1;
  weekCols.forEach((week) => {
    const m = week[0].getMonth();
    if (m !== lastMonth) {
      months.push({
        name: week[0].toLocaleDateString("en-US", { month: "short" }),
        span: 1,
      });
      lastMonth = m;
    } else {
      months[months.length - 1].span++;
    }
  });

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  let html = '<div class="heatmap__months">';
  months.forEach((m) => {
    html += `<span class="heatmap__month" style="width:${m.span * 17}px">${m.name}</span>`;
  });
  html += '</div><div class="heatmap__grid">';

  html += '<div class="heatmap__days-label">';
  dayLabels.forEach((l) => {
    html += `<span>${l}</span>`;
  });
  html += '</div><div class="heatmap__cells">';

  const maxWeekLen = Math.max(...weekCols.map((w) => w.length));
  for (let row = 0; row < maxWeekLen; row++) {
    html += '<div class="heatmap__week">';
    weekCols.forEach((week) => {
      const d = week[row];
      if (!d) {
        html +=
          '<div class="heatmap-cell heatmap-cell--0" style="visibility:hidden"></div>';
      } else {
        const dateStr = d.toISOString().split("T")[0];
        const seconds = getTotalSecondsForDate(dateStr);
        const level = getLevel(seconds);
        const label = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        html += `<div class="heatmap-cell heatmap-cell--${level}" data-tooltip="${label}: ${formatDuration(seconds)}"></div>`;
      }
    });
    html += "</div>";
  }

  html += "</div></div>";
  els.studyHeatmap.innerHTML = html;
}

function renderBadges() {
  const unlocked = new Set(state.achievements);
  els.badgeTotal.textContent = ACHIEVEMENTS.length;
  els.badgeCount.textContent = unlocked.size;

  els.badgePreview.innerHTML = ACHIEVEMENTS.slice(0, 5)
    .map(
      (a) => `
      <div class="badge-preview__item${unlocked.has(a.id) ? " badge-preview__item--unlocked" : ""}">
        <span class="badge-preview__icon">${a.icon}</span>
        <span class="badge-preview__name">${a.name}</span>
      </div>`,
    )
    .join("");

  els.badgeGrid.innerHTML = ACHIEVEMENTS.map(
    (a) => `
      <div class="badge-card${unlocked.has(a.id) ? " badge-card--unlocked" : ""}">
        <span class="badge-card__icon">${a.icon}</span>
        <span class="badge-card__name">${a.name}</span>
        <span class="badge-card__desc">${a.desc}</span>
      </div>`,
  ).join("");
}

function renderPomodoroStats() {
  const today = todayStr();
  if (state.pomodoro.todayDate !== today) {
    state.pomodoro.todayDate = today;
    state.pomodoro.todaySessions = 0;
  }
  els.pomodoroToday.textContent = state.pomodoro.todaySessions;
  els.pomodoroTotal.textContent = state.pomodoro.totalSessions;
}

function renderSettings() {
  els.dailyGoal.value = state.settings.dailyGoalMinutes;
  els.examName.value = state.settings.examName || "";
  els.examDate.value = state.settings.examDate || "";
  els.soundToggle.checked = state.settings.soundEnabled;
}

function renderAll() {
  updateStreak();
  checkAchievements();
  renderGreeting();
  renderQuote();
  renderExamCountdown();
  renderRank();
  renderStats();
  renderDailyAnalytics();
  renderSubjects();
  renderWeeklyChart();
  renderAnalytics();
  renderBadges();
  renderPomodoroStats();
  renderSettings();
  saveState();
}

function initColorPicker() {
  let selectedColor = SUBJECT_COLORS[0];
  els.colorPicker.innerHTML = "";
  SUBJECT_COLORS.forEach((color, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "color-option" + (i === 0 ? " selected" : "");
    btn.style.background = color;
    btn.addEventListener("click", () => {
      els.colorPicker
        .querySelectorAll(".color-option")
        .forEach((el) => el.classList.remove("selected"));
      btn.classList.add("selected");
      selectedColor = color;
    });
    els.colorPicker.appendChild(btn);
  });
  els.colorPicker._getSelected = () => selectedColor;
}

function openModal() {
  els.subjectModal.hidden = false;
  els.subjectName.value = "";
  els.subjectName.focus();
}

function closeModalFn() {
  els.subjectModal.hidden = true;
}

function addSubject(name, color) {
  const trimmed = name.trim();
  if (!trimmed) return;
  if (
    state.subjects.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())
  ) {
    showToast("Subject already exists");
    return;
  }
  state.subjects.push({ id: generateId(), name: trimmed, color });
  renderAll();
  showToast(`Added "${trimmed}"`);
  closeModalFn();
}

function deleteSubject(id) {
  const sub = state.subjects.find((s) => s.id === id);
  if (!sub || !confirm(`Delete "${sub.name}" and all its study data?`)) return;
  state.subjects = state.subjects.filter((s) => s.id !== id);
  state.sessions = state.sessions.filter((s) => s.subjectId !== id);
  if (activeSubjectId === id) stopTimer(false);
  if (pomoSubjectId === id) stopPomodoro();
  renderAll();
  showToast(`Deleted "${sub.name}"`);
}

function recordSession(subjectId, seconds) {
  if (seconds < 1) return;
  const date = todayStr();
  const existing = state.sessions.find(
    (s) => s.subjectId === subjectId && s.date === date,
  );
  if (existing) existing.seconds += seconds;
  else state.sessions.push({ id: generateId(), subjectId, date, seconds });
  renderAll();
}

function updateTimerDisplay() {
  els.timerDisplay.textContent = formatTimer(timerSeconds);
  setRingProgress(els.freeRingProgress, timerSeconds % 3600, 3600);
}

function setTimerButtons() {
  els.startBtn.disabled = timerRunning;
  els.pauseBtn.disabled = !timerRunning;
  els.stopBtn.disabled = timerSeconds === 0 && !timerRunning;
  els.timerSubject.disabled = timerRunning || timerSeconds > 0;
  els.timerCard.classList.toggle("timer-active", timerRunning);
}

function startTimer() {
  const subjectId = els.timerSubject.value;
  if (!subjectId) {
    showToast("Please select a subject first");
    return;
  }
  activeSubjectId = subjectId;
  timerRunning = true;
  const sub = state.subjects.find((s) => s.id === subjectId);
  els.timerStatus.textContent = `Studying ${sub ? sub.name : "..."}`;
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
  }, 1000);
  setTimerButtons();
}

function pauseTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerInterval = null;
  els.timerStatus.textContent = "Timer paused";
  setTimerButtons();
}

function stopTimer(saveSession = true) {
  timerRunning = false;
  clearInterval(timerInterval);
  timerInterval = null;
  if (saveSession && activeSubjectId && timerSeconds > 0) {
    recordSession(activeSubjectId, timerSeconds);
    const sub = state.subjects.find((s) => s.id === activeSubjectId);
    showToast(
      `Saved ${formatDuration(timerSeconds)} for ${sub ? sub.name : "subject"}`,
    );
  }
  timerSeconds = 0;
  activeSubjectId = null;
  updateTimerDisplay();
  els.timerStatus.textContent = "Select a subject and press Start";
  setTimerButtons();
}

function updatePomodoroDisplay() {
  els.pomodoroDisplay.textContent = formatPomodoro(pomoSeconds);
  const total = pomoPhase === "study" ? POMO_STUDY : POMO_BREAK;
  setRingProgress(els.pomoRingProgress, total - pomoSeconds, total);
  els.pomoRingProgress.classList.toggle(
    "timer-ring__progress--break",
    pomoPhase === "break",
  );
}

function setPomodoroButtons() {
  els.pomoStartBtn.disabled = pomoRunning;
  els.pomoPauseBtn.disabled = !pomoRunning;
  els.pomoSkipBtn.disabled = !pomoRunning && pomoSeconds === 0;
  els.pomodoroSubject.disabled = pomoRunning;
}

function completePomodoroStudy() {
  if (pomoSubjectId) recordSession(pomoSubjectId, pomoSeconds);
  state.pomodoro.totalSessions++;
  const today = todayStr();
  if (state.pomodoro.todayDate !== today) {
    state.pomodoro.todayDate = today;
    state.pomodoro.todaySessions = 0;
  }
  state.pomodoro.todaySessions++;
  saveState();
  playSound("timer");
  showToast("Pomodoro complete! Time for a break.");
  checkAchievements();
  renderPomodoroStats();
  renderBadges();
}

function startPomodoroPhase() {
  pomoPhase = "study";
  pomoSeconds = POMO_STUDY;
  els.pomodoroPhase.textContent = "Study Session";
  els.pomodoroPhase.classList.remove("pomodoro-phase--break");
  els.pomodoroStatus.textContent = "25 min focus · 5 min break";
  updatePomodoroDisplay();
}

function startBreakPhase() {
  pomoPhase = "break";
  pomoSeconds = POMO_BREAK;
  els.pomodoroPhase.textContent = "Break Time";
  els.pomodoroPhase.classList.add("pomodoro-phase--break");
  els.pomodoroStatus.textContent = "Take a short break. You earned it!";
  updatePomodoroDisplay();
}

function startPomodoro() {
  const subjectId = els.pomodoroSubject.value;
  if (!subjectId && pomoPhase === "study") {
    showToast("Please select a subject first");
    return;
  }
  pomoSubjectId = subjectId;
  pomoRunning = true;

  pomoInterval = setInterval(() => {
    pomoSeconds++;
    updatePomodoroDisplay();
  }, 1000);

  setPomodoroButtons();
}

function pausePomodoro() {
  pomoRunning = false;
  clearInterval(pomoInterval);
  pomoInterval = null;
  els.pomodoroStatus.textContent = "Paused";
  setPomodoroButtons();
}

function skipPomodoro() {
  clearInterval(pomoInterval);
  pomoInterval = null;
  pomoRunning = false;
  if (pomoPhase === "study") {
    const elapsed = POMO_STUDY - pomoSeconds;
    if (pomoSubjectId && elapsed > 60) recordSession(pomoSubjectId, elapsed);
    startBreakPhase();
  } else {
    startPomodoroPhase();
  }
  updatePomodoroDisplay();
  setPomodoroButtons();
}

function stopPomodoro() {
  clearInterval(pomoInterval);
  pomoInterval = null;
  pomoRunning = false;
  pomoSubjectId = null;
  startPomodoroPhase();
  setPomodoroButtons();
}

function saveGoal() {
  const minutes = parseInt(els.dailyGoal.value, 10);
  if (isNaN(minutes) || minutes < 15 || minutes > 720) {
    showToast("Goal must be between 15 and 720 minutes");
    return;
  }
  state.settings.dailyGoalMinutes = minutes;
  renderAll();
  showToast(`Daily goal set to ${formatDuration(minutes * 60)}`);
}

function saveExam() {
  state.settings.examName = els.examName.value.trim();
  state.settings.examDate = els.examDate.value || null;
  renderAll();
  showToast(
    state.settings.examDate ? "Exam countdown saved" : "Exam countdown cleared",
  );
}

function toggleTheme() {
  state.settings.darkMode = !state.settings.darkMode;
  applyTheme();
  saveState();
}

function bindEvents() {
  els.themeToggle.addEventListener("click", toggleTheme);
  els.menuToggle.addEventListener("click", () =>
    els.sidebar.classList.toggle("open"),
  );

  $$(".nav-item, .mobile-nav__item").forEach((btn) => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.view));
  });

  $$("[data-view-link]").forEach((btn) => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.viewLink));
  });

  $$(".timer-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".timer-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const isPomo = tab.dataset.timer === "pomodoro";
      $("#freeTimerPanel").classList.toggle("timer-panel--active", !isPomo);
      $("#pomodoroPanel").classList.toggle("timer-panel--active", isPomo);
    });
  });

  els.startBtn.addEventListener("click", startTimer);
  els.pauseBtn.addEventListener("click", pauseTimer);
  els.stopBtn.addEventListener("click", () => stopTimer(true));
  els.pomoStartBtn.addEventListener("click", startPomodoro);
  els.pomoPauseBtn.addEventListener("click", pausePomodoro);
  els.pomoSkipBtn.addEventListener("click", () => {
    // 1. Timer ko roko
    clearInterval(pomoInterval);
    pomoInterval = null;
    pomoRunning = false;

    // 2. Agar padhai ka time 0 se zyada hai toh session save karo
    if (pomoSeconds > 0) {
      completePomodoroStudy();
    }

    // 3. Timer reset karke screen update karo
    pomoSeconds = 0;
    updatePomodoroDisplay();
    setPomodoroButtons();
  });
  els.saveGoalBtn.addEventListener("click", saveGoal);
  els.saveExamBtn.addEventListener("click", saveExam);
  els.soundToggle.addEventListener("change", () => {
    state.settings.soundEnabled = els.soundToggle.checked;
    saveState();
  });
  els.addSubjectBtn.addEventListener("click", openModal);
  els.closeModal.addEventListener("click", closeModalFn);
  els.cancelModal.addEventListener("click", closeModalFn);
  els.subjectModal.addEventListener("click", (e) => {
    if (e.target === els.subjectModal) closeModalFn();
  });
  els.subjectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addSubject(els.subjectName.value, els.colorPicker._getSelected());
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !els.subjectModal.hidden) closeModalFn();
  });
}
function init() {
  applyTheme();
  initColorPicker();
  bindEvents();
  els.freeRingProgress.style.strokeDasharray = RING_CIRCUMFERENCE;
  els.pomoRingProgress.style.strokeDasharray = RING_CIRCUMFERENCE;
  updateTimerDisplay();
  startPomodoroPhase();
  setTimerButtons();
  setPomodoroButtons();
  renderAll();
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof init === "function") {
    init();
    console.log("🚀 StudyFlow Core Engine Successfully Started!");
  } else {
    console.warn(
      "⚠️ init function nahi mili! Check karo app.js sahi se load hui hai ya nahi.",
    );
  }
});
// --- Ultra-Safe Live Card Sync & Share ---
function syncWrappedCardData() {
  try {
    let streakText = "0 Days";
    let hoursText = "0m";
    let subjectText = "General";
    let rankText = "Beginner 🌱";

    // 1. Safe State Reading
    if (typeof state !== "undefined" && state) {
      if (state.streak && state.streak.current !== undefined) {
        streakText = state.streak.current + " Days";
      }
      if (Array.isArray(state.subjects) && state.subjects.length > 0) {
        subjectText = state.subjects[0].name || "General";
      }
    }

    // 2. Safe DOM Updates
    const hoursEl = document.getElementById("wrapped-hours");
    const streakEl = document.getElementById("wrapped-streak");
    const subjectEl = document.getElementById("wrapped-subject");
    const rankEl = document.getElementById("wrapped-rank");

    if (hoursEl) hoursEl.innerText = hoursText;
    if (streakEl) streakEl.innerText = "🔥 " + streakText;
    if (subjectEl) subjectEl.innerText = "📚 " + subjectText;
    if (rankEl) rankEl.innerText = rankText;
  } catch (err) {
    console.warn("Wrapped Sync Warning: ", err);
  }
}
// --- Helper: Convert Base64 DataURL directly to File Object ---
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

// --- Share Progress Card Main Function ---
async function shareWrappedCard() {
  const card = document.getElementById("study-wrapped-card");
  const btn = document.getElementById("shareCardBtn");

  if (!card) {
    alert("Error: 'study-wrapped-card' element not found in HTML!");
    return;
  }

  if (typeof html2canvas === "undefined") {
    alert("Error: html2canvas library is not loaded yet. Please try again.");
    return;
  }

  const originalText = btn ? btn.innerText : "📸 Share Progress Card";
  if (btn) btn.innerText = "⏳ Generating Card...";

  try {
    if (typeof syncWrappedCardData === "function") {
      syncWrappedCardData();
    }

    // 1. Render card to canvas
    const canvas = await html2canvas(card, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#2ecc71",
    });

    const imageDataUrl = canvas.toDataURL("image/png");

    // 2. Convert DataURL directly to File
    const file = dataURLtoFile(imageDataUrl, "studyflow-card.png");

    // 3. Directly trigger Native System Share Sheet
    if (navigator.share) {
      await navigator.share({
        title: "StudyFlow Progress",
        text: "Check out my study progress on StudyFlow! 🚀",
        files: [file],
      });
    } else {
      alert("Sharing is not supported on this device/browser.");
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      alert("Share Error: " + err.message);
    }
  } finally {
    if (btn) btn.innerText = originalText;
  }
}
function updateWrappedCardData(
  weeklyTimeText,
  streakCount,
  topSubText,
  userRankText,
) {
  const hoursEl = document.getElementById("wrapped-hours");
  const streakEl = document.getElementById("wrapped-streak");
  const subjectEl = document.getElementById("wrapped-subject");
  const rankEl = document.getElementById("wrapped-rank");

  if (hoursEl) hoursEl.innerText = weeklyTimeText || "0m";
  if (streakEl) streakEl.innerText = "🔥 " + (streakCount || 0) + " Days";
  if (subjectEl) subjectEl.innerText = "📚 " + (topSubText || "None");
  if (rankEl) rankEl.innerText = (userRankText || "Beginner") + " 🏆";
}
// --- Auto-Sync Card with Real App Data ---
function autoSyncCardData() {
  try {
    if (typeof state === "undefined" || !state) return;

    // 1. Real Streak
    const streak =
      state.streak && state.streak.current ? state.streak.current : 0;

    // 2. Real Total Study Time
    let totalSeconds = 0;
    if (Array.isArray(state.sessions)) {
      state.sessions.forEach((session) => {
        const sec =
          session.seconds ||
          session.duration ||
          (session.minutes ? session.minutes * 60 : 0);
        totalSeconds += sec;
      });
    }

    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const timeText = hours > 0 ? hours + "h " + mins + "m" : mins + "m";

    // 3. Top Subject
    let topSub = "General";
    if (Array.isArray(state.subjects) && state.subjects.length > 0) {
      topSub = state.subjects[0].name || "General";
    }

    // 4. Rank Calculation
    let rank = "Learner";
    if (hours >= 50) rank = "Master 👑";
    else if (hours >= 10) rank = "Warrior ⚔️";
    else rank = "Beginner 🌱";

    // 5. Card UI update karo
    if (typeof updateWrappedCardData === "function") {
      updateWrappedCardData(timeText, streak, topSub, rank);
    }
  } catch (e) {
    console.error("autoSyncCardData error:", e);
  }
}

// App chalte hi har 2 second me card ko live sync karega
setInterval(autoSyncCardData, 2000);
// --- Smart 10 Themes Switcher (Direct CSS Injector) ---
const themeColorMap = {
  purple: { primary: "#6c5ce7", accent: "#a29bfe" },
  pink: { primary: "#fd79a8", accent: "#ffb8d2" },
  lavender: { primary: "#a29bfe", accent: "#d6d2ff" },
  rose: { primary: "#e84393", accent: "#ff76b8" },
  peach: { primary: "#ff7675", accent: "#ffabe7" },
  mint: { primary: "#00b894", accent: "#55efc4" },
  sky: { primary: "#0984e3", accent: "#74b9ff" },
  cyan: { primary: "#00cec9", accent: "#81ecec" },
  butter: { primary: "#fdcb6e", accent: "#ffeaa7" },
  emerald: { primary: "#2ed573", accent: "#7bed9f" },
};

function changeAppTheme(themeName) {
  const theme = themeColorMap[themeName] || themeColorMap["purple"];

  // 1. Data-theme attribute set karo
  document.body.setAttribute("data-theme", themeName);

  // 2. Dynamic Style Tag Inject/Update karo (CSS ki urat hi nahi)
  let styleTag = document.getElementById("dynamic-theme-override");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "dynamic-theme-override";
    document.head.appendChild(styleTag);
  }

  // Pure app me variables overwrite kar do
  styleTag.innerHTML = `
    :root, body, [data-theme="${themeName}"] {
      --primary-color: ${theme.primary} !important;
      --primary: ${theme.primary} !important;
      --accent-color: ${theme.accent} !important;
      --accent: ${theme.accent} !important;
    }
    .wrapped-card, .btn-primary, .primary-bg, .task-item input:checked {
      background: ${theme.primary} !important;
    }
    .wrapped-hero h2, .note-item h4 {
      color: ${theme.accent} !important;
    }
  `;

  // 3. LocalStorage me save karo
  localStorage.setItem("studyflow_theme", themeName);
}

// App Load hote hi saved theme wapas apply karo
window.addEventListener("DOMContentLoaded", function () {
  const savedTheme = localStorage.getItem("studyflow_theme") || "purple";
  changeAppTheme(savedTheme);
});
// --- Syllabus Tracker (Connected to App's Subjects) ---
let syllabusTasks =
  JSON.parse(localStorage.getItem("studyflow_syllabus")) || [];

function syncSyllabusSubjectsDropdown() {
  const select = document.getElementById("syllabus-subject-select");
  if (!select) return;

  const currentSelected = select.value;
  select.innerHTML = "";

  let subList = [];

  // 1. App ke state se subjects fetch karo
  if (
    typeof state !== "undefined" &&
    state &&
    Array.isArray(state.subjects) &&
    state.subjects.length > 0
  ) {
    subList = state.subjects.map((s) =>
      typeof s === "string" ? s : s.name || "General",
    );
  }

  // 2. LocalStorage fallback
  if (subList.length === 0) {
    try {
      const localState = JSON.parse(
        localStorage.getItem("studyflow_state") || "{}",
      );
      if (localState && Array.isArray(localState.subjects)) {
        subList = localState.subjects.map((s) =>
          typeof s === "string" ? s : s.name || "General",
        );
      }
    } catch (e) {}
  }

  if (subList.length === 0) subList = ["General"];

  // Duplicate names hatao
  subList = [...new Set(subList)];

  // Dropdown populate karo
  subList.forEach((sub) => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = "📚 " + sub;
    select.appendChild(opt);
  });

  if (currentSelected && subList.includes(currentSelected)) {
    select.value = currentSelected;
  }
}

function saveAndRenderSyllabus() {
  localStorage.setItem("studyflow_syllabus", JSON.stringify(syllabusTasks));
  renderSyllabusList();
}

function addChapterTask() {
  const input = document.getElementById("chapter-input");
  const subjectSelect = document.getElementById("syllabus-subject-select");

  const text = input ? input.value.trim() : "";
  const selectedSubject = subjectSelect ? subjectSelect.value : "General";

  if (!text) return;

  syllabusTasks.push({
    id: Date.now(),
    text: text,
    subject: selectedSubject,
    completed: false,
  });

  input.value = "";
  saveAndRenderSyllabus();
}

function toggleTaskComplete(id) {
  syllabusTasks = syllabusTasks.map((task) => {
    if (task.id === id) task.completed = !task.completed;
    return task;
  });
  saveAndRenderSyllabus();
}

function deleteTask(id) {
  syllabusTasks = syllabusTasks.filter((task) => task.id !== id);
  saveAndRenderSyllabus();
}

function renderSyllabusList() {
  syncSyllabusSubjectsDropdown();

  const list = document.getElementById("syllabus-task-list");
  const subjectSelect = document.getElementById("syllabus-subject-select");
  if (!list) return;

  const currentSubject = subjectSelect ? subjectSelect.value : "General";
  list.innerHTML = "";

  const filteredTasks = syllabusTasks.filter(
    (task) => (task.subject || "General") === currentSubject,
  );

  let completedCount = 0;

  filteredTasks.forEach((task) => {
    if (task.completed) completedCount++;

    const li = document.createElement("li");
    const isChecked = task.completed ? "checked" : "";
    const completedClass = task.completed ? "completed" : "";

    li.className = "task-item " + completedClass;
    li.innerHTML =
      '<div class="task-item-left">' +
      '<input type="checkbox" ' +
      isChecked +
      ' onchange="toggleTaskComplete(' +
      task.id +
      ')">' +
      "<span>" +
      task.text +
      "</span>" +
      "</div>" +
      '<button class="delete-btn" onclick="deleteTask(' +
      task.id +
      ')">🗑️</button>';

    list.appendChild(li);
  });

  const total = filteredTasks.length;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const textEl = document.getElementById("syllabus-progress-text");
  const fillEl = document.getElementById("syllabus-progress-fill");

  if (textEl) textEl.innerText = percent + "%";
  if (fillEl) fillEl.style.width = percent + "%";
}

// Har 1.5 second me update automatic synchronise hota rahega
setInterval(renderSyllabusList, 1500);
// --- Quick Notes Logic ---
let quickNotes = JSON.parse(localStorage.getItem("studyflow_notes")) || [];

function saveAndRenderNotes() {
  localStorage.setItem("studyflow_notes", JSON.stringify(quickNotes));
  renderQuickNotes();
}

function addQuickNote() {
  const titleInput = document.getElementById("note-title-input");
  const contentInput = document.getElementById("note-content-input");

  const title = titleInput ? titleInput.value.trim() : "";
  const content = contentInput ? contentInput.value.trim() : "";

  if (!title && !content) return;

  quickNotes.unshift({
    id: Date.now(),
    title: title || "Untitled Note",
    content: content,
    date: new Date().toLocaleDateString(),
  });

  if (titleInput) titleInput.value = "";
  if (contentInput) contentInput.value = "";

  saveAndRenderNotes();
}

function deleteQuickNote(id) {
  quickNotes = quickNotes.filter((note) => note.id !== id);
  saveAndRenderNotes();
}

function renderQuickNotes() {
  const container = document.getElementById("quick-notes-list");
  if (!container) return;

  container.innerHTML = "";

  if (quickNotes.length === 0) {
    container.innerHTML =
      '<p style="color: #777; font-size: 13px; text-align: center;">Koi saved note nahi hai. Naya note add karein!</p>';
    return;
  }

  quickNotes.forEach((note) => {
    const div = document.createElement("div");
    div.className = "note-item";
    div.innerHTML =
      '<div class="note-item-header">' +
      "<h4>" +
      note.title +
      "</h4>" +
      '<button class="delete-note-btn" onclick="deleteQuickNote(' +
      note.id +
      ')">🗑️</button>' +
      "</div>" +
      "<p>" +
      note.content +
      "</p>";

    container.appendChild(div);
  });
}

// Sidebar overlay close logic
const sidebarOverlayEl = document.getElementById("sidebarOverlay");
if (sidebarOverlayEl) {
  const closeSidebarMenu = () => {
    const sb = document.getElementById("sidebar");
    if (sb) sb.classList.remove("open", "active");
    if (typeof els !== "undefined" && els.sidebar) {
      els.sidebar.classList.remove("open", "active");
    }
    sidebarOverlayEl.classList.remove("active");
    document.body.classList.remove("sidebar-open");
  };

  sidebarOverlayEl.addEventListener("click", closeSidebarMenu);
  sidebarOverlayEl.addEventListener("touchstart", closeSidebarMenu);
}

// ===== LIFEFLOW MINI-APP MODULE MANAGERS =====

// --- HABIT TRACKER ---
let habitData = JSON.parse(localStorage.getItem("lifeflow_habits")) || [
  {
    id: 1,
    name: "Morning Meditation",
    frequency: "daily",
    streak: 5,
    completedToday: true,
  },
  {
    id: 2,
    name: "Read 20 Pages",
    frequency: "daily",
    streak: 3,
    completedToday: false,
  },
];

function renderHabits() {
  const container = document.getElementById("habitsList");
  const activeEl = document.getElementById("habitActiveCount");
  const streakEl = document.getElementById("habitBestStreak");
  const rateEl = document.getElementById("habitTodayRate");

  if (activeEl) activeEl.textContent = habitData.length;
  const bestStreak = habitData.reduce((max, h) => Math.max(max, h.streak), 0);
  if (streakEl) streakEl.textContent = `${bestStreak} days`;
  const completed = habitData.filter((h) => h.completedToday).length;
  const rate = habitData.length
    ? Math.round((completed / habitData.length) * 100)
    : 0;
  if (rateEl) rateEl.textContent = `${rate}%`;

  if (!container) return;
  container.innerHTML = "";

  if (habitData.length === 0) {
    container.innerHTML =
      '<p style="color:var(--text-secondary); text-align:center; padding:1rem;">No habits added yet.</p>';
    return;
  }

  habitData.forEach((h) => {
    const div = document.createElement("div");
    div.className = "stat-card";
    div.style.cssText =
      "display:flex; justify-content:space-between; align-items:center; cursor:pointer;";
    div.onclick = () => toggleHabit(h.id);
    div.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:1.4rem;">${h.completedToday ? "✅" : "⭕"}</span>
        <div>
          <strong style="display:block; color:var(--text);">${h.name}</strong>
          <small style="color:var(--text-secondary);">${h.frequency} · 🔥 ${h.streak} day streak</small>
        </div>
      </div>
      <button class="btn btn--ghost btn--sm" onclick="event.stopPropagation(); deleteHabit(${h.id});">🗑️</button>
    `;
    container.appendChild(div);
  });
}

function toggleHabit(id) {
  habitData = habitData.map((h) => {
    if (h.id === id) {
      const nextState = !h.completedToday;
      return {
        ...h,
        completedToday: nextState,
        streak: nextState ? h.streak + 1 : Math.max(0, h.streak - 1),
      };
    }
    return h;
  });
  localStorage.setItem("lifeflow_habits", JSON.stringify(habitData));
  renderHabits();
}

function deleteHabit(id) {
  habitData = habitData.filter((h) => h.id !== id);
  localStorage.setItem("lifeflow_habits", JSON.stringify(habitData));
  renderHabits();
}

document.getElementById("addHabitBtn")?.addEventListener("click", () => {
  const name = prompt("Enter habit name:");
  if (name && name.trim()) {
    habitData.push({
      id: Date.now(),
      name: name.trim(),
      frequency: "daily",
      streak: 0,
      completedToday: false,
    });
    localStorage.setItem("lifeflow_habits", JSON.stringify(habitData));
    renderHabits();
  }
});

// --- GOAL TRACKER ---
let goalData = JSON.parse(localStorage.getItem("lifeflow_goals")) || [
  {
    id: 1,
    title: "Learn Modern Architecture",
    targetDate: "2026-12-31",
    progress: 65,
  },
];

function renderGoals() {
  const container = document.getElementById("goalsList");
  const activeEl = document.getElementById("goalActiveCount");
  const completedEl = document.getElementById("goalCompletedCount");

  if (activeEl)
    activeEl.textContent = goalData.filter((g) => g.progress < 100).length;
  if (completedEl)
    completedEl.textContent = goalData.filter((g) => g.progress >= 100).length;

  if (!container) return;
  container.innerHTML = "";

  if (goalData.length === 0) {
    container.innerHTML =
      '<p style="color:var(--text-secondary); text-align:center; padding:1rem;">No goals added yet.</p>';
    return;
  }

  goalData.forEach((g) => {
    const div = document.createElement("div");
    div.className = "stat-card";
    div.style.cssText = "display:flex; flex-direction:column; gap:8px;";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong style="color:var(--text);">${g.title}</strong>
        <small style="color:var(--text-secondary);">${g.progress}%</small>
      </div>
      <div style="width:100%; background:var(--border); height:8px; border-radius:4px; overflow:hidden;">
        <div style="width:${g.progress}%; background:var(--primary); height:100%;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
        <small style="color:var(--text-secondary);">Target: ${g.targetDate || "No date"}</small>
        <button class="btn btn--ghost btn--sm" onclick="deleteGoal(${g.id})">🗑️</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function deleteGoal(id) {
  goalData = goalData.filter((g) => g.id !== id);
  localStorage.setItem("lifeflow_goals", JSON.stringify(goalData));
  renderGoals();
}

document.getElementById("addGoalBtn")?.addEventListener("click", () => {
  const title = prompt("Enter goal title:");
  if (title && title.trim()) {
    goalData.push({
      id: Date.now(),
      title: title.trim(),
      targetDate: "2026-12-31",
      progress: 10,
    });
    localStorage.setItem("lifeflow_goals", JSON.stringify(goalData));
    renderGoals();
  }
});

// --- EXPENSE TRACKER ---
let expenseData = JSON.parse(localStorage.getItem("lifeflow_expenses")) || [
  { id: 1, desc: "Coffee", amount: -4.5, category: "Food" },
  { id: 2, desc: "Freelance Work", amount: 250.0, category: "Income" },
];

function renderExpenses() {
  const container = document.getElementById("expenseList");
  const incomeEl = document.getElementById("expenseIncomeTotal");
  const expenseEl = document.getElementById("expenseTotal");
  const balanceEl = document.getElementById("expenseBalance");

  const income = expenseData
    .filter((e) => e.amount > 0)
    .reduce((sum, e) => sum + e.amount, 0);
  const expenses = Math.abs(
    expenseData
      .filter((e) => e.amount < 0)
      .reduce((sum, e) => sum + e.amount, 0),
  );
  const balance = income - expenses;

  if (incomeEl) incomeEl.textContent = `$${income.toFixed(2)}`;
  if (expenseEl) expenseEl.textContent = `$${expenses.toFixed(2)}`;
  if (balanceEl) balanceEl.textContent = `$${balance.toFixed(2)}`;

  if (!container) return;
  container.innerHTML = "";

  if (expenseData.length === 0) {
    container.innerHTML =
      '<p style="color:var(--text-secondary); text-align:center; padding:1rem;">No transactions logged yet.</p>';
    return;
  }

  expenseData.forEach((e) => {
    const div = document.createElement("div");
    div.className = "stat-card";
    div.style.cssText =
      "display:flex; justify-content:space-between; align-items:center;";
    const isIncome = e.amount > 0;
    div.innerHTML = `
      <div>
        <strong style="color:var(--text);">${e.desc}</strong>
        <small style="display:block; color:var(--text-secondary);">${e.category}</small>
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-weight:700; color:${isIncome ? "var(--success)" : "var(--danger)"};">
          ${isIncome ? "+" : ""}$${Math.abs(e.amount).toFixed(2)}
        </span>
        <button class="btn btn--ghost btn--sm" onclick="deleteExpense(${e.id})">🗑️</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function deleteExpense(id) {
  expenseData = expenseData.filter((e) => e.id !== id);
  localStorage.setItem("lifeflow_expenses", JSON.stringify(expenseData));
  renderExpenses();
}

document.getElementById("addExpenseBtn")?.addEventListener("click", () => {
  const desc = prompt("Transaction Description:");
  const amountStr = prompt(
    "Amount (positive for income, negative for expense e.g. -15.50):",
  );
  if (desc && amountStr && !isNaN(parseFloat(amountStr))) {
    const amount = parseFloat(amountStr);
    expenseData.unshift({
      id: Date.now(),
      desc: desc.trim(),
      amount: amount,
      category: amount > 0 ? "Income" : "General",
    });
    localStorage.setItem("lifeflow_expenses", JSON.stringify(expenseData));
    renderExpenses();
  }
});

// --- WORKOUT TRACKER ---
let premiumWorkoutData =
  JSON.parse(localStorage.getItem("lifeflow_premium_workouts")) || [];
let workoutBodyMetrics = JSON.parse(
  localStorage.getItem("lifeflow_workout_metrics"),
) || { currentWeight: null, goalWeight: null };

function renderWorkouts() {
  const logList = document.getElementById("workoutLogList");
  const prsList = document.getElementById("workoutPRsList");
  const todayCalsEl = document.getElementById("workoutTodayCals");
  const streakEl = document.getElementById("workoutStreak");
  const totalVolumeEl = document.getElementById("workoutTotalVolume");
  const currentWeightInput = document.getElementById("workoutCurrentWeight");
  const goalWeightInput = document.getElementById("workoutGoalWeight");

  // Today's date string for filtering
  const todayStr = new Date().toLocaleDateString();
  const todayWorkouts = premiumWorkoutData.filter((w) => w.date === todayStr);

  // Update Top Cards
  const todayCals = todayWorkouts.reduce(
    (sum, w) => sum + (w.calories || 0),
    0,
  );
  if (todayCalsEl) todayCalsEl.textContent = todayCals.toFixed(0) + " kcal";

  const totalVolume = premiumWorkoutData.reduce(
    (sum, w) => sum + (w.sets || 0) * (w.reps || 0) * (w.weight || 0),
    0,
  );
  if (totalVolumeEl) totalVolumeEl.textContent = totalVolume.toFixed(0) + " kg";

  // Calculate Streak (simple calculation based on unique days)
  const uniqueDays = new Set(premiumWorkoutData.map((w) => w.date)).size;
  if (streakEl) streakEl.textContent = uniqueDays + " Days";

  // Render Today's Log
  if (logList) {
    logList.innerHTML = "";
    if (todayWorkouts.length === 0) {
      logList.innerHTML =
        '<p style="color:var(--text-secondary); text-align:center; padding:1rem;">No exercises logged today.</p>';
    } else {
      todayWorkouts.forEach((w) => {
        const div = document.createElement("div");
        div.className = "stat-card";
        div.style.cssText =
          "display:flex; justify-content:space-between; align-items:center;";
        div.innerHTML = `
          <div>
            <strong style="color:var(--text);">${w.name}</strong>
            <small style="display:block; color:var(--text-secondary);">${w.sets} sets × ${w.reps} reps${w.weight > 0 ? ` @ ${w.weight}kg` : ""}</small>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-weight:600; color:var(--streak);">${Math.round(w.calories)} kcal</span>
            <button class="btn btn--ghost btn--sm" onclick="deletePremiumWorkout(${w.id})">🗑️</button>
          </div>
        `;
        logList.appendChild(div);
      });
    }
  }

  // Render PRs
  if (prsList) {
    prsList.innerHTML = "";
    const prMap = {};
    premiumWorkoutData.forEach((w) => {
      if (w.weight > 0) {
        if (!prMap[w.name] || w.weight > prMap[w.name]) {
          prMap[w.name] = w.weight;
        }
      }
    });
    const prKeys = Object.keys(prMap);
    if (prKeys.length === 0) {
      prsList.innerHTML =
        '<p style="color:var(--text-secondary); text-align:center; padding:1rem;">No personal records yet. Add weights to your exercises.</p>';
    } else {
      prKeys.forEach((name) => {
        const div = document.createElement("div");
        div.className = "stat-card";
        div.style.cssText =
          "display:flex; justify-content:space-between; align-items:center;";
        div.innerHTML = `
          <div><strong style="color:var(--text);">${name}</strong></div>
          <div style="font-weight:700; color:var(--primary);">${prMap[name]} kg</div>
        `;
        prsList.appendChild(div);
      });
    }
  }

  // Populate Body Metrics
  if (currentWeightInput && workoutBodyMetrics.currentWeight !== null)
    currentWeightInput.value = workoutBodyMetrics.currentWeight;
  if (goalWeightInput && workoutBodyMetrics.goalWeight !== null)
    goalWeightInput.value = workoutBodyMetrics.goalWeight;

  renderCalorieChart();
}

function deletePremiumWorkout(id) {
  premiumWorkoutData = premiumWorkoutData.filter((w) => w.id !== id);
  localStorage.setItem(
    "lifeflow_premium_workouts",
    JSON.stringify(premiumWorkoutData),
  );
  renderWorkouts();
}

function renderCalorieChart() {
  const chartEl = document.getElementById("workoutCalorieChart");
  if (!chartEl) return;
  chartEl.innerHTML = "";

  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toLocaleDateString());
  }

  let maxCal = 0;
  const dayCals = last7Days.map((dateStr) => {
    const cals = premiumWorkoutData
      .filter((w) => w.date === dateStr)
      .reduce((sum, w) => sum + (w.calories || 0), 0);
    if (cals > maxCal) maxCal = cals;
    return { dateStr, cals };
  });

  if (maxCal === 0) maxCal = 100; // prevent div by zero

  dayCals.forEach((day) => {
    const height = (day.cals / maxCal) * 100;
    const barWrap = document.createElement("div");
    barWrap.style.cssText =
      "display:flex; flex-direction:column; align-items:center; gap:4px; height:100%; justify-content:flex-end; width:12%;";
    barWrap.innerHTML = `
      <div style="font-size:10px; color:var(--text-secondary);">${Math.round(day.cals)}</div>
      <div style="width:100%; background:var(--primary); border-radius:4px 4px 0 0; height:${height}%; min-height:4px;"></div>
      <div style="font-size:10px; color:var(--text-secondary);">${day.dateStr.split("/")[0]}/${day.dateStr.split("/")[1]}</div>
    `;
    chartEl.appendChild(barWrap);
  });
}

// Ensure event listeners are attached only once or safely
const attachWorkoutListeners = () => {
  const modal = document.getElementById("workoutModalOverlay");

  document.getElementById("btnStartWorkout")?.addEventListener("click", () => {
    if (modal) modal.hidden = false;
  });

  document.getElementById("btnCancelWorkout")?.addEventListener("click", () => {
    if (modal) modal.hidden = true;
  });

  document.getElementById("btnSaveWorkout")?.addEventListener("click", () => {
    const name = document.getElementById("workoutInputName").value.trim();
    const sets =
      parseInt(document.getElementById("workoutInputSets").value) || 0;
    const reps =
      parseInt(document.getElementById("workoutInputReps").value) || 0;
    const weightInput = document.getElementById("workoutInputWeight").value;
    const weight = parseFloat(weightInput) || 0;

    if (!name || sets <= 0 || reps <= 0) {
      alert("Please enter valid exercise name, sets, and reps.");
      return;
    }

    let calories = 0;
    if (weightInput !== "" && weight > 0) {
      calories = sets * reps * weight * 0.03;
    } else {
      calories = sets * reps * 0.5;
    }

    premiumWorkoutData.push({
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      name,
      sets,
      reps,
      weight,
      calories,
    });

    localStorage.setItem(
      "lifeflow_premium_workouts",
      JSON.stringify(premiumWorkoutData),
    );

    // Clear inputs
    document.getElementById("workoutInputName").value = "";
    document.getElementById("workoutInputSets").value = "";
    document.getElementById("workoutInputReps").value = "";
    document.getElementById("workoutInputWeight").value = "";

    if (modal) modal.hidden = true;
    renderWorkouts();
  });

  document
    .getElementById("btnSaveBodyMetrics")
    ?.addEventListener("click", () => {
      const cW = parseFloat(
        document.getElementById("workoutCurrentWeight").value,
      );
      const gW = parseFloat(document.getElementById("workoutGoalWeight").value);
      if (!isNaN(cW)) workoutBodyMetrics.currentWeight = cW;
      if (!isNaN(gW)) workoutBodyMetrics.goalWeight = gW;
      localStorage.setItem(
        "lifeflow_workout_metrics",
        JSON.stringify(workoutBodyMetrics),
      );
      alert("Body metrics saved!");
    });

  document
    .getElementById("btnResetWorkoutData")
    ?.addEventListener("click", () => {
      // ONLY clears lifeflow_premium_workouts
      if (
        confirm("Are you sure you want to delete all premium workout data?")
      ) {
        localStorage.removeItem("lifeflow_premium_workouts");
        premiumWorkoutData = [];
        renderWorkouts();
      }
    });
};

document.addEventListener("DOMContentLoaded", attachWorkoutListeners);
// Just in case it's already loaded
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  setTimeout(attachWorkoutListeners, 100);
}

// --- SLEEP TRACKER ---
let sleepData =
  JSON.parse(localStorage.getItem("lifeflow_premium_sleep")) || [];

// Habit Tags toggle
document.getElementById("sleepHabitTags")?.addEventListener("click", (e) => {
  if (e.target.classList.contains("habit-tag-btn")) {
    e.target.classList.toggle("active");
  }
});

function calculateSleepScore(duration, habits) {
  let score = 70; // Base score

  // Duration points
  if (duration >= 7 && duration <= 9) score += 20;
  else if (duration >= 6 && duration < 7) score += 10;
  else if (duration > 9) score += 10;
  else score -= 20; // < 6 hours

  // Habit points
  if (habits.includes("☕ Caffeine")) score -= 10;
  if (habits.includes("📱 Screen Time")) score -= 10;
  if (habits.includes("📚 Late Study")) score -= 10;
  if (habits.includes("🏋️ Workout")) score += 10;

  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score));
}

function renderSleep() {
  const listEl = document.getElementById("sleepRecordsList");
  const durEl = document.getElementById("sleepLastDuration");
  const scoreEl = document.getElementById("sleepLastScore");
  const chartEl = document.getElementById("sleepTrendChart");
  const regText = document.getElementById("sleepRegularityText");
  const regBar = document.getElementById("sleepRegularityBar");
  const debtEl = document.getElementById("sleepDebtDisplay");

  if (sleepData.length > 0) {
    const last = sleepData[sleepData.length - 1];
    if (durEl) durEl.textContent = last.duration.toFixed(1);
    if (scoreEl) {
      scoreEl.textContent = `${last.score}`;
      let sColor = "#ef4444";
      if (last.score >= 80) sColor = "#10b981";
      else if (last.score >= 60) sColor = "#f59e0b";
      scoreEl.style.color = sColor;
      scoreEl.style.background = `${sColor}20`;
      scoreEl.style.border = `1px solid ${sColor}50`;
    }
  } else {
    if (durEl) durEl.textContent = "0.0";
    if (scoreEl) {
      scoreEl.textContent = "--/100";
      scoreEl.style.color = "var(--text)";
      scoreEl.style.background = "var(--bg-hover)";
      scoreEl.style.border = "none";
    }
  }

  if (listEl) {
    listEl.innerHTML = "";
    if (sleepData.length === 0) {
      listEl.innerHTML =
        '<p style="color:var(--text-secondary); text-align:center; padding:1rem;">No sleep records found.</p>';
    } else {
      [...sleepData].reverse().forEach((s) => {
        const div = document.createElement("div");
        div.className = "stat-card";
        div.style.cssText =
          "display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;";

        let durColor = "var(--text-secondary)";
        if (s.duration >= 7)
          durColor = "#10b981"; // Green
        else if (s.duration < 6)
          durColor = "#ef4444"; // Red
        else durColor = "#f59e0b"; // Orange

        let scoreColor = "#ef4444";
        if (s.score >= 80) scoreColor = "#10b981";
        else if (s.score >= 60) scoreColor = "#f59e0b";

        const tagsHtml =
          s.habits && s.habits.length > 0
            ? `<div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">${s.habits.map((h) => `<span style="background:var(--bg-hover); padding:3px 8px; border-radius:12px; font-size:0.75rem; border:1px solid var(--border);">${h}</span>`).join("")}</div>`
            : "";

        div.innerHTML = `
                    <div style="flex:1;">
                        <strong style="color:var(--text); font-size:1.05rem;">${s.date}</strong>
                        <small style="display:block; color:${durColor}; font-weight:600; margin-top:2px;">${s.duration.toFixed(1)} hrs <span style="color:var(--text-secondary); font-weight:normal;">· ${s.bedtime} - ${s.waketime}</span></small>
                        ${tagsHtml}
                    </div>
                    <div style="font-size:1.4rem; font-weight:900; color:${scoreColor}; background:${scoreColor}20; padding:0.5rem 0.8rem; border-radius:12px; min-width: 60px; text-align: center;">${s.score}</div>
                `;
        listEl.appendChild(div);
      });
    }
  }

  if (chartEl) {
    chartEl.innerHTML = "";
    const recent = sleepData.slice(-7);
    const maxDur = Math.max(10, ...recent.map((s) => s.duration));
    recent.forEach((s) => {
      const height = (s.duration / maxDur) * 100;
      const bar = document.createElement("div");
      bar.style.cssText = `width: 12%; height: ${height}%; background: linear-gradient(to top, var(--primary), #8b5cf6); border-radius: 6px 6px 0 0; position: relative;`;
      bar.innerHTML = `<span style="position:absolute; top:-22px; width:100%; text-align:center; font-size:0.75rem; font-weight:bold; color:var(--text-secondary);">${s.duration.toFixed(1)}h</span>`;
      chartEl.appendChild(bar);
    });
  }

  if (debtEl) {
    const recent = sleepData.slice(-7);
    if (recent.length > 0) {
      let debt = recent.reduce((sum, s) => sum + (8 - s.duration), 0);
      if (debt > 0) {
        debtEl.textContent = `-${debt.toFixed(1)} hrs`;
        debtEl.style.color = "#ef4444"; // Red warning
      } else {
        debtEl.textContent = `+${Math.abs(debt).toFixed(1)} hrs`;
        debtEl.style.color = "#10b981"; // Green surplus
      }
    } else {
      debtEl.textContent = "0.0 hrs";
      debtEl.style.color = "var(--text-secondary)";
    }
  }

  if (regText && regBar) {
    if (sleepData.length < 2) {
      regText.textContent = "Need more data";
      regBar.style.width = "0%";
    } else {
      const recent = sleepData.slice(-7);
      const avg =
        recent.reduce((sum, s) => sum + s.duration, 0) / recent.length;
      const variance =
        recent.reduce((sum, s) => sum + Math.abs(s.duration - avg), 0) /
        recent.length;

      let regularity = 100 - variance * 20;
      regularity = Math.max(10, Math.min(100, Math.round(regularity)));

      regText.textContent = `${regularity}%`;
      regBar.style.width = `${regularity}%`;

      if (regularity > 80) regBar.style.background = "#10b981";
      else if (regularity < 50) regBar.style.background = "#ef4444";
      else regBar.style.background = "#f59e0b";
    }
  }
}

document.getElementById("btnLogSleep")?.addEventListener("click", () => {
  const bedtime = document.getElementById("sleepBedtime").value;
  const waketime = document.getElementById("sleepWakeTime").value;

  if (!bedtime || !waketime) {
    alert("Please enter both Bedtime and Wake-up Time.");
    return;
  }

  const activeTags = Array.from(
    document.querySelectorAll("#sleepHabitTags .habit-tag-btn.active"),
  ).map((btn) => btn.getAttribute("data-tag"));

  let bedParts = bedtime.split(":");
  let wakeParts = waketime.split(":");
  let bedDate = new Date();
  bedDate.setHours(bedParts[0], bedParts[1], 0);

  let wakeDate = new Date();
  wakeDate.setHours(wakeParts[0], wakeParts[1], 0);

  if (wakeDate < bedDate) {
    wakeDate.setDate(wakeDate.getDate() + 1);
  }

  let duration = (wakeDate - bedDate) / (1000 * 60 * 60);
  let score = calculateSleepScore(duration, activeTags);

  sleepData.push({
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    bedtime,
    waketime,
    duration,
    score,
    habits: activeTags,
  });

  localStorage.setItem("lifeflow_premium_sleep", JSON.stringify(sleepData));

  document.getElementById("sleepBedtime").value = "";
  document.getElementById("sleepWakeTime").value = "";
  document
    .querySelectorAll("#sleepHabitTags .habit-tag-btn")
    .forEach((btn) => btn.classList.remove("active"));

  renderSleep();
  alert("Sleep log saved successfully!");
});

document.getElementById("btnResetSleepData")?.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all premium sleep data?")) {
    localStorage.removeItem("lifeflow_premium_sleep");
    sleepData = [];
    renderSleep();
  }
});

// Sleep Aids Audio Logic
const sleepAudio = document.getElementById("sleepAudioPlayer");
const audioBtns = {
  btnSoundRain: document.getElementById("btnSoundRain"),
  btnSoundDeep: document.getElementById("btnSoundDeep"),
  btnSoundTheta: document.getElementById("btnSoundTheta"),
  btnSoundZen: document.getElementById("btnSoundZen"),
  btnSoundBinaural: document.getElementById("btnSoundBinaural"),
  btnSoundAstral: document.getElementById("btnSoundAstral"),
};

const playSleepSound = (url, activeBtnId) => {
  if (sleepAudio) {
    // Reset button styles
    Object.values(audioBtns).forEach((btn) => {
      if (btn) {
        btn.style.backgroundColor = "transparent";
        btn.style.color = "var(--primary)";
      }
    });

    // Highlight active button
    const activeBtn = audioBtns[activeBtnId];
    if (activeBtn) {
      activeBtn.style.backgroundColor = "var(--primary)";
      activeBtn.style.color = "#ffffff";
    }

    sleepAudio.src = url;
    sleepAudio.volume = 1.0;
    sleepAudio.style.display = "block";
    sleepAudio.play().catch((e) => console.log("Audio playback failed:", e));
  }
};

audioBtns["btnSoundRain"]?.addEventListener("click", () =>
  playSleepSound(
    "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg",
    "btnSoundRain",
  ),
);
audioBtns["btnSoundDeep"]?.addEventListener("click", () =>
  playSleepSound(
    "https://actions.google.com/sounds/v1/science_fiction/alien_breath.ogg",
    "btnSoundDeep",
  ),
);
audioBtns["btnSoundTheta"]?.addEventListener("click", () =>
  playSleepSound(
    "https://actions.google.com/sounds/v1/science_fiction/humming_drone.ogg",
    "btnSoundTheta",
  ),
);
audioBtns["btnSoundZen"]?.addEventListener("click", () =>
  playSleepSound(
    "https://actions.google.com/sounds/v1/foley/wind_chimes.ogg",
    "btnSoundZen",
  ),
);
audioBtns["btnSoundBinaural"]?.addEventListener("click", () =>
  playSleepSound(
    "https://actions.google.com/sounds/v1/science_fiction/power_cord_hum.ogg",
    "btnSoundBinaural",
  ),
);
audioBtns["btnSoundAstral"]?.addEventListener("click", () =>
  playSleepSound(
    "https://actions.google.com/sounds/v1/science_fiction/spaceship_interior.ogg",
    "btnSoundAstral",
  ),
);

// --- WATER TRACKER ---
let waterData = JSON.parse(localStorage.getItem("lifeflow_premium_water")) || {
  goal: 2500,
  logs: [],
};

function getWaterTodayLogs() {
  const today = new Date().toLocaleDateString();
  return waterData.logs.filter((log) => log.date === today);
}

function renderWater() {
  // View 1: Dashboard
  const ringEl = document.getElementById("waterHeroRing");
  const percEl = document.getElementById("waterHeroPercentage");
  const textEl = document.getElementById("waterHeroText");

  const todayLogs = getWaterTodayLogs();
  const todayIntake = todayLogs.reduce((sum, log) => sum + log.hydration, 0);
  const goal = waterData.goal || 2500;

  let percentage = Math.round((todayIntake / goal) * 100);

  if (ringEl && percEl && textEl) {
    percEl.textContent = `${percentage}%`;
    textEl.textContent = `${todayIntake} ml / ${goal} ml`;

    let displayPerc = Math.min(percentage, 100);
    ringEl.style.background = `conic-gradient(var(--primary) ${displayPerc}%, var(--bg-hover) ${displayPerc}%)`;
  }

  // View 2: Logs
  const listEl = document.getElementById("waterLogsList");
  if (listEl) {
    listEl.innerHTML = "";
    if (todayLogs.length === 0) {
      listEl.innerHTML =
        '<p style="color:var(--text-secondary); text-align:center; padding:1rem;">No drinks logged today.</p>';
    } else {
      [...todayLogs].reverse().forEach((log) => {
        const div = document.createElement("div");
        div.className = "stat-card";
        div.style.cssText =
          "display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;";

        const isNegative = log.hydration < 0;
        const hydrationColor = isNegative ? "var(--danger)" : "var(--primary)";
        const sign = isNegative ? "" : "+";

        div.innerHTML = `
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="font-size:2rem;">${log.icon}</div>
                        <div>
                            <strong style="color:var(--text);">${log.time}</strong>
                            <small style="display:block; color:${isNegative ? "var(--danger)" : "var(--text-secondary)"};">${log.icon} ${log.type} (${log.rawAmount}ml) ➔ <span style="color:${hydrationColor}">${sign}${log.hydration}ml Net</span></small>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:15px;">
                        <span style="font-weight:bold; color:${hydrationColor};">${sign}${log.hydration}ml</span>
                        <button class="btn btn--ghost" style="color:var(--danger); padding:0.3rem;" onclick="deleteWaterLog(${log.id})">🗑️</button>
                    </div>
                `;
        listEl.appendChild(div);
      });
    }
  }

  // View 3: Analytics
  const chartEl = document.getElementById("waterTrendChart");
  if (chartEl) {
    chartEl.innerHTML = "";

    // Generate last 7 days keys
    const recentDays = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      recentDays.push(d.toLocaleDateString());
    }

    const maxIntake = Math.max(
      goal,
      ...recentDays.map((date) => {
        return waterData.logs
          .filter((l) => l.date === date)
          .reduce((sum, l) => sum + l.hydration, 0);
      }),
    );

    recentDays.forEach((date) => {
      const dayIntake = waterData.logs
        .filter((l) => l.date === date)
        .reduce((sum, l) => sum + l.hydration, 0);
      const height = (dayIntake / maxIntake) * 100;
      const bar = document.createElement("div");

      let barColor = "var(--primary)";
      if (dayIntake >= goal) barColor = "#10b981";

      bar.style.cssText = `width: 12%; height: ${height}%; background: ${barColor}; border-radius: 6px 6px 0 0; position: relative; transition: height 0.3s ease;`;
      bar.innerHTML = `<span style="position:absolute; top:-22px; width:100%; text-align:center; font-size:0.75rem; font-weight:bold; color:var(--text-secondary);">${dayIntake >= 1000 ? (dayIntake / 1000).toFixed(1) + "L" : dayIntake + "m"}</span>`;
      chartEl.appendChild(bar);
    });
  }
}

// Drink Type Selector
document.getElementById("waterDrinkTypes")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".habit-tag-btn");
  if (btn) {
    document
      .querySelectorAll("#waterDrinkTypes .habit-tag-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }
});

// Custom Cups click
document.querySelectorAll(".water-cup-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const rawAmount = parseInt(btn.getAttribute("data-amount"), 10);
    logWaterIntake(rawAmount);
  });
});

// Custom Input click
document.getElementById("waterCustomBtn")?.addEventListener("click", () => {
  const input = document.getElementById("waterCustomInput");
  const rawAmount = parseInt(input.value, 10);
  if (!isNaN(rawAmount) && rawAmount > 0) {
    logWaterIntake(rawAmount);
    input.value = "";
  }
});

function logWaterIntake(rawAmount) {
  const activeTypeBtn = document.querySelector(
    "#waterDrinkTypes .habit-tag-btn.active",
  );
  const multiplier = parseFloat(activeTypeBtn.getAttribute("data-multiplier"));
  // The text inside the button has the icon and the name. We just want the name. Let's use data-type attribute.
  const type = activeTypeBtn.getAttribute("data-type");
  const icon = activeTypeBtn.getAttribute("data-icon");

  const hydration = Math.round(rawAmount * multiplier);

  waterData.logs.push({
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    rawAmount,
    hydration,
    type,
    icon,
  });

  localStorage.setItem("lifeflow_premium_water", JSON.stringify(waterData));
  renderWater();
}

window.deleteWaterLog = (id) => {
  waterData.logs = waterData.logs.filter((log) => log.id !== id);
  localStorage.setItem("lifeflow_premium_water", JSON.stringify(waterData));
  renderWater();
};

document
  .getElementById("btnCalculateWaterGoal")
  ?.addEventListener("click", () => {
    const weight = parseFloat(document.getElementById("waterCalcWeight").value);
    const activity = document.getElementById("waterCalcActivity").value;

    if (isNaN(weight) || weight <= 0) {
      alert("Please enter a valid weight in kg.");
      return;
    }

    let newGoal = weight * 35;
    if (activity === "high") newGoal += 500;

    waterData.goal = Math.round(newGoal);
    localStorage.setItem("lifeflow_premium_water", JSON.stringify(waterData));
    renderWater();
    alert(`Goal updated to ${waterData.goal} ml`);
  });

document.getElementById("btnResetWaterData")?.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all premium water data?")) {
    localStorage.removeItem("lifeflow_premium_water");
    waterData = { goal: 2500, logs: [] };
    renderWater();
  }
});

// --- STEP TRACKER ---
let currentStepDate = new Date();
let isAutoTracking = false;
let lastStepTime = 0;
let stepDebounceMs = 300;
let currentSpeedStr = "0.0 km/h";

function handleMotion(event) {
  if (!isAutoTracking) return;
  const acc = event.accelerationIncludingGravity || event.acceleration;
  if (!acc) return;

  const x = acc.x || 0;
  const y = acc.y || 0;
  const z = acc.z || 0;
  const magnitude = Math.sqrt(x * x + y * y + z * z);

  if (magnitude > 13) {
    const now = Date.now();
    if (now - lastStepTime > stepDebounceMs) {
      const timeDiff = (now - lastStepTime) / 1000;
      if (timeDiff > 0 && timeDiff < 2) {
        const speed = (0.75 / timeDiff) * 3.6;
        currentSpeedStr = speed.toFixed(1) + " km/h";
      }
      lastStepTime = now;
      addSteps(1);
    }
  }
}

function getStepKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `steps_${y}-${m}-${d}`;
}

function getStepsForDate(dateObj) {
  return parseInt(localStorage.getItem(getStepKey(dateObj)) || "0", 10);
}

function setStepsForDate(dateObj, steps) {
  localStorage.setItem(getStepKey(dateObj), steps.toString());
}

function getStepGoal() {
  return parseInt(localStorage.getItem("lifeflow_step_goal") || "10000", 10);
}

function setStepGoal(goal) {
  localStorage.setItem("lifeflow_step_goal", goal.toString());
}

function calculateStepStreak() {
  let streak = 0;
  let goal = getStepGoal();
  let d = new Date();

  if (getStepsForDate(d) >= goal) {
    streak++;
  }

  d.setDate(d.getDate() - 1);
  while (true) {
    if (getStepsForDate(d) >= goal) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function renderSteps() {
  const today = new Date();
  const todaySteps = getStepsForDate(today);
  const goal = getStepGoal();

  // Dashboard
  const streakEl = document.getElementById("stepStreakBadge");
  if (streakEl)
    streakEl.textContent = `🔥 ${calculateStepStreak()} Days Streak`;

  const percentage = Math.min(Math.round((todaySteps / goal) * 100), 100);
  const ringEl = document.getElementById("stepHeroRing");
  const percEl = document.getElementById("stepHeroPercentage");
  const textEl = document.getElementById("stepHeroText");

  if (ringEl)
    ringEl.style.background = `conic-gradient(var(--primary) ${percentage}%, var(--bg-hover) ${percentage}%)`;
  if (percEl) percEl.textContent = `${percentage}%`;
  if (textEl)
    textEl.textContent = `${todaySteps.toLocaleString()} / ${goal.toLocaleString()} Steps`;

  const calEl = document.getElementById("stepCalorieTotal");
  if (calEl) calEl.textContent = `${Math.round(todaySteps * 0.04)} kcal`;

  const distEl = document.getElementById("stepDistanceTotal");
  if (distEl)
    distEl.textContent = `${((todaySteps * 0.75) / 1000).toFixed(1)} km`;

  const timeEl = document.getElementById("stepActiveTimeTotal");
  if (timeEl) timeEl.textContent = `${Math.round(todaySteps / 100)} mins`;

  const speedEl = document.getElementById("stepSpeedCurrent");
  if (speedEl) {
    speedEl.textContent =
      typeof isAutoTracking !== "undefined" && isAutoTracking
        ? currentSpeedStr
        : "0.0 km/h";
  }

  renderStepCalendar();
  renderStepAnalytics();
}

function renderStepCalendar() {
  const grid = document.getElementById("stepCalendarGrid");
  const monthYear = document.getElementById("stepCalMonthYear");
  if (!grid || !monthYear) return;

  const y = currentStepDate.getFullYear();
  const m = currentStepDate.getMonth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  monthYear.textContent = `${monthNames[m]} ${y}`;

  grid.innerHTML = "";

  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const goal = getStepGoal();

  for (let i = 0; i < firstDay; i++) {
    grid.innerHTML += `<div></div>`;
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(y, m, i);
    const steps = getStepsForDate(d);
    const isToday = d.toDateString() === new Date().toDateString();
    const achieved = steps >= goal;

    let style = `padding:8px 0; border-radius:4px; font-size:0.9rem; position:relative;`;
    if (isToday)
      style += ` background:var(--primary); color:white; font-weight:bold;`;

    let innerHtml = `${i}`;
    if (achieved) {
      innerHtml += `<br><span style="font-size:0.7rem;">✅</span>`;
    }

    grid.innerHTML += `<div style="${style}">${innerHtml}</div>`;
  }
}

function renderStepAnalytics() {
  const chart = document.getElementById("stepTrendChart");
  if (!chart) return;

  chart.innerHTML =
    '<div id="stepGoalLine" style="position: absolute; width: 100%; border-top: 2px dashed var(--primary); z-index: 0; left: 0;"></div>';
  const goal = getStepGoal();

  let maxVal = goal;
  const pastDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const steps = getStepsForDate(d);
    if (steps > maxVal) maxVal = steps;
    pastDays.push({ date: d, steps: steps });
  }

  const goalLine = document.getElementById("stepGoalLine");
  if (goalLine) {
    const goalPerc = Math.min((goal / maxVal) * 100, 100);
    goalLine.style.bottom = `${goalPerc}%`;
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  pastDays.forEach((day) => {
    const hPerc = Math.min(Math.round((day.steps / maxVal) * 100), 100);
    const dayLabel = dayNames[day.date.getDay()];
    const isToday = day.date.toDateString() === new Date().toDateString();
    const color = isToday ? "var(--primary)" : "var(--primary-light)";

    const labelVal =
      day.steps >= 1000 ? (day.steps / 1000).toFixed(1) + "k" : day.steps;

    chart.innerHTML += `
      <div style="display:flex; flex-direction:column; align-items:center; z-index:1; flex:1; height:100%; justify-content:flex-end;">
          <div style="font-size:0.65rem; color:var(--text-secondary); margin-bottom:4px;">${labelVal}</div>
          <div style="width:20px; height:${hPerc}%; background:${color}; border-radius:4px 4px 0 0; min-height:4px;"></div>
          <div style="font-size:0.7rem; color:var(--text-secondary); margin-top:4px;">${dayLabel}</div>
      </div>
    `;
  });
}

function addSteps(amount) {
  if (amount <= 0 || isNaN(amount)) return;
  const today = new Date();
  const current = getStepsForDate(today);
  setStepsForDate(today, current + amount);
  renderSteps();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".step-quick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const amount = parseInt(btn.getAttribute("data-amount"), 10);
      addSteps(amount);
    });
  });

  document.getElementById("stepCustomBtn")?.addEventListener("click", () => {
    const input = document.getElementById("stepCustomInput");
    const val = parseInt(input.value, 10);
    if (val) {
      addSteps(val);
      input.value = "";
    }
  });

  document.getElementById("btnSetStepGoal")?.addEventListener("click", () => {
    const currentGoal = getStepGoal();
    const goalStr = prompt("Enter new daily step goal:", currentGoal);
    if (goalStr) {
      const goal = parseInt(goalStr, 10);
      if (!isNaN(goal) && goal > 0) {
        setStepGoal(goal);
        renderSteps();
      }
    }
  });

  document
    .getElementById("btnCalculateSmartStepGoal")
    ?.addEventListener("click", () => {
      const age = parseInt(document.getElementById("stepCalcAge").value, 10);
      const weight = parseInt(
        document.getElementById("stepCalcWeight").value,
        10,
      );
      const height = parseInt(
        document.getElementById("stepCalcHeight").value,
        10,
      );
      if (age && weight && height) {
        const ideal = 6000 + height * 15 + weight * 10 - age * 5;
        setStepGoal(Math.max(ideal, 1000));
        renderSteps();
        alert(`Your ideal daily step goal is calculated as: ${ideal} steps!`);
      } else {
        alert("Please fill in all fields (Age, Weight, Height) to calculate.");
      }
    });

  const btnToggleAutoTrack = document.getElementById("btnToggleAutoTrack");
  btnToggleAutoTrack?.addEventListener("click", () => {
    isAutoTracking = !isAutoTracking;
    if (isAutoTracking) {
      btnToggleAutoTrack.textContent = "⏸️ Pause Auto-Tracking";
      btnToggleAutoTrack.classList.replace("btn--primary", "btn--secondary");
      window.addEventListener("devicemotion", handleMotion);
    } else {
      btnToggleAutoTrack.textContent = "▶️ Start Auto-Tracking";
      btnToggleAutoTrack.classList.replace("btn--secondary", "btn--primary");
      window.removeEventListener("devicemotion", handleMotion);
      currentSpeedStr = "0.0 km/h";
      renderSteps();
    }
  });

  document.getElementById("stepCalPrev")?.addEventListener("click", () => {
    currentStepDate.setMonth(currentStepDate.getMonth() - 1);
    renderStepCalendar();
  });
  document.getElementById("stepCalNext")?.addEventListener("click", () => {
    currentStepDate.setMonth(currentStepDate.getMonth() + 1);
    renderStepCalendar();
  });

  document.getElementById("btnResetStepData")?.addEventListener("click", () => {
    if (
      confirm(
        "Are you sure you want to delete ALL step data? This cannot be undone.",
      )
    ) {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("steps_")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      localStorage.removeItem("lifeflow_step_goal");
      localStorage.removeItem("lifeflow_steps_today");
      renderSteps();
      alert("Step data has been reset.");
    }
  });
});

// Initial renders for all mini-apps
document.addEventListener("DOMContentLoaded", () => {
  renderHabits();
  renderGoals();
  renderExpenses();
  renderWorkouts();
  renderSleep();
  renderWater();
  renderSteps();
});
