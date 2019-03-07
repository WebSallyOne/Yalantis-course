// Task 1
const users = [
    { id: 1, name: 'Bob' },
    { id: 2, name: 'Joe' },
    { id: 3, name: 'Don', groupId: 1 },
    { id: 4, name: 'Kally' },
    { name: 'Alex' },
    { name: 'John' },
];

const groups = [
    { id: 1, title: 'First Group' },
    { id: 2, title: 'Last Group' },
];

let createUser = (userInfo) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            const newID = Date.now() + Math.random().toString().slice(2);

            const newUserData = {
                id: newID,
                ...userInfo
            };

            resolve(newUserData);
        }, Math.random() * 500 + 500);
    });

let addGroup = (userInfo, groupId) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            const newUserData = {
                ...userInfo,
                groupId: groupId
            };

            resolve(newUserData);
        }, Math.random() * 500 + 500);
    });

function addSelectedGroupToUsers(users, group) {
    const usersAsPromises = users.map(async user => {
        let { id: userId = null, groupId: userGroupId = null } = user;

        const newUserInfo = { ...user }

        if (!userId) {
            Object.assign(newUserInfo, await createUser(newUserInfo));
        }

        if (!userGroupId) {
            Object.assign(newUserInfo, await addGroup(newUserInfo, group.id));
        }

        return newUserInfo;
    });

    return Promise.all(usersAsPromises)
}

addSelectedGroupToUsers(users, groups[1])
    .then(res => console.log(res))
    .catch(err => console.log(err.message))

// Task 2
const integers = () => {
    let currentValue = 0;
    return {
        next() {
            return { value: currentValue++ }
        },
        [Symbol.iterator]() { return this }
    }
}

function take(lastNumber, iterator) {
    return {
        next() {
            let { value: iteratorValue } = iterator.next();

            return {
                done: iteratorValue > lastNumber,
                value: iteratorValue
            };
        },
        [Symbol.iterator]() { return this }
    }
}

const iter = integers();

for (let i of take(3, iter)) {
    console.log(i)
};

// Task 3
const sum = (...args) =>
    args.reduce(
        (acc, el) => acc + el,
        0
    );

const multiply = (...args) =>
    args.reduce(
        (acc, el) => acc * el,
        1
    );

let closure = () => {
    let cachedActions = {};

    return (action) => (...args) => {
        const { name: actionName } = action;

        if (!cachedActions.hasOwnProperty(actionName)) {
            Object.assign(cachedActions, { [actionName]: {} });
        }

        let cachedActionsValues = cachedActions[actionName];
        let arrayAsKey = args.sort().join();

        if (!cachedActionsValues.hasOwnProperty(arrayAsKey)) {
            Object.assign(cachedActionsValues, { [arrayAsKey]: action(...args) });
        }

        return cachedActionsValues[arrayAsKey];
    }
}

let memoization = closure();

console.log(memoization(sum)(0))
console.log(memoization(sum)(0))
console.log(memoization(sum)(1, 2, 3))
console.log(memoization(sum)(3, 2, 1))
console.log(memoization(multiply)(4, 2, 3))
console.log(memoization(multiply)(3, 2, 4))