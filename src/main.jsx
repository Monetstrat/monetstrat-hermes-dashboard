import React from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  FileText,
  FolderOpen,
  GitBranch,
  ListChecks,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Workflow
} from "lucide-react";
import "./styles.css";

const clients = [
  {
    name: "ProTrader Academy",
    stage: "Research review",
    readiness: 78,
    blocker: "Sales call pack needs final source tags",
    owner: "Kent",
    updated: "18 min ago"
  },
  {
    name: "New client intake",
    stage: "Waiting for onboarding",
    readiness: 22,
    blocker: "No onboarding forms submitted yet",
    owner: "Unassigned",
    updated: "Today"
  },
  {
    name: "Demo workflow",
    stage: "Ready to generate workspace",
    readiness: 91,
    blocker: "Approval required before folder/task creation",
    owner: "Hermes",
    updated: "Today"
  }
];

const workflow = [
  { label: "Intake", status: "done", count: 1 },
  { label: "Research", status: "active", count: 2 },
  { label: "Offer", status: "waiting", count: 1 },
  { label: "Webinar", status: "waiting", count: 0 },
  { label: "Assets", status: "locked", count: 0 },
  { label: "Reporting", status: "locked", count: 0 }
];

const approvals = [
  "Approve ProTrader market research structure",
  "Confirm Sales Dashboard V1 as Supabase source",
  "Approve Drive folder template",
  "Confirm GitHub repo deployment path"
];

const integrations = [
  { name: "Linear", detail: "Connected through Hermes MCP", state: "connected", icon: ListChecks },
  { name: "Netlify", detail: "MCP connected; repo deploy pending", state: "partial", icon: GitBranch },
  { name: "Supabase", detail: "CLI visible; schema not created", state: "partial", icon: Database },
  { name: "Google Drive", detail: "Codex connected; Hermes path pending", state: "partial", icon: FolderOpen },
  { name: "Slack", detail: "Manifest ready; app install pending", state: "pending", icon: MessageSquare },
  { name: "Telegram", detail: "BotFather setup pending", state: "pending", icon: Bot }
];

const hermesQueue = [
  { task: "Create new client project template", source: "Linear", status: "Ready" },
  { task: "Build onboarding intake reviewer", source: "Hermes", status: "Blocked by Drive root" },
  { task: "Create Supabase schema", source: "Codex", status: "Waiting for project choice" },
  { task: "Draft research output review screen", source: "Dashboard", status: "Ready" }
];

function StatusPill({ state }) {
  const label = {
    connected: "Connected",
    partial: "Partial",
    pending: "Pending",
    done: "Done",
    active: "Active",
    waiting: "Waiting",
    locked: "Locked"
  }[state] || state;

  return <span className={`pill pill-${state}`}>{label}</span>;
}

function Metric({ icon: Icon, label, value, note }) {
  return (
    <section className="metric">
      <Icon aria-hidden="true" />
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{note}</span>
      </div>
    </section>
  );
}

function App() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <strong>MonetStrat</strong>
            <span>Hermes OS</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Dashboard navigation">
          <a className="active" href="#overview"><Workflow size={18} /> Overview</a>
          <a href="#clients"><FolderOpen size={18} /> Clients</a>
          <a href="#approvals"><ShieldCheck size={18} /> Approvals</a>
          <a href="#queue"><Bot size={18} /> Hermes Queue</a>
          <a href="#system"><Database size={18} /> System Health</a>
        </nav>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Internal command center</p>
            <h1>Hermes Dashboard</h1>
          </div>
          <div className="top-actions">
            <button><RefreshCw size={17} /> Sync</button>
            <button className="primary"><Bot size={17} /> Ask Hermes</button>
          </div>
        </header>

        <section id="overview" className="metrics-grid">
          <Metric icon={FolderOpen} label="Clients" value="3" note="2 need attention" />
          <Metric icon={ListChecks} label="Linear Tasks" value="12" note="setup rail created" />
          <Metric icon={ShieldCheck} label="Approvals" value="4" note="waiting on Kent" />
          <Metric icon={AlertTriangle} label="Blockers" value="3" note="repo, Drive, Slack" />
        </section>

        <section className="main-grid">
          <div className="panel" id="clients">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Client operations</p>
                <h2>Client Readiness</h2>
              </div>
              <button className="ghost">New Client <ChevronRight size={16} /></button>
            </div>

            <div className="client-list">
              {clients.map((client) => (
                <article className="client-row" key={client.name}>
                  <div className="client-main">
                    <strong>{client.name}</strong>
                    <span>{client.stage}</span>
                  </div>
                  <div className="readiness" aria-label={`${client.readiness}% ready`}>
                    <div style={{ width: `${client.readiness}%` }} />
                  </div>
                  <div className="client-meta">
                    <span>{client.blocker}</span>
                    <small>{client.owner} · {client.updated}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="panel" id="approvals">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Review gates</p>
                <h2>Pending Approvals</h2>
              </div>
              <StatusPill state="active" />
            </div>

            <div className="approval-list">
              {approvals.map((item) => (
                <label className="approval-item" key={item}>
                  <input type="checkbox" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="workflow-band">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Linear-driven workflow</p>
              <h2>Client Production Pipeline</h2>
            </div>
          </div>
          <div className="workflow-grid">
            {workflow.map((step) => (
              <article className="workflow-step" key={step.label}>
                <div>
                  <strong>{step.label}</strong>
                  <span>{step.count} task{step.count === 1 ? "" : "s"}</span>
                </div>
                <StatusPill state={step.status} />
              </article>
            ))}
          </div>
        </section>

        <section className="main-grid">
          <div className="panel" id="queue">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Agent work queue</p>
                <h2>Hermes Next Actions</h2>
              </div>
              <button className="ghost"><FileText size={16} /> Open Linear</button>
            </div>

            <div className="queue-list">
              {hermesQueue.map((item) => (
                <article className="queue-row" key={item.task}>
                  <Clock3 size={17} />
                  <div>
                    <strong>{item.task}</strong>
                    <span>{item.source} · {item.status}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="panel" id="system">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Tool access</p>
                <h2>System Health</h2>
              </div>
            </div>

            <div className="integration-list">
              {integrations.map(({ name, detail, state, icon: Icon }) => (
                <article className="integration-row" key={name}>
                  <Icon size={18} />
                  <div>
                    <strong>{name}</strong>
                    <span>{detail}</span>
                  </div>
                  <StatusPill state={state} />
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
