#batch.js

Batch.js provides a class for batching actions to be executed before requesting a new animation frame. 

### Normal Use

To use, intialize a new Batch instance with ``const batch = new Batch()``. Actions can be added to the batch queue via two methods:

* ``batch.queue(fn)``: Immediately adds an action to the queue. Action must be parameterless: 

	```
	batch.queue(() => {
		console.log("I executed")
	})
	```
* ``batch.add(fn)``: Returns a method that adds the specified function to the queue when called. Any arguments passed to this method will be applied to the original function when executed:

	```
	batch.add((message) => {
		console.log(message);
	})("This is my message");
	```

To execute all queued actions and request a new animation frame, call ``batch.request_frame()``;

### Sync Mode

The batch class may be used in synchronous mode by passing an optional boolean value to the constructor: ``const syncBatch = new Batch(true)`` or by setting ``batch.sync = true``. In synchrounous mode, ``request_frame()`` is called immediately when new actions are added to the queue. 

### Other methods

To manually execute all queue actions without requesting a new animation frame, call ``batch.run()``.

### Issues

See code commenting for potential issues.

