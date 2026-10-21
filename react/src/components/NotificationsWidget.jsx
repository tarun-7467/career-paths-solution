import NotificationsView from './NotificationsView.jsx'

function NotificationsWidget() {
    return (
        <section className="notifications-widget">
            <div className="panel-header">
                <h2>Notifications</h2>
            </div>
            <NotificationsView />
        </section>
    );
}

export default NotificationsWidget;