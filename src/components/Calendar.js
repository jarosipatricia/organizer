import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Menu from './Menu';
import './Calendar.css';
import { db } from "../firebase.js";
import { uid } from "uid";
import { set, ref, onValue, remove } from "firebase/database";
import * as current from './CurrentUser';

function Calendarpage() {
    const nameOfThePage = "calendar";
    const currentUser = current.useAuth()
    const [title, setTitle] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [isComplete, setComplete] = useState(false);
    const [allEvents, setAllEvents] = useState([]);

    function handleTitleChange(e) {
        setTitle(e.target.value);
    };

    function handleStartDateChange(e) {
        setStart(e.target.value);
    };

    function handleEndDateChange(e) {
        setEnd(e.target.value);
    };

    const locales = {
        "en-US": require("date-fns/locale/en-US"),
    };

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
        getDay,
        locales,
    });

    const { views } = useMemo(
        () => ({
          views: {
            month: true,
          },
        }),
        []
      )

    useEffect(() => {
      const fetchData = async () => {
        if (currentUser) {
        onValue(ref(db, `/${currentUser.uid}/${nameOfThePage}`), (snapshot) => {
            setAllEvents([]);
            const data = snapshot.val();
            if (data !== null) {
            Object.values(data).map((money) => {
                setAllEvents((oldArray) => [...oldArray, money]);
            });
            }
        });
    }}
    fetchData()
    }, [currentUser]);
    
    useEffect(() => {
      if(title !== '' && start !== '' && end !== ''){
          setComplete(true);
      } else {
          setComplete(false);
        }
    }, [title, start, end]);

    function handleSavingToDatabase(event) {
        event.preventDefault();
        const eventId = uid();
        if(start <= end) {
          set(ref(db, `/${currentUser.uid}/${nameOfThePage}/${eventId}`), {
            title: title,
            start: start,
            end: end,
            eventId: eventId
          });
        }
        setTitle("");
        setStart("");
        setEnd("");
    };

    function selectEvent(event) {
        const isDeleteConfirmed = window.confirm("Would you like to remove the selected event?");
        if(isDeleteConfirmed === true) {
            remove(ref(db, `/${currentUser.uid}/${nameOfThePage}/${event.eventId}`));
        }
      }

    return (
        <div className="App">
            <Menu></Menu>
            <h1 className="maintitle">Calendar</h1>
            <form className="inputContainer" onSubmit={handleSavingToDatabase}>
                <p>
                  <label className="insidelabel" htmlFor="desc">Description</label>
                  <input type="text" placeholder="Add description.." value={title} onChange={handleTitleChange} id="desc"/>
                </p>
                <p>
                  <label className="insidelabel" htmlFor="start">Start date</label>
                  <input type="date" value={start} onChange={handleStartDateChange} className="dateInput" id="start"/>
                </p>
                <p>
                  <label className="insidelabel" htmlFor="end">End date</label>
                  <input type="date" value={end} onChange={handleEndDateChange} className="dateInput" id="end"/>
                </p>
                <p>
                <input type="submit" value="Add" disabled={!isComplete} id="submit"/>
                </p>
            </form>
            <Calendar 
            onSelectEvent = {event => selectEvent(event)} 
            localizer={localizer} 
            events={allEvents} 
            views={views} 
            startAccessor="start" 
            endAccessor="end" 
            showAllEvents={true} 
            style={{ height: 500, margin: "30px" }} 
            components={{ month: {dateHeader: ({  label }) => { return ( <div style={{color:'purple', fontSize: '22px'}}> {label} </div>);}}}} 
            eventPropGetter={(event, start, end, isSelected) => ({event,start, end, isSelected, style: { backgroundColor: "purple"}})} 
            />
        </div>
    );
}

export default Calendarpage;