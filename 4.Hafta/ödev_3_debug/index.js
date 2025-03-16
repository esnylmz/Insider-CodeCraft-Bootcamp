
const products = [
    { id: 1, name: 'Laptop', price: 15000, stock: 5 },
    { id: 2, name: 'Telefon', price: 8000, stock: 10 },
    { id: 3, name: 'Tablet', price: 5000, stock: 8 },
    { id: 4, name: 'Kulaklık', price: 1000, stock: 15 },
    { id: 5, name: 'Mouse', price: 500, stock: 20 }
];


class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.discountApplied = false;
    }

    addItem(productId, quantity = 1) {
        //Düzeltme 1
        //Burada, stok değerlerinin azalıp azalmadığını kontrol etmek için
        //product'ın tanımlandığı yere breakpoint koydum ve "Watch" listesine product.stock ekledim
        //sitede bir item ekleyip f10 ile kodu step-by-step çalıştırdığımda product.stock değerinin azaltılmadığını fark ettim.
        //Kodda düzeltme:1'i yaptıktan sonra live server'da açarak tekrar test ettim.
        try {
            const product = products.find(p => p.id === productId);
            
            if (!product) {
                throw new Error('Ürün bulunamadı!');
            }
            //Düzeltme 2:
            //Stok azaltılması sağlandıktan sonra kodu çalıştırmaya devam ettim. Stock'ta 1 ürün 
            //kaldığında Yetersiz Stok durumuna girip, kodun error'a atladığını gördüm.
            //Breakpoint ile burayı tekrar test ettim ve daha sonra hatayı = ifadesini kaldırarak düzelttim.
            if (product.stock < quantity) { //DÜzeltme 2
                // < yerine <= kullanıldı
                throw new Error('Yetersiz stok!');
            }

            const existingItem = this.items.find(item => item.productId === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.items.push({
                    productId,
                    name: product.name,
                    price: product.price,
                    quantity
                });
            }
            
            product.stock -= quantity; //Düzeltme 1: Sepete eleman eklendikçe stock'un azalması sağlandı
            this.calculateTotal();
            this.updateUI();


        } catch (error) {
            console.error('Ürün ekleme hatası:', error);
            this.showError(error.message);
        }
    }

    removeItem(productId) {
        //Düzeltme 3
        //addItem fonksiyonunu kontrol ettikten sonra bu fonksiyona breakpoint koyarak devam ettim
        //Breakpoint'e gelene kadar sepete 2 laptop ürünü ekledim ve Scope'tan products.stock değerini inceledim
        //Laptop'tan 2 ürün eklediğin için products.stock 2 birim azaldı. Daha sonra F10 ile adım adım devam ederek
        //product.stock değerini inceledim.
        // product.stock += 1; satırını geçtiğimde product.stocks'un 5 olarak güncellenmesi gerektiği halde 4 olduğunu gördüm.
        try {
            const itemIndex = this.items.findIndex(item => item.productId === productId);
            
            if (itemIndex === -1) {
                throw new Error('Ürün sepette bulunamadı!');
            }

            const item = this.items[itemIndex];
            const product = products.find(p => p.id === productId);

            if (product) {
                product.stock += item.quantity; //Düzeltme 3
                // //1 yerine item.quantity alınmalı
                // item.quantity yerine sabit değer
            }

            this.items.splice(itemIndex, 1);
            this.calculateTotal();
            this.updateUI();

        } catch (error) {
            console.error('Ürün silme hatası:', error);
            this.showError(error.message);
        }
    }

    calculateTotal() {
        //Düzeltme 4:
        //Aynı şekilde hem kodu kontrol ederek hem de bu fonksiyona da breakppoint koyup
        //değerlerin Scope'taki güncellemesi takip edilerek sum hesaplamasının
        //sadece ürün miktarını aldığı görülerek düzeltme yapılmıştır.
        this.total = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);//Düzeltme 4
             // quantity çarpımı unutuldu
        }, 0);

        if (this.discountApplied && this.total > 0) {
            //Düzeltme 5
            //kodda da görülebileceği üzere indirim miktarı %10 değil %90 dır.
            //%10 olması için Düzeltme 5 eklenmiştir.
            this.total *= 0.9 //Düzeltme 5 
            // //0.1;
        }
    }

    applyDiscount(code) {
        if (code === 'INDIRIM10' && !this.discountApplied) {
            this.discountApplied = true;
            this.calculateTotal();
            this.updateUI();
            this.showMessage('İndirim uygulandı!');
        } else {
            this.showError('Geçersiz indirim kodu!');
        }
    }

    // UI Güncelleme
    //Düzeltme 6:
    //Remove fonksiyonunda stoğu eski haline çevirmemize rağmen, burada düzeltme 
    //yapılması gerekir çünkü güncel değer item kartında gözükmemektedir.
 
    //Düzeltme 7:
    //Ayrıca hata ve mesajları temizlemek için showError düzenlenmiştir.
    updateUI() {
        const cartElement = document.getElementById('cart');
        const totalElement = document.getElementById('total');
        
        if (cartElement && totalElement) {
            cartElement.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>${item.quantity} adet</span>
                    <span>${item.price} TL</span>
                    <button onclick="cart.removeItem(${item.productId})">Sil</button>
                </div>
            `).join('');

            totalElement.textContent = `Toplam: ${this.total.toFixed(2)} TL`;

            // UI güncellenirken ürünlerin stok bilgisi de güncellenmeli
            app.renderProducts();//Düzeltme 6
        }
    }

    showError(message) {
        const errorElement = document.getElementById('error');
        if (errorElement) {
            //Düzeltme 7
             errorElement.textContent = message;// Önceki mesajı temizle
            setTimeout(() => errorElement.textContent = '', 3000); // 3 saniye sonra mesajı temizle
        }
    }

    showMessage(message) {
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = message;
            setTimeout(() => {
                messageElement.textContent = '';
            }, 3000);
        }
    }
}

class App {
    constructor() {
        window.cart = new ShoppingCart();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.renderProducts();
            this.setupEventHandlers();
        });
    }

    renderProducts() {
        const productsElement = document.getElementById('products');
        if (productsElement) {
            productsElement.innerHTML = products.map(product => `
                <div class="product-card">
                    <h3>${product.name}</h3>
                    <p>Fiyat: ${product.price}.00 TL</p>
                    <p>Stok: ${product.stock}</p>
                    <button onclick="app.addToCart(${product.id})"
                            ${product.stock === 0 ? 'disabled' : ''}>
                        Sepete Ekle
                    </button>
                </div>
            `).join('');
        }
    }

    setupEventHandlers() {
        const discountForm = document.getElementById('discount-form');
        if (discountForm) {
            discountForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const codeInput = document.getElementById('discount-code');
                if (codeInput) {
                    window.cart.applyDiscount(codeInput.value);
                }
            });
        }

        document.addEventListener('stockUpdate', () => {
            this.renderProducts();
        });
    }

    addToCart(productId) {
        window.cart.addItem(productId, undefined);
        document.dispatchEvent(new Event('stockUpdate'));
    }
}

const app = new App();
window.app = app; 