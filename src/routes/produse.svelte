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
    import { Button, FloatingLabelInput, Select, EcommerceCard, Badge, Card } from 'flowbite-svelte';
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
    <!-- <h1>lista</h1> -->
    <div style="display: flex; flex-direction:row; align-items: flex-start; gap: 20px;">
        <div style="width:80%">
            {#if loading == true}
                <span>loading</span>
            {:else}
                <div use:autoAnimate class="grid grid-cols-4 gap-4">
                    {#each produse as produs}
                        <EcommerceCard
                            title={produs.title}
                            href="/produs/{produs.id}"
                            price="${produs.price}"
                            img={{ src: api.img('width:250;height:190', produs.thumbnail), alt: produs.title }}
                            stars={0}
                            btnText="Buy"
                        >
                            {produs.category}
                        </EcommerceCard>
                    {/each}
                    </div>
            {/if}
        </div>
        <div class="w-[20%]">
        <Card header="Filters">
            <form
                slot="paragraph"
                on:submit|preventDefault={applyFilters}
                style="display: flex; flex-direction:column; gap: 20px; width: 100%;"
            >
                <FloatingLabelInput label="Search" name="search" type="search" bind:value={filters.search} />
                <div>
                    <Select label="Category" name="category" bind:value={filters.category}>
                        <option value={null}>--</option>
                        {#each categorii as cat}
                            <option value={cat}>{cat}</option>
                        {/each}
                    </Select>
                </div>
                <div use:autoAnimate>
                    {#each filtersActive as badge}
                        <span style="background-color: aqua; border-radius: 6px; display: inline-block; padding: 2px 4px; margin-right: 10px">
                            {badge[0]} <b>{badge[1]}</b>
                            <span on:click={() => filters[badge[2]] = badge[2] == 'search' ? '' : null} style="cursor:pointer;">X</span>
                        </span>
                    {/each}
                </div>
                <div class="flex flex-row gap-2">
                    <Button color="light" on:click={() => resetFilters()}>Reset</Button>
                    <Button type="submit">Apply</Button>
                </div>
            </form>
        </Card>
        </div>
    </div>
</div>

<style>
    /* .content {
        width: 100%;
        max-width: var(--column-width);
        margin: var(--column-margin-top) auto 0 auto;
    } */
</style>
