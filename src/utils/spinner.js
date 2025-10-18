import ora from 'ora';

class Spinner {
  constructor() {
    this.spinner = null;
  }

  start(text) {
    this.spinner = ora(text).start();
    return this;
  }

  succeed(text) {
    if (this.spinner) {
      this.spinner.succeed(text);
    }
    return this;
  }

  fail(text) {
    if (this.spinner) {
      this.spinner.fail(text);
    }
    return this;
  }

  update(text) {
    if (this.spinner) {
      this.spinner.text = text;
    }
    return this;
  }

  stop() {
    if (this.spinner) {
      this.spinner.stop();
    }
    return this;
  }
}

export default Spinner;
