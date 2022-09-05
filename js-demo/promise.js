// callback

const doSomething = (val, func) => {
  console.log(val);
  func(val + 1);
};

doSomething(0, function (result) {
  doSomething(result, function (newResult) {
    doSomething(newResult, function (finalResult) {
      console.log(result + newResult + finalResult);
    });
  });
});

// promise

const todo = (d) => {
  console.log(d);
  return d + 1;
};

const promise = new Promise((oke) => {
  const data = todo(5);
  oke(data);
});
promise
  .then((data) => {
    console.log("then1");
    return new Promise((oke) => {
      const o = todo(data);
      oke(o);
    });
  })
  .then((data) => {
    console.log("then2");
    return todo(data);
  })
  .then((data) => {
    console.log("then3");
    todo(data);
  });
