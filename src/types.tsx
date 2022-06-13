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
