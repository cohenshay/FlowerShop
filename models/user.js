class User {
  constructor(id,fname, lname, address,email,contact,type, username, password,shopNumber) {
    this.id = id;  
    this.fname = fname;
    this.lname = lname;
    this.address = address; 
    this.email = email;
    this.contact = contact;
    this.type = type;
    this.username = username;
    this.password = password;
    this.shopNumber = shopNumber;
  }
  get fullname() {
    return this.fname + " " + this.lname;
  }
}

module.exports = User;
