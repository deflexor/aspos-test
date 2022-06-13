import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import { WeatherData, WeatherLocation } from '../types'
import { getWeatherLocations } from "../util";

type WeatherProps = {
    weatherData: WeatherData;
    locationChanged: (l: WeatherLocation) => void
};

export default function Weather(props: WeatherProps) {
    const [locations, setLocations] = useState<WeatherLocation[]>([]);
    useEffect(() => {
        getWeatherLocations().then(locs => {
            setLocations(locs)
        })
    }, [])
    return (
        <Suspense fallback={<p>loading...</p>}>
            <div className="p-3 bg-warning rounded">
                <div>
                    <h3>{props.weatherData.location}</h3>
                    <div className="temp">{props.weatherData.temp}°C</div>
                </div>
                <div className="dropdown">
                    <a className="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Cahnge location
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        {locations.map(l =>
                            <li onClick={() => props.locationChanged(l)}><a className={props.weatherData.location === l.location ? 'dropdown-item active' : 'dropdown-item'} href="#">{l.location}</a></li>
                        )}
                    </ul>
                </div>
            </div>
        </Suspense>
    );
}
