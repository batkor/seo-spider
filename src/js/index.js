import Alpine from 'alpinejs'
import table from './table.js'
import parser from './parser/index.js'
import statsDefault from './stats.js'
import singleStat from './single_stat.js'

Alpine.data('table', table)
Alpine.data('parser', parser)
window.Alpine = Alpine
Alpine.store('parse', {
  base_url: 'https://druki.ru/',
  run: false,
  urls: [],
});

Alpine.store('stats', statsDefault());
Alpine.store('single_stat', singleStat());

Alpine.start();
