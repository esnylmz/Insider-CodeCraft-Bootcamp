
const API_URL = 'https://jsonplaceholder.typicode.com/users';
const STRG_KEY = 'userData';


//kullanıcıları göstermek için
const showUsers = users =>{
    const userContainer =document.getElementById('ins-api-users');
    userContainer.innerHTML='';

    users.forEach(user=>{
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');

        userCard.innerHTML=`
        <h2>${user.name}</h2>
        <p>Email: ${user.email}</p>
        <p>Şehir:${user.address.city}</p>
        <button class="delete-btn" data-id="${user.id}">Kullanıcıyı Sil</button>
        `;

        userContainer.appendChild(userCard);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => deleteUser(button.dataset.id));
    });
    
};

//local storage
const saveToLocal=users=>{
    const data={
        users,
        timestamp: Date.now()
    };
    localStorage.setItem(STRG_KEY, JSON.stringify(data));
};

//localden kullanıcıları al
const getFromLocal = () => {
    try {
        const data = JSON.parse(localStorage.getItem(STRG_KEY));
        if (data) {
            const anlık = Date.now();
            const bir_gun = 86400000; // 1 gün
            return (anlık - data.timestamp < bir_gun) ? data.users : null;
        }
    } catch (error) {
        console.error("localStorage veri çözümleme hatası:", error);
    }
    return null;
};
const getUsers = () => {
    return new Promise((resolve, reject) => {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("API'dan veri çekilemedi");
                }
                return response.json();
            })
            .then(users => {
                saveToLocal(users); // local storage'a kaydet
                resolve(users); // promise resolve
            })
            .catch(error => {
                reject(error); // promise reject
            });
    });
};


//Kullanıcıyı silmek için
const deleteUser = (id) => {
    let users = getFromLocal();
    if (users) {
        users = users.filter(user => user.id !== parseInt(id));
        saveToLocal(users);
        showUsers(users);
    } else {
        alert("Silinecek kullanıcı bulunamadı.");
    }
};
const initApp = () => {
    const users = getFromLocal();

    if (users) {
        showUsers(users); //Eğer şart sağlanıyorsa localstorage'dan kullanıcıları getir
    } else {
        getUsers()
            .then(users => showUsers(users)) // API'den aldığı kullanıcıları getir
            .catch(error => alert(`Hata: ${error.message}`)); // Hata mesajını göster
    }
};


// CSS Kısmı
const addStyles = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        #ins-api-users {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            padding: 20px;
        }
        .user-card {
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 10px;
            width: 300px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
        }
        .user-card:hover {
            transform: scale(1.05);
        }
        .delete-btn {
            background-color: #ff4d4d;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
        }
        .delete-btn:hover {
            background-color: #ff1a1a;
        }
        
    `;
    document.head.appendChild(style);
};

// App ve stilleri başlat
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    addStyles();
});