import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

type View = "parent" | "teacher" | "canteen" | "admin";
type MealChoice = { breakfast: boolean; lunch: boolean };
type MenuItem = { day: string; date: string; breakfast: string; lunch: string; bIcon: string; lIcon: string };
type MealPrices = { breakfast: number; lunch: number };

const initialMenu: MenuItem[] = [
  { day: "MON", date: "27", breakfast: "Mini idli & sambar", lunch: "Veg pulao, raita & banana", bIcon: "🥣", lIcon: "🍚" },
  { day: "TUE", date: "28", breakfast: "Aloo paratha & curd", lunch: "Rajma, rice & salad", bIcon: "🫓", lIcon: "🫘" },
  { day: "WED", date: "29", breakfast: "Vegetable poha & milk", lunch: "Chapati, paneer & fruit", bIcon: "🥛", lIcon: "🍛" },
  { day: "THU", date: "30", breakfast: "Masala dosa & chutney", lunch: "Lemon rice, dal & vegetables", bIcon: "🥞", lIcon: "🍋" },
  { day: "FRI", date: "31", breakfast: "Veg sandwich & cocoa", lunch: "Chole, puri & fruit", bIcon: "🥪", lIcon: "🫕" },
];

const children = [
  ["Aanya Rao", "No meal", "none"],
  ["Aarav Shah", "Lunch", "booked"],
  ["Aditi Iyer", "No meal", "none"],
  ["Advait Nair", "Breakfast + Lunch", "booked"],
  ["Anaya Kapoor", "Breakfast", "booked"],
  ["Arjun Mehta", "Lunch", "booked"],
  ["Avni Reddy", "No meal", "none"],
  ["Dev Malhotra", "Breakfast + Lunch", "booked"],
  ["Diya Menon", "Lunch", "booked"],
  ["Eshan Gupta", "Breakfast", "booked"],
  ["Ira Singh", "No meal", "none"],
  ["Ishaan Joshi", "Breakfast + Lunch", "booked"],
  ["Kabir Bhat", "Lunch", "booked"],
  ["Kiara Das", "No meal", "none"],
  ["Krish Verma", "Breakfast + Lunch", "booked"],
  ["Meera Pillai", "Lunch", "booked"],
  ["Mihir Jain", "Breakfast", "booked"],
  ["Myra Kulkarni", "Breakfast + Lunch", "booked"],
  ["Naina Bose", "No meal", "none"],
  ["Neil Chawla", "Lunch", "booked"],
  ["Rhea Prasad", "Breakfast + Lunch", "booked"],
  ["Rohan Roy", "No meal", "none"],
  ["Saanvi Mishra", "Lunch", "booked"],
  ["Samarth Rao", "Breakfast", "booked"],
  ["Sara Khan", "Breakfast + Lunch", "booked"],
  ["Shaurya Sen", "No meal", "none"],
  ["Tara Bansal", "Lunch", "booked"],
  ["Vihaan Patil", "Breakfast + Lunch", "booked"],
] as const;

function App() {
  const [view, setView] = useState<View>("parent");
  const [day, setDay] = useState(2);
  const [choice, setChoice] = useState<MealChoice>({ breakfast: false, lunch: false });
  const [confirmed, setConfirmed] = useState(false);
  const [breakfastCredits, setBreakfastCredits] = useState(3);
  const [lunchCredits, setLunchCredits] = useState(1);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpType, setTopUpType] = useState<"Breakfast" | "Lunch">("Lunch");
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [prices, setPrices] = useState<MealPrices>({ breakfast: 800, lunch: 1400 });

  const selected = menu[day];

  function chooseDay(index: number) {
    setDay(index);
    setChoice({ breakfast: false, lunch: false });
    setConfirmed(false);
  }

  function confirm() {
    if (!choice.breakfast && !choice.lunch) return;
    if (choice.breakfast && breakfastCredits === 0) {
      setTopUpType("Breakfast");
      setShowTopUp(true);
      return;
    }
    if (choice.lunch && lunchCredits === 0) {
      setTopUpType("Lunch");
      setShowTopUp(true);
      return;
    }
    if (!confirmed) {
      if (choice.breakfast) setBreakfastCredits((value) => Math.max(0, value - 1));
      if (choice.lunch) setLunchCredits((value) => Math.max(0, value - 1));
    }
    setConfirmed(true);
  }

  function buyCredits() {
    if (topUpType === "Breakfast") setBreakfastCredits((value) => value + 20);
    else setLunchCredits((value) => value + 20);
    setShowTopUp(false);
  }

  function changeView(nextView: View) {
    setView(nextView);
    window.scrollTo({ top: 0 });
  }

  function updateMenu(index: number, breakfast: string, lunch: string) {
    setMenu((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, breakfast, lunch } : item));
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span>🍎</span><div><b>Meal<i>Mate</i></b><small>School meals, made simple</small></div></div>
        <div className="view-switch" aria-label="Choose demo view">
          <button className={view === "parent" ? "active" : ""} onClick={() => changeView("parent")}><span>👨‍👩‍👧</span>Parent</button>
          <button className={view === "teacher" ? "active" : ""} onClick={() => changeView("teacher")}><span>👩‍🏫</span>Teacher</button>
          <button className={view === "canteen" ? "active" : ""} onClick={() => changeView("canteen")}><span>👩‍🍳</span>Canteen</button>
          <button className={view === "admin" ? "active" : ""} onClick={() => changeView("admin")}><span>🏫</span>Admin</button>
        </div>
      </header>

      <div className="story-strip">
        <span><b>1</b> Admin shares menu</span><i>→</i><span><b>2</b> Parent books</span><i>→</i><span><b>3</b> Teacher sees list</span><i>→</i><span><b>4</b> Canteen gets count</span>
      </div>

      {view === "parent" ? (
        <section className="page parent-page">
          <div className="welcome">
            <div><p>PARENT VIEW</p><h1>Hello, Aanya! 👋</h1><span>Grade 6A · Choose your meals for this week.</span></div>
              <div className="no-coupon"><span>🎟️</span><b>No paper coupons</b></div>
          </div>

          <div className="credit-row">
            <Credit icon="🥞" name="Breakfast" value={breakfastCredits} onAdd={() => { setTopUpType("Breakfast"); setShowTopUp(true); }} />
            <Credit icon="🍛" name="Lunch" value={lunchCredits} onAdd={() => { setTopUpType("Lunch"); setShowTopUp(true); }} />
          </div>

          <section className="booking-card">
            <div className="section-heading"><div><small>STEP 1</small><h2>Pick a day</h2></div><span>27–31 July 2026</span></div>
            <div className="week-picker">
              {menu.map((item, index) => (
                <button key={item.day} className={day === index ? "active" : ""} onClick={() => chooseDay(index)}>
                  <small>{item.day}</small><b>{item.date}</b><i>{index === 0 || index === 3 ? "✓ Booked" : "Open"}</i>
                </button>
              ))}
            </div>

              <div className="section-heading meal-heading"><div><small>STEP 2</small><h2>Choose a meal</h2></div><span>{selected.day}, {selected.date} July</span></div>
            <div className="meal-grid">
              <MealCard icon={selected.bIcon} type="Breakfast" time="9:30 am" meal={selected.breakfast} selected={choice.breakfast} onClick={() => { setChoice({ ...choice, breakfast: !choice.breakfast }); setConfirmed(false); }} />
              <MealCard icon={selected.lIcon} type="Lunch" time="12:45 pm" meal={selected.lunch} selected={choice.lunch} onClick={() => { setChoice({ ...choice, lunch: !choice.lunch }); setConfirmed(false); }} />
            </div>

            {!confirmed ? (
              <div className="confirm-bar">
                <span><b>{Number(choice.breakfast) + Number(choice.lunch)} meal{Number(choice.breakfast) + Number(choice.lunch) === 1 ? "" : "s"} selected</b><small>One credit is used for each meal.</small></span>
                <button disabled={!choice.breakfast && !choice.lunch} onClick={confirm}>Confirm meals →</button>
              </div>
            ) : (
              <div className="success-card">
                <span>✅</span><div><h3>Meals booked!</h3><p>Teacher list and canteen count updated.</p></div><button onClick={() => changeView("teacher")}>See Teacher View →</button>
              </div>
            )}
          </section>
        </section>
      ) : view === "teacher" ? <TeacherView confirmed={confirmed} choice={choice} />
        : view === "canteen" ? <CanteenView confirmed={confirmed} choice={choice} menu={menu} />
        : <AdminView menu={menu} prices={prices} updateMenu={updateMenu} updatePrices={setPrices} />}

      <footer><span>🌱 Less paper</span><span>⏱️ Less work for teachers</span><span>🍱 Less food waste</span></footer>

      {showTopUp && <TopUp type={topUpType} price={topUpType === "Breakfast" ? prices.breakfast : prices.lunch} close={() => setShowTopUp(false)} buy={buyCredits} />}
    </main>
  );
}

function Credit({ icon, name, value, onAdd }: { icon: string; name: string; value: number; onAdd: () => void }) {
  const low = value <= 3;
  return <div className={`credit-card ${low ? "low" : "healthy"}`}><span>{icon}</span><div><small>{name.toUpperCase()} CREDITS</small><b>{value} remaining</b><i>{value === 0 ? "Top up to book" : value <= 3 ? "Running low" : "Ready to use"}</i></div><button onClick={onAdd}>＋ Buy 20</button></div>;
}

function MealCard({ icon, type, time, meal, selected, onClick }: { icon: string; type: string; time: string; meal: string; selected: boolean; onClick: () => void }) {
  return <button className={`meal-card ${selected ? "selected" : ""}`} onClick={onClick}><span className="food-icon">{icon}</span><div><span><b>{type}</b><small>{time}</small></span><h3>{meal}</h3><p>Freshly prepared at school</p></div><i>{selected ? "✓ Selected" : "+ Choose"}</i></button>;
}

function TeacherView({ confirmed, choice }: { confirmed: boolean; choice: MealChoice }) {
  const breakfastTotal = 11 + (confirmed && choice.breakfast ? 1 : 0);
  const lunchTotal = 16 + (confirmed && choice.lunch ? 1 : 0);
  const bookedTotal = 21 + (confirmed && (choice.breakfast || choice.lunch) ? 1 : 0);
  return <section className="page teacher-page">
    <RoleHeading eyebrow="TEACHER VIEW" title="Grade 6A meal list" subtitle="Wednesday, 29 July · Read only" icon="👩‍🏫" badge="No coupons to collect" />
    <div className="summary-row">
      <SummaryCard icon="🥞" value={breakfastTotal} label="Breakfast" tone="orange" />
      <SummaryCard icon="🍛" value={lunchTotal} label="Lunch" tone="green" />
      <SummaryCard icon="✓" value={bookedTotal} label="Booked" tone="purple" />
      <SummaryCard icon="👧" value="28" label="Students" tone="blue" />
    </div>
    {confirmed && <div className="role-alert">✨ New booking: <b>Aanya Rao · {choice.breakfast && choice.lunch ? "Breakfast + Lunch" : choice.breakfast ? "Breakfast" : "Lunch"}</b></div>}
    <section className="roster-panel">
      <div className="roster-head"><div><small>TODAY’S CLASS LIST</small><h2>All 28 students</h2></div><div className="roster-key"><span className="booked-dot" /> Booked <span className="none-dot" /> Not booked</div></div>
      <div className="roster-columns"><span>STUDENT</span><span>MEAL</span><span>STATUS</span></div>
      <div className="roster-scroll">
        {children.map(([name, meal, status], index) => {
          const isAanya = index === 0;
          const nowBooked = isAanya && confirmed && (choice.breakfast || choice.lunch);
          const displayMeal = nowBooked ? (choice.breakfast && choice.lunch ? "Breakfast + Lunch" : choice.breakfast ? "Breakfast" : "Lunch") : meal;
          const displayStatus = nowBooked ? "booked" : status;
          return <div className={`roster-row ${displayStatus} ${nowBooked ? "new" : ""}`} key={name}>
            <div><i>{name.split(" ").map(n => n[0]).join("")}</i><span><b>{name}</b><small>Roll no. {String(index + 1).padStart(2, "0")}</small></span></div>
            <span className="meal-label">{displayMeal === "Breakfast + Lunch" ? "🥞 Breakfast + 🍛 Lunch" : displayMeal === "Breakfast" ? "🥞 Breakfast" : displayMeal === "Lunch" ? "🍛 Lunch" : "— No meal"}</span>
            <em>{displayStatus === "booked" ? "✓ Confirmed" : "Not booked"}</em>
          </div>;
        })}
      </div>
      <div className="scroll-hint">↕ Scroll to see all 28 students</div>
    </section>
  </section>;
}

function CanteenView({ confirmed, choice, menu }: { confirmed: boolean; choice: MealChoice; menu: MenuItem[] }) {
  const gradeBreakfast = 11 + (confirmed && choice.breakfast ? 1 : 0);
  const gradeLunch = 16 + (confirmed && choice.lunch ? 1 : 0);
  const classes = [["Grade 5A",12,18],["Grade 5B",10,16],["Grade 6A",gradeBreakfast,gradeLunch],["Grade 6B",11,17],["Grade 6C",8,15],["Grade 7A",14,20],["Grade 7B",12,19]];
  const breakfastTotal = classes.reduce((sum,row) => sum + Number(row[1]), 0);
  const lunchTotal = classes.reduce((sum,row) => sum + Number(row[2]), 0);
  return <section className="page canteen-page">
    <RoleHeading eyebrow="CANTEEN VIEW" title="Today’s meal count" subtitle="Monday, 27 July · Updates automatically" icon="👩‍🍳" badge="Orders close at 8:00 am" />
    <div className="canteen-meals">
      <div className="canteen-meal breakfast"><span>{menu[0].bIcon}</span><div><small>BREAKFAST</small><b>{breakfastTotal} portions</b><p>{menu[0].breakfast}</p></div></div>
      <div className="canteen-meal lunch"><span>{menu[0].lIcon}</span><div><small>LUNCH</small><b>{lunchTotal} portions</b><p>{menu[0].lunch}</p></div></div>
      <div className="total-meals"><small>TOTAL TODAY</small><b>{breakfastTotal + lunchTotal}</b><span>meals</span></div>
    </div>
    {confirmed && <div className="role-alert green-alert">✓ Grade 6A count updated from Aanya’s booking</div>}
    <section className="class-panel">
      <div className="panel-title"><div><small>CLASS-WISE COUNT</small><h2>Kitchen preparation list</h2></div><span>● LIVE</span></div>
      <div className="class-row class-header"><span>CLASS</span><span>🥞 BREAKFAST</span><span>🍛 LUNCH</span><span>TOTAL</span></div>
      {classes.map(row => <div className={`class-row ${row[0] === "Grade 6A" ? "highlight" : ""}`} key={row[0]}><b>{row[0]}</b><span>{row[1]}</span><span>{row[2]}</span><strong>{Number(row[1]) + Number(row[2])}</strong></div>)}
      <div className="class-row class-total"><b>All classes</b><span>{breakfastTotal}</span><span>{lunchTotal}</span><strong>{breakfastTotal + lunchTotal}</strong></div>
    </section>
  </section>;
}

function AdminView({ menu, prices, updateMenu, updatePrices }: { menu: MenuItem[]; prices: MealPrices; updateMenu: (index: number, breakfast: string, lunch: string) => void; updatePrices: (prices: MealPrices) => void }) {
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editingPrices, setEditingPrices] = useState(false);
  const [breakfastDraft, setBreakfastDraft] = useState("");
  const [lunchDraft, setLunchDraft] = useState("");

  function openDay(index: number) {
    setBreakfastDraft(menu[index].breakfast);
    setLunchDraft(menu[index].lunch);
    setEditingDay(index);
  }

  return <section className="page admin-page">
    <RoleHeading eyebrow="ADMIN VIEW" title="Weekly menu" subtitle="27–31 July 2026" icon="🏫" badge="✓ Published to parents" />
    <section className="admin-menu-panel">
      <div className="panel-title"><div><small>THIS WEEK</small><h2>Breakfast & lunch menu</h2></div><span className="published-badge">PUBLISHED</span></div>
      <div className="admin-menu-head"><span>DAY</span><span>BREAKFAST</span><span>LUNCH</span><span>ACTION</span></div>
      {menu.map((item, index) => <div className="admin-menu-row" key={item.day}><div><b>{item.date}</b><small>{item.day}</small></div><span><i>{item.bIcon}</i><b>{item.breakfast}</b></span><span><i>{item.lIcon}</i><b>{item.lunch}</b></span><button aria-label={`Edit ${item.day} menu`} onClick={() => openDay(index)}>✏️ Edit</button></div>)}
    </section>
    <div className="admin-settings">
      <div><span className="setting-icon orange">🎟️</span><div><small>BREAKFAST PACK</small><b>20 credits · ₹{prices.breakfast.toLocaleString("en-IN")}</b></div></div>
      <div><span className="setting-icon green">🎫</span><div><small>LUNCH PACK</small><b>20 credits · ₹{prices.lunch.toLocaleString("en-IN")}</b></div></div>
      <div><span className="setting-icon purple">⏰</span><div><small>BOOKING DEADLINE</small><b>8:00 am daily</b></div></div>
    </div>
    <button className="edit-prices-button" onClick={() => setEditingPrices(true)}>✏️ Edit meal prices</button>
    {editingDay !== null && <MenuEditModal item={menu[editingDay]} breakfast={breakfastDraft} lunch={lunchDraft} setBreakfast={setBreakfastDraft} setLunch={setLunchDraft} close={() => setEditingDay(null)} save={() => { updateMenu(editingDay, breakfastDraft.trim(), lunchDraft.trim()); setEditingDay(null); }} />}
    {editingPrices && <PriceEditModal prices={prices} close={() => setEditingPrices(false)} save={(nextPrices) => { updatePrices(nextPrices); setEditingPrices(false); }} />}
  </section>;
}

function RoleHeading({ eyebrow, title, subtitle, icon, badge }: { eyebrow: string; title: string; subtitle: string; icon: string; badge: string }) {
  return <div className="role-heading"><div className="role-title"><span>{icon}</span><div><p>{eyebrow}</p><h1>{title}</h1><small>{subtitle}</small></div></div><div className="role-badge">{badge}</div></div>;
}

function SummaryCard({ icon, value, label, tone }: { icon: string; value: number | string; label: string; tone: string }) {
  return <div className="summary-card"><span className={tone}>{icon}</span><div><b>{value}</b><small>{label}</small></div></div>;
}

function MenuEditModal({ item, breakfast, lunch, setBreakfast, setLunch, close, save }: { item: MenuItem; breakfast: string; lunch: string; setBreakfast: (value: string) => void; setLunch: (value: string) => void; close: () => void; save: () => void }) {
  return <div className="modal-bg" onMouseDown={close}><div className="modal edit-modal" onMouseDown={event => event.stopPropagation()}><button className="close" onClick={close}>×</button><span className="ticket">✏️</span><small>EDIT {item.day} MENU</small><h2>{item.day}, {item.date} July</h2><div className="edit-fields"><label><span>🥞 Breakfast</span><input value={breakfast} onChange={event => setBreakfast(event.target.value)} /></label><label><span>🍛 Lunch</span><input value={lunch} onChange={event => setLunch(event.target.value)} /></label></div><div className="modal-actions"><button onClick={close}>Cancel</button><button disabled={!breakfast.trim() || !lunch.trim()} onClick={save}>Save changes</button></div></div></div>;
}

function PriceEditModal({ prices, close, save }: { prices: MealPrices; close: () => void; save: (prices: MealPrices) => void }) {
  const [breakfastPrice, setBreakfastPrice] = useState(String(prices.breakfast));
  const [lunchPrice, setLunchPrice] = useState(String(prices.lunch));
  const canSave = Number(breakfastPrice) > 0 && Number(lunchPrice) > 0;
  return <div className="modal-bg" onMouseDown={close}><div className="modal edit-modal" onMouseDown={event => event.stopPropagation()}><button className="close" onClick={close}>×</button><span className="ticket">₹</span><small>EDIT PRICES</small><h2>Meal credit packs</h2><div className="edit-fields price-fields"><label><span>🥞 Breakfast · 20 credits</span><div><b>₹</b><input aria-label="Breakfast pack price" type="number" min="1" value={breakfastPrice} onChange={event => setBreakfastPrice(event.target.value)} /></div></label><label><span>🍛 Lunch · 20 credits</span><div><b>₹</b><input aria-label="Lunch pack price" type="number" min="1" value={lunchPrice} onChange={event => setLunchPrice(event.target.value)} /></div></label></div><div className="modal-actions"><button onClick={close}>Cancel</button><button disabled={!canSave} onClick={() => save({ breakfast: Number(breakfastPrice), lunch: Number(lunchPrice) })}>Save prices</button></div></div></div>;
}

function TopUp({ type, price, close, buy }: { type: "Breakfast" | "Lunch"; price: number; close: () => void; buy: () => void }) {
  return <div className="modal-bg" onMouseDown={close}><div className="modal" onMouseDown={event => event.stopPropagation()}><button className="close" onClick={close}>×</button><span className="ticket">🎟️</span><small>DEMO PURCHASE</small><h2>Add 20 {type.toLowerCase()} credits</h2><p>No real payment will be charged.</p><div className="purchase-line"><span>{type === "Breakfast" ? "🥞" : "🍛"}<b>{type} Pass<small>20 school meals</small></b></span><strong>₹{price.toLocaleString("en-IN")}</strong></div><button className="buy-button" onClick={buy}>Complete demo purchase →</button></div></div>;
}

createRoot(document.getElementById("root")!).render(<App />);
