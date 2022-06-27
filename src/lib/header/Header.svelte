<script>
    import { page } from '$app/stores';
    import {
        Navbar,
        NavBrand,
        Dropdown,
        DropdownHeader,
        DropdownItem,
        DropdownDivider,
        NavHamburger,
        NavUl,
        NavLi,
        Button,
        Badge,
    } from 'flowbite-svelte'
    import logo from './svelte-logo.svg';
    import cart, {items as cartItems, info as cartInfo } from '$lib/cart';
    import autoAnimate from '@formkit/auto-animate';
    
    let openCart = true;
    const removeCart = (event, product) => {
        event.stopPropagation();
        cart.remove(product.key);
    }
</script>

<Navbar let:hidden let:toggle rounded={true}>
    <NavBrand href="/">
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Svelte Store
        </span>
    </NavBrand>
    <NavUl {hidden}>
        <NavLi href="/" active={$page.url.pathname === '/'} sveltekit:prefetch>
            Home
        </NavLi>
        <NavLi href="/produse" active={$page.url.pathname === '/produse'} sveltekit:prefetch>
            Produse
        </NavLi>
    </NavUl>
    <div class="flex relative">
        <Dropdown arrowIcon={false} inline={true} class="w-[400px]">
            <Button size="sm" color="light" slot="label">
                <div class="pl-4 pr-2">Cart</div>
                <Badge name="{$cartInfo.count}" />
            </Button>
            <DropdownHeader>
                Cart ({$cartInfo.count})
            </DropdownHeader>
            {#each $cartItems as product}
                <DropdownItem class="flex flex-row items-center">
                    <div class="mr-2">
                        <img src={product.thumbnail} alt=" " class="w-[60px] h-[60px] object-cover" />
                    </div>
                    <div class="flex-1 p-2">
                        {product.title}
                        <br>
                        {product.qty} x ${product.price}
                    </div>
                    <div class="p-2">
                        <Button size="sm" color="light" type="button" on:click={(event) => removeCart(event, product)}>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </Button>
                    </div>
                </DropdownItem>
            {/each}
            <DropdownDivider />
            <DropdownHeader>
                Total: ${$cartInfo.total}
            </DropdownHeader>
            <div class="p-1 text-center">
                Checkout
            </div>
        </Dropdown>
        <NavHamburger on:click={toggle} />
    </div>
</Navbar>
