 
 const userName= prompt("Adınız nedir? ");
 const userAge= prompt("Yaşınız kaç?");
 const userJob= prompt("Mesleğiniz nedir? ");
 

 const user={
    name:userName,
    age:userAge,
    job:userJob
 };
 
console.log(`Adınız nedir? ${user.name}`);
console.log(`Yaşınız kaç? ${user.age}`);
console.log(`Mesleğiniz nedir? ${user.job}`);
console.log("Kullanıcı Bilgileri:", JSON.stringify(user, null, 2));


/***************SEPETE EKLEME VE ÇIKARMA İŞLEMLERİ******* */

let ürünListesi= [];

//ürün eklemek için
let ekle= true;
while(ekle){
    const urunAdi = prompt("Sepete eklemek istediğiniz ürünü yazın: ");
    let urunFiyat;
    do {
        urunFiyat = prompt("Ürünün fiyatını girin (sadece rakam kullanın): ");
    } 
    while (isNaN(urunFiyat) || urunFiyat.trim() === ""); // Eğer geçersiz giriş varsa tekrar sor

    urunFiyat = Number(urunFiyat); // String olan giriş sayıya çevriliyor

    ürünListesi.push({
        product: urunAdi,
        price: urunFiyat
    });

    console.log(urunAdi + " ürünü sepete eklendi. Fiyat: "+ urunFiyat);

    ekle= confirm("Başka bir ürün eklemek istiyor musunuz?");

}

console.log("Sepetiniz: ", JSON.stringify(ürünListesi, null, 2));

const total = ürünListesi.reduce((accumulator, a) => accumulator + a.price, 0);
console.log("Toplam Fiyat:", total, "TL");