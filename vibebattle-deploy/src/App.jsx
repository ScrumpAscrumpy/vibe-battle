import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════
const TASKS = [
  { id:"t1", title:"实时协作白板工具", summary:"开发一个支持多人实时协作的在线白板应用，支持画笔、形状、文字", type:"BOUNTY", status:"OPEN", difficulty:3, bountyAmount:500, openSourceBonus:100, timeLimit:120, maxParticipants:20, currentParticipants:12, techTags:["React","WebSocket","Canvas"], startTime:"2026-03-21T14:00:00Z", creator:{ displayName:"TechCorp", avatarUrl:"" }},
  { id:"t2", title:"AI 驱动的代码审查助手", summary:"构建一个自动分析代码质量并给出改进建议的 Chrome 扩展", type:"TOURNAMENT", status:"COUNTDOWN", difficulty:4, bountyAmount:2000, openSourceBonus:500, timeLimit:240, maxParticipants:50, currentParticipants:47, techTags:["TypeScript","Chrome Extension","OpenAI"], startTime:"2026-03-19T15:00:00Z", creator:{ displayName:"DevTools Inc", avatarUrl:"" }},
  { id:"t3", title:"个人财务仪表盘", summary:"设计并实现一个美观的个人财务追踪仪表盘，支持多账户聚合", type:"BOUNTY", status:"OPEN", difficulty:2, bountyAmount:300, openSourceBonus:60, timeLimit:90, maxParticipants:30, currentParticipants:8, techTags:["Next.js","Tailwind","Chart.js"], startTime:"2026-03-22T10:00:00Z", creator:{ displayName:"FinStart", avatarUrl:"" }},
  { id:"t4", title:"Markdown 知识库搜索引擎", summary:"构建一个能索引本地 Markdown 文件并支持语义搜索的桌面应用", type:"CHALLENGE", status:"IN_PROGRESS", difficulty:3, bountyAmount:800, openSourceBonus:200, timeLimit:180, maxParticipants:15, currentParticipants:15, techTags:["Electron","SQLite","Embeddings"], startTime:"2026-03-19T12:00:00Z", creator:{ displayName:"VibeBattle Official", avatarUrl:"" }},
  { id:"t5", title:"社交媒体内容日历", summary:"开发一个支持拖拽排期、多平台预览的社交媒体内容管理工具", type:"BOUNTY", status:"COMPLETED", difficulty:2, bountyAmount:400, openSourceBonus:80, timeLimit:120, maxParticipants:25, currentParticipants:22, techTags:["React","DnD","REST API"], startTime:"2026-03-15T09:00:00Z", creator:{ displayName:"MarketPro", avatarUrl:"" }, winner:{ displayName:"AliceCode", duration:2550 }},
  { id:"t6", title:"实时投票系统", summary:"构建一个支持千人同时在线投票的实时系统，展示动态结果可视化", type:"BOUNTY", status:"OPEN", difficulty:1, bountyAmount:200, openSourceBonus:40, timeLimit:60, maxParticipants:40, currentParticipants:5, techTags:["Vue","Socket.io","D3"], startTime:"2026-03-23T16:00:00Z", creator:{ displayName:"EventHub", avatarUrl:"" }},
  { id:"t7", title:"CLI 任务管理器", summary:"用 Go 编写一个带 TUI 界面的任务管理工具，支持看板视图", type:"CHALLENGE", status:"JUDGING", difficulty:3, bountyAmount:600, openSourceBonus:150, timeLimit:150, maxParticipants:20, currentParticipants:18, techTags:["Go","Bubble Tea","SQLite"], startTime:"2026-03-18T08:00:00Z", creator:{ displayName:"VibeBattle Official", avatarUrl:"" }},
  { id:"t8", title:"邮件模板构建器", summary:"可视化拖拽构建响应式邮件模板，支持导出 HTML", type:"BOUNTY", status:"OPEN", difficulty:2, bountyAmount:350, openSourceBonus:70, timeLimit:90, maxParticipants:20, currentParticipants:3, techTags:["React","MJML","DnD Kit"], startTime:"2026-03-24T11:00:00Z", creator:{ displayName:"MailStar", avatarUrl:"" }},
];

const SHOWCASES = [
  { id:"s1", title:"23分钟搞定实时白板", author:"AliceCode", tools:"Cursor + Claude Sonnet 4 + Next.js", duration:"23min", likes:128, views:2340, rank:1 },
  { id:"s2", title:"用 Bolt 极速构建投票系统", author:"BobVibe", tools:"Bolt.new + GPT-4o + Vue", duration:"18min", likes:95, views:1820, rank:1 },
  { id:"s3", title:"CLI 看板的 TUI 之美", author:"CharlieGo", tools:"Windsurf + Claude Code + Go", duration:"47min", likes:67, views:980, rank:2 },
];

const LEADERBOARD = [
  { rank:1, name:"AliceCode", elo:1847, wins:23, total:28, avgTime:"34min", tools:["Cursor","Claude"], change:+3 },
  { rank:2, name:"BobVibe", elo:1792, wins:19, total:25, avgTime:"28min", tools:["Bolt.new","GPT-4o"], change:+1 },
  { rank:3, name:"CharlieGo", elo:1735, wins:17, total:24, avgTime:"42min", tools:["Windsurf","Claude Code"], change:-1 },
  { rank:4, name:"DianaRust", elo:1698, wins:15, total:22, avgTime:"38min", tools:["Cursor","Copilot"], change:0 },
  { rank:5, name:"EvanStack", elo:1654, wins:14, total:23, avgTime:"45min", tools:["VS Code","Claude"], change:+2 },
];

// ═══════════════════════════════════════════════════
// DESIGN TOKENS & STYLES
// ═══════════════════════════════════════════════════
const COLORS = {
  bg:"#0B0B14", bgCard:"#12121F", bgHover:"#1A1A2E", bgSurface:"#16162A",
  primary:"#6C3BF5", primaryLight:"#8B5CF6", primaryFaint:"rgba(108,59,245,0.12)",
  accent:"#FF6B35", accentLight:"#FF8F5E",
  green:"#10B981", red:"#EF4444", amber:"#F59E0B", blue:"#3B82F6",
  text:"#E8E6F0", textSecondary:"#8B89A0", textMuted:"#5C5A6E",
  border:"rgba(139,92,246,0.15)", borderHover:"rgba(139,92,246,0.3)",
};

const baseStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --bg:${COLORS.bg}; --bgCard:${COLORS.bgCard}; --bgHover:${COLORS.bgHover}; --bgSurface:${COLORS.bgSurface};
    --primary:${COLORS.primary}; --primaryLight:${COLORS.primaryLight}; --primaryFaint:${COLORS.primaryFaint};
    --accent:${COLORS.accent}; --accentLight:${COLORS.accentLight};
    --green:${COLORS.green}; --red:${COLORS.red}; --amber:${COLORS.amber}; --blue:${COLORS.blue};
    --text:${COLORS.text}; --textSec:${COLORS.textSecondary}; --textMuted:${COLORS.textMuted};
    --border:${COLORS.border}; --borderHover:${COLORS.borderHover};
    --font:'Outfit',sans-serif; --mono:'JetBrains Mono',monospace;
  }
  body { background:var(--bg); color:var(--text); font-family:var(--font); }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(108,59,245,0.2)} 50%{box-shadow:0 0 40px rgba(108,59,245,0.4)} }
  @keyframes countPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.02)} }
  @keyframes gridBg {
    0%{background-position:0 0}
    100%{background-position:40px 40px}
  }
  .fade-up { animation: fadeUp 0.5s ease both; }
  .stagger-1 { animation-delay:0.1s; }
  .stagger-2 { animation-delay:0.2s; }
  .stagger-3 { animation-delay:0.3s; }
  .stagger-4 { animation-delay:0.4s; }
`;

// ═══════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════
const StatusBadge = ({ status, size = "sm" }) => {
  const map = {
    DRAFT:{ label:"草稿", bg:"rgba(92,90,110,0.2)", color:"#8B89A0", dot:"#5C5A6E" },
    OPEN:{ label:"报名中", bg:"rgba(16,185,129,0.12)", color:"#34D399", dot:"#10B981" },
    COUNTDOWN:{ label:"倒计时", bg:"rgba(245,158,11,0.12)", color:"#FBBF24", dot:"#F59E0B", pulse:true },
    IN_PROGRESS:{ label:"竞赛中", bg:"rgba(108,59,245,0.15)", color:"#A78BFA", dot:"#6C3BF5", pulse:true },
    JUDGING:{ label:"评审中", bg:"rgba(59,130,246,0.12)", color:"#60A5FA", dot:"#3B82F6" },
    COMPLETED:{ label:"已完赛", bg:"rgba(16,185,129,0.12)", color:"#34D399", dot:"#10B981" },
    CANCELLED:{ label:"已取消", bg:"rgba(239,68,68,0.12)", color:"#F87171", dot:"#EF4444" },
  };
  const s = map[status] || map.DRAFT;
  const fontSize = size === "lg" ? 13 : 11;
  const pad = size === "lg" ? "5px 12px" : "3px 10px";
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:pad, borderRadius:20, background:s.bg, fontSize, fontWeight:500, color:s.color, letterSpacing:0.3 }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot, animation:s.pulse?"pulse 1.5s infinite":"none" }} />
      {s.label}
    </span>
  );
};

const DifficultyBadge = ({ level }) => {
  const filled = "★".repeat(level);
  const empty = "☆".repeat(4 - level);
  return <span style={{ fontSize:12, color:"#F59E0B", letterSpacing:1 }}>{filled}<span style={{ color:"#3A3850" }}>{empty}</span></span>;
};

const PrizeBadge = ({ amount, type = "bounty" }) => {
  const isBounty = type === "bounty";
  return (
    <span style={{ fontFamily:"var(--mono)", fontWeight:600, fontSize: isBounty ? 18 : 13, color: isBounty ? COLORS.accent : COLORS.primaryLight }}>
      {isBounty ? "" : "+"} ${amount}
    </span>
  );
};

const MetricCard = ({ label, value, icon }) => (
  <div style={{ background:"var(--bgCard)", border:"1px solid var(--border)", borderRadius:12, padding:"16px 20px", flex:1, minWidth:140 }}>
    <div style={{ fontSize:12, color:"var(--textSec)", marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>{icon}{label}</div>
    <div style={{ fontSize:24, fontWeight:700, color:"var(--text)", fontFamily:"var(--mono)" }}>{value}</div>
  </div>
);

const CTAButton = ({ children, variant = "primary", onClick, disabled, size = "md", style: sx = {} }) => {
  const base = { border:"none", cursor: disabled?"not-allowed":"pointer", fontFamily:"var(--font)", fontWeight:600, borderRadius:10, transition:"all 0.2s", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, opacity:disabled?0.4:1 };
  const sizes = { sm:{ padding:"8px 16px", fontSize:13 }, md:{ padding:"12px 24px", fontSize:14 }, lg:{ padding:"14px 32px", fontSize:16 } };
  const variants = {
    primary:{ background:"var(--primary)", color:"#fff" },
    secondary:{ background:"transparent", color:"var(--primary)", border:"1.5px solid var(--primary)" },
    accent:{ background:"var(--accent)", color:"#fff" },
    ghost:{ background:"transparent", color:"var(--textSec)", border:"1px solid var(--border)" },
    danger:{ background:"rgba(239,68,68,0.15)", color:"#F87171", border:"1px solid rgba(239,68,68,0.3)" },
  };
  return <button onClick={disabled?undefined:onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...sx }}>{children}</button>;
};

const EmptyState = ({ message, cta, onCta }) => (
  <div style={{ textAlign:"center", padding:"60px 20px" }}>
    <div style={{ fontSize:40, marginBottom:16, opacity:0.3 }}>🔍</div>
    <div style={{ fontSize:15, color:"var(--textSec)", marginBottom:20 }}>{message}</div>
    {cta && <CTAButton onClick={onCta}>{cta}</CTAButton>}
  </div>
);

const CountdownTimer = ({ seconds, size = "md" }) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  const isUrgent = seconds < 600;
  const isCritical = seconds < 60;
  const color = isCritical ? COLORS.red : isUrgent ? COLORS.amber : COLORS.primaryLight;
  const fontSize = size === "lg" ? 36 : size === "md" ? 20 : 13;
  return (
    <span style={{ fontFamily:"var(--mono)", fontWeight:700, fontSize, color, letterSpacing:2, animation: isCritical ? "pulse 0.5s infinite":"none" }}>
      {h > 0 ? `${pad(h)}:` : ""}{pad(m)}:{pad(s)}
    </span>
  );
};

const Avatar = ({ name, size = 32 }) => {
  const colors = ["#6C3BF5","#FF6B35","#10B981","#3B82F6","#F59E0B","#EF4444","#EC4899"];
  const idx = name.split("").reduce((a,c) => a + c.charCodeAt(0), 0) % colors.length;
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:colors[idx], display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.4, fontWeight:600, color:"#fff", flexShrink:0 }}>
      {name.slice(0,2).toUpperCase()}
    </div>
  );
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"var(--bgCard)", border:"1px solid var(--border)", borderRadius:16, padding:28, maxWidth:480, width:"90%", animation:"fadeUp 0.3s ease" }}>
        <div style={{ fontSize:18, fontWeight:600, marginBottom:16 }}>{title}</div>
        {children}
      </div>
    </div>
  );
};

const Toast = ({ message, type = "info", visible }) => {
  if (!visible) return null;
  const colors = { info:COLORS.blue, success:COLORS.green, error:COLORS.red, warning:COLORS.amber };
  return (
    <div style={{ position:"fixed", top:80, right:20, zIndex:2000, background:"var(--bgCard)", border:`1px solid ${colors[type]}33`, borderRadius:10, padding:"12px 20px", fontSize:13, color:colors[type], animation:"slideIn 0.3s ease", boxShadow:`0 4px 20px ${colors[type]}22` }}>
      {message}
    </div>
  );
};

const TabSwitcher = ({ tabs, active, onChange }) => (
  <div style={{ display:"flex", gap:4, background:"var(--bgSurface)", borderRadius:10, padding:3 }}>
    {tabs.map(t => (
      <button key={t} onClick={() => onChange(t)} style={{ padding:"8px 18px", borderRadius:8, border:"none", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"var(--font)", background: active===t?"var(--primary)":"transparent", color: active===t?"#fff":"var(--textSec)", transition:"all 0.2s" }}>{t}</button>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════
// TASK CARD
// ═══════════════════════════════════════════════════
const TaskCard = ({ task, onClick, variant = "default" }) => {
  const isFeatured = variant === "featured";
  return (
    <div onClick={() => onClick(task.id)} style={{ background:"var(--bgCard)", border: isFeatured ? "1px solid rgba(108,59,245,0.3)" : "1px solid var(--border)", borderRadius:14, padding: isFeatured ? 22 : 18, cursor:"pointer", transition:"all 0.25s", position:"relative", overflow:"hidden" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(108,59,245,0.5)"; e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor=isFeatured?"rgba(108,59,245,0.3)":"var(--border)"; e.currentTarget.style.transform="translateY(0)"; }}>
      {isFeatured && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,var(--primary),var(--accent))" }} />}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <StatusBadge status={task.status} />
        <div style={{ textAlign:"right" }}>
          <PrizeBadge amount={task.bountyAmount} />
          {task.openSourceBonus > 0 && <div style={{ marginTop:2 }}><PrizeBadge amount={task.openSourceBonus} type="bonus" /></div>}
        </div>
      </div>
      <div style={{ fontSize: isFeatured?17:15, fontWeight:600, marginBottom:6, lineHeight:1.4, color:"var(--text)" }}>{task.title}</div>
      <div style={{ fontSize:13, color:"var(--textSec)", marginBottom:14, lineHeight:1.5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{task.summary}</div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <DifficultyBadge level={task.difficulty} />
        <span style={{ fontSize:12, color:"var(--textMuted)", fontFamily:"var(--mono)" }}>⏱ {task.timeLimit}min</span>
      </div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
        {task.techTags.slice(0,3).map(t => <span key={t} style={{ fontSize:11, padding:"2px 8px", borderRadius:4, background:"var(--primaryFaint)", color:"var(--primaryLight)" }}>{t}</span>)}
        {task.techTags.length > 3 && <span style={{ fontSize:11, color:"var(--textMuted)" }}>+{task.techTags.length-3}</span>}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid var(--border)", paddingTop:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Avatar name={task.creator.displayName} size={22} />
          <span style={{ fontSize:12, color:"var(--textSec)" }}>{task.creator.displayName}</span>
        </div>
        <span style={{ fontSize:11, color:"var(--textMuted)" }}>{task.currentParticipants}/{task.maxParticipants} 已报名</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════

// ── LANDING ──
const LandingPage = ({ navigate }) => (
  <div>
    {/* Hero */}
    <section style={{ position:"relative", padding:"80px 0 60px", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 0%, rgba(108,59,245,0.15) 0%, transparent 60%)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(108,59,245,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,59,245,0.04) 1px, transparent 1px)", backgroundSize:"40px 40px", animation:"gridBg 20s linear infinite", pointerEvents:"none" }} />
      <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }} className="fade-up">
        <div style={{ fontSize:13, fontWeight:500, color:"var(--accent)", letterSpacing:3, marginBottom:20, textTransform:"uppercase" }}>⚡ The Arena for Vibe Coders</div>
        <h1 style={{ fontSize:"clamp(32px, 5vw, 52px)", fontWeight:800, lineHeight:1.15, marginBottom:20, background:"linear-gradient(135deg, var(--text) 0%, var(--primaryLight) 50%, var(--accent) 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          用 AI 工具竞速解决<br />真实需求，赢取奖金
        </h1>
        <p style={{ fontSize:17, color:"var(--textSec)", maxWidth:560, margin:"0 auto 32px", lineHeight:1.7 }}>
          发布你的需求或参加限时竞赛，用 Vibe Coding 最短时间交付可运行产品。开源你的工作流，获取额外奖励。
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <CTAButton size="lg" onClick={() => navigate("tasks")}>🏟️ 浏览赛事</CTAButton>
          <CTAButton size="lg" variant="secondary" onClick={() => navigate("dashboard")}>📋 发布任务</CTAButton>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section style={{ maxWidth:900, margin:"0 auto 48px", padding:"0 20px" }} className="fade-up stagger-1">
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <MetricCard label="已举办赛事" value="1,247" icon="🏆" />
        <MetricCard label="总奖金池" value="$487K" icon="💰" />
        <MetricCard label="活跃 Coder" value="3,892" icon="⚡" />
        <MetricCard label="平均完赛时间" value="38min" icon="⏱" />
      </div>
    </section>

    {/* How It Works */}
    <section style={{ maxWidth:900, margin:"0 auto 56px", padding:"0 20px" }} className="fade-up stagger-2">
      <h2 style={{ fontSize:22, fontWeight:700, textAlign:"center", marginBottom:32 }}>如何运作</h2>
      <div style={{ display:"flex", gap:0, justifyContent:"center", flexWrap:"wrap" }}>
        {[
          { icon:"📋", title:"发布任务", desc:"描述需求与奖金" },
          { icon:"🙋", title:"报名参赛", desc:"选择感兴趣的赛事" },
          { icon:"⏱", title:"同步开赛", desc:"倒计时开始，同时出发" },
          { icon:"🚀", title:"提交评审", desc:"完成后一键提交" },
          { icon:"🌟", title:"开源展示", desc:"公开工作流赢额外奖励" },
        ].map((step, i) => (
          <div key={i} style={{ flex:1, minWidth:140, textAlign:"center", padding:"0 12px", position:"relative" }}>
            {i > 0 && <div style={{ position:"absolute", left:-6, top:20, width:12, height:2, background:"var(--border)" }} />}
            <div style={{ width:44, height:44, borderRadius:12, background:"var(--primaryFaint)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, margin:"0 auto 10px" }}>{step.icon}</div>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{step.title}</div>
            <div style={{ fontSize:12, color:"var(--textSec)" }}>{step.desc}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Live Competitions */}
    <section style={{ maxWidth:1100, margin:"0 auto 56px", padding:"0 20px" }} className="fade-up stagger-3">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontSize:22, fontWeight:700 }}>🔥 热门赛事</h2>
        <button onClick={() => navigate("tasks")} style={{ background:"none", border:"none", color:"var(--primaryLight)", fontSize:13, cursor:"pointer", fontFamily:"var(--font)" }}>查看全部 →</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:14 }}>
        {TASKS.filter(t => ["OPEN","COUNTDOWN","IN_PROGRESS"].includes(t.status)).slice(0,3).map(t => (
          <TaskCard key={t.id} task={t} onClick={(id) => navigate("detail",id)} variant="featured" />
        ))}
      </div>
    </section>

    {/* Value Props */}
    <section style={{ maxWidth:900, margin:"0 auto 56px", padding:"0 20px" }}>
      <h2 style={{ fontSize:22, fontWeight:700, textAlign:"center", marginBottom:28 }}>三方共赢</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(250px, 1fr))", gap:14 }}>
        {[
          { icon:"🏢", title:"买家", items:["竞赛价格获得多方案","最短时间看到可运行产品","全过程透明可回溯"] },
          { icon:"⚡", title:"参赛者", items:["展示 AI 工具链实力","赢取奖金建立品牌","开源工作流获额外收入"] },
          { icon:"🎯", title:"主办方", items:["品牌曝光与用户增长","获取工具链使用数据","建立开发者社区"] },
        ].map((v,i) => (
          <div key={i} style={{ background:"var(--bgCard)", border:"1px solid var(--border)", borderRadius:14, padding:22 }}>
            <div style={{ fontSize:28, marginBottom:10 }}>{v.icon}</div>
            <div style={{ fontSize:16, fontWeight:600, marginBottom:12 }}>{v.title}</div>
            {v.items.map((item,j) => <div key={j} style={{ fontSize:13, color:"var(--textSec)", marginBottom:6, paddingLeft:14, position:"relative" }}><span style={{ position:"absolute", left:0, color:"var(--green)" }}>✓</span>{item}</div>)}
          </div>
        ))}
      </div>
    </section>

    {/* Bottom CTA */}
    <section style={{ maxWidth:700, margin:"0 auto 60px", padding:"0 20px", textAlign:"center" }}>
      <div style={{ background:"var(--bgCard)", border:"1px solid var(--border)", borderRadius:20, padding:"40px 32px" }}>
        <h2 style={{ fontSize:24, fontWeight:700, marginBottom:12 }}>准备好了吗？</h2>
        <p style={{ fontSize:15, color:"var(--textSec)", marginBottom:24 }}>无论你是有需求的买家还是身怀绝技的 Vibe Coder，这里都有你的舞台。</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <CTAButton onClick={() => navigate("tasks")}>我是开发者，去参赛</CTAButton>
          <CTAButton variant="accent" onClick={() => navigate("dashboard")}>我有需求，去发布</CTAButton>
        </div>
      </div>
    </section>
  </div>
);

// ── TASKS MARKETPLACE ──
const TasksPage = ({ navigate }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [sort, setSort] = useState("推荐");

  const toggleFilter = (arr, setArr, val) => setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const filtered = TASKS.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.summary.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter.length && !typeFilter.includes(t.type)) return false;
    if (statusFilter.length && !statusFilter.includes(t.status)) return false;
    return true;
  }).sort((a,b) => {
    if (sort === "奖金最高") return b.bountyAmount - a.bountyAmount;
    if (sort === "最新发布") return new Date(b.startTime) - new Date(a.startTime);
    if (sort === "报名最多") return b.currentParticipants - a.currentParticipants;
    return b.bountyAmount * 0.5 + b.currentParticipants * 10 - (a.bountyAmount * 0.5 + a.currentParticipants * 10);
  });

  const Chip = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{ padding:"5px 14px", borderRadius:20, border: active ? "1.5px solid var(--primary)" : "1px solid var(--border)", background: active ? "var(--primaryFaint)" : "transparent", color: active ? "var(--primaryLight)" : "var(--textSec)", fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.2s" }}>{label}</button>
  );

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 20px" }}>
      <h1 style={{ fontSize:28, fontWeight:700, marginBottom:8 }}>任务市场</h1>
      <p style={{ fontSize:14, color:"var(--textSec)", marginBottom:24 }}>发现你感兴趣的竞赛，展示 Vibe Coding 实力</p>

      {/* Stats */}
      <div style={{ display:"flex", gap:10, marginBottom:24, flexWrap:"wrap" }}>
        <MetricCard label="开放赛事" value={TASKS.filter(t=>t.status==="OPEN").length} icon="🟢" />
        <MetricCard label="总奖金池" value={`$${TASKS.reduce((a,t)=>a+t.bountyAmount,0).toLocaleString()}`} icon="💰" />
        <MetricCard label="活跃参赛者" value="892" icon="⚡" />
        <MetricCard label="即将开赛" value={TASKS.filter(t=>t.status==="COUNTDOWN").length} icon="⏱" />
      </div>

      {/* Filters */}
      <div style={{ background:"var(--bgCard)", border:"1px solid var(--border)", borderRadius:14, padding:18, marginBottom:20 }}>
        <div style={{ marginBottom:14 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 搜索赛事..." style={{ width:"100%", padding:"10px 16px", borderRadius:10, border:"1px solid var(--border)", background:"var(--bgSurface)", color:"var(--text)", fontSize:14, fontFamily:"var(--font)", outline:"none" }}/>
        </div>
        <div style={{ display:"flex", gap:20, flexWrap:"wrap", fontSize:12 }}>
          <div>
            <span style={{ color:"var(--textMuted)", marginRight:8 }}>类型:</span>
            {["BOUNTY","TOURNAMENT","CHALLENGE"].map(t => <Chip key={t} label={t === "BOUNTY" ? "悬赏" : t === "TOURNAMENT" ? "赛事" : "挑战"} active={typeFilter.includes(t)} onClick={() => toggleFilter(typeFilter, setTypeFilter, t)} />)}
          </div>
          <div>
            <span style={{ color:"var(--textMuted)", marginRight:8 }}>状态:</span>
            {["OPEN","COUNTDOWN","IN_PROGRESS","JUDGING","COMPLETED"].map(s => <Chip key={s} label={{OPEN:"报名中",COUNTDOWN:"倒计时",IN_PROGRESS:"竞赛中",JUDGING:"评审中",COMPLETED:"已完赛"}[s]} active={statusFilter.includes(s)} onClick={() => toggleFilter(statusFilter, setStatusFilter, s)} />)}
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
          <span style={{ fontSize:12, color:"var(--textMuted)" }}>{filtered.length} 个赛事</span>
          <div style={{ display:"flex", gap:4 }}>
            {["推荐","奖金最高","最新发布","报名最多"].map(s => (
              <button key={s} onClick={() => setSort(s)} style={{ padding:"4px 12px", borderRadius:6, border:"none", fontSize:11, cursor:"pointer", fontFamily:"var(--font)", background: sort===s?"var(--primary)":"transparent", color: sort===s?"#fff":"var(--textMuted)", transition:"all 0.15s" }}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState message="没有找到匹配的赛事，试试调整筛选条件" cta="清除筛选" onCta={() => { setSearch(""); setTypeFilter([]); setStatusFilter([]); }} />
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:14 }}>
          {filtered.map(t => <TaskCard key={t.id} task={t} onClick={(id) => navigate("detail",id)} />)}
        </div>
      )}
    </div>
  );
};

// ── TASK DETAIL ──
const TaskDetailPage = ({ taskId, navigate }) => {
  const task = TASKS.find(t => t.id === taskId) || TASKS[0];
  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const ctaMap = {
    OPEN:{ label:"报名参赛", action:()=>setShowModal(true), variant:"primary" },
    COUNTDOWN:{ label:"60s 后开赛", action:null, variant:"ghost", disabled:true },
    IN_PROGRESS:{ label:"进入竞赛场", action:()=>navigate("arena",task.id), variant:"accent" },
    JUDGING:{ label:"查看提交", action:null, variant:"ghost" },
    COMPLETED:{ label:"查看结果", action:null, variant:"ghost" },
    CANCELLED:{ label:"已取消", action:null, variant:"danger", disabled:true },
  };
  const cta = ctaMap[task.status] || ctaMap.OPEN;

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 20px" }}>
      <button onClick={() => navigate("tasks")} style={{ background:"none", border:"none", color:"var(--textSec)", fontSize:13, cursor:"pointer", fontFamily:"var(--font)", marginBottom:20 }}>← 返回任务市场</button>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:24 }}>
        {/* Left: Content */}
        <div className="fade-up">
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <StatusBadge status={task.status} size="lg" />
            <span style={{ fontSize:12, color:"var(--textMuted)", background:"var(--bgSurface)", padding:"3px 10px", borderRadius:6 }}>{task.type}</span>
          </div>
          <h1 style={{ fontSize:28, fontWeight:700, marginBottom:12 }}>{task.title}</h1>
          <p style={{ fontSize:15, color:"var(--textSec)", marginBottom:28, lineHeight:1.7 }}>{task.summary}</p>

          {[
            { title:"背景介绍", content:"随着远程办公的普及，团队需要一个轻量级的实时协作工具来进行头脑风暴和方案讨论。目前市场上的白板工具要么过于复杂，要么不支持实时协作。" },
            { title:"任务目标", content:"交付一个可运行的在线白板应用，支持多人实时协作，包含基础绘图工具。" },
            { title:"交付要求", items:["支持画笔、形状（矩形/圆形/直线）、文字三种工具","支持至少 5 人同时在线协作","实时同步所有用户的操作","支持撤销/重做","响应式设计，支持桌面端和平板端"] },
            { title:"技术约束", content:`前端框架: ${task.techTags.join("、")}。必须支持现代浏览器（Chrome 90+、Firefox 88+、Safari 14+）。部署到 Vercel 或类似平台。` },
            { title:"验收标准", items:["功能完整度 (30%): 所有交付要求点均实现","代码质量 (20%): 结构清晰、可维护","UI 设计 (20%): 美观、一致、有设计感","用户体验 (15%): 流畅、直觉化","创新性 (15%): 超出基础要求的亮点"] },
            { title:"版权归属", content:"作品版权归创作者所有。买家获得永久使用授权。如参与开源展示，需同意 MIT 协议。" },
          ].map((sec, i) => (
            <div key={i} style={{ marginBottom:24 }}>
              <h3 style={{ fontSize:16, fontWeight:600, marginBottom:10, color:"var(--text)" }}>{sec.title}</h3>
              {sec.content && <p style={{ fontSize:14, color:"var(--textSec)", lineHeight:1.8 }}>{sec.content}</p>}
              {sec.items && sec.items.map((item, j) => (
                <div key={j} style={{ fontSize:14, color:"var(--textSec)", padding:"4px 0 4px 20px", position:"relative", lineHeight:1.6 }}>
                  <span style={{ position:"absolute", left:0, color:"var(--primaryLight)" }}>•</span>{item}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right: Sidebar */}
        <div className="fade-up stagger-1">
          <div style={{ background:"var(--bgCard)", border:"1px solid var(--border)", borderRadius:16, padding:24, position:"sticky", top:80 }}>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:12, color:"var(--textMuted)", marginBottom:6 }}>主奖金</div>
              <div style={{ fontFamily:"var(--mono)", fontSize:36, fontWeight:700, color:"var(--accent)" }}>${task.bountyAmount}</div>
              {task.openSourceBonus > 0 && <div style={{ fontSize:13, color:"var(--primaryLight)", marginTop:4 }}>+ ${task.openSourceBonus} 开源奖励</div>}
            </div>
            <div style={{ borderTop:"1px solid var(--border)", paddingTop:16 }}>
              {[
                { label:"难度", value: <DifficultyBadge level={task.difficulty} /> },
                { label:"限时", value: `${task.timeLimit} 分钟` },
                { label:"报名", value: <><span style={{ color:"var(--primaryLight)", fontWeight:600 }}>{task.currentParticipants}</span>/{task.maxParticipants}</> },
                { label:"开赛", value: new Date(task.startTime).toLocaleString("zh-CN", { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" }) },
              ].map((row, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none", fontSize:14 }}>
                  <span style={{ color:"var(--textMuted)" }}>{row.label}</span>
                  <span style={{ color:"var(--text)" }}>{row.value}</span>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div style={{ marginTop:14, marginBottom:18 }}>
              <div style={{ height:4, borderRadius:2, background:"var(--bgSurface)" }}>
                <div style={{ height:4, borderRadius:2, background:"var(--primary)", width:`${(task.currentParticipants/task.maxParticipants)*100}%`, transition:"width 0.3s" }} />
              </div>
            </div>
            <CTAButton variant={cta.variant} disabled={cta.disabled} onClick={cta.action} size="lg" style={{ width:"100%" }}>{cta.label}</CTAButton>
            {task.status === "COMPLETED" && task.winner && (
              <div style={{ marginTop:14, padding:12, background:"rgba(16,185,129,0.08)", borderRadius:10, textAlign:"center" }}>
                <div style={{ fontSize:12, color:"var(--green)", marginBottom:4 }}>🏆 获胜者</div>
                <div style={{ fontSize:15, fontWeight:600 }}>{task.winner.displayName}</div>
                <div style={{ fontSize:12, color:"var(--textSec)" }}>{Math.floor(task.winner.duration/60)}分{task.winner.duration%60}秒完成</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={()=>{setShowModal(false);setAgreed(false);}} title="确认报名参赛">
        <div style={{ fontSize:14, color:"var(--textSec)", marginBottom:16, lineHeight:1.7 }}>
          <p>你即将报名参加：</p>
          <div style={{ background:"var(--bgSurface)", borderRadius:10, padding:14, margin:"12px 0" }}>
            <div style={{ fontWeight:600, color:"var(--text)", marginBottom:4 }}>{task.title}</div>
            <div style={{ display:"flex", gap:16, fontSize:13 }}>
              <span>⏱ {task.timeLimit}min</span>
              <span style={{ color:"var(--accent)" }}>${task.bountyAmount}</span>
            </div>
          </div>
        </div>
        <label style={{ display:"flex", gap:8, alignItems:"flex-start", fontSize:13, color:"var(--textSec)", cursor:"pointer", marginBottom:20 }}>
          <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ marginTop:2 }} />
          我已阅读并同意赛事规则，理解比赛过程将被全程记录
        </label>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <CTAButton variant="ghost" onClick={()=>{setShowModal(false);setAgreed(false);}}>取消</CTAButton>
          <CTAButton disabled={!agreed} onClick={()=>{setShowModal(false);setAgreed(false);navigate("arena",task.id);}}>确认报名</CTAButton>
        </div>
      </Modal>
    </div>
  );
};

// ── ARENA ──
const ArenaPage = ({ taskId, navigate }) => {
  const task = TASKS.find(t => t.id === taskId) || TASKS[0];
  const [seconds, setSeconds] = useState(task.timeLimit * 60);
  const [repoUrl, setRepoUrl] = useState("");
  const [deployUrl, setDeployUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [recording, setRecording] = useState(true);
  const [toast, setToast] = useState(null);
  const checklist = ["画笔工具","形状工具","文字工具","多人实时协作","撤销/重做"];
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (seconds === 600) showToastMsg("距离截止还有 10 分钟", "warning");
    if (seconds === 60) showToastMsg("最后 1 分钟！", "error");
    if (seconds === 0) showToastMsg("时间到！自动提交最后版本", "info");
  }, [seconds]);

  const showToastMsg = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const inputStyle = { width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid var(--border)", background:"var(--bg)", color:"var(--text)", fontSize:13, fontFamily:"var(--font)", outline:"none", marginBottom:10 };

  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {/* Top Bar */}
      <div style={{ background:"var(--bgCard)", borderBottom:"1px solid var(--border)", padding:"10px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontWeight:600, fontSize:15 }}>{task.title}</span>
          <StatusBadge status="IN_PROGRESS" />
        </div>
        <div style={{ animation: seconds < 60 ? "countPulse 0.5s infinite" : "none" }}>
          <CountdownTimer seconds={seconds} size="lg" />
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:12, color:"var(--textMuted)" }}>#3 当前排名</span>
          <div style={{ width:8, height:8, borderRadius:"50%", background: recording ? "var(--green)" : "var(--red)" }} title={recording?"录制中":"录制停止"} />
          <CTAButton variant="danger" size="sm" onClick={() => navigate("detail", task.id)}>放弃比赛</CTAButton>
        </div>
      </div>

      {/* Three Panel Layout */}
      <div style={{ flex:1, display:"grid", gridTemplateColumns:"280px 1fr 300px", height:"calc(100vh - 58px)" }}>
        {/* Left: Task Panel */}
        <div style={{ borderRight:"1px solid var(--border)", padding:18, overflowY:"auto" }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14, color:"var(--textMuted)", letterSpacing:0.5, textTransform:"uppercase" }}>任务要求</h3>
          <p style={{ fontSize:13, color:"var(--textSec)", lineHeight:1.7, marginBottom:20 }}>{task.summary}</p>
          <h4 style={{ fontSize:13, fontWeight:600, marginBottom:10 }}>交付清单</h4>
          {checklist.map((item, i) => (
            <label key={i} style={{ display:"flex", gap:8, alignItems:"center", fontSize:13, color: checked.includes(i) ? "var(--green)" : "var(--textSec)", padding:"6px 0", cursor:"pointer" }}>
              <input type="checkbox" checked={checked.includes(i)} onChange={() => setChecked(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev,i])} />
              <span style={{ textDecoration: checked.includes(i) ? "line-through" : "none" }}>{item}</span>
            </label>
          ))}
          <div style={{ marginTop:20, padding:12, background:"var(--bgSurface)", borderRadius:10, fontSize:12, color:"var(--textMuted)" }}>
            <div style={{ marginBottom:6, fontWeight:500, color:"var(--textSec)" }}>验收标准</div>
            功能完整度 30% · 代码质量 20% · UI 设计 20% · 用户体验 15% · 创新性 15%
          </div>
        </div>

        {/* Center: Work Area */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, background:"repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(108,59,245,0.03) 39px, rgba(108,59,245,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(108,59,245,0.03) 39px, rgba(108,59,245,0.03) 40px)" }}>
          <div style={{ textAlign:"center", maxWidth:460 }}>
            <div style={{ fontSize:48, marginBottom:16, opacity:0.3 }}>💻</div>
            <h2 style={{ fontSize:20, fontWeight:600, marginBottom:10 }}>在本地 IDE 中开发</h2>
            <p style={{ fontSize:14, color:"var(--textSec)", lineHeight:1.7, marginBottom:24 }}>
              使用你熟悉的 IDE 和 AI 工具进行开发。完成后在右侧提交你的代码仓库和部署地址。
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", background:"var(--bgCard)", borderRadius:8, border:"1px solid var(--border)", fontSize:12 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background: recording ? "var(--red)" : "var(--textMuted)", animation: recording ? "pulse 1s infinite":"none" }} />
                {recording ? "屏幕录制中" : "录制未启动"}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", background:"var(--bgCard)", borderRadius:8, border:"1px solid var(--border)", fontSize:12 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--green)" }} />
                AI 日志采集中
              </div>
            </div>
            <div style={{ marginTop:24, padding:14, background:"var(--bgCard)", borderRadius:10, border:"1px solid var(--border)", textAlign:"left" }}>
              <div style={{ fontSize:12, color:"var(--textMuted)", marginBottom:8 }}>📝 最近 Git 提交</div>
              <div style={{ fontSize:12, color:"var(--textSec)", fontFamily:"var(--mono)" }}>暂无提交记录，开始编码吧...</div>
            </div>
          </div>
        </div>

        {/* Right: Submit Panel */}
        <div style={{ borderLeft:"1px solid var(--border)", padding:18, overflowY:"auto" }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14, color:"var(--textMuted)", letterSpacing:0.5, textTransform:"uppercase" }}>提交作品</h3>
          {submitted ? (
            <div style={{ textAlign:"center", padding:"30px 0" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>✅</div>
              <div style={{ fontSize:15, fontWeight:600, color:"var(--green)", marginBottom:6 }}>已提交</div>
              <div style={{ fontSize:12, color:"var(--textSec)", marginBottom:16 }}>用时 {Math.floor((task.timeLimit*60-seconds)/60)}分{(task.timeLimit*60-seconds)%60}秒</div>
              <div style={{ fontSize:12, color:"var(--textMuted)" }}>你可以继续修改并再次提交，以最后一次为准</div>
              <CTAButton variant="secondary" size="sm" onClick={() => setSubmitted(false)} style={{ marginTop:14 }}>修改并重新提交</CTAButton>
            </div>
          ) : (
            <>
              <label style={{ fontSize:12, color:"var(--textSec)", marginBottom:4, display:"block" }}>代码仓库 URL *</label>
              <input value={repoUrl} onChange={e => setRepoUrl(e.target.value)} placeholder="https://github.com/you/project" style={inputStyle} />
              <label style={{ fontSize:12, color:"var(--textSec)", marginBottom:4, display:"block" }}>部署地址 (可选)</label>
              <input value={deployUrl} onChange={e => setDeployUrl(e.target.value)} placeholder="https://your-app.vercel.app" style={inputStyle} />
              <label style={{ fontSize:12, color:"var(--textSec)", marginBottom:4, display:"block" }}>备注 (可选)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="补充说明..." rows={3} style={{ ...inputStyle, resize:"vertical" }} />
              <CTAButton variant="primary" size="md" disabled={!repoUrl.startsWith("http")} onClick={() => setShowSubmitModal(true)} style={{ width:"100%", marginTop:4 }}>🚀 提交作品</CTAButton>
            </>
          )}

          <div style={{ marginTop:24, borderTop:"1px solid var(--border)", paddingTop:16 }}>
            <div style={{ fontSize:12, color:"var(--textMuted)", marginBottom:10 }}>提交历史</div>
            {submitted ? (
              <div style={{ fontSize:12, padding:10, background:"var(--bgSurface)", borderRadius:8, color:"var(--textSec)" }}>
                <div style={{ fontWeight:500, color:"var(--text)", marginBottom:2 }}>提交 #1</div>
                <div>用时 {Math.floor((task.timeLimit*60-seconds)/60)}min · {new Date().toLocaleTimeString("zh-CN")}</div>
              </div>
            ) : (
              <div style={{ fontSize:12, color:"var(--textMuted)", textAlign:"center", padding:16 }}>暂无提交</div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      <Modal open={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="确认提交最终作品？">
        <div style={{ background:"var(--bgSurface)", borderRadius:10, padding:14, marginBottom:16, fontSize:13 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ color:"var(--textMuted)" }}>Repo</span>
            <span style={{ color:"var(--text)", fontFamily:"var(--mono)", fontSize:12 }}>{repoUrl}</span>
          </div>
          {deployUrl && <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ color:"var(--textMuted)" }}>Deploy</span>
            <span style={{ color:"var(--text)", fontFamily:"var(--mono)", fontSize:12 }}>{deployUrl}</span>
          </div>}
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ color:"var(--textMuted)" }}>当前用时</span>
            <span style={{ color:"var(--accent)", fontWeight:600 }}>{Math.floor((task.timeLimit*60-seconds)/60)}分{(task.timeLimit*60-seconds)%60}秒</span>
          </div>
        </div>
        <p style={{ fontSize:12, color:"var(--textMuted)", marginBottom:16 }}>提交后仍可再次提交，以最后一次为准。</p>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <CTAButton variant="ghost" onClick={() => setShowSubmitModal(false)}>继续开发</CTAButton>
          <CTAButton onClick={() => { setShowSubmitModal(false); setSubmitted(true); showToastMsg("作品提交成功！", "success"); }}>确认提交</CTAButton>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} visible={true} />}
    </div>
  );
};

// ── DASHBOARD ──
const DashboardPage = ({ navigate }) => {
  const [tab, setTab] = useState("概览");
  const [formStep, setFormStep] = useState(0);
  const tabs = ["概览","我的任务","发布新任务","评审中心","支付与托管","通知","账户设置"];

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"24px 20px", display:"grid", gridTemplateColumns:"200px 1fr", gap:24 }}>
      {/* Sidebar */}
      <div>
        <div style={{ fontSize:11, color:"var(--textMuted)", letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>控制台</div>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 14px", borderRadius:8, border:"none", fontSize:13, cursor:"pointer", fontFamily:"var(--font)", background: tab===t?"var(--primaryFaint)":"transparent", color: tab===t?"var(--primaryLight)":"var(--textSec)", fontWeight: tab===t?600:400, marginBottom:2, transition:"all 0.15s" }}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div className="fade-up">
        {tab === "概览" && (
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, marginBottom:20 }}>欢迎回来 👋</h2>
            <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
              <MetricCard label="已发布任务" value="5" icon="📋" />
              <MetricCard label="进行中" value="2" icon="⚡" />
              <MetricCard label="已完成" value="3" icon="✅" />
              <MetricCard label="总支出" value="$2,100" icon="💳" />
            </div>
            <h3 style={{ fontSize:16, fontWeight:600, marginBottom:12 }}>最近任务</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {TASKS.slice(0,4).map(t => (
                <div key={t.id} onClick={() => navigate("detail",t.id)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", background:"var(--bgCard)", border:"1px solid var(--border)", borderRadius:10, cursor:"pointer", transition:"border-color 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="var(--borderHover)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:500, marginBottom:4 }}>{t.title}</div>
                    <div style={{ fontSize:12, color:"var(--textMuted)" }}>{t.currentParticipants} 人报名 · ${t.bountyAmount}</div>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "我的任务" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontSize:22, fontWeight:700 }}>我的任务</h2>
              <CTAButton onClick={() => setTab("发布新任务")}>+ 发布新任务</CTAButton>
            </div>
            {TASKS.slice(0,5).map(t => (
              <div key={t.id} onClick={() => navigate("detail",t.id)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 18px", background:"var(--bgCard)", border:"1px solid var(--border)", borderRadius:10, marginBottom:8, cursor:"pointer" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500, marginBottom:4 }}>{t.title}</div>
                  <div style={{ fontSize:12, color:"var(--textMuted)" }}>{t.currentParticipants}/{t.maxParticipants} 报名 · {t.timeLimit}min · {t.techTags.slice(0,2).join(", ")}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <PrizeBadge amount={t.bountyAmount} />
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "发布新任务" && (
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>发布新任务</h2>
            <p style={{ fontSize:13, color:"var(--textSec)", marginBottom:20 }}>分 4 步完成任务创建，支持自动保存草稿</p>
            {/* Stepper */}
            <div style={{ display:"flex", gap:0, marginBottom:28 }}>
              {["基础信息","任务描述","奖金与规则","预览发布"].map((step, i) => (
                <div key={i} style={{ flex:1, textAlign:"center", position:"relative" }}>
                  {i > 0 && <div style={{ position:"absolute", left:0, top:14, width:"50%", height:2, background: i <= formStep ? "var(--primary)" : "var(--border)" }} />}
                  {i < 3 && <div style={{ position:"absolute", right:0, top:14, width:"50%", height:2, background: i < formStep ? "var(--primary)" : "var(--border)" }} />}
                  <div style={{ width:28, height:28, borderRadius:"50%", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600, background: i <= formStep ? "var(--primary)" : "var(--bgSurface)", color: i <= formStep ? "#fff" : "var(--textMuted)", border: i <= formStep ? "none" : "1px solid var(--border)", position:"relative", zIndex:1, marginBottom:6 }}>{i+1}</div>
                  <div style={{ fontSize:12, color: i <= formStep ? "var(--text)" : "var(--textMuted)" }}>{step}</div>
                </div>
              ))}
            </div>
            {/* Form */}
            <div style={{ background:"var(--bgCard)", border:"1px solid var(--border)", borderRadius:14, padding:24 }}>
              {formStep === 0 && (
                <div>
                  <label style={{ fontSize:13, color:"var(--textSec)", marginBottom:6, display:"block" }}>任务标题 *</label>
                  <input placeholder="例如：实时协作白板工具" style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid var(--border)", background:"var(--bgSurface)", color:"var(--text)", fontSize:14, fontFamily:"var(--font)", outline:"none", marginBottom:16 }} />
                  <label style={{ fontSize:13, color:"var(--textSec)", marginBottom:6, display:"block" }}>一句话摘要 *</label>
                  <input placeholder="用一句话描述这个任务的核心目标" style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid var(--border)", background:"var(--bgSurface)", color:"var(--text)", fontSize:14, fontFamily:"var(--font)", outline:"none", marginBottom:16 }} />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    <div>
                      <label style={{ fontSize:13, color:"var(--textSec)", marginBottom:6, display:"block" }}>赛事类型 *</label>
                      <select style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid var(--border)", background:"var(--bgSurface)", color:"var(--text)", fontSize:14, fontFamily:"var(--font)" }}>
                        <option>悬赏 (Bounty)</option><option>赛事 (Tournament)</option><option>挑战 (Challenge)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:13, color:"var(--textSec)", marginBottom:6, display:"block" }}>难度 *</label>
                      <select style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid var(--border)", background:"var(--bgSurface)", color:"var(--text)", fontSize:14, fontFamily:"var(--font)" }}>
                        <option>★ 简单</option><option>★★ 中等</option><option>★★★ 困难</option><option>★★★★ 专家</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {formStep === 1 && (
                <div>
                  <label style={{ fontSize:13, color:"var(--textSec)", marginBottom:6, display:"block" }}>任务目标 *</label>
                  <textarea rows={4} placeholder="描述参赛者最终要交付什么..." style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid var(--border)", background:"var(--bgSurface)", color:"var(--text)", fontSize:14, fontFamily:"var(--font)", resize:"vertical", outline:"none", marginBottom:16 }} />
                  <label style={{ fontSize:13, color:"var(--textSec)", marginBottom:6, display:"block" }}>交付要求 *</label>
                  <textarea rows={4} placeholder="列出必须实现的功能点..." style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid var(--border)", background:"var(--bgSurface)", color:"var(--text)", fontSize:14, fontFamily:"var(--font)", resize:"vertical", outline:"none" }} />
                </div>
              )}
              {formStep === 2 && (
                <div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                    <div>
                      <label style={{ fontSize:13, color:"var(--textSec)", marginBottom:6, display:"block" }}>主奖金 (USD) *</label>
                      <input type="number" placeholder="500" style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid var(--border)", background:"var(--bgSurface)", color:"var(--text)", fontSize:14, fontFamily:"var(--mono)", outline:"none" }} />
                    </div>
                    <div>
                      <label style={{ fontSize:13, color:"var(--textSec)", marginBottom:6, display:"block" }}>开源奖励 (%)</label>
                      <input type="number" placeholder="20" style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid var(--border)", background:"var(--bgSurface)", color:"var(--text)", fontSize:14, fontFamily:"var(--mono)", outline:"none" }} />
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    <div>
                      <label style={{ fontSize:13, color:"var(--textSec)", marginBottom:6, display:"block" }}>限时 (分钟) *</label>
                      <input type="number" placeholder="120" style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid var(--border)", background:"var(--bgSurface)", color:"var(--text)", fontSize:14, fontFamily:"var(--mono)", outline:"none" }} />
                    </div>
                    <div>
                      <label style={{ fontSize:13, color:"var(--textSec)", marginBottom:6, display:"block" }}>参赛人数上限</label>
                      <input type="number" placeholder="20" style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid var(--border)", background:"var(--bgSurface)", color:"var(--text)", fontSize:14, fontFamily:"var(--mono)", outline:"none" }} />
                    </div>
                  </div>
                </div>
              )}
              {formStep === 3 && (
                <div style={{ textAlign:"center", padding:"20px 0" }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>👀</div>
                  <div style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>预览你的任务</div>
                  <p style={{ fontSize:13, color:"var(--textSec)", marginBottom:20 }}>确认所有信息无误后，点击发布。奖金将立即托管到平台。</p>
                  <div style={{ background:"var(--bgSurface)", borderRadius:10, padding:16, textAlign:"left", marginBottom:16 }}>
                    <div style={{ fontSize:13, color:"var(--textMuted)" }}>预估托管金额：<span style={{ color:"var(--accent)", fontWeight:600 }}>$600</span> (奖金 $500 + 开源奖励 $100)</div>
                    <div style={{ fontSize:12, color:"var(--textMuted)", marginTop:4 }}>平台佣金 12% = $72，实际托管 $672</div>
                  </div>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:20 }}>
                <CTAButton variant="ghost" disabled={formStep===0} onClick={() => setFormStep(s=>s-1)}>上一步</CTAButton>
                {formStep < 3 ? (
                  <CTAButton onClick={() => setFormStep(s=>s+1)}>下一步</CTAButton>
                ) : (
                  <CTAButton variant="accent">🚀 发布任务</CTAButton>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "评审中心" && (
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, marginBottom:20 }}>评审中心</h2>
            <EmptyState message="暂无待评审的作品" cta="查看我的任务" onCta={() => setTab("我的任务")} />
          </div>
        )}

        {tab === "支付与托管" && (
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, marginBottom:20 }}>支付与托管</h2>
            <div style={{ background:"var(--bgCard)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", padding:"12px 16px", background:"var(--bgSurface)", fontSize:12, color:"var(--textMuted)", fontWeight:500 }}>
                <span>任务</span><span>托管金额</span><span>状态</span><span>放款时间</span><span>操作</span>
              </div>
              {TASKS.slice(0,3).map((t,i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", padding:"14px 16px", borderTop:"1px solid var(--border)", fontSize:13, alignItems:"center" }}>
                  <span style={{ fontWeight:500 }}>{t.title}</span>
                  <span style={{ fontFamily:"var(--mono)", color:"var(--accent)" }}>${t.bountyAmount + t.openSourceBonus}</span>
                  <span><StatusBadge status={t.status} /></span>
                  <span style={{ color:"var(--textMuted)", fontSize:12 }}>{t.status==="COMPLETED"?"2026-03-16":"—"}</span>
                  <span><CTAButton variant="ghost" size="sm">详情</CTAButton></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!["概览","我的任务","发布新任务","评审中心","支付与托管"].includes(tab) && (
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, marginBottom:20 }}>{tab}</h2>
            <EmptyState message={`${tab}页面正在建设中`} />
          </div>
        )}
      </div>
    </div>
  );
};

// ── SHOWCASE ──
const ShowcasePage = ({ navigate }) => {
  const [tab, setTab] = useState("最热");
  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 20px" }}>
      <h1 style={{ fontSize:28, fontWeight:700, marginBottom:8 }}>开源广场</h1>
      <p style={{ fontSize:14, color:"var(--textSec)", marginBottom:20 }}>探索获胜者的工作流、AI 对话和工具链</p>
      <div style={{ marginBottom:20 }}><TabSwitcher tabs={["最热","最新","编辑精选"]} active={tab} onChange={setTab} /></div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:14 }}>
        {SHOWCASES.map(s => (
          <div key={s.id} style={{ background:"var(--bgCard)", border:"1px solid var(--border)", borderRadius:14, padding:20, cursor:"pointer", transition:"border-color 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor="var(--borderHover)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
            {s.rank === 1 && <span style={{ fontSize:11, padding:"2px 10px", borderRadius:20, background:"rgba(245,158,11,0.12)", color:"#FBBF24" }}>🥇 第 1 名</span>}
            <h3 style={{ fontSize:16, fontWeight:600, margin:"10px 0 8px" }}>{s.title}</h3>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <Avatar name={s.author} size={24} />
              <span style={{ fontSize:13, color:"var(--textSec)" }}>{s.author}</span>
            </div>
            <div style={{ fontSize:12, color:"var(--textMuted)", padding:10, background:"var(--bgSurface)", borderRadius:8, marginBottom:12 }}>
              🛠 {s.tools}<br />⏱ {s.duration} 完成
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--textMuted)" }}>
              <span>❤️ {s.likes}</span>
              <span>👁 {s.views.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── LEADERBOARD ──
const LeaderboardPage = () => {
  const [tab, setTab] = useState("总榜");
  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 20px" }}>
      <h1 style={{ fontSize:28, fontWeight:700, marginBottom:8 }}>排行榜</h1>
      <p style={{ fontSize:14, color:"var(--textSec)", marginBottom:20 }}>ELO 综合排名：胜率 40% + 速度 30% + 质量 30%</p>
      <div style={{ marginBottom:20 }}><TabSwitcher tabs={["总榜","周榜","月榜","赛季榜"]} active={tab} onChange={setTab} /></div>
      <div style={{ background:"var(--bgCard)", border:"1px solid var(--border)", borderRadius:14, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"60px 1fr 100px 100px 100px 120px", padding:"12px 18px", background:"var(--bgSurface)", fontSize:12, color:"var(--textMuted)", fontWeight:500 }}>
          <span>#</span><span>Coder</span><span>ELO</span><span>胜场</span><span>均时</span><span>工具链</span>
        </div>
        {LEADERBOARD.map((r, i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"60px 1fr 100px 100px 100px 120px", padding:"14px 18px", borderTop:"1px solid var(--border)", fontSize:13, alignItems:"center", animation:`slideIn 0.3s ease ${i*0.05}s both` }}>
            <span style={{ fontWeight:700, fontSize:16, color: i<3 ? ["var(--accent)","#C0C0C0","#CD7F32"][i] : "var(--textMuted)" }}>
              {i < 3 ? ["🥇","🥈","🥉"][i] : r.rank}
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Avatar name={r.name} size={32} />
              <div>
                <div style={{ fontWeight:600 }}>{r.name}</div>
                <div style={{ fontSize:11, color: r.change > 0 ? "var(--green)" : r.change < 0 ? "var(--red)" : "var(--textMuted)" }}>
                  {r.change > 0 ? `↑ ${r.change}` : r.change < 0 ? `↓ ${Math.abs(r.change)}` : "—"}
                </div>
              </div>
            </div>
            <span style={{ fontFamily:"var(--mono)", fontWeight:600, color:"var(--primaryLight)" }}>{r.elo}</span>
            <span>{r.wins}/{r.total}</span>
            <span style={{ fontSize:12, color:"var(--textMuted)" }}>{r.avgTime}</span>
            <div style={{ display:"flex", gap:4 }}>
              {r.tools.map((t,j) => <span key={j} style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:"var(--primaryFaint)", color:"var(--primaryLight)" }}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("landing");
  const [pageParam, setPageParam] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const navigate = useCallback((p, param = null) => {
    setPage(p);
    setPageParam(param);
    setMobileMenu(false);
    window.scrollTo(0, 0);
  }, []);

  const isArena = page === "arena";

  // Hide nav in arena mode
  const TopNav = () => (
    <nav style={{ background:"var(--bgCard)", borderBottom:"1px solid var(--border)", padding:"0 20px", position:"sticky", top:0, zIndex:500, display: isArena ? "none" : "flex", justifyContent:"space-between", alignItems:"center", height:56 }}>
      <div style={{ display:"flex", alignItems:"center", gap:28 }}>
        <span onClick={() => navigate("landing")} style={{ fontWeight:800, fontSize:18, cursor:"pointer", background:"linear-gradient(135deg, var(--primaryLight), var(--accent))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>⚡ VibeBattle</span>
        <div style={{ display:"flex", gap:4 }}>
          {[
            { label:"任务市场", page:"tasks" },
            { label:"开源广场", page:"showcase" },
            { label:"排行榜", page:"leaderboard" },
          ].map(nav => (
            <button key={nav.page} onClick={() => navigate(nav.page)} style={{ padding:"8px 14px", borderRadius:8, border:"none", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"var(--font)", background: page===nav.page ? "var(--primaryFaint)" : "transparent", color: page===nav.page ? "var(--primaryLight)" : "var(--textSec)", transition:"all 0.15s" }}>{nav.label}</button>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {loggedIn ? (
          <>
            <CTAButton variant="secondary" size="sm" onClick={() => navigate("dashboard")}>发布任务</CTAButton>
            <div onClick={() => navigate("dashboard")} style={{ cursor:"pointer" }}>
              <Avatar name="MyUser" size={32} />
            </div>
          </>
        ) : (
          <>
            <CTAButton variant="ghost" size="sm" onClick={() => setLoggedIn(true)}>登录</CTAButton>
            <CTAButton size="sm" onClick={() => setLoggedIn(true)}>注册</CTAButton>
          </>
        )}
      </div>
    </nav>
  );

  const Footer = () => (
    <footer style={{ borderTop:"1px solid var(--border)", padding:"32px 20px", textAlign:"center", display: isArena ? "none" : "block" }}>
      <div style={{ fontSize:13, color:"var(--textMuted)" }}>
        ⚡ VibeBattle · The Arena for Vibe Coders · © 2026
      </div>
    </footer>
  );

  return (
    <div style={{ background:"var(--bg)", color:"var(--text)", fontFamily:"var(--font)", minHeight:"100vh" }}>
      <style>{baseStyles}</style>
      <TopNav />
      <main>
        {page === "landing" && <LandingPage navigate={navigate} />}
        {page === "tasks" && <TasksPage navigate={navigate} />}
        {page === "detail" && <TaskDetailPage taskId={pageParam} navigate={navigate} />}
        {page === "arena" && <ArenaPage taskId={pageParam} navigate={navigate} />}
        {page === "dashboard" && <DashboardPage navigate={navigate} />}
        {page === "showcase" && <ShowcasePage navigate={navigate} />}
        {page === "leaderboard" && <LeaderboardPage />}
      </main>
      <Footer />
    </div>
  );
}
