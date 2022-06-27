import { writable, type Writable, derived, type Readable, get } from 'svelte/store';
import type { Product, CartProduct } from '$types';
import _ from 'lodash';

interface CartStore {
    items: Writable<CartProduct[]>,
    info: Readable<CartInfo>,
    add: Function,
    edit: Function,
    remove: Function,
    reset: Function,
}
type CartInfo = {
    count: number,
    total: number,
}

function initialCartItems(loadFromStorage = true): CartProduct[] {
    let items = [];
    if (loadFromStorage) {
        try {
            let cartStorage: any = localStorage.getItem('cart-v2-svelte');
            cartStorage = JSON.parse(cartStorage);
            if (cartStorage) items = cartStorage;
        } catch (e) {}
    }
    return items;
}

export const items: Writable<CartProduct[]> = writable(initialCartItems(true));
export const info: Readable<CartInfo> = derived(items, ($items): CartInfo => {
    let sum = (i: number[]) => i.reduce((a: number, b: number) => a + b, 0);
    return {
        count: sum($items.map(i => i.qty)),
        total: sum($items.map(i => i.price * i.qty)),
    };
});

const save = (value: any): any => {
    try {
        localStorage.setItem('cart-v2-svelte', JSON.stringify(value));
    } catch (e) {}
    return value;
}
const updateItems = (callback: (state: CartProduct[]) => CartProduct[]): void => {
    items.update((state: CartProduct[]) => {
        return save(callback(state));
    });
};

export const add = (item: Product) => {
    let existingItem = get(items).find((cartItem: CartProduct) => cartItem.id == item.id);
    if (existingItem && typeof existingItem !== 'undefined') {
        edit(existingItem.key, {
            qty: (existingItem.qty || 0) + 1,
        });
        return;
    }
    updateItems(state => {
        let product: CartProduct = {
            ...item,
            qty: 1,
            key: `key-${item.id}-${Date.now()}`,
        };
        state.push(product);
        return state;
    });
}

export const edit = (key: string, toUpdate: any) => {
    if (typeof toUpdate?.qty !== 'undefined' && toUpdate?.qty < 1) {
        return remove(key);
    }
    updateItems(state => {
        let newItems = _.cloneDeep(state);
        newItems = newItems.map((item: CartProduct) => {
            if (item.key == key) {
                return {...item, ...toUpdate};
            }
            return item;
        });
        return newItems;
    });
}

export const remove = (key: string) => {
    updateItems(state => {
        let newItems = _.cloneDeep(state);
        newItems = newItems.filter((item: CartProduct) => {
            return (item.key !== key);
        });
        return newItems;
    });
}

export const reset = () => {
    items.set(save(initialCartItems(false)));
}

const cart: CartStore = {
    items,
    info,
    add,
    edit,
    remove,
    reset,
}
export default cart;
