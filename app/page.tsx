"use client";

import { useMemo, useState } from "react";

type Role = "parent" | "teacher" | "canteen" | "admin";
type ParentPage = "home" | "menu" | "wallet" | "history";
type MealChoice = { breakfast: boolean; lunch: boolean };

const week = [
  { key: "mon", day: "MON", date: "27", fullDate: "Monday, 27 July", breakfast: "Mini idli & sambar", lunch: "Veg pulao, raita & banana", icon: "🍚", bIcon: "🥣" },
  { key: "tue", day: "TUE", date: "28", fullDate: "Tuesday, 28 July", breakfast: "Aloo paratha & curd", lunch: "Rajma, rice & cucumber salad", icon: "🫘", bIcon: "🫓" },
  { key: "wed", day: "WED", date: "29", fullDate: "Wednesday, 29 July", breakfast: "Vegetable poha & milk", lunch: "Chapati, paneer gravy & fruit", icon: "🍛", bIcon: "🥛" },
  { key: "thu", day: "THU", date: "30", fullDate: "Thursday, 30 July", breakfast: "Masala dosa & chutney", lunch: "Lemon rice, dal & vegetables", icon: "🍋", bIcon: "🥞" },
  { key: "fri", day: "FRI", date: "31", fullDate: "Friday, 31 July", breakfast: "Veg sandwich & cocoa", lunch: "Chole, puri & seasonal fruit", icon: "🫕", bIcon: "🥪" },
];

const students = [
  ["Aanya Rao", "Both", "confirmed"], ["Aarav Shah", "Lunch", "confirmed"], ["Aditi Iyer", "—", "none"],
  ["Advait Nair", "Both", "confirmed"], ["Anaya Kapoor", "Breakfast", "confirmed"], ["Arjun Mehta", "Lunch", "confirmed"],
  ["Avni Reddy", "—", "none"], ["Dev Malhotra", "Both", "confirmed"], ["Diya Menon", "Lunch", "confirmed"],
  ["Eshan Gupta", "Breakfast", "confirmed"], ["Ira Singh", "—", "absent"], ["Ishaan Joshi", "Both", "confirmed"],
  ["Kabir Bhat", "Lunch", "confirmed"], ["Kiara Das", "—", "none"], ["Krish Verma", "Both", "confirmed"],
  ["Meera Pillai", "Lunch", "confirmed"], ["Mihir Jain", "Breakfast", "confirmed"], ["Myra Kulkarni", "Both", "confirmed"],
  ["Naina Bose", "—", "none"], ["Neil Chawla", "Lunch", "confirmed"], ["Rhea Prasad", "Both", "confirmed"],
  ["Rohan Roy", "—", "none"], ["Saanvi Mishra", "Lunch", "confirmed"], ["Samarth Rao", "Breakfast", "confirmed"],
  ["Sara Khan", "Both", "confirmed"], ["Shaurya Sen", "—", "none"], ["Tara Bansal", "Lunch", "confirmed"],
  ["Vihaan Patil", "Both", "confirmed"],
] as const;

const roleLabels: Record<Role, { label: string; emoji: string; subtitle: string }> = {
  parent: { label: "Parent", emoji: "👨‍👩‍👧", subtitle: "Aanya's account" },
  teacher: { label: "Teacher", emoji: "👩‍🏫", subtitle: "Grade 6A" },
  canteen: { label: "Canteen", emoji: "👩‍🍳", subtitle: "Meal operations" },
  admin: { label: "School Admin", emoji: "🏫", subtitle: "Greenfield School" },
};

export default function Home() {
  const [role, setRole] = useState<Role>("parent");
  const [parentPage, setParentPage] = useState<ParentPage>("home");
  const [selectedDay, setSelectedDay] = useState(0);
  const [bookings, setBookings] = useState<Record<string, MealChoice>>({
    mon: { breakfast: true, lunch: true }, tue: { breakfast: false, lunch: true }, wed: { breakfast: false, lunch: false }, thu: { breakfast: true, lunch: true }, fri: { breakfast: false, lunch: false },
  });
  const [breakfastCredits, setBreakfastCredits] = useState(3);
  const [lunchCredits, setLunchCredits] = useState(1);
  const [toast, setToast] = useState("");
  const [showPurchase, setShowPurchase] = useState(false);
  const [purchaseType, setPurchaseType] = useState<"Breakfast" | "Lunch">("Lunch");
  const [presentationStep, setPresentationStep] = useState(0);

  const todayBooking = bookings[week[selectedDay].key];
  const parentBookedBreakfast = bookings.mon.breakfast ? 1 : 0;
  const parentBookedLunch = bookings.mon.lunch ? 1 : 0;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function toggleMeal(type: "breakfast" | "lunch") {
    const day = week[selectedDay];
    const current = bookings[day.key];
    const turningOn = !current[type];
    const available = type === "breakfast" ? breakfastCredits : lunchCredits;
    if (turningOn && available <= 0) {
      setPurchaseType(type === "breakfast" ? "Breakfast" : "Lunch");
      setShowPurchase(true);
      return;
    }
    setBookings({ ...bookings, [day.key]: { ...current, [type]: turningOn } });
  }

  function confirmBooking() {
    notify("Booking confirmed! Teacher and canteen lists are updated.");
    setParentPage("home");
  }

  function buyCredits() {
    if (purchaseType === "Breakfast") setBreakfastCredits((value) => value + 20);
    else setLunchCredits((value) => value + 20);
    setShowPurchase(false);
    notify(`20 ${purchaseType.toLowerCase()} credits added successfully!`);
  }

  function switchRole(next: Role) {
    setRole(next);
    setParentPage("home");
  }

  const content = role === "parent"
    ? <ParentView page={parentPage} setPage={setParentPage} selectedDay={selectedDay} setSelectedDay={setSelectedDay} bookings={bookings} todayBooking={todayBooking} toggleMeal={toggleMeal} confirmBooking={confirmBooking} breakfastCredits={breakfastCredits} lunchCredits={lunchCredits} openPurchase={(type: "Breakfast" | "Lunch") => { setPurchaseType(type); setShowPurchase(true); }} />
    : role === "teacher"
      ? <TeacherView parentBookedBreakfast={parentBookedBreakfast} parentBookedLunch={parentBookedLunch} />
      : role === "canteen"
        ? <CanteenView parentBookedBreakfast={parentBookedBreakfast} parentBookedLunch={parentBookedLunch} />
        : <AdminView notify={notify} />;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Brand />
        <div className="profile-card">
          <div className="avatar">{roleLabels[role].emoji}</div>
          <div><strong>{roleLabels[role].label}</strong><span>{roleLabels[role].subtitle}</span></div>
        </div>
        <nav className="role-nav" aria-label="Demo roles">
          <p className="nav-label">SWITCH DEMO VIEW</p>
          {(Object.keys(roleLabels) as Role[]).map((item) => (
            <button key={item} className={role === item ? "active" : ""} onClick={() => switchRole(item)}>
              <span>{roleLabels[item].emoji}</span>{roleLabels[item].label}
            </button>
          ))}
        </nav>
        <div className="paper-saved"><span>🌱</span><strong>Paper saved this month</strong><b>486 coupons</b></div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="mobile-brand"><Brand /></div>
          <div><span className="school-dot">G</span><strong>Greenfield Public School</strong></div>
          <div className="top-actions"><span className="demo-pill">● LIVE DEMO</span><button aria-label="Notifications" className="icon-button">🔔<i>3</i></button></div>
        </header>

        <div className="presentation-strip">
          <div><span>🎤</span><div><strong>Presentation Mode</strong><small>Step {presentationStep + 1} of 6 · {['Meet the parent','See the weekly menu','Book a meal','Check low credits','Teacher gets the list','Canteen plans ahead'][presentationStep]}</small></div></div>
          <div className="presentation-controls">
            <button disabled={presentationStep === 0} onClick={() => setPresentationStep((s) => Math.max(0, s - 1))}>←</button>
            <div className="step-dots">{[0,1,2,3,4,5].map((step) => <i key={step} className={step <= presentationStep ? "done" : ""} />)}</div>
            <button onClick={() => {
              const next = Math.min(5, presentationStep + 1); setPresentationStep(next);
              if (next === 1) { switchRole("parent"); setParentPage("menu"); }
              if (next === 2) { switchRole("parent"); setParentPage("menu"); setSelectedDay(2); }
              if (next === 3) { switchRole("parent"); setParentPage("wallet"); }
              if (next === 4) switchRole("teacher");
              if (next === 5) switchRole("canteen");
            }}>Next →</button>
          </div>
        </div>

        <div className="content">{content}</div>

        <div className="mobile-role-nav">
          {(Object.keys(roleLabels) as Role[]).map((item) => <button key={item} className={role === item ? "active" : ""} onClick={() => switchRole(item)}><span>{roleLabels[item].emoji}</span>{item === "admin" ? "Admin" : roleLabels[item].label}</button>)}
        </div>
      </section>

      {toast && <div className="toast">✓ {toast}</div>}
      {showPurchase && <PurchaseModal type={purchaseType} close={() => setShowPurchase(false)} buy={buyCredits} />}
    </main>
  );
}

function Brand() {
  return <div className="brand"><div className="brand-mark">🍎</div><div><b>Meal<span>Mate</span></b><small>School meals, made simple</small></div></div>;
}

function ParentView({ page, setPage, selectedDay, setSelectedDay, bookings, todayBooking, toggleMeal, confirmBooking, breakfastCredits, lunchCredits, openPurchase }: any) {
  return <>
    <div className="view-heading"><div><p className="eyebrow">PARENT PORTAL</p><h1>{page === "home" ? "Good morning, Priya! 👋" : page === "menu" ? "Plan Aanya’s meals" : page === "wallet" ? "Meal credits" : "Booking history"}</h1><p>{page === "home" ? "Here’s what’s cooking for Aanya this week." : page === "menu" ? "View the menu and book breakfast, lunch, or both." : page === "wallet" ? "One credit equals one delicious school meal." : "Every meal booking, all in one place."}</p></div><StudentBadge /></div>
    <div className="tabs">
      {([['home','Overview','🏠'],['menu','Weekly menu','📅'],['wallet','Credits','🎟️'],['history','History','🧾']] as const).map(([key,label,icon]) => <button className={page === key ? "active" : ""} onClick={() => setPage(key)} key={key}><span>{icon}</span>{label}{key === 'wallet' && lunchCredits <= 2 && <i>!</i>}</button>)}
    </div>
    {page === "home" && <ParentHome setPage={setPage} bookings={bookings} breakfastCredits={breakfastCredits} lunchCredits={lunchCredits} openPurchase={openPurchase} />}
    {page === "menu" && <MenuPlanner selectedDay={selectedDay} setSelectedDay={setSelectedDay} bookings={bookings} todayBooking={todayBooking} toggleMeal={toggleMeal} confirmBooking={confirmBooking} />}
    {page === "wallet" && <Wallet breakfastCredits={breakfastCredits} lunchCredits={lunchCredits} openPurchase={openPurchase} />}
    {page === "history" && <History />}
  </>;
}

function StudentBadge() { return <div className="student-badge"><div>AR</div><span><b>Aanya Rao</b><small>Grade 6A · Roll no. 04</small></span></div>; }

function ParentHome({ setPage, bookings, breakfastCredits, lunchCredits, openPurchase }: any) {
  const booked = Object.values(bookings).reduce((count: number, item: any) => count + Number(item.breakfast) + Number(item.lunch), 0);
  return <div className="dashboard-grid">
    <section className="hero-card">
      <div><span className="sun">☀️</span><p>MONDAY’S MENU</p><h2>Something tasty is waiting!</h2><div className="hero-meals"><span>🥣 <b>Breakfast</b> Mini idli & sambar</span><span>🍚 <b>Lunch</b> Veg pulao, raita & banana</span></div><button onClick={() => setPage("menu")}>View & book meals <span>→</span></button></div>
      <div className="lunch-art"><span>🍱</span><i>🥕</i><b>⭐</b></div>
    </section>
    <section className="quick-card credits-card"><div className="section-title"><div><p>MEAL WALLET</p><h3>Your credits</h3></div><button onClick={() => setPage("wallet")}>View all</button></div><CreditMini label="Breakfast" icon="🥞" value={breakfastCredits} tone="low" /><CreditMini label="Lunch" icon="🍛" value={lunchCredits} tone="critical" /><button className="wide-outline" onClick={() => openPurchase("Lunch")}>＋ Add 20 credits</button></section>
    <section className="quick-card week-card"><div className="section-title"><div><p>THIS WEEK</p><h3>Aanya’s plan</h3></div><span className="count-badge">{booked} meals</span></div><div className="mini-week">{week.map(day => { const meal = bookings[day.key]; return <div key={day.key}><b>{day.day.slice(0,1)}</b><span className={meal.breakfast || meal.lunch ? "booked" : "empty"}>{meal.breakfast && meal.lunch ? "2" : meal.breakfast || meal.lunch ? "1" : "–"}</span></div>})}</div><div className="legend"><span><i className="green" /> Booked</span><span><i className="gray" /> Not booked</span></div></section>
    <section className="impact-card"><span>🌍</span><div><p>OUR SCHOOL IMPACT</p><h3>96 meals planned today</h3><small>That means less waiting, less paper and less food waste.</small></div><div className="impact-stat"><b>18%</b><span>less food waste</span></div></section>
  </div>;
}

function CreditMini({ label, icon, value, tone }: any) { return <div className={`credit-mini ${tone}`}><span>{icon}</span><div><b>{label}</b><small>{value <= 1 ? "Running out — top up now" : "Low balance — only a few left"}</small></div><strong>{value}<small> left</small></strong></div>; }

function MenuPlanner({ selectedDay, setSelectedDay, bookings, todayBooking, toggleMeal, confirmBooking }: any) {
  const day = week[selectedDay];
  return <div className="planner-layout">
    <section className="calendar-card">
      <div className="calendar-head"><div><p>WEEK 1</p><h3>27–31 July 2026</h3></div><span>5 school days</span></div>
      <div className="date-row">{week.map((item, index) => { const choice = bookings[item.key]; return <button key={item.key} className={selectedDay === index ? "active" : ""} onClick={() => setSelectedDay(index)}><small>{item.day}</small><b>{item.date}</b><i className={choice.breakfast || choice.lunch ? "has-booking" : ""}>{choice.breakfast && choice.lunch ? "2 meals" : choice.breakfast || choice.lunch ? "1 meal" : "Open"}</i></button>})}</div>
      <div className="selected-date"><div><span>📅</span><div><small>SELECTED DAY</small><h3>{day.fullDate}</h3></div></div><span className="deadline">⏱ Book by 8:00 am</span></div>
      <MealOption type="Breakfast" time="9:30 am" icon={day.bIcon} meal={day.breakfast} selected={todayBooking.breakfast} toggle={() => toggleMeal("breakfast")} />
      <MealOption type="Lunch" time="12:45 pm" icon={day.icon} meal={day.lunch} selected={todayBooking.lunch} toggle={() => toggleMeal("lunch")} />
      <div className="booking-summary"><span><b>{Number(todayBooking.breakfast) + Number(todayBooking.lunch)} meal credits</b><small>Teacher & canteen will be notified instantly</small></span><button disabled={!todayBooking.breakfast && !todayBooking.lunch} onClick={confirmBooking}>Confirm meals →</button></div>
    </section>
    <aside className="menu-side"><div className="tip-card"><span>💡</span><h3>Plan the whole week</h3><p>Tap each date to book meals in advance. Weekends and holidays are skipped automatically.</p></div><div className="nutrition-card"><p>MENU NOTES</p><h3>Made for growing minds</h3><ul><li>🥬 Vegetarian menu</li><li>🥛 Dairy item included</li><li>🍎 Fruit served 3× a week</li><li>🚫 Nut-aware kitchen</li></ul><small>Allergen information is available from the school office.</small></div></aside>
  </div>;
}

function MealOption({ type, time, icon, meal, selected, toggle }: any) { return <div className={`meal-option ${selected ? "selected" : ""}`}><div className="meal-icon">{icon}</div><div className="meal-copy"><span><b>{type}</b><small>{time}</small></span><h3>{meal}</h3><p>{type === "Breakfast" ? "Freshly prepared · Balanced start" : "Wholesome plate · Includes fruit or salad"}</p></div><button className={selected ? "selected" : ""} onClick={toggle}>{selected ? "✓ Selected" : "+ Add meal"}</button></div>; }

function Wallet({ breakfastCredits, lunchCredits, openPurchase }: any) { return <div className="wallet-layout">
  <div className="wallet-card breakfast-wallet"><div className="wallet-top"><span>🥞</span><b>BREAKFAST PASS</b></div><strong>{breakfastCredits}<small>credits remaining</small></strong><div className="credit-dots">{Array.from({length:20},(_,i)=><i className={i < breakfastCredits ? "filled" : ""} key={i}/>)}</div><p className="balance-warning">⚠ Low balance — enough for only {breakfastCredits} breakfasts</p><button onClick={() => openPurchase("Breakfast")}>Buy 20 breakfast credits · ₹800</button></div>
  <div className="wallet-card lunch-wallet"><div className="wallet-top"><span>🍛</span><b>LUNCH PASS</b></div><strong>{lunchCredits}<small>credit remaining</small></strong><div className="credit-dots">{Array.from({length:20},(_,i)=><i className={i < lunchCredits ? "filled" : ""} key={i}/>)}</div><p className="balance-warning critical">! Critical balance — top up before the next booking</p><button onClick={() => openPurchase("Lunch")}>Buy 20 lunch credits · ₹1,400</button></div>
  <div className="how-card"><span>✨</span><h3>How credits work</h3><ol><li><b>1</b><span><strong>Buy a pack</strong><small>Breakfast and lunch come in packs of 20.</small></span></li><li><b>2</b><span><strong>Choose from the menu</strong><small>One credit is used for each booked meal.</small></span></li><li><b>3</b><span><strong>We notify everyone</strong><small>The teacher and canteen lists update instantly.</small></span></li></ol></div>
  <div className="transactions"><div className="section-title"><div><p>RECENT ACTIVITY</p><h3>Credit history</h3></div></div>{[["27 Jul","Lunch booked","−1","🍛"],["27 Jul","Breakfast booked","−1","🥞"],["24 Jul","Lunch served","−1","🍱"],["20 Jul","20 lunch credits purchased","+20","🎟️"]].map(row=><div className="transaction" key={row[0]+row[1]}><span>{row[3]}</span><div><b>{row[1]}</b><small>{row[0]} 2026</small></div><strong className={row[2].startsWith('+') ? 'plus':''}>{row[2]}</strong></div>)}</div>
  </div>; }

function History() { return <section className="history-card"><div className="history-summary"><div><span>🍽️</span><b>17<small>Meals enjoyed in July</small></b></div><div><span>📅</span><b>5<small>Upcoming bookings</small></b></div><div><span>🌱</span><b>17<small>Paper coupons avoided</small></b></div></div><h3>Recent and upcoming</h3>{week.slice(0,4).map((day,index)=><div className="history-row" key={day.key}><div className="history-date"><b>{day.date}</b><small>JUL</small></div><div><b>{day.fullDate}</b><span>{index===2 ? 'No meals booked' : `${day.breakfast} · ${day.lunch}`}</span></div><i className={index===2 ? 'not-booked':'confirmed'}>{index===2 ? 'Not booked':'✓ Confirmed'}</i></div>)}</section>; }

function TeacherView({ parentBookedBreakfast, parentBookedLunch }: any) {
  const [filter, setFilter] = useState("All students");
  const visible = useMemo(() => students.filter((student) => filter === "All students" || (filter === "Meal booked" ? student[2] === "confirmed" : student[2] !== "confirmed")), [filter]);
  const breakfast = students.filter(s => s[1] === "Breakfast" || s[1] === "Both").length - 1 + parentBookedBreakfast;
  const lunch = students.filter(s => s[1] === "Lunch" || s[1] === "Both").length - 1 + parentBookedLunch;
  return <><div className="view-heading"><div><p className="eyebrow purple">TEACHER PORTAL · READ ONLY</p><h1>Good morning, Ms. Kavya! 👋</h1><p>Your Grade 6A meal list is ready—no coupons to collect.</p></div><div className="date-chip">📅 Monday, 27 July 2026</div></div>
    <div className="stats-row"><Stat icon="👧" value="28" label="Students" color="blue" /><Stat icon="🥞" value={breakfast} label="Breakfast" color="orange" /><Stat icon="🍛" value={lunch} label="Lunch" color="green" /><Stat icon="✓" value="22" label="Meal enrolments" color="purple" /></div>
    <section className="roster-card"><div className="roster-head"><div><p>TODAY’S CLASS LIST</p><h3>Grade 6A · 28 students</h3></div><div className="filters">{["All students","Meal booked","Not booked"].map(item=><button key={item} className={filter===item?'active':''} onClick={()=>setFilter(item)}>{item}</button>)}</div></div>
      <div className="roster-table"><div className="table-head"><span>STUDENT</span><span>MEAL SELECTION</span><span>STATUS</span></div>{visible.map((student,index)=><div className="student-row" key={student[0]}><div><i>{student[0].split(' ').map(n=>n[0]).join('')}</i><span><b>{student[0]}</b><small>Roll no. {String(index+1).padStart(2,'0')}</small></span></div><span className={student[1]==='—'?'meal-none':'meal-chip'}>{student[1] === 'Both' ? '🥞 Breakfast + 🍛 Lunch' : student[1] === 'Lunch' ? '🍛 Lunch' : student[1] === 'Breakfast' ? '🥞 Breakfast' : 'No meal selected'}</span><i className={`status ${student[2]}`}>{student[2]==='confirmed'?'✓ Confirmed':student[2]==='absent'?'Absent':'Not enrolled'}</i></div>)}</div>
      <div className="roster-foot"><span>🔒 View-only access · Updated just now</span><button onClick={() => window.print()}>🖨 Print backup list</button></div>
    </section></>;
}

function Stat({ icon, value, label, color }: any) { return <div className={`stat-card ${color}`}><span>{icon}</span><div><b>{value}</b><small>{label}</small></div></div>; }

function CanteenView({ parentBookedBreakfast, parentBookedLunch }: any) {
  const classes = [["Grade 5A",12,18],["Grade 5B",10,16],["Grade 6A",9 + parentBookedBreakfast,14 + parentBookedLunch],["Grade 6B",11,17],["Grade 6C",8,15],["Grade 7A",14,20],["Grade 7B",12,19]];
  const totalB = classes.reduce((a,c)=>a+Number(c[1]),0), totalL=classes.reduce((a,c)=>a+Number(c[2]),0);
  return <><div className="view-heading"><div><p className="eyebrow green-text">CANTEEN OPERATIONS</p><h1>Today’s kitchen plan 👩‍🍳</h1><p>Live confirmed counts for Monday, 27 July.</p></div><div className="lock-chip">🔒 Orders lock at 8:00 am</div></div>
    <div className="kitchen-hero"><div><p>TOTAL MEALS TODAY</p><strong>{totalB+totalL}</strong><span>confirmed portions</span></div><div className="kitchen-meal breakfast"><span>🥞</span><b>{totalB}<small>Breakfasts</small></b><i>Mini idli & sambar</i></div><div className="kitchen-meal lunch"><span>🍛</span><b>{totalL}<small>Lunches</small></b><i>Veg pulao, raita & banana</i></div><div className="live-box"><i>● LIVE</i><b>Updated just now</b><span>Next refresh in 30 sec</span></div></div>
    <div className="canteen-grid"><section className="class-breakdown"><div className="section-title"><div><p>CLASS-WISE BREAKDOWN</p><h3>Confirmed portions</h3></div><button>🖨 Print kitchen sheet</button></div><div className="class-table"><div><b>CLASS</b><b>🥞 BREAKFAST</b><b>🍛 LUNCH</b><b>TOTAL</b></div>{classes.map(row=><div key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><span>{row[2]}</span><b>{Number(row[1])+Number(row[2])}</b></div>)}<div className="total-row"><strong>TOTAL</strong><span>{totalB}</span><span>{totalL}</span><b>{totalB+totalL}</b></div></div></section>
    <aside><div className="prep-card"><p>PREPARATION STATUS</p><h3>Kitchen checklist</h3>{([['Ingredients checked',true],['Breakfast portions prepared',true],['Lunch prep started',true],['Final class list printed',false]] as [string, boolean][]).map(item=><label key={item[0]}><input type="checkbox" defaultChecked={item[1]}/><span>{item[0]}</span></label>)}</div><div className="waste-card"><span>🌱</span><div><p>SMARTER PLANNING</p><b>18% less waste</b><small>than the paper-coupon average</small></div></div><div className="tomorrow-card"><p>TOMORROW SO FAR</p><h3>142 meals booked</h3><div><span style={{width:'71%'}} /></div><small>Parents can book until 8:00 am tomorrow</small></div></aside></div>
  </>;
}

function AdminView({ notify }: any) {
  const [published, setPublished] = useState(true);
  return <><div className="view-heading"><div><p className="eyebrow pink">SCHOOL ADMINISTRATION</p><h1>Meal programme overview 🏫</h1><p>Manage menus, credits and school-wide meal planning.</p></div><button className="primary-action" onClick={()=>notify('August menu draft created!')}>＋ Create next month’s menu</button></div>
    <div className="stats-row admin-stats"><Stat icon="👨‍👩‍👧" value="412" label="Active students" color="blue"/><Stat icon="🍽️" value="9,842" label="Meals this month" color="orange"/><Stat icon="🎟️" value="6,140" label="Credits available" color="green"/><Stat icon="🌱" value="486" label="Coupons avoided" color="purple"/></div>
    <div className="admin-grid"><section className="admin-menu"><div className="section-title"><div><p>JULY 2026 MENU</p><h3>Week of 27–31 July</h3></div><span className={published?'published':'draft'}>{published?'✓ Published':'Draft'}</span></div>{week.map(day=><div className="admin-day" key={day.key}><div><b>{day.date}</b><small>{day.day}</small></div><span>{day.bIcon}<small>Breakfast</small><b>{day.breakfast}</b></span><span>{day.icon}<small>Lunch</small><b>{day.lunch}</b></span><button onClick={()=>notify(`${day.day} menu ready to edit`)}>Edit</button></div>)}<div className="publish-bar"><span><b>Menu visible to 412 parents</b><small>Last updated 22 July at 10:15 am</small></span><button onClick={()=>{setPublished(!published);notify(published?'Menu moved to draft':'Menu published to all parents!')}}>{published?'Unpublish':'Publish menu'}</button></div></section>
    <aside><div className="settings-card"><p>MEAL SETTINGS</p><h3>Credit packs</h3><div><span>🥞 Breakfast</span><b>20 credits · ₹800</b></div><div><span>🍛 Lunch</span><b>20 credits · ₹1,400</b></div><button onClick={()=>notify('Credit settings opened')}>Manage prices</button></div><div className="settings-card"><p>BOOKING WINDOW</p><h3>Daily deadline</h3><strong>8:00 <small>AM</small></strong><span>Changes close when school begins.</span><button onClick={()=>notify('Deadline settings opened')}>Change deadline</button></div><div className="enrol-card"><span>82%</span><div><b>Family adoption</b><small>338 of 412 families activated</small><div><i/></div></div></div></aside></div>
  </>;
}

function PurchaseModal({ type, close, buy }: any) { const price = type === 'Breakfast' ? '₹800' : '₹1,400'; return <div className="modal-backdrop" onMouseDown={close}><div className="purchase-modal" onMouseDown={e=>e.stopPropagation()}><button className="modal-close" onClick={close}>×</button><div className="modal-icon">🎟️</div><p>MEAL CREDIT PACK</p><h2>Add 20 {type.toLowerCase()} credits</h2><span>For Aanya Rao · Grade 6A</span><div className="order-line"><div><i>{type==='Breakfast'?'🥞':'🍛'}</i><span><b>{type} Pass</b><small>20 school meals</small></span></div><strong>{price}</strong></div><div className="payment-method"><span>💳</span><div><b>Demo payment</b><small>No real payment will be charged</small></div><i>✓</i></div><div className="modal-total"><span>Total</span><b>{price}</b></div><button className="pay-button" onClick={buy}>Complete demo purchase →</button><small className="secure-note">🔒 Safe competition demo · No payment details needed</small></div></div>; }
