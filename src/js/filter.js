export default () => ({
  active_code: 'total',
  code_filters: [],
  getCodeFilters() {
    for (let key in this.$store.stats.summary.urls) {
      let i = this.code_filters.findIndex(el => el.key === key);
      if (i === -1) {
        this.code_filters.push({
          label: key === 'total' ? 'Все': key,
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
  byCode(value) {
    let rows = document.querySelectorAll('.table-row');
    rows.forEach(el => {
      if (value !== 'total') {
        el.classList.toggle('visually-hidden', !el.matches('.table-row.status-' + value));
      }
      else {
        el.classList.toggle('visually-hidden', false);
      }
    });
    this.active_code = value;
  }
})
