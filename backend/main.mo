import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    volume : Nat; // in milliliters
    pricePerUnit : Nat; // price in smallest currency unit (e.g. cents)
    stockQuantity : Nat;
    isAvailable : Bool;
  };

  type OrderItem = {
    productId : Text;
    quantity : Nat;
  };

  type OrderStatus = {
    #pending;
    #confirmed;
    #delivered;
    #cancelled;
  };

  type Order = {
    orderId : Text;
    customerName : Text;
    customerContact : Text;
    items : [OrderItem];
    totalPrice : Nat;
    status : OrderStatus;
    createdAt : Int;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.id, p2.id);
    };
  };

  module CustomOrder {
    public func compare(o1 : Order, o2 : Order) : Order.Order {
      Text.compare(o1.orderId, o2.orderId);
    };
  };

  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Text, Order>();

  // Product Management
  public shared ({ caller }) func addProduct(id : Text, name : Text, description : Text, volume : Nat, pricePerUnit : Nat, stockQuantity : Nat, isAvailable : Bool) : async () {
    if (products.containsKey(id)) {
      Runtime.trap("Product with this ID already exists");
    };

    let product : Product = {
      id;
      name;
      description;
      volume;
      pricePerUnit;
      stockQuantity;
      isAvailable;
    };

    products.add(id, product);
  };

  public shared ({ caller }) func updateProduct(id : Text, name : Text, description : Text, volume : Nat, pricePerUnit : Nat, stockQuantity : Nat, isAvailable : Bool) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_product) {
        let updatedProduct : Product = {
          id;
          name;
          description;
          volume;
          pricePerUnit;
          stockQuantity;
          isAvailable;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  public query ({ caller }) func listProducts() : async [Product] {
    products.values().toArray().sort();
  };

  // Order Management
  public shared ({ caller }) func placeOrder(orderId : Text, customerName : Text, customerContact : Text, items : [OrderItem]) : async () {
    if (orders.containsKey(orderId)) {
      Runtime.trap("Order with this ID already exists");
    };

    var totalPrice = 0;
    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product with ID " # item.productId # " not found") };
        case (?product) {
          if (product.stockQuantity < item.quantity) {
            Runtime.trap("Insufficient stock for product: " # product.name);
          };
          totalPrice += product.pricePerUnit * item.quantity;
        };
      };
    };

    let newOrder : Order = {
      orderId;
      customerName;
      customerContact;
      items;
      totalPrice;
      status = #pending;
      createdAt = Time.now();
    };

    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (?product) {
          let updatedProduct : Product = {
            id = product.id;
            name = product.name;
            description = product.description;
            volume = product.volume;
            pricePerUnit = product.pricePerUnit;
            stockQuantity = product.stockQuantity - item.quantity;
            isAvailable = product.isAvailable;
          };
          products.add(item.productId, updatedProduct);
        };
        case (null) {};
      };
    };

    orders.add(orderId, newOrder);
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder : Order = {
          orderId = order.orderId;
          customerName = order.customerName;
          customerContact = order.customerContact;
          items = order.items;
          totalPrice = order.totalPrice;
          status;
          createdAt = order.createdAt;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func listOrders() : async [Order] {
    orders.values().toArray().sort();
  };
};
