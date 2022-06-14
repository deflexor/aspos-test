import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import { FeedbackData, FeedbackResponse, Grade } from "../types";
import { getLoginToken } from "../util";
import './Feedback.css'

type FeedbackProps = {
    userEmail: string;
    onFeedback: (data: FeedbackData) => Promise<FeedbackResponse>;
  };

export default function Feedback(props: FeedbackProps) {
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const [grade, setGrade] = useState<Grade>(null);
    const [userEmail, setUserEmail] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const handleSubmit = async (e:  React.FormEvent) => {
        e.preventDefault();
        setDone(false)
        let err = ''
        if(feedbackText === '') {
            err = 'Feedback text is required'
        }
        if(grade === null) {
            err = 'Rate is required'
        }
        if(err !== '') {
            setError(err)
        } else {
            setError('')
            const userData : FeedbackData = { email: userEmail, text: feedbackText, grade: grade, page: location.href };
            const resp = await props.onFeedback(userData)
            if (resp.error) {
                setError(resp.error)
            } else {
                setDone(true)
            }
        }
    }
    useEffect(() => {
        if (props.userEmail) {
            setUserEmail(props.userEmail)
        }
      }, [props.userEmail]);
    return (
        <div className="p-4 mb-3 bg-warning rounded feedback">
            <h4 className="fst-italic">Feedback Widget</h4>
            <form onSubmit={handleSubmit}>
                <div className="small error">
                    { error ? <div className="text-danger">{error}</div> : '' }
                    { done ? <div className="text-success">Your feedback is succesfully sent!</div> : '' }
                </div>
                <div className="mb-3">
                    <label className="form-label rate-label">Rate the article</label>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions"
                         id="inlineRadio1" value="Good" onChange={e => setGrade('Good' as Grade)} />
                        <label className="form-check-label" htmlFor="inlineRadio1">Good</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions"
                         id="inlineRadio2" value="Bad" onChange={e => setGrade('Bad' as Grade)} />
                        <label className="form-check-label" htmlFor="inlineRadio2">Bad</label>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label">Your E-mail address</label>
                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com"
                     value={userEmail} onChange={e => setUserEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Feedback text</label>
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows={3}
                     onChange={e => setFeedbackText(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Send</button>
            </form>
        </div>
    );
}
