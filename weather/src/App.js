import React, { useEffect, useState } from 'react';
import './App.css';
import Weather from './weather';
import GettingData from './working';

function App() {
  const { apiUrl } = window['runConfig'];
  const ListLoading = GettingData(Weather);
  const [appState, setAppState] = useState({
    loading: false,
    weather: null,
  });

  useEffect(() => {
    setAppState({ loading: true });
    fetch(apiUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(`Invalid response received from API Gateway: ${response.statusText}`);
      })
      .then(data => {
        setAppState({ loading: false, weather: data });
      });
  }, [setAppState]);
  return (
    <div className='App'>
      <div className='container'>
        <h1>Weather Report</h1>
      </div>
      <div className='repo-container'>
        <ListLoading isLoading={appState.loading} weather={appState.weather} />
      </div>
    </div>
  );
}
export default App;