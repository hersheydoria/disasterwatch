<template>
  <div class="dashboard-wrap">

    <main class="main">
      <div class="container">
      <header class="topbar">
        <h2>Dashboard Overview</h2>
      </header>

      <section class="stats-grid">
        <div class="stat"> <div class="num">36</div> <div class="label">Total Shelters</div> </div>
        <div class="stat green"> <div class="num">28</div> <div class="label">Active Shelters</div> </div>
        <div class="stat red"> <div class="num">5</div> <div class="label">Full Capacity</div> </div>
        <div class="stat"> <div class="num">3</div> <div class="label">Under Maintenance</div> </div>
        <div class="stat orange"> <div class="num">2</div> <div class="label">Active Alerts</div> </div>
        <div class="stat blue"> <div class="num">520</div> <div class="label">Total Evacuees</div> </div>
      </section>

      <section class="panels">
        <div class="panel activities">
          <div class="panel-head">
            <span>Recent Activities</span>
            <a class="view-all">View All</a>
          </div>
          <ul>
            <li><strong>New shelter added:</strong> Barangay XYZ Hall <span class="time">2 hours ago</span></li>
            <li><strong>Updated capacity:</strong> City Gym Shelter <span class="time">5 hours ago</span></li>
            <li><strong>Earthquake alert issued</strong> in Agusan del Norte <span class="time">1 day ago</span></li>
          </ul>
        </div>

        <div class="panel">
          <div class="panel-head">
            <span>Quick Actions</span>
          </div>
          <div class="actions-grid">
            <button class="qa">
              <span class="icon-cta">＋</span>
              <div class="qa-text"><div class="text">Add New Shelter</div><div class="sub">Register a new evacuation</div></div>
            </button>
            <button class="qa">
              <span class="icon-cta">📋</span>
              <div class="qa-text"><div class="text">View All Shelters</div><div class="sub">Manage existing</div></div>
            </button>
            <button class="qa">
              <span class="icon-cta">📊</span>
              <div class="qa-text"><div class="text">Generate Report</div><div class="sub">Create detailed analytics</div></div>
            </button>
            <button class="qa">
              <span class="icon-cta">⚠️</span>
              <div class="qa-text"><div class="text">View Alerts</div><div class="sub">Monitor active warnings</div></div>
            </button>
          </div>
        </div>
      </section>

      <section class="ai-section">
        <div class="ai-header">
          <div>
            <h3>AI Safety Insights</h3>
            <p class="muted">Real-time analysis of AI-driven recommendations and system performance</p>
          </div>
          <button class="view-logs">View All Logs</button>
        </div>

        <div class="ai-grid">
          <div class="ai-card">
            <div class="ai-icon">🏟️</div>
            <div class="ai-lead">Agusan City Gym</div>
            <div class="muted">Agusan del Norte — Most Recommended Shelter</div>
          </div>

          <div class="ai-card">
            <div class="ai-icon">📍</div>
            <div class="ai-lead">Brgy. Sanghan</div>
            <div class="muted">Cabadbaran City — Most Affected Area (AI Detected)</div>
          </div>

          <div class="ai-card">
            <div class="num-big">84%</div>
            <div class="ai-lead">Accuracy Rate</div>
            <div class="bar"><div class="fill" style="width:84%"></div></div>
            <div class="muted">AI Suggestions Accuracy</div>
          </div>

          <div class="ai-card">
            <div class="ai-icon-sm">⏱️</div>
            <div class="ai-lead">Auto-synced</div>
            <div class="muted">Oct 18, 2025, 10:30 AM</div>
          </div>
        </div>
      </section>
      </div>
    </main>
  </div>
</template>

<script setup>
// Presentational component for the dashboard design. Add interactivity as needed.
</script>

<style scoped>
.dashboard-wrap { display: flex; min-height: 100vh; background: #f5f7fa; }

.main { flex: 1; overflow: auto; }

.container { padding: 2rem; overflow-y: auto; }

.topbar { margin-bottom: 2rem; }
.topbar h2 { font-size: 24px; font-weight: 600; color: #222; margin: 0; }

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  text-align: center;
}

.stat .num {
  font-size: 32px;
  font-weight: 700;
  color: #222;
  margin-bottom: 0.5rem;
}

.stat .label {
  font-size: 13px;
  color: #7a7f84;
  font-weight: 500;
}

.stat.green .num { color: #22c55e; }
.stat.red .num { color: #ef4444; }
.stat.orange .num { color: #ff6b1a; }
.stat.blue .num { color: #3b82f6; }

/* Panels Section */
.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.panel {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #222;
  font-size: 15px;
}

.view-all {
  color: #ff6b1a;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  font-size: 13px;
}

.activities ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activities li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
}

.activities li:last-child {
  border-bottom: none;
}

.time {
  float: right;
  color: #999;
  font-size: 12px;
}

/* Quick Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.qa {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.qa:hover {
  background: #f0f0f0;
  border-color: #ff6b1a;
}

.icon-cta {
  font-size: 24px;
  flex-shrink: 0;
}

.qa-text {
  flex: 1;
}

.qa-text .text {
  font-size: 13px;
  font-weight: 600;
  color: #222;
  margin-bottom: 0.25rem;
}

.qa-text .sub {
  font-size: 11px;
  color: #999;
}

/* AI Section */
.ai-section {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.ai-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: #222;
  margin: 0 0 0.5rem 0;
}

.ai-header p {
  margin: 0;
  font-size: 13px;
  color: #7a7f84;
}

.view-logs {
  padding: 0.5rem 1rem;
  background: #ff6b1a;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.view-logs:hover {
  background: #e55a0a;
}

/* AI Grid */
.ai-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.ai-card {
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.ai-icon {
  font-size: 28px;
  margin-bottom: 0.5rem;
}

.ai-lead {
  font-size: 14px;
  font-weight: 600;
  color: #222;
  margin-bottom: 0.25rem;
}

.muted {
  color: #7a7f84;
  font-size: 12px;
}

.num-big {
  font-size: 28px;
  font-weight: 700;
  color: #ff6b1a;
  margin-bottom: 0.5rem;
}

.bar {
  height: 6px;
  background: #e8e8e8;
  border-radius: 3px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.bar .fill {
  height: 100%;
  background: #ff6b1a;
}

.ai-icon-sm {
  font-size: 20px;
  margin-bottom: 0.5rem;
}

@media (max-width: 960px) {
  .dashboard-wrap { flex-direction: column; }
  .container { padding: 1rem; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .panels { grid-template-columns: 1fr; }
  .ai-grid { grid-template-columns: 1fr; }
}
</style>
