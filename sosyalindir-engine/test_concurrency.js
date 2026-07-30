const axios = require('axios');

const urls = [
  "https://www.facebook.com/facebook/videos/10153231379946729/",
  "https://www.facebook.com/facebook/videos/10153231379946729/",
  "https://www.facebook.com/facebook/videos/10153231379946729/"
];

async function run() {
  console.log("3 istek aynı anda gönderiliyor...");
  
  const promises = urls.map(url => {
    const start = Date.now();
    return axios.get("http://localhost:4000/resolve", { params: { url }, timeout: 300000 })
      .then(res => {
        const time = Date.now() - start;
        console.log(`✅ Başarılı: ${url} (${time}ms)`);
      })
      .catch(err => {
        const time = Date.now() - start;
        console.error(`❌ Hata: ${url} (${time}ms) - ${err.message}`);
      });
  });

  await Promise.all(promises);
  console.log("Tüm istekler tamamlandı.");
}

run();
