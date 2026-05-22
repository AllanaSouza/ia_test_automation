const axios = require('axios');

async function inspect(url, selectors) {
  const response = await axios.get(url);
  console.log('---', url, '---');
  selectors.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(response.data))) {
      console.log(match[0]);
      if (pattern.lastIndex > 20000) break;
    }
    pattern.lastIndex = 0;
  });
}

(async () => {
  await inspect('https://automationexercise.com/products', [
    /data-qa="([^"]*)"/gi,
    /<input[^>]+name="([^"]*)"/gi,
    /<button[^>]+data-qa="([^"]*)"/gi,
  ]);
  await inspect('https://automationexercise.com/login', [
    /<input[^>]+data-qa="([^"]*)"/gi,
    /<button[^>]+data-qa="([^"]*)"/gi,
  ]);
  await inspect('https://automationexercise.com/contact_us', [
    /<input[^>]+data-qa="([^"]*)"/gi,
    /<textarea[^>]+name="([^"]*)"/gi,
    /<input[^>]+type="submit"/gi,
  ]);
})();
