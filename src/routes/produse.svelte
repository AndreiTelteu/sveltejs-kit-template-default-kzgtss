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
    }
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
        console.log('filter results: ', data.length);
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
                <ul use:autoAnimate>
                    {#each produse as produs}
                        <li>
                            <a href="/produs/{produs.id}">{produs.title} (cat: {produs.category})</a>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
        <form on:submit|preventDefault={applyFilters} class="filters" style="display: flex; flex-direction:column; gap: 20px;">
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
