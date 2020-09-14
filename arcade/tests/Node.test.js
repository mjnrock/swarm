import Node from "./../src/Node";

const n1 = new Node();
const n2 = new Node({
    state: {
        dog: "fish",
    }
});

n1.addReducer(state => {
    return {
        cat: 5,
    };
});

n2.addReducer(n1);

n2.next();
console.log(n1.state);
console.log(n2.state);