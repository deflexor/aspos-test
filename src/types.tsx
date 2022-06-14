export type UserFormData = {
    userEmail: string;
    userPassword: string;
}

export type LoggedInUser = {
    email: string;
    error?: Error;
}

export type WeatherData = {
    temp: number;
    location: string;
}

export type WeatherLocation = {
    id: string;
    temp: number;
    location: string;
}

export type UserPrefs = {
    location: string;
}

export type Grade = 'good' | 'bad' | null

export type FeedbackData = {
    grade: Grade;
    text: string;
    email: string;
    page: string;
}

export type FeedbackResponse = {
    ok: boolean;
    error?: string;
}
