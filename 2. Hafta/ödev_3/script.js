
let inputElement= document.getElementById("userInput");
let startButton= document.getElementById("start");
let stopButton=document.getElementById("stop");
let display= document.getElementById("time");

//geri sayımı takip etmek için gerisayım değişkenini oluşturdum
let gerisayım;
startButton.addEventListener('click', ()=>{
    //kullanıcının verdiği süreyi alıyorum
    let sayi=parseInt(inputElement.value);

    if(isNaN(sayi) || sayi<=0){
        alert("Lütfen pozitif bir sayı giriniz!!!");
        return;
    }
    
    display.textContent = `Süre başladı: ${sayi}`;

    clearInterval(gerisayım);

    gerisayım= setInterval(()=>{
        sayi--;
        display.textContent=`Kalan süre: ${sayi}`;

         // Son 5 saniyeye geldiğinde kırmızıya dönsün
         if (sayi <= 5 && sayi > 0) {
            display.style.color = "red";  // Kalan süre kırmızı olur
            display.textContent = `Son 5 saniye: ${sayi}`;
        }

        if(sayi<=0){
            clearInterval(gerisayım);
            display.textContent="Süre doldu!!"
            display.style.color = "red";
            alert("Süre doldu!!!")
        }
    },1000);// 1 saniyede bir çalışması için

});

stopButton.addEventListener('click', () => {
    clearInterval(gerisayım); 
    display.textContent = "Geri sayım durduruldu!";
});