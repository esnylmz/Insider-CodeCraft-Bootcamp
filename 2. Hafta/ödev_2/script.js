function collatz(n, bellek) {
    let steps = 1; // Başlangıç adımı
    while (n !== 1) {
      if (bellek[n]) {
        steps += bellek[n] - 1; // Önceden hesaplanan sonucu kullan
        break;
      }
      if (n % 2 === 0) {
        n = n / 2; // Eğer n çiftse n'i ikiye böl
      } else {
        n = 3 * n + 1; // Eğer n tekse 3n+1 yap
      }
      steps++; // Adımları sayıyoruz
    }
    bellek[n] = steps; // Hesaplanan adımı kaydediyoruz
    return steps;
  }
  
  function findLongestCollatz(limit) {
    let maxSteps = 1; // En uzun adım sayısını başta 1 olarak kabul ediyoruz
    let numberWithMaxSteps = 1; // En uzun adım sayısına sahip sayıyı başta 1 kabul ediyoruz
    let bellek = {}; // Önceden hesaplanan sonuçları tutmak için tanımlıyoruz
  
    for (let i = 1; i < limit; i++) {
      let steps = collatz(i, bellek);
      if (steps > maxSteps) {
        maxSteps = steps; // Eğer bu sayının adım sayısı daha büyükse, güncelliyoruz
        numberWithMaxSteps = i; // O sayıyı kaydediyoruz
      }
    }
  
    return numberWithMaxSteps; // En uzun Collatz dizisini başlatan sayıyı döndürüyoruz
  }
  
  let answer= findLongestCollatz(1000000);
  console.log(answer); // 1 milyona kadar en uzun diziyi başlatan sayıyı bul
  
  alert("Verilen 1 milyon limitinde sorunun cevabı: "+answer);
  alert("Kodu script.js dosyasından inceleyebilirsiniz...")