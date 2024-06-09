import filter from './filter.js'

export default () => ({
  ...filter(),
  sortColumns() {
    this.table_columns.sort((a, b) => a.weight <= b.weight)
  },
  getColumns() {
    this.sortColumns();

    return this.table_columns.filter(el => el.show)
  },
  getHeaders() {
    return this.getColumns().map(el => el.label);
  },
  getColumnClasses(index) {
    let output = 'col';

    if (!this.table_columns.hasOwnProperty(index)) {
      return output;
    }

    let item = this.table_columns[index];

    return [
      output,
      item.hasOwnProperty('id') ? output + '-' + item.id : '',
    ];
  },
  getRowClasses(item) {
    return [
      'table-row',
      'pe-pointer',
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
  table_columns: [
    {
      id: 'delta',
      label: '№',
      show: true,
      weight: 0,
    },
    {
      id: 'url',
      label: 'URL',
      show: true,
      weight: 1,
      value_path: 'url',
    },
    {
      id: 'content_type',
      label: 'Content Type',
      show: true,
      weight: 2,
      value_path: 'headers.content-type',
    },
    {
      id: 'status_code',
      label: 'Status Code',
      show: true,
      weight: 3,
      value_path: 'status_code',
    },
    {
      id: 'status',
      label: 'Status',
      show: true,
      weight: 4,
      value_path: 'status',
    },
    {
      id: 'charset',
      label: 'Charset',
      show: true,
      weight: 4,
      value_path: 'meta.charset',
    },
    {
      id: 'title',
      label: 'Title',
      show: true,
      weight: 5,
      value_path: 'title',
    },
    {
      id: 'description',
      label: 'Description',
      show: true,
      weight: 6,
      value_path: 'meta.description',
    },
    {
      id: 'request_time',
      label: 'Time',
      show: true,
      weight: 7,
      value_path: 'request_time',
    },
    {
      id: 'canonical',
      label: 'Canonical',
      show: true,
      weight: 8,
      value_path: 'link.canonical.0',
    },
  ],
})
