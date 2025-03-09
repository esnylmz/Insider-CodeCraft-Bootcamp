// jQuery'yi dinamik olarak yüklüyoruz
var scriptElement = document.createElement('script');
scriptElement.src = "https://code.jquery.com/jquery-3.6.0.min.js";
document.head.appendChild(scriptElement);

scriptElement.onload = function() {
    $(document).ready(function() {

        const initialize = () => {
            renderHtml();
            stylePage();
            setupEventListeners();
            fetchProducts();
        };

        const renderHtml = () => {
            // HTML içeriğini jQuery ile oluşturuyoruz
            const pageContent = `
                <h1>Ürün Listesi</h1>
                <div id="items-list"></div>
                <div id="detail-popup">
                    <h2 id="popup-header">Product Details</h2>
                    <p id="popup-description"></p>
                    <button id="closePopupButton">Kapat</button>
                </div>`;
            $('body').prepend(pageContent);
        };

        const stylePage = () => {
            // CSS stilini jQuery ile ekliyoruz
            $('<style>').html(`
                body {
                    font-family: 'Verdana', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: #e9f0f5;
                    height: 100vh;
                    margin: 0;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 25px;
                }
                #items-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    justify-content: center;
                }
                .item {
                    background: #fff;
                    border: 1px solid #ddd;
                    padding: 18px;
                    width: 220px;
                    text-align: center;
                    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
                    transition: transform 0.4s ease-in-out;
                    cursor: pointer;
                    border-radius: 12px;
                    box-sizing: border-box;
                    overflow: hidden;
                }
                .item:hover {
                    transform: scale(1.1);
                    background-color: #fafafa;
                }
                .item p em {
                    font-size: 12px;
                    color: #999;
                    font-style: italic;
                    margin-top: 5px;
                    display: block;
                }
                #detail-popup {
                    display: none;
                    position: fixed;
                    background: #fff;
                    font-size: 15px;
                    padding: 25px;
                    width: 45%;
                    border: 3px solid #007bff;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
                    z-index: 1000;
                    border-radius: 12px;
                    opacity: 0;
                    transition: opacity 0.4s ease-in-out;
                    text-align: center; /* Ortaya hizalama */
                }
                #detail-popup.show {
                    display: block;
                    opacity: 1;
                }
                #detail-popup h2 {
                    margin-top: 0;
                }
                #detail-popup #popup-description {
                    font-size: 14px;
                    font-weight: normal; /* Bold olmasını engelledik */
                    color: #333;
                    margin-top: 10px;
                    text-align: center; /* Ortaya hizalama */
                }
                #detail-popup button {
                    width: 100%;
                    height: 45px;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 17px;
                    margin-top: 12px;
                    background-color: #f44336;
                    color: white;
                }
                #detail-popup button:hover {
                    background-color: #c62828;
                }
            `).addClass('custom-style').appendTo('head');
        };

        const setupEventListeners = () => {
            // Pop-up'ı kapatmak için buton
            $('#closePopupButton').on('click', function() {
                $('#detail-popup').removeClass('show');
            });

            // Ürün tıklama
            $(document).on('click', '.item', function() {
                const itemId = $(this).data('id');
                displayPopup(itemId);
            });
        };

        const fetchProducts = () => {
            // products.json dosyasını yükleyip, ürünleri ekliyoruz
            $.getJSON('products.json', function(items) {
                items.forEach(function(item) {
                    const itemElement = `
                        <div class="item" data-id="${item.id}">
                            <h3>${item.name}</h3>
                            <p><em>Ürün detayları</em></p>
                            <p>${item.price}</p>
                            <a href="${item.link}" target="_blank">Ürün Linki</a>
                        </div>`;
                    $('#items-list').append(itemElement);
                });
            });
        };

        const displayPopup = (itemId) => {
            // Burada JSON'dan seçilen ürünü buluyoruz ve Pop-up içeriklerini güncelliyoruz
            $.getJSON('products.json', function(items) {
                const selectedItem = items.find(i => i.id === itemId);

                $('#popup-header').text(selectedItem.name);
                $('#popup-description').text(selectedItem.details);
                $('#detail-popup').addClass('show');
            });
        };

        initialize();
    });
};
