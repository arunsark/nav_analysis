function resolveAfter2Seconds() {
    console.log("starting slow promise")
    return new Promise(resolve => {
      setTimeout(function() {
        resolve("slow")
        console.log("slow promise is done")
      }, 2000)
    })
}

function resolveAfter1Second() {
    console.log("starting fast promise")
    return new Promise(resolve => {
      setTimeout(function() {
        resolve("fast")
        console.log("fast promise is done")
      }, 1000)
    })
}

async function sequentialStart() {
    console.log('==SEQUENTIAL START==')

    // 1. Execution gets here almost instantly
    const slow = await resolveAfter2Seconds()
    console.log(slow) // 2. this runs 2 seconds after 1.

    const fast = await resolveAfter1Second()
    console.log(fast) // 3. this runs 3 seconds after 1.
}

async function concurrentStart() {
    console.log('==CONCURRENT START with await==');
    const slow = resolveAfter2Seconds() // starts timer immediately
    const fast = resolveAfter1Second() // starts timer immediately

    // 1. Execution gets here almost instantly
    console.log(await slow) // 2. this runs 2 seconds after 1.
    console.log(await fast) // 3. this runs 2 seconds after 1., immediately after 2., since fast is already resolved
}

function concurrentPromise() {
    console.log('==CONCURRENT START with Promise.all==')
    return Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then((messages) => {
      console.log(messages[0]) // slow
      console.log(messages[1]) // fast
    })
}


async function parallel() {
    console.log('==PARALLEL with await Promise.all==')

    // Start 2 "jobs" in parallel and wait for both of them to complete
    await Promise.all([
        (async()=>console.log(await resolveAfter2Seconds()))(),
        (async()=>console.log(await resolveAfter1Second()))()
    ])
}

//sequentialStart();
//concurrentStart();
//concurrentPromise();
parallel();

function makeRequest() {
    return new Promise((resolve) => {
        for ( var i=0; i<100000; i++ ) {

        }
        return [1,2,3];
    });
}

async function process(arrayOfPromises) {
    console.log(`process`);
    let responses = await Promise.all(arrayOfPromises);
    for(let r of responses) {
        console.log(r);
    }
    console.log(`process`);
    return responses;
}
async function handler() {
    let arrayOfPromises = [
        makeRequest(),
        makeRequest(),
        makeRequest(),
        makeRequest(),
        makeRequest(),
    ];
    let responses = process(arrayOfPromises);
    console.log(`processing is complete`);
    return responses;
}

async function run() {
    let resp = await handler();
    console.log('gone '+resp);
}
//run();
