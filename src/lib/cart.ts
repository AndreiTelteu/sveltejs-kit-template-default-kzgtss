import { writable, type Writable, derived, type Readable, get } from 'svelte/store';
import type { Product, CartProduct } from '$types';
import _ from 'lodash';

interface CartStore {
    items: Writable<CartProduct[]>,
    count: Readable<number>,
    total: Readable<number>,
    add: Function,
    edit: Function,
    remove: Function,
    reset: Function,
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
export const count: Readable<number> = derived(items, ($items): number => {
    return $items.map(i => i.qty).reduce((a, b) => a + b, 0);
});
export const total: Readable<number> = derived(items, ($items): number => {
    return $items.map(i => i.price * i.qty).reduce((a, b) => a + b, 0);
});

const save = (value: any): any => {
    try {
        localStorage.setItem('cart-v2-svelte', JSON.stringify(value));
    } catch (e) {}
    return value;
}

export const add = (item: Product) => {
    let existingItem = get(items).find((cartItem: CartProduct) => cartItem.id == item.id);
    if (existingItem && typeof existingItem !== 'undefined') {
        edit(existingItem.key, {
            qty: (existingItem.qty || 0) + 1,
        });
        return;
    }
    items.update(state => {
        let product: CartProduct = {
            ...item,
            qty: 1,
            key: `key-${item.id}-${Date.now()}`,
        };
        state.push(product);
        return save(state);
    });
}

export const edit = (key: string, toUpdate: any) => {
    if (typeof toUpdate?.qty !== 'undefined' && toUpdate?.qty < 1) {
        return remove(key);
    }
    items.update(state => {
        let newItems = _.cloneDeep(state);
        newItems = newItems.map((item: CartProduct) => {
            if (item.key == key) {
                return {...item, ...toUpdate};
            }
            return item;
        });
        return save(newItems);
    });
}

export const remove = (key: string) => {
    items.update(state => {
        let newItems = _.cloneDeep(state);
        newItems = newItems.filter((item: CartProduct) => {
            return (item.key !== key);
        });
        return save(newItems);
    });
}

export const reset = () => {
    items.set(save(initialCartItems(false)));
}

const cart: CartStore = {
    items,
    count,
    total,
    add,
    edit,
    remove,
    reset,
}
export default cart;
