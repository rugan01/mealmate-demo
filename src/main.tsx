import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

type View = "parent" | "school";
type MealChoice = { breakfast: boolean; lunch: boolean };

const menu = [
  { day: "MON", date: "27", breakfast: "Mini idli & sambar", lunch: "Veg pulao, raita & banana", bIcon: "🥣", lIcon: "🍚" },
  { day: "TUE", date: "28", breakfast: "Aloo paratha & curd", lunch: "Rajma, rice & salad", bIcon: "🫓", lIcon: "🫘" },
  { day: "WED", date: "29", breakfast: "Vegetable poha & milk", lunch: "Chapati, paneer & fruit", bIcon: "🥛", lIcon: "🍛" },
  { day: "THU", date: "30", breakfast: "Masala dosa & chutney", lunch: "Lemon rice, dal & vegetables", bIcon: "🥞", lIcon: "🍋" },
  { day: "FRI", date: "31", breakfast: "Veg sandwich & cocoa", lunch: "Chole, puri & fruit", bIcon: "🥪", lIcon: "🫕" },
];

const children = [
  ["Aanya Rao", "Breakfast + Lunch", "booked"],
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

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span>🍎</span><div><b>Meal<i>Mate</i></b><small>School meals, made simple</small></div></div>
        <div className="view-switch" aria-label="Choose demo view">
          <button className={view === "parent" ? "active" : ""} onClick={() => setView("parent")}>👨‍👩‍👧 Parent</button>
          <button className={view === "school" ? "active" : ""} onClick={() => setView("school")}>🏫 School</button>
        </div>
      </header>

      <div className="story-strip">
        <span><b>1</b> See the menu</span><i>→</i><span><b>2</b> Choose a meal</span><i>→</i><span><b>3</b> School is notified</span>
      </div>

      {view === "parent" ? (
        <section className="page parent-page">
          <div className="welcome">
            <div><p>PARENT VIEW</p><h1>Hello, Aanya! 👋</h1><span>Grade 6A · Choose your meals for this week.</span></div>
            <div className="no-coupon"><span>🎟️</span><b>No paper coupons!</b></div>
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

            <div className="section-heading meal-heading"><div><small>STEP 2</small><h2>Choose a meal</h2></div><span>Wednesday, {selected.date} July</span></div>
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
                <span>✅</span><div><h3>Meals booked!</h3><p>Aanya’s teacher and the school canteen have been notified.</p></div><button onClick={() => setView("school")}>See School View →</button>
              </div>
            )}
          </section>
        </section>
      ) : (
        <SchoolView confirmed={confirmed} choice={choice} />
      )}

      <footer><span>🌱 Less paper</span><span>⏱️ Less work for teachers</span><span>🍱 Less food waste</span></footer>

      {showTopUp && <TopUp type={topUpType} close={() => setShowTopUp(false)} buy={buyCredits} />}
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

function SchoolView({ confirmed, choice }: { confirmed: boolean; choice: MealChoice }) {
  const breakfastTotal = 10 + (confirmed && choice.breakfast ? 1 : 0);
  const lunchTotal = 15 + (confirmed && choice.lunch ? 1 : 0);
  return <section className="page school-page">
    <div className="welcome"><div><p>SCHOOL VIEW</p><h1>Grade 6A meal list 🏫</h1><span>Wednesday, 29 July · Updated automatically</span></div><div className="no-coupon green"><span>✓</span><b>No coupons to collect</b></div></div>
    <div className="school-summary">
      <div><span>🥞</span><b>{breakfastTotal}<small>Breakfasts</small></b></div>
      <div><span>🍛</span><b>{lunchTotal}<small>Lunches</small></b></div>
      <div><span>👧</span><b>28<small>Students</small></b></div>
    </div>
    {confirmed && <div className="school-alert">✨ New booking received: <b>Aanya Rao · {choice.breakfast && choice.lunch ? "Breakfast + Lunch" : choice.breakfast ? "Breakfast" : "Lunch"}</b></div>}
    <section className="student-list">
      <div className="list-head"><div><small>AUTOMATIC CLASS LIST</small><h2>Who is eating today?</h2></div><div><span className="booked-dot" /> Booked <span className="none-dot" /> Not booked</div></div>
      <div className="student-grid">
        {children.map(([name, meal, status], index) => {
          const isAanya = index === 0;
          const displayMeal = isAanya && confirmed ? (choice.breakfast && choice.lunch ? "Breakfast + Lunch" : choice.breakfast ? "Breakfast" : choice.lunch ? "Lunch" : meal) : meal;
          return <div className={`student ${status} ${isAanya && confirmed ? "new" : ""}`} key={name}><span>{name.split(" ").map(n => n[0]).join("")}</span><div><b>{name}</b><small>{displayMeal}</small></div><i>{status === "booked" ? "✓ Booked" : "Not booked"}</i></div>;
        })}
      </div>
      <div className="more-students">＋ 12 more students in Grade 6A</div>
    </section>
  </section>;
}

function TopUp({ type, close, buy }: { type: "Breakfast" | "Lunch"; close: () => void; buy: () => void }) {
  const price = type === "Breakfast" ? "₹800" : "₹1,400";
  return <div className="modal-bg" onMouseDown={close}><div className="modal" onMouseDown={event => event.stopPropagation()}><button className="close" onClick={close}>×</button><span className="ticket">🎟️</span><small>DEMO PURCHASE</small><h2>Add 20 {type.toLowerCase()} credits</h2><p>No real payment will be charged.</p><div className="purchase-line"><span>{type === "Breakfast" ? "🥞" : "🍛"}<b>{type} Pass<small>20 school meals</small></b></span><strong>{price}</strong></div><button className="buy-button" onClick={buy}>Complete demo purchase →</button></div></div>;
}

createRoot(document.getElementById("root")!).render(<App />);
