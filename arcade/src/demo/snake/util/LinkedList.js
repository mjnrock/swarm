export class LinkedListNode {
	constructor(data) {
		this._data = data;
		this._previous = null;
		this._next = null;
    }
    
    get value() {
        return this._data;
    }
    set value(value) {
        this._data = value;

        return this;
    }

    get pvalue() {
        if(this._previous) {
            return this._previous.value;
        }

        return null;
    }
    get nvalue() {
        if(this._next) {
            return this._next.value;
        }

        return null;
    }
}

export default class LinkedList {
	constructor() {
        this._length = 0;        
		this._head = null;
		this._tail = null;
    }
    
    get last() {
        return this._tail;
    }
    get first() {
        return this._head;
    }

    size() {
        return this._length;
    }
	get(index) {
		let curr = this._head,
			i = 0;

		if (this._length === 0 || index < 0 || index > this._length - 1) {
			return false;
		}
		
		while (i < index) {
			curr = curr._next;
			i++;
		}
		
		return curr;
    }
    
    value(index) {
        const lln = this.get(index);

        if(lln instanceof LinkedListNode) {
            return lln.value;
        }
    }
    set(index, value) {
        const lln = this.get(index);

        if(lln instanceof LinkedListNode) {

            console.log(lln.value, value)
            lln.value = value;
            console.log(lln.value, value)
        }
    }

	add(value) {
		let node = new LinkedListNode(value);

		if(this._length > 0) {
			this._tail._next = node;
			node._previous = this._tail;
			this._tail = node;
		} else {
			this._head = node;
			this._tail = node;
		}

		this._length++;

		return this;
	}
	remove(index) {
		if (this._length === 0 || index < 0 || index > this._length - 1) {
			return false;
		}

		if(index === 0) {
			if(!this._head._next) {
				this._head = null;
				this._tail = null;
			} else {
				this._head = this._head._next;
			}
		} else if(index === this._length - 1) {
			this._tail = this._tail._previous;
		} else {
			let i = 0,
				curr = this._head;
			while(i < index) {
				curr = curr._next;
				i++;
			}
			
			curr._previous._next = curr._next;
			curr._next._previous = curr._previous;
		}
				
		this._length--;
		if(this._length === 1) {
			this._tail = this._head;
		}
		if(this._length > 0) {
			this._head._previous = null;
			this._tail._next = null;
		}


		return this;
    }
    
    each(fn, ...args) {
        let current = this._head,
            index = 0,
            arr = [];

        while(current instanceof LinkedListNode) {
            arr.push(current);
            fn(current, index, ...args);

            current = current._next;
            ++index;
        }

        return arr;
    }

    cascade(value) {
        let current = this._head;
        let temp = current.value;
        current.value = value;

        while(current instanceof LinkedListNode) {
            if(current !== this._head) {
                let temp2 = current.value;

                current.value = temp;
                temp = temp2;

                if(temp[ 0 ] === false) {
                    return this;
                }
            }

            current = current._next;
        }

        return this;
    }
}