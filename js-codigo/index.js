var frases = [
    {"frase":"Cada qual sabe amar a seu modo; o modo, pouco importa; o essencial é que saiba amar.", "autor":" - Machado de Assis"},
    {"frase":"Deus, para a felicidade do homem, inventou a fé e o amor. O Diabo, invejoso, fez o homem confundir fé com religião e amor com casamento.", "autor":" - Machado de Assis"},
    {"frase":"Esquecer é uma necessidade. A vida é uma lousa, em que o destino, para escrever um novo caso, precisa de apagar o caso escrito.", "autor":" - Machado de Assis"},
    {"frase":"O dinheiro não traz felicidade — para quem não sabe o que fazer com ele.", "autor":" - Machado de Assis"},
    {"frase":"Lágrimas não são argumentos.", "autor":" - Machado de Assis"},
    {"frase":"Creia em si, mas não duvide sempre dos outros.", "autor":" - Machado de Assis"},
    {"frase":"Não é amigo aquele que alardeia a amizade: é traficante; a amizade sente-se, não se diz...", "autor":" - Machado de Assis"},
    {"frase":"Não levante a espada sobre a cabeça de quem te pediu perdão.", "autor":" - Machado de Assis"},
    {"frase":"A vida sem luta é um mar morto no centro do organismo universal.", "autor":" - Machado de Assis"},
    {"frase":"A mentira é muita vezes tão involuntária como a respiração.", "autor":" - Machado de Assis"},
    {"frase":"Não se ama duas vezes a mesma mulher.", "autor":" - Machado de Assis"},
    {"frase":"A vida é cheia de obrigações que a gente cumpre, por mais vontade que tenha de as infringir deslavadamente.", "autor":" - Machado de Assis"},
    {"frase":"Botas...as botas apertadas são uma das maiores venturas da terra, porque, fazendo doer os pés, dão azo ao prazer de as descalçar.", "autor":" - Machado de Assis"},
    {"frase":"O medo é um preconceito dos nervos. E um preconceito, desfaz-se; basta a simples reflexão.", "autor":" - Machado de Assis"},
    {"frase":"Suporta-se com paciência a cólica do próximo.", "autor":" - Machado de Assis"},
  ]
  
  var indiceDaFrase = Math.floor(frases.length* Math.random())
  inserirFrase( indiceDaFrase )
  function inserirFrase( indiceDaFrase ){
    var pFrase = document.getElementById("frase")
    pFrase.innerText=frases[indiceDaFrase].frase
  
    var pAutor = document.getElementById("autor")
    pAutor.innerText=frases[indiceDaFrase].autor
  }
  