import { Listr } from 'listr2';
export { Listr };

// No-op spinner — listr2 owns the terminal during scaffold.
// Internal methods in template-manager / git-manager call this;
// silencing them prevents interleaved output with listr2's renderer.
class Spinner {
  start() {
    return this;
  }
  succeed() {
    return this;
  }
  fail() {
    return this;
  }
  update() {
    return this;
  }
  stop() {
    return this;
  }
  info() {
    return this;
  }
}

export default Spinner;
