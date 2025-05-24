//HTML'den gerekli ögeler alınır.
const baslatBtn = document.getElementById('baslatButonu');
const nasilOynanirBtn = document.getElementById('nasilOynanir');
const baslangicEkrani = document.getElementById('baslangicEkrani');
const container = document.querySelector('.container');
const canvas = document.getElementById('cizimTahtasi');
const ctx = canvas.getContext('2d');
const renkInput = document.getElementById('renk');
const kalinlikInput = document.getElementById('kalinlik');
const temizleBtn = document.getElementById('temizle');
const soruAlani = document.getElementById('soruAlani');
const yonergelerAlani = document.getElementById('yonergelerAlani');
const oncekiBtn = document.getElementById('oncekiYonergeBtn');
const sonrakiBtn = document.getElementById('sonrakiYonergeBtn');
const tahminInput = document.getElementById('tahminInput');
const tahminBtn = document.getElementById('tahminKontrolBtn');
const sonucAlani = document.getElementById('sonucAlani');
const puanAlani = document.getElementById('puanAlani');
const zamanSayaci = document.getElementById('zamanSayaci');
const sonrakiSoruBtn = document.getElementById('sonrakiSoruBtn');

//Oyunla ilgili değişkenler tanımlanır
let kalinlik = 5;
let ciziyor = false;
let zaman = 60;
let timer;
let toplamPuan = 0;
let tahminSayisi = 0;
const maxTahmin = 3;

//Soru ve yönergeler tanımlanır.
const sorular = [
    {cevap:"ayı", yonergeler:["Yuvarlak çiz", "Üst iki tarafa iki yuvarlak daha çiz", "Büyük yuvarlağın içine iki adet yuvarlak çiz"]},
    {cevap:"araba", yonergeler:["Dikdörtgen çiz", "Altına iki daire çiz", "Üstüne küçük bir dikdörtgen çiz"]},
    {cevap:"tren", yonergeler:["Arka arkaya üç dikdörtgen çiz", "Her birinin altına iki yuvarlak tekerlek çiz", "Ön kısmına baca ekle"]},
    {cevap:"güneş", yonergeler:["Ortaya büyük bir yuvarlak çiz", "Yuvarlağın etrafına çizgiler çiz", "Yuvarlağı sarıya boya"]},
    {cevap:"kedi", yonergeler:["Büyük bir yuvarlak çiz", "Üstüne iki üçgen çiz", "Yuvarlağın içinin üst tarafına iki küçük yuvarlak, yanlarına üçer çizgi çiz"]},
    {cevap:"uçurtma", yonergeler:["Dörtgen çiz", "Üstüne iki çizgi çiz", "Altından ip çiz"]},
    {cevap:"bisiklet", yonergeler:["İki büyük yuvarlak çiz", "Ortalarına küçük yuvarlak çiz", "İki yuvarlağı çizgi ile bağla"]},
    {cevap:"kitap", yonergeler:["Dikdörtgen çiz", "Ortadan ikiye ayır", "Sayfaları belirtmek için çizgiler çiz"]},
    {cevap:"çiçek", yonergeler:["Ortaya küçük yuvarlak çiz", "Etrafına yapraklar çiz", "Yaprakları renklendir"]},
    {cevap:"ev", yonergeler:["Kare çiz", "Üstüne üçgen çatı çiz", "Kapı ve pencere ekle"]},
    {cevap:"kule", yonergeler:["Dikdörtgen çiz", "Üstüne küçük üçgenler çiz", "Pencereler çiz"]},
]

let aktifSoru = 0;
let aktifYonerge = 0;

//Canvas başlatılıt ve ayarları yapılır.
function canvasAyarla() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = (window.innerWidth - 40) * dpr;
    canvas.height = 400 * dpr;
    canvas.style.width = (window.innerWidth - 40) + 'px';
    canvas.style.height = '400px';
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.strokeStyle = renkInput.value;
    ctx.lineWidth = kalinlik;
}


window.addEventListener('resize', canvasAyarla);
canvasAyarla();

//Başlat butonu ile oyun başlatılır.
baslatBtn.onclick = function() {
    baslangicEkrani.style.display = 'none';
    container.style.display = 'flex';
    zaman = 60;
    toplamPuan = 0;
    aktifSoru = 0;
    aktifYonerge = 0;
    tahminSayisi = 0;
    puanAlani.textContent = 'Toplam Puan: 0';
    zamanSayaci.textContent = `Süre: ${zaman}s`;
    soruGoster();
    zamanBaslat();
    temizleCanvas();
    tahminBtn.disabled = false;
    sonucAlani.textContent = '';
};

//Mevcut sorunun yönergesi gösterilir.
function soruGoster() {
    const soru = sorular[aktifSoru];
    yonergelerAlani.textContent = "Yönerge: " + soru.yonergeler[aktifYonerge];
    tahminSayisi = 0;
    sonucAlani.textContent = '';
    tahminBtn.disabled = false;
}

//Zamanlayıcı başlatılır.
function zamanBaslat() {
    clearInterval(timer);
    timer = setInterval(() => {
      zaman--;
      zamanSayaci.textContent = `Süre: ${zaman}s`;
      if (zaman <= 0) {
        clearInterval(timer);
        alert('Süre doldu! Sonraki soruya geçiliyor.');
        sonrakiSoru();
      }
    }, 1000);
}

//Butona basıldığında çizim tahtasını temizleyecek olan fonksiyon.
temizleBtn.onclick = temizleCanvas;
function temizleCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//Renk ve kalınlık değişkenlerini ayarlayan fonksiyon
renkInput.onchange = () => ctx.strokeStyle = renkInput.value;
kalinlikInput.onchange = () => {
    kalinlik = Number(kalinlikInput.value);
    ctx.lineWidth = kalinlik;
};

//Kullanıcı mousea tıkladığında çalışmaya başlar
canvas.onmousedown = function(e) {
    ciziyor = true; //Kullanıcının çizime başladığını belirtir
    ctx.beginPath(); //Yeni bir çizim yolu başlatır
    ctx.moveTo(e.offsetX, e.offsetY); //Çizimin nereden başlayacağını belirtir.
};

//Kullanıcı mouseu bıraktığında çizim biter
canvas.onmouseup = function() {
    ciziyor = false; //Kullanıcının çizimi bitirdiğini belirtir.
    ctx.beginPath(); //Çizimi durdurur
};

//Kullanıcı mouseu hareket ettirdiğinde çalışır
canvas.onmousemove = function(e) {
    if (!ciziyor) return; //sadece mousea basıldığında çalışır.
    ctx.lineTo(e.offsetX, e.offsetY); //Mevcut konumdan fare konumuna doğru bir çizgi çizer
    ctx.stroke(); //Çizgiyi ekranda görünür hale getirir.
};

//Sonraki yönergeye geçişi sağlar
sonrakiBtn.onclick = function() {
    if (aktifYonerge < sorular[aktifSoru].yonergeler.length - 1) {
        aktifYonerge++;
        soruGoster();
    }
};

//Önceki yönergeye geçişi sağlar
oncekiBtn.onclick = function() {
    if (aktifYonerge > 0) {
        aktifYonerge--;
        soruGoster();
    }
};

//Sonraki soruya geçişi sağlar
function sonrakiSoru() {
    tahminSayisi = 0;
    tahminBtn.disabled = false;
    aktifSoru++;
    
    if (aktifSoru >= sorular.length) { //Sorular bitince puanı yazar ve oyunu yeniden başlatır
        alert(`Oyun bitti! Toplam puanınız: ${toplamPuan}`);
        clearInterval(timer);
        location.reload(); 
        return;
    }

    aktifYonerge = 0;
    zaman = 60;
    zamanSayaci.textContent = `Süre: ${zaman}s`;
    soruGoster();
    temizleCanvas();
    clearInterval(timer);
    zamanBaslat();
}

sonrakiSoruBtn.onclick = sonrakiSoru;

//Nasıl oynanır pencerisinin açılması ve kapanması
document.addEventListener("DOMContentLoaded", () => {
    const nasilOynanirBtn = document.getElementById("nasilOynanir");
    const kurallarPenceresi = document.getElementById("kurallarPenceresi");
    const kapatBtn = document.getElementById("kapat");

    nasilOynanirBtn.addEventListener("click", () => {
        kurallarPenceresi.style.display = "block";
    });

    kapatBtn.addEventListener("click", () => {
        kurallarPenceresi.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target == kurallarPenceresi) {
            kurallarPenceresi.style.display = "none";
        }
    });
});

//Ses dosyaları
const arkaPlanMuzik = new Audio('./sounds/backgroundMusic.mp3');
const dogruSes = new Audio('./sounds/correct.mp3');
const yanlisSes = new Audio('./sounds/wrong.mp3');

arkaPlanMuzik.loop = true;
arkaPlanMuzik.volume = 0.5;


let muzikAcik = true;

//Oyunu başlatınca müziği başlat
    document.getElementById('baslatButonu').addEventListener('click', () => {
    arkaPlanMuzik.play();
    document.querySelector('.container').style.display = 'block';
    document.getElementById('baslangicEkrani').style.display = 'none';
});

//Ses aç kapat kontrol butonu
document.getElementById('sesKontrolBtn').addEventListener('click', () => {
    muzikAcik = !muzikAcik;
    if (muzikAcik) {
        arkaPlanMuzik.play();
        document.getElementById('sesKontrolBtn').textContent = '🔊';
    } else {
        arkaPlanMuzik.pause();
        document.getElementById('sesKontrolBtn').textContent = '🔇';
    }
});

//Tamin kontrol işlemi
tahminBtn.onclick = function() {
    const tahmin = tahminInput.value.trim().toLowerCase();
    const dogruCevap = sorular[aktifSoru].cevap.toLowerCase();

    if (tahmin === "") {
        alert('Lütfen tahmininizi yazınız.');
        return;
    }

    if (tahmin === dogruCevap) {
        dogruSes.play();
        const alinanPuan = 15;
        const bonusPuan = Math.floor(zaman * 0.2);

        toplamPuan += alinanPuan + bonusPuan;
        puanAlani.textContent = 'Toplam Puan: ' + toplamPuan;
        sonucAlani.textContent = `Doğru! +${alinanPuan} +${bonusPuan} (bonus) puan kazandınız.`;

        sonrakiSoru();
    } 
    else {
        yanlisSes.play();
        toplamPuan -= 5;
        if (toplamPuan < 0) toplamPuan = 0;
        puanAlani.textContent = 'Toplam Puan: ' + toplamPuan;

        tahminSayisi++;
        if (tahminSayisi >= maxTahmin) {
            sonucAlani.textContent = `Tahmin hakkınız bitti! Doğru cevap: ${dogruCevap}`;
            tahminBtn.disabled = true;
        } else {
            sonucAlani.textContent = `Yanlış tahmin! Kalan tahmin hakkı: ${maxTahmin - tahminSayisi}`;
        }
    }

    tahminInput.value = "";
};