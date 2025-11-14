import React, {useMemo, useState} from "react";
import "../css/Calendar.css";
import CalendarButton from "../Components/CalendarButton";


const Events = [
    {date:"2025-11-02", title: "Padel", color: "green"},
    {date:"2025-11-02", title: "Boardgames night", color: "blue"},
    {date:"2025-11-04", title: "Basketball game", color: "gray"},
    {date:"2025-11-05", title: "Boardgames night", color: "blue"},
    {date:"2025-11-06", title: "Boardgames night", color: "blue"},
    {date:"2025-11-09", title: "Padel", color: "green"},
    {date:"2025-11-12", title: "Knitting night", color: "blue"},
    {date:"2025-11-19", title: "Boardgames night", color: "blue"},
    {date:"2025-11-19", title: "Scroll Bar Party", color: "orange"},
    {date:"2025-11-20", title: "Padel", color: "green"},
    {date:"2025-11-23", title: "Padel", color: "green"},
    {date:"2025-11-28", title: "Boardgames night", color: "blue"},
];

function buildGrid(current) {
    const first = new Date(current.getFullYear(), current.getMonth(), 1);
    const mondayOffset = (first.getDay() + 6) % 7;
    const start = new Date(first);
    start.setDate(first.getDate() - mondayOffset);
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push(d);
    }
    return cells;
  }

  function addMonths(date, n){
    return new Date(date.getFullYear(), date.getMonth()+n,1);
  }


function eventsOn(date){
    const y = date.getFullYear();
    const m = String(date.getMonth()+1).padStart(2,"0");
    const d = String(date.getDate()).padStart(2,"0");
    const key = `${y}-${m}-${d}`;
    return Events.filter((e) => e.date === key);
}

export default function Calendar(){
    const[cursor,setCursor]=useState(new Date(2025, 10, 1));
    const label = cursor.toLocaleString("en", {month: "long", year: "numeric"});

    const grid = useMemo(() => buildGrid(cursor), [cursor]);
    const monthIndex = cursor.getMonth();
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [filter, setFilter] = useState("all");

    return(
        <div className="page">
            <h1 className="h1">Calendar</h1>


        <div className="chips">
                <span className={`chip ${filter === "arts" ? "active" : ""}`} onClick={() => setFilter("arts")}>
                  Arts &amp; Culture</span>

                <span className={`chip ${filter === "sports" ? "active" : ""}`} onClick={() => setFilter("sports")}>
                  Sports &amp; Fitness</span>

                <span className={`chip ${filter === "hobbies" ? "active" : ""}`} onClick={() => setFilter("hobbies")}>
                  Hobbies &amp; Lifestyle</span>

                <span className={`chip ${filter === "party" ? "active" : ""}`} onClick={() => setFilter("party")}>
                  Party</span>

                <span className={`chip ${filter === "registered" ? "active" : ""}`} onClick={() => setFilter("registered")}>
                  Registered events</span>
            </div>


        <div className="headerBar">
            <div className="left">
               <CalendarButton
                   ariaLabel="Previous month" onClick={()=> setCursor(addMonths(cursor,-1))}>
          ← </CalendarButton>

        <span className="monthLabel">{label}</span>
            </div>
                <CalendarButton
                    ariaLabel="Next month" onClick={()=> setCursor(addMonths(cursor,1))}>
          → </CalendarButton>
            </div>

        <div className="weekdays">
            {weekdays.map((w)=>(
            <div key ={w}>{w}</div>))}
        </div>


        <div className="grid">
            {grid.map((date, i)=>{
            const out = date.getMonth() !== monthIndex;
            let dayEvents = eventsOn(date);

            dayEvents = dayEvents.filter(ev => {
                if (filter === "all") return true;
                if (filter === "arts") return ev.category === "arts";
                if (filter === "sports") return ev.category === "sports";
                if (filter === "hobbies") return ev.category === "hobbies";
                if (filter === "party") return ev.category === "party";
                if (filter === "registered") return ev.registered === true;
    return true;
  });


            return (
              <div className={`cell${out ? " out" : ""}`}>
                <div className="day">{date.getDate()}</div> 
                <div className="pills">
                    {dayEvents.map((ev, j) =>(
                        <div key={j} className={`pill ${ev.color}`}>
                            {ev.title}
                    </div> 
                ))}
                </div>
                </div>
            );
        })}
        </div>
        </div>
    );
};






