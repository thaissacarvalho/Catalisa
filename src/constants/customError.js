const customErrors = {
    1: { code: 400, message: 'Erro 1: This requisition is invalid.' },
    2: { code: 401, message: 'Erro 2: This action is not authorized.' },
    3: { code: 404, message: 'Erro 3: Wait a minute! This page was not found.' },
    4: { code: 403, message: 'Erro 4: Sorry :/ but this method is not allow.' },
    5: { code: 410, message: 'Erro 5: Calm down! You are not allowed to access here.' },
    6: { code: 500, message: 'Erro 6: Sorry :( We have an error intern in servidor.' },
    7: { code: 501, message: 'Erro 7: What you are looking for has not been implemented in our system.' }
};

module.exports = { customErrors };
