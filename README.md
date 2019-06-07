# Speaker API

Esta API tem por intuito receber do speaker um áudio de uma fala no contexto de casa inteligente; interpretá-lo; mandar comandos para outros módulos da casa; e devolver para o speaker um áudio de resposta para ser executado ao usuário.

## Serviços
A API utiliza 3 serviços básicos para realizar seu propósito, cada qual com algumas opções de diferentes empresas e de diferentes resultados. São estes serviços e suas respectivas versões:

### Speech-to-text (STT)
Converte uma fala em áudio em um texto. **Serviço utilizado em PT-BR**.
Versões disponíveis:
* [Google Speech-to-text](https://cloud.google.com/speech-to-text/?hl=pt-br)
* [Watson Speech-to-text](https://www.ibm.com/watson/services/speech-to-text/)

### Natural Language Understanding (NLU)
Interpreta um texto em linguagem natural de acordo com configurações pré-construídas e devolve uma resposta em texto.
Versões disponíveis:
* [Google Dialog Flow](https://dialogflow.com/)

### Text-to-speech (TTS)
Converte um texto em uma fala em áudio. **Serviço utilizado em PT-BR**.
Versões disponíveis:
* [Google Text-to-speech](https://cloud.google.com/text-to-speech/?hl=pt-br)
* [Amazon Polly](https://aws.amazon.com/pt/polly/)

## Como usar
Para usar a API é necessário prover as seguintes informações à aplicação com estas respectivas atuais opções:
- **TTS:** Qual serviço de *text-to-speech* disponível se deseja usar
- **NLU:** Qual serviço de *natural language understanding* disponível se deseja usar
- **STT:** Qual serviço de *speech-to-text* disponível se deseja usar
- **Áudio:** O áudio do usuário que se deseja traduzir, interpretar e responder. **Atualmente é fornecido localmente à API** (mais informações na seção **Possíveis valores**) 

### Request
A API deve ser acionada via HTTP request **POST**, provendo as informações listadas acima. O endereço para fazer o request é: 

```
http://[hostname]:[port]/speaker
```
Onde, para testes locais, as variáveis são:

```
Hostname: "localhost"
Port: "3000"
```

### Possíveis valores
Atualmente, os valores aceitos pela API para cada uma das informações necessárias são:
#### TTS
```
"google"
"watson" 
```
#### NLU
``` 
 "dialog_flow"
```
#### STT
```
"google"
"polly"
```

#### Áudio *
```
""
```
*Até o presente momento, ainda não foi definida uma forma de enviar um arquivo de áudio via HTTP request para a API. O áudio é obtido **localmente** por meio do arquivo ```\resources\input.wav```.


### Resposta
Atualmente, a API provê 2 tipos de respostas: 
* Um JSON contendo um buffer com os dados de um arquivo de áudio no formato:
```
{
    "audio": {
        "type": "Buffer",
        "data": []
}
```
* Um arquivo de áudio (wav) gravado em ```\resources\output.wav```;

### Exemplo

```
POST   localhost:3000/speaker
{
	"tts": "google",
	"nlu": "dialog_flow",
	"stt": "google",
	"audio": ""
}

Resposta:
{
    "audio": {
        "type": "Buffer",
        "data": [
            73,
            68,
            51,
            4,
            0,
            ...
            ]
}
```
