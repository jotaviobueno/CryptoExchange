# Projeto CryptoExchange
Uma API para estudos. Possui 19 endpoints.

Abrir o terminal e usar os seguintes comandos:

```shell
npm i
```

Fazer as requisicoes no endereço:

```ip
localhost:8081/api/v1/:ROUTE_NAME
```

## Exemplos de requisição

**/api/v1/register**

```json
"client_name": "otavio bueno",
"email": "otavio@gmail.com",
"cpf": 123456789101,
"password": "abc123"
```

**/api/v1/login/email**

```json
"email": "otavio@gmail.com",
"password": "abc123"
```

**/api/v1/login/cpf**

```json
"cpf": 123456789101,
"password": "abc123"
```
