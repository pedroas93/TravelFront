import { User } from '../slices/userSlice';

type ResponseKind = 'success' | 'failure';

type NetworkResponse<T> = {
    kind: ResponseKind;
    token?: T;
};

type NetworkResponseList<T> = {
    kind: ResponseKind;
    body?: T;
};
// para consumir el servicio de login

export const fetchUserLogin = async (
    email: string, password: string
): Promise<NetworkResponse<string>> => {
    const response = await fetch(
        `https://reqres.in/api/login`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "email": email, "password": password })
        },
    );
    if (response.ok) {
        const json = await response.json();
        return {
            kind: 'success',
            token: json.token,
        };
    } else {
        return {
            kind: 'failure',
        };
    }
};
// para consumir el servicio de registro

export const fetchUserSingup = async (
    email: string, password: string, 
): Promise<NetworkResponse<string>> => {
    const response = await fetch(
        `https://reqres.in/api/register`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "email": email, "password": password })
        },
    );
    if (response.ok) {
        const json = await response.json();
        return {
            kind: 'success',
            token: json.token,
        };
    } else {
        return {
            kind: 'failure',
        };
    }
};

// para consumir el servicio de lista de usuarios
export const fetchUsersList = async (
    page: number,
): Promise<NetworkResponseList<User[]>> => {
    const response = await fetch(
        `https://reqres.in/api/users/?page=${page}`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
    );
    if (response.ok) {
        const json = await response.json();
        return {
            kind: 'success',
            body: json.data,
        };
    } else {
        return {
            kind: 'failure',
        };
    }
};