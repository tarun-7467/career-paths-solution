// Component imports
import CalendarView from './CalendarView.jsx'

// upcoming event for user to see 
// It reuses the shared calendar, so any change to CalendarView shows up here and on the Calendar page.
function CalendarWidget({ applications }) {
    return (
    // calendar-widget is styled in Dashboard.css 
    <section className="calendar-widget">
      {/* panel-header is an existing class, so the title matches "Applications" */}
      <div className="panel-header">
        <h2>Upcoming</h2>
        <a href="/calendar" className="widget-link">View full calendar</a>
      </div>

      {/* compact makes CalendarView show this week as a list instead of the full month */}
     <CalendarView compact applications={applications} />
    </section>
  );
}

export default CalendarWidget;