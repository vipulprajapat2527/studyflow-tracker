import { signup, login, logout } from "./firebase.js";

(function () {
  'use strict';

  const STORAGE_KEY = 'studyTrackerData';
  const POMO_STUDY = 25 * 60;
  const POMO_BREAK = 5 * 60;
  const RING_CIRCUMFERENCE = 2 * Math.PI * 90;

  const SUBJECT_COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#06b6d4', '#3b82f6'
  ];

  const QUOTES = [
    { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
    { text: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
    { text: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
    { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
    { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
    { text: 'It always seems impossible until it\'s done.', author: 'Nelson Mandela' },
    { text: 'Push yourself, because no one else is going to do it for you.', author: 'Unknown' },
    { text: 'Great things never come from comfort zones.', author: 'Unknown' },
    { text: 'Dream it. Wish it. Do it.', author: 'Unknown' },
    { text: 'Success doesn\'t just find you. You have to go out and get it.', author: 'Unknown' },
  ];

  const RANKS = [
    { id: 'beginner', name: 'Beginner', icon: '🌱', minHours: 0, maxHours: 10 },
    { id: 'warrior', name: 'Warrior', icon: '⚔️', minHours: 10, maxHours: 50 },
    { id: 'master', name: 'Master', icon: '👑', minHours: 50, maxHours: Infinity },
  ];

  const ACHIEVEMENTS = [
    { id: 'first_session', name: 'First Steps', icon: '🚀', desc: 'Complete your first study session' },
    { id: 'streak_3', name: 'On Fire', icon: '🔥', desc: 'Reach a 3-day streak' },
    { id: 'streak_7', name: 'Unstoppable', icon: '💪', desc: 'Reach a 7-day streak' },
    { id: 'goal_met', name: 'Goal Crusher', icon: '🎯', desc: 'Meet your daily study goal' },
    { id: 'pomodoro_5', name: 'Pomodoro Pro', icon: '🍅', desc: 'Complete 5 pomodoro sessions' },
    { id: 'hours_10', name: 'Dedicated', icon: '📖', desc: 'Study for 10 total hours' },
    { id: 'hours_50', name: 'Scholar', icon: '🎓', desc: 'Study for 50 total hours' },
    { id: 'week_warrior', name: 'Week Warrior', icon: '🏆', desc: 'Study every day for a week' },
  ];

  let state = loadState();
  let timerInterval = null;
  let timerSeconds = 0;
  let timerRunning = false;
  let activeSubjectId = null;

  let pomoInterval = null;
  let pomoSeconds = POMO_STUDY;
  let pomoRunning = false;
  let pomoPhase = 'study';
  let pomoSubjectId = null;
  let pomoSessionsToday = 0;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const els = {
    greeting: $('#greeting'),
    currentDate: $('#currentDate'),
    themeToggle: $('#themeToggle'),
    menuToggle: $('#menuToggle'),
    sidebar: $('#sidebar'),
    streakCount: $('#streakCount'),
    todayTotal: $('#todayTotal'),
    goalDisplay: $('#goalDisplay'),
    allTimeTotal: $('#allTimeTotal'),
    progressPercent: $('#progressPercent'),
    progressFill: $('#progressFill'),
    progressSubtext: $('#progressSubtext'),
    motivationalQuote: $('#motivationalQuote'),
    quoteAuthor: $('#quoteAuthor'),
    examCountdown: $('#examCountdown'),
    dailyAnalytics: $('#dailyAnalytics'),
    timerDisplay: $('#timerDisplay'),
    timerSubject: $('#timerSubject'),
    startBtn: $('#startBtn'),
    pauseBtn: $('#pauseBtn'),
    stopBtn: $('#stopBtn'),
    timerStatus: $('#timerStatus'),
    timerCard: $('#freeTimerPanel'),
    freeRingProgress: $('#freeRingProgress'),
    pomodoroDisplay: $('#pomodoroDisplay'),
    pomodoroSubject: $('#pomodoroSubject'),
    pomoStartBtn: $('#pomoStartBtn'),
    pomoPauseBtn: $('#pomoPauseBtn'),
    pomoSkipBtn: $('#pomoSkipBtn'),
    pomodoroStatus: $('#pomodoroStatus'),
    pomodoroPhase: $('#pomodoroPhase'),
    pomoRingProgress: $('#pomoRingProgress'),
    pomodoroToday: $('#pomodoroToday'),
    pomodoroTotal: $('#pomodoroTotal'),
    subjectList: $('#subjectList'),
    emptySubjects: $('#emptySubjects'),
    weeklyChart: $('#weeklyChart'),
    weekTotal: $('#weekTotal'),
    weekAverage: $('#weekAverage'),
    dailyGoal: $('#dailyGoal'),
    saveGoalBtn: $('#saveGoalBtn'),
    examName: $('#examName'),
    examDate: $('#examDate'),
    saveExamBtn: $('#saveExamBtn'),
    soundToggle: $('#soundToggle'),
    addSubjectBtn: $('#addSubjectBtn'),
    subjectModal: $('#subjectModal'),
    closeModal: $('#closeModal'),
    cancelModal: $('#cancelModal'),
    subjectForm: $('#subjectForm'),
    subjectName: $('#subjectName'),
    colorPicker: $('#colorPicker'),
    rankBadge: $('#rankBadge'),
    rankTitle: $('#rankTitle'),
    rankXP: $('#rankXP'),
    badgePreview: $('#badgePreview'),
    badgeGrid: $('#badgeGrid'),
    badgeCount: $('#badgeCount'),
    badgeTotal: $('#badgeTotal'),
    rankShowcase: $('#rankShowcase'),
    bestDay: $('#bestDay'),
    weekComparison: $('#weekComparison'),
    activeSubjects: $('#activeSubjects'),
    dailyBreakdown: $('#dailyBreakdown'),
    weeklyBreakdown: $('#weeklyBreakdown'),
    subjectChart: $('#subjectChart'),
    studyHeatmap: $('#studyHeatmap'),
    achievementToast: $('#achievementToast'),
    achievementToastIcon: $('#achievementToastIcon'),
    achievementToastName: $('#achievementToastName'),
  };

  function defaultState() {
    return {
      subjects: [],
      sessions: [],
      settings: {
        dailyGoalMinutes: 120,
        darkMode: false,
        soundEnabled: true,
        examName: '',
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
    return new Date().toISOString().split('T')[0];
  }

  function formatDuration(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m`;
    return '0m';
  }

  function formatTimer(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
  }

  function formatPomodoro(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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
      .filter((s) => s.subjectId === subjectId && (!dateStr || s.date === dateStr))
      .reduce((sum, s) => sum + s.seconds, 0);
  }

  function getWeekDates(offsetWeeks = 0) {
    const dates = [];
    const today = new Date();
    const startOffset = offsetWeeks * 7;
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i - startOffset);
      dates.push(d.toISOString().split('T')[0]);
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
      const yesterdayStr = yesterday.toISOString().split('T')[0];
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
    playSound('achievement');
    setTimeout(() => { els.achievementToast.hidden = true; }, 4000);
  }

  let audioCtx = null;

  function playSound(type) {
    if (!state.settings.soundEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx;
      const now = ctx.currentTime;

      if (type === 'timer') {
        [0, 0.15, 0.3].forEach((delay, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 880 - i * 110;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.3, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.2);
          osc.start(now + delay);
          osc.stop(now + delay + 0.2);
        });
      } else if (type === 'achievement') {
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.2, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.15);
        });
      }
    } catch { /* audio not available */ }
  }

  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.settings.darkMode ? 'dark' : 'light');
  }

  function setRingProgress(el, current, total) {
    if (!el) return;
    const offset = RING_CIRCUMFERENCE - (current / total) * RING_CIRCUMFERENCE;
    el.style.strokeDashoffset = Math.max(0, offset);
  }

  function navigateTo(view) {
    $$('.view').forEach((v) => v.classList.remove('view--active'));
    $$('.nav-item, .mobile-nav__item').forEach((n) => n.classList.remove('active'));
    const target = $(`#view-${view}`);
    if (target) target.classList.add('view--active');
    $$(`[data-view="${view}"]`).forEach((n) => n.classList.add('active'));
    els.sidebar.classList.remove('open');
  }

  function renderGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';
    els.greeting.textContent = greeting;

    els.currentDate.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
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
      els.examCountdown.innerHTML = '<div class="exam-countdown exam-countdown--empty"><span>Set an exam date in Settings to start countdown</span></div>';
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate + 'T00:00:00');
    const diff = Math.ceil((exam - today) / 86400000);

    if (diff < 0) {
      els.examCountdown.innerHTML = `<div class="exam-countdown"><p class="exam-countdown__name">${escapeHtml(examName || 'Exam')}</p><p class="exam-countdown__days">Done!</p><p class="exam-countdown__label">Exam has passed</p></div>`;
      return;
    }

    els.examCountdown.innerHTML = `
      <div class="exam-countdown">
        <p class="exam-countdown__name">${escapeHtml(examName || 'Upcoming Exam')}</p>
        <p class="exam-countdown__days">${diff}</p>
        <p class="exam-countdown__label">${diff === 1 ? 'day left' : 'days left'}</p>
        <p class="exam-countdown__date">${exam.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
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
      ${next ? `
        <div class="rank-showcase__progress"><div class="rank-showcase__progress-fill" style="width:${Math.min(100, progressToNext)}%"></div></div>
        <p class="rank-showcase__next">${formatDuration((next.minHours - hours) * 3600)} until ${next.icon} ${next.name}</p>
      ` : '<p class="rank-showcase__next">You\'ve reached the highest rank!</p>'}`;
  }

  function renderStats() {
    const todaySeconds = getTotalSecondsForDate(todayStr());
    const goalSeconds = state.settings.dailyGoalMinutes * 60;
    const percent = goalSeconds > 0 ? Math.min(100, Math.round((todaySeconds / goalSeconds) * 100)) : 0;

    els.streakCount.textContent = `${state.streak.current} day${state.streak.current !== 1 ? 's' : ''}`;
    els.todayTotal.textContent = formatDuration(todaySeconds);
    els.goalDisplay.textContent = formatDuration(goalSeconds);
    els.allTimeTotal.textContent = formatDuration(getTotalSeconds());
    els.progressPercent.textContent = `${percent}%`;
    els.progressFill.style.width = `${percent}%`;
    els.progressSubtext.textContent = `${formatDuration(todaySeconds)} of ${formatDuration(goalSeconds)} studied today`;
    els.progressFill.style.background = percent >= 100
      ? 'linear-gradient(90deg, var(--success), #34d399)'
      : 'linear-gradient(90deg, var(--primary), var(--accent))';
  }

  function renderDailyAnalytics() {
    const today = todayStr();
    const todaySeconds = getTotalSecondsForDate(today);
    const goalSeconds = state.settings.dailyGoalMinutes * 60;
    const subjectsToday = state.subjects.filter((s) => getSubjectSeconds(s.id, today) > 0).length;
    const pomoToday = state.pomodoro.todayDate === today ? state.pomodoro.todaySessions : 0;

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
        const opt = document.createElement('option');
        opt.value = sub.id;
        opt.textContent = sub.name;
        select.appendChild(opt);
      });
      if (current && state.subjects.some((s) => s.id === current)) select.value = current;
    });
  }

  function renderSubjects() {
    renderSubjectSelects();
    els.subjectList.querySelectorAll('.subject-item').forEach((el) => el.remove());

    if (state.subjects.length === 0) {
      els.emptySubjects.hidden = false;
      return;
    }
    els.emptySubjects.hidden = true;

    const maxSubjectSeconds = Math.max(...state.subjects.map((s) => getSubjectSeconds(s.id, todayStr())), 1);

    state.subjects.forEach((sub) => {
      const totalAll = getSubjectSeconds(sub.id);
      const totalToday = getSubjectSeconds(sub.id, todayStr());
      const barPercent = (totalToday / maxSubjectSeconds) * 100;

      const li = document.createElement('li');
      li.className = 'subject-item';
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
      li.querySelector('.subject-item__delete').addEventListener('click', () => deleteSubject(sub.id));
      els.subjectList.appendChild(li);
    });
  }

  function renderWeeklyChart() {
    const dates = getWeekDates();
    const today = todayStr();
    const maxSeconds = Math.max(...dates.map(getTotalSecondsForDate), 1);
    let weekTotalSeconds = 0;

    els.weeklyChart.innerHTML = '';
    dates.forEach((dateStr, i) => {
      const seconds = getTotalSecondsForDate(dateStr);
      weekTotalSeconds += seconds;
      const heightPercent = (seconds / maxSeconds) * 100;
      const d = new Date(dateStr + 'T12:00:00');
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const isToday = dateStr === today;

      const group = document.createElement('div');
      group.className = 'chart-bar-group';
      group.innerHTML = `
        <div class="chart-bar-wrapper">
          <div class="chart-bar" style="height:${Math.max(heightPercent, seconds > 0 ? 8 : 4)}%;animation-delay:${i * 0.05}s">
            <span class="chart-bar__tooltip">${formatDuration(seconds)}</span>
          </div>
        </div>
        <span class="chart-bar__label${isToday ? ' chart-bar__label--today' : ''}">${dayLabel}</span>`;
      els.weeklyChart.appendChild(group);
    });

    const daysWithStudy = dates.filter((d) => getTotalSecondsForDate(d) > 0).length || 1;
    els.weekTotal.textContent = formatDuration(weekTotalSeconds);
    els.weekAverage.textContent = formatDuration(Math.round(weekTotalSeconds / daysWithStudy));
  }

  function renderAnalytics() {
    const thisWeek = getWeekDates(0);
    const lastWeek = getWeekDates(1);

    const thisWeekTotal = thisWeek.reduce((s, d) => s + getTotalSecondsForDate(d), 0);
    const lastWeekTotal = lastWeek.reduce((s, d) => s + getTotalSecondsForDate(d), 0);

    let bestDay = '—';
    let bestSeconds = 0;
    thisWeek.forEach((d) => {
      const sec = getTotalSecondsForDate(d);
      if (sec > bestSeconds) {
        bestSeconds = sec;
        bestDay = new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
      }
    });
    els.bestDay.textContent = bestSeconds > 0 ? `${bestDay} (${formatDuration(bestSeconds)})` : '—';

    if (lastWeekTotal > 0) {
      const change = Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100);
      const sign = change >= 0 ? '+' : '';
      els.weekComparison.textContent = `${sign}${change}%`;
      els.weekComparison.className = `stat-card__value ${change >= 0 ? 'stat-card__value--up' : 'stat-card__value--down'}`;
    } else {
      els.weekComparison.textContent = thisWeekTotal > 0 ? 'New!' : '—';
      els.weekComparison.className = 'stat-card__value';
    }

    const today = todayStr();
    els.activeSubjects.textContent = state.subjects.filter((s) => getSubjectSeconds(s.id, today) > 0 || getSubjectSeconds(s.id) > 0).length;

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
      els.subjectChart.innerHTML = '<p class="subject-chart__empty">Add subjects and start studying to see progress</p>';
      return;
    }

    const totals = state.subjects.map((s) => ({
      ...s,
      seconds: getSubjectSeconds(s.id),
    })).filter((s) => s.seconds > 0).sort((a, b) => b.seconds - a.seconds);

    if (totals.length === 0) {
      els.subjectChart.innerHTML = '<p class="subject-chart__empty">No study data yet</p>';
      return;
    }

    const max = totals[0].seconds;
    els.subjectChart.innerHTML = totals.map((s, i) => `
      <div class="subject-chart__row">
        <span class="subject-chart__label" style="color:${s.color}">${escapeHtml(s.name)}</span>
        <div class="subject-chart__bar-wrap">
          <div class="subject-chart__bar" style="width:${(s.seconds / max) * 100}%;background:${s.color};animation-delay:${i * 0.08}s">
            <span>${formatDuration(s.seconds)}</span>
          </div>
        </div>
      </div>`).join('');
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

    const maxSeconds = Math.max(...allDays.map((d) => getTotalSecondsForDate(d.toISOString().split('T')[0])), 1);

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
        months.push({ name: week[0].toLocaleDateString('en-US', { month: 'short' }), span: 1 });
        lastMonth = m;
      } else {
        months[months.length - 1].span++;
      }
    });

    const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

    let html = '<div class="heatmap__months">';
    months.forEach((m) => {
      html += `<span class="heatmap__month" style="width:${m.span * 17}px">${m.name}</span>`;
    });
    html += '</div><div class="heatmap__grid">';

    html += '<div class="heatmap__days-label">';
    dayLabels.forEach((l) => { html += `<span>${l}</span>`; });
    html += '</div><div class="heatmap__cells">';

    const maxWeekLen = Math.max(...weekCols.map((w) => w.length));
    for (let row = 0; row < maxWeekLen; row++) {
      html += '<div class="heatmap__week">';
      weekCols.forEach((week) => {
        const d = week[row];
        if (!d) {
          html += '<div class="heatmap-cell heatmap-cell--0" style="visibility:hidden"></div>';
        } else {
          const dateStr = d.toISOString().split('T')[0];
          const seconds = getTotalSecondsForDate(dateStr);
          const level = getLevel(seconds);
          const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          html += `<div class="heatmap-cell heatmap-cell--${level}" data-tooltip="${label}: ${formatDuration(seconds)}"></div>`;
        }
      });
      html += '</div>';
    }

    html += '</div></div>';
    els.studyHeatmap.innerHTML = html;
  }

  function renderBadges() {
    const unlocked = new Set(state.achievements);
    els.badgeTotal.textContent = ACHIEVEMENTS.length;
    els.badgeCount.textContent = unlocked.size;

    els.badgePreview.innerHTML = ACHIEVEMENTS.slice(0, 5).map((a) => `
      <div class="badge-preview__item${unlocked.has(a.id) ? ' badge-preview__item--unlocked' : ''}">
        <span class="badge-preview__icon">${a.icon}</span>
        <span class="badge-preview__name">${a.name}</span>
      </div>`).join('');

    els.badgeGrid.innerHTML = ACHIEVEMENTS.map((a) => `
      <div class="badge-card${unlocked.has(a.id) ? ' badge-card--unlocked' : ''}">
        <span class="badge-card__icon">${a.icon}</span>
        <span class="badge-card__name">${a.name}</span>
        <span class="badge-card__desc">${a.desc}</span>
      </div>`).join('');
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
    els.examName.value = state.settings.examName || '';
    els.examDate.value = state.settings.examDate || '';
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
    els.colorPicker.innerHTML = '';
    SUBJECT_COLORS.forEach((color, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'color-option' + (i === 0 ? ' selected' : '');
      btn.style.background = color;
      btn.addEventListener('click', () => {
        els.colorPicker.querySelectorAll('.color-option').forEach((el) => el.classList.remove('selected'));
        btn.classList.add('selected');
        selectedColor = color;
      });
      els.colorPicker.appendChild(btn);
    });
    els.colorPicker._getSelected = () => selectedColor;
  }

  function openModal() {
    els.subjectModal.hidden = false;
    els.subjectName.value = '';
    els.subjectName.focus();
  }

  function closeModalFn() {
    els.subjectModal.hidden = true;
  }

  function addSubject(name, color) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (state.subjects.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Subject already exists');
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
    const existing = state.sessions.find((s) => s.subjectId === subjectId && s.date === date);
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
    els.timerCard.classList.toggle('timer-active', timerRunning);
  }

  function startTimer() {
    const subjectId = els.timerSubject.value;
    if (!subjectId) { showToast('Please select a subject first'); return; }
    activeSubjectId = subjectId;
    timerRunning = true;
    const sub = state.subjects.find((s) => s.id === subjectId);
    els.timerStatus.textContent = `Studying ${sub ? sub.name : '...'}`;
    timerInterval = setInterval(() => { timerSeconds++; updateTimerDisplay(); }, 1000);
    setTimerButtons();
  }

  function pauseTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    els.timerStatus.textContent = 'Timer paused';
    setTimerButtons();
  }

  function stopTimer(saveSession = true) {
    timerRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    if (saveSession && activeSubjectId && timerSeconds > 0) {
      recordSession(activeSubjectId, timerSeconds);
      const sub = state.subjects.find((s) => s.id === activeSubjectId);
      showToast(`Saved ${formatDuration(timerSeconds)} for ${sub ? sub.name : 'subject'}`);
    }
    timerSeconds = 0;
    activeSubjectId = null;
    updateTimerDisplay();
    els.timerStatus.textContent = 'Select a subject and press Start';
    setTimerButtons();
  }

  function updatePomodoroDisplay() {
    els.pomodoroDisplay.textContent = formatPomodoro(pomoSeconds);
    const total = pomoPhase === 'study' ? POMO_STUDY : POMO_BREAK;
    setRingProgress(els.pomoRingProgress, total - pomoSeconds, total);
    els.pomoRingProgress.classList.toggle('timer-ring__progress--break', pomoPhase === 'break');
  }

  function setPomodoroButtons() {
    els.pomoStartBtn.disabled = pomoRunning;
    els.pomoPauseBtn.disabled = !pomoRunning;
    els.pomoSkipBtn.disabled = !pomoRunning && pomoSeconds === (pomoPhase === 'study' ? POMO_STUDY : POMO_BREAK);
    els.pomodoroSubject.disabled = pomoRunning;
  }

  function completePomodoroStudy() {
    if (pomoSubjectId) recordSession(pomoSubjectId, POMO_STUDY);
    state.pomodoro.totalSessions++;
    const today = todayStr();
    if (state.pomodoro.todayDate !== today) {
      state.pomodoro.todayDate = today;
      state.pomodoro.todaySessions = 0;
    }
    state.pomodoro.todaySessions++;
    saveState();
    playSound('timer');
    showToast('Pomodoro complete! Time for a break.');
    checkAchievements();
    renderPomodoroStats();
    renderBadges();
  }

  function startPomodoroPhase() {
    pomoPhase = 'study';
    pomoSeconds = POMO_STUDY;
    els.pomodoroPhase.textContent = 'Study Session';
    els.pomodoroPhase.classList.remove('pomodoro-phase--break');
    els.pomodoroStatus.textContent = '25 min focus · 5 min break';
    updatePomodoroDisplay();
  }

  function startBreakPhase() {
    pomoPhase = 'break';
    pomoSeconds = POMO_BREAK;
    els.pomodoroPhase.textContent = 'Break Time';
    els.pomodoroPhase.classList.add('pomodoro-phase--break');
    els.pomodoroStatus.textContent = 'Take a short break. You earned it!';
    updatePomodoroDisplay();
  }

  function startPomodoro() {
    const subjectId = els.pomodoroSubject.value;
    if (!subjectId && pomoPhase === 'study') {
      showToast('Please select a subject first');
      return;
    }
    pomoSubjectId = subjectId;
    pomoRunning = true;

    pomoInterval = setInterval(() => {
      pomoSeconds--;
      updatePomodoroDisplay();
      if (pomoSeconds <= 0) {
        clearInterval(pomoInterval);
        pomoInterval = null;
        pomoRunning = false;

        if (pomoPhase === 'study') {
          completePomodoroStudy();
          startBreakPhase();
          startPomodoro();
        } else {
          playSound('timer');
          showToast('Break over! Ready for another session?');
          startPomodoroPhase();
          setPomodoroButtons();
        }
      }
    }, 1000);

    setPomodoroButtons();
  }

  function pausePomodoro() {
    pomoRunning = false;
    clearInterval(pomoInterval);
    pomoInterval = null;
    els.pomodoroStatus.textContent = 'Paused';
    setPomodoroButtons();
  }

  function skipPomodoro() {
    clearInterval(pomoInterval);
    pomoInterval = null;
    pomoRunning = false;
    if (pomoPhase === 'study') {
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
      showToast('Goal must be between 15 and 720 minutes');
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
    showToast(state.settings.examDate ? 'Exam countdown saved' : 'Exam countdown cleared');
  }

  function toggleTheme() {
    state.settings.darkMode = !state.settings.darkMode;
    applyTheme();
    saveState();
  }

  function bindEvents() {
    els.themeToggle.addEventListener('click', toggleTheme);
    els.menuToggle.addEventListener('click', () => els.sidebar.classList.toggle('open'));

    $$('.nav-item, .mobile-nav__item').forEach((btn) => {
      btn.addEventListener('click', () => navigateTo(btn.dataset.view));
    });

    $$('[data-view-link]').forEach((btn) => {
      btn.addEventListener('click', () => navigateTo(btn.dataset.viewLink));
    });

    $$('.timer-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        $$('.timer-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const isPomo = tab.dataset.timer === 'pomodoro';
        $('#freeTimerPanel').classList.toggle('timer-panel--active', !isPomo);
        $('#pomodoroPanel').classList.toggle('timer-panel--active', isPomo);
      });
    });

    els.startBtn.addEventListener('click', startTimer);
    els.pauseBtn.addEventListener('click', pauseTimer);
    els.stopBtn.addEventListener('click', () => stopTimer(true));
    els.pomoStartBtn.addEventListener('click', startPomodoro);
    els.pomoPauseBtn.addEventListener('click', pausePomodoro);
    els.pomoSkipBtn.addEventListener('click', skipPomodoro);
    els.saveGoalBtn.addEventListener('click', saveGoal);
    els.saveExamBtn.addEventListener('click', saveExam);
    els.soundToggle.addEventListener('change', () => {
      state.settings.soundEnabled = els.soundToggle.checked;
      saveState();
    });
    els.addSubjectBtn.addEventListener('click', openModal);
    els.closeModal.addEventListener('click', closeModalFn);
    els.cancelModal.addEventListener('click', closeModalFn);
    els.subjectModal.addEventListener('click', (e) => {
      if (e.target === els.subjectModal) closeModalFn();
    });
    els.subjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      addSubject(els.subjectName.value, els.colorPicker._getSelected());
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !els.subjectModal.hidden) closeModalFn();
    });
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
}
document.getElementById("signupBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signup(email, password);
    alert("Signup Successful");
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await login(email, password);
    alert("Login Successful");
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  try {
    await logout();
    alert("Logged Out");
  } catch (error) {
    alert(error.message);
  }
});
})();