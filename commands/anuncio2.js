// commands/anuncio1.js
module.exports = async (client, msg) => {
    const texto = `🛍️ Produto 1:
- Nome: Teste Produto 1
- Preço: R$99,90
- Link: https://example.com/produto1
`;
    await client.sendText(msg.from, texto);
};
