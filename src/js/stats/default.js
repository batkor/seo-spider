export default () => ({
  summary: {
    urls: {
      total: 0
    },
    html: 0,
    css: 0,
    js: 0,
    image: 0,
    internal: 0,
    external: 0,
  },
  totalUrls() {
    return this.summary.urls.total || 0;
  },
  responseCodeItems() {
    let output = [];

    for (let key in this.summary.urls) {
      if (key !== 'total') {
        for (let i = 2; i <= 5; i++) {
          if (key.indexOf(i.toString()) !== -1) {
            let index = i + 'xx';
            output[index] = output[index] || 0 + this.summary.urls[key];
          }
        }
      }
    }

    return output;
  }
})
