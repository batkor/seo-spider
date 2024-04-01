import Alpine from 'alpinejs'
import table from './table.js'
import parser from './parser.js'

Alpine.data('table', table)
Alpine.data('parser', parser)
window.Alpine = Alpine
Alpine.store('parse', {
  base_url: 'https://druki.ru/',
  run: false,
  urls: [],
});

Alpine.store('stats', {
  summary: {
    urls: {
      total: 0
    },
    html: 0,
    js: 0,
    image: 0,
  },
});

Alpine.store('main', {
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
  ],
});

Alpine.start()
