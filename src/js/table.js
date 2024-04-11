import filter from './filter.js'

export default () => ({
  ...filter(),
  sortColumns() {
    this.$store.main.table_columns.sort((a, b) => a.weight <= b.weight)
  },
  getColumns() {
    this.sortColumns();

    return this.$store.main.table_columns.filter(el => el.show)
  },
  getHeaders() {
    return this.getColumns().map(el => el.label);
  },
  getColumnClasses(index) {
    let output = 'col';

    if (!this.$store.main.table_columns.hasOwnProperty(index)) {
      return output;
    }

    let item = this.$store.main.table_columns[index];

    return [
      output,
      item.hasOwnProperty('id') ? output + '-' + item.id : '',
    ];
  },
  getRowClasses(item) {
    return [
      'table-row',
      'status-' + item.status_code,
      item.status_code === 404 ? 'table-danger' : ''
    ];
  },
  getValue(data, path) {
    let keys = path.split('.')
    let output = data;

    for(let key of keys) {
      output = output[key] ?? '';
    }

    return output;
  },
})
