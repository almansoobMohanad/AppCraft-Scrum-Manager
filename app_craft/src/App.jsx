import { useState } from 'react';
import CancelButton from './components/CancelButton.jsx';
import CreateTaskButton from './components/CreateTaskButton.jsx';
import './App.css';
import NavigationBar from './components/NavigationBar.jsx';
import CrossButton from './components/CrossButton.jsx';

function App() {
  return (
    <div className="app-container">
      <NavigationBar />

      <div className="content">
        <h1 className="title">Product Backlog</h1>
        <div className="button-group">
          <CrossButton />
          <CreateTaskButton />
          <CancelButton />
        </div>
      </div>
    </div>
  );
}

export default App;
