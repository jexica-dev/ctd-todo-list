import React from 'react';

function AboutPage() {
  return (
    <div className="about-container">
      <h1>About CTD Todo List App</h1>
      <p>
        This Todo List Application is a robust task management tool designed to
        help you stay organized and track your daily productivity.
      </p>

      <section className="features-section">
        <h2>App Features</h2>
        <ul>
          <li>
            <strong>Task Management:</strong> Add, edit, and delete tasks
            seamlessly.
          </li>
          {/* <li>
            <strong>Filtering & Sorting:</strong> Easily find what you need by
            filtering terms and sorting by date or status.
          </li> */}
          <li>
            <strong>Secure Authentication:</strong> User-specific data protected
            by secure login sessions.
          </li>
        </ul>
      </section>

      <section className="tech-section">
        <h2>Technologies Used:</h2>
        <p>This project was built using modern web development standards:</p>
        <ul>
          <li>
            <strong>React:</strong> For building a dynamic, component-based user
            interface.
          </li>
          <li>
            <strong>React Router:</strong> To manage seamless client-side
            navigation.
          </li>
          <li>
            <strong>Vite:</strong> For a lightning-fast development environment
            and build process.
          </li>
          <li>
            <strong>Context API & useReducer:</strong> For clean, centralized
            state management across the entire application.
          </li>
        </ul>
      </section>
    </div>
  );
}

export default AboutPage;
