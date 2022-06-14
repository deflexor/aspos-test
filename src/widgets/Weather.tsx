import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import { WeatherData, WeatherLocation } from '../types'
import { getWeatherLocations } from "../util";

import './Weather.css'

type WeatherProps = {
    weatherData: WeatherData;
    locationChanged: (l: WeatherLocation) => void
};

export default function Weather(props: WeatherProps) {
    const [locations, setLocations] = useState<WeatherLocation[]>([]);
    const [ddIsOpen, setddIsOpen] = useState(false);
    useEffect(() => {
        getWeatherLocations().then(locs => {
            setLocations(locs)
        })
    }, [])
    const toggleDropDown = () => setddIsOpen(v => !v)
    return (
        <Suspense fallback={<p>loading...</p>}>
            <div className="p-3 bg-warning rounded">
                <div className="weather-data">
                    <h3>{props.weatherData.location}</h3>
                    <div className="temp">{props.weatherData.temp}°C</div>
                </div>
                <div className="dropdown">
                    <button className="btn btn-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded={ddIsOpen} onClick={() => toggleDropDown()}>
                        Change location
                    </button>
                    <ul className={`dropdown-menu ${ddIsOpen && 'show'}`} aria-labelledby="dropdownMenuLink">
                        {locations.map(l =>
                            <li key={l.id} onClick={() => { toggleDropDown(); props.locationChanged(l) }}>
                                <a className={props.weatherData.location === l.location ? 'dropdown-item active' : 'dropdown-item'} href="" onClick={e => e.preventDefault()}>
                                    {l.location}
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </Suspense>
    );
}
