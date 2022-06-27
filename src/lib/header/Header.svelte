<script>
	import { page } from '$app/stores';
	import logo from './svelte-logo.svg';
	import cart, {items as cartItems, info as cartInfo } from '$lib/cart';
    import autoAnimate from '@formkit/auto-animate';
</script>

<header>

	<nav>
		<ul>
			<li class:active={$page.url.pathname === '/'}><a sveltekit:prefetch href="/">Home</a></li>
			<li class:active={$page.url.pathname === '/produse'}>
				<a sveltekit:prefetch href="/produse">produse</a>
			</li>
		</ul>
	</nav>

	<div class="corner">
		<!-- TODO put something else here? github link? -->
		Cart count: {$cartInfo.count}
		<div class="cart-popup">
			<p style="padding: 10px;">Cart ({$cartInfo.count})</p>
			<ul use:autoAnimate style="border-top: 1px solid #ccc; height: auto; display: flex; flex-direction: column;">
				{#each $cartItems as product}
					<li style="
						border-bottom: 1px solid #ccc; width: 100%; flex-shrink: 0;
						display: flex; flex-direction: row; align-items: center; justify: content;
					">
						<div style="padding: 10px;">
							<img src={product.thumbnail} alt=" " style="width: 60px; height: 60px;" />
						</div>
						<div style="flex: 1; padding: 10px;">
							{product.title}
							<br>
							{product.qty} x ${product.price}
							<button type="button" on:click={() => cart.edit(product.key, { qty: product.qty - 1 })}>-</button>
							<button type="button" on:click={() => cart.edit(product.key, { qty: product.qty + 1 })}>+</button>
						</div>
						<div style="padding: 10px;">
							<button type="button" on:click={() => cart.remove(product.key)}>X</button>
						</div>
					</li>
				{/each}
			</ul>
			<p style="padding: 10px;">Total: ${$cartInfo.total}</p>
		</div>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		position: relative;
		padding: 10px 20px;
	}
	.corner .cart-popup {
		position: absolute;
		width: 400px;
		height: auto;
		background-color:rgba(255, 255, 255, 0.95);
		top: 100%;
		right: 0;
		opacity: 0;
		transform: translateX(100%);
		transition: all 150ms ease-in-out;
		border: 1px solid #ccc;
	}
	.corner:hover .cart-popup {
		transform: translateX(0%);
		opacity: 1;
	}


	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.9);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
