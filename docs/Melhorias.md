-> Melhorar logging

1. Necessário melhorar o login

-> users/admin/:userCode/status

1. Quando a pessoa inserir um status diferente, não deve ser retornado a mensagem "Invalid Request", pode ser algo relacionado ao status. 
Ex.: 
- "Status not found"
- "Invalid status"
- "Status don't exist"
- "Status is invalid. Please, correct"

Saida atual: 
{
	"success": false,
	"type": "ERROR",
	"code": "MCODE-019",
	"message": "Invalid request",
	"statusCode": 400
}

-> 