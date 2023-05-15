const request = require('supertest');
const app = require('../app');
const { makeRequest } = require('../clients/httpClient');
require('dotenv').config();

jest.mock('../clients/httpClient');
token = 'Bearer c670229d9784c6b867b488d81f87e0a465b151d0b6a9ae45443383017c4fe1cc';
url = 'https://gorest.co.in/public/v2';

const userID = '1';
const user1 = {
    id: userID,
    name: 'name',
    email: 'a@a.com',
    gender: 'male',
    status: 'active',
};
const user2 = {
    name: 'name2',
    email: 'b@b.com',
    gender: 'female',
    status: 'inactive',
};

afterEach(() => {
    jest.clearAllMocks();
});

describe('GET /users', () => {
    it('should getUsers', async () => {
        makeRequest.mockResolvedValueOnce([user1]);

        const res = await request(app).get('/users/').set('Authorization', `${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body).toStrictEqual([user1]);
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith(`${url}/users/`, 'GET', token);
    });
    it('should handle errors getUsers', async () => {
        makeRequest.mockRejectedValueOnce(new Error('Users not found'));

        const res = await request(app).get('/users').set('Authorization', `${token}`);

        expect(res.statusCode).toBe(500);
        expect(res.text).toBe('Error getting user with id');
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith(`${url}/users/`, 'GET', token);
    });
});

describe('GET /users/:id', () => {
    it('should getUser by id', async () => {
        makeRequest.mockResolvedValueOnce(user1);

        const res = await request(app).get(`/users/${userID}`).set('Authorization', `${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(user1);
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith(`${url}/users/${userID}`, 'GET', token);
    });

    it('should handle errors getting users by id', async () => {
        const errID = '4';
        makeRequest.mockRejectedValueOnce(new Error('user1 not found'));

        const res = await request(app).get(`/users/${errID}`).set('Authorization', `${token}`);

        expect(res.statusCode).toBe(500);
        expect(res.text).toBe('Error getting user with id');
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith(`${url}/users/${errID}`, 'GET', token);
    });
});

describe('POST /users', () => {
    it('should create a new user1', async () => {
        const createdUser = { ...user2, id: '1' };

        makeRequest.mockResolvedValueOnce(createdUser);

        const res = await request(app).post('/users').send(user2).set('Authorization', `${token}`);

        expect(res.statusCode).toBe(201);
        expect(res.body).toStrictEqual(createdUser);
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith(`${url}/users/`, 'POST', token, user2);
    });

    it('should handle errors create new user1', async () => {
        makeRequest.mockRejectedValueOnce(new Error('Create failed'));

        const res = await request(app).post('/users').send(user2).set('Authorization', `${token}`);

        expect(res.statusCode).toBe(500);
        expect(res.text).toBe('Error creating user');
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith(`${url}/users/`, 'POST', token, user2);
    });
});

describe('PUT /users/:id', () => {
    it('should update user1', async () => {
        makeRequest.mockResolvedValueOnce(user2);
        const res = await request(app)
            .put(`/users/${userID}`)
            .send(user2)
            .set('Authorization', `${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(user2);
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith(`${url}/users/${userID}`, 'PUT', token, user2);
    });
    it('should handle errors update user1', async () => {
        makeRequest.mockRejectedValueOnce(new Error('Update failed'));

        const res = await request(app)
            .put(`/users/${userID}`)
            .send(user2)
            .set('Authorization', `${token}`);

        expect(res.statusCode).toBe(500);
        expect(res.text).toBe('Error updating user with id');
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith(`${url}/users/${userID}`, 'PUT', token, user2);
    });
});

describe('DELETE /users/:id', () => {
    it('should delete a user1 by ID', async () => {
        makeRequest.mockResolvedValueOnce(user1);

        const res = await request(app).delete(`/users/${userID}`).set('Authorization', `${token}`);

        expect(res.statusCode).toBe(202);
        expect(res.text).toBe('User deleted');
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith(`${url}/users/${userID}`, 'DELETE', token);
    });

    it('should handle errors delete user1', async () => {
        makeRequest.mockRejectedValueOnce(new Error('Network Error'));

        const res = await request(app).delete(`/users/${userID}`).set('Authorization', `${token}`);

        expect(res.statusCode).toBe(500);
        expect(res.text).toBe('Error deleting user');
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith(`${url}/users/${userID}`, 'DELETE', token);
    });
});
