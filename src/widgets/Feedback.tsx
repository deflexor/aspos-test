import React, { useEffect } from "react";
import { Suspense } from "react";

type FeedbackData = {
    temp: number;
    condition?: string;
    location: string;
}

type FeedbackProps = {
    fData: FeedbackData;
  };

export default function Feedback(props: FeedbackProps) {
    return (
        <Suspense fallback={<p>loading...</p>}>
            <div className="p-3 bg-warning rounded">
                <h3>{props.fData.location}</h3>
                <div className="temp">{props.fData.temp}°C</div>
            </div>
        </Suspense>
    );
}
