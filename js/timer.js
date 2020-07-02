/**
 * New timer function. Execute function after time
 * the new features are add time and set new time
 * Usage:
    var timer = new Timer(function() { // init timer with 5 seconds
        alert('foo');
    }, 5000);

    timer.add(2000); // add two seconds
 */

function Timer(callback, time) {
    this.setTimeout(callback, time);
    console.log(time);
}

Timer.prototype.setTimeout = function(callback, time) {
    var self = this;
    if(this.timer) {
        clearTimeout(this.timer);
    }
    this.finished = false;
    this.callback = callback;
    this.time = time;
    this.timer = setTimeout(function() {
         self.finished = true;
        callback();
    }, time);
    this.start = Date.now();
    console.log(time);
}

Timer.prototype.add = function(time) {
   if(!this.finished) {
       // add time to time left
       time = this.time - (Date.now() - this.start) + time;
       this.setTimeout(this.callback, time);
       console.log(time);
   }
}

Timer.prototype.setTime = function(time) {
    if(!this.finished) {
        this.setTimeout(this.callback, time);
        console.log(time);
    }
}

Timer.prototype.getTime = function() {
    return this.time;
}