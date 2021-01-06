import debug from 'debug';

class Logger {

  BASE = 'alkmp-front';
  COLOURS = {
    trace: 'blue',
    info: 'black',
    warn: 'orange',
    error: 'red'
  };
  SOURCE = this.constructor.name;

  init() {
    if (process.env.NODE_ENV !== 'production') {
      return localStorage.setItem('debug', this.BASE + ':*');
    }
    return localStorage.removeItem('debug');
  }

  setLogger(SOURCE) {
    this.SOURCE = SOURCE;
  }

  generateMessage(level, message) {
    // Set the prefix which will cause debug to enable the message
    const namespace = this.BASE + ':' + level;
    const createdDebug = debug(namespace);

    // Set the colour of the message based on the level
    createdDebug.color = this.COLOURS[level];

    createdDebug(this.SOURCE, message);
  }

  trace(message) {
    return this.generateMessage('trace', message);
  }

  info(message) {
    return this.generateMessage('info', message);
  }

  warn(message) {
    return this.generateMessage('warn', message);
  }

  error(message) {
    return this.generateMessage('error', message);
  }
}

export default new Logger();
