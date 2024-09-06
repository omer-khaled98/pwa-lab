/*
Copyright 2016 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var idbApp = (function () {
  "use strict";

  // TODO 2 - check for support
  var dbPromise = idb.open("couches", 3, function (updateDb) {
    console.log("Database version:", updateDb.oldVersion);
    
    if (!updateDb.objectStoreNames.contains("products")) {
      updateDb.createObjectStore("products", { keyPath: "id" });
    }
    
    var store = updateDb.transaction.objectStore("products");
    
    if (!store.indexNames.contains("name")) {
      store.createIndex("name", "name", { unique: true });
    }
    
    if (!store.indexNames.contains("price")) {
      store.createIndex("price", "price");
    }
    
    if (!store.indexNames.contains("description")) {
      store.createIndex("description", "description");
    }
  
    // switch (updateDb.oldVersion) {
    //   case 1:
    //     // add products
    // console.log("create products collection");
    // // updateDb.createObjectStore("products", { keyPath: "id" });
    // break;
    //   case 2:
    //     console.log("create index");
    //     console.log(updateDb);
    // var store = updateDb.transaction.objectStore("products");
    
    // store.createIndex("name", "name", { unique: true });
    //     break;
    // }
  });

  function addProducts() {
    // TODO 3.3 - add objects to the products store
    dbPromise
      .then((db) => {
        var tx = db.transaction("products", "readwrite");
        var store = tx.objectStore("products");
        var items = [
          {
            name: "Couch",
            id: "cch-blk-ma",
            price: 499.99,
            color: "black",
            material: "mahogany",
            description: "A very comfy couch",
            quantity: 3,
          },
          {
            name: "Armchair",
            id: "ac-gr-pin",
            price: 299.99,
            color: "grey",
            material: "pine",
            description: "A plush recliner armchair",
            quantity: 7,
          },
          {
            name: "Stool",
            id: "st-re-pin",
            price: 59.99,
            color: "red",
            material: "pine",
            description: "A light, high-stool",
            quantity: 3,
          },
          {
            name: "Chair",
            id: "ch-blu-pin",
            price: 49.99,
            color: "blue",
            material: "pine",
            description: "A plain chair for the kitchen table",
            quantity: 1,
          },
          {
            name: "Dresser",
            id: "dr-wht-ply",
            price: 399.99,
            color: "white",
            material: "plywood",
            description: "A plain dresser with five drawers",
            quantity: 4,
          },
          {
            name: "Cabinet",
            id: "ca-brn-ma",
            price: 799.99,
            color: "brown",
            material: "mahogany",
            description: "An intricately-designed, antique cabinet",
            quantity: 11,
          },
        ];

        return Promise.all(
          items.map((item) => {
            return store.add(item);
          })
        )
          .catch((err) => {
            tx.abort();
          })
          .then(() => {
            console.log("Products added successfully");
          });
      })
      .catch((err) => {
        console.log("error create DB");
      });
  }

  function getByName(key) {
    // TODO 4.3 - use the get method to get an object by name
    return dbPromise.then((db) => {
      var tx = db.transaction("products", "readonly");
      var store = tx.objectStore("products");
      var index = store.index("name");
      return index.get(key);
    });
  }

  function displayByName() {
    var key = document.getElementById("name").value;
    if (key === "") {
      return;
    }
    var s = "";
    getByName(key)
      .then(function (object) {
        if (!object) {
          return;
        }
        console.log(object);
        s += "<h2>" + object.name + "</h2><p>";
        for (var field in object) {
          s += field + " = " + object[field] + "<br/>";
        }
        s += "</p>";
      })
      .then(function () {
        if (s === "") {
          s = "<p>No results.</p>";
        }
        document.getElementById("results").innerHTML = s;
      });
  }

// Function to get products by price range
function getByPrice() {
  var lower = parseFloat(document.getElementById("priceLower").value) || 0;
  var upper = parseFloat(document.getElementById("priceUpper").value) || Infinity;

  return dbPromise.then((db) => {
    var tx = db.transaction("products", "readonly");
    var store = tx.objectStore("products");
    var index = store.index("price");
    var range = IDBKeyRange.bound(lower, upper, true, true);
    return index.openCursor(range);
  });
  // return dbPromise.then((db) => {
  //   var tx = db.transaction("products", "readonly");
  //   var store = tx.objectStore("products");
  //   var index = store.index("name");
  //   return index.get(key);
  // });
}

// Function to display products by price range
function displayByPrice(key) {
  
  var s = "";
  getByPrice(key)
    .then(function (object) {
      if (!object) {
        return;
      }
      console.log(object);
      let x = object._request.result.value
      console.log(x);
      
      s += "<h2>" + x.name + "</h2><p>";
      for (var field in x) {
        s += field + " = " + x[field] + "<br/>";
      }
      s += "</p>";
    })
    .then(function () {
      if (s === "") {
        s = "<p>No results.</p>";
      }
      document.getElementById("results").innerHTML = s;
    });
}

// Function to get products by description
function getByDesc(key) {
  return dbPromise.then((db) => {
    var tx = db.transaction("products", "readonly");
    var store = tx.objectStore("products");
    var index = store.index("description");
    return index.get(key);
  });
}

// Function to display products by description
function displayByDesc() {
  var key = document.getElementById("desc").value;
  console.log(key);
  
  if (key === "") {
    return;
  }
  var s = "";
  getByDesc(key)
    .then(function (object) {
      if (!object) {
        return;
      }
      console.log(object);
      s += "<h2>" + object.name + "</h2><p>";
      for (var field in object) {
        s += field + " = " + object[field] + "<br/>";
      }
      s += "</p>";
    })
    .then(function () {
      if (s === "") {
        s = "<p>No results.</p>";
      }
      document.getElementById("results").innerHTML = s;
    });
}

  
    
  function addOrders() {
    // TODO 5.2 - add items to the 'orders' object store
  }

  //1)get orders
  //2)products
  //3)decrement products
  //4)update products

  function showOrders() {}

  function getOrders() {
    // TODO 5.4 - get all objects from 'orders' object store
  }

  function fulfillOrders() {
    //get orders
    //quantity
    //process order
    //update products
  }

  function processOrders(orders) {
    // TODO 5.5 - get items in the 'products' store matching the orders
  }

  function decrementQuantity(product, order) {
    // TODO 5.6 - check the quantity of remaining products
  }

  function updateProductsStore(products) {
    // TODO 5.7 - update the items in the 'products' object store
  }

  return {
    dbPromise: dbPromise,
    addProducts: addProducts,
    getByName: getByName,
    displayByName: displayByName,
    getByPrice: getByPrice,
    displayByPrice:displayByPrice,
    getByDesc: getByDesc,
    displayByDesc:displayByDesc,
    addOrders: addOrders,
    showOrders: showOrders,
    getOrders: getOrders,
    fulfillOrders: fulfillOrders,
    processOrders: processOrders,
    decrementQuantity: decrementQuantity,
    updateProductsStore: updateProductsStore,
  };
})();
