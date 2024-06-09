export default () => ({
  active_code: 'total',
  code_filters: [],
  resetFilters() {
    this.active_code = 'total';
    document
      .querySelectorAll('.table-row')
      .forEach(el => el.classList.toggle('visually-hidden', false))
  },
  getCodeFilters() {
    for (let key in this.$store.stats.summary.urls) {
      let i = this.code_filters.findIndex(el => el.key === key);
      if (i === -1) {
        this.code_filters.push({
          label: key === 'total' ? 'Все': key,
          alt: key === 'total' ? 'Показать все страницы': 'Показать только ' + key + ' страницы',
          key: key,
          count: this.$store.stats.summary.urls[key],
        });
      }
      else {
        this.code_filters[i].count = this.$store.stats.summary.urls[key];
      }
    }

    return this.code_filters.sort((a, b) => a.key === 'total' ? -1 : a.key - b.key);
  },
  byUrl(e) {
    if (!!!e.target.value) {
      document
        .querySelectorAll('.table-row')
        .forEach(el => el.classList.toggle('visually-hidden', false));
    }
    let q = e.target.value.replace(/ +/g, ' ').toLowerCase();
    document
      .querySelectorAll('.table-row .col-url .cell-content')
      .forEach(el => {
        el
          .closest('.table-row')
          .classList
          .toggle('visually-hidden', el.innerText.trim().indexOf(q) === -1);
    })
  },
  byCode(value) {
    let selector = '.table-row.status-' + value;
    if (value === '2xx') {
      selector = '[class*="status-2"]'
    }
    else if (value === '3xx') {
      selector = '[class*="status-3"]'
    }
    else if (value === '4xx') {
      selector = '[class*="status-4"]'
    }
    else if (value === '5xx') {
      selector = '[class*="status-5"]'
    }
    let rows = document.querySelectorAll('.table-row');
    rows.forEach(el => {
      if (value !== 'total') {
        el.classList.toggle('visually-hidden', !el.matches(selector));
      }
      else {
        el.classList.toggle('visually-hidden', false);
      }
    });
    this.active_code = value;
  },
  byContentType(value) {
    let cells = document.querySelectorAll('.table-row .col-content_type .cell-content');
    cells.forEach(el => {
      el
        .closest('.table-row')
        .classList
        .toggle('visually-hidden', el.innerText.indexOf(value) === -1);
    });
    this.active_code = '';
  }
})
