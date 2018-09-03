class User {
  
  constructor(fname,lname,age,id) {
    this._id = id;
    this._age = age;
    this._fname = fname;
    this._lname = lname;
  }
  set firstName(fname) {
    this._fname = fname;
  }
  set lastName(lname) {
    this._lname = lname;
  }
  set age(age) {
    this._age = age;
  }
  get age() {
    return this._age;
  }
  get name() {
    return `${this._fname} ${this._lname}`;
  }
  get id() {
    return `${this._id}`;
  }
}

module.exports = User;
