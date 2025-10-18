import logger from './logger.js';

class ErrorHandler {
  static handle(error, verbose = false) {
    if (error.code === 'EACCES') {
      logger.error('Permission denied. Try running in a different directory.');
    } else if (error.code === 'EEXIST') {
      logger.error(
        'Directory already exists. Choose a different name or remove the existing directory.'
      );
    } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      logger.error(
        'Network error. Check your internet connection and try again.'
      );
    } else if (error.message && error.message.includes('git')) {
      logger.error('Git error. Make sure Git is installed and try again.');
    } else {
      logger.error(`Error: ${error.message}`);
    }

    if (verbose) {
      console.error('\nStack trace:');
      console.error(error);
    }

    logger.info(
      '\nFor help, visit: https://quickship.dev/docs/troubleshooting'
    );
  }

  static async wrapAsync(fn, errorMessage, verbose = false) {
    try {
      return await fn();
    } catch (error) {
      logger.error(errorMessage);
      this.handle(error, verbose);
      throw error;
    }
  }
}

export default ErrorHandler;
