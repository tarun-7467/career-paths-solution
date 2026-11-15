
// Basic header component
function Header({ user, onLogout }) {
  return (
    <div className="page-header">
      <h1 className="page-header-title">
        Career Paths Solution
      </h1>

      {user ? (
        <button
          className="button"
          onClick={onLogout}
        >
          Log Out
        </button>
      ) : (
        <button
          className="button"
          onClick={() => {
            window.location.href = '/login';
          }}
        >
          Sign In
        </button>
      )}
    </div>
  );
}

export default Header;
