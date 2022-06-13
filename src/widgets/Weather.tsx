import React, { useEffect } from "react";
import { Suspense } from "react";
import { WeatherData } from '../util'

type WeatherProps = {
    weatherData: WeatherData;
  };

export default function Weather(props: WeatherProps) {
    return (
        <Suspense fallback={<p>loading...</p>}>
            <div className="p-3 bg-warning rounded">
                <h3>{props.weatherData.location}</h3>
                <div className="temp">{props.weatherData.temp}°C</div>
            </div>
        </Suspense>
    );
}
