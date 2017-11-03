const SerialPort = require('serialport');
const EventEmitter = require('events');
const Readline = SerialPort.parsers.Readline;

class KegScale extends EventEmitter {

  constructor ({
    path, 
    baudRate, 
    capacity = 0, 
    name, 
    sensitivity = 0.035, 
    initialized = false, 
    tareOnInit = false
  }) {
    super()
    this.port = SerialPort(path, {baudRate}, () => {
      if (!this.state.initialized) {
        if (this.tareOnInit){
          this.tareScale()
        } 
        this.emit('init', this.setState({initialized: true}))
      }
    })

    this.parser = this.port.pipe(new Readline({ delimiter: '\r\n' }));
    this.sensitivity = sensitivity
    this.tareOnInit = tareOnInit

    this.state = {
      capacity: capacity,
      name: name,
      pouring: false,
      weight: capacity,
      initialized,
      temperature: 0
    }
  }

  setState(state) {
    return this.state = Object.assign({}, this.state, state)
  }

  shouldScaleUpdate (nextState) {
    // don't allow weight to be a negative number
    // maybe make this happen in openscale software?
    nextState.weight = (nextState.weight < 0) ? 0 : nextState.weight

    const weightChanged = (Math.abs(nextState.weight - this.state.weight)) > this.sensitivity
    const tempChanged = (Math.abs(nextState.temperature - this.state.temperature) > 0.5)

    
    if (weightChanged) {
      this.emit('weightUpdated', this.setState(Object.assign({}, nextState, {pouring: true})))
    } else if (!weightChanged && this.state.pouring) {
      this.emit('weightUpdated', this.setState(Object.assign({}, nextState, {pouring: false})))
    } else if (tempChanged) {
      this.emit('temperatureUpdated', this.setState(newState))
    }
  }

  parseDataFromScale(data) {
    return JSON.parse(data.toString())
  } 

  tareScale() {
    this.port.write('x')
    this.port.write('1')
    this.port.write('x');
    this.port.write('x');
    return this
  }

  watch() {
    this.parser.on('data', data => {
        try {
          this.shouldScaleUpdate(this.parseDataFromScale(data))
        } catch(err) {
          // console.log(err)
        }
    })

    return this
  }
}

module.exports = KegScale;
