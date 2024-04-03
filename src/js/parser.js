const { getStatusText } = require('http-status-codes');
import statsDefault from './stats/default.js'

export default () => ({
  resetData() {
    this.$store.parse.urls = [];
    this.$store.parse.run = true;
    this.$store.stats = statsDefault();
  },
  parse() {
    this.resetData()
    this.$nextTick(() => {
      this.request(this.$store.parse.base_url).then(() => {
        this.$store.parse.run = false;
      });
    })
  },
  async request(url) {
    if (this.$store.parse.urls.length >= 10) {
      return;
    }

    let urlExist = this.$store.parse.urls
      .find((urlData) => urlData['url'] === url);

    if (urlExist) {
      return;
    }

    url = new URL(url);
    let domParser = new DOMParser();

    let data = {
      'url': url.href,
    };

    let htmlDoc = await fetch(url.href)
      .then(response => {
        data['status_code'] = response.status;
        try {
          data['status'] = getStatusText(response.status);
        }
        catch (e) {
          console.log(e);
          data['status'] = '';
        }
        data['headers'] = Object.fromEntries(response.headers);
        console.log(url.href, response);

        if (!this.$store.stats.summary.urls.hasOwnProperty(response.status)) {
          this.$store.stats.summary.urls[response.status] = 0;
        }

        this.$store.stats.summary.urls[response.status]++;

        if (data['headers'].hasOwnProperty('content-type')
          && data['headers']['content-type'].includes('text/html')) {
          return response.text();
        }
      })
      .then(response => {
        if (response) {
          let htmlDoc = domParser.parseFromString(response, 'text/html');
          data['title'] = htmlDoc.querySelector('title').text || '';
          data['meta'] = {};
          htmlDoc
            .querySelectorAll('meta')
            .forEach(el => {
              data['meta'][el.getAttribute('name')] = el.getAttribute('content') || '';
            })

          return htmlDoc;
        }
      })
      .finally(() => {
        this.$store.parse.urls.push(data)
        this.$store.stats.summary.urls.total++;
        console.log(data);
      })

    if (!!htmlDoc) {
      this.$store.stats.summary.html++;
      await this.findLinks(htmlDoc);
    }
  },
  /**
   * Find all link and request to link.
   *
   * @param {Document} html
   */
  async findLinks(html) {
    let baseUrl = new URL(this.$store.parse.base_url);
    for (const aEl of html.querySelectorAll('a[href], img')) {
      let href = aEl.getAttribute('href') ||
        aEl.getAttribute('src') || '';

      if (!!href) {
        if (href.indexOf('http') !== 0) {
          href = this.$store.parse.base_url.replace(/\/$/, "") + '/' + href.replace(/^\//, '');
        }

        let currentUrl = new URL(href);
        if (baseUrl.hostname === currentUrl.hostname) {
          href = href.split('#')[0];
          await this.request(href);
        }
      }
    }
  }
})
