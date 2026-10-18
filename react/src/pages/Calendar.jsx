
// Component imports

import Header from '../components/Header.jsx'
import CalendarView from '../components/CalendarView.jsx' // // the calendar itself, shared with the dashboard widget
// The full Calendar page 
function Calendar() {
  return (
    <div className="calendar-page">
      <Header />
      <h1>Career Paths Solution</h1>
      <CalendarView />
    </div>
  );
}

export default Calendar;