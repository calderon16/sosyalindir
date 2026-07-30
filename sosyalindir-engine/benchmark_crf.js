const fs = require('fs');
const { execSync } = require('child_process');

async function run() {
  const sourceFile = "test_source.mp4";
  const out26 = "test_crf26.mp4";
  const out28 = "test_crf28.mp4";

  console.log("Dummy video oluşturuluyor (10 saniye)...");
  if (!fs.existsSync(sourceFile)) {
    // Generate 10 seconds of random noise video
    execSync(`ffmpeg -loglevel error -y -f lavfi -i testsrc=duration=10:size=1280x720:rate=30 -f lavfi -i sine=frequency=1000:duration=10 -c:v libx264 -preset ultrafast -c:a aac ${sourceFile}`);
  }
  
  console.log("CRF 26 ölçülüyor...");
  if(fs.existsSync(out26)) fs.unlinkSync(out26);
  const start26 = Date.now();
  execSync(`ffmpeg -loglevel error -nostats -i ${sourceFile} -map 0:v:0 -map 0:a:0? -c:v libx264 -preset ultrafast -crf 26 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart ${out26}`);
  const time26 = Date.now() - start26;

  console.log("CRF 28 ölçülüyor...");
  if(fs.existsSync(out28)) fs.unlinkSync(out28);
  const start28 = Date.now();
  execSync(`ffmpeg -loglevel error -nostats -i ${sourceFile} -map 0:v:0 -map 0:a:0? -c:v libx264 -preset ultrafast -crf 28 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart ${out28}`);
  const time28 = Date.now() - start28;

  const sizeOriginal = fs.statSync(sourceFile).size;
  const size26 = fs.statSync(out26).size;
  const size28 = fs.statSync(out28).size;

  console.log("--- SONUÇLAR ---");
  console.log(`Orijinal: ${(sizeOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`CRF 26: ${(time26/1000).toFixed(2)}s | ${(size26 / 1024 / 1024).toFixed(2)} MB`);
  console.log(`CRF 28: ${(time28/1000).toFixed(2)}s | ${(size28 / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Süre Farkı: %${((time26 - time28) / time26 * 100).toFixed(1)} daha hızlı`);
}

run().catch(console.error);
