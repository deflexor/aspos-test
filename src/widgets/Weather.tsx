import React, { useEffect } from "react";
import { Suspense } from "react";

type WeatherData = {
    temp: number;
    condition?: string;
    location: string;
}

type WeatherProps = {
    weatherData: WeatherData;
  };

export default function Weather(props: WeatherProps) {
    return (
        <Suspense fallback={<p>loading...</p>}>
            <div className="p-3 bg-warning rounded">
                <h3>{props.weatherData?.location}</h3>
                <div className="temp">{props.weatherData.temp}°C</div>
                {props.weatherData.condition && <div className="condition">{props.weatherData.condition}</div>}
            </div>
        </Suspense>
    );
}
