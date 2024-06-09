const { getStatusText } = require('http-status-codes');
import statsDefault from '../stats.js'
import indexable from './indexable.js'

window.IndexCheck = indexable();

export default () => ({
  base_url: false,
  resetData() {
    this.$store.parse.urls = [];
    this.$store.parse.run = true;
    this.base_url = false;
    this.$store.stats = statsDefault();
  },
  /**
   * Returns URL object or false.
   *
   * @returns {boolean|URL}
   */
  getBaseUrl() {
    if (this.base_url) {
      return this.base_url;
    }

    this.base_url = new URL(this.$store.parse.base_url);

    return this.base_url;
  },
  parse() {
    if (this.$store.parse.run) {
      this.$store.parse.run = false;
      return;
    }

    this.resetData()
    this.$nextTick(() => {
      this.request(this.getBaseUrl().href).then(() => {
        this.$store.parse.run = false;
      });
    })
  },
  async request(url) {
    if (this.$store.parse.urls.length >= 450 || this.$store.parse.run === false) {
      return;
    }

    let urlExist = this.$store.parse.urls
      .find((urlData) => urlData['url'] === url);

    if (urlExist) {
      return;
    }

    url = new URL(url);

    if (url.host === this.getBaseUrl().host) {
      this.$store.stats.summary.internal++;
    }
    else {
      this.$store.stats.summary.external++;
    }

    let domParser = new DOMParser();

    let data = {
      'url': url.href,
    };
    let startFetch = Date.now();
    IndexCheck
      .getParser(this.$store.parse.base_url.replace(/\/$/, "") + '/robots.txt')
      .then(checker => {
        data['indexable'] = {
          'robots': checker.isAllowed(url),
        };
      })
    let htmlDoc = await fetch(url.href)
      .then(response => {
        let endFetch = new Date(Date.now() - startFetch);
        data['request_time'] = endFetch.getSeconds() + '.' + endFetch.getMilliseconds();
        data['status_code'] = response.status;
        try {
          if (response.redirected) {
            data['status_code'] = data['status'] = 301;
          }
          else {
            data['status'] = getStatusText(response.status);
          }
        }
        catch (e) {
          console.log(e);
          data['status'] = '';
        }
        data['headers'] = Object.fromEntries(response.headers);

        if (!this.$store.stats.summary.urls.hasOwnProperty(data['status_code'])) {
          this.$store.stats.summary.urls[data['status_code']] = 0;
        }

        this.$store.stats.summary.urls[data['status_code']]++;
        if (data['status'] !== 301 && data['headers'].hasOwnProperty('content-type')) {
          if (data['headers']['content-type'].includes('text/html')) {
            return response.text();
          }

          if (data['headers']['content-type'].includes('text/css')) {
            this.$store.stats.summary.css++;
          }

          if (data['headers']['content-type'].includes('javascript')) {
            this.$store.stats.summary.js++;
          }

          if (data['headers']['content-type'].includes('image')) {
            this.$store.stats.summary.image++;
          }
        }
      })
      .then(response => {
        if (response) {
          let htmlDoc = domParser.parseFromString(response, 'text/html');
          data['title'] = htmlDoc.querySelector('title').text || '';
          data['meta'] = this.findMeta(htmlDoc);
          data['link'] = this.findLinkTags(htmlDoc);
          data['indexable']['meta'] = !htmlDoc.querySelector('meta[content="noindex"]')

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
   * Find all link tags data.
   *
   * @param {Document} html
   */
  findLinkTags(html) {
    let output = {};
    html
      .querySelectorAll('link:not([rel="stylesheet"])')
      .forEach(el => {
        let key = el.getAttribute('rel');
        let href = el.getAttribute('href');

        if (!output.hasOwnProperty(key)) {
          output[key] = [href];
        }
        else {
          output[key].push(href)
        }
      })

    return output;
  },
  /**
   * Find all meta data.
   *
   * @param {Document} html
   */
  findMeta(html) {
    let meta = {};
    html
      .querySelectorAll('meta')
      .forEach(el => {
        if (el.hasAttribute('charset')) {
          meta['charset'] = el.getAttribute('charset') || '';
          return;
        }
        let key = el.getAttribute('name') || el.getAttribute('property');
        meta[key] = el.getAttribute('content') || '';
      })

    return meta;
  },
  /**
   * Find all link and request to link.
   *
   * @param {Document} html
   */
  async findLinks(html) {
    let baseUrl = new URL(this.$store.parse.base_url);
    for (const aEl of html.querySelectorAll('a[href], img, link[rel="stylesheet"], script[src]')) {
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
