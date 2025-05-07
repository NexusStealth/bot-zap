const axios = require('axios');

async function consultarCPF(cpf) {
    const { data } = await axios.get(`https://api.exemplo.com/cpf/${cpf}`, {
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_API}`
        }
    });
    return data;
}

async function consultarCNPJ(cnpj) {
    const { data } = await axios.get(`https://api.exemplo.com/cnpj/${cnpj}`, {
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_API}`
        }
    });
    return data;
}

module.exports = { consultarCPF, consultarCNPJ };
