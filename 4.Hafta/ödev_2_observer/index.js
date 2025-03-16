// appendLocation değişkeni, verilerin ekleneceği elementi seçer.
const appendLocation = $('#userDisplayArea');

// Dinamik HTML oluşturma
const body = $(document.body);

// Ana konteyner 
const container = $('<div>', { id: 'mainContainer' });
body.append(container);

// Başlık 
const title = $('<h1>', { text: 'Dinamik Kullanıcı Yönetimi' });
container.append(title);

// Araç çubuğu (Toolbar) oluşturuldı
const toolbar = $('<div>', { id: 'toolbar' });
container.append(toolbar);

// Arama kutusu eklendi
const searchInput = $('<input>', {
    placeholder: 'Kullanıcı Ara...',
    id: 'searchInput'
});
toolbar.append(searchInput);

// A-Z ve Z-A sıralama butonları
const sortAscBtn = $('<button>', { text: 'A-Z Sırala' });
const sortDescBtn = $('<button>', { text: 'Z-A Sırala' });
toolbar.append(sortAscBtn, sortDescBtn);

// Kullanıcıların görüntüleneceği alan
const displayArea = $('<div>', { id: 'userDisplayArea' });
container.append(displayArea);

// Stil ayarları ekleniyor
const applyDynamicStyles = () => {
    const style = $('<style>').html(`
        body { font-family: Arial, sans-serif; background-color: #e0f7fa; margin: 0; padding: 20px; }
        #mainContainer { max-width: 600px; margin: auto; padding: 20px; }
        h1 { text-align: center; color: #00796b; }
        #toolbar { margin-bottom: 15px; display: flex; gap: 10px; justify-content: center; }
        #userDisplayArea { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        .userItem { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #ddd; }
        .userItem:last-child { border-bottom: none; }
        .userItem button { background-color: #d32f2f; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; transition: background-color 0.3s; }
        .userItem button:hover { background-color: #f44336; }
        .reload-button { background-color: #2ed573; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 10px; transition: background-color 0.3s; }
        .reload-button:hover { background-color: #7bed9f; }
    `);
    $('head').append(style);
};

applyDynamicStyles();

// localStorage'dan verileri çekme ve expire kontrolü
const getStoredUsers = () => {
    const storedData = localStorage.getItem('persistentUsers');
    if (!storedData) return null;

    const { users, expire } = JSON.parse(storedData);
    if (expire && Date.now() > expire) {
        localStorage.removeItem('persistentUsers');
        return null;
    }
    return users;
};

// localStorage'a verileri kaydetme ve expire süresi ekleme
const setStoredUsers = (users, expireInMinutes = 5) => {
    const expire = Date.now() + expireInMinutes * 60 * 1000; // 5 dakika sonra expire olacak
    localStorage.setItem('persistentUsers', JSON.stringify({ users, expire }));
};

let userList = getStoredUsers() || [];
let filteredUsers = [...userList];

// Kullanıcı listesini gösteren fonksiyon
const gosterKullaniciListesi = () => {
    displayArea.empty();
    filteredUsers.forEach((user, idx) => {
        const userDiv = $('<div>').addClass('userItem');

        // Kullanıcı ismi ve silme butonu ekleniyor
        const nameSpan = $('<span>').text(`${idx + 1}. ${user}`);
        const removeBtn = $('<button>').text('Sil').on('click', () => silKullanici(idx));

        userDiv.append(nameSpan, removeBtn);
        displayArea.append(userDiv);
    });

    // Eğer kullanıcı yoksa, yeniden yükleme butonunu göster
    if (filteredUsers.length === 0) {
        const reloadButton = $('<button>').addClass('reload-button').text('Kullanıcıları Yeniden Yükle');
        reloadButton.on('click', () => yenidenYukleKullaniciListesi(true));
        displayArea.append(reloadButton);

        // MutationObserver ile yeniden yükleme butonunu izle
        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    console.log('Yeniden yükleme butonu görünür oldu.');
                }
            });
        });

        observer.observe(displayArea[0], { childList: true });
    }
};

// Kullanıcı silme fonksiyonu
const silKullanici = (index) => {
    userList.splice(index, 1);
    filteredUsers = [...userList];
    setStoredUsers(userList); // localStorage'a güncellenmiş listeyi kaydet
    gosterKullaniciListesi();
};

// Yeniden yükleme fonksiyonu
const yenidenYukleKullaniciListesi = async (isButtonClick = false) => {
    if (isButtonClick && sessionStorage.getItem('loadAttempt')) {
        alert('Bu buton sadece bir kez kullanılabilir!');
        return;
    }

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();

        // JSON verilerinden sadece isimler alınır
        userList = data.map(user => user.name);
        filteredUsers = [...userList];

        setStoredUsers(userList); // localStorage'a yeni listeyi kaydet
        
        // Sadece buton tıklaması ile çağrıldığında session storage'a kaydet
        if (isButtonClick) {
            sessionStorage.setItem('loadAttempt', 'done');
        }
        
        gosterKullaniciListesi();
    } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error);
    }
};

// Arama kutusu için filtreleme fonksiyonu
const filtreleKullanicilar = () => {
    const searchTerm = searchInput.val().toLowerCase();
    filteredUsers = userList.filter(user => user.toLowerCase().includes(searchTerm));
    gosterKullaniciListesi();
};

// Sıralama fonksiyonu
const siralaKullanicilar = (isAscending) => {
    filteredUsers.sort((a, b) => isAscending ? a.localeCompare(b) : b.localeCompare(a));
    gosterKullaniciListesi();
};

// Event listener'lar
searchInput.on('input', filtreleKullanicilar);
sortAscBtn.on('click', () => siralaKullanicilar(true));
sortDescBtn.on('click', () => siralaKullanicilar(false));

// Sayfa yüklendiğinde kullanıcı listesini göster
if (userList.length === 0 && !sessionStorage.getItem('loadAttempt')) yenidenYukleKullaniciListesi(false);
else gosterKullaniciListesi();