import { writable, type Writable, get } from 'svelte/store';
import type { Product, CartProduct, Cart } from '$types';
import _ from 'lodash';

interface CartStore extends Writable<Cart> {
    add?: Function,
    edit?: Function,
    delete?: Function,
    reset?: Function,
}

function initialCart(loadFromStorage = true): Cart {
    if (loadFromStorage) {
        try {
            let cartStorage: any = localStorage.getItem('cart-svelte');
            cartStorage = JSON.parse(cartStorage);
            if (cartStorage) return cartStorage;
        } catch (e) {}
    }
    return {
        items: [],
        count: 0,
        total: 0,
    }
}

function createCart() {
	const cart: CartStore = {...writable(initialCart(true))};
    
    function refresh(state: Cart) {
        state.count = 0;
        state.total = 0;
        state.items.forEach((item: CartProduct) => {
            let qty = item.qty || 1;
            state.count += qty;
            state.total += item.price * qty;
        });
        try {
            localStorage.setItem('cart-svelte', JSON.stringify(state));
        } catch (e) {}
    }
    
    cart.add = (item: Product) => {
        let existingItem = get(cart).items.find((cartItem: CartProduct) => cartItem.id == item.id);
        if (existingItem && typeof existingItem !== 'undefined') {
            cart?.edit?.(existingItem?.key, {
                qty: (existingItem?.qty || 0) + 1,
            });
            return;
        }
        cart.update(state => {
            let product: CartProduct = {
                ...item,
                qty: 1,
                key: `ky-${item.id}-${Date.now()}`,
            };
            state.items.push(product);
            refresh(state);
            return state;
        });
    }
    
    cart.edit = (key: string, toUpdate: CartProduct) => {
        if (typeof toUpdate?.qty !== 'undefined' && toUpdate?.qty < 1) {
            return cart?.delete?.(key);
        }
        cart.update(state => {
            let items = _.cloneDeep(state.items);
            state.items = items.map((item: CartProduct) => {
                if (item.key == key) {
                    return {...item, ...toUpdate};
                }
                return item;
            });
            refresh(state);
            return state;
        });
    }
    
    cart.delete = (key: string) => {
        cart.update(state => {
            let items = _.cloneDeep(state.items);
            state.items = items.filter((item: CartProduct) => {
                return (item.key !== key);
            });
            refresh(state);
            return state;
        });
    }
    
    cart.reset = () => {
        cart.set(initialCart(false));
    }
    
	return cart;
}

export default createCart();
