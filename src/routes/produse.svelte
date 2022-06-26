<script context="module">
    import { browser } from '$app/env';
    import api from '$lib/api';
    export const hydrate = true;
    export const router = true;
    export const prerender = false;
    
    export async function load({ params }) {
        let { produse, categorii } = await api.getProducts();
        return {
            props: { produse, categorii }
        };
    }
</script>

<script>
    import autoAnimate from '@formkit/auto-animate';
    import Fuse from 'fuse.js';
    import cart from '$lib/cart';
    
    export let produse;
    const produseAll = [...produse];
    export let categorii;
    let loading = false;
    
    // init search lib
    const searchIndex = new Fuse(produse, {
        keys: [
            { name: 'title', weight: 1 },
            { name: 'description', weight: 0.5 },
        ],
    });
    
    let filters = {
        search: '',
        category: null,
    };
    
    $: filtersActive = (() => {
        let f = [];
        if (filters.search) {
            f.push(['Keyword:', filters.search, 'search']);
        }
        if (filters.category != null) {
            f.push(['Category:', filters.category, 'category']);
        }
        return f;
    })();
    
    function resetFilters() {
        filters = {
            search: '',
            category: null,
        }
        applyFilters();
    }
    async function applyFilters() {
        loading = true;
        console.log('filter apply', JSON.stringify(filters));
        // let { produse: data } = await api.getProducts();
        let data = [...produseAll];
        if (filters.search) {
            let sr = await searchIndex.search(filters.search);
            data = sr.map(({item}) => item);
        }
        if (filters.category != null) {
            data = data.filter((item) => item.category == filters.category);
        }
        produse = data;
        loading = false;
        console.log('filter results: ', data.length, filtersActive);
        return false;
    }
</script>

<svelte:head>
    <title>produse</title>
    <meta name="description" content="About this app" />
</svelte:head>

<div class="content">
    <h1>lista</h1>
    <div style="display: flex; flex-direction:row; align-items: flex-start;">
        <div style="width:80%">
            {#if loading == true}
                <span>loading</span>
            {:else}
                <div use:autoAnimate style="appearance: none; display: flex; flex-direction: row; flex-wrap: wrap; width: 100%;">
                    {#each produse as produs}
                        <div style="width: 200px; display: inline-block; border-bottom: 1px solid #ccc; margin: 10px; background: #fff;">
                            <a href="/produs/{produs.id}" style="display: flex; flex-direction: column; justify-content: center;">
                                <div style="width: 100%; text-align: center; border-bottom: 1px solid #ccc; padding: 10px;">
                                    {#if produs.thumbnail}
                                        <img src={produs.thumbnail} alt=" " style="width: 100%; height: 80px; object-fit: contain;" />
                                    {/if}
                                </div>
                                <div style="padding: 10px;">
                                    {produs.title} <br> {produs.category}
                                </div>
                            </a>
                            <div style="text-align: center; border-top: 1px solid #ccc; padding: 10px;">
                                ${produs.price} <br>
                                <button type="button" on:click={() => cart.add(produs)}>
                                    add to cart
                                </button>
                            </div>
                        </div>
                    {/each}
                    </div>
            {/if}
        </div>
        <form
            on:submit|preventDefault={applyFilters}
            style="display: flex; flex-direction:column; gap: 20px; width: 20%;"
        >
            <label>
                <b>Search</b>
                <input name="search" bind:value={filters.search} style="width:100%;" />
            </label>
            <label>
                <b>Categorie</b>
                <select name="category" bind:value={filters.category} style="width:100%;">
                    <option value={null}>--</option>
                    {#each categorii as cat}
                        <option value={cat}>{cat}</option>
                    {/each}
                </select>
            </label>
            <div use:autoAnimate>
                {#each filtersActive as badge}
                    <span style="background-color: aqua; border-radius: 6px; display: inline-block; padding: 2px 4px; margin-right: 10px">
                        {badge[0]} <b>{badge[1]}</b>
                        <span on:click={() => filters[badge[2]] = badge[2] == 'search' ? '' : null} style="cursor:pointer;">X</span>
                    </span>
                {/each}
            </div>
            <div>
                <button type="button" on:click={() => resetFilters()}>Reset</button>
                <button type="submit">Apply</button>
            </div>
        </form>
    </div>
</div>

<style>
    .content {
        width: 100%;
        max-width: var(--column-width);
        margin: var(--column-margin-top) auto 0 auto;
    }
</style>
