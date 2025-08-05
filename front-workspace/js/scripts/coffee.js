function Americano(name, price, country) {
  this.name = name;
  this.price = price;
  this.country = country;

  this.drink = () => {
    console.log(`${this.name} 냠`);
  };
}