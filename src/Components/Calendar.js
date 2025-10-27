import React, {use, useMemo, useState} from "react";
import "../css/Calendar.css";


const Events = [
    {date:"2025-11-02", title: "Padel", color: "green"},
    {date:"2025-11-02", title: "Boardgames night", color: "blue"},
    {date:"2025-11-04", title: "Basketball game", color: "grey"},
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

const startOfMonth =(d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth =(d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const addMonths =(d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const weekdayMonStart =(weekday) => (weekday) => (weekday === 0?7: weekday);

function buildGrid(current){
    const first = startOfMonth(current);
    const last = endOfMonth(current);
    const daysInMonth=last.getDate();
    const start = weekdayMonStart(first.getDate());

    const cells = [];
    for(let i=1; i<start;i++) cells.push(null);
    for(let d=1;d<=daysInMonth;d++){
        cells.push(new Date(current.getFullYear(), current.getMonth(), d));
    }

    
    while(cells.length<42){
        const next=new Date(
            current.getFullYear(),
            current.getMonth(),
            cells.length-(start-1)
        );
        cells.push(next);
    }
    return cells.slice(0,42);
}

function eventsOn(date){
    const y = date.getFullYear();
    const m = String(date.getMonth()+1).padStart(2,"0");
    const d = String(date.getDate()).padStart(2,"0");
    const key = '${y}-${m}-${d}';
    return Events.filter((e) => e.date === key);
}

export default function Calendar(){
    const[cursor,setCursor]=useState(new Date(2025, 10, 1));
    const label = cursor.toLocaleString("en", {month: "long", year: "numeric"});

    const grid = useMemo(() => buildGrid(cursor), [cursor]);
    const monthIndex = cursor.getMonth();
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return(
        <div className="page">
            <h1 className="h1">Calendar</h1>

            {/* month navigation*/}
            <div className="headerBar">
                <div className="arrow" onClick={()=> setCursor(addMonths(cursor, -1))}>
                ←
                </div>
                <strong>{label}</strong>
                <div className="arrow" onClick={() => (addMonths(cursor,1))}>
                →
            </div>
        </div>

        {/* weekday labels*/}
        <div className="weekdays">
            {weekdays.map((w)=>(
            <div key ={w}>{w}</div>))}
        </div>

        {/* 7x6 grid*/}
        <div className="grid">
            {grid.map((date, i)=>{
                if(!date) return <div key = {i} className="cell out"/>;

            const out = date.getMonth() !==monthIndex;
            const dayEvents=eventsOn(date);

            return (
              <div key={i} className={'cell${out?"out":""}'}>
                <div className="day">{date.getDate()}</div> 
                <div className="pills">
                    {dayEvents.map((ev, j) =>(
                        <div key={j} className={'pill${ev.color}'}>
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





