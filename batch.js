module.exports = Batch

/**
 * Batch class constructor
 * creates batch class instance
 * @class
 * @constructor
 * @param {boolean} sync option indicating that batch should flush as soon as action is added
 */
function Batch(sync) {
  if(!(this instanceof Batch)) {
    return new Batch(sync)
  }

  this.jobs = []
  this.sync = sync
  this.frame = null
  this.run = this.run.bind(this) // ISSUE: redundant statement, instance already has access to run w/ correct binding
}

/**
 * adding methods to Batch prototype
 */
Batch.prototype.request_frame = request_frame
Batch.prototype.queue = queue
Batch.prototype.add = add
Batch.prototype.run = run

/**
 * Add method
 * Returns method to enqueue action at a later time with arguments
 * @param {Function} function to be added to batch queue;
 * @returns {Function} queue method that adds function to queue with specified arguments
 */
function add(fn) {
  var queued = false
    , batch = this
    , self
    , args

  return queue
  /**
   * Queue with args function
   * Adds fn to queue with provided arguments
   * @param {*} Arguments to pass to function provided to add
   */
  function queue() {  // ISSUE: variable shadowing. Will not break code but not a great practice
    args = [].slice.call(arguments)
    self = this // ISSUE: `this` refers to the global in this context,
                // if this is what was intended it is redundant, see below
    // prevents double queue-ing
    if(!queued) {
      queued = true
      batch.queue(run)
    }
  }
  /**
   * Execute fn and set queued = false
   */
  function run() { // ISSUE: variable shadowing. Will not break code but not a great practice
    queued = false
    fn.apply(self, args) // ISSUE: redundant if `self` is intended to refer to global. Could just use `this` or null.
  }
}

/**
 * Queue method
 * Enqueues provided action
 * @param {Function} action to be executed
 */
function queue(fn) {
  this.jobs.push(fn)

  // if batch is in sync mode, automatically calls request_frame
  if(!this.sync) {
    this.request_frame()
  }
}

/**
 * Run method
 * Executes queue of actions in order
 */
function run() {
  var jobs = this.jobs

  this.jobs = []
  this.frame = null // clear current frame

  // execute actions
  for(var i = 0, l = jobs.length; i < l; ++i) {
    jobs[i]()
  }
}

/**
 * request_frame method
 * executes all actions in queue, then calls global requestAnimationFrame method
 */
function request_frame() {
  if(this.frame) {
    return
  }

  this.frame = requestAnimationFrame(this.run)
}

function requestAnimationFrame(callback) {
  var raf = global.requestAnimationFrame ||
    global.webkitRequestAnimationFrame ||
    global.mozRequestAnimationFrame ||
    timeout

  return raf(callback)

  // fallback if no global methods
  function timeout(callback) {
    return setTimeout(callback, 1000 / 60)
  }
}
