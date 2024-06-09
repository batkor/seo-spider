const robotsParser  =  require('robots-parser') ;

export default () => ({
  parser: null,
  async getParser(url) {
    return new Promise(resolve => {
      if (this.parser) {
        resolve(this);
      }

      fetch(url)
        .then(result => result.text())
        .then(content => {
          this.parser = robotsParser(url, content);
          resolve(this);
        })
    })
  },
  isAllowed(url) {
    return this.parser.isAllowed(url);
  }
})
