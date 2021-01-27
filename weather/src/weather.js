import React from 'react';
const Weather = (props) => {
  const { weather } = props;
  if (!weather || weather.length === 0) return <p>No weather data available, sorry</p>;
  return (
    <div id="MyParentElement">
        <div>Current Conditions: {weather.condition}</div>
        <div>Actual Temp: {weather.currTemp}° (feels like {weather.feelsLike}°)</div>
        <div>High: {weather.highTemp}° / Low: {weather.lowTemp}°</div>
    </div>
  );
};
export default Weather;