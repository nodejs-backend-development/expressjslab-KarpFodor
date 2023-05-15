const { makeRequest } = require('../clients/httpClient');

const getUsers = async (req, res) => {
    const id = req.params.userID === undefined ? '' : req.params.userID;
    const token = req.headers.authorization;

    try {
        const userData = await makeRequest(
            `https://gorest.co.in/public/v2/users/${id}`,
            'GET',
            token,
        );
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).send('Error getting user with id');
    }
};

const addUser = async (req, res) => {
    const token = req.headers.authorization;
    const user = req.body;

    try {
        const { name, email, gender, status } = req.body;
        const userData = await makeRequest('https://gorest.co.in/public/v2/users/', 'POST', token, {
            name,
            email,
            gender,
            status,
        });
        res.status(201).json(userData);
    } catch (error) {
        res.status(500).send('Error creating user');
    }
};

const delUser = async (req, res) => {
    const id = req.params.userID === undefined ? '' : req.params.userID;
    const token = req.headers.authorization;

    try {
        await makeRequest(`https://gorest.co.in/public/v2/users/${id}`, 'DELETE', token);
        res.status(202).send('User deleted');
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
};

const updUser = async (req, res) => {
    const id = req.params.userID === undefined ? '' : req.params.userID;
    const token = req.headers.authorization;

    try {
        const { name, email, gender, status } = req.body;
        const userData = await makeRequest(
            `https://gorest.co.in/public/v2/users/${id}`,
            'PUT',
            token,
            {
                name,
                email,
                gender,
                status,
            },
        );
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).send('Error updating user with id');
    }
};

module.exports = {
    getUsers,
    addUser,
    delUser,
    updUser,
};
